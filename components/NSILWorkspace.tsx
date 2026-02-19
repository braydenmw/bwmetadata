import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Brain,
  FileText,
  Mail,
  Upload,
  Send,
  Building2,
  Target,
  Globe,
  Shield,
  Calculator,
  Handshake,
  BookOpen,
  Scale,
  Briefcase,
  Users,
  Sparkles,
  BarChart3,
  Landmark,
  ClipboardList,
  TrendingUp,
  GitBranch,
  Layers,
  Settings,
  X,
  Check,
  Loader,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { type ReportParameters, type ReportData, type GenerationPhase, type CopilotInsight, type IngestedDocumentMeta } from '../types';
import DocumentTypeRouter, { type DocumentTypeConfig, type LetterTypeConfig } from '../services/DocumentTypeRouter';

type GuidanceLevel = 'green' | 'orange' | 'red';
type SidebarTab = 'intake' | 'reports' | 'letters' | 'modules' | 'uploads';

interface WorkspaceOption {
  id: string;
  label: string;
  description: string;
  guidance: GuidanceLevel;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NSILWorkspaceProps {
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
  insights?: CopilotInsight[];
  autonomousMode?: boolean;
  autonomousSuggestions?: string[];
  isAutonomousThinking?: boolean;
  initialConsultantQuery?: string;
  onInitialConsultantQueryHandled?: () => void;
}

const documentCategoryGuidance = (category: string): GuidanceLevel => {
  const key = category.toLowerCase();
  if (['strategic', 'market intelligence', 'financial analysis', 'risk assessment'].includes(key)) return 'green';
  if (['partner & stakeholder', 'government submissions', 'international body applications'].includes(key)) return 'orange';
  return 'red';
};

const letterCategoryGuidance = (category: string): GuidanceLevel => {
  const key = category.toLowerCase();
  if (['investment', 'partnership', 'board'].includes(key)) return 'green';
  if (['government', 'trade', 'community', 'international'].includes(key)) return 'orange';
  return 'red';
};

const iconForDocumentCategory = (category: string) => {
  const key = category.toLowerCase();
  if (key.includes('strategic')) return Briefcase;
  if (key.includes('market')) return BarChart3;
  if (key.includes('financial')) return Calculator;
  if (key.includes('risk')) return Shield;
  if (key.includes('governance')) return Scale;
  if (key.includes('partner') || key.includes('stakeholder')) return Handshake;
  if (key.includes('government')) return Landmark;
  if (key.includes('international')) return Globe;
  if (key.includes('trade')) return TrendingUp;
  if (key.includes('community')) return Users;
  return FileText;
};

const iconForLetterCategory = (category: string) => {
  const key = category.toLowerCase();
  if (key.includes('investment')) return TrendingUp;
  if (key.includes('government')) return Landmark;
  if (key.includes('partnership')) return Handshake;
  if (key.includes('board')) return Briefcase;
  if (key.includes('risk')) return Shield;
  if (key.includes('community')) return Users;
  if (key.includes('trade')) return Globe;
  if (key.includes('international')) return BookOpen;
  return Mail;
};

const moduleOptions: WorkspaceOption[] = [
  { id: 'module-contradiction-check', label: 'Contradiction Solver', description: 'Detects conflicting assumptions', guidance: 'green', category: 'Core', icon: Brain },
  { id: 'module-adversarial-debate', label: 'Adversarial Debate', description: '5-perspective challenge process', guidance: 'green', category: 'Core', icon: Users },
  { id: 'module-monte-carlo', label: 'Scenario Monte Carlo', description: 'Distribution-level outcomes', guidance: 'green', category: 'Core', icon: Sparkles },
  { id: 'module-ethics-gate', label: 'Ethical Gate', description: 'Fairness and compliance screening', guidance: 'orange', category: 'Governance', icon: Scale },
  { id: 'module-cross-domain', label: 'Cross-Domain Transfer', description: 'Analogy-based strategy insights', guidance: 'orange', category: 'Advanced', icon: BookOpen },
  { id: 'module-translation-layer', label: 'Audience Translation', description: 'Investor/government/community framing', guidance: 'green', category: 'Core', icon: Globe },
  { id: 'module-memory-index', label: 'Vector Memory Index', description: 'Analog case retrieval for precedent scoring', guidance: 'orange', category: 'Advanced', icon: Layers },
  { id: 'module-frontier-engine', label: 'Frontier Intelligence Engine', description: 'Negotiation simulation and foresight loops', guidance: 'orange', category: 'Advanced', icon: TrendingUp },
  { id: 'module-goal-synthesizer', label: 'Autonomous Goal Synthesizer', description: 'Emergent goal extraction from constraints', guidance: 'orange', category: 'Advanced', icon: Target },
  { id: 'module-governance-audit', label: 'Governance Audit Lens', description: 'Control mapping and audit readiness checks', guidance: 'green', category: 'Governance', icon: ClipboardList },
  { id: 'module-stakeholder-sim', label: 'Stakeholder Reaction Simulation', description: 'Multi-stakeholder utility reaction mapping', guidance: 'green', category: 'Stakeholder', icon: Users },
  { id: 'module-sequencing-engine', label: 'Sequencing Integrity Engine', description: 'Stage-gate dependency and order validation', guidance: 'green', category: 'Execution', icon: GitBranch }
];

const guidanceClasses: Record<GuidanceLevel, { border: string; glow: string; badge: string; text: string }> = {
  green: {
    border: 'border-emerald-300',
    glow: 'shadow-[0_0_0_1px_rgba(16,185,129,0.35)]',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    text: 'Recommended'
  },
  orange: {
    border: 'border-amber-300',
    glow: 'shadow-[0_0_0_1px_rgba(245,158,11,0.35)]',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    text: 'Helpful'
  },
  red: {
    border: 'border-rose-300',
    glow: 'shadow-[0_0_0_1px_rgba(244,63,94,0.35)]',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    text: 'Low Priority'
  }
};

const NSILWorkspace: React.FC<NSILWorkspaceProps> = ({
  params,
  setParams,
  onGenerate,
  isGenerating,
  generationPhase,
  generationProgress,
  initialConsultantQuery,
  onInitialConsultantQueryHandled
}) => {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('intake');
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bw'; text: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Selection state
  const reportOptions = useMemo<WorkspaceOption[]>(() => {
    const items = DocumentTypeRouter.getAllDocumentTypes();
    return items.map((item: DocumentTypeConfig) => ({
      id: item.id,
      label: item.name,
      description: item.description,
      category: item.category,
      guidance: documentCategoryGuidance(item.category),
      icon: iconForDocumentCategory(item.category)
    }));
  }, []);

  const letterOptions = useMemo<WorkspaceOption[]>(() => {
    const items = DocumentTypeRouter.getAllLetterTypes();
    return items.map((item: LetterTypeConfig) => ({
      id: item.id,
      label: item.name,
      description: `${item.category} • max ${item.maxWords} words`,
      category: item.category,
      guidance: letterCategoryGuidance(item.category),
      icon: iconForLetterCategory(item.category)
    }));
  }, []);

  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>(['module-contradiction-check', 'module-adversarial-debate', 'module-monte-carlo']);
  const [uploadedDocs, setUploadedDocs] = useState<IngestedDocumentMeta[]>(params.ingestedDocuments ?? []);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Initialize selections
  useEffect(() => {
    if (selectedReports.length === 0 && reportOptions.length > 0) {
      setSelectedReports(reportOptions.slice(0, 3).map((item) => item.id));
    }
  }, [reportOptions, selectedReports.length]);

  useEffect(() => {
    if (selectedLetters.length === 0 && letterOptions.length > 0) {
      setSelectedLetters(letterOptions.slice(0, 3).map((item) => item.id));
    }
  }, [letterOptions, selectedLetters.length]);

  // Handle initial query from landing page
  useEffect(() => {
    if (initialConsultantQuery) {
      setChatMessages([
        { sender: 'user', text: initialConsultantQuery },
        { sender: 'bw', text: `I've captured your query: "${initialConsultantQuery}"\n\nI'm ready to help you build a comprehensive analysis. You can:\n\n• Ask me questions about your project\n• Open the sidebar (arrow on left) to configure outputs\n• Upload supporting documents\n• Generate your selected reports and letters\n\nWhat would you like to explore first?` }
      ]);
      onInitialConsultantQueryHandled?.();
    }
  }, [initialConsultantQuery, onInitialConsultantQueryHandled]);

  const toggleSelection = (id: string, selected: string[], setter: (value: string[]) => void) => {
    setter(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  const updateField = <K extends keyof ReportParameters>(key: K, value: ReportParameters[K]) => {
    setParams({ ...params, [key]: value });
  };

  const onUploadFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newDocs: IngestedDocumentMeta[] = Array.from(files).map((file) => ({
      filename: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    }));
    const merged = [...uploadedDocs, ...newDocs];
    setUploadedDocs(merged);
    updateField('ingestedDocuments', merged);
    setChatMessages((prev) => [...prev, { sender: 'bw', text: `Uploaded ${newDocs.length} document(s). I'll use them for evidence-based analysis.` }]);
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;
    const prompt = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    setChatInput('');
    setIsProcessing(true);

    // Simulate processing
    await new Promise((r) => setTimeout(r, 800));
    
    const response = `I've noted your input: "${prompt}"\n\nCurrent configuration:\n• ${selectedReports.length} report outputs selected\n• ${selectedLetters.length} letter templates selected\n• ${selectedModules.length} analysis modules active\n• ${uploadedDocs.length} documents uploaded\n\nWould you like me to adjust these settings or proceed with generation?`;
    setChatMessages((prev) => [...prev, { sender: 'bw', text: response }]);
    setIsProcessing(false);
  };

  // Build category counts
  const buildCategoryCounts = (options: WorkspaceOption[]) => {
    const map = new Map<string, number>();
    for (const option of options) {
      map.set(option.category, (map.get(option.category) || 0) + 1);
    }
    return map;
  };

  const getCurrentOptions = (): WorkspaceOption[] => {
    if (activeTab === 'reports') return reportOptions;
    if (activeTab === 'letters') return letterOptions;
    if (activeTab === 'modules') return moduleOptions;
    return [];
  };

  const getCurrentSelected = (): string[] => {
    if (activeTab === 'reports') return selectedReports;
    if (activeTab === 'letters') return selectedLetters;
    if (activeTab === 'modules') return selectedModules;
    return [];
  };

  const getCurrentSetter = () => {
    if (activeTab === 'reports') return setSelectedReports;
    if (activeTab === 'letters') return setSelectedLetters;
    if (activeTab === 'modules') return setSelectedModules;
    return () => {};
  };

  const filteredOptions = useMemo(() => {
    const options = getCurrentOptions();
    const q = searchTerm.trim().toLowerCase();
    return options.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = !q || `${item.label} ${item.description} ${item.category}`.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchTerm, activeCategory, reportOptions, letterOptions]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const categoryCounts = useMemo(() => buildCategoryCounts(getCurrentOptions()), [activeTab, reportOptions, letterOptions]);

  const totalSelections = selectedReports.length + selectedLetters.length + selectedModules.length;

  // Sidebar tabs config
  const sidebarTabs: { id: SidebarTab; label: string; icon: React.ComponentType<{ className?: string; size?: number }> }[] = [
    { id: 'intake', label: 'Intake', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'letters', label: 'Letters', icon: Mail },
    { id: 'modules', label: 'Modules', icon: Settings },
    { id: 'uploads', label: 'Uploads', icon: Upload }
  ];

  return (
    <div className="w-full h-full bg-white flex overflow-hidden" style={{ fontFamily: "'Söhne', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
      
      {/* RETRACTABLE SIDEBAR */}
      <div className={`${sidebarOpen ? 'w-[420px]' : 'w-0'} transition-all duration-300 flex-shrink-0 border-r border-slate-200 bg-slate-50 overflow-hidden`}>
        <div className="w-[420px] h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-slate-600" />
              <span className="text-sm font-semibold text-slate-800">Configuration</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-200 rounded">
              <X size={16} className="text-slate-500" />
            </button>
          </div>

          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-200 bg-white">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); setActiveCategory('All'); }}
                className={`flex-1 px-2 py-2.5 text-[11px] font-medium flex flex-col items-center gap-1 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* INTAKE TAB */}
            {activeTab === 'intake' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Organization Name</label>
                  <input
                    value={params.organizationName}
                    onChange={(e) => updateField('organizationName', e.target.value)}
                    placeholder="Enter organization name"
                    className="w-full border border-slate-300 px-3 py-2 text-sm rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Country / Region</label>
                  <input
                    value={params.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    placeholder="Target country or region"
                    className="w-full border border-slate-300 px-3 py-2 text-sm rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Report Title</label>
                  <input
                    value={params.reportName}
                    onChange={(e) => updateField('reportName', e.target.value)}
                    placeholder="Name for your analysis"
                    className="w-full border border-slate-300 px-3 py-2 text-sm rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Problem Statement</label>
                  <textarea
                    value={params.problemStatement}
                    onChange={(e) => updateField('problemStatement', e.target.value)}
                    placeholder="Describe the outcome you need..."
                    rows={5}
                    className="w-full border border-slate-300 px-3 py-2 text-sm rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* UPLOADS TAB */}
            {activeTab === 'uploads' && (
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600 font-medium">Drop files or click to upload</span>
                  <span className="text-xs text-slate-400 mt-1">Reports, proposals, data sheets</span>
                  <input type="file" multiple className="hidden" onChange={(e) => onUploadFiles(e.target.files)} />
                </label>
                
                {uploadedDocs.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-700">{uploadedDocs.length} file(s) uploaded</p>
                    {uploadedDocs.map((doc, idx) => (
                      <div key={`${doc.filename}-${idx}`} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded text-xs">
                        <FileText size={14} className="text-blue-600" />
                        <span className="flex-1 truncate text-slate-700">{doc.filename}</span>
                        <Check size={12} className="text-emerald-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REPORTS / LETTERS / MODULES TABS */}
            {(activeTab === 'reports' || activeTab === 'letters' || activeTab === 'modules') && (
              <div className="space-y-3">
                {/* Search */}
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full border border-slate-300 px-3 py-2 text-sm rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Category chips */}
                <div className="flex flex-wrap gap-1">
                  {['All', ...Array.from(categoryCounts.keys()).sort()].map((cat) => {
                    const count = cat === 'All'
                      ? Array.from(categoryCounts.values()).reduce((s, v) => s + v, 0)
                      : (categoryCounts.get(cat) || 0);
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-2 py-1 text-[10px] rounded-full border transition-colors ${
                          activeCategory === cat
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Select All / Clear */}
                <div className="flex gap-2">
                  <button
                    onClick={() => getCurrentSetter()(getCurrentOptions().map((o) => o.id))}
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => getCurrentSetter()([])}
                    className="px-3 py-1.5 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                  >
                    Clear
                  </button>
                  <span className="flex-1 text-right text-xs text-slate-500 self-center">
                    {getCurrentSelected().length} selected
                  </span>
                </div>

                {/* Options list */}
                <div className="space-y-2 max-h-[calc(100vh-420px)] overflow-y-auto">
                  {filteredOptions.map((option) => {
                    const isSelected = getCurrentSelected().includes(option.id);
                    const guidance = guidanceClasses[option.guidance];
                    return (
                      <label
                        key={option.id}
                        className={`flex items-start gap-3 p-3 bg-white border rounded cursor-pointer transition-all ${guidance.border} ${isSelected ? guidance.glow : ''} hover:shadow-sm`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(option.id, getCurrentSelected(), getCurrentSetter())}
                          className="mt-0.5 h-4 w-4 accent-blue-600"
                        />
                        <option.icon className="w-4 h-4 mt-0.5 text-blue-700 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-800">{option.label}</span>
                            <span className={`text-[9px] border px-1.5 py-0.5 rounded ${guidance.badge}`}>{guidance.text}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{option.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Footer - Generate Button */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mb-3">
              <span className="px-2 py-1 bg-slate-100 rounded">{selectedReports.length} reports</span>
              <span className="px-2 py-1 bg-slate-100 rounded">{selectedLetters.length} letters</span>
              <span className="px-2 py-1 bg-slate-100 rounded">{selectedModules.length} modules</span>
              <span className="px-2 py-1 bg-slate-100 rounded">{uploadedDocs.length} docs</span>
            </div>
            <button
              onClick={onGenerate}
              disabled={isGenerating || totalSelections === 0}
              className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Generating... {generationProgress}%
                </>
              ) : (
                <>Generate {totalSelections} Output(s)</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA - Landing Page Style */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Hero Banner - Matching Landing Page */}
        <div
          className="relative px-6 py-6 flex items-center justify-between overflow-hidden flex-shrink-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=300&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/75 to-blue-900/60" />
          
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
          >
            {sidebarOpen ? (
              <PanelLeftClose size={18} className="text-white" />
            ) : (
              <PanelLeft size={18} className="text-white" />
            )}
            <span className="text-xs text-white/80">{sidebarOpen ? 'Hide' : 'Options'}</span>
          </button>

          <div className="relative z-10 text-center flex-1">
            <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Your AI Partner</p>
            <h1 className="text-2xl font-bold text-white">BW Consultant</h1>
          </div>

          <div className="relative z-10 text-right">
            <p className="text-xs text-blue-200">NSIL v6.0</p>
            <p className="text-[11px] text-blue-100">Deterministic • Auditable</p>
          </div>
        </div>

        {/* Chat Interface - ChatGPT Style */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Brain size={48} className="text-blue-200 mb-4" />
                  <h2 className="text-xl font-semibold text-slate-700 mb-2">How can I help you today?</h2>
                  <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
                    I'm your strategic intelligence partner. Describe your project, ask questions, or use the sidebar to configure your outputs.
                  </p>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                    {[
                      { label: 'Analyze a market', hint: 'Vietnam renewable energy sector' },
                      { label: 'Assess a company', hint: 'Partner due diligence' },
                      { label: 'Regional intelligence', hint: 'Infrastructure outlook' },
                      { label: 'Investment guidance', hint: 'Project viability' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setChatInput(item.hint)}
                        className="text-left p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all group"
                      >
                        <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{item.label}</p>
                        <p className="text-xs text-slate-400 mt-1">{item.hint}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-bl-md'
                      }`}>
                        {msg.sender === 'bw' && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                            <Brain size={14} className="text-blue-600" />
                            <span className="text-[10px] font-semibold text-blue-600 uppercase">BW Consultant</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Loader size={14} className="animate-spin text-blue-600" />
                          Analyzing...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white p-4">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe your project, ask questions, or request analysis..."
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !chatInput.trim()}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isProcessing ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
              <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                <div className="flex gap-3">
                  <span>Press Enter to send</span>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Open sidebar for configuration
                  </button>
                </div>
                <span>
                  {totalSelections > 0 ? `${totalSelections} outputs configured` : 'No outputs selected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NSILWorkspace;
