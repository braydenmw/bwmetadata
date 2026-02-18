/**
 * UNIFIED BW CONSULTANT COMPONENT
 * 
 * Single component that works in both contexts:
 * - Landing Page: Shows FACT SHEET
 * - Live Report Sidebar: PROACTIVE CHATBOT
 * 
 * Auto-detects context and adapts behavior
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, Brain, AlertCircle } from 'lucide-react';
import ContextAwareBWConsultant, { 
  ConsultantResponse, 
  FactSheetResponse, 
  ChatResponse 
} from '../services/ContextAwareBWConsultant';

interface UnifiedBWConsultantProps {
  context?: 'landing' | 'live-report';
  reportData?: Record<string, unknown> | object;
  onQueryProcessed?: (response: ConsultantResponse) => void;
  className?: string;
  minHeight?: string;
}

export const UnifiedBWConsultant: React.FC<UnifiedBWConsultantProps> = ({
  context,
  reportData,
  onQueryProcessed,
  className = '',
  minHeight = 'h-96'
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ConsultantResponse | null>(null);
  const [detectedContext, setDetectedContext] = useState<'landing' | 'live-report'>(context || 'landing');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-detect context if not provided
    if (!context) {
      const detected = ContextAwareBWConsultant.detectContext();
      setDetectedContext(detected);
    } else {
      setDetectedContext(context);
    }
  }, [context]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const result = await ContextAwareBWConsultant.processQuery(
        input,
        detectedContext,
        reportData as Record<string, unknown>
      );
      
      setResponse(result);
      onQueryProcessed?.(result);
      setInput('');
    } catch (error) {
      console.error('BW Consultant error:', error);
      setResponse({
        format: 'chat-response',
        context: detectedContext,
        timestamp: new Date().toISOString(),
        message: 'I encountered an error processing your query. Please try again.'
      } as ConsultantResponse);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col bg-white border border-stone-200 rounded-lg overflow-hidden ${className}`}>
      {/* HEADER */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white border-b border-blue-900">
        <Brain size={16} />
        <span className="font-bold text-sm">BW Consultant</span>
        <span className="text-xs opacity-75">
          {detectedContext === 'landing' ? '📋 Fact Sheet' : '💬 Live Guide'}
        </span>
      </div>

      {/* CONTENT AREA */}
      <div className={`flex-1 overflow-y-auto ${minHeight} p-4 space-y-4 bg-stone-50 custom-scrollbar`}>
        {!response ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Brain size={40} className="text-stone-300 mb-2" />
            <p className="text-sm text-stone-600">
              {detectedContext === 'landing' 
                ? 'Ask about any location, company, or topic for instant fact sheets'
                : 'I\'m here to guide you through building your report'}
            </p>
          </div>
        ) : response.format === 'fact-sheet' ? (
          // FACT SHEET MODE (Landing Page)
          <FactSheetDisplay response={response as FactSheetResponse} />
        ) : response.format === 'chat-response' ? (
          // CHAT MODE (Live Report)
          <ChatDisplay response={response as ChatResponse} />
        ) : null
        }
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <form onSubmit={handleSubmit} className="border-t border-stone-200 p-3 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            detectedContext === 'landing'
              ? 'Search location, company, topic...'
              : 'Ask for guidance or help...'
          }
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>

      {/* INFO */}
      <div className="px-3 py-2 bg-blue-50 border-t border-blue-200 text-[10px] text-blue-700">
        <strong>NSIL v3.2</strong> — Powered by multi-agent intelligence
      </div>
    </div>
  );
};

/**
 * FACT SHEET DISPLAY (Landing Page)
 */
const FactSheetDisplay: React.FC<{ response: FactSheetResponse }> = ({ response }) => (
  <div className="space-y-4">
    <div className="border-b-2 border-blue-300 pb-3">
      <h2 className="text-sm font-bold text-stone-900">{response.title}</h2>
      <p className="text-xs text-stone-600">Topic: {response.topic}</p>
    </div>

    {/* SECTIONS */}
    {response.sections.map((section, idx) => (
      <div key={idx} className="bg-white p-3 rounded-lg border border-stone-200">
        <h3 className="font-semibold text-xs text-blue-900 mb-2 flex items-center gap-2">
          {section.icon && <span>{section.icon}</span>}
          {section.heading}
        </h3>
        <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
          {section.content}
        </p>
      </div>
    ))}

    {/* LIVE DATA */}
    {response.liveData && (
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-300">
        <h3 className="font-semibold text-xs text-emerald-900 mb-2">📊 Live Market Data</h3>
        <div className="grid grid-cols-2 gap-2">
          {response.liveData.gdp && (
            <div className="text-xs">
              <p className="text-emerald-700 font-medium">GDP</p>
              <p className="text-emerald-900 font-bold">${(response.liveData.gdp / 1e12).toFixed(2)}T</p>
            </div>
          )}
          {response.liveData.population && (
            <div className="text-xs">
              <p className="text-emerald-700 font-medium">Population</p>
              <p className="text-emerald-900 font-bold">{(response.liveData.population / 1e6).toFixed(1)}M</p>
            </div>
          )}
          {response.liveData.growth && (
            <div className="text-xs">
              <p className="text-emerald-700 font-medium">Growth</p>
              <p className="text-emerald-900 font-bold">{response.liveData.growth.toFixed(2)}%/yr</p>
            </div>
          )}
          <div className="text-xs">
            <p className="text-emerald-700 font-medium">Confidence</p>
            <p className="text-emerald-900 font-bold">{(response.confidence * 100).toFixed(0)}%</p>
          </div>
        </div>
        {response.liveData.sources && (
          <p className="text-xs text-emerald-600 mt-2">
            Sources: {response.liveData.sources.join(', ')}
          </p>
        )}
      </div>
    )}

    {/* KEY METRICS */}
    {Object.keys(response.keyMetrics).length > 0 && (
      <div className="bg-stone-100 p-3 rounded-lg">
        <h3 className="font-semibold text-xs text-stone-900 mb-2">📈 Key Metrics</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(response.keyMetrics).map(([key, value]) => (
            <div key={key} className="text-xs">
              <p className="text-stone-600 font-medium capitalize">{key}</p>
              <p className="text-stone-900 font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

/**
 * CHAT DISPLAY (Live Report Sidebar)
 */
const ChatDisplay: React.FC<{ response: ChatResponse }> = ({ response }) => (
  <div className="space-y-3">
    {/* MESSAGE */}
    <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
      <p className="text-xs text-stone-800 leading-relaxed">{response.message}</p>
    </div>

    {/* GUIDANCE */}
    {response.guidance && (
      <div className="bg-amber-50 p-3 rounded-lg border border-amber-300 flex gap-2">
        <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">{response.guidance}</p>
      </div>
    )}

    {/* SUGGESTIONS */}
    {response.suggestions && response.suggestions.length > 0 && (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-300">
        <p className="text-xs font-semibold text-blue-900 mb-2">💡 Consider:</p>
        <ul className="space-y-1">
          {response.suggestions.map((suggestion, idx) => (
            <li key={idx} className="text-xs text-blue-800 flex gap-2">
              <span className="shrink-0">→</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* NEXT STEP */}
    {response.nextStep && (
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-300">
        <p className="text-xs text-emerald-900 font-semibold">🎯 {response.nextStep}</p>
      </div>
    )}
  </div>
);

export default UnifiedBWConsultant;
