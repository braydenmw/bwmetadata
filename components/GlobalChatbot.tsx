import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, MessageCircle, ChevronDown } from 'lucide-react';
import { GlobalIssueResolver, type IssueAnalysis } from '../services/GlobalIssueResolver';
import { IssueAnalysisPanel } from './IssueAnalysisPanel';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  analysis?: IssueAnalysis;
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
      content: 'BW Consultant AI - Global Issue Resolver',
      timestamp: new Date()
    },
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to BW Consultant AI. I can help you analyze any global issue - whether it\'s a location development opportunity, market analysis, investment decision, policy impact, or strategic challenge.\n\nWhat issue or challenge can I help you explore today?',
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resolverRef = useRef(new GlobalIssueResolver());

  const formatAnalysisResponse = (analysis: IssueAnalysis): string => {
    return `
**Analysis Complete**

**Issue Category:** ${analysis.issueCategory}

**Root Causes:**
${analysis.rootCauses.map((cause, i) => `${i + 1}. ${cause}`).join('\n')}

**Strategic Recommendations:**
${analysis.strategicRecommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**Timeline:** ${analysis.timeline}

**Overall Confidence:** ${(analysis.overallConfidence * 100).toFixed(0)}%

*Expand below to see detailed analysis, NSIL layers, implementation roadmap, risk mitigation, stakeholder analysis, and document recommendations.*
    `.trim();
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

    // Add user message
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
      // Resolve the issue
      const analysis = await resolverRef.current.resolveIssue(userQuery);

      // Format the response

      // Create assistant response with analysis
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: formatAnalysisResponse(analysis),
        analysis: analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Callback for parent component
      if (onAnalysis) {
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
          <h2 className="text-lg font-semibold text-white">BW Consultant AI</h2>
        </div>
        <p className="text-sm text-blue-100">Global Issue Resolution • Universal Problem-Solver</p>
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
                    <div className="mt-4">
                      <IssueAnalysisPanel analysis={message.analysis} />
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
            placeholder="Describe any global issue or challenge..."
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
        <p className="text-xs text-slate-400 mt-2">Try: "Analyze Singapore's startup ecosystem" or "What's the investment case for Angola?"</p>
      </div>
    </div>
  );
};
