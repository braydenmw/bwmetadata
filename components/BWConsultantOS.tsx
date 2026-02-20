/**
 * BW CONSULTANT OS - Case Study Builder
 * 
 * Flow:
 * 1. Baseline Intake - Who are you? What do you need?
 * 2. Case Building - AI asks follow-up questions to understand the matter
 * 3. Case Summary - AI synthesizes understanding
 * 4. Document Recommendations - Based on case, suggest reports/letters
 * 5. Document Generation - Create the recommended outputs
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bot, Send, Paperclip, Loader2, X, Maximize2,
  FileText, Mail, Briefcase, Shield, BarChart3, Users, Scale, 
  Globe, FileCheck, PenTool, Download, Copy, Check, Building2,
  User, HelpCircle, Target, ChevronRight
} from 'lucide-react';
import { getChatSession } from '../services/geminiService';

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  phase?: CasePhase;
}

interface CaseStudy {
  organizationName: string;
  organizationType: string;
  contactRole: string;
  situationType: string;
  currentMatter: string;
  objectives: string;
  constraints: string;
  timeline: string;
  additionalContext: string[];
  uploadedDocuments: string[];
  aiInsights: string[];
}

type CasePhase = 'intake' | 'discovery' | 'analysis' | 'recommendations' | 'generation';

interface DocumentOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'report' | 'letter';
  relevance: number; // 0-100 based on case
}

// ============================================================================
// COMPONENT
// ============================================================================

interface BWConsultantOSProps {
  onOpenWorkspace?: (payload?: { query?: string; results?: Record<string, unknown>[] }) => void;
  embedded?: boolean;
}

const BWConsultantOS: React.FC<BWConsultantOSProps> = ({ onOpenWorkspace, embedded = false }) => {
  // Core state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<CasePhase>('intake');
  
  // Case study state
  const [caseStudy, setCaseStudy] = useState<CaseStudy>({
    organizationName: '',
    organizationType: '',
    contactRole: '',
    situationType: '',
    currentMatter: '',
    objectives: '',
    constraints: '',
    timeline: '',
    additionalContext: [],
    uploadedDocuments: [],
    aiInsights: []
  });

  // File upload
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Workspace modal
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  
  // Document generation
  const [recommendedDocs, setRecommendedDocs] = useState<DocumentOption[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSession = useRef(getChatSession());
  const intakeQuestionIndex = useRef(0);

  // Intake questions progression
  const intakeQuestions = [
    {
      key: 'greeting',
      question: `Hello, I'm your BW Consultant AI. I'm here to help you build a comprehensive case study and generate the professional documents you need.

Let's start with the basics:

**What is your name and organization?**`
    },
    {
      key: 'role',
      question: `Thank you. To better understand your perspective:

**What is your role within the organization?** (e.g., CEO, Project Manager, Legal Counsel, Business Development)`
    },
    {
      key: 'situationType',
      question: `Now, help me understand what brought you here today:

**What type of situation are you dealing with?**
- Investment or funding opportunity
- Partnership or joint venture
- Market entry or expansion
- Regulatory or compliance matter
- Dispute or litigation
- Strategic decision
- Due diligence requirement
- Something else

Just describe it in your own words.`
    },
    {
      key: 'currentMatter',
      question: `I understand. Now let's get into the specifics:

**Tell me about your current matter in detail.** 

What's happening? Who are the key parties involved? What decisions need to be made? Share as much context as you can — I'll ask clarifying questions as needed.`
    },
    {
      key: 'objectives',
      question: `That helps me understand the situation. Now:

**What are you hoping to achieve?**

What would a successful outcome look like for you? What are your primary goals and any secondary objectives?`
    },
    {
      key: 'constraints',
      question: `Almost there. Let me understand your constraints:

**What limitations or constraints should I be aware of?**

Consider: budget, timeline, regulatory requirements, stakeholder concerns, resource availability, or any other factors that may impact what's possible.`
    }
  ];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Intake questions (static)
  const intakeQuestionsRef = useRef(intakeQuestions);

  // Start with first intake question
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: intakeQuestionsRef.current[0].question,
        timestamp: new Date(),
        phase: 'intake'
      };
      setMessages([initialMessage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Read file content
  const readFileContent = useCallback(async (file: File): Promise<string> => {
    const lowerName = file.name.toLowerCase();
    const isText = file.type.startsWith('text/') || 
      ['.txt', '.md', '.csv', '.json', '.html', '.xml', '.ts', '.tsx', '.js', '.jsx', '.pdf'].some(ext => lowerName.endsWith(ext));
    
    if (!isText || lowerName.endsWith('.pdf')) {
      return `[${file.name}] — Document uploaded (content extraction requires processing)`;
    }
    
    try {
      const text = await file.text();
      return `[${file.name}]\n${text.slice(0, 5000)}${text.length > 5000 ? '\n...(truncated)' : ''}`;
    } catch {
      return `[${file.name}] — Unable to read file content`;
    }
  }, []);

  // Process user input through real AI
  const processWithAI = useCallback(async (userInput: string, context: string): Promise<string> => {
    try {
      const systemPrompt = `You are BW Consultant AI, an expert business intelligence consultant. You are currently in the "${currentPhase}" phase of building a case study.

Current case context:
${JSON.stringify(caseStudy, null, 2)}

User's latest input: "${userInput}"
Phase context: ${context}

Instructions based on phase:
- INTAKE: Ask clarifying questions to gather baseline information. Be warm but professional.
- DISCOVERY: Probe deeper into the specifics. Ask about stakeholders, risks, opportunities, and details not yet covered.
- ANALYSIS: Synthesize what you've learned. Identify patterns, risks, and opportunities.
- RECOMMENDATIONS: Based on the case, recommend specific documents and letters that would help.
- GENERATION: Generate professional document content.

Respond naturally and helpfully. If in intake/discovery, end with a clarifying question. Keep responses focused and actionable.`;

      const response = await chatSession.current.sendMessage({ 
        message: `${systemPrompt}\n\nUser says: ${userInput}` 
      });
      
      return response.text || "I understand. Let me process that information.";
    } catch (error) {
      console.error('AI processing error:', error);
      return "I'm having trouble connecting to my analysis engine. Let me continue with what I understand so far.";
    }
  }, [currentPhase, caseStudy]);

  // Handle intake progression
  const progressIntake = useCallback((userResponse: string) => {
    const currentQ = intakeQuestionsRef.current[intakeQuestionIndex.current];
    
    // Update case study based on which question was answered
    switch (currentQ.key) {
      case 'greeting':
        setCaseStudy(prev => ({ ...prev, organizationName: userResponse }));
        break;
      case 'role':
        setCaseStudy(prev => ({ ...prev, contactRole: userResponse }));
        break;
      case 'situationType':
        setCaseStudy(prev => ({ ...prev, situationType: userResponse }));
        break;
      case 'currentMatter':
        setCaseStudy(prev => ({ ...prev, currentMatter: userResponse }));
        break;
      case 'objectives':
        setCaseStudy(prev => ({ ...prev, objectives: userResponse }));
        break;
      case 'constraints':
        setCaseStudy(prev => ({ ...prev, constraints: userResponse }));
        break;
    }

    intakeQuestionIndex.current += 1;

    // Check if intake complete
    if (intakeQuestionIndex.current >= intakeQuestionsRef.current.length) {
      setCurrentPhase('discovery');
      return null; // Signal to use AI for next response
    }

    return intakeQuestionsRef.current[intakeQuestionIndex.current].question;
  }, []);

  // Generate document recommendations based on case
  const generateRecommendations = useCallback(() => {
    const docs: DocumentOption[] = [];
    const caseType = caseStudy.situationType.toLowerCase();
    
    // Investment/funding situations
    if (caseType.includes('invest') || caseType.includes('fund')) {
      docs.push(
        { id: 'investment-memo', title: 'Investment Memorandum', description: 'Structured funding proposal', icon: <BarChart3 size={18} />, category: 'report', relevance: 95 },
        { id: 'due-diligence', title: 'Due Diligence Report', description: 'Comprehensive analysis', icon: <Shield size={18} />, category: 'report', relevance: 90 },
        { id: 'investor-update', title: 'Investor Update Letter', description: 'Progress communication', icon: <FileText size={18} />, category: 'letter', relevance: 70 }
      );
    }
    
    // Partnership situations
    if (caseType.includes('partner') || caseType.includes('joint') || caseType.includes('jv')) {
      docs.push(
        { id: 'partnership-letter', title: 'Partnership Proposal', description: 'Formal proposal letter', icon: <Mail size={18} />, category: 'letter', relevance: 95 },
        { id: 'stakeholder-report', title: 'Stakeholder Analysis', description: 'Relationship mapping', icon: <Users size={18} />, category: 'report', relevance: 85 },
        { id: 'due-diligence', title: 'Partner Due Diligence', description: 'Partner vetting', icon: <Shield size={18} />, category: 'report', relevance: 80 }
      );
    }
    
    // Market entry
    if (caseType.includes('market') || caseType.includes('entry') || caseType.includes('expan')) {
      docs.push(
        { id: 'country-brief', title: 'Market Intelligence Brief', description: 'Location analysis', icon: <Globe size={18} />, category: 'report', relevance: 95 },
        { id: 'executive-report', title: 'Executive Summary', description: 'Leadership overview', icon: <Briefcase size={18} />, category: 'report', relevance: 85 }
      );
    }
    
    // Regulatory/compliance
    if (caseType.includes('regul') || caseType.includes('compli') || caseType.includes('legal')) {
      docs.push(
        { id: 'compliance-report', title: 'Compliance Assessment', description: 'Regulatory review', icon: <Scale size={18} />, category: 'report', relevance: 95 },
        { id: 'govt-submission', title: 'Government Submission', description: 'Official correspondence', icon: <FileCheck size={18} />, category: 'letter', relevance: 90 }
      );
    }
    
    // Always offer executive summary and custom
    if (!docs.find(d => d.id === 'executive-report')) {
      docs.push({ id: 'executive-report', title: 'Executive Summary', description: 'Leadership overview', icon: <Briefcase size={18} />, category: 'report', relevance: 60 });
    }
    docs.push({ id: 'custom', title: 'Custom Document', description: 'Specify your needs', icon: <PenTool size={18} />, category: 'report', relevance: 50 });
    
    // Sort by relevance
    docs.sort((a, b) => b.relevance - a.relevance);
    setRecommendedDocs(docs);
  }, [caseStudy.situationType]);

  // Handle send message
  const handleSend = useCallback(async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    let userContent = inputValue.trim();
    
    // Process uploaded files
    if (uploadedFiles.length > 0) {
      const fileContents = await Promise.all(uploadedFiles.map(readFileContent));
      userContent += `\n\n**Uploaded Documents:**\n${fileContents.join('\n\n')}`;
      setCaseStudy(prev => ({
        ...prev,
        uploadedDocuments: [...prev.uploadedDocuments, ...uploadedFiles.map(f => f.name)]
      }));
    }

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userContent,
      timestamp: new Date(),
      phase: currentPhase
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      let responseContent: string;

      if (currentPhase === 'intake') {
        // Use structured intake progression
        const nextQuestion = progressIntake(userContent);
        if (nextQuestion) {
          responseContent = nextQuestion;
        } else {
          // Intake complete, transition to discovery with AI
          responseContent = await processWithAI(
            userContent, 
            `User has completed baseline intake. Now entering discovery phase. Based on what you know, ask deeper questions about their specific situation, stakeholders involved, risks, timeline, and any other relevant details. Build understanding to recommend appropriate documents.`
          );
          
          // Update case with additional context
          setCaseStudy(prev => ({
            ...prev,
            additionalContext: [...prev.additionalContext, userContent]
          }));
        }
      } else if (currentPhase === 'discovery') {
        // AI-driven discovery
        responseContent = await processWithAI(
          userContent,
          `Continue gathering information. If you have enough context (organization, situation, objectives, constraints, key details), transition to analysis by summarizing what you understand and asking if anything is missing. Otherwise, ask another clarifying question.`
        );
        
        setCaseStudy(prev => ({
          ...prev,
          additionalContext: [...prev.additionalContext, userContent]
        }));

        // Check if ready to move to recommendations
        const discoveryCount = messages.filter(m => m.phase === 'discovery' && m.role === 'user').length;
        if (discoveryCount >= 3) {
          setCurrentPhase('analysis');
          generateRecommendations();
        }
      } else if (currentPhase === 'analysis') {
        responseContent = await processWithAI(
          userContent,
          `You are now analyzing the case. Provide a brief synthesis of what you understand, identify key insights, and transition to recommending specific documents that would help this situation.`
        );
        setCurrentPhase('recommendations');
        generateRecommendations();
      } else if (currentPhase === 'recommendations') {
        // User is selecting documents
        responseContent = await processWithAI(
          userContent,
          `User is in document selection phase. Help them choose the right documents or proceed to generation if they've selected.`
        );
      } else {
        // Generation phase
        responseContent = await processWithAI(
          userContent,
          `Generate professional document content based on the case study and user's request.`
        );
        setGeneratedContent(responseContent);
      }

      // Add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        phase: currentPhase
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Send error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I encountered an issue processing your request. Please try again.",
        timestamp: new Date(),
        phase: currentPhase
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, uploadedFiles, currentPhase, readFileContent, progressIntake, processWithAI, generateRecommendations, messages]);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  // Copy generated content
  const copyContent = useCallback(() => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedContent]);

  // Download generated content
  const downloadContent = useCallback(() => {
    if (generatedContent) {
      const blob = new Blob([generatedContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bw-document-${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [generatedContent]);

  // Generate selected documents
  const handleGenerateDocuments = useCallback(async () => {
    if (selectedDocs.length === 0) return;
    
    setCurrentPhase('generation');
    setIsLoading(true);
    
    const docNames = selectedDocs.map(id => recommendedDocs.find(d => d.id === id)?.title).filter(Boolean).join(', ');
    
    try {
      const response = await processWithAI(
        `Generate the following documents: ${docNames}`,
        `Based on the complete case study, generate professional document content for: ${docNames}. Format with proper markdown headings, sections, and professional language. Include all relevant details from the case study.`
      );
      
      setGeneratedContent(response);
      
      const genMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I've generated your documents. You can view, copy, or download them from the panel on the right.\n\n---\n\n${response}`,
        timestamp: new Date(),
        phase: 'generation'
      };
      setMessages(prev => [...prev, genMessage]);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDocs, recommendedDocs, processWithAI]);

  // Phase indicator
  const phaseLabels: Record<CasePhase, { label: string; description: string }> = {
    intake: { label: 'Intake', description: 'Understanding who you are' },
    discovery: { label: 'Discovery', description: 'Learning about your situation' },
    analysis: { label: 'Analysis', description: 'Synthesizing insights' },
    recommendations: { label: 'Recommendations', description: 'Selecting documents' },
    generation: { label: 'Generation', description: 'Creating your documents' }
  };

  return (
    <div 
      className={`${embedded ? '' : 'min-h-screen bg-white'}`}
      style={{ fontFamily: "'Söhne', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
    >
      <div className="h-screen flex flex-col">
        {/* Blue Banner Header */}
        <div 
          className="px-6 py-4 flex items-center justify-between relative overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=300&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-900/70" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Bot size={24} className="text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">BW Consultant</h1>
                <span className="text-blue-200 text-xs">Powered by NSIL v6.0 • Case Study Builder</span>
              </div>
            </div>
          </div>
          
          {/* Phase Indicator */}
          <div className="relative z-10 hidden md:flex items-center gap-2">
            {Object.entries(phaseLabels).map(([phase, info], idx) => (
              <React.Fragment key={phase}>
                {idx > 0 && <ChevronRight size={14} className="text-blue-300/50" />}
                <div className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  currentPhase === phase 
                    ? 'bg-white text-blue-800' 
                    : Object.keys(phaseLabels).indexOf(currentPhase) > idx 
                      ? 'bg-blue-700/50 text-blue-100'
                      : 'bg-blue-800/30 text-blue-300/70'
                }`}>
                  {info.label}
                </div>
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => setShowWorkspaceModal(true)}
            className="relative z-10 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium flex items-center gap-2 border border-white/20 transition-all"
          >
            <Maximize2 size={16} />
            Full Analysis
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel */}
          <div className="flex-1 flex flex-col bg-stone-50">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot size={40} className="text-blue-200 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">How can I help you today?</h3>
                  <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
                    I'll guide you through building a comprehensive case study and generate the professional documents you need.
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-w-lg">
                    {[
                      { label: 'Investment Analysis', example: 'Review partnership opportunity' },
                      { label: 'Market Entry', example: 'Expand into new region' },
                      { label: 'Due Diligence', example: 'Assess company risk profile' },
                      { label: 'Strategic Decision', example: 'Evaluate acquisition target' },
                    ].map((hint, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInputValue(hint.example)}
                        className="text-left px-4 py-3 bg-white border border-stone-200 hover:border-blue-400 hover:shadow transition-all group"
                      >
                        <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{hint.label}</p>
                        <p className="text-xs text-slate-400">{hint.example}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-stone-200 text-stone-900 shadow-sm'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <Bot size={12} className="text-blue-600" />
                            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">BW Consultant</span>
                          </div>
                        )}
                        <div 
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ 
                            __html: msg.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                              .replace(/\n/g, '<br />')
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 bg-white border border-stone-200 shadow-sm flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-blue-600" />
                        <span className="text-sm text-slate-500">
                          {currentPhase === 'generation' ? 'Generating documents...' : 'Analyzing...'}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="px-6 py-2 border-t border-stone-200 bg-white">
                <p className="text-xs text-slate-500 mb-1">Attached files:</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 border border-blue-200 flex items-center gap-1">
                      <Paperclip size={12} />
                      {file.name}
                      <button 
                        onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                        className="ml-1 hover:text-blue-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-stone-200 bg-white">
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-stone-100 hover:bg-stone-200 text-slate-600 border border-stone-300 transition-all"
                  title="Upload documents"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                  accept=".txt,.md,.csv,.json,.pdf,.doc,.docx"
                />
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    currentPhase === 'intake' 
                      ? "Type your response..." 
                      : currentPhase === 'recommendations'
                        ? "Select documents or describe what you need..."
                        : "Share more details or ask questions..."
                  }
                  className="flex-1 resize-none border border-stone-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[48px] max-h-[150px] leading-relaxed"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={(!inputValue.trim() && uploadedFiles.length === 0) || isLoading}
                  className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 ${
                    (!inputValue.trim() && uploadedFiles.length === 0) || isLoading
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Send
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Enter to send • Shift+Enter new line
              </p>
            </div>

            {/* NSIL Footer */}
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 text-[10px] text-blue-700">
              <strong>NSIL v6.0</strong> — Sovereign-grade intelligence • Real-time analysis • Professional insights
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l border-stone-200 bg-white flex flex-col">
            {/* Case Summary */}
            <div className="p-4 border-b border-stone-200 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 size={16} className="text-blue-600" />
                Case Summary
              </h2>
              <div className="mt-3 space-y-2 text-xs">
                {caseStudy.organizationName && (
                  <div className="flex items-start gap-2">
                    <User size={12} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-slate-500">Organization:</span>
                      <p className="text-slate-900 font-medium">{caseStudy.organizationName}</p>
                    </div>
                  </div>
                )}
                {caseStudy.situationType && (
                  <div className="flex items-start gap-2">
                    <HelpCircle size={12} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-slate-500">Situation:</span>
                      <p className="text-slate-700">{caseStudy.situationType.slice(0, 100)}</p>
                    </div>
                  </div>
                )}
                {caseStudy.objectives && (
                  <div className="flex items-start gap-2">
                    <Target size={12} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-slate-500">Objective:</span>
                      <p className="text-slate-700">{caseStudy.objectives.slice(0, 100)}</p>
                    </div>
                  </div>
                )}
                {caseStudy.uploadedDocuments.length > 0 && (
                  <div className="flex items-start gap-2">
                    <FileText size={12} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-slate-500">Documents:</span>
                      <p className="text-slate-700">{caseStudy.uploadedDocuments.length} uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Document Recommendations */}
            {(currentPhase === 'recommendations' || currentPhase === 'generation' || recommendedDocs.length > 0) && (
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Recommended Documents</h3>
                <div className="space-y-2">
                  {recommendedDocs.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        if (selectedDocs.includes(doc.id)) {
                          setSelectedDocs(prev => prev.filter(d => d !== doc.id));
                        } else {
                          setSelectedDocs(prev => [...prev, doc.id]);
                        }
                      }}
                      className={`w-full p-3 text-left transition-all border ${
                        selectedDocs.includes(doc.id)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-blue-50 text-slate-900 border-stone-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${selectedDocs.includes(doc.id) ? 'text-white' : 'text-blue-600'}`}>
                          {doc.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.title}</p>
                          <p className={`text-xs ${selectedDocs.includes(doc.id) ? 'text-blue-100' : 'text-slate-500'}`}>
                            {doc.description}
                          </p>
                        </div>
                        <div className={`text-xs font-medium ${selectedDocs.includes(doc.id) ? 'text-blue-200' : 'text-blue-600'}`}>
                          {doc.relevance}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedDocs.length > 0 && currentPhase !== 'generation' && (
                  <button
                    onClick={handleGenerateDocuments}
                    disabled={isLoading}
                    className={`mt-4 w-full py-3 font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      isLoading
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate {selectedDocs.length} Document{selectedDocs.length > 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Generated Content Actions */}
            {generatedContent && (
              <div className="p-4 border-t border-stone-200 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-900">Document Ready</p>
                  <div className="flex gap-1">
                    <button
                      onClick={copyContent}
                      className="p-2 bg-white hover:bg-stone-100 text-slate-600 border border-stone-200"
                      title="Copy"
                    >
                      {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={downloadContent}
                      className="p-2 bg-white hover:bg-stone-100 text-slate-600 border border-stone-200"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600">Copy or download your generated documents.</p>
              </div>
            )}

            {/* Help text when no recommendations yet */}
            {recommendedDocs.length === 0 && currentPhase !== 'generation' && (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <HelpCircle size={32} className="mx-auto mb-2 text-blue-200" />
                  <p className="text-sm text-slate-600">Answer the questions to build your case.</p>
                  <p className="text-xs mt-1 text-slate-500">I'll recommend documents once I understand your situation.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workspace Modal */}
      {showWorkspaceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-stone-200">
            {/* Modal Header - Blue Banner */}
            <div 
              className="px-6 py-4 flex items-center justify-between relative overflow-hidden"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=300&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-900/70" />
              <div className="relative z-10">
                <p className="text-blue-200 uppercase tracking-wider text-xs font-semibold mb-0.5">Full Analysis</p>
                <h2 className="text-xl font-bold text-white">Case Study Workspace</h2>
              </div>
              <button
                onClick={() => setShowWorkspaceModal(false)}
                className="relative z-10 p-2 hover:bg-white/10 text-white border border-white/20"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-stone-50">
              <div className="grid grid-cols-3 gap-6">
                {/* Case Overview */}
                <div className="bg-white p-4 border border-stone-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3">Case Overview</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-500">Organization:</span>
                      <p className="font-medium text-slate-900">{caseStudy.organizationName || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Role:</span>
                      <p className="font-medium text-slate-900">{caseStudy.contactRole || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Situation Type:</span>
                      <p className="font-medium text-slate-900">{caseStudy.situationType || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Current Matter */}
                <div className="bg-white p-4 border border-stone-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3">Current Matter</h3>
                  <p className="text-sm text-slate-700">
                    {caseStudy.currentMatter || 'Details will appear as you share them with the AI.'}
                  </p>
                </div>

                {/* Objectives */}
                <div className="bg-white p-4 border border-stone-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3">Objectives</h3>
                  <p className="text-sm text-slate-700">
                    {caseStudy.objectives || 'Your goals will be captured here.'}
                  </p>
                </div>

                {/* Uploaded Documents */}
                <div className="bg-white p-4 border border-stone-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3">Uploaded Documents</h3>
                  {caseStudy.uploadedDocuments.length > 0 ? (
                    <ul className="space-y-1">
                      {caseStudy.uploadedDocuments.map((doc, i) => (
                        <li key={i} className="text-sm flex items-center gap-2 text-slate-700">
                          <FileText size={14} className="text-blue-600" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No documents uploaded yet.</p>
                  )}
                </div>

                {/* Constraints */}
                <div className="bg-white p-4 border border-stone-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3">Constraints</h3>
                  <p className="text-sm text-slate-700">
                    {caseStudy.constraints || 'Limitations and constraints will be noted here.'}
                  </p>
                </div>

                {/* Additional Context */}
                <div className="bg-white p-4 border border-stone-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3">Additional Context</h3>
                  {caseStudy.additionalContext.length > 0 ? (
                    <ul className="space-y-2">
                      {caseStudy.additionalContext.slice(-3).map((ctx, i) => (
                        <li key={i} className="text-sm text-slate-700 border-l-2 border-blue-500 pl-2">
                          {ctx.slice(0, 150)}...
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">Additional details from your conversation.</p>
                  )}
                </div>
              </div>

              {/* Open Full Platform Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowWorkspaceModal(false);
                    onOpenWorkspace?.({ 
                      query: caseStudy.currentMatter,
                      results: [caseStudy as unknown as Record<string, unknown>]
                    });
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                >
                  Continue to Full NSIL Platform
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BWConsultantOS;
