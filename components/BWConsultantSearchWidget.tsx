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
          <p className="text-base text-slate-400 leading-relaxed mb-4 max-w-2xl">
            Ask me anything. I&rsquo;ll run your question through 34 intelligence engines, 38 proprietary formulas, and 10 analytical layers &mdash; then deliver deterministic, audit-ready analysis. Not hallucinations. Not guesses. Real intelligence backed by mathematical proof.
          </p>
          
          {/* Consultant Capabilities */}
          <div className="flex flex-wrap gap-2 mb-8 max-w-3xl">
            <span className="text-xs bg-slate-700/60 text-blue-300 px-3 py-1.5 rounded-sm border border-slate-600">IFC Performance Standards</span>
            <span className="text-xs bg-slate-700/60 text-blue-300 px-3 py-1.5 rounded-sm border border-slate-600">195 Country Compliance</span>
            <span className="text-xs bg-slate-700/60 text-blue-300 px-3 py-1.5 rounded-sm border border-slate-600">Global Gap Analysis</span>
            <span className="text-xs bg-slate-700/60 text-blue-300 px-3 py-1.5 rounded-sm border border-slate-600">ESG Assessment</span>
            <span className="text-xs bg-slate-700/60 text-blue-300 px-3 py-1.5 rounded-sm border border-slate-600">UN SDG Alignment</span>
          </div>

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
                  placeholder="Ask BW Consultant anything..."
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

        {/* Results Section */}
        {showResults && results.length > 0 && !isSearching && (
          <div className="space-y-4 mt-6 border-t border-slate-600 pt-6">
            <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-4">
              Analysis Results
            </p>

            <div className="space-y-3 max-w-3xl">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-slate-800/80 backdrop-blur border border-slate-600 rounded-sm p-4 hover:bg-slate-700/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-base">{result.title}</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} className="text-blue-400" />
                      <span className="text-sm font-bold text-blue-400">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-base text-slate-300 mb-3">{result.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-slate-700 text-slate-300 px-2 py-1 rounded-sm font-medium">
                      {result.category}
                    </span>
                    <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-semibold transition">
                      View Details
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-600 max-w-3xl">
              <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-sm font-semibold text-sm hover:bg-blue-500 transition">
                Generate Report
              </button>
              <button className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-sm font-semibold text-sm hover:bg-slate-600 transition border border-slate-600">
                Create Document
              </button>
            </div>
          </div>
        )}

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

      {/* Info Box - Global Standards Commitment */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-sm bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <p className="font-semibold text-base text-slate-900">IFC Performance Standards</p>
          </div>
          <p className="text-sm text-slate-600">World Bank gold standard applied to every analysis &mdash; the universal baseline for global finance</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-sm bg-blue-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            <p className="font-semibold text-base text-slate-900">195 Country Coverage</p>
          </div>
          <p className="text-sm text-slate-600">Complete compliance database with local law references to bridge global standards to local reality</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-sm bg-purple-50 flex items-center justify-center">
              <ArrowRight size={18} className="text-purple-600" />
            </div>
            <p className="font-semibold text-base text-slate-900">Gap Analysis &amp; Remediation</p>
          </div>
          <p className="text-sm text-slate-600">Identifies compliance gaps and provides specific local legal pathways to fix them</p>
        </div>
      </div>
    </div>
  );
};
