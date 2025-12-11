import React, { useState, useEffect } from 'react';
import {
  Building2, Target, ShieldCheck, Shield,
  Download, Sparkles, Printer, Globe, ArrowRight,
  Info, Check, CheckCircle,
  Network, History, Briefcase,
  Zap, MapPin, Users, Scale, GitBranch,
  FileText, BarChart3, DollarSign, Settings, Presentation, Handshake, TrendingUp,
  Layers, Database, Calculator, Search, BarChart, PieChart, Activity, Cpu, AlertCircle,
  X, Plus, MessageCircle, Send, User
} from 'lucide-react';
import { ReportParameters, ReportData, GenerationPhase, CopilotInsight, toolCategories } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface MainCanvasProps {
  reportData: ReportData;
  isGenerating: boolean;
  generationPhase: GenerationPhase;
  generationProgress: number;
  onGenerate: () => void;
  reports: ReportParameters[];
  onOpenReport: (report: ReportParameters) => void;
  onDeleteReport: (id: string) => void;
  onNewAnalysis: () => void;
  onCopilotMessage?: (msg: CopilotInsight) => void;
  params: ReportParameters;
  setParams: (params: ReportParameters) => void;
  onChangeViewMode?: (mode: string) => void;
}

const CollapsibleSection: React.FC<{
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  color: string;
  children: React.ReactNode;
}> = ({ title, description, isExpanded, onToggle, color, children }) => (
  <div className="border border-stone-200 rounded-lg overflow-hidden">
    <div
      className={`p-4 bg-gradient-to-r ${color} cursor-pointer hover:brightness-105 flex items-center justify-between`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <div>
          <h4 className="font-bold text-stone-900 text-sm">{title}</h4>
          <p className="text-xs text-stone-600">{description}</p>
        </div>
      </div>
      <div className="text-lg text-stone-400">{isExpanded ? '▼' : '▶'}</div>
    </div>
    {isExpanded && <div className="p-4 bg-white border-t border-stone-200">{children}</div>}
  </div>
);

const MainCanvas: React.FC<MainCanvasProps> = ({
    params, setParams, onGenerate, onChangeViewMode
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalView, setModalView] = useState('main'); // 'main' or a specific tool id
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({});
  const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'bw', timestamp: Date}>>([
    { text: "Hello! I'm your BW Consultant. How can I help you with your partnership analysis today?", sender: 'bw', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');

  const toggleSubsection = (key: string) => {
    setExpandedSubsections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = { text: chatInput, sender: 'user' as const, timestamp: new Date() };
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');

      // Simulate BW response
      setTimeout(() => {
        const bwResponse = { text: "Thank you for your input. Let me help you refine that aspect of your partnership strategy.", sender: 'bw' as const, timestamp: new Date() };
        setChatMessages(prev => [...prev, bwResponse]);
      }, 1000);
    }
  };

  const openModal = (id: string) => {
    setActiveModal(id);
    setModalView('main'); // Reset to main view whenever a new modal is opened
  };


  const renderActiveModalContent = () => {
    // This function will return the form content based on the activeModal state.
    // We will define its content within the modal structure itself for better readability.
    // This is a placeholder for the concept.
    return null;
  }


  return (
    <div className="flex-1 w-full flex h-full bg-stone-100 font-sans text-stone-900 overflow-hidden">
        {/* --- LEFT PANEL: CONTROLS & FORMS --- */}
        <div className="flex flex-col bg-white border-r border-stone-200 overflow-y-auto custom-scrollbar" style={{ flexBasis: '30%' }}>
            <div className="p-6 space-y-6">
                {/* Section Navigation */}
                <div>
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">Primary Steps</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {id: 'identity', label: '01. Identity', description: "Define your organization's profile", icon: Building2, color: 'text-blue-600'},
                            {id: 'mandate', label: '02. Mandate', description: 'Outline partnership objectives', icon: Target, color: 'text-green-600'},
                            {id: 'market', label: '03. Market', description: 'Analyze the target market', icon: Globe, color: 'text-purple-600'},
                            {id: 'risk', label: '04. Risk', description: 'Assess risks & mitigation', icon: Shield, color: 'text-red-600'},
                            {id: 'analysis', label: '05. Analysis', description: 'Deeper strategic insights', icon: BarChart3, color: 'text-indigo-600'},
                            {id: 'marketplace', label: '06. Marketplace', description: 'Discover opportunities', icon: Handshake, color: 'text-pink-600'},
                            {id: 'generation', label: '07. Generation', description: 'Generate the final report', icon: FileText, color: 'text-orange-600'},
                        ].map(section => (
                            <button
                                key={section.id}
                                onClick={() => openModal(section.id)}
                                className={`p-3 bg-white border rounded-lg hover:shadow-md transition-all text-left group ${
                                    activeModal === section.id
                                        ? 'border-bw-navy shadow-md'
                                        : 'border-stone-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <section.icon size={16} className={section.color} />
                                    <span className="text-sm font-bold text-stone-900">{section.label}</span>
                                </div>
                                <p className="text-[10px] text-stone-600 pl-6">{section.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-stone-200"></div>

                {/* <div className="w-full h-px bg-stone-200"></div> */}

                {/* BW Consultant Chat */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg flex flex-col">
                    <div className="h-12 bg-bw-navy text-white flex items-center justify-between px-4 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span className="text-sm font-bold">BW Consultant</span>
                        </div>
                        <div className="text-xs opacity-75">Live Assistant</div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 h-48">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-bw-navy text-white'
                                        : 'bg-white border border-stone-200 text-stone-900'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-12 border-t border-stone-200 flex items-center gap-2 px-4">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask your BW Consultant..."
                            className="flex-1 text-sm border border-stone-200 rounded px-3 py-1 focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-2 bg-bw-navy text-white rounded hover:bg-bw-gold hover:text-bw-navy transition-all"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>

                {/* Document Generation Tools */}
                <div>
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">Document Generation Suite</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => openModal('doc-suite')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-bold text-stone-900">Document Suite</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Generate LOI, MOU, proposals & more</p>
                        </button>

                        <button
                            onClick={() => openModal('doc-summary')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-bold text-stone-900">Executive Summary</span>
                            </div>
                            <p className="text-[10px] text-stone-600">AI-generated strategic overview</p>
                        </button>

                        <button
                            onClick={() => openModal('doc-bi')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Database className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-bold text-stone-900">Business Intelligence</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Country-specific regulatory insights</p>
                        </button>

                         <button
                            onClick={() => openModal('doc-analyzer')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Network className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-bold text-stone-900">Partnership Analyzer</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Analyze existing partnerships</p>
                        </button>
                        <button
                            onClick={() => openModal('doc-diversification')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <PieChart className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-bold text-stone-900">Diversification Report</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Analyze market concentration risk</p>
                        </button>
                        <button
                            onClick={() => openModal('doc-ethics')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-bold text-stone-900">Ethical Check Report</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Compliance & mitigation analysis</p>
                        </button>
                        <button
                            onClick={() => openModal('doc-precedent')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <History className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-bold text-stone-900">Historical Precedent</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Compare against historical cases</p>
                        </button>
                    </div>
                </div>

                {/* Letter Generation Tools */}
                <div>
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">Letter Generation Suite</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => openModal('letter-loi')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-bold text-stone-900">Letter of Intent (LOI)</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Draft a formal LOI document</p>
                        </button>
                        <button
                            onClick={() => openModal('letter-termsheet')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-bold text-stone-900">Term Sheet</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Outline key deal terms</p>
                        </button>
                        <button
                            onClick={() => openModal('letter-mou')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-bold text-stone-900">Memorandum (MOU)</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Generate a memorandum</p>
                        </button>
                        <button
                            onClick={() => openModal('letter-proposal')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-bold text-stone-900">Formal Proposal</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Create a partnership proposal</p>
                        </button>
                        <button
                            onClick={() => openModal('letter-im')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Briefcase className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-bold text-stone-900">Investment Memo</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Justify capital investment</p>
                        </button>
                        <button
                            onClick={() => openModal('letter-ddr')}
                            className="p-3 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Search className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-bold text-stone-900">Due Diligence Request</span>
                            </div>
                            <p className="text-[10px] text-stone-600">Formal info request list</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- MODAL FOR FORMS --- */}
        <AnimatePresence>
            {activeModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
                    onClick={() => setActiveModal(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-stone-200 flex items-center justify-between shrink-0">
                            <h2 className="text-2xl font-serif font-bold text-bw-navy capitalize">{activeModal?.replace(/-/g, ' ')} Configuration</h2>
                            <button onClick={() => setActiveModal(null)} className="p-2 rounded-full hover:bg-stone-100">
                                <X size={20} className="text-stone-500" />
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            {/* Identity Section */}
                            {activeModal === 'identity' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="1.1 Entity Profile & Legal Structure"
                                        description="Define organization type, jurisdiction, and legal framework"
                                        isExpanded={!!expandedSubsections['identity-entity']}
                                        onToggle={() => toggleSubsection('identity-entity')}
                                        color="from-blue-50 to-blue-100"
                                     >
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Organization Name</label>
                                                    <input
                                                        type="text"
                                                        value={params.organizationName}
                                                        onChange={(e) => setParams({ ...params, organizationName: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                                                        placeholder="Enter organization name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Legal Entity Type</label>
                                                    <select
                                                        value={params.organizationType}
                                                        onChange={(e) => setParams({ ...params, organizationType: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                                                    >
                                                        <option value="">Select type</option>
                                                        <option value="Corporation">Corporation</option>
                                                        <option value="Partnership">Partnership</option>
                                                        <option value="SME">SME</option>
                                                        <option value="Startup">Startup</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Country of Incorporation</label>
                                                    <input
                                                        type="text"
                                                        value={params.country}
                                                        onChange={(e) => setParams({ ...params, country: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                                                        placeholder="Enter country"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Tax Jurisdiction</label>
                                                    <input
                                                        type="text"
                                                        value={params.region}
                                                        onChange={(e) => setParams({ ...params, region: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                                                        placeholder="Enter tax jurisdiction"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Street Address</label>
                                                    <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent" placeholder="e.g., 123 Innovation Drive"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                                                    <input type="text" value={params.userCity || ''} onChange={(e) => setParams({ ...params, userCity: e.target.value })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent" placeholder="e.g., Metropolis"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">State / Province</label>
                                                    <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent" placeholder="e.g., California"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Postal Code</label>
                                                    <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent" placeholder="e.g., 90210"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Website</label>
                                                    <input
                                                        type="url"
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                                                        placeholder="https://example.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="1.2 Capability Assessment"
                                        description="Evaluate organizational capabilities, resources, and competencies"
                                        isExpanded={!!expandedSubsections['identity-capability']}
                                        onToggle={() => toggleSubsection('identity-capability')}
                                        color="from-blue-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Revenue Band</label>
                                                    <select
                                                        value={params.revenueBand || ''}
                                                        onChange={(e) => setParams({ ...params, revenueBand: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                                                    >
                                                        <option value="">Select revenue...</option>
                                                        <option value="$0-1M">$0-1M</option>
                                                        <option value="$1-10M">$1-10M</option>
                                                        <option value="$10-50M">$10-50M</option>
                                                        <option value="$50M+">$50M+</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Headcount Band</label>
                                                    <select
                                                        value={params.headcountBand || ''}
                                                        onChange={(e) => setParams({ ...params, headcountBand: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                                                    >
                                                        <option value="">Select headcount...</option>
                                                        <option value="1-10">1-10</option>
                                                        <option value="11-50">11-50</option>
                                                        <option value="51-200">51-200</option>
                                                        <option value="201-1000">201-1000</option>
                                                        <option value="1000+">1000+</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Organization Sub-Type</label>
                                                <input
                                                    type="text"
                                                    value={params.organizationSubType || ''}
                                                    onChange={(e) => setParams({ ...params, organizationSubType: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                                                    placeholder="e.g., Publicly Traded, Non-Profit, B-Corp"
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="1.3 Market Positioning & Brand Strategy"
                                        description="Define competitive positioning, brand strategy, and market differentiation"
                                        isExpanded={!!expandedSubsections['identity-positioning']}
                                        onToggle={() => toggleSubsection('identity-positioning')}
                                        color="from-emerald-50 to-emerald-100"
                                     >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Industry (select multiple)</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {["Technology", "Finance", "Healthcare", "Manufacturing", "Energy", "Consumer Goods"].map(ind => (
                                                        <label key={ind} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={params.industry.includes(ind)}
                                                                onChange={() => {
                                                                    const newIndustries = params.industry.includes(ind)
                                                                        ? params.industry.filter(i => i !== ind)
                                                                        : [...params.industry, ind];
                                                                    setParams({ ...params, industry: newIndustries });
                                                                }}
                                                                className="h-4 w-4 text-bw-navy focus:ring-bw-gold"
                                                            />
                                                            <span className="text-sm">{ind}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Niche Areas or Specializations</label>
                                                <textarea value={params.nicheAreas?.join(', ') || ''} onChange={(e) => setParams({ ...params, nicheAreas: e.target.value.split(',').map(s => s.trim()) })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent" placeholder="e.g., AI in Drug Discovery, Fintech for SMEs"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                     <CollapsibleSection
                                        title="1.4 Strategic Intent & Vision"
                                        description="Articulate long-term vision, mission, and strategic objectives"
                                        isExpanded={!!expandedSubsections['identity-intent']}
                                        onToggle={() => toggleSubsection('identity-intent')}
                                        color="from-violet-50 to-violet-100">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Strategic Intent</label>
                                                <select value={params.strategicIntent[0] || ''} onChange={(e) => setParams({ ...params, strategicIntent: [e.target.value] })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent">
                                                    <option value="">Select primary goal...</option>
                                                    <option value="Market Expansion">Market Expansion</option>
                                                    <option value="Partnership Development">Partnership Development</option>
                                                    <option value="Technology Acquisition">Technology Acquisition</option>
                                                    <option value="Capital Investment">Capital Investment</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Problem Statement</label>
                                                <textarea value={params.problemStatement} onChange={(e) => setParams({ ...params, problemStatement: e.target.value })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent h-24" placeholder="Describe the core problem this strategy aims to solve."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="1.5 Risk Appetite & Tolerance Framework"
                                        description="Define risk tolerance levels and governance framework"
                                        isExpanded={!!expandedSubsections['risk-appetite']}
                                        onToggle={() => toggleSubsection('risk-appetite')}
                                        color="from-amber-50 to-amber-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Risk Tolerance</label>
                                                <select value={params.riskTolerance} onChange={(e) => setParams({ ...params, riskTolerance: e.target.value })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent">
                                                    <option value="">Select risk tolerance...</option>
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Funding Source</label>
                                                <select value={params.fundingSource} onChange={(e) => setParams({ ...params, fundingSource: e.target.value })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent">
                                                    <option value="">Select funding source...</option>
                                                    <option value="Internal Capital">Internal Capital</option>
                                                    <option value="Venture Capital">Venture Capital</option>
                                                    <option value="Private Equity">Private Equity</option>
                                                    <option value="Debt Financing">Debt Financing</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                            {activeModal === 'mandate' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="2.1 Strategic Objectives & KPIs"
                                        description="Define measurable objectives and key performance indicators"
                                        isExpanded={!!expandedSubsections['mandate-objectives']}
                                        onToggle={() => toggleSubsection('mandate-objectives')}
                                        color="from-green-50 to-green-100"
                                     >
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Select Strategic Objectives</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Market Expansion", "Partnership Development", "Technology Acquisition", "Capital Investment", "Operational Excellence", "Innovation Leadership"].map(intent => (
                                                    <label key={intent} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={params.strategicIntent.includes(intent)}
                                                            onChange={() => {
                                                                const newIntents = params.strategicIntent.includes(intent)
                                                                    ? params.strategicIntent.filter(i => i !== intent)
                                                                    : [...params.strategicIntent, intent];
                                                                setParams({ ...params, strategicIntent: newIntents });
                                                            }}
                                                            className="h-4 w-4 text-bw-navy focus:ring-bw-gold"
                                                        />
                                                        <span className="text-sm">{intent}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="mt-3">
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Problem Statement</label>
                                                <textarea
                                                    value={params.problemStatement}
                                                    onChange={(e) => setParams({ ...params, problemStatement: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent h-24"
                                                     placeholder="Describe the core problem this partnership aims to solve."
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="2.2 Target Partner Profiling"
                                        description="Define ideal partner characteristics and selection criteria"
                                        isExpanded={!!expandedSubsections['mandate-profiling']}
                                        onToggle={() => toggleSubsection('mandate-profiling')}
                                        color="from-green-50 to-green-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Ideal Partner Profile</label>
                                                <textarea
                                                    value={params.idealPartnerProfile}
                                                    onChange={(e) => setParams({ ...params, idealPartnerProfile: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent h-24"
                                                    placeholder="Describe the ideal partner (e.g., size, industry, capabilities, culture)."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Target Counterpart Type</label>
                                                <input
                                                    type="text"
                                                    value={params.targetCounterpartType?.join(', ') || ''}
                                                    onChange={(e) => setParams({ ...params, targetCounterpartType: e.target.value.split(',').map(s => s.trim()) })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent"
                                                    placeholder="e.g., CEO, Head of Strategy, R&D Lead"
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="2.3 Value Proposition Development"
                                        description="Craft compelling value propositions for potential partners"
                                        isExpanded={!!expandedSubsections['mandate-proposition']}
                                        onToggle={() => toggleSubsection('mandate-proposition')}
                                        color="from-purple-50 to-purple-100"
                                     >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Success Metrics (comma-separated)</label>
                                                <textarea
                                                    value={params.successMetrics?.join(', ') || ''}
                                                    onChange={(e) => setParams({ ...params, successMetrics: e.target.value.split(',').map(s => s.trim()) })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent h-24"
                                                    placeholder="e.g., 20% market share increase, $5M in new revenue, Launch in 2 new countries"
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="2.4 Negotiation Strategy & Terms"
                                        description="Define negotiation approach and key terms framework"
                                        isExpanded={!!expandedSubsections['mandate-negotiation']}
                                        onToggle={() => toggleSubsection('mandate-negotiation')}
                                        color="from-orange-50 to-orange-100"
                                     >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Due Diligence Depth</label>
                                                <select value={params.dueDiligenceDepth} onChange={(e) => setParams({...params, dueDiligenceDepth: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent">
                                                    <option value="">Select depth...</option>
                                                    <option value="Standard">Standard</option>
                                                    <option value="Enhanced">Enhanced</option>
                                                    <option value="Deep Dive">Deep Dive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="2.5 Governance & Integration Planning"
                                        description="Plan partnership governance structure and integration approach"
                                        isExpanded={!!expandedSubsections['mandate-governance']}
                                        onToggle={() => toggleSubsection('mandate-governance')}
                                        color="from-red-50 to-red-100"
                                     >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Governance Model</label>
                                                <select className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent">
                                                    <option value="">Select model...</option>
                                                    <option value="Joint Venture">Joint Venture</option>
                                                    <option value="Strategic Alliance">Strategic Alliance</option>
                                                    <option value="Licensing">Licensing Agreement</option>
                                                    <option value="Distribution">Distribution Partnership</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="2.6 Execution & Operations"
                                        description="Define operational priorities and timelines"
                                        isExpanded={!!expandedSubsections['mandate-execution']}
                                        onToggle={() => toggleSubsection('mandate-execution')}
                                        color="from-indigo-50 to-indigo-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Expansion Timeline</label>
                                                <select value={params.expansionTimeline} onChange={(e) => setParams({...params, expansionTimeline: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent">
                                                    <option value="">Select timeline...</option>
                                                    <option value="0-6 Months">0-6 Months</option>
                                                    <option value="6-12 Months">6-12 Months</option>
                                                    <option value="1-2 Years">1-2 Years</option>
                                                    <option value="2+ Years">2+ Years</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Operational Priority</label>
                                                <input type="text" value={params.operationalPriority} onChange={(e) => setParams({...params, operationalPriority: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., Speed to market, Cost efficiency"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                            {activeModal === 'market' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="3.1 Target Market Definition"
                                        description="Define geographic and demographic target markets"
                                        isExpanded={!!expandedSubsections['market-target']}
                                        onToggle={() => toggleSubsection('market-target')}
                                        color="from-purple-50 to-purple-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Target City / Region</label>
                                                <input type="text" value={params.userCity || ''} onChange={(e) => setParams({ ...params, userCity: e.target.value })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent" placeholder="e.g., Silicon Valley, Singapore"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Analysis Timeframe</label>
                                                <select value={params.analysisTimeframe} onChange={(e) => setParams({...params, analysisTimeframe: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent">
                                                    <option value="1-Year">1-Year</option>
                                                    <option value="3-Year">3-Year</option>
                                                    <option value="5-Year">5-Year</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="3.2 Competitive Landscape"
                                        description="Analyze key competitors, their market share, and your advantages"
                                        isExpanded={!!expandedSubsections['market-competitive']}
                                        onToggle={() => toggleSubsection('market-competitive')}
                                        color="from-purple-50 to-purple-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Key Competitors & Market Share</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="e.g., Competitor A (40% share), Competitor B (25% share)..."/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Your Competitive Advantages</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="e.g., Proprietary technology, exclusive distribution rights, lower cost structure..."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="3.3 Customer Segmentation"
                                        description="Define target customer profiles and their unmet needs"
                                        isExpanded={!!expandedSubsections['market-customer']}
                                        onToggle={() => toggleSubsection('market-customer')}
                                        color="from-purple-50 to-purple-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Target Customer Profile</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Describe your ideal customer: their industry, size, budget, and role."/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Customer Pain Points</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="What critical problems do your target customers face that you can solve?"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="3.4 Regulatory & Economic Factors"
                                        description="Detail the legal, compliance, and financial environment"
                                        isExpanded={!!expandedSubsections['market-regulatory']}
                                        onToggle={() => toggleSubsection('market-regulatory')}
                                        color="from-purple-50 to-purple-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Regulatory & Compliance Issues</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="e.g., GDPR in Europe, data sovereignty laws, industry-specific certifications required."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                            {activeModal === 'risk' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="4.1 Risk Identification & Assessment"
                                        description="Identify and evaluate key partnership risks"
                                        isExpanded={!!expandedSubsections['risk-assessment']}
                                        onToggle={() => toggleSubsection('risk-assessment')}
                                        color="from-red-50 to-red-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Risk Concerns</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-bw-gold focus:border-transparent h-24" placeholder="List main risks: financial, operational, reputational, geopolitical, etc."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="4.2 Mitigation & Contingency"
                                        description="Develop strategies to minimize risks and plan for failure"
                                        isExpanded={!!expandedSubsections['risk-mitigation']}
                                        onToggle={() => toggleSubsection('risk-mitigation')}
                                        color="from-red-50 to-red-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Risk Mitigation Strategies</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="For each risk identified, what is the plan to reduce its likelihood or impact?"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Contingency Plans</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="What are the backup plans if a major risk materializes? What are the exit triggers?"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="4.3 Monitoring & Reporting"
                                        description="Establish processes for ongoing risk tracking and reporting"
                                        isExpanded={!!expandedSubsections['risk-monitoring']}
                                        onToggle={() => toggleSubsection('risk-monitoring')}
                                        color="from-red-50 to-red-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Key Risk Indicators (KRIs)</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="What specific metrics will be tracked to monitor risk levels? (e.g., currency fluctuation %, partner dependency ratio)"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Reporting Frequency</label>
                                                <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Weekly</option><option>Monthly</option><option>Quarterly</option></select>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                             {activeModal === 'analysis' && modalView === 'main' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {toolCategories.analysis.map(tool => (
                                        <button key={tool.id} onClick={() => setModalView(tool.id)} className="p-4 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all text-left group">
                                            <div className="flex items-center gap-3 mb-2">
                                                <tool.icon className="w-6 h-6 text-indigo-600" />
                                                <span className="text-sm font-bold text-stone-900">{tool.label}</span>
                                            </div>
                                            <p className="text-xs text-stone-600">{tool.description}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {activeModal === 'analysis' && modalView === 'roi-diagnostic' && (
                                <div>
                                    <button onClick={() => setModalView('main')} className="text-sm text-blue-600 mb-4">&larr; Back to Analysis Tools</button>
                                    <h3 className="text-lg font-bold mb-4">ROI Diagnostic Configuration</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Estimated Initial Investment ($)</label>
                                            <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 500000"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Projected Annual Revenue ($)</label>
                                            <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 200000"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Operational Costs ($/year)</label>
                                            <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 75000"/>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'analysis' && modalView === 'due-diligence' && (
                                <div>
                                    <button onClick={() => setModalView('main')} className="text-sm text-blue-600 mb-4">&larr; Back to Analysis Tools</button>
                                    <h3 className="text-lg font-bold mb-4">Due Diligence Engine</h3>
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Target Company Name</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="Enter company name to run due diligence on"/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'marketplace' && modalView === 'main' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {toolCategories.marketplace.map(tool => (
                                        <button key={tool.id} onClick={() => setModalView(tool.id)} className="p-4 bg-white border border-stone-200 rounded-lg hover:shadow-md hover:border-pink-300 transition-all text-left group">
                                            <div className="flex items-center gap-3 mb-2">
                                                <tool.icon className="w-6 h-6 text-pink-600" />
                                                <span className="text-sm font-bold text-stone-900">{tool.label}</span>
                                            </div>
                                            <p className="text-xs text-stone-600">{tool.description}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                             {activeModal === 'generation' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="7.1 Report Generation"
                                        description="Finalize and generate the intelligence report"
                                        isExpanded={true}
                                        onToggle={() => {}}
                                        color="from-orange-50 to-orange-100"
                                    >
                                        <div className="text-center p-4">
                                            <p className="text-stone-600 mb-4">All data has been collected. You are ready to generate the final report.</p>
                                            <button
                                                onClick={onGenerate}
                                                className="px-8 py-3 bg-bw-navy text-white font-bold rounded-lg hover:bg-bw-gold hover:text-bw-navy transition-all"
                                            >
                                                Generate Intelligence Report
                                            </button>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                            {/* --- DOCUMENT GENERATION SUITE MODALS --- */}
                            {activeModal === 'doc-summary' && ( // Executive Summary
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Generates a high-level summary of the entire strategic roadmap. Ideal for circulating to stakeholders who need a quick overview of the key findings and recommendations.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Report Length</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>1-Page Brief</option><option>3-Page Standard</option><option>5-Page Detailed</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Target Audience</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Investor</option><option>Executive Board</option><option>Legal Team</option><option>Technical Team</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Key Sections to Emphasize</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Market Opportunity", "Financial Projections", "Risk Mitigation", "Team Strength"].map(sec => (
                                                <label key={sec} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                    <input type="checkbox" className="h-4 w-4 text-bw-navy focus:ring-bw-gold"/>
                                                    <span className="text-sm">{sec}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Specific Instructions or Custom Requests</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="e.g., 'Focus heavily on the competitive advantage section.'"/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'doc-bi' && ( // Business Intelligence
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Generates a deep-dive report on a specific country or region, leveraging advanced analytical modules. Essential for market entry and geopolitical risk assessment.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Focus Country/Region</label>
                                        <input type="text" value={params.userCity || params.country} className="w-full p-2 border border-stone-200 rounded text-sm bg-stone-50" readOnly/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Analytical Modules to Include</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Geopolitical Analysis", "Governance Audit", "RROI Index", "Temporal Market Analysis"].map(mod => (
                                                <label key={mod} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                    <input type="checkbox" className="h-4 w-4 text-bw-navy focus:ring-bw-gold"/>
                                                    <span className="text-sm">{mod}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Comparative Context (Optional)</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 'Compare against Singapore'"/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'doc-analyzer' && ( // Partnership Analyzer
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Analyzes an existing partnership to generate a Symbiotic Partnership Index (SPI) score, identifying strengths, weaknesses, and areas for improvement.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Partner Name</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="Enter existing partner's name"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Partnership Details & History</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Describe the nature of the partnership, its goals, and current status."/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Known Risk Factors or Issues</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="e.g., 'Communication breakdown in Q2', 'Dependency on a single supplier'"/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'doc-diversification' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Analyzes market and revenue concentration using the Herfindahl-Hirschman Index (HHI) and recommends markets for diversification to reduce dependency risk.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Focus Sectors for Diversification</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., Renewable Energy, SaaS, Healthcare IT"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Number of Recommendations</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Top 3</option><option>Top 5</option><option>Top 10</option></select>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'doc-ethics' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Performs an ethical and compliance check based on the provided data, flagging potential issues related to sanctions, labor practices, and corruption. Provides mitigation strategies.</p>
                                     <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Risk Threshold</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Low (Flag all potential issues)</option><option>Medium (Flag moderate to high-risk issues)</option><option>High (Flag only critical issues)</option></select>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'doc-precedent' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Compares the current venture against a database of historical cases, providing a probability of success, applicable success factors, and key warnings based on past outcomes.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Filter Historical Cases by Sector</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 'Fintech', 'Biotechnology' (Optional)"/>
                                    </div>
                                </div>
                            )}

                            {/* --- LETTER GENERATION SUITE MODALS --- */}
                            {activeModal === 'letter-loi' && ( // Letter of Intent
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Drafts a formal Letter of Intent (LOI) to signal serious consideration of a partnership. This document outlines the broad terms before extensive due diligence.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Letter Style</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Formal</option><option>Standard</option><option>Collaborative</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Key Clauses to Include</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Binding Provisions", "Non-binding Provisions", "Confidentiality", "Exclusivity", "Termination"].map(clause => (
                                                <label key={clause} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                    <input type="checkbox" className="h-4 w-4 text-bw-navy focus:ring-bw-gold"/>
                                                    <span className="text-sm">{clause} Clause</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Exclusivity Period (days)</label>
                                        <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 90"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Governing Law (Jurisdiction)</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., State of Delaware, USA"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Specific Instructions or Custom Requests</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="e.g., 'Emphasize that the valuation is preliminary and subject to due diligence.'"/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'letter-termsheet' && ( // Term Sheet
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Generates a Term Sheet that lays out the material terms and conditions of a business agreement. This is a more detailed document than an LOI.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Valuation / Price ($)</label>
                                        <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 10000000"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1">Investment Amount ($)</label>
                                        <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 2000000"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1">Liquidation Preference</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 1x, Non-participating"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Board Seats</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 'One seat on the Board of Directors'"/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'letter-mou' && ( // Memorandum of Understanding
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Creates a Memorandum of Understanding (MOU) to express a convergence of will between parties, indicating a common line of intended action.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Key Objectives of the MOU</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="List the primary goals this MOU aims to achieve."/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Scope of Collaboration</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Define the areas and limits of the collaboration."/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Specific Instructions or Custom Requests</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="e.g., 'Include a section on joint marketing efforts.'"/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'letter-proposal' && ( // Formal Proposal
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Constructs a comprehensive formal proposal for a potential partner, detailing the project, value proposition, timeline, and costs.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Project Title</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 'Proposal for Joint Venture in APAC Region'"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Key Deliverables</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="List the specific outcomes and deliverables of the proposed project."/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Proposed Budget & Payment Schedule</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Outline the financial aspects of the proposal."/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'letter-im' && ( // Investment Memo
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Creates a detailed internal memorandum to justify a capital investment for the proposed partnership or project, aimed at an investment committee or executive board.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Requested Investment Amount ($)</label>
                                        <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 5000000"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Use of Funds</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Detail how the investment will be allocated (e.g., 40% R&D, 30% Marketing, 30% Operations)."/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'letter-ddr' && ( // Due Diligence Request
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Generates a formal Due Diligence Request List to be sent to a potential partner. This document outlines the specific information and documentation required for your team to conduct its analysis.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Scope of Diligence</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Financials", "Legal & Corporate Structure", "Technical IP", "Human Resources"].map(scope => (
                                                <label key={scope} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer"><input type="checkbox" className="h-4 w-4 text-bw-navy focus:ring-bw-gold"/> <span className="text-sm">{scope}</span></label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add-in Toolbar Modals */}
                            {activeModal === 'add-pie-chart' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Add Pie Chart</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Chart Title</label>
                                            <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., Market Share Distribution"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Data Source</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Industry Breakdown</option>
                                                <option>Competitor Market Share</option>
                                                <option>Funding Source Mix</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Placeholder for other modals */}
                            {activeModal && !['identity', 'mandate', 'market', 'risk', 'generation', 'analysis', 'marketplace', 'doc-summary', 'doc-bi', 'doc-analyzer', 'doc-diversification', 'doc-ethics', 'doc-precedent', 'letter-loi', 'letter-termsheet', 'letter-mou', 'letter-proposal', 'letter-im', 'letter-ddr', 'add-pie-chart'].includes(activeModal) && (
                                <div className="text-center text-stone-400 p-16">
                                    <h3 className="text-lg font-bold text-stone-700 mb-2">Configure {activeModal.replace(/-/g, ' ')}</h3>
                                    <p>Configuration options for this tool would appear here.</p>
                                </div>
                            )}
                        </div>
                        {/* Modal Footer */}
                        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end items-center gap-4 shrink-0">
                            {['doc-suite', 'doc-summary', 'doc-bi', 'doc-analyzer', 'doc-diversification', 'doc-ethics', 'doc-precedent', 'letter-loi', 'letter-termsheet', 'letter-mou', 'letter-proposal', 'letter-im', 'letter-ddr', 'add-pie-chart'].includes(activeModal || '') ? (
                                <button onClick={() => { /* Add generation/add logic here */ setActiveModal(null); }} className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded shadow-lg hover:bg-green-700 transition-all">
                                    {activeModal?.startsWith('add-') ? 'Add to Report' : 'Generate Document'}
                                </button>
                            ) : (
                                <button onClick={() => setActiveModal(null)} className="px-6 py-2 bg-bw-navy text-white text-sm font-bold rounded shadow-lg hover:bg-stone-800 transition-all">
                                    Close
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- RIGHT PANEL: THE ARTIFACT (OUTPUT) --- */}
        <div className="flex-1 bg-stone-200 relative flex flex-col items-center overflow-hidden" style={{ flexBasis: '70%' }}>
            {/* Toolbar Header */}
            <div className="w-full h-16 bg-white/80 backdrop-blur border-b border-stone-300 flex items-center justify-between px-8 z-10 shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-widest">
                    <History className="w-4 h-4" /> Live Document Preview
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <button className="px-4 py-2 bg-bw-navy text-white text-xs font-bold rounded shadow-lg hover:bg-stone-800 transition-all flex items-center gap-2">
                        <Users size={14} />
                        BW Consultant
                    </button>
                    <button className="px-4 py-2 hover:bg-stone-100 rounded text-stone-600 text-xs font-bold flex items-center gap-2 border border-transparent hover:border-stone-200 transition-all" title="Print">
                        <Printer size={14}/> Print
                    </button>
                    <button className="px-4 py-2 hover:bg-stone-100 rounded text-stone-600 text-xs font-bold flex items-center gap-2 border border-transparent hover:border-stone-200 transition-all" title="Download">
                        <Download size={14}/> PDF
                    </button>
                    <button className="px-6 py-2 bg-green-600 text-white text-xs font-bold rounded shadow-lg hover:bg-green-700 transition-all flex items-center gap-2">
                        <CheckCircle size={14} /> Finalize Intelligence
                    </button>
                </div>
            </div>

            {/* Document Scroll Area */}
            <div className="flex-1 w-full overflow-y-auto custom-scrollbar p-8 flex justify-center relative">
                {/* Floating Add-in Toolbar */}
                <div className="absolute top-8 right-8 flex flex-col gap-2 z-20">
                    {[
                        { icon: PieChart, label: 'Add Pie Chart' },
                        { icon: BarChart, label: 'Add Bar Chart' },
                        { icon: Network, label: 'Add Network Graph' },
                        { icon: Database, label: 'Add Data Table' },
                        { icon: Cpu, label: 'Add AI Analysis Module' },
                    ].map(tool => (
                        <button key={tool.label} onClick={() => openModal(`add-${tool.label.toLowerCase().replace(/ /g, '-')}`)} title={tool.label} className="p-3 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-full shadow-lg hover:bg-bw-navy hover:text-white text-stone-600 transition-all">
                            <tool.icon size={18} />
                        </button>
                    ))}
                </div>

                {/* The Page Itself */}
                <motion.div
                    layout
                    className="bg-white w-full max-w-[794px] min-h-[1123px] shadow-2xl shadow-stone-900/10 flex flex-col relative"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Doc Header */}
                    <div className="h-32 bg-white border-b border-stone-100 flex items-center justify-between px-12 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-bw-navy text-white flex items-center justify-center font-serif font-bold text-2xl">N</div>
                            <div>
                                <div className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase mb-1">BWGA Intelligence</div>
                                <div className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                                    Strategic Roadmap
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-red-600 uppercase font-bold tracking-wider mb-1">Confidential Draft</div>
                            <div className="text-xs font-mono text-stone-400">{new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    {/* Doc Body */}
                    <div className="p-12 flex-1 font-serif text-stone-900">
                        {/* 1. Identity Section */}
                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">01. Principal Entity</h2>
                            {params.organizationName ? (
                                <>
                                    <div className="text-3xl font-bold text-stone-900 mb-2">{params.organizationName}</div>
                                    <div className="text-lg text-stone-600 italic mb-4">
                                        {params.organizationType} • {params.country}
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-stone-400 italic">Awaiting entity profile...</p>
                            )}
                        </div>

                        {/* 2. Mandate Section */}
                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">02. Strategic Mandate</h2>
                            {params.strategicIntent.length > 0 ? (
                                <>
                                    <div className="text-sm font-bold text-stone-900 uppercase mb-2">Primary Objectives: {params.strategicIntent.join(', ')}</div>
                                    {params.problemStatement && (
                                        <p className="text-sm text-stone-600 leading-relaxed italic border-l-2 border-bw-gold pl-4">
                                            "{params.problemStatement}"
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-stone-400 italic">Awaiting strategic mandate...</p>
                            )}
                        </div>

                        {/* 3. Market Context Section */}
                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">03. Market Context</h2>
                            <p className="text-sm text-stone-400 italic">Awaiting market analysis...</p>
                        </div>

                        {/* 4. Risk & Historical */}
                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">04. Risk & Historical Validation</h2>
                            <p className="text-sm text-stone-400 italic">Awaiting risk assessment...</p>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">05. Advanced Analysis</h2>
                            <p className="text-sm text-stone-400 italic">Awaiting advanced analysis...</p>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">06. Marketplace Opportunities</h2>
                            <p className="text-sm text-stone-400 italic">Awaiting risk assessment...</p>
                        </div>
                    </div>

                    {/* Doc Footer */}
                    <div className="h-16 bg-white border-t border-stone-100 flex items-center justify-between px-12 text-[9px] text-stone-400 font-sans uppercase tracking-widest shrink-0">
                        <span>Generated by Nexus Core v4.2</span>
                        <span>Page 1 of 1</span>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
  );
};


export default MainCanvas;
