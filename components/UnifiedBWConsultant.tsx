/**
 * UNIFIED BW CONSULTANT COMPONENT
 * 
 * Landing Page: Drawer/Modal with A4 fact sheet
 * Live Report: Normal chat interface showing conversational responses
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, Brain, X } from 'lucide-react';
import ContextAwareBWConsultant, { 
  ConsultantResponse, 
  FactSheetResponse
} from '../services/ContextAwareBWConsultant';

interface UnifiedBWConsultantProps {
  context?: 'landing' | 'live-report';
  reportData?: Record<string, unknown> | object;
  onQueryProcessed?: (response: ConsultantResponse) => void;
  className?: string;
  minHeight?: string;
}

/**
 * Landing Page: A4 Fact Sheet Drawer
 */
const FactSheetDrawer: React.FC<{ response: FactSheetResponse; onClose: () => void }> = ({ response, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-4">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    
    {/* A4 Drawer */}
    <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 z-10"
      >
        <X size={20} />
      </button>

      {/* A4 Content */}
      <div className="p-8 space-y-4">
        {/* Header */}
        <div className="border-b pb-4">
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Fact Sheet</p>
          <h2 className="text-2xl font-bold text-stone-900">{response.title}</h2>
          <p className="text-sm text-stone-600 mt-1">Query: {response.topic}</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {response.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-bold text-stone-900 mb-2">{section.heading}</h3>
              <p className="text-sm text-stone-700 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Key Metrics */}
        {Object.keys(response.keyMetrics).length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-stone-900 mb-2">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(response.keyMetrics).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-stone-600">{key}</p>
                  <p className="font-semibold text-stone-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Data if available */}
        {response.liveData && (
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <h3 className="font-bold text-stone-900 mb-2">📊 Live Market Data</h3>
            <div className="space-y-1 text-sm">
              {response.liveData.gdp && <p><strong>GDP:</strong> {response.liveData.gdp}</p>}
              {response.liveData.population && <p><strong>Population:</strong> {response.liveData.population}</p>}
              {response.liveData.growth && <p><strong>Growth Rate:</strong> {response.liveData.growth}%</p>}
            </div>
          </div>
        )}

        {/* Confidence */}
        <p className="text-xs text-stone-500">Confidence: {Math.round(response.confidence * 100)}%</p>
      </div>
    </div>
  </div>
);

/**
 * Main Component
 */
export const UnifiedBWConsultant: React.FC<UnifiedBWConsultantProps> = ({
  context,
  reportData,
  onQueryProcessed,
  className = '',
  minHeight = 'h-96'
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedContext, setDetectedContext] = useState<'landing' | 'live-report'>(context || 'landing');
  
  // For landing page: store fact sheet response for drawer
  const [factSheetResponse, setFactSheetResponse] = useState<FactSheetResponse | null>(null);
  
  // For live report: store chat messages
  const [chatMessages, setChatMessages] = useState<Array<{ type: 'user' | 'bw'; text: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!context) {
      const detected = ContextAwareBWConsultant.detectContext();
      setDetectedContext(detected);
    } else {
      setDetectedContext(context);
    }
  }, [context]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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

      if (detectedContext === 'landing') {
        // Landing page: show fact sheet in drawer
        if (result.format === 'fact-sheet') {
          setFactSheetResponse(result);
        }
      } else {
        // Live report: show as natural chat
        setChatMessages(prev => [...prev, { type: 'user', text: input }]);
        if (result.format === 'chat-response') {
          setChatMessages(prev => [...prev, { type: 'bw', text: result.message }]);
        }
      }

      onQueryProcessed?.(result);
      setInput('');
    } catch (error) {
      console.error('BW Consultant error:', error);
      if (detectedContext === 'live-report') {
        setChatMessages(prev => [...prev, 
          { type: 'user', text: input },
          { type: 'bw', text: 'I encountered an error. Please try again.' }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Landing page UI
  if (detectedContext === 'landing') {
    return (
      <>
        <div className={`flex flex-col bg-white border border-stone-200 rounded-lg overflow-hidden ${className}`}>
          {/* HEADER */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white border-b border-blue-900">
            <Brain size={16} />
            <span className="font-bold text-sm">BW Consultant</span>
            <span className="text-xs opacity-75">📋 Fact Sheet</span>
          </div>

          {/* INPUT AREA */}
          <form onSubmit={handleSubmit} className="p-3 flex gap-2 bg-stone-50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search location, company, topic..."
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

        {/* Fact Sheet Drawer */}
        {factSheetResponse && (
          <FactSheetDrawer 
            response={factSheetResponse} 
            onClose={() => setFactSheetResponse(null)} 
          />
        )}
      </>
    );
  }

  // Live report UI (natural chat)
  return (
    <div className={`flex flex-col bg-white border border-stone-200 rounded-lg overflow-hidden ${className}`}>
      {/* HEADER */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white border-b border-blue-900">
        <Brain size={16} />
        <span className="font-bold text-sm">BW Consultant</span>
        <span className="text-xs opacity-75">💬 Live Chat</span>
      </div>

      {/* MESSAGES AREA */}
      <div className={`flex-1 overflow-y-auto ${minHeight} p-4 space-y-3 bg-stone-50 custom-scrollbar`}>
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Brain size={40} className="text-stone-300 mb-2" />
            <p className="text-sm text-stone-600">I'm here to help. Ask me anything.</p>
          </div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-900'
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <form onSubmit={handleSubmit} className="border-t border-stone-200 p-3 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for guidance or help..."
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

export default UnifiedBWConsultant;
