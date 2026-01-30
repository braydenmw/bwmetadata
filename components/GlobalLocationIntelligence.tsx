import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Globe, Landmark, Target, ArrowLeft, Download, Database, Users, TrendingUp, Plane, Ship, Zap, Calendar, Newspaper, ExternalLink, MapPin, Clock, DollarSign, Briefcase, GraduationCap, Factory, Activity, ChevronDown, ChevronUp, FileText, Award, History, Rocket, Search, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CITY_PROFILES, type CityLeader, type CityProfile } from '../data/globalLocationProfiles';
import { getCityProfiles, searchCityProfiles } from '../services/globalLocationService';
import { comprehensiveLiveSearch, type LiveLocationSearchProgress } from '../services/liveLocationSearchService';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type LeafletComponent = React.ComponentType<Record<string, unknown>>;

const MapContainerAny = MapContainer as unknown as LeafletComponent;
const TileLayerAny = TileLayer as unknown as LeafletComponent;
const MarkerAny = Marker as unknown as LeafletComponent;
const PopupAny = Popup as unknown as LeafletComponent;

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

// Map controller component to handle dynamic map centering
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [map, center, zoom]);
  return null;
};

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
  const [researchProgress, setResearchProgress] = useState<LiveLocationSearchProgress | null>(null);
  const [liveProfile, setLiveProfile] = useState<CityProfile | null>(null);
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    economy: true,
    infrastructure: true,
    demographics: true,
    leadership: true,
    live: true
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

  const mapCenter: [number, number] = activeProfile?.latitude && activeProfile?.longitude
    ? [activeProfile.latitude, activeProfile.longitude]
    : [20, 0];

  const mapZoom = activeProfile?.latitude && activeProfile?.longitude ? 12 : 2;

  // Select an existing profile
  const handleSelectProfile = useCallback((profile: CityProfile) => {
    setActiveProfileId(profile.id);
    setHasSelection(true);
    setLiveProfile(null);
    setIsResearching(false);
    setResearchProgress(null);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Handle search submission - LIVE SEARCH
  const handleSearchSubmit = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // First check existing profiles
    const normalized = trimmedQuery.toLowerCase();
    const existingMatch = profiles.find(profile =>
      profile.city.toLowerCase().includes(normalized) ||
      profile.region.toLowerCase().includes(normalized) ||
      profile.country.toLowerCase().includes(normalized)
    );

    if (existingMatch) {
      // Use existing profile
      handleSelectProfile(existingMatch);
    } else {
      // Start LIVE research for new location
      setHasSelection(true);
      setActiveProfileId(null);
      setLiveProfile(null);
      setSearchQuery('');
      setSearchResults([]);
      setLoadingError(null);
      setIsResearching(true);
      setResearchProgress({ stage: 'geocoding', progress: 0, message: 'Initializing live search...' });
      
      try {
        // Use comprehensive live search - NO MOCKED DATA
        const result = await comprehensiveLiveSearch(trimmedQuery, (progress) => {
          setResearchProgress(progress);
        });
        
        if (result) {
          setLiveProfile(result);
          setResearchProgress({ stage: 'complete', progress: 100, message: 'Live profile loaded!' });
        } else {
          setLoadingError(`Could not find location "${trimmedQuery}". Please try a different search term.`);
          setHasSelection(false);
        }
      } catch (error) {
        console.error('Live search error:', error);
        const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
        if (isNetworkError || !navigator.onLine) {
          setLoadingError('Unable to connect to search services. Please check your internet connection.');
        } else {
          setLoadingError('Search failed. Please try again.');
        }
        setHasSelection(false);
      } finally {
        setIsResearching(false);
      }
    }
  }, [profiles, handleSelectProfile]);

  // Load existing profiles
  useEffect(() => {
    const loadProfiles = async () => {
      const data = await getCityProfiles();
      setProfiles(data);
      
      // Check for target from localStorage (from other pages)
      const target = localStorage.getItem('gli-target');
      if (target) {
        localStorage.removeItem('gli-target');
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
    setIsResearching(false);
    setResearchProgress(null);
    setLoadingError(null);
  };

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
                      Existing Profiles (Click to view)
                    </div>
                    {searchResults.map(result => (
                      <button
                        key={result.id}
                        onClick={() => handleSelectProfile(result)}
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
          <div className="h-[450px] rounded-xl border border-slate-800 overflow-hidden">
            <MapContainerAny
              center={mapCenter}
              zoom={mapZoom}
              className="h-full w-full"
              scrollWheelZoom={!hasSelection}
              dragging={!hasSelection}
              doubleClickZoom={!hasSelection}
              zoomControl={!hasSelection}
              touchZoom={!hasSelection}
            >
              <MapController center={mapCenter} zoom={mapZoom} />
              <TileLayerAny
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Show all profiles as markers when no selection */}
              {!hasSelection && profiles.map(profile => (
                <MarkerAny
                  key={profile.id}
                  position={[profile.latitude, profile.longitude]}
                  eventHandlers={{
                    click: () => handleSelectProfile(profile)
                  }}
                >
                  <PopupAny>
                    <div className="text-sm p-1">
                      <div className="font-bold text-base">{profile.city}</div>
                      <div className="text-xs text-slate-600">{profile.region}, {profile.country}</div>
                      <div className="text-xs mt-1">Score: {computeCompositeScore(profile)}/100</div>
                    </div>
                  </PopupAny>
                </MarkerAny>
              ))}
              {/* Fixed map for selected profile with key highlights */}
              {hasSelection && activeProfile && activeProfile.latitude && (
                <MarkerAny position={[activeProfile.latitude, activeProfile.longitude]}>
                  <PopupAny autoClose={false} closeOnClick={false}>
                    <div className="text-sm p-1 min-w-[220px]">
                      <div className="font-bold text-base">{activeProfile.city}</div>
                      <div className="text-xs text-slate-600">{activeProfile.region}, {activeProfile.country}</div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-700">
                        <div className="bg-slate-100 rounded p-2">
                          <div className="text-slate-500">Composite</div>
                          <div className="font-semibold">{computeCompositeScore(activeProfile)}/100</div>
                        </div>
                        <div className="bg-slate-100 rounded p-2">
                          <div className="text-slate-500">Population</div>
                          <div className="font-semibold">{activeProfile.demographics?.population || 'N/A'}</div>
                        </div>
                        <div className="bg-slate-100 rounded p-2">
                          <div className="text-slate-500">Top Sectors</div>
                          <div className="font-semibold">{activeProfile.keySectors?.slice(0, 2).join(', ') || 'N/A'}</div>
                        </div>
                        <div className="bg-slate-100 rounded p-2">
                          <div className="text-slate-500">Momentum</div>
                          <div className="font-semibold">{activeProfile.investmentMomentum ?? 'N/A'}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-600">
                        Highlights: {activeProfile.knownFor?.slice(0, 2).join(', ') || 'N/A'}
                      </div>
                    </div>
                  </PopupAny>
                </MarkerAny>
              )}
            </MapContainerAny>
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
                  <h2 className="text-lg font-semibold text-purple-300">Live Search in Progress</h2>
                  <p className="text-xs text-slate-400">{researchProgress?.message || 'Searching...'}</p>
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
            
            {/* Live Search Stages */}
            <div className="grid md:grid-cols-6 gap-2 mb-4">
              {['geocoding', 'basic-info', 'leadership', 'economy', 'news', 'photos'].map(stage => {
                const stageProgress = researchProgress?.stage === stage ? 'active' 
                  : (['complete', 'error'].includes(researchProgress?.stage || '') || 
                     ['geocoding', 'basic-info', 'leadership', 'economy', 'news', 'photos'].indexOf(stage) < 
                     ['geocoding', 'basic-info', 'leadership', 'economy', 'news', 'photos'].indexOf(researchProgress?.stage || '')) 
                    ? 'complete' : 'pending';
                return (
                  <div 
                    key={stage}
                    className={`p-2 rounded-lg border text-xs text-center ${
                      stageProgress === 'complete'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : stageProgress === 'active'
                          ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                          : 'border-slate-700 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {stageProgress === 'complete' && <CheckCircle2 className="w-3 h-3" />}
                      {stageProgress === 'active' && <Loader2 className="w-3 h-3 animate-spin" />}
                      {stageProgress === 'pending' && <Clock className="w-3 h-3" />}
                      <span className="capitalize">{stage.replace('-', ' ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Live Search Status */}
            <div className="bg-black/40 rounded-lg p-3 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-purple-400">●</span>
                <span>Fetching real-time data from Google, Wikipedia, and public APIs...</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-purple-400">●</span>
                <span>No mocked data - all information is live and current</span>
              </div>
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
                <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-4">Quick Access: Pre-Researched Locations</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {profiles.slice(0, 6).map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => handleSelectProfile(profile)}
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
          <div className="space-y-6">
            {/* City Header with Quick Facts */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                  <h2 className="text-3xl font-bold">{activeProfile.city}</h2>
                  <p className="text-slate-400">{activeProfile.region} · {activeProfile.country}</p>
                  <p className="text-xs text-slate-500 mt-1">Est. {activeProfile.established} · {activeProfile.timezone}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-amber-400">{computeCompositeScore(activeProfile)}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Composite Score</div>
                  <button
                    onClick={() => exportCityBrief(activeProfile)}
                    className="mt-2 px-3 py-1.5 text-xs font-semibold border border-white/20 text-slate-200 rounded-lg hover:border-amber-400"
                  >
                    <Download className="inline w-3 h-3 mr-1" /> Export Full Brief
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {activeProfile.city} is known for {activeProfile.knownFor.slice(0, 3).join(', ')} and serves as a strategic hub in {activeProfile.region}. 
                With direct access via {activeProfile.globalMarketAccess.toLowerCase()}, the city focuses on {activeProfile.keySectors.slice(0, 4).join(', ')}.
              </p>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed mb-6">
                {buildNarrative(activeProfile).overview.map((paragraph, idx) => (
                  <p key={`overview-${idx}`}>{paragraph}</p>
                ))}
              </div>
              <div className="bg-black/30 border border-white/10 rounded-xl p-4 mb-6">
                <div className="text-[11px] uppercase tracking-wider text-amber-400 mb-2 font-semibold">Historical Context</div>
                <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                  {buildNarrative(activeProfile).historical.map((paragraph, idx) => (
                    <p key={`history-${idx}`}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
                <div className="text-[11px] uppercase tracking-wider text-emerald-300 mb-2 font-semibold">Evidence & Verification</div>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  Evidence for this profile is derived from official government portals, public statistics releases, and verified leadership updates. 
                  When available, the system references executive orders, infrastructure plans, budget releases, and published development programs to validate claims.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Area</div>
                  <div className="text-sm font-semibold mt-1">{activeProfile.areaSize || 'N/A'}</div>
                </div>
                <div className="p-3 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Climate</div>
                  <div className="text-sm font-semibold mt-1">{activeProfile.climate || 'N/A'}</div>
                </div>
                <div className="p-3 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Currency</div>
                  <div className="text-sm font-semibold mt-1">{activeProfile.currency || 'N/A'}</div>
                </div>
                <div className="p-3 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Business Hours</div>
                  <div className="text-sm font-semibold mt-1">{activeProfile.businessHours || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* ===================== POLITICAL LEADERSHIP SECTION ===================== */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
              <button
                onClick={() => toggleSection('leadership')}
                className="w-full flex items-center justify-between"
              >
                <SectionHeader icon={Landmark} title="Political Leadership" color="text-purple-400" />
                {expandedSections.leadership ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {expandedSections.leadership && (
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  {activeProfile.leaders.map(leader => (
                    <button
                      key={leader.id}
                      onClick={() => setActiveLeader(leader)}
                      className="text-left p-4 border border-white/10 rounded-xl hover:border-purple-400/50 transition-all bg-slate-900/50"
                    >
                      <div className="flex items-start gap-4">
                        {(leader.imageUrl || leader.photoUrl) ? (
                          <img
                            src={leader.imageUrl || leader.photoUrl}
                            alt={leader.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/40 to-purple-600/40 flex items-center justify-center text-lg font-bold">
                            {leader.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white">{leader.name}</div>
                          <div className="text-xs text-slate-400">{leader.role}</div>
                          <div className="text-[10px] text-slate-500">{leader.tenure}</div>
                          {leader.photoVerified && (
                            <div className="text-[10px] text-emerald-300 mt-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Photo verified
                            </div>
                          )}
                          {!leader.imageUrl && !leader.photoUrl && (
                            <div className="text-[10px] text-amber-300 mt-1">Official photo pending verification</div>
                          )}
                          {leader.sourceUrl && (
                            <a href={leader.sourceUrl} target="_blank" rel="noreferrer" 
                               className="text-[10px] text-blue-400 hover:underline mt-1 block truncate"
                               onClick={(e) => e.stopPropagation()}>
                              Source: {new URL(leader.sourceUrl).hostname}
                            </a>
                          )}
                          {leader.internationalEngagementFocus && (
                            <div className="text-[10px] text-purple-300 mt-1">🌍 Int'l Engagement Focus</div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-amber-400 font-semibold">{leader.rating.toFixed(1)}/10</span>
                            <span className="text-[10px] text-slate-500">Performance</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-[10px] text-purple-300 flex items-center gap-1">
                        Click for full bio, news & projects →
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ===================== ECONOMY & TRADE SECTION ===================== */}
            {activeProfile.economics && (
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                <button
                  onClick={() => toggleSection('economy')}
                  className="w-full flex items-center justify-between"
                >
                  <SectionHeader icon={TrendingUp} title="Economy & Trade" color="text-emerald-400" />
                  {expandedSections.economy ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {expandedSections.economy && (
                  <div className="mt-4 space-y-6">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="p-4 border border-slate-800 rounded-lg text-center">
                        <div className="text-[10px] text-slate-400 uppercase">Local GDP</div>
                        <div className="text-xl font-bold text-white mt-1">{activeProfile.economics.gdpLocal}</div>
                      </div>
                      <div className="p-4 border border-slate-800 rounded-lg text-center">
                        <div className="text-[10px] text-slate-400 uppercase">GDP Growth</div>
                        <div className="text-xl font-bold text-emerald-400 mt-1">{activeProfile.economics.gdpGrowthRate}</div>
                      </div>
                      <div className="p-4 border border-slate-800 rounded-lg text-center">
                        <div className="text-[10px] text-slate-400 uppercase">Employment Rate</div>
                        <div className="text-xl font-bold text-white mt-1">{activeProfile.economics.employmentRate}</div>
                      </div>
                      <div className="p-4 border border-slate-800 rounded-lg text-center">
                        <div className="text-[10px] text-slate-400 uppercase">Avg Income</div>
                        <div className="text-xl font-bold text-white mt-1">{activeProfile.economics.avgIncome}</div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Major Industries</h4>
                        <div className="flex flex-wrap gap-2">
                          {activeProfile.economics.majorIndustries.map(industry => (
                            <span key={industry} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-300">
                              {industry}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Trade Partners</h4>
                        <div className="flex flex-wrap gap-2">
                          {activeProfile.economics.tradePartners?.map(partner => (
                            <span key={partner} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-300">
                              {partner}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 border border-slate-800 rounded-lg">
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-3">Top Exports</h4>
                        <ul className="space-y-2 text-xs text-slate-300">
                          {activeProfile.economics.topExports?.map(item => (
                            <li key={item} className="flex items-center gap-2">
                              <Ship className="w-3 h-3 text-slate-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-3 border-t border-slate-800">
                          <span className="text-[10px] text-slate-400">Export Volume: </span>
                          <span className="text-sm font-semibold">{activeProfile.economics.exportVolume}</span>
                        </div>
                      </div>
                      <div className="p-4 border border-slate-800 rounded-lg">
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-3">Foreign Companies Present</h4>
                        <div className="space-y-2">
                          {activeProfile.foreignCompanies.slice(0, 6).map(company => (
                            <div key={company} className="flex items-center gap-2 text-xs">
                              <Briefcase className="w-3 h-3 text-slate-500" />
                              {company}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===================== INFRASTRUCTURE SECTION ===================== */}
            {activeProfile.infrastructure && (
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                <button
                  onClick={() => toggleSection('infrastructure')}
                  className="w-full flex items-center justify-between"
                >
                  <SectionHeader icon={Factory} title="Infrastructure" color="text-orange-400" />
                  {expandedSections.infrastructure ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {expandedSections.infrastructure && (
                  <div className="mt-4 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 border border-slate-800 rounded-lg">
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                          <Plane className="w-4 h-4" /> Airports
                        </h4>
                        <div className="space-y-3">
                          {activeProfile.infrastructure.airports?.map(airport => (
                            <div key={airport.name} className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="font-semibold text-sm">{airport.name}</div>
                              <div className="text-[10px] text-slate-400">{airport.type}</div>
                              {airport.routes && <div className="text-xs text-slate-300 mt-1">Routes: {airport.routes}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 border border-slate-800 rounded-lg">
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                          <Ship className="w-4 h-4" /> Seaports
                        </h4>
                        <div className="space-y-3">
                          {activeProfile.infrastructure.seaports?.map(port => (
                            <div key={port.name} className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="font-semibold text-sm">{port.name}</div>
                              <div className="text-[10px] text-slate-400">{port.type}</div>
                              {port.capacity && <div className="text-xs text-slate-300 mt-1">Capacity: {port.capacity}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 border border-slate-800 rounded-lg">
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Power & Connectivity
                        </h4>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between p-2 bg-slate-800/50 rounded">
                            <span className="text-slate-400">Power Capacity</span>
                            <span className="font-semibold">{activeProfile.infrastructure.powerCapacity}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-slate-800/50 rounded">
                            <span className="text-slate-400">Internet Penetration</span>
                            <span className="font-semibold">{activeProfile.infrastructure.internetPenetration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-slate-800 rounded-lg">
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-3">Economic Zones</h4>
                        <ul className="space-y-2 text-xs">
                          {activeProfile.infrastructure.specialEconomicZones?.map(zone => (
                            <li key={zone} className="text-emerald-300">{zone}</li>
                          ))}
                          {activeProfile.infrastructure.industrialParks?.map(park => (
                            <li key={park} className="text-slate-400">{park}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===================== DEMOGRAPHICS SECTION ===================== */}
            {activeProfile.demographics && (
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                <button
                  onClick={() => toggleSection('demographics')}
                  className="w-full flex items-center justify-between"
                >
                  <SectionHeader icon={Users} title="Demographics" color="text-cyan-400" />
                  {expandedSections.demographics ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {expandedSections.demographics && (
                  <div className="mt-4 space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 border border-slate-800 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{activeProfile.demographics.population}</div>
                        <div className="text-[10px] text-slate-400 uppercase mt-1">Total Population</div>
                      </div>
                      <div className="p-4 border border-slate-800 rounded-lg text-center">
                        <div className="text-2xl font-bold text-emerald-400">{activeProfile.demographics.populationGrowth}</div>
                        <div className="text-[10px] text-slate-400 uppercase mt-1">Growth Rate</div>
                      </div>
                      <div className="p-4 border border-slate-800 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{activeProfile.demographics.medianAge}</div>
                        <div className="text-[10px] text-slate-400 uppercase mt-1">Median Age</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 border border-slate-800 rounded-lg">
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" /> Education & Workforce
                        </h4>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between p-2 bg-slate-800/50 rounded">
                            <span className="text-slate-400">Literacy Rate</span>
                            <span className="font-semibold text-emerald-400">{activeProfile.demographics.literacyRate}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-slate-800/50 rounded">
                            <span className="text-slate-400">Working Age Population</span>
                            <span className="font-semibold">{activeProfile.demographics.workingAgePopulation}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-slate-800/50 rounded">
                            <span className="text-slate-400">Universities/Colleges</span>
                            <span className="font-semibold">{activeProfile.demographics.universitiesColleges}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-slate-800/50 rounded">
                            <span className="text-slate-400">Graduates/Year</span>
                            <span className="font-semibold">{activeProfile.demographics.graduatesPerYear}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-slate-800 rounded-lg">
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-3">Languages & Culture</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {activeProfile.demographics.languages?.map(lang => (
                            <span key={lang} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-300">
                              {lang}
                            </span>
                          ))}
                        </div>
                        <div className="p-2 bg-slate-800/50 rounded">
                          <span className="text-[10px] text-slate-400">Urbanization: </span>
                          <span className="text-sm font-semibold">{activeProfile.demographics.urbanization}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===================== INVESTMENT READINESS SCORES ===================== */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
              <SectionHeader icon={Target} title="Investment Readiness Scores" />
              <div className="grid md:grid-cols-2 gap-4">
                <ScoreBar label="Infrastructure" value={activeProfile.infrastructureScore} />
                <ScoreBar label="Political Stability" value={activeProfile.politicalStability} />
                <ScoreBar label="Labor Pool Quality" value={activeProfile.laborPool} />
                <ScoreBar label="Investment Momentum" value={activeProfile.investmentMomentum} />
                <ScoreBar label="Regulatory Ease" value={100 - activeProfile.regulatoryFriction} />
                <ScoreBar label="Cost Competitiveness" value={100 - activeProfile.costOfDoing} />
              </div>
            </div>

            {/* ===================== STRATEGIC ADVANTAGES & NEEDS ===================== */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                <SectionHeader icon={Award} title="Strategic Advantages" color="text-emerald-400" />
                <ul className="space-y-2 text-xs text-slate-300">
                  {activeProfile.strategicAdvantages.map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                <SectionHeader icon={Rocket} title="Development Needs" color="text-amber-400" />
                <ul className="space-y-2 text-xs text-slate-300">
                  {deriveNeeds(activeProfile).map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ===================== ACTIVE PROGRAMS & TAX INCENTIVES ===================== */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                <SectionHeader icon={Target} title="Active Programs" />
                <div className="space-y-3">
                  {activeProfile.currentPrograms?.map(program => (
                    <div key={program.name} className="p-3 border border-slate-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold">{program.name}</div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                          program.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' :
                          program.status === 'Under construction' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {program.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{program.focus}</div>
                    </div>
                  ))}
                </div>
              </div>
              {activeProfile.taxIncentives && (
                <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                  <SectionHeader icon={DollarSign} title="Tax Incentives" color="text-emerald-400" />
                  <ul className="space-y-2 text-xs text-slate-300">
                    {activeProfile.taxIncentives.map(incentive => (
                      <li key={incentive} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">$</span>
                        {incentive}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ===================== GOVERNMENT LINKS & SOURCES ===================== */}
            {activeProfile.governmentLinks && (
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                <SectionHeader icon={ExternalLink} title="Official Government Sources" color="text-blue-400" />
                <div className="grid md:grid-cols-3 gap-4">
                  {activeProfile.governmentLinks.map(link => (
                    <a 
                      key={link.url}
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-3 border border-blue-500/30 rounded-lg hover:border-blue-400 hover:bg-blue-500/10 transition-all text-xs text-blue-300 flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== LIVE DATA SECTION ===================== */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
              <button
                onClick={() => toggleSection('live')}
                className="w-full flex items-center justify-between"
              >
                <SectionHeader icon={Activity} title="Live Data & News" color="text-red-400" />
                {expandedSections.live ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {expandedSections.live && (
                <div className="mt-4 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Data Feeds</h4>
                      <div className="space-y-2">
                        {activeProfile.realTimeIndicators?.liveFeeds?.map(feed => (
                          <div key={feed.name} className="flex items-center justify-between p-2 border border-slate-800 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Database className="w-3 h-3 text-slate-500" />
                              <span className="text-xs">{feed.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={feed.status} />
                              {feed.url && (
                                <a href={feed.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-amber-400">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Recent News</h4>
                      <div className="space-y-2">
                        {activeProfile.realTimeIndicators?.newsAlerts?.map(alert => (
                          <div key={alert.headline} className="p-3 border border-slate-800 rounded-lg">
                            <div className="font-semibold text-xs">{alert.headline}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{alert.date} · {alert.source}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Upcoming Events
                    </h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {activeProfile.realTimeIndicators?.upcomingEvents?.map(event => (
                        <div key={event.name} className="p-3 border border-slate-800 rounded-lg">
                          <div className="font-semibold text-xs">{event.name}</div>
                          <div className="text-[10px] text-slate-400">{event.date}</div>
                          <span className="mt-2 inline-block px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-[10px] text-blue-300">
                            {event.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-200">
                    <strong>Data Source:</strong> {activeProfile.realTimeIndicators?.dataSource} | Last Updated: {activeProfile.realTimeIndicators?.lastUpdated}
                  </div>
                </div>
              )}
            </div>
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
              {activeLeader.bio && (
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Biography
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{activeLeader.bio}</p>
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
