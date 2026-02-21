import React, { useState } from 'react';
import {
  Send, ChevronDown, Brain, Zap, Plus, Eye, Download, Save, Printer, Settings,
  FileText, AlertCircle, Check, TrendingUp, Users, Globe, DollarSign, Briefcase,
  Target, Shield, CheckCircle2, ChevronRight, BarChart2, Copy, X, BookOpen
} from 'lucide-react';

interface MainCanvasProps {
  params: any;
  setParams: any;
  reportData: any;
  isGenerating: boolean;
  generationPhase: string;
  generationProgress: number;
  onGenerate: () => void;
  reports: any[];
  onOpenReport: (report: any) => void;
  onDeleteReport: (reportId: string) => void;
  onNewAnalysis: () => void;
  onCopilotMessage: (message: string) => void;
}

const MainCanvas: React.FC<MainCanvasProps> = (props) => {
  const { params, setParams, onGenerate, isGenerating } = props;
  
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'ai', text: 'Welcome! Let\'s build your professional strategic document together. As you add information on the left, I\'ll help refine it and the live A4 document on the right will update in real-time.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showStagesPopup, setShowStagesPopup] = useState(false);
  const [agreedSections, setAgreedSections] = useState<string[]>([]);

  // Information checklist
  const informationFields = [
    { id: 'org-name', label: 'Organization Name', category: 'Foundation', filled: !!params.companyName },
    { id: 'entity-type', label: 'Entity Type', category: 'Foundation', filled: !!params.entityType },
    { id: 'location', label: 'Country/Location', category: 'Foundation', filled: !!params.country },
    { id: 'owner', label: 'Primary Owner', category: 'Foundation', filled: !!params.primaryOwner },
    { id: 'email', label: 'Contact Email', category: 'Foundation', filled: !!params.email },
    
    { id: 'tam', label: 'Total Addressable Market', category: 'Market', filled: !!params.tam },
    { id: 'growth', label: 'Market Growth Rate', category: 'Market', filled: !!params.growthRate },
    { id: 'segments', label: 'Target Segments', category: 'Market', filled: !!params.segments },
    { id: 'competitors', label: 'Competitive Landscape', category: 'Market', filled: !!params.competitors },
    
    { id: 'competencies', label: 'Core Competencies', category: 'Operations', filled: !!params.competencies },
    { id: 'technology', label: 'Technology Stack', category: 'Operations', filled: !!params.technology },
    { id: 'team', label: 'Team Size', category: 'Operations', filled: !!params.teamSize },
    { id: 'processes', label: 'Key Processes', category: 'Operations', filled: !!params.processes },
    
    { id: 'revenue1', label: 'Year 1 Revenue', category: 'Financial', filled: !!params.revenue1 },
    { id: 'revenue3', label: 'Year 3 Target', category: 'Financial', filled: !!params.revenue3 },
    { id: 'margin', label: 'Margin Target', category: 'Financial', filled: !!params.marginTarget },
    { id: 'budget', label: 'Operating Budget', category: 'Financial', filled: !!params.opexBudget },
    
    { id: 'partners', label: 'Strategic Partners', category: 'Partnerships', filled: !!params.partners },
    { id: 'risks', label: 'Risk Management', category: 'Governance', filled: !!params.risks },
    { id: 'compliance', label: 'Compliance', category: 'Governance', filled: !!params.compliance },
    { id: 'kpis', label: 'Key KPIs', category: 'Metrics', filled: !!params.kpis },
  ];

  const stages = [
    { id: 'foundation', label: 'Foundation', icon: Briefcase, description: 'Organization basics' },
    { id: 'market', label: 'Market', icon: Globe, description: 'Market analysis' },
    { id: 'operations', label: 'Operations', icon: Settings, description: 'Operational plan' },
    { id: 'financial', label: 'Financial', icon: DollarSign, description: 'Financial projections' },
    { id: 'partnerships', label: 'Partnerships', icon: Users, description: 'Strategic alliances' },
    { id: 'governance', label: 'Governance', icon: Shield, description: 'Risk & compliance' },
    { id: 'metrics', label: 'Metrics', icon: BarChart2, description: 'Success metrics' },
    { id: 'export', label: 'Export', icon: FileText, description: 'Generate documents' },
  ];

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
      setChatInput('');
      
      setTimeout(() => {
        const responses = [
          'Great! That\'s important information. I\'ve noted it in your document.',
          'Excellent. This strengthens your strategic positioning.',
          'Good thinking. How does this support your overall goals?',
          'Perfect! This clarity will help when you present this.',
          'I\'ve captured that. Let\'s ensure it flows well in the document.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { sender: 'ai', text: randomResponse }]);
      }, 700);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setParams({ ...params, [field]: value });
  };

  const completionPercentage = Math.round((informationFields.filter(i => i.filled).length / informationFields.length) * 100);
  const foundationComplete = informationFields.filter(i => i.category === 'Foundation' && i.filled).length === 5;

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">
      {/* LEFT SIDEBAR: INFORMATION CHECKLIST */}
      <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col overflow-hidden border-r border-slate-700">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={20} className="text-amber-400" />
            <h1 className="font-bold text-sm">Document Builder</h1>
          </div>
          <div className="text-xs text-slate-300 mb-2">Information Needed:</div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-300 mt-1">{completionPercentage}% Complete</div>
        </div>

        {/* Information Checklist by Category */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
          {['Foundation', 'Market', 'Operations', 'Financial', 'Partnerships', 'Governance', 'Metrics'].map((category) => {
            const categoryItems = informationFields.filter(f => f.category === category);
            const categoryComplete = categoryItems.filter(f => f.filled).length;
            
            return (
              <div key={category}>
                <div className="text-xs font-bold text-slate-300 uppercase mb-2 flex justify-between">
                  <span>{category}</span>
                  <span className="text-amber-400">{categoryComplete}/{categoryItems.length}</span>
                </div>
                <div className="space-y-1">
                  {categoryItems.map((field) => (
                    <div
                      key={field.id}
                      className={`p-2 rounded-lg text-xs flex items-center gap-2 transition-all ${
                        field.filled
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {field.filled ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <div className="w-3.5 h-3.5 border border-slate-500 rounded-full"></div>
                      )}
                      <span className="truncate">{field.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2 border-t border-slate-700 flex-shrink-0">
          {foundationComplete && (
            <button
              onClick={() => setShowStagesPopup(true)}
              className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={14} /> View Stages
            </button>
          )}
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap size={14} /> {isGenerating ? 'Generating...' : 'Generate'}
          </button>
          <button className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded text-xs transition-all flex items-center justify-center gap-2">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* CENTER PANEL: INPUT FORM + AI CHAT */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Form Header */}
        <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-6 flex-shrink-0">
          <h2 className="text-sm font-bold text-slate-900">Strategic Information Entry</h2>
          <span className="ml-auto text-xs text-slate-600">Live document updates as you type</span>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
          <div className="max-w-2xl space-y-6">
            {/* FOUNDATION SECTION */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b-2 border-slate-300">Foundation</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Organization Name *</label>
                  <input
                    type="text"
                    value={params.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your organization"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Entity Type *</label>
                  <select
                    value={params.entityType || ''}
                    onChange={(e) => handleInputChange('entityType', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="">Select type</option>
                    <option>Corporation</option>
                    <option>LLC</option>
                    <option>Partnership</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Country *</label>
                  <input
                    type="text"
                    value={params.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Country"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Primary Owner</label>
                  <input
                    type="text"
                    value={params.primaryOwner || ''}
                    onChange={(e) => handleInputChange('primaryOwner', e.target.value)}
                    placeholder="Owner name"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={params.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@organization.com"
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* MARKET SECTION */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b-2 border-slate-300">Market</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Total Addressable Market</label>
                  <input
                    type="text"
                    value={params.tam || ''}
                    onChange={(e) => handleInputChange('tam', e.target.value)}
                    placeholder="e.g., $50M"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Growth Rate (%)</label>
                  <input
                    type="number"
                    value={params.growthRate || ''}
                    onChange={(e) => handleInputChange('growthRate', e.target.value)}
                    placeholder="Annual %"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Target Segments</label>
                <textarea
                  value={params.segments || ''}
                  onChange={(e) => handleInputChange('segments', e.target.value)}
                  placeholder="Describe your target segments"
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Competitive Landscape</label>
                <textarea
                  value={params.competitors || ''}
                  onChange={(e) => handleInputChange('competitors', e.target.value)}
                  placeholder="Key competitors and differentiation"
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>
            </div>

            {/* OPERATIONS SECTION */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b-2 border-slate-300">Operations</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Core Competencies</label>
                <textarea
                  value={params.competencies || ''}
                  onChange={(e) => handleInputChange('competencies', e.target.value)}
                  placeholder="Your core strengths"
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Technology Stack</label>
                  <input
                    type="text"
                    value={params.technology || ''}
                    onChange={(e) => handleInputChange('technology', e.target.value)}
                    placeholder="Technologies used"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Team Size</label>
                  <input
                    type="number"
                    value={params.teamSize || ''}
                    onChange={(e) => handleInputChange('teamSize', e.target.value)}
                    placeholder="Employees"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Key Processes</label>
                <textarea
                  value={params.processes || ''}
                  onChange={(e) => handleInputChange('processes', e.target.value)}
                  placeholder="Your operational processes"
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>
            </div>

            {/* FINANCIAL SECTION */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b-2 border-slate-300">Financial</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Year 1 Revenue</label>
                  <input
                    type="text"
                    value={params.revenue1 || ''}
                    onChange={(e) => handleInputChange('revenue1', e.target.value)}
                    placeholder="$"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Year 3 Target</label>
                  <input
                    type="text"
                    value={params.revenue3 || ''}
                    onChange={(e) => handleInputChange('revenue3', e.target.value)}
                    placeholder="$"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Margin Target (%)</label>
                  <input
                    type="number"
                    value={params.marginTarget || ''}
                    onChange={(e) => handleInputChange('marginTarget', e.target.value)}
                    placeholder="%"
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Operating Budget</label>
                <input
                  type="text"
                  value={params.opexBudget || ''}
                  onChange={(e) => handleInputChange('opexBudget', e.target.value)}
                  placeholder="Annual budget"
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* GOVERNANCE SECTION */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b-2 border-slate-300">Governance & More</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Strategic Partners</label>
                <textarea
                  value={params.partners || ''}
                  onChange={(e) => handleInputChange('partners', e.target.value)}
                  placeholder="Key partners"
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Risk Management</label>
                <textarea
                  value={params.risks || ''}
                  onChange={(e) => handleInputChange('risks', e.target.value)}
                  placeholder="Key risks and mitigation"
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Compliance</label>
                <textarea
                  value={params.compliance || ''}
                  onChange={(e) => handleInputChange('compliance', e.target.value)}
                  placeholder="Compliance requirements"
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Key KPIs</label>
                <textarea
                  value={params.kpis || ''}
                  onChange={(e) => handleInputChange('kpis', e.target.value)}
                  placeholder="Success metrics"
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Section */}
        <div className="h-56 bg-slate-50 border-t border-slate-200 flex flex-col flex-shrink-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 bg-white">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-900 border border-slate-300'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-200 flex gap-2 bg-slate-50">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AI for guidance..."
              className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE A4 DOCUMENT PREVIEW */}
      <div className="w-96 bg-slate-100 border-l border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Eye size={16} /> Live A4 Document
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-slate-100 rounded transition-all" title="Print">
              <Printer size={14} className="text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded transition-all" title="Download">
              <Download size={14} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* A4 Document Preview */}
        <div className="flex-1 overflow-y-auto bg-slate-300 p-4">
          <div className="bg-white shadow-lg rounded-sm p-8 min-h-full" style={{ width: '7.5in', margin: '0 auto' }}>
            {/* Document Header */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-900">{params.companyName || 'Strategic Report'}</h1>
              <div className="flex justify-between items-start mt-2">
                <div className="text-xs text-slate-700">
                  <p><strong>Entity Type:</strong> {params.entityType || 'Entity type not provided'}</p>
                  <p><strong>Location:</strong> {params.country || 'Location not provided'}</p>
                  <p><strong>Owner:</strong> {params.primaryOwner || 'Owner not provided'}</p>
                </div>
                <div className="text-xs text-slate-600 text-right">
                  <p>Generated: {new Date().toLocaleDateString()}</p>
                  <p>Completion: {completionPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Executive Summary</h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {params.companyName} is a {params.entityType?.toLowerCase() || 'strategic'} organization operating in a market with significant growth potential. 
                The organization targets a TAM of {params.tam || 'market size data required'} with annual growth of {params.growthRate || 'growth rate data required'}%. 
                With core competencies in {params.competencies || 'key strategic areas'}, the organization is positioned for sustainable growth.
              </p>
            </div>

            {/* Market Overview */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Market Overview</h2>
              <div className="text-xs text-slate-700 space-y-1">
                <p><strong>TAM:</strong> {params.tam || 'Market size data required'}</p>
                <p><strong>Growth Rate:</strong> {params.growthRate ? `${params.growthRate}% p.a.` : 'Growth rate data required'}</p>
                <p><strong>Target Segments:</strong> {params.segments || 'Target segment data required'}</p>
                {params.competitors && <p><strong>Competitive Position:</strong> {params.competitors.substring(0, 100)}...</p>}
              </div>
            </div>

            {/* Operations */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Operations</h2>
              <div className="text-xs text-slate-700 space-y-1">
                <p><strong>Team:</strong> {params.teamSize || 'Team size not provided'} employees</p>
                <p><strong>Technology:</strong> {params.technology || 'Technology stack not provided'}</p>
                {params.competencies && <p><strong>Competencies:</strong> {params.competencies.substring(0, 80)}...</p>}
              </div>
            </div>

            {/* Financial Projections */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Financial Projections</h2>
              <div className="text-xs text-slate-700 space-y-1">
                <p><strong>Year 1 Revenue:</strong> {params.revenue1 || 'Revenue baseline not provided'}</p>
                <p><strong>Year 3 Target:</strong> {params.revenue3 || 'Revenue target not provided'}</p>
                <p><strong>Margin Target:</strong> {params.marginTarget ? `${params.marginTarget}%` : 'Margin target not provided'}</p>
              </div>
            </div>

            {/* Strategic Partnerships */}
            {params.partners && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Strategic Partnerships</h2>
                <p className="text-xs text-slate-700">{params.partners.substring(0, 150)}...</p>
              </div>
            )}

            {/* Risk Management */}
            {params.risks && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Risk Management</h2>
                <p className="text-xs text-slate-700">{params.risks.substring(0, 150)}...</p>
              </div>
            )}

            {/* KPIs */}
            {params.kpis && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Key Performance Indicators</h2>
                <p className="text-xs text-slate-700">{params.kpis.substring(0, 150)}...</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-300 pt-4 text-center text-xs text-slate-600">
              <p>Confidential * Strategic Planning Document</p>
            </div>
          </div>
        </div>
      </div>

      {/* STAGES POPUP */}
      {showStagesPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Strategic Report Stages</h2>
              <button onClick={() => setShowStagesPopup(false)} className="p-2 hover:bg-slate-100 rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-3">
              <p className="text-slate-600 text-sm mb-4">Review and approve each stage to build your final document:</p>
              
              {stages.map((stage) => {
                const StageIcon = stage.icon;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setAgreedSections([...agreedSections, stage.id])}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      agreedSections.includes(stage.id)
                        ? 'bg-green-50 border-green-400'
                        : 'bg-slate-50 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <StageIcon size={20} className={agreedSections.includes(stage.id) ? 'text-green-600' : 'text-slate-600'} />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{stage.label}</div>
                        <div className="text-xs text-slate-600 mt-1">{stage.description}</div>
                      </div>
                      {agreedSections.includes(stage.id) && <CheckCircle2 size={20} className="text-green-600" />}
                    </div>
                  </button>
                );
              })}

              <div className="pt-4 border-t-2 border-slate-200">
                <button
                  onClick={() => setShowStagesPopup(false)}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all"
                >
                  Continue with {agreedSections.length} Stage{agreedSections.length !== 1 ? 's' : ''} Approved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainCanvas;

