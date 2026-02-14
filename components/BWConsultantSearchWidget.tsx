import React, { useState, useRef } from 'react';
import { Search, Loader, ArrowRight, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export interface SearchResult {
  title: string;
  description: string;
  confidence: number;
  category: string;
}

export interface BWConsultantSearchWidgetProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  context?: 'landing' | 'report';
}

export const BWConsultantSearchWidget: React.FC<BWConsultantSearchWidgetProps> = ({
  onSearch,
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
      // Simulate NSIL analysis stages
      const stages = [
        { message: 'Retrieving integrated data sources...', progress: 35 },
        { message: 'Running NSIL analysis layers...', progress: 60 },
        { message: 'Generating strategic recommendations...', progress: 85 },
        { message: 'Compiling results...', progress: 100 }
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setSearchProgress(stage);
      }

      // Generate mock results based on query
      const mockResults: SearchResult[] = [
        {
          title: 'Market Opportunity Analysis',
          description: 'Strategic insights and growth potential for your target market',
          confidence: 0.94,
          category: 'Market Analysis'
        },
        {
          title: 'Risk Assessment & Mitigation',
          description: 'Comprehensive risk analysis with NSIL Layer 4 stress testing',
          confidence: 0.88,
          category: 'Risk Analysis'
        },
        {
          title: 'Strategic Recommendations',
          description: 'Multi-agent debate consensus on optimal strategy',
          confidence: 0.92,
          category: 'Strategy'
        }
      ];

      setResults(mockResults);
      if (onSearch) onSearch(query);
    } catch (error) {
      console.error('Search error:', error);
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
      {/* Search Input Section */}
      <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg shadow-blue-100/50 p-8 md:p-10">
        {/* Header */}
        <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">
          Strategic Intelligence
        </p>
        <h2 className="text-2xl md:text-3xl font-light mb-3 text-slate-900">
          Analyze Any Global Challenge
        </h2>
        <p className="text-base text-slate-600 leading-relaxed mb-8">
          Ask BW Consultant AI anything about global business, investment, or regional development challenges.
          Get comprehensive analysis powered by the NSIL (Nexus Strategic Intelligence Layer) framework in seconds.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-4 bg-blue-50/50 border-2 border-blue-200 rounded-xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className={`px-8 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-md ${
                isSearching || !query.trim()
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg'
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
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        {/* Progress Bar */}
        {searchProgress && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600">{searchProgress.message}</span>
              <span className="text-xs text-blue-600 font-mono">{searchProgress.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${searchProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && results.length > 0 && !isSearching && (
          <div className="space-y-4 mt-6 border-t pt-6">
            <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-4">
              Analysis Results
            </p>

            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 text-sm">{result.title}</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} className="text-green-600" />
                      <span className="text-xs font-bold text-green-600">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{result.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                      {result.category}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold transition">
                      View Details
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-500 transition">
                Generate Report
              </button>
              <button className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-300 transition">
                Create Document
              </button>
            </div>
          </div>
        )}

        {/* Empty State Message */}
        {!showResults && !isSearching && (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500">
              💡 <strong>Examples:</strong> "Analyze Singapore's startup ecosystem" • "Compare Bangkok vs Manila for tech" •
              "What's the ESG situation in Vietnam?"
            </p>
          </div>
        )}

        {/* No Results State */}
        {showResults && results.length === 0 && !isSearching && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                No results found. Try rephrasing your query or ask about a specific location or company.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-blue-600" />
            <p className="font-semibold text-sm text-blue-900">Live Data</p>
          </div>
          <p className="text-xs text-blue-800">Market intelligence, location profiles, and company data integrated from authoritative sources</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-purple-600" />
            <p className="font-semibold text-sm text-purple-900">NSIL Analysis</p>
          </div>
          <p className="text-xs text-purple-800">10-layer intelligence framework with deterministic outputs</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-green-600" />
            <p className="font-semibold text-sm text-green-900">Actionable</p>
          </div>
          <p className="text-xs text-green-800">Strategic recommendations with implementation roadmaps</p>
        </div>
      </div>
    </div>
  );
};
