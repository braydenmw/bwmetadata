import React, { useState } from 'react';
import {
  FileText, Settings, Database, Download, Printer, Plus, Eye, Filter, Zap, Share2, Save, Search,
  CheckCircle, AlertCircle, TrendingUp, PieChart, Users, BarChart3, DollarSign, Globe, Shield, Target, Upload,
  MessageCircle, Send, ChevronDown, ChevronRight, Briefcase, MapPin, Building2, Lightbulb, TrendingDown, MoreVertical,
  Code, Lock, Award, BarChart, Brain, Layers, Edit3, Trash2, Copy, Mail, Clock, X
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
  onChangeViewMode: (mode: string) => void;
}

const MainCanvas: React.FC<MainCanvasProps> = (props) => {
  const { params, setParams, onGenerate, isGenerating } = props;
  
  const [activeStep, setActiveStep] = useState<string>('entity-profile');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'ai', text: 'Welcome! I\'m your AI Consultant. I\'ll provide strategic insights based on the data you enter.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    '1.1': true,
  });
  const [reports, setReports] = useState<any[]>([]);
  const [showReportLibrary, setShowReportLibrary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const validateField = (field: string, value: any, required: boolean = false) => {
    if (required && (!value || value.toString().trim() === '')) {
      setValidationErrors(prev => ({ ...prev, [field]: 'Required' }));
      return false;
    }
    if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setValidationErrors(prev => ({ ...prev, [field]: 'Invalid email' }));
      return false;
    }
    setValidationErrors(prev => { const copy = { ...prev }; delete copy[field]; return copy; });
    return true;
  };

  const handleInputChange = (field: string, value: any, required: boolean = false) => {
    validateField(field, value, required);
    setParams({ ...params, [field]: value });
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
      setChatInput('');
      setTimeout(() => {
        const responses = [
          'Great question! Let me analyze your current data and provide recommendations.',
          'Based on best practices, I recommend prioritizing the areas with highest impact.',
          'Consider the market dynamics and competitive landscape you\'ve described.',
          'Your operational strategy should align with the financial projections you\'ve set.'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { sender: 'ai', text: response }]);
      }, 500);
    }
  };

  const generateReport = () => {
    if (!params.organizationName || !params.organizationType || !params.country) {
      alert('Please fill in all required fields (marked with *)');
      return;
    }
    
    const report = {
      id: Date.now().toString(),
      title: `${params.organizationName} - Strategic Analysis Report`,
      date: new Date().toLocaleDateString(),
      data: JSON.parse(JSON.stringify(params))
    };
    
    setReports([...reports, report]);
    alert('Report generated! Check the Report Library (bottom of left panel).');
  };

  const exportReport = (format: 'pdf' | 'xlsx' | 'html') => {
    if (!params.organizationName) {
      alert('No report data to export. Please complete the form first.');
      return;
    }

    let content = '';
    if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <title>${params.organizationName} - Strategic Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    h1 { color: #000; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { color: #1f2937; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    td { padding: 8px; border: 1px solid #ddd; }
    tr:nth-child(even) { background: #f5f5f5; }
  </style>
</head>
<body>
  <h1>Strategic Analysis Report</h1>
  <p><strong>Organization:</strong> ${params.organizationName}</p>
  <p><strong>Type:</strong> ${params.organizationType}</p>
  <p><strong>Country:</strong> ${params.country}</p>
  <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
  <h2>Report Details</h2>
  <table>
    ${Object.entries(params).map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v || '-'}</td></tr>`).join('')}
  </table>
</body>
</html>`;
    } else {
      content = `Strategic Analysis Report\nOrganization: ${params.organizationName}\nType: ${params.organizationType}\nCountry: ${params.country}\n\n${Object.entries(params).map(([k, v]) => `${k}: ${v}`).join('\n')}`;
    }

    const blob = new Blob([content], { type: format === 'html' ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report.${format === 'xlsx' ? 'csv' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderFormField = (label: string, type: string, field: string, required: boolean = false) => (
    <div key={field}>
      <label className="text-xs font-bold text-slate-900 block mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {type === 'select' ? (
        <select value={params[field] || ''} onChange={(e) => handleInputChange(field, e.target.value, required)} 
          className="w-full p-2 border-2 border-slate-300 rounded text-sm focus:outline-none focus:border-slate-900 bg-white">
          <option value="">Select {label.toLowerCase()}</option>
          {field === 'organizationType' && [
            <option key="corp" value="Corporation">Corporation</option>,
            <option key="llc" value="LLC">LLC</option>,
            <option key="partnership" value="Partnership">Partnership</option>,
            <option key="ngo" value="NGO">NGO</option>
          ]}
          {field === 'marketSegment' && [
            <option key="b2b" value="B2B">B2B</option>,
            <option key="b2c" value="B2C">B2C</option>,
            <option key="b2g" value="B2G">B2G</option>,
            <option key="hybrid" value="Hybrid">Hybrid</option>
          ]}
          {field === 'companyStage' && [
            <option key="startup" value="Startup">Startup</option>,
            <option key="growth" value="Growth">Growth Stage</option>,
            <option key="scale" value="Scale">Scale-up</option>,
            <option key="mature" value="Mature">Mature</option>
          ]}
          {field === 'industry' && [
            <option key="tech" value="Technology">Technology</option>,
            <option key="fin" value="Finance">Finance</option>,
            <option key="health" value="Healthcare">Healthcare</option>,
            <option key="ret" value="Retail">Retail</option>,
            <option key="mfg" value="Manufacturing">Manufacturing</option>
          ]}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={params[field] || ''} onChange={(e) => handleInputChange(field, e.target.value, required)} 
          placeholder={`Enter ${label.toLowerCase()}`} 
          className="w-full p-2 border-2 border-slate-300 rounded text-sm focus:outline-none focus:border-slate-900 h-24" />
      ) : (
        <input type={type} value={params[field] || ''} onChange={(e) => handleInputChange(field, e.target.value, required)} 
          placeholder={`Enter ${label.toLowerCase()}`} 
          className="w-full p-2 border-2 border-slate-300 rounded text-sm focus:outline-none focus:border-slate-900" />
      )}
      {validationErrors[field] && <p className="text-xs text-red-600 mt-1">{validationErrors[field]}</p>}
    </div>
  );

  const workflowSteps = [
    { id: 'entity-profile', number: '1.0', title: 'Entity Profile & Legal Structure', icon: Building2 },
    { id: 'market-analysis', number: '2.0', title: 'Market Analysis', icon: TrendingUp },
    { id: 'financial-planning', number: '3.0', title: 'Financial Planning', icon: DollarSign },
    { id: 'operational-strategy', number: '4.0', title: 'Operational Strategy', icon: Layers },
    { id: 'partnership-analysis', number: '5.0', title: 'Partnership Analysis', icon: Users },
    { id: 'compliance-governance', number: '6.0', title: 'Compliance & Governance', icon: Shield },
    { id: 'performance-metrics', number: '7.0', title: 'Performance Metrics', icon: BarChart3 },
    { id: 'export-reporting', number: '8.0', title: 'Export & Reporting', icon: FileText },
  ];

  return (
    <div className="flex-1 w-full flex h-full bg-white font-sans text-slate-900 overflow-hidden">
      {/* LEFT PANEL: AI CONSULTANT + WORKFLOW */}
      <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white border-r-2 border-slate-700 overflow-hidden" style={{ flexBasis: '18%' }}>
        
        {/* AI Consultant */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-800 to-slate-900 p-3 border-b border-slate-700 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-600">
            <Brain size={16} className="text-blue-400" />
            <h3 className="font-bold text-xs">AI Consultant</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto mb-3 space-y-2 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`text-xs ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
              placeholder="Ask..." 
              className="flex-1 text-xs bg-slate-700 text-white rounded px-2 py-2 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <button onClick={handleSendMessage} className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-all">
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 border-b border-slate-700">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Workflow</div>
          <div className="space-y-1">
            {workflowSteps.map((step) => (
              <button key={step.id} onClick={() => setActiveStep(step.id)} 
                className={`w-full text-left p-2 rounded transition-all text-xs ${
                  activeStep === step.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}>
                <div className="font-bold">{step.number} {step.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Report Library */}
        <div className="border-t border-slate-700 p-3 flex-shrink-0">
          <button onClick={() => setShowReportLibrary(!showReportLibrary)} 
            className="w-full py-2 px-3 bg-slate-700 text-white font-bold rounded hover:bg-slate-600 transition-all text-xs mb-2">
            <FileText size={14} className="inline mr-2" />Reports ({reports.length})
          </button>
          {showReportLibrary && reports.length > 0 && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
              {reports.map((r) => (
                <div key={r.id} className="p-2 bg-slate-700 rounded text-xs">
                  <div className="font-bold text-slate-200 truncate">{r.title}</div>
                  <div className="text-slate-400 text-[10px]">{r.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-3 space-y-2 flex-shrink-0 border-t border-slate-700">
          <button onClick={generateReport} className="w-full py-2 px-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-all text-xs">
            <Save size={14} className="inline mr-2" />Save Report
          </button>
          <button onClick={() => setShowReportLibrary(!showReportLibrary)} className="w-full py-2 px-3 bg-slate-700 text-white font-bold rounded hover:bg-slate-600 transition-all text-xs">
            <Plus size={14} className="inline mr-2" />New Analysis
          </button>
        </div>
      </div>

      {/* CENTER PANEL: COMPREHENSIVE FORMS */}
      <div className="flex-1 flex flex-col h-full bg-white border-r border-slate-200 overflow-hidden" style={{ flexBasis: '41%' }}>
        <div className="h-14 bg-white border-b border-slate-200 flex items-center px-6 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-900">
            {workflowSteps.find(s => s.id === activeStep)?.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
          {/* Step 1: Entity Profile */}
          {activeStep === 'entity-profile' && (
            <div className="space-y-6">
              {/* 1.1 Legal Structure */}
              <div>
                <button onClick={() => toggleSection('1.1')} 
                  className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                  <div>
                    <h3 className="text-sm font-bold">1.1 Legal Structure & Jurisdiction</h3>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${expandedSections['1.1'] ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections['1.1'] && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                    {renderFormField('Organization Name', 'text', 'organizationName', true)}
                    {renderFormField('Legal Entity Type', 'select', 'organizationType', true)}
                    {renderFormField('Country of Incorporation', 'text', 'country', true)}
                    {renderFormField('Registration Number', 'text', 'registrationNumber')}
                    {renderFormField('Establishment Date', 'date', 'establishmentDate')}
                  </div>
                )}
              </div>

              {/* 1.2 Operational Details */}
              <div>
                <button onClick={() => toggleSection('1.2')} 
                  className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                  <div>
                    <h3 className="text-sm font-bold">1.2 Operational Details</h3>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${expandedSections['1.2'] ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections['1.2'] && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                    {renderFormField('Operating Regions', 'text', 'operatingRegions')}
                    {renderFormField('Primary Industry', 'select', 'industry')}
                    {renderFormField('Company Stage', 'select', 'companyStage')}
                    {renderFormField('Number of Employees', 'number', 'employeeCount')}
                    {renderFormField('Current Annual Revenue', 'number', 'currentRevenue')}
                  </div>
                )}
              </div>

              {/* 1.3 Organizational Structure */}
              <div>
                <button onClick={() => toggleSection('1.3')} 
                  className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                  <div>
                    <h3 className="text-sm font-bold">1.3 Organizational Structure</h3>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${expandedSections['1.3'] ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections['1.3'] && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                    {renderFormField('CEO Name', 'text', 'ceoName')}
                    {renderFormField('CFO Name', 'text', 'cfoName')}
                    {renderFormField('COO Name', 'text', 'cooName')}
                    {renderFormField('Board Members', 'text', 'boardMembers')}
                    {renderFormField('Key Departments', 'textarea', 'departments')}
                  </div>
                )}
              </div>

              {/* 1.4 Business Model */}
              <div>
                <button onClick={() => toggleSection('1.4')} 
                  className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                  <div>
                    <h3 className="text-sm font-bold">1.4 Business Model & Revenue Streams</h3>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${expandedSections['1.4'] ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections['1.4'] && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                    {renderFormField('Market Segment', 'select', 'marketSegment')}
                    {renderFormField('Primary Revenue Stream', 'text', 'primaryRevenue')}
                    {renderFormField('Secondary Revenue Streams', 'textarea', 'secondaryRevenue')}
                    {renderFormField('Customer Acquisition Cost', 'number', 'cac')}
                    {renderFormField('Customer Lifetime Value', 'number', 'ltv')}
                  </div>
                )}
              </div>

              {/* 1.5 Strategic Positioning */}
              <div>
                <button onClick={() => toggleSection('1.5')} 
                  className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                  <div>
                    <h3 className="text-sm font-bold">1.5 Strategic Positioning & Vision</h3>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${expandedSections['1.5'] ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections['1.5'] && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                    {renderFormField('Mission Statement', 'textarea', 'mission')}
                    {renderFormField('Vision Statement', 'textarea', 'vision')}
                    {renderFormField('Core Values', 'textarea', 'values')}
                    {renderFormField('Competitive Advantage', 'textarea', 'competitiveAdvantage')}
                    {renderFormField('3-Year Strategic Goals', 'textarea', 'strategicGoals')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Market Analysis */}
          {activeStep === 'market-analysis' && (
            <div className="space-y-6">
              {['2.1 Market Overview & Size', '2.2 Competitive Analysis', '2.3 Customer Segmentation', '2.4 Market Trends & Opportunities', '2.5 Market Risks & Threats'].map((title, i) => (
                <div key={i}>
                  <button onClick={() => toggleSection(`2.${i+1}`)} 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <ChevronDown size={18} className={`transition-transform ${expandedSections[`2.${i+1}`] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections[`2.${i+1}`] && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                      {renderFormField(`Field 1`, 'text', `market_${i}_1`)}
                      {renderFormField(`Field 2`, 'textarea', `market_${i}_2`)}
                      {renderFormField(`Field 3`, 'number', `market_${i}_3`)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Financial Planning */}
          {activeStep === 'financial-planning' && (
            <div className="space-y-6">
              {['3.1 Revenue Projections', '3.2 Cost Structure & COGS', '3.3 Operating Expenses', '3.4 Capital Requirements', '3.5 Financial Metrics & Ratios'].map((title, i) => (
                <div key={i}>
                  <button onClick={() => toggleSection(`3.${i+1}`)} 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <ChevronDown size={18} className={`transition-transform ${expandedSections[`3.${i+1}`] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections[`3.${i+1}`] && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                      {renderFormField(`Amount (Year 1)`, 'number', `finance_${i}_y1`)}
                      {renderFormField(`Amount (Year 2)`, 'number', `finance_${i}_y2`)}
                      {renderFormField(`Amount (Year 3)`, 'number', `finance_${i}_y3`)}
                      {renderFormField(`Notes`, 'textarea', `finance_${i}_notes`)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Operational Strategy */}
          {activeStep === 'operational-strategy' && (
            <div className="space-y-6">
              {['4.1 Implementation Roadmap', '4.2 Resource Allocation', '4.3 Technology & Systems', '4.4 Supply Chain & Logistics', '4.5 Quality & Compliance'].map((title, i) => (
                <div key={i}>
                  <button onClick={() => toggleSection(`4.${i+1}`)} 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <ChevronDown size={18} className={`transition-transform ${expandedSections[`4.${i+1}`] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections[`4.${i+1}`] && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                      {renderFormField(`Initiative`, 'text', `ops_${i}_1`)}
                      {renderFormField(`Timeline`, 'text', `ops_${i}_2`)}
                      {renderFormField(`Owner`, 'text', `ops_${i}_3`)}
                      {renderFormField(`Description`, 'textarea', `ops_${i}_4`)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 5: Partnership Analysis */}
          {activeStep === 'partnership-analysis' && (
            <div className="space-y-6">
              {['5.1 Strategic Partners', '5.2 Distribution Channels', '5.3 Technology Partners', '5.4 Supplier Relationships', '5.5 Partnership Terms'].map((title, i) => (
                <div key={i}>
                  <button onClick={() => toggleSection(`5.${i+1}`)} 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <ChevronDown size={18} className={`transition-transform ${expandedSections[`5.${i+1}`] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections[`5.${i+1}`] && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                      {renderFormField(`Partner Name`, 'text', `partner_${i}_1`)}
                      {renderFormField(`Partnership Type`, 'text', `partner_${i}_2`)}
                      {renderFormField(`Value Proposition`, 'textarea', `partner_${i}_3`)}
                      {renderFormField(`Contract Status`, 'text', `partner_${i}_4`)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 6: Compliance & Governance */}
          {activeStep === 'compliance-governance' && (
            <div className="space-y-6">
              {['6.1 Regulatory Requirements', '6.2 Governance Structure', '6.3 Compliance Policies', '6.4 Risk Management', '6.5 Audit & Reporting'].map((title, i) => (
                <div key={i}>
                  <button onClick={() => toggleSection(`6.${i+1}`)} 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <ChevronDown size={18} className={`transition-transform ${expandedSections[`6.${i+1}`] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections[`6.${i+1}`] && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                      {renderFormField(`Requirement`, 'text', `comp_${i}_1`)}
                      {renderFormField(`Status`, 'select', `comp_${i}_2`)}
                      {renderFormField(`Responsible Party`, 'text', `comp_${i}_3`)}
                      {renderFormField(`Notes`, 'textarea', `comp_${i}_4`)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 7: Performance Metrics */}
          {activeStep === 'performance-metrics' && (
            <div className="space-y-6">
              {['7.1 Financial KPIs', '7.2 Operational KPIs', '7.3 Customer Metrics', '7.4 Employee Metrics', '7.5 Strategic Metrics'].map((title, i) => (
                <div key={i}>
                  <button onClick={() => toggleSection(`7.${i+1}`)} 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <ChevronDown size={18} className={`transition-transform ${expandedSections[`7.${i+1}`] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections[`7.${i+1}`] && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                      {renderFormField(`KPI Name`, 'text', `kpi_${i}_1`)}
                      {renderFormField(`Target Value`, 'number', `kpi_${i}_2`)}
                      {renderFormField(`Current Value`, 'number', `kpi_${i}_3`)}
                      {renderFormField(`Frequency`, 'select', `kpi_${i}_4`)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 8: Export & Reporting */}
          {activeStep === 'export-reporting' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h3 className="text-sm font-bold text-blue-900 mb-4">Export Report</h3>
                <div className="space-y-2">
                  <button onClick={() => exportReport('pdf')} className="w-full p-3 bg-white border-2 border-blue-200 rounded hover:bg-blue-100 transition-all text-sm font-bold text-left">
                    <Download size={16} className="inline mr-2" />Export as PDF
                  </button>
                  <button onClick={() => exportReport('xlsx')} className="w-full p-3 bg-white border-2 border-blue-200 rounded hover:bg-blue-100 transition-all text-sm font-bold text-left">
                    <Download size={16} className="inline mr-2" />Export as Excel/CSV
                  </button>
                  <button onClick={() => exportReport('html')} className="w-full p-3 bg-white border-2 border-blue-200 rounded hover:bg-blue-100 transition-all text-sm font-bold text-left">
                    <Download size={16} className="inline mr-2" />Export as HTML
                  </button>
                </div>
              </div>

              {['8.1 Distribution List', '8.2 Report Schedule', '8.3 Stakeholder Feedback', '8.4 Revision History', '8.5 Archive Settings'].map((title, i) => (
                <div key={i}>
                  <button onClick={() => toggleSection(`8.${i+1}`)} 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg border-2 border-slate-300 hover:border-slate-900 bg-slate-50 transition-all">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <ChevronDown size={18} className={`transition-transform ${expandedSections[`8.${i+1}`] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections[`8.${i+1}`] && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                      {renderFormField(`Field 1`, 'text', `exp_${i}_1`)}
                      {renderFormField(`Field 2`, 'text', `exp_${i}_2`)}
                      {renderFormField(`Field 3`, 'textarea', `exp_${i}_3`)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: LIVE REPORT PREVIEW */}
      <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden" style={{ flexBasis: '41%' }}>
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Eye size={16} /> Live Preview
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportReport('pdf')} className="p-2 hover:bg-slate-100 rounded transition-all" title="Download PDF">
              <Download size={16} className="text-slate-600" />
            </button>
            <button onClick={() => exportReport('html')} className="p-2 hover:bg-slate-100 rounded transition-all" title="Print">
              <Printer size={16} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex justify-center">
          <div className="bg-white w-full max-w-2xl shadow-xl rounded-lg overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <h1 className="text-3xl font-bold mb-2">Strategic Analysis Report</h1>
              <p className="text-sm text-slate-300">Organization: <span className="font-bold">{params.organizationName || 'Pending...'}</span></p>
              <p className="text-sm text-slate-300">Type: <span className="font-bold">{params.organizationType || 'Pending...'}</span></p>
              <p className="text-sm text-slate-300">Country: <span className="font-bold">{params.country || 'Pending...'}</span></p>
              <p className="text-sm text-slate-300 mt-2">Generated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2 border-slate-200">Executive Summary</h2>
                <p className="text-sm text-slate-700">
                  This comprehensive strategic analysis includes entity profile, market analysis, financial planning, operational strategy, partnership analysis, compliance framework, and performance metrics.
                </p>
              </div>

              {params.organizationName && (
                <div>
                  <h2 className="text-xl font-bold mb-3 pb-2 border-b-2 border-slate-200">Organization Overview</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(params).slice(0, 8).map(([k, v]) => (
                      v && <div key={k}><span className="font-bold text-slate-900">{k}:</span> <span className="text-slate-700">{String(v)}</span></div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold mb-3 pb-2 border-b-2 border-slate-200">Workflow Progress</h3>
                <div className="space-y-2">
                  {workflowSteps.map((step) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeStep === step.id ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}>
                        {step.number.split('.')[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{step.number} {step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCanvas;
