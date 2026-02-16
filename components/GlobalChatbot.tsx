import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, MessageCircle, ChevronDown } from 'lucide-react';
import { GlobalIssueResolver, type IssueAnalysis } from '../services/GlobalIssueResolver';
import { bwConsultantAI, type ConsultantInsight } from '../services/BWConsultantAgenticAI';
import { ReactiveIntelligenceEngine } from '../services/ReactiveIntelligenceEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  analysis?: IssueAnalysis;
  insights?: ConsultantInsight[];
  timestamp: Date;
}

interface GlobalChatbotProps {
  context?: 'landing' | 'report' | 'standalone';
  onAnalysis?: (analysis: IssueAnalysis) => void;
}

export const GlobalChatbot: React.FC<GlobalChatbotProps> = ({ context = 'standalone', onAnalysis }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'system',
      content: 'BW Consultant AI — Unified Intelligence',
      timestamp: new Date()
    },
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to BW Consultant AI. I combine NSIL analysis, live intelligence, and strategic consulting to help you navigate any global business challenge — locations, markets, investments, policies, infrastructure, or regional development.\n\nDescribe your challenge and I\'ll provide real-time analysis with actionable recommendations.',
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resolverRef = useRef(new GlobalIssueResolver());

  const formatUnifiedResponse = (analysis: IssueAnalysis, insights: ConsultantInsight[], liveEvidence: Array<{ title: string; snippet?: string }>): string => {
    let response = '**BW Consultant AI — Analysis Complete**\n\n';

    // Add consultant insights first (most dynamic)
    if (insights.length > 0) {
      response += '**Live Intelligence:**\n';
      for (const insight of insights.slice(0, 3)) {
        response += `• **${insight.title}** (${(insight.confidence * 100).toFixed(0)}% confidence): ${insight.content}\n`;
      }
      response += '\n';
    }

    // Add live evidence
    if (liveEvidence.length > 0) {
      response += '**Real-Time Sources:**\n';
      for (const ev of liveEvidence.slice(0, 3)) {
        response += `• ${ev.title}${ev.snippet ? `: ${ev.snippet.slice(0, 120)}...` : ''}\n`;
      }
      response += '\n';
    }

    // Core analysis
    response += `**Issue Category:** ${analysis.issueCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;
    response += '**Strategic Recommendations:**\n';
    response += analysis.strategicRecommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n');
    response += `\n\n**Timeline:** ${analysis.timeline}`;
    response += `\n**Overall Confidence:** ${(analysis.overallConfidence * 100).toFixed(0)}%`;
    response += '\n\n*Expand below for NSIL layers, implementation roadmap, risk mitigation, and stakeholder analysis.*';

    return response;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userQuery = input.trim();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userQuery,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      // Extract context hints from query
      const qLower = userQuery.toLowerCase();
      const consultParams: Record<string, unknown> = { query: userQuery };
      const countries = ['philippines', 'vietnam', 'thailand', 'indonesia', 'malaysia', 'singapore', 'japan', 'china', 'india', 'korea', 'cambodia'];
      for (const c of countries) {
        if (qLower.includes(c)) { consultParams.country = c.charAt(0).toUpperCase() + c.slice(1); break; }
      }
      const industries = ['technology', 'manufacturing', 'healthcare', 'agriculture', 'finance', 'energy', 'mining', 'tourism', 'logistics'];
      const matchedInds: string[] = [];
      for (const ind of industries) { if (qLower.includes(ind)) matchedInds.push(ind); }
      if (matchedInds.length) consultParams.industry = matchedInds;

      // Run all three intelligence systems in parallel
      const [consultInsights, issueAnalysis, liveEvidence] = await Promise.all([
        bwConsultantAI.consult(consultParams, 'chatbot_query').catch(() => [] as ConsultantInsight[]),
        resolverRef.current.resolveIssue(userQuery).catch(() => null as IssueAnalysis | null),
        ReactiveIntelligenceEngine.liveSearch(userQuery, consultParams).catch(() => [] as Array<{ title: string; snippet?: string }>)
      ]);

      // Build unified response
      const analysis = issueAnalysis || await resolverRef.current.resolveIssue(userQuery);
      const responseContent = formatUnifiedResponse(analysis, consultInsights, liveEvidence);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        analysis: analysis,
        insights: consultInsights,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (onAnalysis && analysis) {
        onAnalysis(analysis);
      }
    } catch (_error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error analyzing your request. Please try again with a different query.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden ${context === 'landing' ? 'max-h-96' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 border-b border-blue-500/30">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle size={20} className="text-white" />
          <h2 className="text-lg font-semibold text-white">Strategic Analysis</h2>
        </div>
        <p className="text-sm text-blue-100">Ask about any global business, market, policy, or development challenge</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-lg rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : message.role === 'system'
                  ? 'bg-slate-700 text-blue-200 text-center w-full'
                  : 'bg-slate-700 text-white rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {/* Analysis Expansion */}
              {message.analysis && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <button
                    onClick={() => setExpandedMessageId(expandedMessageId === message.id ? null : message.id)}
                    className="flex items-center gap-2 text-xs text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${expandedMessageId === message.id ? 'rotate-180' : ''}`}
                    />
                    {expandedMessageId === message.id ? 'Hide Details' : 'View Full Analysis'}
                  </button>

                  {expandedMessageId === message.id && (
                    <div className="mt-4 space-y-3 text-xs text-slate-200 bg-slate-800 -mx-4 -mb-3 px-4 py-3 rounded-b">
                      <div>
                        <p className="font-semibold text-blue-300 mb-1">NSIL Layers:</p>
                        <div className="space-y-1">
                          {message.analysis.nsisLayers.slice(0, 3).map((layer) => (
                            <p key={layer.layer} className="text-slate-300">
                              Layer {layer.layer}: {layer.name} ({(layer.confidence * 100).toFixed(0)}%)
                            </p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-green-300 mb-1">Strategic Recommendations:</p>
                        {message.analysis.strategicRecommendations.slice(0, 2).map((rec, i) => (
                          <p key={i} className="text-slate-300">* {rec}</p>
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold text-purple-300 mb-1">Implementation Timeline:</p>
                        <p className="text-slate-300">{message.analysis.timeline}</p>
                      </div>
                      <button
                        className="w-full text-center mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                        onClick={() => {
                          // Would open detailed analysis panel here
                          console.log('Open full analysis:', message.analysis);
                        }}
                      >
                        View Complete Analysis 
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-white rounded-lg rounded-bl-none px-4 py-3 flex items-center gap-2">
              <Loader size={16} className="animate-spin text-blue-400" />
              <span className="text-sm">Analyzing your issue...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your challenge or question..."
            className="flex-1 bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
          >
            {isThinking ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-2">Example: "What are the market opportunities in Vietnam?" or "Analyze the regulatory landscape for renewable energy"</p>
      </div>
    </div>
  );
};
