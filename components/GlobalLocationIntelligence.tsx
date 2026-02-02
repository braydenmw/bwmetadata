import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Globe, Landmark, Target, ArrowLeft, Download, Database, Users, TrendingUp, Plane, Ship, Zap, Calendar, Newspaper, ExternalLink, MapPin, Clock, DollarSign, Briefcase, GraduationCap, Factory, Activity, ChevronDown, ChevronUp, FileText, Award, History, Rocket, Search, Loader2, AlertCircle, CheckCircle2, BookOpen, Link2, BarChart3, Shield, Building2, AlertTriangle, Leaf, Scale, TrendingDown, Info } from 'lucide-react';
import { CITY_PROFILES, type CityLeader, type CityProfile } from '../data/globalLocationProfiles';
import { getCityProfiles, searchCityProfiles } from '../services/globalLocationService';
import { multiSourceResearch, type ResearchProgress, type MultiSourceResult, type SourceCitation, type SimilarCity } from '../services/multiSourceResearchService_v2';
import { fetchGovernmentLeaders, getRegionalComparisons, type GovernmentLeader, type RegionalComparisonSet } from '../services/governmentDataService';

// Helper components declared outside main component to avoid re-creation on render
const ScoreBar: React.FC<{ label: string; value: number; max?: number }> = ({ label, value, max = 100 }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px]">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200">{value}/{max}</span>
    </div>
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: 'connected' | 'pending' | 'offline' }> = ({ status }) => {
  const colors = {
    connected: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    pending: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    offline: 'bg-red-500/20 text-red-300 border-red-500/40'
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ProjectBadge: React.FC<{ status: 'completed' | 'ongoing' | 'planned' }> = ({ status }) => {
  const colors = {
    completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    ongoing: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    planned: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  };
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; color?: string }> = ({ icon: Icon, title, color = 'text-amber-400' }) => (
  <div className="flex items-center gap-3 mb-4">
    <Icon className={`w-5 h-5 ${color}`} />
    <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
  </div>
);

const buildNarrative = (profile: CityProfile) => {
  // Check if we have live Wikipedia data (stored in _rawWikiExtract) - reserved for future use
  const _wikiExtract = (profile as unknown as { _rawWikiExtract?: string })._rawWikiExtract;
  void _wikiExtract; // Will be used for enhanced narratives
  
  const knownFor = profile.knownFor?.slice(0, 3).join(', ') || 'strategic trade and regional services';
  const sectors = profile.keySectors?.slice(0, 4).join(', ') || 'diversified commerce and services';
  const access = profile.globalMarketAccess || 'regional corridors and maritime routes';
  const established = profile.established || 'historical settlement period';
  const climate = profile.climate || 'regional climate zone';
  const population = profile.demographics?.population || 'verified population baseline';
  const gdp = profile.economics?.gdpLocal || 'local GDP baseline';
  const trade = profile.economics?.tradePartners?.slice(0, 3).join(', ') || 'regional trade partners';

  const overview = [
    `${profile.city} anchors ${profile.region} as a strategic urban node within ${profile.country}. Established ${established}, the city evolved around ${knownFor}, creating a durable economic base that continues to shape investment priorities and governance focus today.`,
    `The city’s modern economy is driven by ${sectors}, supported by access to ${access}. This access underpins trade and logistics viability, while the local climate (${climate}) influences infrastructure resilience planning and long-term development sequencing.`,
    `Current macro indicators—including population ${population} and GDP ${gdp}—frame the capacity of the local market and workforce, while trade relationships with ${trade} provide external demand signals that validate opportunity sizing.`
  ];

  const historical = [
    `Historically, ${profile.city} grew as a regional interchange point, shaped by governance reforms, commercial expansion, and infrastructure investments that tied it to wider national priorities. These historical phases created today’s institutional footprint across ports, trade corridors, and civic administration.`,
    `The city’s evolution has produced layered administrative capabilities that now influence permitting speed, public-private partnership readiness, and the reliability of long-term policy execution. This history matters because it explains why present-day outcomes are feasible within existing local institutions.`,
    `Taken together, the historical arc supports a defensible thesis: ${profile.city} has repeatedly converted strategic geography into sustained economic utility—a core prerequisite for regional investment and partnership alignment.`
  ];

  return { overview, historical };
};

const buildStaticMapUrl = (lat: number, lon: number, zoom: number, width = 650, height = 450) =>
  `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lon},red-pushpin`;

interface GlobalLocationIntelligenceProps {
  onBack?: () => void;
  onOpenCommandCenter?: () => void;
}

const GlobalLocationIntelligence: React.FC<GlobalLocationIntelligenceProps> = ({ onBack, onOpenCommandCenter }) => {
  // Core state - starts EMPTY, no pre-selection
  const [profiles, setProfiles] = useState<CityProfile[]>(CITY_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeLeader, setActiveLeader] = useState<CityLeader | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityProfile[]>([]);
  const [hasSelection, setHasSelection] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Live research state
  const [isResearching, setIsResearching] = useState(false);
  const [researchProgress, setResearchProgress] = useState<ResearchProgress | null>(null);
  const [liveProfile, setLiveProfile] = useState<CityProfile | null>(null);
  const [researchResult, setResearchResult] = useState<MultiSourceResult | null>(null);
  
  // Government data state
  const [governmentLeaders, setGovernmentLeaders] = useState<GovernmentLeader[]>([]);
  const [isLoadingGovernmentData, setIsLoadingGovernmentData] = useState(false);
  const [regionalComparisons, setRegionalComparisons] = useState<RegionalComparisonSet | null>(null);
  const [isLoadingComparisons, setIsLoadingComparisons] = useState(false);
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    economy: true,
    infrastructure: true,
    demographics: true,
    leadership: true,
    live: true,
    sources: true,
    similar: true,
    narratives: true,
    regional: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle search results filtering
  useEffect(() => {
    const runSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await searchCityProfiles(searchQuery);
      setSearchResults(results);
    };
    runSearch();
  }, [searchQuery]);

  // Get active profile (either from existing data or live research)
  const activeProfile = useMemo(() => {
    if (liveProfile && hasSelection && !activeProfileId) {
      return liveProfile;
    }
    if (!activeProfileId) return null;
    return profiles.find(profile => profile.id === activeProfileId) || null;
  }, [activeProfileId, profiles, liveProfile, hasSelection]);

  const leadershipRanking = useMemo(() => {
    if (!activeProfile?.leaders?.length) return [];
    return [...activeProfile.leaders].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [activeProfile]);

  const internationalLead = useMemo(() => {
    if (!leadershipRanking.length) return null;
    return leadershipRanking.find(l => l.internationalEngagementFocus) || leadershipRanking[0];
  }, [leadershipRanking]);

  const keyOfficials = useMemo(() => {
    const officials: Array<{
      name: string;
      role: string;
      tenure?: string;
      sourceUrl?: string;
      verified?: boolean;
      sourceLabel?: string;
    }> = [];

    if (governmentLeaders?.length) {
      governmentLeaders.forEach((leader) => {
        if (!leader?.name || !leader?.role) return;
        officials.push({
          name: leader.name,
          role: leader.role,
          tenure: leader.tenure,
          sourceUrl: leader.sourceUrl,
          verified: leader.verified,
          sourceLabel: leader.website
        });
      });
    }

    if (activeProfile?.leaders?.length) {
      activeProfile.leaders.forEach((leader) => {
        if (!leader?.name || !leader?.role) return;
        officials.push({
          name: leader.name,
          role: leader.role,
          tenure: leader.tenure,
          sourceUrl: leader.sourceUrl,
          verified: leader.photoVerified
        });
      });
    }

    const priorityRoles = ['mayor', 'governor', 'senator', 'president', 'premier', 'minister', 'secretary', 'chair', 'commissioner'];
    const seen = new Set<string>();

    const normalized = officials
      .map((o) => ({
        ...o,
        roleLower: o.role?.toLowerCase() || ''
      }))
      .filter((o) => {
        const key = `${o.name}-${o.role}`.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    const prioritized = normalized.filter((o) =>
      priorityRoles.some((role) => o.roleLower.includes(role))
    );

    return (prioritized.length ? prioritized : normalized).slice(0, 6);
  }, [governmentLeaders, activeProfile]);

  const safetyProxyScore = useMemo(() => {
    if (!activeProfile) return null;
    const stability = activeProfile.politicalStability ?? 50;
    const reg = activeProfile.regulatoryFriction ?? 50;
    return Math.round((stability * 0.6) + ((100 - reg) * 0.4));
  }, [activeProfile]);

  const outlookLabel = useMemo(() => {
    if (!activeProfile) return 'Not available';
    const momentum = activeProfile.investmentMomentum ?? 0;
    if (momentum >= 70) return 'Accelerating';
    if (momentum >= 55) return 'Stable';
    return 'Developing';
  }, [activeProfile]);

  // Handle search submission - LIVE SEARCH
  const handleSearchSubmit = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // ALWAYS do live research - never use static placeholder data
    setHasSelection(true);
    setActiveProfileId(null);
    setLiveProfile(null);
    setResearchResult(null);
    setSearchQuery('');
    setSearchResults([]);
    setLoadingError(null);
    setIsResearching(true);
    setResearchProgress({ stage: 'Initializing', progress: 0, message: 'Starting multi-source research...' });
    
    try {
      // Use multi-source research - GOOGLE, WORLD BANK, GOVERNMENT SOURCES
      const result = await multiSourceResearch(trimmedQuery, (progress) => {
        setResearchProgress(progress);
      });
      
      if (result) {
        setLiveProfile(result.profile);
        setResearchResult(result);
        setResearchProgress({ stage: 'Complete', progress: 100, message: `Research complete! ${result.sources.length} sources compiled.` });
      } else {
        setLoadingError(`Could not find location "${trimmedQuery}". Please try a different search term.`);
        setHasSelection(false);
      }
    } catch (error) {
      console.error('Multi-source research error:', error);
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
      if (isNetworkError || !navigator.onLine) {
        setLoadingError('Unable to connect to research services. Please check your internet connection.');
      } else {
        setLoadingError('Research failed. Please try again.');
      }
      setHasSelection(false);
    } finally {
      setIsResearching(false);
    }
  }, []);

  // Load existing profiles and check for cached research results
  useEffect(() => {
    const loadProfiles = async () => {
      const data = await getCityProfiles();
      setProfiles(data);
      
      // Check for CACHED research result FIRST (highest priority - prevents duplicate research)
      const cachedResearch = localStorage.getItem('gli-cached-research');
      const target = localStorage.getItem('gli-target');
      
      if (cachedResearch && target) {
        try {
          const result = JSON.parse(cachedResearch);
          if (result && result.profile) {
            // Use cached result - NO NEW RESEARCH NEEDED
            setHasSelection(true);
            setLiveProfile(result.profile);
            setResearchResult(result);
            setSearchQuery('');
            setSearchResults([]);
            setResearchProgress({ stage: 'Complete', progress: 100, message: `Report loaded from cache: ${result.sources.length} sources.` });
            
            // Clean up cache keys after using them
            localStorage.removeItem('gli-target');
            localStorage.removeItem('gli-cached-research');
            
            return; // EXIT - DON'T DO NEW RESEARCH
          }
        } catch (e) {
          console.warn('Failed to parse cached research:', e);
          // Fall through to normal search
        }
      }
      
      // Fallback: if no cached result, search using gli-target location name
      if (target) {
        localStorage.removeItem('gli-target');
        localStorage.removeItem('gli-cached-research');
        setTimeout(() => {
          handleSearchSubmit(target);
        }, 0);
      }
    };
    loadProfiles();
  }, [handleSearchSubmit]);


  // Clear selection and reset to global view
  const handleClearSelection = () => {
    setActiveProfileId(null);
    setHasSelection(false);
    setLiveProfile(null);
    setResearchResult(null);
    setIsResearching(false);
    setResearchProgress(null);
    setLoadingError(null);
    setGovernmentLeaders([]);
    setRegionalComparisons(null);
  };

  // Auto-scroll to top when a profile is selected
  useEffect(() => {
    if (hasSelection && activeProfile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hasSelection, activeProfile]);

  // Fetch real-time government data and regional comparisons when profile is selected
  useEffect(() => {
    if (!activeProfile) return;

    const fetchEnrichedData = async () => {
      try {
        // Fetch current government leaders
        setIsLoadingGovernmentData(true);
        const leaders = await fetchGovernmentLeaders(activeProfile.city, activeProfile.country);
        setGovernmentLeaders(leaders);
      } catch (error) {
        console.error('Error fetching government leaders:', error);
      } finally {
        setIsLoadingGovernmentData(false);
      }

      try {
        // Fetch regional comparisons
        setIsLoadingComparisons(true);
        const nearbyLocations = profiles.filter(
          p => p.region === activeProfile.region && p.id !== activeProfile.id
        );
        
        if (nearbyLocations.length > 0) {
          const comparisons = await getRegionalComparisons(activeProfile, nearbyLocations);
          setRegionalComparisons(comparisons);
        }
      } catch (error) {
        console.error('Error fetching regional comparisons:', error);
      } finally {
        setIsLoadingComparisons(false);
      }
    };

    fetchEnrichedData();
  }, [activeProfile, profiles]);

  const computeCompositeScore = (profile: CityProfile | Partial<CityProfile>) => {
    if (!profile.infrastructureScore) return 0;
    const normalizedCost = 100 - Math.min(profile.costOfDoing || 50, 100);
    const normalizedReg = 100 - Math.min(profile.regulatoryFriction || 50, 100);
    const score = (
      (profile.infrastructureScore || 50) * 0.2 +
      normalizedReg * 0.2 +
      (profile.politicalStability || 50) * 0.15 +
      (profile.laborPool || 50) * 0.15 +
      normalizedCost * 0.15 +
      (profile.investmentMomentum || 50) * 0.15
    );
    return Math.round(score);
  };

  const deriveNeeds = (profile: CityProfile) => {
    const needs: string[] = [];
    if (profile.infrastructureScore < 70) needs.push('Infrastructure modernization and utilities reliability upgrades');
    if (profile.regulatoryFriction > 50) needs.push('Permitting acceleration and regulatory simplification');
    if (profile.laborPool < 65) needs.push('Workforce development and vocational pipeline expansion');
    if (profile.investmentMomentum < 65) needs.push('Investor outreach, incentives packaging, and deal facilitation');
    if (profile.costOfDoing > 60) needs.push('Cost optimization offsets or targeted incentive relief');
    if (needs.length === 0) needs.push('Maintain momentum; prioritize strategic partnerships and regional expansion');
    return needs;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCityBrief = (profile: CityProfile) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${profile.city} Intelligence Brief</title>
<style>
body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; }
h1 { margin-bottom: 4px; }
h2 { margin-top: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
ul { margin: 0 0 12px 16px; }
.meta { color: #475569; font-size: 14px; }
.badge { display: inline-block; background: #fbbf24; color: #000; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; }
.section { margin-bottom: 20px; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; }
th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; font-size: 13px; }
th { background: #f1f5f9; }
</style>
</head>
<body>
  <h1>${profile.city} Intelligence Brief</h1>
  <div class="meta">${profile.region} · ${profile.country}</div>
  <div class="meta">Established: ${profile.established} | Timezone: ${profile.timezone || 'N/A'}</div>
  <p class="badge">Composite Score: ${computeCompositeScore(profile)} / 100</p>
  
  <h2>Quick Facts</h2>
  <table>
    <tr><th>Area</th><td>${profile.areaSize || 'N/A'}</td><th>Climate</th><td>${profile.climate || 'N/A'}</td></tr>
    <tr><th>Currency</th><td>${profile.currency || 'N/A'}</td><th>Business Hours</th><td>${profile.businessHours || 'N/A'}</td></tr>
  </table>

  <h2>Known For</h2>
  <ul>${profile.knownFor.map(item => `<li>${item}</li>`).join('')}</ul>
  
  <h2>Strategic Advantages</h2>
  <ul>${profile.strategicAdvantages.map(item => `<li>${item}</li>`).join('')}</ul>
  
  <h2>Key Sectors</h2>
  <ul>${profile.keySectors.map(item => `<li>${item}</li>`).join('')}</ul>
  
  <h2>Investment Programs</h2>
  <ul>${profile.investmentPrograms.map(item => `<li>${item}</li>`).join('')}</ul>
  
  <h2>Foreign Companies Present</h2>
  <ul>${profile.foreignCompanies.map(item => `<li>${item}</li>`).join('')}</ul>

  ${profile.economics ? `
  <h2>Economic Data</h2>
  <table>
    <tr><th>Local GDP</th><td>${profile.economics.gdpLocal || 'N/A'}</td></tr>
    <tr><th>GDP Growth</th><td>${profile.economics.gdpGrowthRate || 'N/A'}</td></tr>
    <tr><th>Employment Rate</th><td>${profile.economics.employmentRate || 'N/A'}</td></tr>
    <tr><th>Average Income</th><td>${profile.economics.avgIncome || 'N/A'}</td></tr>
    <tr><th>Export Volume</th><td>${profile.economics.exportVolume || 'N/A'}</td></tr>
    <tr><th>Top Exports</th><td>${profile.economics.topExports?.join(', ') || 'N/A'}</td></tr>
    <tr><th>Trade Partners</th><td>${profile.economics.tradePartners?.join(', ') || 'N/A'}</td></tr>
  </table>
  ` : ''}

  ${profile.demographics ? `
  <h2>Demographics</h2>
  <table>
    <tr><th>Population</th><td>${profile.demographics.population}</td></tr>
    <tr><th>Population Growth</th><td>${profile.demographics.populationGrowth || 'N/A'}</td></tr>
    <tr><th>Median Age</th><td>${profile.demographics.medianAge || 'N/A'}</td></tr>
    <tr><th>Literacy Rate</th><td>${profile.demographics.literacyRate || 'N/A'}</td></tr>
    <tr><th>Working Age Population</th><td>${profile.demographics.workingAgePopulation || 'N/A'}</td></tr>
    <tr><th>Universities/Colleges</th><td>${profile.demographics.universitiesColleges || 'N/A'}</td></tr>
    <tr><th>Graduates/Year</th><td>${profile.demographics.graduatesPerYear || 'N/A'}</td></tr>
  </table>
  ` : ''}

  <h2>Leadership</h2>
  <ul>${profile.leaders.map(leader => `<li><strong>${leader.role}:</strong> ${leader.name} (${leader.tenure}) - Rating: ${leader.rating.toFixed(1)}/10</li>`).join('')}</ul>

  ${profile.taxIncentives ? `
  <h2>Tax Incentives</h2>
  <ul>${profile.taxIncentives.map(item => `<li>${item}</li>`).join('')}</ul>
  ` : ''}

  <h2>Government Sources</h2>
  <ul>${profile.governmentLinks?.map(link => `<li><a href="${link.url}">${link.label}</a></li>`).join('') || 'N/A'}</ul>

  <hr style="margin-top: 40px;">
  <p style="font-size: 11px; color: #64748b;">Generated by BW Nexus AI Global Location Intelligence | ${new Date().toISOString()}</p>
</body>
</html>`;
    downloadFile(html, `${profile.city}-intelligence-brief.html`, 'text/html');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400">Global Location Intelligence</p>
            <h1 className="text-2xl font-semibold">Location Intelligence Report</h1>
          </div>
          <div className="flex gap-2">
            {onOpenCommandCenter && (
              <button
                onClick={onOpenCommandCenter}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-white/20 rounded-lg hover:border-amber-400 hover:text-amber-300"
              >
                Command Center
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-200 border border-amber-500/40 rounded-lg hover:bg-amber-500/30"
              >
                <ArrowLeft className="inline w-3 h-3 mr-2" /> Back to OS
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search Bar */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <label className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                <Search className="inline w-3 h-3 mr-1" />
                Search Any Location Worldwide
              </label>
              <div className="mt-2 relative">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSearchSubmit(searchQuery);
                    }
                  }}
                  placeholder="Enter any city, region, or country (e.g., Tokyo, Paris, Sydney, Manila)..."
                  className="w-full px-4 py-3 text-sm rounded-lg border border-white/10 bg-black/40 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  disabled={isResearching}
                />
                <button
                  onClick={() => handleSearchSubmit(searchQuery)}
                  disabled={!searchQuery.trim() || isResearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Research'}
                </button>
                {searchResults.length > 0 && !isResearching && (
                  <div className="absolute z-10 mt-2 w-full bg-[#0a0a0a] border border-white/10 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    <div className="px-3 py-2 text-[10px] uppercase text-slate-500 border-b border-white/10">
                      Matching Locations (Click to research live)
                    </div>
                    {searchResults.map(result => (
                      <button
                        key={result.id}
                        onClick={() => handleSearchSubmit(`${result.city}, ${result.country}`)}
                        className="w-full text-left px-4 py-3 hover:bg-amber-500/10 border-b border-white/5 last:border-b-0"
                      >
                        <div className="text-white font-semibold">{result.city}</div>
                        <div className="text-[11px] text-slate-400">{result.region} · {result.country}</div>
                      </button>
                    ))}
                    <button
                      onClick={() => handleSearchSubmit(searchQuery)}
                      className="w-full text-left px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
                    >
                      <div className="font-semibold">🔍 Research "{searchQuery}" with AI Agent</div>
                      <div className="text-[10px] text-purple-400">Search globally for any location not in database</div>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-slate-500">
              {isResearching
                ? <span className="text-purple-400 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> AI Agent researching...</span>
                : hasSelection && activeProfile
                  ? <span className="text-emerald-400">✓ Viewing: {activeProfile.city}, {activeProfile.country}</span>
                  : 'Enter any location worldwide to generate intelligence report'}
            </div>
          </div>
          {hasSelection && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={handleClearSelection}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Clear Selection & Search New Location
              </button>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {loadingError && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-red-300 font-semibold mb-1">Connection Error</div>
              <div className="text-sm text-red-200/80">{loadingError}</div>
              {!navigator.onLine && (
                <div className="mt-2 text-xs text-red-300/60 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  You appear to be offline. Global Location Intelligence requires internet connection.
                </div>
              )}
            </div>
            <button
              onClick={() => setLoadingError(null)}
              className="text-red-400 hover:text-red-300 text-xs px-3 py-1 border border-red-500/40 rounded-lg hover:bg-red-500/20"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Map Section - Dynamic Focus */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold">
                {hasSelection && activeProfile 
                  ? `${activeProfile.city} - Regional View` 
                  : 'Global Map - Select or Search a Location'}
              </h2>
            </div>
            {hasSelection && activeProfile && (
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span><MapPin className="inline w-3 h-3 mr-1" />{activeProfile.latitude?.toFixed(4) || 'N/A'}, {activeProfile.longitude?.toFixed(4) || 'N/A'}</span>
                <span><Clock className="inline w-3 h-3 mr-1" />{activeProfile.timezone || 'N/A'}</span>
              </div>
            )}
          </div>
          {/* Static Map - Single Regional View */}
          <div className="mb-4">
            {activeProfile?.latitude && activeProfile?.longitude ? (
              <div className="h-[260px] rounded-xl border border-slate-800 overflow-hidden bg-slate-900 relative">
                <img
                  src={buildStaticMapUrl(activeProfile.latitude, activeProfile.longitude, 10, 900, 260)}
                  alt={`Map of ${activeProfile.city}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/900x260?text=Map+Unavailable';
                  }}
                />
                <div className="absolute top-3 left-3 bg-black/70 text-[10px] text-slate-200 px-2 py-1 rounded flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> {activeProfile.city}, {activeProfile.country}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-[10px] text-slate-200 px-2 py-1 rounded">
                  {activeProfile.latitude?.toFixed(4)}°, {activeProfile.longitude?.toFixed(4)}°
                </div>
              </div>
            ) : (
              <div className="h-[180px] rounded-xl border border-slate-800 overflow-hidden bg-slate-900 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Search for a location to view map</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Research Progress Panel */}
        {isResearching && researchProgress && (
          <div className="bg-[#0f0f0f] border border-purple-500/30 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Database className="w-5 h-5 text-purple-400" />
                  <Loader2 className="w-3 h-3 text-purple-300 absolute -bottom-1 -right-1 animate-spin" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-purple-300">Deep Research in Progress</h2>
                  <p className="text-xs text-slate-400">{researchProgress?.message || 'Researching...'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{Math.round(researchProgress?.progress || 0)}%</div>
                <div className="text-[10px] text-slate-400 uppercase">{researchProgress?.stage || 'initializing'}</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-500"
                style={{ width: `${researchProgress?.progress || 0}%` }}
              />
            </div>
            
            {/* Research Stages */}
            <div className="grid md:grid-cols-6 gap-2 mb-4">
              {['Initializing Research', 'Gathering Intelligence', 'Leadership Research', 'Economic Analysis', 'News & Developments', 'Compiling Report'].map((stage, idx) => {
                const stages = ['Initializing Research', 'Gathering Intelligence', 'Leadership Research', 'Economic Analysis', 'News & Developments', 'Compiling Report', 'Comparative Analysis', 'Complete'];
                const currentIdx = stages.findIndex(s => researchProgress?.stage?.includes(s.split(' ')[0]) || researchProgress?.stage === s);
                const stageStatus = idx < currentIdx ? 'complete' : idx === currentIdx ? 'active' : 'pending';
                return (
                  <div 
                    key={stage}
                    className={`p-2 rounded-lg border text-xs text-center ${
                      stageStatus === 'complete'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : stageStatus === 'active'
                          ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                          : 'border-slate-700 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {stageStatus === 'complete' && <CheckCircle2 className="w-3 h-3" />}
                      {stageStatus === 'active' && <Loader2 className="w-3 h-3 animate-spin" />}
                      {stageStatus === 'pending' && <Clock className="w-3 h-3" />}
                      <span className="text-[10px]">{stage.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Research Status */}
            <div className="bg-black/40 rounded-lg p-3 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">●</span>
                <span>Searching government websites, World Bank, and official sources...</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-blue-400">●</span>
                <span>Cross-referencing data from international organizations</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-amber-400">●</span>
                <span>Compiling verified economic data and leadership profiles</span>
              </div>
              {researchProgress?.substage && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-purple-400">→</span>
                  <span className="text-purple-300">Currently: {researchProgress.substage}</span>
                </div>
              )}
              {researchProgress?.sourcesFound && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-cyan-300">{researchProgress.sourcesFound} authoritative sources found</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State - No Selection */}
        {!hasSelection && !isResearching && (
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-12 mb-6 text-center">
            <Globe className="w-16 h-16 text-amber-400/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Global Location Intelligence</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-6">
              Search for any location worldwide to generate a comprehensive intelligence report. 
              Our AI agent will research leadership, economy, infrastructure, demographics, and more.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="text-[11px] px-3 py-1.5 bg-slate-800 rounded-full text-slate-300">🇵🇭 Philippines</span>
              <span className="text-[11px] px-3 py-1.5 bg-slate-800 rounded-full text-slate-300">🇦🇺 Australia</span>
              <span className="text-[11px] px-3 py-1.5 bg-slate-800 rounded-full text-slate-300">🇯🇵 Japan</span>
              <span className="text-[11px] px-3 py-1.5 bg-slate-800 rounded-full text-slate-300">🇺🇸 USA</span>
              <span className="text-[11px] px-3 py-1.5 bg-slate-800 rounded-full text-slate-300">🇬🇧 UK</span>
              <span className="text-[11px] px-3 py-1.5 bg-slate-800 rounded-full text-slate-300">🇩🇪 Germany</span>
              <span className="text-[11px] px-3 py-1.5 bg-slate-800 rounded-full text-slate-300">🌍 Any Location</span>
            </div>
            
            {/* Quick Access to Existing Profiles */}
            {profiles.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-4">Quick Access: Search Locations</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {profiles.slice(0, 6).map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => handleSearchSubmit(`${profile.city}, ${profile.country}`)}
                      className="px-4 py-2 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 text-amber-300"
                    >
                      {profile.city}, {profile.country}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {hasSelection && activeProfile ? (
          <div className="space-y-8">
            {/* Simple Document Header */}
            <div className="border-b border-slate-700 pb-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{activeProfile.city}, {activeProfile.country}</h1>
                  <p className="text-slate-400">{activeProfile.region}</p>
                  <p className="text-sm text-slate-500 mt-1">Report generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <button
                  onClick={() => exportCityBrief(activeProfile)}
                  className="px-4 py-2 text-sm bg-slate-800 border border-slate-600 text-slate-200 rounded hover:bg-slate-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export Report
                </button>
              </div>
            </div>

            {/* About This Location */}
            <section>
              <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">About {activeProfile.city}</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  {activeProfile.city} is located in {activeProfile.region}, {activeProfile.country}. 
                  {activeProfile.established && ` Established ${activeProfile.established}.`}
                  {activeProfile.demographics?.population && ` The city has a population of ${activeProfile.demographics.population}.`}
                </p>
                {activeProfile.knownFor && activeProfile.knownFor.length > 0 && (
                  <p>The city is known for {activeProfile.knownFor.slice(0, 3).join(', ')}.</p>
                )}
                {activeProfile.keySectors && activeProfile.keySectors.length > 0 && (
                  <p>Key economic sectors include {activeProfile.keySectors.slice(0, 4).join(', ')}.</p>
                )}
              </div>
            </section>

            {/* Location Map */}
            {activeProfile.latitude && activeProfile.longitude && (
              <section>
                <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Location</h2>
                <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-900 relative">
                  <img
                    src={buildStaticMapUrl(activeProfile.latitude, activeProfile.longitude, 10, 900, 280)}
                    alt={`Map of ${activeProfile.city}`}
                    className="w-full h-[280px] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/900x280?text=Map+Unavailable';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-black/70 text-xs text-slate-200 px-3 py-1.5 rounded flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {activeProfile.city}, {activeProfile.country}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-xs text-slate-200 px-3 py-1.5 rounded">
                    {activeProfile.latitude.toFixed(4)}°, {activeProfile.longitude.toFixed(4)}°
                  </div>
                </div>
              </section>
            )}

            {/* Quick Facts */}
            <section>
              <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Quick Facts</h2>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Location</span>
                  <span className="text-white">{activeProfile.latitude?.toFixed(4)}°, {activeProfile.longitude?.toFixed(4)}°</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Timezone</span>
                  <span className="text-white">{activeProfile.timezone || 'Not available'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Climate</span>
                  <span className="text-white">{activeProfile.climate || 'Not available'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Currency</span>
                  <span className="text-white">{activeProfile.currency || 'Not available'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Area</span>
                  <span className="text-white">{activeProfile.areaSize || 'Not available'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Business Hours</span>
                  <span className="text-white">{activeProfile.businessHours || '8:00 AM - 5:00 PM'}</span>
                </div>
              </div>
            </section>

            {/* Government & Leadership */}
            <section>
              <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Government & Leadership</h2>
              {activeProfile.leaders && activeProfile.leaders.length > 0 ? (
                <div className="space-y-3">
                  {activeProfile.leaders.slice(0, 4).map((leader, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-2 cursor-pointer hover:bg-slate-800/50 rounded-lg px-2 -mx-2" onClick={() => setActiveLeader(leader)}>
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-300">
                        {leader.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-white">{leader.name}</div>
                        <div className="text-sm text-slate-400">{leader.role}</div>
                        {leader.tenure && <div className="text-xs text-slate-500">{leader.tenure}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">Leadership information not yet available for this location.</p>
              )}
              
              {activeProfile.departments && activeProfile.departments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-slate-200 mb-3">Government Departments</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {activeProfile.departments.map((dept, idx) => (
                      <li key={idx}>{dept}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Economy */}
            {activeProfile.economics && (
              <section>
                <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Economy</h2>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-6">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">GDP</span>
                    <span className="text-white">{activeProfile.economics.gdpLocal || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">GDP Growth</span>
                    <span className="text-white">{activeProfile.economics.gdpGrowthRate || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Employment Rate</span>
                    <span className="text-white">{activeProfile.economics.employmentRate || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Average Income</span>
                    <span className="text-white">{activeProfile.economics.avgIncome || 'Not available'}</span>
                  </div>
                </div>
                
                {activeProfile.economics.majorIndustries && activeProfile.economics.majorIndustries.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Major Industries</h3>
                    <p className="text-slate-300">{activeProfile.economics.majorIndustries.join(', ')}</p>
                  </div>
                )}
                
                {activeProfile.economics.tradePartners && activeProfile.economics.tradePartners.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Trade Partners</h3>
                    <p className="text-slate-300">{activeProfile.economics.tradePartners.join(', ')}</p>
                  </div>
                )}

                {activeProfile.foreignCompanies && activeProfile.foreignCompanies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Foreign Companies Present</h3>
                    <p className="text-slate-300">{activeProfile.foreignCompanies.slice(0, 8).join(', ')}</p>
                  </div>
                )}
              </section>
            )}

            {/* Demographics */}
            {activeProfile.demographics && (
              <section>
                <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Demographics</h2>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Population</span>
                    <span className="text-white">{activeProfile.demographics.population || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Growth Rate</span>
                    <span className="text-white">{activeProfile.demographics.populationGrowth || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Median Age</span>
                    <span className="text-white">{activeProfile.demographics.medianAge || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Literacy Rate</span>
                    <span className="text-white">{activeProfile.demographics.literacyRate || 'Not available'}</span>
                  </div>
                </div>
                
                {activeProfile.demographics.languages && activeProfile.demographics.languages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Languages</h3>
                    <p className="text-slate-300">{activeProfile.demographics.languages.join(', ')}</p>
                  </div>
                )}
              </section>
            )}

            {/* Infrastructure */}
            {activeProfile.infrastructure && (
              <section>
                <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Infrastructure</h2>
                
                {activeProfile.infrastructure.airports && activeProfile.infrastructure.airports.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Airports</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {activeProfile.infrastructure.airports.map((airport, idx) => (
                        <li key={idx}>{airport.name} ({airport.type})</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeProfile.infrastructure.seaports && activeProfile.infrastructure.seaports.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Seaports</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {activeProfile.infrastructure.seaports.map((port, idx) => (
                        <li key={idx}>{port.name} ({port.type})</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Power Capacity</span>
                    <span className="text-white">{activeProfile.infrastructure.powerCapacity || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Internet Penetration</span>
                    <span className="text-white">{activeProfile.infrastructure.internetPenetration || 'Not available'}</span>
                  </div>
                </div>
                
                {activeProfile.infrastructure.specialEconomicZones && activeProfile.infrastructure.specialEconomicZones.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Economic Zones</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {activeProfile.infrastructure.specialEconomicZones.map((zone, idx) => (
                        <li key={idx}>{zone}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Investment & Incentives */}
            {(activeProfile.investmentPrograms?.length > 0 || activeProfile.taxIncentives?.length > 0) && (
              <section>
                <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Investment Information</h2>
                
                {activeProfile.investmentPrograms && activeProfile.investmentPrograms.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Investment Programs</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {activeProfile.investmentPrograms.map((program, idx) => (
                        <li key={idx}>{program}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeProfile.taxIncentives && activeProfile.taxIncentives.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Tax Incentives</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {activeProfile.taxIncentives.map((incentive, idx) => (
                        <li key={idx}>{incentive}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Contact & Resources */}
            <section>
              <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Contact & Resources</h2>
              
              {activeProfile.governmentLinks && activeProfile.governmentLinks.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-slate-200 mb-2">Official Links</h3>
                  <ul className="space-y-2">
                    {activeProfile.governmentLinks.map((link, idx) => (
                      <li key={idx}>
                        <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeProfile.governmentOffices && activeProfile.governmentOffices.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-slate-200 mb-2">Government Offices</h3>
                  <div className="space-y-3">
                    {activeProfile.governmentOffices.slice(0, 4).map((office, idx) => (
                      <div key={idx} className="py-2 border-b border-slate-800">
                        <div className="font-medium text-white">{office.name}</div>
                        <div className="text-sm text-slate-400">{office.type}</div>
                        {office.phone && <div className="text-sm text-slate-300">Phone: {office.phone}</div>}
                        {office.email && <div className="text-sm text-slate-300">Email: {office.email}</div>}
                        {office.website && (
                          <a href={office.website} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline">
                            {office.website}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Sources */}
            {researchResult?.sources && researchResult.sources.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Sources</h2>
                <p className="text-sm text-slate-400 mb-4">This report was compiled from the following sources.</p>
                <ul className="space-y-2">
                  {researchResult.sources.slice(0, 8).map((source: SourceCitation, idx: number) => (
                    <li key={idx}>
                      <a href={source.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline text-sm">
                        {source.title}
                      </a>
                      <span className="text-slate-500 text-xs ml-2">({source.type})</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Disclaimer */}
            <section className="border-t border-slate-700 pt-6 mt-8">
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong>Disclaimer:</strong> This report is for informational purposes only. Always verify critical information with official government sources before making business or investment decisions.
              </p>
            </section>
          </div>
        ) : null}
      </div>

      {/* Leader Detail Modal - Comprehensive */}
      {activeLeader && (
        <div className="fixed inset-0 z-30 bg-black/80 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setActiveLeader(null)}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-4xl w-full my-8" onClick={(event) => event.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {activeLeader.imageUrl ? (
                    <img src={activeLeader.imageUrl} alt={activeLeader.name} className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/40" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/40 to-purple-600/40 flex items-center justify-center text-3xl font-bold">
                      {activeLeader.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold">{activeLeader.name}</h3>
                    <p className="text-slate-400">{activeLeader.role}</p>
                    <p className="text-sm text-slate-500">{activeLeader.tenure}</p>
                    {activeLeader.imageUrl && (
                      <p className="text-[10px] text-amber-300 mt-1">
                        {activeLeader.photoSourceUrl ? (
                          <a href={activeLeader.photoSourceUrl} target="_blank" rel="noreferrer" className="hover:underline">Official photo source</a>
                        ) : (
                          'Official photo source pending verification'
                        )}
                      </p>
                    )}
                    {activeLeader.politicalParty && (
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-xs text-purple-300">
                        {activeLeader.politicalParty}
                      </span>
                    )}
                    {activeLeader.internationalEngagementFocus && (
                      <span className="inline-block ml-2 mt-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs text-amber-300">
                        🌍 Int'l Engagement Lead
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-amber-400">{activeLeader.rating.toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Performance Rating</div>
                  <button onClick={() => setActiveLeader(null)} className="mt-4 px-4 py-2 text-xs font-semibold border border-white/20 rounded-lg hover:bg-white/10">
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Biography */}
              {(activeLeader.bio || activeLeader.fullBio) && (
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Biography
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{activeLeader.fullBio || activeLeader.bio}</p>
                </div>
              )}

              {/* Education & Previous Positions */}
              <div className="grid md:grid-cols-2 gap-4">
                {activeLeader.education && activeLeader.education.length > 0 && (
                  <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> Education
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {activeLeader.education.map((edu, i) => (
                        <li key={i}>• {edu}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeLeader.previousPositions && activeLeader.previousPositions.length > 0 && (
                  <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Previous Positions
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {activeLeader.previousPositions.map((pos, i) => (
                        <li key={i}>• {pos}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Key Achievements */}
              <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Key Achievements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeLeader.achievements.map(item => (
                    <span key={item} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-300">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* News Reports */}
              {activeLeader.newsReports && activeLeader.newsReports.length > 0 && (
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                    <Newspaper className="w-4 h-4" /> Recent News Reports
                  </h4>
                  <div className="space-y-3">
                    {activeLeader.newsReports.map((news, i) => (
                      <div key={i} className="p-3 border border-slate-800 rounded-lg">
                        <div className="font-semibold text-sm text-white">{news.headline}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{news.date} · {news.source}</div>
                        {news.summary && <p className="text-xs text-slate-300 mt-2">{news.summary}</p>}
                        {news.url && (
                          <a href={news.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300">
                            Read more <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Projects */}
              {activeLeader.pastProjects && activeLeader.pastProjects.length > 0 && (
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" /> Past Projects (Completed)
                  </h4>
                  <div className="space-y-3">
                    {activeLeader.pastProjects.map((project, i) => (
                      <div key={i} className="p-3 border border-emerald-500/20 rounded-lg bg-emerald-500/5">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-sm">{project.name}</div>
                          <ProjectBadge status={project.status} />
                        </div>
                        <div className="text-xs text-slate-300 mt-2">{project.description}</div>
                        <div className="flex flex-wrap gap-4 mt-2 text-[10px] text-slate-400">
                          {project.startDate && project.endDate && (
                            <span><Clock className="inline w-3 h-3 mr-1" />{project.startDate} - {project.endDate}</span>
                          )}
                          {project.budget && (
                            <span><DollarSign className="inline w-3 h-3 mr-1" />{project.budget}</span>
                          )}
                        </div>
                        {project.impact && (
                          <div className="mt-2 p-2 bg-emerald-500/10 rounded text-xs text-emerald-300">
                            <strong>Impact:</strong> {project.impact}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Projects */}
              {activeLeader.currentProjects && activeLeader.currentProjects.length > 0 && (
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                    <Rocket className="w-4 h-4" /> Current & Planned Projects
                  </h4>
                  <div className="space-y-3">
                    {activeLeader.currentProjects.map((project, i) => (
                      <div key={i} className="p-3 border border-blue-500/20 rounded-lg bg-blue-500/5">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-sm">{project.name}</div>
                          <ProjectBadge status={project.status} />
                        </div>
                        <div className="text-xs text-slate-300 mt-2">{project.description}</div>
                        <div className="flex flex-wrap gap-4 mt-2 text-[10px] text-slate-400">
                          {project.startDate && (
                            <span><Clock className="inline w-3 h-3 mr-1" />Started: {project.startDate}</span>
                          )}
                          {project.budget && (
                            <span><DollarSign className="inline w-3 h-3 mr-1" />{project.budget}</span>
                          )}
                        </div>
                        {project.impact && (
                          <div className="mt-2 p-2 bg-blue-500/10 rounded text-xs text-blue-300">
                            <strong>Expected Impact:</strong> {project.impact}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Government Links */}
              {activeLeader.governmentLinks && activeLeader.governmentLinks.length > 0 && (
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" /> Official Government Links
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {activeLeader.governmentLinks.map((link, i) => (
                      <a 
                        key={i}
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-2 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 text-xs text-blue-300 flex items-center gap-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact & Social Media */}
              <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Contact Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  {activeLeader.officeAddress && (
                    <div className="flex items-start gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                      <span>{activeLeader.officeAddress}</span>
                    </div>
                  )}
                  {activeLeader.contactEmail && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500">📧</span>
                      <a href={`mailto:${activeLeader.contactEmail}`} className="text-blue-400 hover:underline">{activeLeader.contactEmail}</a>
                    </div>
                  )}
                  {activeLeader.socialMedia?.facebook && (
                    <a href={activeLeader.socialMedia.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline">
                      Facebook Profile
                    </a>
                  )}
                  {activeLeader.socialMedia?.twitter && (
                    <a href={activeLeader.socialMedia.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline">
                      Twitter/X Profile
                    </a>
                  )}
                  {activeLeader.socialMedia?.website && (
                    <a href={activeLeader.socialMedia.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline">
                      Official Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalLocationIntelligence;
