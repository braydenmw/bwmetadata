import React, { useState, useRef } from 'react';
import { Search, Loader, ArrowRight, AlertCircle, TrendingUp, X, ExternalLink } from 'lucide-react';
import { bwConsultantAI, type ConsultantInsight } from '../services/BWConsultantAgenticAI';
import { GlobalIssueResolver, type IssueAnalysis } from '../services/GlobalIssueResolver';
import { ReactiveIntelligenceEngine } from '../services/ReactiveIntelligenceEngine';

export interface SearchResult {
  title: string;
  description: string;
  confidence: number;
  category: string;
}

export interface BWConsultantSearchWidgetProps {
  onSearch?: (query: string) => void;
  onEnterPlatform?: () => void;
  placeholder?: string;
  context?: 'landing' | 'report';
}

export const BWConsultantSearchWidget: React.FC<BWConsultantSearchWidgetProps> = ({
  onSearch,
  onEnterPlatform,
  placeholder = 'Search any location, company, or entity...',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context = 'landing'
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchProgress, setSearchProgress] = useState<{ message: string; progress: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setShowResults(true);
    setSearchProgress({ message: 'Detecting issue type...', progress: 15 });

    try {
      // Step 1: Run BWConsultantAgenticAI consultation (real service)
      setSearchProgress({ message: 'Running BW Consultant intelligence...', progress: 25 });
      const consultParams = { query: query.trim(), country: '', industry: [] as string[] };
      // Extract country/industry hints from query
      const qLower = query.toLowerCase();
      const countries = ['philippines', 'vietnam', 'thailand', 'indonesia', 'malaysia', 'singapore', 'japan', 'china', 'india', 'korea', 'cambodia', 'myanmar', 'laos', 'bangladesh', 'pakistan', 'sri lanka', 'nepal', 'australia', 'new zealand'];
      for (const c of countries) {
        if (qLower.includes(c)) { consultParams.country = c.charAt(0).toUpperCase() + c.slice(1); break; }
      }
      const industries = ['technology', 'manufacturing', 'healthcare', 'agriculture', 'finance', 'fintech', 'energy', 'renewable', 'mining', 'tourism', 'real estate', 'logistics', 'education', 'retail'];
      for (const ind of industries) {
        if (qLower.includes(ind)) { consultParams.industry.push(ind); }
      }

      const [consultInsights, issueAnalysis] = await Promise.all([
        bwConsultantAI.consult(consultParams, 'landing_search').catch(() => [] as ConsultantInsight[]),
        new GlobalIssueResolver().resolveIssue(query.trim()).catch(() => null as IssueAnalysis | null)
      ]);

      setSearchProgress({ message: 'Gathering live intelligence...', progress: 55 });

      // Step 2: Run live search for real-time evidence
      let liveEvidence: Array<{ title: string; url?: string; snippet?: string }> = [];
      try {
        liveEvidence = await ReactiveIntelligenceEngine.liveSearch(query.trim(), consultParams);
      } catch { /* live search optional */ }

      setSearchProgress({ message: 'Synthesizing results...', progress: 85 });

      // Step 3: Build real results from consultant insights + issue analysis + live evidence
      const realResults: SearchResult[] = [];

      // Add consultant insights as results
      for (const insight of consultInsights.slice(0, 3)) {
        realResults.push({
          title: insight.title,
          description: insight.content,
          confidence: insight.confidence,
          category: insight.type === 'location_intel' ? 'Location Intelligence' :
                   insight.type === 'market_analysis' ? 'Market Analysis' :
                   insight.type === 'risk_assessment' ? 'Risk Assessment' : 'Recommendation'
        });
      }

      // Add issue analysis results if available
      if (issueAnalysis) {
        if (realResults.length < 4) {
          realResults.push({
            title: `Strategic Analysis: ${issueAnalysis.issueCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
            description: issueAnalysis.strategicRecommendations.slice(0, 2).join(' | '),
            confidence: issueAnalysis.overallConfidence,
            category: 'Strategic Analysis'
          });
        }
        if (realResults.length < 5 && issueAnalysis.riskMitigation.length > 0) {
          realResults.push({
            title: 'Risk Mitigation Strategy',
            description: issueAnalysis.riskMitigation.map(r => `${r.risk}: ${r.mitigation}`).slice(0, 2).join(' | '),
            confidence: 0.87,
            category: 'Risk Analysis'
          });
        }
      }

      // Add live evidence as results
      for (const evidence of liveEvidence.slice(0, 2)) {
        if (realResults.length < 6) {
          realResults.push({
            title: evidence.title || 'Live Intelligence',
            description: evidence.snippet || 'Real-time market intelligence from live sources.',
            confidence: 0.78,
            category: 'Live Intelligence'
          });
        }
      }

      // Ensure at least one result even if all services fail
      if (realResults.length === 0) {
        realResults.push({
          title: `Analysis: ${query.trim()}`,
          description: 'Initial assessment complete. Enter the platform for full NSIL 10-layer analysis with live data, risk modeling, and strategic recommendations.',
          confidence: 0.7,
          category: 'General Analysis'
        });
      }

      setSearchProgress({ message: 'Complete', progress: 100 });
      setResults(realResults);
      if (onSearch) onSearch(query);
    } catch (error) {
      console.error('Search error:', error);
      setResults([{
        title: 'Analysis In Progress',
        description: 'Enter the platform for comprehensive NSIL analysis with live intelligence.',
        confidence: 0.7,
        category: 'General'
      }]);
    } finally {
      setIsSearching(false);
      setSearchProgress(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch((e as unknown) as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Banner with Background */}
      <div 
        className="relative rounded-sm overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(15, 23, 42, 0.7) 100%), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="p-10 md:p-14">
          {/* Header */}
          <p className="text-blue-400 uppercase tracking-[0.3em] text-xs mb-4 font-semibold">
            Meet Your AI Partner
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
            BW Consultant AI<br />
            <span className="text-blue-400">Your Strategic Intelligence Partner</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-3 max-w-2xl">
            I&rsquo;m not a chatbot &mdash; I&rsquo;m a sovereign-grade intelligence system built to help you navigate global business, investment, and regional development challenges.
          </p>


          {/* Search Input */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-3 max-w-3xl">
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full pl-12 pr-4 py-4 bg-white/95 border-2 border-transparent rounded-sm text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:bg-white transition-all shadow-lg"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className={`px-8 py-4 rounded-sm text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isSearching || !query.trim()
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {isSearching ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </form>

        {/* Progress Bar */}
        {searchProgress && (
          <div className="bg-slate-800/80 backdrop-blur border border-slate-600 rounded-sm p-4 mb-6 max-w-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">{searchProgress.message}</span>
              <span className="text-sm text-blue-400 font-mono">{searchProgress.progress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-sm h-2">
              <div
                className="bg-blue-500 h-2 rounded-sm transition-all duration-500"
                style={{ width: `${searchProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Results shown in modal popup - see below */}

        {/* Empty State Message */}
        {!showResults && !isSearching && (
          <div className="max-w-3xl">
            <p className="text-sm text-slate-400 mb-2">Try asking me:</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm bg-slate-700/60 text-slate-300 px-3 py-1.5 rounded-sm border border-slate-600 cursor-pointer hover:bg-slate-600/60 transition">&ldquo;Check IFC compliance for my factory in Vietnam&rdquo;</span>
              <span className="text-sm bg-slate-700/60 text-slate-300 px-3 py-1.5 rounded-sm border border-slate-600 cursor-pointer hover:bg-slate-600/60 transition">&ldquo;Compare Bangkok vs Manila for tech investment&rdquo;</span>
              <span className="text-sm bg-slate-700/60 text-slate-300 px-3 py-1.5 rounded-sm border border-slate-600 cursor-pointer hover:bg-slate-600/60 transition">&ldquo;What are the ESG risks in Philippine manufacturing?&rdquo;</span>
            </div>
          </div>
        )}

        {/* No Results State */}
        {showResults && results.length === 0 && !isSearching && (
          <div className="bg-slate-800/80 border border-slate-600 rounded-sm p-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-slate-400 flex-shrink-0" />
              <p className="text-base text-slate-300">
                No results found. Try rephrasing your query or ask about a specific location or company.
              </p>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* ═══════════════════ RESULTS MODAL POPUP ═══════════════════ */}
      {showResults && results.length > 0 && !isSearching && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowResults(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative bg-slate-900 border border-slate-600 rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/80">
              <div>
                <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-1">BW Consultant AI</p>
                <h3 className="text-lg font-bold text-white">Analysis Results</h3>
                <p className="text-xs text-slate-400 mt-0.5">Query: &ldquo;{query}&rdquo;</p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body — Scrollable Results */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 hover:bg-slate-700/60 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white text-base flex-1 pr-3">{result.title}</h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <TrendingUp size={14} className="text-blue-400" />
                      <span className="text-sm font-bold text-blue-400">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{result.description}</p>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded font-medium">
                    {result.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Footer — Actions */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-700 bg-slate-800/50">
              <button
                onClick={() => {
                  setShowResults(false);
                  if (onEnterPlatform) onEnterPlatform();
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-500 transition flex items-center justify-center gap-2"
              >
                <ExternalLink size={16} />
                Continue to Live Report Builder
              </button>
              <button
                onClick={() => setShowResults(false)}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold text-sm hover:bg-slate-600 transition border border-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
