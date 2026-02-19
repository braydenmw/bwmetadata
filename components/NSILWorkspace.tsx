import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Brain,
  Check,
  ChevronRight,
  FileText,
  Loader,
  Mail,
  X,
  PanelLeft,
  PanelLeftClose,
  Send,
  Upload,
  Wrench,
  ClipboardList,
  Sparkles,
  Building2,
  Globe,
  Target
} from 'lucide-react';
import { type ReportParameters, type ReportData, type GenerationPhase, type CopilotInsight, type IngestedDocumentMeta } from '../types';
import DocumentTypeRouter, { type DocumentTypeConfig, type LetterTypeConfig } from '../services/DocumentTypeRouter';

type SidebarTab = 'howto' | 'intake' | 'steps' | 'outputs' | 'uploads';
type MainMode = 'objective' | 'live-report';

interface WorkspaceOption {
  id: string;
  label: string;
  description: string;
  category: string;
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

const intakeSteps = [
  { id: 's1', title: 'Objective Definition', hint: 'What are you trying to achieve?' },
  { id: 's2', title: 'Strategic Intent', hint: 'Why this objective, why now?' },
  { id: 's3', title: 'Market Context', hint: 'Country, region, sector context.' },
  { id: 's4', title: 'Counterparty / Stakeholders', hint: 'Who is involved or impacted?' },
  { id: 's5', title: 'Financial Frame', hint: 'Scale, assumptions, funding frame.' },
  { id: 's6', title: 'Risk & Controls', hint: 'Main risks and mitigation controls.' },
  { id: 's7', title: 'Capability & Resources', hint: 'Team, systems, readiness gaps.' },
  { id: 's8', title: 'Execution Pathway', hint: 'Milestones, dependencies, sequencing.' },
  { id: 's9', title: 'Governance & Reporting', hint: 'Decision rights and reporting cadence.' },
  { id: 's10', title: 'Readiness Decision', hint: 'Go / no-go criteria and threshold.' }
];

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>('howto');
  const [mainMode, setMainMode] = useState<MainMode>('objective');

  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bw'; text: string }>>([]);

  const [uploadedDocs, setUploadedDocs] = useState<IngestedDocumentMeta[]>(params.ingestedDocuments ?? []);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [showFullLibraries, setShowFullLibraries] = useState(false);
  const [reportSearch, setReportSearch] = useState('');
  const [letterSearch, setLetterSearch] = useState('');
  const [stepChecks, setStepChecks] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const reportOptions = useMemo<WorkspaceOption[]>(() => {
    return DocumentTypeRouter.getAllDocumentTypes().map((item: DocumentTypeConfig) => ({
      id: item.id,
      label: item.name,
      description: item.description,
      category: item.category
    }));
  }, []);

  const letterOptions = useMemo<WorkspaceOption[]>(() => {
    return DocumentTypeRouter.getAllLetterTypes().map((item: LetterTypeConfig) => ({
      id: item.id,
      label: item.name,
      description: `${item.category} • max ${item.maxWords} words`,
      category: item.category
    }));
  }, []);

  const objectiveReady = Boolean(
    params.organizationName?.trim() &&
    params.country?.trim() &&
    params.reportName?.trim() &&
    params.problemStatement?.trim()
  );

  const completedStepCount = useMemo(() => Object.values(stepChecks).filter(Boolean).length, [stepChecks]);
  const librariesUnlocked = objectiveReady && completedStepCount >= 4;

  const filteredReports = useMemo(() => {
    const q = reportSearch.toLowerCase().trim();
    if (!q) return reportOptions;
    return reportOptions.filter((item) => `${item.label} ${item.category} ${item.description}`.toLowerCase().includes(q));
  }, [reportOptions, reportSearch]);

  const filteredLetters = useMemo(() => {
    const q = letterSearch.toLowerCase().trim();
    if (!q) return letterOptions;
    return letterOptions.filter((item) => `${item.label} ${item.category} ${item.description}`.toLowerCase().includes(q));
  }, [letterOptions, letterSearch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!initialConsultantQuery) return;
    setChatMessages([
      { sender: 'user', text: initialConsultantQuery },
      {
        sender: 'bw',
        text: 'I captured your objective. Start in "How to Use", complete Intake + 10 Steps, then switch to Live Report. Output libraries unlock once core intake is complete.'
      }
    ]);
    onInitialConsultantQueryHandled?.();
  }, [initialConsultantQuery, onInitialConsultantQueryHandled]);

  const updateField = <K extends keyof ReportParameters>(key: K, value: ReportParameters[K]) => {
    setParams({ ...params, [key]: value });
  };

  const toggleSelection = (id: string, selected: string[], setter: (value: string[]) => void) => {
    setter(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
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

    setChatMessages((prev) => [
      ...prev,
      { sender: 'bw', text: `Evidence added: ${newDocs.length} file(s). This will be used in Live Report and output generation.` }
    ]);
  };

  const activateByObjective = () => {
    const objectiveText = `${params.problemStatement || ''} ${params.reportName || ''}`.toLowerCase();

    const smartReports = reportOptions
      .filter((option) => `${option.label} ${option.description} ${option.category}`.toLowerCase().includes(objectiveText.split(' ')[0] || ''))
      .slice(0, 8)
      .map((option) => option.id);

    const smartLetters = letterOptions
      .filter((option) => `${option.label} ${option.description} ${option.category}`.toLowerCase().includes(objectiveText.split(' ')[0] || ''))
      .slice(0, 6)
      .map((option) => option.id);

    setSelectedReports((prev) => Array.from(new Set([...prev, ...smartReports])));
    setSelectedLetters((prev) => Array.from(new Set([...prev, ...smartLetters])));

    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'bw',
        text: `Objective-driven activation complete. Reports: ${smartReports.length}, Letters: ${smartLetters.length}. You can refine in Outputs.`
      }
    ]);
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;

    const prompt = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    setChatInput('');
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 650));

    const response = [
      `Objective: ${params.problemStatement || 'Not set yet'}`,
      `Mode: ${mainMode === 'objective' ? 'Objective Intake' : 'Live Report'}`,
      `Intake progress: ${completedStepCount}/10 steps complete`,
      `Outputs active: ${selectedReports.length} reports, ${selectedLetters.length} letters`,
      `Evidence files: ${uploadedDocs.length}`,
      'Next best action: complete missing intake fields, then use Live Report to generate coherent outputs.'
    ].join('\n');

    setChatMessages((prev) => [...prev, { sender: 'bw', text: response }]);
    setIsProcessing(false);
  };

  const tabs: Array<{ id: SidebarTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = [
    { id: 'howto', label: 'How to Use', icon: Wrench },
    { id: 'intake', label: 'Intake', icon: ClipboardList },
    { id: 'steps', label: '10 Steps', icon: Sparkles },
    { id: 'outputs', label: 'Outputs', icon: FileText },
    { id: 'uploads', label: 'Uploads', icon: Upload }
  ];

  const totalActiveOutputs = selectedReports.length + selectedLetters.length;

  return (
    <div className="w-full h-full bg-white flex overflow-hidden" style={{ fontFamily: "'Söhne', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
      <div className={`${sidebarOpen ? 'w-[430px]' : 'w-0'} transition-all duration-300 flex-shrink-0 border-r border-slate-200 bg-slate-50 overflow-hidden`}>
        <div className="w-[430px] h-full flex flex-col">
          <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench size={16} className="text-slate-600" />
              <span className="text-sm font-semibold text-slate-800">Configuration Sidebar</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-200 rounded">
              <X size={16} className="text-slate-500" />
            </button>
          </div>

          <div className="flex border-b border-slate-200 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'howto' && (
              <div className="space-y-3 text-sm text-slate-700">
                <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">How This Works</p>
                  <p className="text-sm">This system is objective-first. You define the mission, complete the structured steps, then generate outputs from a coherent model.</p>
                </div>
                {[
                  '1) Fill Intake fields (organization, location, report title, objective).',
                  '2) Complete the 10 Steps checklist to structure technical logic.',
                  '3) Add evidence in Uploads (documents, mandates, data).',
                  '4) Unlock Outputs and activate only what you need.',
                  '5) Switch to Live Report for final generation and refinement.'
                ].map((line, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg">{line}</div>
                ))}
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
                  Nothing is pre-activated. No recommendations are forced.
                </div>
              </div>
            )}

            {activeTab === 'intake' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Organization Name</label>
                  <input
                    value={params.organizationName}
                    onChange={(e) => updateField('organizationName', e.target.value)}
                    className="w-full border border-slate-300 px-3 py-2 text-sm rounded"
                    placeholder="Enter organization"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Country / Region</label>
                  <input
                    value={params.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="w-full border border-slate-300 px-3 py-2 text-sm rounded"
                    placeholder="Target location"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Live Report Title</label>
                  <input
                    value={params.reportName}
                    onChange={(e) => updateField('reportName', e.target.value)}
                    className="w-full border border-slate-300 px-3 py-2 text-sm rounded"
                    placeholder="Name this mission"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Objective</label>
                  <textarea
                    value={params.problemStatement}
                    onChange={(e) => updateField('problemStatement', e.target.value)}
                    rows={5}
                    className="w-full border border-slate-300 px-3 py-2 text-sm rounded resize-none"
                    placeholder="What should this system solve?"
                  />
                </div>
                <div className="p-2 text-xs rounded border border-slate-200 bg-white">
                  Intake status: <span className={objectiveReady ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>{objectiveReady ? 'Complete' : 'Incomplete'}</span>
                </div>
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="space-y-2">
                {intakeSteps.map((step) => (
                  <label key={step.id} className="flex items-start gap-2 p-3 bg-white border border-slate-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={Boolean(stepChecks[step.id])}
                      onChange={() => setStepChecks((prev) => ({ ...prev, [step.id]: !prev[step.id] }))}
                      className="mt-1 h-4 w-4 accent-blue-600"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{step.title}</p>
                      <p className="text-[11px] text-slate-500">{step.hint}</p>
                    </div>
                  </label>
                ))}
                <div className="p-2 text-xs rounded border border-slate-200 bg-white">
                  Progress: <span className="font-semibold text-blue-700">{completedStepCount}/10</span>
                </div>
              </div>
            )}

            {activeTab === 'uploads' && (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Upload size={22} className="text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600 font-medium">Add evidence files</span>
                  <span className="text-xs text-slate-400 mt-1">Reports, letters, data sheets, references</span>
                  <input type="file" multiple className="hidden" onChange={(e) => onUploadFiles(e.target.files)} />
                </label>
                <div className="space-y-1">
                  {uploadedDocs.map((doc, idx) => (
                    <div key={`${doc.filename}-${idx}`} className="text-xs p-2 bg-white border border-slate-200 rounded flex items-center gap-2">
                      <FileText size={12} className="text-blue-600" />
                      <span className="truncate">{doc.filename}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'outputs' && (
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-white">
                  <p className="text-xs text-slate-600">Library status</p>
                  <p className={`text-sm font-semibold ${librariesUnlocked ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {librariesUnlocked ? 'Unlocked' : 'Locked (Complete intake + 4 steps)'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Catalog size: 247 documents, 156 letters (hidden until needed).</p>
                </div>

                <button
                  onClick={activateByObjective}
                  disabled={!librariesUnlocked}
                  className="w-full px-3 py-2 rounded text-sm font-medium bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Activate by Objective
                </button>

                <label className="flex items-center gap-2 text-xs text-slate-700 p-2 bg-white border border-slate-200 rounded">
                  <input
                    type="checkbox"
                    checked={showFullLibraries}
                    onChange={(e) => setShowFullLibraries(e.target.checked)}
                    disabled={!librariesUnlocked}
                    className="h-4 w-4 accent-blue-600"
                  />
                  Show full document and letter catalogs
                </label>

                {showFullLibraries && librariesUnlocked && (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-700">Documents ({selectedReports.length} active)</p>
                      <input
                        value={reportSearch}
                        onChange={(e) => setReportSearch(e.target.value)}
                        className="w-full border border-slate-300 px-3 py-2 text-xs rounded"
                        placeholder="Search documents"
                      />
                      <div className="max-h-44 overflow-y-auto space-y-1">
                        {filteredReports.map((option) => (
                          <label key={option.id} className="flex items-start gap-2 p-2 bg-white border border-slate-200 rounded">
                            <input
                              type="checkbox"
                              checked={selectedReports.includes(option.id)}
                              onChange={() => toggleSelection(option.id, selectedReports, setSelectedReports)}
                              className="mt-0.5 h-4 w-4 accent-blue-600"
                            />
                            <span className="text-xs text-slate-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-700">Letters ({selectedLetters.length} active)</p>
                      <input
                        value={letterSearch}
                        onChange={(e) => setLetterSearch(e.target.value)}
                        className="w-full border border-slate-300 px-3 py-2 text-xs rounded"
                        placeholder="Search letters"
                      />
                      <div className="max-h-44 overflow-y-auto space-y-1">
                        {filteredLetters.map((option) => (
                          <label key={option.id} className="flex items-start gap-2 p-2 bg-white border border-slate-200 rounded">
                            <input
                              type="checkbox"
                              checked={selectedLetters.includes(option.id)}
                              onChange={() => toggleSelection(option.id, selectedLetters, setSelectedLetters)}
                              className="mt-0.5 h-4 w-4 accent-blue-600"
                            />
                            <span className="text-xs text-slate-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mb-3">
              <span className="px-2 py-1 bg-slate-100 rounded">Steps {completedStepCount}/10</span>
              <span className="px-2 py-1 bg-slate-100 rounded">Docs {uploadedDocs.length}</span>
              <span className="px-2 py-1 bg-slate-100 rounded">Outputs {totalActiveOutputs}</span>
            </div>
            <button
              onClick={onGenerate}
              disabled={isGenerating || !librariesUnlocked || totalActiveOutputs === 0}
              className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Generating... {generationProgress}% ({generationPhase})
                </>
              ) : (
                'Generate Active Outputs'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full bg-slate-50">
        <div
          className="relative px-6 py-5 flex items-center justify-between overflow-hidden border-b border-slate-200"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=300&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/75 to-blue-900/55" />

          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
          >
            {sidebarOpen ? <PanelLeftClose size={18} className="text-white" /> : <PanelLeft size={18} className="text-white" />}
            <span className="text-xs text-white/90">{sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}</span>
          </button>

          <div className="relative z-10 text-center flex-1">
            <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Your AI Partner</p>
            <h1 className="text-2xl font-bold text-white">BW Consultant</h1>
          </div>

          <label className="relative z-10 text-xs text-white bg-white/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors flex items-center gap-2">
            <Upload size={12} />
            Add Evidence
            <input type="file" multiple className="hidden" onChange={(e) => onUploadFiles(e.target.files)} />
          </label>
        </div>

        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMainMode('objective')}
              className={`px-3 py-1.5 rounded text-xs font-medium ${mainMode === 'objective' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Objective Intake
            </button>
            <button
              onClick={() => setMainMode('live-report')}
              disabled={!objectiveReady}
              className={`px-3 py-1.5 rounded text-xs font-medium ${mainMode === 'live-report' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Live Report
            </button>
          </div>
          <p className="text-xs text-slate-500">Objective {objectiveReady ? 'ready' : 'not ready'} • Steps {completedStepCount}/10 • Outputs {totalActiveOutputs}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {chatMessages.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Analyze a market', hint: 'Vietnam renewable energy sector', icon: Globe },
                  { label: 'Assess a company', hint: 'Partner due diligence', icon: Building2 },
                  { label: 'Regional intelligence', hint: 'Infrastructure outlook', icon: Target },
                  { label: 'Investment guidance', hint: 'Project viability', icon: Brain }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChatInput(item.hint)}
                    className="text-left p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon size={14} className="text-blue-600" />
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    </div>
                    <p className="text-xs text-slate-500">{item.hint}</p>
                  </button>
                ))}
              </div>
            )}

            {mainMode === 'live-report' && (
              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <p className="text-sm font-semibold text-slate-800 mb-2">Live Report Context</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                  <p><strong>Organization:</strong> {params.organizationName || '—'}</p>
                  <p><strong>Location:</strong> {params.country || '—'}</p>
                  <p><strong>Report:</strong> {params.reportName || '—'}</p>
                  <p><strong>Evidence Files:</strong> {uploadedDocs.length}</p>
                  <p className="md:col-span-2"><strong>Objective:</strong> {params.problemStatement || '—'}</p>
                </div>
              </div>
            )}

            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                  {msg.sender === 'bw' && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                      <Brain size={13} className="text-blue-600" />
                      <span className="text-[10px] font-semibold text-blue-600 uppercase">BW Consultant</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-500 flex items-center gap-2">
                  <Loader size={14} className="animate-spin text-blue-600" />
                  Processing context...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isProcessing}
                placeholder="Describe your objective, ask questions, or request analysis..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isProcessing || !chatInput.trim()}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>Press Enter to send</span>
                <span>•</span>
                <button onClick={() => setSidebarOpen(true)} className="text-blue-600 hover:underline">Open configuration sidebar</button>
              </div>
              <span>{totalActiveOutputs} outputs active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NSILWorkspace;
