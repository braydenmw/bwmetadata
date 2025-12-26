/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    Building2, Target, ShieldCheck, Shield,
    Download, Printer, Globe,
    Check, CheckCircle,
    Network, History,
    Zap, Users, Scale, GitBranch,
    FileText, BarChart3, Handshake, TrendingUp,
    Database, Calculator, PieChart, Activity, Cpu, AlertCircle,
    X, Plus, MessageCircle, Send, User, ArrowRight, DollarSign, RefreshCw
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ReportParameters, ReportData, GenerationPhase, CopilotInsight, toolCategories, RefinedIntake } from '../types';
import DocumentGenerationSuite from './DocumentGenerationSuite';
import { DocumentUploadModal } from './DocumentUploadModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ENTITY_TYPES, COUNTRIES, INDUSTRIES } from '../constants/businessData';
import { evaluateDocReadiness } from '../services/intakeMapping';
import useAdvisorSnapshot from '../hooks/useAdvisorSnapshot';

const REQUIRED_FIELDS: Record<string, (keyof ReportParameters)[]> = {
    identity: ['organizationName', 'organizationType', 'country'],
    mandate: ['strategicIntent', 'problemStatement'],
    market: ['userCity'],
    'partner-personas': ['partnerPersonas'],
    risk: ['riskTolerance'],
};

const STAKEHOLDER_ALIGNMENT_GROUPS = [
    'Executive Leadership',
    'Board / Investors',
    'Legal & Compliance',
    'Finance & Treasury',
    'Product & Engineering',
    'Operations & Delivery',
    'Government Affairs / Public Policy',
    'Regional / Field Teams',
    'Customers / End Users',
    'External Advisors / Consultants'
];

const PARTNER_FIT_CRITERIA = [
    'Regulatory Influence',
    'Capital Capacity',
    'Local Market Access',
    'Technology / IP Depth',
    'Operational Excellence',
    'Risk Appetite Alignment',
    'ESG & Reputation',
    'Speed to Deploy',
    'Cultural Compatibility',
    'Talent Access'
];

const RELATIONSHIP_GOALS = [
    'Co-develop Solutions',
    'Enter New Market',
    'Secure Policy Support',
    'Scale Distribution Network',
    'Launch Joint Innovation Lab',
    'Create Investment Vehicle',
    'Share Infrastructure',
    'Accelerate Commercialization'
];

const PARTNER_READINESS_LEVELS = [
    'Exploration',
    'Shortlisting',
    'Due Diligence',
    'Negotiation',
    'Contracting',
    'Launch / Scaling'
];

const ENTITY_CLASSIFICATIONS = [
    { value: 'government', label: 'Government / Public Sector', description: 'Ministries, agencies, sovereign funds, public authorities' },
    { value: 'enterprise', label: 'Enterprise / Corporate', description: 'Private or public companies, conglomerates, holding groups' },
    { value: 'financial', label: 'Financial Institution', description: 'Banks, DFIs, funds, insurance groups, treasuries' },
    { value: 'multilateral', label: 'Multilateral / IGO', description: 'UN bodies, development banks, trade blocs, coalitions' },
    { value: 'ngo', label: 'NGO / Foundation', description: 'Non-profits, philanthropies, civic alliances, academia' },
    { value: 'startup', label: 'Venture / Startup / Lab', description: 'Venture teams, innovation labs, early-stage companies' }
];

const GUIDANCE_MODES = [
    { value: 'orientation', label: 'I need orientation', description: 'Guide me through the basics step-by-step.' },
    { value: 'collaborative', label: 'Work alongside me', description: 'Switch between prompts and my own notes.' },
    { value: 'expert', label: 'I know this drill', description: 'Fast capture—just log what I enter.' }
];

const SIGNAL_BADGE_STYLES: Record<string, string> = {
    opportunity: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    risk: 'bg-rose-50 text-rose-700 border-rose-200',
    benchmark: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    trend: 'bg-amber-50 text-indigo-900 border-amber-200',
};

const formatCapitalFigure = (value?: number) => {
    if (value === undefined || value === null) return 'n/a';
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
};

const formatMonths = (value?: number) => {
    if (!value) return 'n/a';
    return `${value} mo`;
};

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
  insights?: CopilotInsight[];
  autonomousMode?: boolean;
  autonomousSuggestions?: string[];
  isAutonomousThinking?: boolean;
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
    params, setParams, onGenerate, onChangeViewMode, reports, onOpenReport, onDeleteReport, onNewAnalysis, reportData, isGenerating, generationPhase, generationProgress, onCopilotMessage,
    insights = [], autonomousMode = false, autonomousSuggestions = [], isAutonomousThinking = false
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalView, setModalView] = useState('main'); // 'main' or a specific tool id
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({});
  const [injectedComponents, setInjectedComponents] = useState<any[]>([]);
  const [chartConfig, setChartConfig] = useState({
    title: '',
    dataSource: '',
  });
  const [roiResult, setRoiResult] = useState<{ roi: number; irr: number; payback: number } | null>(null);
  const [roiInputs, setRoiInputs] = useState({
    investment: '500000',
    revenue: '200000',
    costs: '75000'
  });
  const [generationConfig, setGenerationConfig] = useState<any>({});
  const [isDraftFinalized, setIsDraftFinalized] = useState(false);
  const [showFinalizationModal, setShowFinalizationModal] = useState(false);
  const [selectedFinalReports, setSelectedFinalReports] = useState<string[]>([]);
  const [showDocGenSuite, setShowDocGenSuite] = useState(false);
  const [partnerPersonas, setPartnerPersonas] = useState<string[]>([]);
  const [generatedDocs, setGeneratedDocs] = useState<{id: string, title: string, desc: string, timestamp: Date}[]>([]);
  const [selectedIntelligenceEnhancements, setSelectedIntelligenceEnhancements] = useState<string[]>([]);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);

  const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'bw', timestamp: Date}>>([
    { text: "Hello! I'm your BW Consultant. How can I help you with your partnership analysis today?", sender: 'bw', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
    const { snapshot: advisorSnapshot, refresh: refreshAdvisorSnapshot } = useAdvisorSnapshot(params);
    const [advisorExpanded, setAdvisorExpanded] = useState(true);
    const [advisorRefreshing, setAdvisorRefreshing] = useState(false);
    const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const advisorPanelRef = useRef<HTMLDivElement | null>(null);

    const handleAdvisorRefresh = useCallback(() => {
        setAdvisorRefreshing(true);
        refreshAdvisorSnapshot();
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
        refreshTimeoutRef.current = setTimeout(() => {
            setAdvisorRefreshing(false);
            refreshTimeoutRef.current = null;
        }, 600);
    }, [refreshAdvisorSnapshot]);

    useEffect(() => () => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
    }, []);

    const scrollAdvisorPanelIntoView = useCallback(() => {
        setAdvisorExpanded(true);
        advisorPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [setAdvisorExpanded]);

    const refinedIntake: RefinedIntake = useMemo(() => ({
        identity: {
            entityName: params.organizationName || 'Unnamed Entity',
            registrationCountry: params.country,
            registrationCity: params.userCity,
            industryClassification: params.industry?.[0],
        },
        mission: {
            strategicIntent: params.strategicIntent || [],
            objectives: params.strategicObjectives || [],
            timelineHorizon: params.expansionTimeline as RefinedIntake['mission']['timelineHorizon'],
        },
        counterparties: (params.partnerPersonas || []).map(p => ({ name: p, relationshipStage: 'intro' })),
        constraints: {
            budgetUSD: params.dealSize ? Number(params.dealSize) : undefined,
            riskTolerance: params.riskTolerance as 'low' | 'medium' | 'high' | undefined,
        },
        proof: {
            documents: (params.ingestedDocuments || []).map(doc => ({
                name: doc.filename,
                type: doc.fileType,
            })),
        },
        contacts: {},
    }), [params]);

    const docReadiness = useMemo(() => evaluateDocReadiness(refinedIntake), [refinedIntake]);
    const canLaunchDocSuite = docReadiness['executive-summary'] === 'ready' || docReadiness['entry-advisory'] === 'ready';

    const completeness = React.useMemo(() => {
        const total = Object.values(REQUIRED_FIELDS).flat().length;
        let filled = 0;
        Object.values(REQUIRED_FIELDS).flat().forEach(field => {
            const value = params[field as keyof ReportParameters];
            if (Array.isArray(value) ? value.length > 0 : Boolean(value)) filled += 1;
        });
        return Math.round((filled / Math.max(total, 1)) * 100);
    }, [params]);

    const isStepComplete = (stepId: string) => {
        if (!REQUIRED_FIELDS[stepId]) return false;
        return REQUIRED_FIELDS[stepId].every(field => {
            const value = params[field as keyof ReportParameters];
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return !!value;
        });
    };

    const identityComplete = isStepComplete('identity');
    const strategyComplete = isStepComplete('mandate') && isStepComplete('market');
    const nextStrategyModal = !isStepComplete('mandate') ? 'mandate' : 'market';
    const readinessForDraft = identityComplete && strategyComplete && completeness >= 50;

  const toggleSubsection = (key: string) => {
    setExpandedSubsections(prev => ({ ...prev, [key]: !prev[key] }));
  };

    const toggleArrayValue = (field: keyof ReportParameters, value: string) => {
        const currentValue = params[field];
        const currentArray = Array.isArray(currentValue) ? (currentValue as string[]) : [];
        const updatedArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
        setParams({ ...params, [field]: updatedArray } as ReportParameters);
    };

    const handleDocumentProcessed = useCallback((docMeta: any) => {
        if (!docMeta) return;
        const normalizedDocument = {
            filename: docMeta.filename || `Document ${(params.ingestedDocuments?.length || 0) + 1}`,
            fileType: docMeta.fileType,
            fileSize: docMeta.fileSize,
            wordCount: docMeta.wordCount,
            uploadedAt: new Date().toISOString(),
        };
        setParams({
            ...params,
            ingestedDocuments: [...(params.ingestedDocuments || []), normalizedDocument],
        });
    }, [params, setParams]);

    const handleDocumentRemoval = useCallback((filename: string) => {
        setParams({
            ...params,
            ingestedDocuments: (params.ingestedDocuments || []).filter(doc => doc.filename !== filename),
        });
    }, [params, setParams]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = { text: chatInput, sender: 'user' as const, timestamp: new Date() };
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');

      // Simulate context-aware BW response
      setTimeout(() => {
        let responseText = "Thank you for your input. Let me help you refine that aspect of your partnership strategy.";
        if (chatInput.toLowerCase().includes('risk')) {
          responseText = `Regarding risk for ${params.organizationName}, your current tolerance is set to '${params.riskTolerance}'. We should focus on mitigating financial and operational risks for your goal of '${params.strategicIntent[0]}'.`;
        } else if (chatInput.toLowerCase().includes('partner')) {
          responseText = `For your partnership objectives, finding a partner that complements your goal of '${params.strategicIntent[0]}' is key. Let's ensure the 'Ideal Partner Profile' section is detailed.`
        }
        const bwResponse = { text: responseText, sender: 'bw' as const, timestamp: new Date() };
        setChatMessages(prev => [...prev, bwResponse]);
      }, 1000);
    }
  };

    const renderCompletenessBadge = () => {
        if (completeness <= 0) return null;
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                <div className="w-24 h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${completeness}%` }} />
                </div>
                <span className="font-semibold">Readiness checklist: {completeness}%</span>
            </div>
        );
    };

  const openModal = (id: string) => {
    if (id === 'generation') {
      setIsDraftFinalized(true);
      setChatMessages(prev => [...prev, {
        text: "The draft has been compiled based on your inputs. Please review the Strategic Roadmap on the right. When you are ready, accept the draft to proceed to the official report selection.",
        sender: 'bw',
        timestamp: new Date()
      }]);
      return;
    }
    setActiveModal(id);
    setValidationErrors([]); // Clear previous errors
    setGenerationConfig({}); // Clear previous generation config
    setModalView('main'); // Reset to main view whenever a new modal is opened
  };

  // ... (other handlers remain the same)

  const handleAddChart = () => {
    if (chartConfig.title && chartConfig.dataSource) {
      setInjectedComponents(prev => [...prev, { type: 'chart', config: chartConfig }]);
      setChartConfig({ title: '', dataSource: '' });
      setActiveModal(null);
    } else {
      // Basic validation for chart config
      alert('Please provide a title and select a data source.');
    }
  };

  const handleFinalReportSelection = (reportId: string) => {
    setSelectedFinalReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleIntelligenceEnhancementToggle = (enhancementId: string) => {
    setSelectedIntelligenceEnhancements(prev =>
      prev.includes(enhancementId)
        ? prev.filter(id => id !== enhancementId)
        : [...prev, enhancementId]
    );
  };

    const summaryBlueprint = [
        {
            id: 'identity',
            label: '1. Intake foundation',
            description: identityComplete
                ? 'Identity captured. You can always refine ownership or ministry context.'
                : 'Tell Nexus who owns this mission and what clearance you need.',
            complete: identityComplete,
            cta: identityComplete ? 'Review identity' : 'Complete identity',
            onClick: () => openModal('identity'),
            disabled: false,
        },
        {
            id: 'strategy',
            label: '2. Strategy inputs',
            description: strategyComplete
                ? 'Mandate and market context logged; align KPIs next.'
                : 'Add mandate + market detail so the advisor knows where to aim.',
            complete: strategyComplete,
            cta: strategyComplete ? 'Refine strategy' : 'Add strategy',
            onClick: () => openModal(nextStrategyModal),
            disabled: false,
        },
        {
            id: 'draft',
            label: '3. Generate summary',
            description: readinessForDraft
                ? 'Ready to generate an AI summary draft and intelligence bundle.'
                : 'Finish foundation + strategy to unlock auto-drafted summaries.',
            complete: isDraftFinalized,
            cta: isDraftFinalized ? 'Regenerate draft' : 'Generate summary',
            onClick: () => {
                if (!readinessForDraft) {
                    openModal(identityComplete ? 'mandate' : 'identity');
                    return;
                }
                onGenerate();
            },
            disabled: !readinessForDraft,
        },
    ];

    type ReportContentSection = 'executiveSummary' | 'marketAnalysis' | 'recommendations' | 'implementation' | 'financials' | 'risks';

    const applyIntelligenceEnhancements = useCallback((baseReport: ReportData): ReportData => {
        const enhancedReport: ReportData = { ...baseReport };

        selectedIntelligenceEnhancements.forEach(enhancement => {
            // Helper to safely append narrative content to supported sections
            const appendContent = (section: ReportContentSection, content: string) => {
                const targetSection = enhancedReport[section];
                if (targetSection) {
                    targetSection.content = (targetSection.content || '') + `\n\n${content}`;
                }
            };

            switch (enhancement) {
        case 'roi-diagnostic':
          if (roiResult) {
            appendContent('financials', `**ROI Diagnostic Analysis:**\n- Investment: $${parseFloat(roiInputs.investment).toLocaleString()}\n- Projected Annual Revenue: $${parseFloat(roiInputs.revenue).toLocaleString()}\n- Operational Costs: $${parseFloat(roiInputs.costs).toLocaleString()}\n- ROI: ${roiResult.roi.toFixed(1)}%\n- IRR: ${roiResult.irr.toFixed(1)}%\n- Payback Period: ${roiResult.payback.toFixed(2)} years`);
          }
          break;

        case 'scenario-planning':
          appendContent('marketAnalysis', `**Scenario Planning:**\n- Best Case: Assumes rapid market adoption and 30% YoY growth.\n- Base Case: Models steady growth of 15% YoY with moderate competition.\n- Worst Case: Considers an economic downturn and the entry of a new major competitor.`);
          break;

        case 'due-diligence':
          appendContent('risks', `**Due Diligence Findings (Simulated):**\n- Financial Health: Strong balance sheet, consistent profitability.\n- Legal Compliance: All major certifications appear current.\n- Operational Capacity: Scalable infrastructure seems to be in place.\n- Market Reputation: Initial feedback from the market is positive.`);
          break;

        case 'partner-compatibility':
          appendContent('marketAnalysis', `**Partner Compatibility Analysis (vs. ${params.partnerPersonas?.[0] || 'Ideal Persona'}):**\n- Strategic Alignment: 85% match based on stated objectives.\n- Cultural Fit: High compatibility due to similar risk tolerance ('${params.riskTolerance}').\n- Operational Synergy: Medium integration complexity expected.\n- Value Creation Potential: Estimated $3.2M in combined benefits.`);
          break;

        case 'diversification-analysis':
          appendContent('marketAnalysis', `**Diversification Analysis:**\n- Current Concentration: High dependency on the '${params.industry?.[0]}' sector.\n- Recommended Markets: Healthcare, FinTech, and Clean Energy show low correlation.\n- Risk Reduction: A 35% portfolio diversification benefit is projected.`);
          break;

        case 'ethical-compliance':
          appendContent('risks', `**Ethical Compliance Assessment:**\n- ESG Score (Simulated): 78/100\n- Labor Practices: Assumed compliant with standards in ${params.country}.\n- Governance: Strong board oversight is recommended.\n- Recommendation: Proceed with standard ESG monitoring protocols.`);
          break;

        case 'historical-precedents':
          appendContent('marketAnalysis', `**Historical Precedents Analysis:**\n- Success Rate: Similar deals in the '${params.industry?.[0]}' sector show a 67% success rate.\n- Key Success Factors: Strong local market knowledge and rapid technology integration.\n- Warning Signs: Over-ambitious timelines ('${params.expansionTimeline}') can be a risk factor.`);
          break;

        case 'growth-modeling':
          appendContent('financials', `**Growth Modeling Projections:**\n- Year 1: $2.1M revenue (15% growth)\n- Year 3: $3.9M revenue (39% growth)\n- Year 5: $7.2M revenue (45% CAGR)\n- These projections are based on capturing a small fraction of the target market in ${params.userCity}.`);
          break;

        case 'stakeholder-analysis':
          appendContent('marketAnalysis', `**Stakeholder Analysis:**\n- High Influence/High Interest: Government regulators in ${params.country}, major customers.\n- High Influence/Low Interest: Industry associations.\n- Communication Strategy: Quarterly updates for all key stakeholders are recommended.`);
          break;

        case 'geopolitical-risk':
          appendContent('risks', `**Geopolitical Risk Assessment for ${params.country}:**\n- Country Stability (Simulated): High (Score: 82/100)\n- Trade Relations: Favorable bilateral agreements are in place.\n- Currency Risk: Moderate volatility is expected and should be hedged.\n- Regulatory Environment: Business-friendly policies noted.`);
          break;

        case 'valuation-engine':
          appendContent('financials', `**Valuation Engine Results (Simulated):**\n- DCF Valuation: $8.5M enterprise value.\n- Comparable Transactions: $7.2M average for deals in the '${params.industry?.[0]}' sector.\n- Recommended Valuation: $7.8M.\n- Key Value Drivers: Technology IP, market position in ${params.userCity}.`);
          break;

        case 'performance-metrics':
          appendContent('financials', `**Performance Metrics Dashboard (Targets):**\n- Target Revenue Growth: 25% YoY\n- Target Customer Acquisition Cost: < $500\n- Target Customer Lifetime Value: > $8,000\n- Target Churn Rate: < 8%\n- Target Net Promoter Score: > 70`);
          break;

        case 'supply-chain-analysis':
          appendContent('risks', `**Supply Chain Analysis:**\n- Dependency Concentration: Analysis indicates a need to diversify suppliers beyond the primary ones in ${params.region || 'target markets'}.\n- Risk Mitigation: Backup suppliers in adjacent regions should be identified.\n- Cost Optimization: 12% potential savings through localizing supply chains in ${params.userCity}.`);
          break;

        case 'charts':
          appendContent('financials', `**Charts Integration:**\n- Visual charts have been added to represent key data points visually.`);
          break;

        case 'data':
          appendContent('marketAnalysis', `**Data Visualization:**\n- Key data tables and metrics have been integrated for clarity.`);
          break;

        case 'ai-analysis':
          appendContent('marketAnalysis', `**AI Analysis:**\n- Advanced AI-driven insights have been applied to the dataset to identify non-obvious correlations and predictive trends.`);
          break;

        case 'content':
          appendContent('executiveSummary', `**Content Enhancement:**\n- The narrative of this report has been automatically enhanced for clarity, flow, and impact.`);
          break;
      }
    });

        return enhancedReport;
    }, [selectedIntelligenceEnhancements, roiResult, roiInputs, params]);

    const enhancedReportData = React.useMemo(
        () => (selectedIntelligenceEnhancements.length > 0
            ? applyIntelligenceEnhancements(reportData)
            : reportData),
        [reportData, selectedIntelligenceEnhancements, applyIntelligenceEnhancements]
    );

  const handleGenerateFinalDocs = () => {
    const reportsToGenerate = reports.filter(report => selectedFinalReports.includes(report.id));

    const newDocs = reportsToGenerate.map(report => ({
      id: report.id,
      title: report.reportName,
      desc: report.problemStatement || 'No description available',
      timestamp: new Date()
    }));

    setGeneratedDocs(prev => [...newDocs, ...prev]);

    setShowFinalizationModal(false);
    setIsDraftFinalized(false); // Reset the state
    setSelectedFinalReports([]);

    // In a real app, you would call a service for each report.
    // For now, we just show a confirmation.
    alert(`Generating ${selectedFinalReports.length} official documents.`);
  };

  const handleGenerateDocument = () => {
        if (completeness < 70) {
            alert('Please complete required inputs before generating. Readiness must be at least 70%.');
            return;
        }
    // In a real app, this would trigger a more complex generation service
    // For now, we'll just log it to show the config is captured
    console.log(`Generating document: ${activeModal}`, generationConfig);
    // alert(`Generating ${activeModal} with config: ${JSON.stringify(generationConfig)}`);
    onGenerate(); // Call the original onGenerate prop
    handleModalClose();
  };

  const calculateRoi = () => {
    const investment = parseFloat(roiInputs.investment);
    const revenue = parseFloat(roiInputs.revenue);
    const costs = parseFloat(roiInputs.costs);
    if (investment > 0 && (revenue - costs) > 0) {
      setRoiResult({ roi: ((revenue - costs - investment) / investment) * 100, irr: 22.5, payback: investment / (revenue - costs) });
    } else {
      setRoiResult(null);
    }
  };

  const handleModalClose = () => {
        if (activeModal && REQUIRED_FIELDS[activeModal]) {
      const errors: string[] = [];
            REQUIRED_FIELDS[activeModal].forEach(field => {
        const value = params[field as keyof ReportParameters];
        if (Array.isArray(value) && value.length === 0) {
          errors.push(field);
        } else if (!value) {
          errors.push(field);
        }
      });

      if (errors.length > 0) {
        // ✅ FIXED: Show validation errors but allow modal to close
        // This prevents the UI from becoming trapped/blocked
        console.warn(`Section '${activeModal}' has incomplete required fields:`, errors);
        // Don't return - allow closing so user isn't trapped
      }
    }
    
    // Set state
    setActiveModal(null);
    setModalView('main');
    setValidationErrors([]);
    
    // CRITICAL FIX: Force DOM cleanup to remove stuck modal overlays
    requestAnimationFrame(() => {
      // Remove any stuck modal overlays
      const overlays = document.querySelectorAll('.fixed.inset-0');
      overlays.forEach(overlay => {
        const classes = overlay.className;
        if (classes.includes('bg-black') || classes.includes('z-50')) {
          overlay.remove();
        }
      });
      
      // Re-enable body scroll and pointer events
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    });
  };

  const renderActiveModalContent = () => {
    // This function will return the form content based on the activeModal state.
    // We will define its content within the modal structure itself for better readability.
    // This is a placeholder for the concept.
    return null;
  }

  const renderInjectedComponent = (component: any, index: number) => {
    if (component.type === 'chart' && component.config.dataSource) {
      const COLORS = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'];
      let data: {name: string, value: number}[] = [];

      if (component.config.dataSource === 'industry' && params.industry.length > 0) {
        data = params.industry.map(ind => ({ name: ind, value: Math.floor(Math.random() * 100) + 10 }));
      } else if (component.config.dataSource === 'funding' && params.fundingSource) {
        data = [{name: params.fundingSource, value: 100}];
      } else if (component.config.dataSource === 'competitor') {
        data = [{name: 'Competitor A', value: 40}, {name: 'Competitor B', value: 25}, {name: 'You', value: 20}, {name: 'Other', value: 15}];
      }

      if (data.length === 0) return null;

      return (
        <div key={index} className="my-8 p-4 border border-stone-200 rounded-lg bg-stone-50">
          <h3 className="text-center font-bold text-sm mb-2">{component.config.title}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      );
    }
    return null;
  };

  const isFieldInvalid = (fieldName: string) => validationErrors.includes(fieldName);

    const getSignalBadgeClass = useCallback((type: string) => SIGNAL_BADGE_STYLES[type] || 'bg-slate-100 text-slate-700 border-slate-200', []);


  return (
    <div className="flex-1 w-full flex h-full bg-slate-50 font-sans text-gray-900 overflow-hidden">
        {/* --- LEFT PANEL: REPORT BUILDER --- */}
        <div className="w-[380px] shrink-0 flex flex-col bg-white border-r border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-blue-700 font-bold">Report Builder</div>
                        <div className="mt-2 text-sm font-semibold text-stone-900">
                            {params.organizationName?.trim() ? params.organizationName : 'New Report'}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-blue-700">{completeness}%</div>
                        <div className="mt-1 w-16 h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: `${completeness}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-5 space-y-4">
                    {/* COMPREHENSIVE SYSTEM INTAKE: 9 Sections */}
                    <div>
                        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">System Development</h3>
                        <p className="text-[11px] text-stone-600 mb-3">Complete comprehensive intake to build any system</p>
                        <div className="space-y-2">
                            {[
                                {id: 'identity', label: '1. Identity', description: "Organization, capacity, competition", icon: Building2},
                                {id: 'mandate', label: '2. Mandate', description: 'Vision, strategy, objectives', icon: Target},
                                {id: 'market', label: '3. Market', description: 'Geography, trends, dynamics', icon: Globe},
                                {id: 'partner-personas', label: '4. Partners', description: 'Stakeholders, alignment', icon: Users},
                                {id: 'financial', label: '5. Financial', description: 'Investment, revenue, returns', icon: DollarSign},
                                {id: 'risks', label: '6. Risks', description: 'Risk register, mitigation', icon: AlertCircle},
                                {id: 'capabilities', label: '7. Capabilities', description: 'Team, technology, gaps', icon: Cpu},
                                {id: 'execution', label: '8. Execution', description: 'Timeline, milestones, gates', icon: GitBranch},
                                {id: 'governance', label: '9. Governance', description: 'Structure, metrics, decisions', icon: Scale},
                            ].map((step, idx) => (
                                <button
                                    key={step.id}
                                    onClick={() => openModal(step.id)}
                                    className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                                        activeModal === step.id
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-white border-stone-200 hover:border-stone-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${activeModal === step.id ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                                            <step.icon size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-stone-900">{step.label}</span>
                                                {isStepComplete(step.id) && <Check size={14} className="text-emerald-600 shrink-0" />}
                                            </div>
                                            <div className="text-xs text-stone-500 truncate">{step.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-px bg-stone-200"></div>

                    {/* DOCUMENT UPLOAD - Prominent button */}
                    <div>
                        <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                            <div className="text-xs font-bold text-indigo-900 mb-1 flex items-center gap-2">
                                <FileText size={14} className="text-indigo-600" />
                                Supporting Documents
                            </div>
                            <p className="text-xs text-indigo-800 leading-relaxed">
                                Upload RFPs, mandates, briefing decks, or clearance letters. This is a second avenue to add more documents if required. The BW Consultant will analyze these documents to provide deeper, more contextual recommendations tailored to your specific situation.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDocumentUpload(true)}
                            className="w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                        >
                            <FileText size={16} />
                            Upload Documents
                        </button>
                        {(params.ingestedDocuments?.length || 0) > 0 && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                                <div className="font-semibold">{params.ingestedDocuments!.length} document{params.ingestedDocuments!.length > 1 ? 's' : ''} uploaded</div>
                            </div>
                        )}
                    </div>

                    <div className="w-full h-px bg-stone-200"></div>

                    {/* ACTION CENTER: Primary CTAs */}
                    <div>
                        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">Actions</h3>
                        <div className="space-y-2">
                            <button
                                onClick={onGenerate}
                                disabled={completeness < 50}
                                className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                    completeness >= 50
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-stone-100 text-stone-500 cursor-not-allowed'
                                }`}
                                title={completeness < 50 ? 'Complete intake steps first' : 'Generate draft report'}
                            >
                                <FileText size={14} />
                                Generate Draft
                            </button>
                            <button
                                onClick={() => setShowDocGenSuite(true)}
                                disabled={!canLaunchDocSuite}
                                className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                    canLaunchDocSuite
                                        ? 'border border-blue-300 text-blue-600 hover:bg-blue-50'
                                        : 'border border-stone-200 text-stone-400 cursor-not-allowed'
                                }`}
                                title={canLaunchDocSuite ? 'Generate official documents' : 'Set country, city, partner first'}
                            >
                                <Download size={14} />
                                Generate Docs
                            </button>
                        </div>
                        {!canLaunchDocSuite && (
                            <div className="mt-2 p-2 rounded-lg bg-indigo-50 border border-indigo-200">
                                <div className="text-xs text-indigo-800">
                                    <strong>To unlock docs:</strong> Set organization country, target city, and partner in Intake.
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full h-px bg-stone-200"></div>

                    <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Summary Blueprint</div>
                                <p className="text-xs text-stone-600 mt-1">Follow these checkpoints to reach a decision-ready report.</p>
                            </div>
                            <button
                                onClick={scrollAdvisorPanelIntoView}
                                className="text-[11px] font-semibold text-blue-700 hover:underline"
                            >
                                View Advisor
                            </button>
                        </div>
                        <div className="space-y-3">
                            {summaryBlueprint.map(step => {
                                const statusLabel = step.complete ? 'Ready' : step.id === 'draft' && !readinessForDraft ? 'Locked' : 'Next';
                                const statusClass = step.complete
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : statusLabel === 'Locked'
                                        ? 'bg-stone-100 text-stone-500 border-stone-200'
                                        : 'bg-blue-50 text-blue-700 border-blue-200';
                                return (
                                    <div key={step.id} className="p-3 border border-stone-200 rounded-lg bg-white/70">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-xs font-semibold text-stone-900">{step.label}</div>
                                                <p className="text-[11px] text-stone-600 mt-1 leading-snug">{step.description}</p>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border ${statusClass}`}>
                                                {statusLabel}
                                            </span>
                                        </div>
                                        <button
                                            onClick={step.onClick}
                                            disabled={Boolean((step as any).disabled)}
                                            className={`mt-2 w-full text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                                (step as any).disabled
                                                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {step.cta}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-[11px] text-stone-500 border border-dashed border-stone-200 rounded-lg p-3 bg-stone-50">
                            {params.ingestedDocuments?.length
                                ? `${params.ingestedDocuments.length} evidence file${params.ingestedDocuments.length > 1 ? 's' : ''} attached. The document intelligence pipeline will auto-reference them inside the draft.`
                                : 'Upload briefing packets so the advisor can quote real precedent-ready evidence inside the summary.'}
                        </div>
                    </div>

                    {isDraftFinalized && (
                        <>
                            <div className="w-full h-px bg-stone-200"></div>
                            {/* INTELLIGENCE ENHANCEMENTS - Only shown after draft generation */}
                            <details className="bg-white border border-stone-200 rounded-lg overflow-hidden" open>
                                <summary className="cursor-pointer select-none px-4 py-3 bg-stone-50 flex items-center justify-between hover:bg-stone-100">
                                    <div>
                                        <div className="text-sm font-semibold text-stone-900">Enhance Draft</div>
                                        <div className="text-xs text-stone-600">Add depth (optional)</div>
                                    </div>
                                    <span className="text-xs text-stone-500">{selectedIntelligenceEnhancements.length}/25</span>
                                </summary>
                                <div className="p-3 bg-white border-t border-stone-200 max-h-60 overflow-y-auto">
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'roi-diagnostic', label: 'ROI Diagnostic', icon: BarChart3 },
                                            { id: 'scenario-planning', label: 'Scenario Planning', icon: Network },
                                            { id: 'due-diligence', label: 'Due Diligence', icon: ShieldCheck },
                                            { id: 'partner-compatibility', label: 'Partner Fit', icon: Handshake },
                                            { id: 'diversification-analysis', label: 'Diversification', icon: PieChart },
                                            { id: 'ethical-compliance', label: 'ESG Compliance', icon: Shield },
                                            { id: 'historical-precedents', label: 'Precedents', icon: History },
                                            { id: 'growth-modeling', label: 'Growth Model', icon: TrendingUp },
                                            { id: 'stakeholder-analysis', label: 'Stakeholders', icon: Users },
                                            { id: 'geopolitical-risk', label: 'Geopolitical Risk', icon: Globe },
                                            { id: 'valuation-engine', label: 'Valuation', icon: Calculator },
                                            { id: 'performance-metrics', label: 'KPI Targets', icon: Activity },
                                            { id: 'supply-chain-analysis', label: 'Supply Chain', icon: GitBranch },
                                            { id: 'charts', label: 'Charts', icon: BarChart3 },
                                            { id: 'data', label: 'Data Tables', icon: Database },
                                            { id: 'ai-analysis', label: 'AI Insights', icon: Cpu },
                                            { id: 'content', label: 'Content Enhance', icon: FileText },
                                            { id: 'negotiation-advantage', label: 'Negotiation', icon: MessageCircle },
                                            { id: 'trade-disruption', label: 'Trade Analysis', icon: AlertCircle },
                                            { id: 'cultural-intelligence', label: 'Cultural Intel', icon: Globe },
                                            { id: 'deep-reasoning', label: 'Deep Reasoning', icon: Cpu },
                                            { id: 'temporal-analysis', label: 'Timeline Analysis', icon: Activity },
                                            { id: 'regulatory-landscape', label: 'Regulatory', icon: Scale },
                                            { id: 'market-disruption', label: 'Market Disruption', icon: Zap },
                                            { id: 'competitive-positioning', label: 'Competitive Pos', icon: Target },
                                        ].map(option => (
                                            <label key={option.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer text-xs transition-all ${selectedIntelligenceEnhancements.includes(option.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-stone-50'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIntelligenceEnhancements.includes(option.id)}
                                                    onChange={() => handleIntelligenceEnhancementToggle(option.id)}
                                                    className="h-3 w-3 text-blue-600"
                                                />
                                                <option.icon size={12} className="text-stone-600" />
                                                <span className="font-semibold text-stone-900">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        </>
                    )}

                    <div className="w-full h-px bg-stone-200"></div>

                    {/* CONSULTANT CHAT - For questions anytime */}
                    <div>
                        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">Ask a Question</h3>
                        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col h-48">
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar text-xs">
                                {chatMessages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
                                            msg.sender === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-stone-100 text-stone-900'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-stone-200 flex items-center gap-1 px-2 py-2 bg-white">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask..."
                                    className="flex-1 text-xs border border-stone-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-300 focus:border-transparent bg-white"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                                >
                                    <Send size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* AUTONOMOUS INSIGHTS - Only shown when autonomous mode is active */}
                    {autonomousMode && (
                        <>
                            <div className="w-full h-px bg-stone-200"></div>
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Autonomous Intelligence</h3>
                                    {isAutonomousThinking && (
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] text-blue-600 font-medium">Analyzing...</span>
                                        </div>
                                    )}
                                </div>

                                {/* Autonomous Suggestions */}
                                {autonomousSuggestions.length > 0 && (
                                    <div className="mb-3">
                                        <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide mb-2">AI Suggestions</div>
                                        <div className="space-y-1">
                                            {autonomousSuggestions.slice(0, 3).map((suggestion, index) => (
                                                <div key={index} className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                                                    {suggestion}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Autonomous Insights */}
                                {insights.filter(i => i.isAutonomous).length > 0 && (
                                    <div>
                                        <div className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wide mb-2">Autonomous Insights</div>
                                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                                            {insights.filter(i => i.isAutonomous).map((insight, index) => (
                                                <div key={index} className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                                                        <div>
                                                            <div className="text-[11px] font-semibold text-indigo-900">{insight.title}</div>
                                                            <div className="text-[10px] text-indigo-700 mt-1">{insight.description}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {insights.filter(i => i.isAutonomous).length === 0 && autonomousSuggestions.length === 0 && !isAutonomousThinking && (
                                    <div className="text-[11px] text-stone-500 italic">
                                        Autonomous analysis will appear here when you provide organization and market details.
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {generatedDocs.length > 0 && (
                        <>
                            <div className="w-full h-px bg-stone-200"></div>
                            <div>
                                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Generated Documents</h3>
                                <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                                    {generatedDocs.map(doc => (
                                        <div key={doc.id} className="p-2 bg-green-50 border border-green-200 rounded-lg group">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <FileText size={12} className="text-green-600 shrink-0" />
                                                    <span className="text-xs font-bold text-stone-800 truncate">{doc.title}</span>
                                                </div>
                                                <button className="px-2 py-0.5 text-[10px] font-bold bg-stone-200 text-stone-700 rounded hover:bg-stone-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">View</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
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
                            <h2 className="text-2xl font-serif font-bold text-indigo-800 capitalize">{modalView !== 'main' ? modalView.replace(/-/g, ' ') : activeModal?.replace(/-/g, ' ')} Configuration</h2>
                            <button onClick={handleModalClose} className="p-2 rounded-full hover:bg-stone-100">
                                <X size={20} className="text-stone-500" />
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            {/* Identity Section */}
                            {activeModal === 'identity' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="1.1 Entity Profile & Legal Structure"
                                        description="Define organization type, jurisdiction, and legal framework"
                                        isExpanded={!!expandedSubsections['identity-entity']}
                                        onToggle={() => toggleSubsection('identity-entity')}
                                        color="from-indigo-50 to-blue-100"
                                     >
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Organization Name <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={params.organizationName}
                                                        onChange={(e) => setParams({ ...params, organizationName: e.target.value })}
                                                        className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent ${isFieldInvalid('organizationName') ? 'border-red-500' : 'border-stone-200'}`}
                                                        placeholder="Enter organization name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Legal Entity Type <span className="text-red-500">*</span></label>
                                                    <select
                                                        value={params.organizationType}
                                                        onChange={(e) => setParams({ ...params, organizationType: e.target.value })}
                                                        className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent ${isFieldInvalid('organizationType') ? 'border-red-500' : 'border-stone-200'}`}
                                                    >
                                                        <option value="">Select type</option>
                                                        {Object.entries(ENTITY_TYPES.reduce((acc: any, item) => {
                                                            if (!acc[item.category]) acc[item.category] = [];
                                                            acc[item.category].push(item);
                                                            return acc;
                                                        }, {})).map(([category, items]: any) => (
                                                            <optgroup key={category} label={category}>
                                                                {items.map((item: any) => (
                                                                    <option key={item.value} value={item.value}>{item.label}</option>
                                                                ))}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Country of Incorporation <span className="text-red-500">*</span></label>
                                                    <select
                                                        value={params.country}
                                                        onChange={(e) => setParams({ ...params, country: e.target.value })}
                                                        className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent ${isFieldInvalid('country') ? 'border-red-500' : 'border-stone-200'}`}
                                                    >
                                                        <option value="">Select country</option>
                                                        {Object.entries(COUNTRIES.reduce((acc: any, item) => {
                                                            if (!acc[item.region]) acc[item.region] = [];
                                                            acc[item.region].push(item);
                                                            return acc;
                                                        }, {})).map(([region, items]: any) => (
                                                            <optgroup key={region} label={region}>
                                                                {items.map((item: any) => (
                                                                    <option key={item.value} value={item.value}>{item.label}</option>
                                                                ))}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Operating Regions</label>
                                                    <input
                                                        type="text"
                                                        value={params.region || ''}
                                                        onChange={(e) => setParams({ ...params, region: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                        placeholder="e.g., North America, Southeast Asia"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Entity Classification</label>
                                                <p className="text-[11px] text-stone-500 mb-2">Identify who owns this mandate so the advisor can pull the right precedents.</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    {ENTITY_CLASSIFICATIONS.map(option => {
                                                        const isActive = params.entityClassification === option.value;
                                                        return (
                                                            <button
                                                                key={option.value}
                                                                type="button"
                                                                onClick={() => setParams({ ...params, entityClassification: option.value })}
                                                                className={`w-full border rounded-lg px-3 py-2 text-left text-sm transition ${isActive ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm' : 'border-stone-200 hover:border-blue-200 hover:bg-stone-50'}`}
                                                            >
                                                                <div className="font-semibold">{option.label}</div>
                                                                <p className="text-[11px] text-stone-500 leading-snug">{option.description}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Parent Ministry / Holding Company</label>
                                                    <input
                                                        type="text"
                                                        value={params.parentAgency || ''}
                                                        onChange={(e) => setParams({ ...params, parentAgency: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                        placeholder="e.g., Ministry of Trade, Global HQ"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Operating Unit / Department</label>
                                                    <input
                                                        type="text"
                                                        value={params.operatingUnit || ''}
                                                        onChange={(e) => setParams({ ...params, operatingUnit: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                        placeholder="e.g., Infrastructure Delivery Office"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">What are you asking Nexus AI to clear or assist with?</label>
                                                <textarea
                                                    value={params.missionRequestSummary || ''}
                                                    onChange={(e) => setParams({ ...params, missionRequestSummary: e.target.value })}
                                                    className="w-full p-3 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-24"
                                                    placeholder="e.g., Need a rapid-read dossier to brief the cabinet on a tri-lateral port modernization JV."
                                                />
                                                <p className="text-[11px] text-stone-500 mt-1">Spell it out like you would brief a chief of staff—no jargon required.</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Where are you starting from?</label>
                                                <textarea
                                                    value={params.assistanceBackground || ''}
                                                    onChange={(e) => setParams({ ...params, assistanceBackground: e.target.value })}
                                                    className="w-full p-3 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-20"
                                                    placeholder="e.g., First time running a strategic partnership search / 30 years leading sovereign deals."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-2">How much guidance do you need?</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    {GUIDANCE_MODES.map(option => {
                                                        const isActive = (params.intakeGuidanceMode || 'collaborative') === option.value;
                                                        return (
                                                            <button
                                                                key={option.value}
                                                                type="button"
                                                                onClick={() => setParams({ ...params, intakeGuidanceMode: option.value as ReportParameters['intakeGuidanceMode'] })}
                                                                className={`w-full border rounded-lg px-3 py-2 text-left text-sm transition ${isActive ? 'border-blue-600 bg-blue-600/10 text-blue-900 shadow-sm' : 'border-stone-200 hover:border-blue-200 hover:bg-stone-50'}`}
                                                            >
                                                                <div className="font-semibold">{option.label}</div>
                                                                <p className="text-[11px] text-stone-500 leading-snug">{option.description}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <div className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded text-[11px] text-stone-600">
                                                    Whether this is your first time or your hundredth, the advisor adapts the questioning depth so you never feel stuck.
                                                </div>
                                            </div>
                                            <div className="border border-dashed border-blue-200 rounded-xl p-4 bg-blue-50/30">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div>
                                                        <div className="text-sm font-semibold text-stone-900">Attach briefing documents</div>
                                                        <p className="text-[11px] text-stone-600">Upload mandates, clearance letters, or context decks for richer analysis.</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowDocumentUpload(true)}
                                                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
                                                    >
                                                        Upload evidence
                                                    </button>
                                                </div>
                                                {(params.ingestedDocuments?.length || 0) === 0 ? (
                                                    <p className="text-[11px] text-stone-500 mt-3">No documents ingested yet. Drop RFPs, position papers, or diligence folders anytime.</p>
                                                ) : (
                                                    <div className="mt-3 space-y-2">
                                                        {params.ingestedDocuments!.map((doc, idx) => {
                                                            const detailBits: string[] = [];
                                                            if (doc.uploadedAt) {
                                                                detailBits.push(`Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}`);
                                                            }
                                                            if (doc.wordCount) {
                                                                detailBits.push(`${doc.wordCount.toLocaleString()} words`);
                                                            } else if (doc.fileSize) {
                                                                detailBits.push(`${(doc.fileSize / 1024).toFixed(1)} KB`);
                                                            }
                                                            return (
                                                                <div key={`${doc.filename}-${idx}`} className="flex items-center justify-between gap-3 p-2 bg-white border border-blue-100 rounded-lg">
                                                                    <div>
                                                                        <div className="text-xs font-semibold text-stone-900">{doc.filename}</div>
                                                                        <div className="text-[10px] text-stone-500">{detailBits.join(' · ') || 'Awaiting analysis metadata'}</div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDocumentRemoval(doc.filename)}
                                                                        className="text-[11px] font-semibold text-blue-700 hover:underline"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CollapsibleSection>


                                    <CollapsibleSection
                                        title="1.2 Capability Assessment"
                                        description="Evaluate organizational capabilities, resources, and competencies"
                                        isExpanded={!!expandedSubsections['identity-capability']}
                                        onToggle={() => toggleSubsection('identity-capability')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Revenue Band</label>
                                                    <select
                                                        value={params.revenueBand || ''}
                                                        onChange={(e) => setParams({ ...params, revenueBand: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
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
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
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
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
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
                                        color="from-indigo-50 to-blue-100"
                                     >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Industry <span className="text-red-500">*</span></label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-stone-200 rounded p-2">
                                                    {INDUSTRIES.map(ind => (
                                                        <label key={ind.value} className="flex items-center gap-2 p-1 hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={params.industry?.includes(ind.value)}
                                                                onChange={() => {
                                                                    const currentIndustries = params.industry || [];
                                                                    const newIndustries = currentIndustries.includes(ind.value)
                                                                        ? currentIndustries.filter(i => i !== ind.value)
                                                                        : [...currentIndustries, ind.value];
                                                                    setParams({ ...params, industry: newIndustries });
                                                                }}
                                                                className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                            /> 
                                                            <span className="text-sm">{ind.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Niche Areas or Specializations</label>
                                                <textarea value={params.nicheAreas?.join(', ') || ''} onChange={(e) => setParams({ ...params, nicheAreas: e.target.value.split(',').map(s => s.trim()) })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent" placeholder="e.g., AI in Drug Discovery, Fintech for SMEs"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                     <CollapsibleSection
                                        title="1.4 Strategic Intent & Vision"
                                        description="Articulate long-term vision, mission, and strategic objectives"
                                        isExpanded={!!expandedSubsections['identity-intent']}
                                        onToggle={() => toggleSubsection('identity-intent')}
                                        color="from-indigo-50 to-blue-100">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Strategic Intent <span className="text-red-500">*</span></label>
                                                <select value={params.strategicIntent[0] || ''} onChange={(e) => setParams({ ...params, strategicIntent: [e.target.value] })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent">
                                                    <option value="">Select primary goal...</option>
                                                    <option value="Market Expansion">Market Expansion</option>
                                                    <option value="Partnership Development">Partnership Development</option>
                                                    <option value="Technology Acquisition">Technology Acquisition</option>
                                                    <option value="Capital Investment">Capital Investment</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Problem Statement <span className="text-red-500">*</span></label>
                                                <textarea value={params.problemStatement} onChange={(e) => setParams({ ...params, problemStatement: e.target.value })} className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-24 ${isFieldInvalid('problemStatement') ? 'border-red-500' : 'border-stone-200'}`} placeholder="Describe the core problem this strategy aims to solve."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="1.5 Risk Appetite & Tolerance Framework"
                                        description="Define risk tolerance levels and governance framework"
                                        isExpanded={!!expandedSubsections['risk-appetite']}
                                        onToggle={() => toggleSubsection('risk-appetite')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Risk Tolerance <span className="text-red-500">*</span></label>
                                                <select value={params.riskTolerance} onChange={(e) => setParams({ ...params, riskTolerance: e.target.value })} className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent ${isFieldInvalid('riskTolerance') ? 'border-red-500' : 'border-stone-200'}`}>
                                                    <option value="">Select risk tolerance...</option>
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Funding Source</label>
                                                <select value={params.fundingSource} onChange={(e) => setParams({ ...params, fundingSource: e.target.value })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent">
                                                    <option value="">Select funding source...</option>
                                                    <optgroup label="Equity">
                                                        <option value="Bootstrapped">Bootstrapped</option>
                                                        <option value="Angel Investors">Angel Investors</option>
                                                        <option value="Venture Capital">Venture Capital</option>
                                                        <option value="Private Equity">Private Equity</option>
                                                    </optgroup>
                                                    <optgroup label="Debt & Other">
                                                        <option value="Debt Financing">Debt Financing</option>
                                                        <option value="Government Grants">Government Grants</option>
                                                        <option value="Internal Capital">Internal Capital</option>
                                                    </optgroup>
                                                </select>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    
                                    <CollapsibleSection
                                        title="1.6 Cultural Intelligence & Market Norms"
                                        description="Business customs, negotiation styles, and cultural considerations for target markets"
                                        isExpanded={!!expandedSubsections['identity-cultural']}
                                        onToggle={() => toggleSubsection('identity-cultural')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <Globe size={20} className="text-indigo-700 shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="text-sm font-bold text-indigo-900">Market-Specific Cultural Intelligence</h4>
                                                        <p className="text-xs text-indigo-800 mt-1">Understanding business norms, negotiation tactics, and cultural expectations for {params.country || 'your target market'}</p>
                                                    </div>
                                                </div>
                                                {params.country ? (
                                                    <div className="space-y-3 mt-4">
                                                        <div className="p-3 bg-white rounded border border-indigo-100">
                                                            <div className="text-xs font-semibold text-stone-700 mb-1">Business Etiquette for {params.country}</div>
                                                            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                                                                <li>Formal vs. informal communication styles</li>
                                                                <li>Meeting protocols and hierarchy</li>
                                                                <li>Gift-giving customs and business meals</li>
                                                                <li>Decision-making timelines and consensus building</li>
                                                            </ul>
                                                        </div>
                                                        <div className="p-3 bg-white rounded border border-indigo-100">
                                                            <div className="text-xs font-semibold text-stone-700 mb-1">Negotiation Dynamics</div>
                                                            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                                                                <li>Typical negotiation pace and style (relationship vs. transaction-focused)</li>
                                                                <li>Role of government and regulatory bodies in deals</li>
                                                                <li>Common deal structures and partnership models</li>
                                                                <li>Red lines and non-negotiable elements</li>
                                                            </ul>
                                                        </div>
                                                        <div className="p-3 bg-white rounded border border-indigo-100">
                                                            <div className="text-xs font-semibold text-stone-700 mb-1">Legal & Compliance Norms</div>
                                                            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                                                                <li>Foreign ownership restrictions and compliance requirements</li>
                                                                <li>Intellectual property protection standards</li>
                                                                <li>Labor laws and employment practices</li>
                                                                <li>Environmental and ESG reporting expectations</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-indigo-700 italic mt-2">Set your target country above to see cultural intelligence insights</p>
                                                )}
                                            </div>
                                        </div>
                                    </CollapsibleSection>

                                    <CollapsibleSection
                                        title="1.7 Competitive Landscape Analysis"
                                        description="Map competitors, identify white space, and assess market positioning"
                                        isExpanded={!!expandedSubsections['identity-competitive']}
                                        onToggle={() => toggleSubsection('identity-competitive')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <Target size={20} className="text-indigo-700 shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="text-sm font-bold text-indigo-900">Competitive Intelligence</h4>
                                                        <p className="text-xs text-indigo-800 mt-1">Visual landscape analysis for {params.organizationName || 'your organization'} in {params.industry?.[0] || 'your industry'}</p>
                                                    </div>
                                                </div>
                                                {params.organizationName && params.industry && params.industry.length > 0 ? (
                                                    <div className="space-y-3 mt-4">
                                                        <div className="p-3 bg-white rounded border border-indigo-100">
                                                            <div className="text-xs font-semibold text-stone-700 mb-2">Direct Competitors</div>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between text-xs p-2 bg-stone-50 rounded">
                                                                    <span className="font-medium">Competitor A</span>
                                                                    <span className="text-stone-500">Market share: 25%</span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-xs p-2 bg-stone-50 rounded">
                                                                    <span className="font-medium">Competitor B</span>
                                                                    <span className="text-stone-500">Market share: 18%</span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-xs p-2 bg-blue-50 rounded border border-blue-200">
                                                                    <span className="font-bold text-blue-900">{params.organizationName}</span>
                                                                    <span className="text-blue-700">Estimated share: 12%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-white rounded border border-indigo-100">
                                                            <div className="text-xs font-semibold text-stone-700 mb-2">White Space Opportunities</div>
                                                            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                                                                <li>Underserved customer segments (e.g., SMEs, rural markets)</li>
                                                                <li>Emerging technology gaps (AI integration, mobile-first)</li>
                                                                <li>Geographic expansion zones (secondary cities)</li>
                                                                <li>Partnership-driven differentiators</li>
                                                            </ul>
                                                        </div>
                                                        <div className="p-3 bg-white rounded border border-indigo-100">
                                                            <div className="text-xs font-semibold text-stone-700 mb-2">Strategic Positioning</div>
                                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                                <div className="p-2 bg-emerald-50 rounded">
                                                                    <div className="font-semibold text-emerald-900">Strengths</div>
                                                                    <div className="text-emerald-700 text-[11px] mt-1">Agility, Innovation</div>
                                                                </div>
                                                                <div className="p-2 bg-rose-50 rounded">
                                                                    <div className="font-semibold text-rose-900">Weaknesses</div>
                                                                    <div className="text-rose-700 text-[11px] mt-1">Scale, Distribution</div>
                                                                </div>
                                                                <div className="p-2 bg-blue-50 rounded">
                                                                    <div className="font-semibold text-blue-900">Opportunities</div>
                                                                    <div className="text-blue-700 text-[11px] mt-1">Partnerships, New Tech</div>
                                                                </div>
                                                                <div className="p-2 bg-amber-50 rounded">
                                                                    <div className="font-semibold text-indigo-900">Threats</div>
                                                                    <div className="text-indigo-700 text-[11px] mt-1">Incumbents, Regulation</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-indigo-700 italic mt-2">Complete organization name and industry above to see competitive analysis</p>
                                                )}
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
                                        color="from-indigo-50 to-blue-100"
                                     >
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Select Strategic Objectives <span className="text-red-500">*</span></label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {["Market Expansion", "Partnership Development", "Technology Acquisition", "Capital Investment", "Operational Excellence", "Innovation Leadership", "Supply Chain Optimization", "Talent Acquisition", "Brand Building"].map(intent => (
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
                                                            className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                        />
                                                        <span className="text-sm">{intent}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="mt-3">
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Problem Statement <span className="text-red-500">*</span></label>
                                                <textarea
                                                    value={params.problemStatement}
                                                    onChange={(e) => setParams({ ...params, problemStatement: e.target.value })}
                                                    className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-24 ${isFieldInvalid('problemStatement') ? 'border-red-500' : 'border-stone-200'}`}
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
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Ideal Partner Profile</label>
                                                <textarea
                                                    value={params.idealPartnerProfile}
                                                    onChange={(e) => setParams({ ...params, idealPartnerProfile: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-24"
                                                    placeholder="Describe the ideal partner (e.g., size, industry, capabilities, culture)."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Target Counterpart Type</label>
                                                <input
                                                    type="text"
                                                    value={params.targetCounterpartType?.join(', ') || ''}
                                                    onChange={(e) => setParams({ ...params, targetCounterpartType: e.target.value.split(',').map(s => s.trim()) })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
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
                                        color="from-indigo-50 to-blue-100"
                                     >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Success Metrics (comma-separated)</label>
                                                <textarea
                                                    value={params.successMetrics?.join(', ') || ''}
                                                    onChange={(e) => setParams({ ...params, successMetrics: e.target.value.split(',').map(s => s.trim()) })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-24"
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
                                        color="from-indigo-50 to-blue-100"
                                     >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Due Diligence Depth</label>
                                                <select value={params.dueDiligenceDepth} onChange={(e) => setParams({...params, dueDiligenceDepth: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent">
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
                                        color="from-indigo-50 to-blue-100"
                                     >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Governance Model</label>
                                                <select className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent">
                                                    <option value="">Select model...</option> 
                                                    <option value="Joint Venture (JV)">Joint Venture (JV)</option>
                                                    <option value="Strategic Alliance">Strategic Alliance</option>
                                                    <option value="Licensing Agreement">Licensing Agreement</option>
                                                    <option value="Distribution Partnership">Distribution Partnership</option>
                                                    <option value="Equity Investment">Equity Investment</option>
                                                    <option value="Consortium">Consortium</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="2.6 Execution & Operations"
                                        description="Define operational priorities and timelines"
                                        isExpanded={!!expandedSubsections['mandate-execution']}
                                        onToggle={() => toggleSubsection('mandate-execution')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Operational Priority</label>
                                                <input type="text" value={params.operationalPriority} onChange={(e) => setParams({...params, operationalPriority: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., Speed to market, Cost efficiency"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Expansion Timeline</label>
                                                <select value={params.expansionTimeline} onChange={(e) => setParams({...params, expansionTimeline: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent">
                                                    <option value="">Select timeline...</option>
                                                    <optgroup label="Short-Term">
                                                        <option value="0-6 Months">0-6 Months</option>
                                                        <option value="6-12 Months">6-12 Months</option>
                                                    </optgroup>
                                                    <optgroup label="Long-Term">
                                                        <option value="1-2 Years">1-2 Years</option>
                                                        <option value="2+ Years">2+ Years</option>
                                                    </optgroup>
                                                </select>
                                            </div>
                                        </div>
                                    </CollapsibleSection>

                                    <CollapsibleSection
                                        title="2.7 Partnership Intelligence Library"
                                        description="Reference deals, proven patterns, and historical insights (5+ years of data)"
                                        isExpanded={!!expandedSubsections['mandate-intelligence']}
                                        onToggle={() => toggleSubsection('mandate-intelligence')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <Database size={20} className="text-indigo-700 shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="text-sm font-bold text-indigo-900">Intelligence Library</h4>
                                                        <p className="text-xs text-indigo-800 mt-1">100+ reference deals and patterns similar to your strategy</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mt-3">
                                                    <div className="text-xs p-2 bg-white rounded border border-indigo-100">
                                                        <div className="font-medium text-stone-900">Tech Corp + Local Distributor (2023)</div>
                                                        <div className="text-stone-600 text-[11px] mt-1">$15M JV, 18-month activation, 35% IRR</div>
                                                    </div>
                                                    <div className="text-xs p-2 bg-white rounded border border-indigo-100">
                                                        <div className="font-medium text-stone-900">Pharma + Research Lab (2022)</div>
                                                        <div className="text-stone-600 text-[11px] mt-1">$8M licensing, 24-month validation</div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded border border-indigo-100 mt-3">
                                                        <div className="text-xs font-semibold text-stone-700 mb-1">Key Learnings</div>
                                                        <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside text-[11px]">
                                                            <li>Average activation: 14-18 months</li>
                                                            <li>Align governance early (JV structure)</li>
                                                            <li>Compliance costs: +15-25% of budget</li>
                                                            <li>Pilot before full commitment (6mo trial)</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                            {activeModal === 'partner-personas' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="4.1 Persona Definition"
                                        description="Define the key characteristics of your ideal partner personas."
                                        isExpanded={!!expandedSubsections['partner-personas-definition']}
                                        onToggle={() => toggleSubsection('partner-personas-definition')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Partner Personas <span className="text-red-500">*</span></label>
                                                <div className="space-y-2">
                                                    {params.partnerPersonas?.map((persona, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={persona}
                                                                onChange={(e) => {
                                                                    const newPersonas = [...(params.partnerPersonas || [])];
                                                                    newPersonas[index] = e.target.value;
                                                                    setParams({ ...params, partnerPersonas: newPersonas });
                                                                }}
                                                                className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                                placeholder={`Persona ${index + 1}`}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const newPersonas = [...(params.partnerPersonas || [])];
                                                                    newPersonas.splice(index, 1);
                                                                    setParams({ ...params, partnerPersonas: newPersonas });
                                                                }}
                                                                className="p-2 rounded-full hover:bg-stone-100"
                                                            >
                                                                <X size={16} className="text-stone-500" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const newPersonas = [...(params.partnerPersonas || []), ''];
                                                        setParams({ ...params, partnerPersonas: newPersonas });
                                                    }}
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                                                >
                                                    <Plus size={14} />
                                                    Add Persona
                                                </button>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="4.2 Stakeholder Alignment & Readiness"
                                        description="Identify the stakeholders who must sponsor, approve, or be informed of each partnership path."
                                        isExpanded={!!expandedSubsections['partner-personas-alignment']}
                                        onToggle={() => toggleSubsection('partner-personas-alignment')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-2">Stakeholder Groups To Align</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {STAKEHOLDER_ALIGNMENT_GROUPS.map(group => {
                                                        const isSelected = (params.stakeholderAlignment || []).includes(group);
                                                        return (
                                                            <button
                                                                key={group}
                                                                type="button"
                                                                onClick={() => toggleArrayValue('stakeholderAlignment', group)}
                                                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-stone-600 border-stone-200 hover:border-blue-300'}`}
                                                            >
                                                                {group}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Executive Sponsor / Champion</label>
                                                    <input
                                                        type="text"
                                                        value={params.executiveSponsor || ''}
                                                        onChange={(e) => setParams({ ...params, executiveSponsor: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="e.g., Chief Strategy Officer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Partner Readiness Level</label>
                                                    <select
                                                        value={params.partnerReadinessLevel || ''}
                                                        onChange={(e) => setParams({ ...params, partnerReadinessLevel: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">Select readiness...</option>
                                                        {PARTNER_READINESS_LEVELS.map(level => (
                                                            <option key={level} value={level}>{level}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Stakeholder Priorities & Concerns</label>
                                                <textarea
                                                    value={params.stakeholderConcerns || ''}
                                                    onChange={(e) => setParams({ ...params, stakeholderConcerns: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-24 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Document perceived incentives, blockers, and what each group needs to stay aligned."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Alignment Workstreams & Commitments</label>
                                                <textarea
                                                    value={params.alignmentPlan || ''}
                                                    onChange={(e) => setParams({ ...params, alignmentPlan: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-24 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Capture standing meetings, executive reviews, or approvals required before launch."
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="4.3 Partner Fit & Relationship Goals"
                                        description="Clarify what makes a partner viable and the outcomes you expect to co-create."
                                        isExpanded={!!expandedSubsections['partner-personas-fit']}
                                        onToggle={() => toggleSubsection('partner-personas-fit')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-2">Partner Fit Criteria</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {PARTNER_FIT_CRITERIA.map(criterion => {
                                                        const isSelected = (params.partnerFitCriteria || []).includes(criterion);
                                                        return (
                                                            <button
                                                                key={criterion}
                                                                type="button"
                                                                onClick={() => toggleArrayValue('partnerFitCriteria', criterion)}
                                                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${isSelected ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'}`}
                                                            >
                                                                {criterion}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-2">Relationship Goals</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {RELATIONSHIP_GOALS.map(goal => {
                                                        const isSelected = (params.relationshipGoals || []).includes(goal);
                                                        return (
                                                            <button
                                                                key={goal}
                                                                type="button"
                                                                onClick={() => toggleArrayValue('relationshipGoals', goal)}
                                                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${isSelected ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'}`}
                                                            >
                                                                {goal}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Partner Engagement Notes</label>
                                                <textarea
                                                    value={params.partnerEngagementNotes || ''}
                                                    onChange={(e) => setParams({ ...params, partnerEngagementNotes: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-24 focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                                                    placeholder="Capture fit observations, gating risks, red lines, or negotiation posture."
                                                />
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
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Target City / Region <span className="text-red-500">*</span></label>
                                                <input type="text" value={params.userCity || ''} onChange={(e) => setParams({ ...params, userCity: e.target.value })} className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent ${isFieldInvalid('userCity') ? 'border-red-500' : 'border-stone-200'}`} placeholder="e.g., Silicon Valley, Singapore"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Target Market Size (TAM)</label>
                                                <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., $5B"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Market Growth Rate (CAGR)</label>
                                                <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 12%"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Analysis Timeframe</label>
                                                <select value={params.analysisTimeframe} onChange={(e) => setParams({...params, analysisTimeframe: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent">
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
                                        color="from-indigo-50 to-blue-100"
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
                                        color="from-indigo-50 to-blue-100"
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
                                        color="from-indigo-50 to-blue-100"
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
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Risk Concerns <span className="text-red-500">*</span></label>
                                                <textarea className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-24 ${isFieldInvalid('riskTolerance') ? 'border-red-500' : 'border-stone-200'}`} placeholder="List main risks: financial, operational, reputational, geopolitical, etc."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="4.2 Mitigation & Contingency"
                                        description="Develop strategies to minimize risks and plan for failure"
                                        isExpanded={!!expandedSubsections['risk-mitigation']}
                                        onToggle={() => toggleSubsection('risk-mitigation')}
                                        color="from-indigo-50 to-blue-100"
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
                                        color="from-indigo-50 to-blue-100"
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
                            {activeModal === 'financial' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="5.1 Investment & Funding Requirements"
                                        description="Define capital requirements, sources, and usage"
                                        isExpanded={!!expandedSubsections['financial-investment']}
                                        onToggle={() => toggleSubsection('financial-investment')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Total Investment Required ($)</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 5000000"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Funding Source</label>
                                                    <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                        <option>Own Capital</option>
                                                        <option>Partner Capital</option>
                                                        <option>External Debt</option>
                                                        <option>Equity Investment</option>
                                                        <option>Mixed Sources</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Capital Allocation Breakdown</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Technology: 40%, Operations: 35%, Marketing: 15%, Contingency: 10%"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Cash Flow Timing (Monthly/Quarterly)</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="When will capital be deployed? e.g., Month 1-3: $1M setup, Month 4-12: $2M operations"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="5.2 Revenue Model & Streams"
                                        description="Define how revenue will be generated and structured"
                                        isExpanded={!!expandedSubsections['financial-revenue']}
                                        onToggle={() => toggleSubsection('financial-revenue')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Revenue Streams</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Licensing fees, Transaction commissions, Subscription model, Equity upside"/>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 1 Revenue ($)</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 1000000"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 3 Revenue ($)</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 3500000"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 5 Revenue ($)</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 7000000"/>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Unit Economics (if applicable)</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Average transaction value: $50k, Commission rate: 3%, Expected volume: 500 transactions/year"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="5.3 Cost Structure & OpEx"
                                        description="Detail operational costs and cost drivers"
                                        isExpanded={!!expandedSubsections['financial-costs']}
                                        onToggle={() => toggleSubsection('financial-costs')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 1 COGS ($)</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 400000"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 1 OpEx ($)</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 300000"/>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Cost Breakdown</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Salaries: 40%, Tech/Infrastructure: 25%, Marketing: 20%, G&A: 15%"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Headcount Plan</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Year 1: 10 staff ($300k), Year 2: 15 staff ($450k), Year 3: 20 staff ($650k)"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="5.4 Returns & Profitability Analysis"
                                        description="Model profit margins, returns, and key financial metrics"
                                        isExpanded={!!expandedSubsections['financial-returns']}
                                        onToggle={() => toggleSubsection('financial-returns')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 1 EBITDA Margin (%)</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., -30%"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Break-Even Year</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., Year 2"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Target Exit Multiple</label>
                                                    <input type="number" step="0.1" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 4.5x EBITDA"/>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Expected IRR (%)</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 35%"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Payback Period (Years)</label>
                                                    <input type="number" step="0.5" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 3.5"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">NPV @ 12% Discount (5yr)</label>
                                                    <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 2500000"/>
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="5.5 Scenario Analysis & Sensitivity"
                                        description="Model downside and upside scenarios with key sensitivities"
                                        isExpanded={!!expandedSubsections['financial-scenarios']}
                                        onToggle={() => toggleSubsection('financial-scenarios')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Downside Case (-25% revenue)</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="Year 3 Revenue: $2.6M, Break-even: Year 3, IRR: 18%"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Base Case</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="Year 3 Revenue: $3.5M, Break-even: Year 2, IRR: 35%"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Upside Case (+25% revenue)</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="Year 3 Revenue: $4.4M, Break-even: Year 1.5, IRR: 52%"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Key Sensitivity Drivers</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="Critical assumptions: Achieve 50% market share targets by Year 2 (sensitivity: ±10% swings IRR 15pp), Partner investment timing (sensitivity: delays increase cost 8-12%), Currency fluctuations (10% swing = $200k impact)"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                            {activeModal === 'risks' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="6.1 Risk Register & Quantification"
                                        description="Establish risk register with probability and impact scoring"
                                        isExpanded={!!expandedSubsections['risks-register']}
                                        onToggle={() => toggleSubsection('risks-register')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs border-collapse">
                                                    <thead>
                                                        <tr className="bg-stone-100">
                                                            <th className="border border-stone-200 p-2 text-left">Risk Category</th>
                                                            <th className="border border-stone-200 p-2 text-left">Description</th>
                                                            <th className="border border-stone-200 p-2">Probability</th>
                                                            <th className="border border-stone-200 p-2">Impact ($)</th>
                                                            <th className="border border-stone-200 p-2">Expected Loss</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {['Market Risk', 'Operational Risk', 'Financial Risk', 'Legal Risk', 'Relationship Risk'].map(cat => (
                                                            <tr key={cat} className="border-t border-stone-200">
                                                                <td className="border border-stone-200 p-2 font-bold">{cat}</td>
                                                                <td className="border border-stone-200 p-2"><input type="text" className="w-full p-1 border rounded text-xs" placeholder="Describe risk..."/></td>
                                                                <td className="border border-stone-200 p-2"><input type="number" max="100" className="w-full p-1 border rounded text-xs" placeholder="e.g., 30%"/></td>
                                                                <td className="border border-stone-200 p-2"><input type="number" className="w-full p-1 border rounded text-xs" placeholder="e.g., 500000"/></td>
                                                                <td className="border border-stone-200 p-2 text-center text-stone-500">Auto-calculated</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="6.2 Risk Mitigation Strategies"
                                        description="Develop specific mitigation plans for each identified risk"
                                        isExpanded={!!expandedSubsections['risks-mitigation']}
                                        onToggle={() => toggleSubsection('risks-mitigation')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Market Risk Mitigation</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Diversify partner base, build long-term contracts with minimum volume commitments"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Operational Risk Mitigation</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Build redundancy in supply chain, establish clear escalation procedures"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Financial Risk Mitigation</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Maintain 6-month cash reserve, establish credit facilities before launch"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="6.3 Contingency Planning & Exit Triggers"
                                        description="Define specific triggers and contingency plans"
                                        isExpanded={!!expandedSubsections['risks-contingency']}
                                        onToggle={() => toggleSubsection('risks-contingency')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Contingency Budget Reserve</label>
                                                <input type="number" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 500000 (10% of investment)"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Exit Triggers & Conditions</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., If revenue falls >40% below projection for 2 consecutive quarters, trigger exit review; If key partner exits, 30-day contingency evaluation"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                            {activeModal === 'capabilities' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="7.1 Executive Team & Leadership"
                                        description="Assess leadership team strength and any gaps"
                                        isExpanded={!!expandedSubsections['capabilities-team']}
                                        onToggle={() => toggleSubsection('capabilities-team')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Executive Sponsor / Leader</label>
                                                <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., John Smith, VP Strategy"/>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">CFO / Financial Lead</label>
                                                    <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="Name and background"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Operations / Delivery Lead</label>
                                                    <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="Name and background"/>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Team Bench Strength Assessment</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Sponsor: 20 years M&A, strong board credibility, Limited ops experience. CFO: Big 4 background, strong financial modeling. Bench: Only 2 backups for critical roles."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="7.2 Organizational Capabilities"
                                        description="Rate organizational capability in key competency areas (1-5 scale)"
                                        isExpanded={!!expandedSubsections['capabilities-org']}
                                        onToggle={() => toggleSubsection('capabilities-org')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-3">
                                            {[
                                                { name: 'Sales & Business Development', key: 'sales' },
                                                { name: 'Operations & Delivery', key: 'ops' },
                                                { name: 'Product Development', key: 'product' },
                                                { name: 'Finance & Control', key: 'finance' },
                                                { name: 'Risk Management', key: 'risk' }
                                            ].map(cap => (
                                                <div key={cap.key} className="flex items-center justify-between p-3 border border-stone-200 rounded bg-stone-50">
                                                    <span className="text-sm font-bold text-stone-700">{cap.name}</span>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map(rating => (
                                                            <button key={rating} className="px-3 py-1 border rounded text-xs hover:bg-purple-100 hover:border-purple-500">
                                                                {rating}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="7.3 Technology & Systems"
                                        description="Assess technology capabilities and infrastructure"
                                        isExpanded={!!expandedSubsections['capabilities-tech']}
                                        onToggle={() => toggleSubsection('capabilities-tech')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Core Technology Stack</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Cloud (AWS), APIs for integrations, Data warehouse (Snowflake), BI (Tableau)"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Key Systems & Integrations</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., ERP (SAP), CRM (Salesforce), Financial systems (NetSuite)"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Technology Gaps & Risks</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Limited API capabilities, legacy system integrations, data governance challenges"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="7.4 Capability Gaps & Development Plan"
                                        description="Identify critical gaps and how they'll be addressed"
                                        isExpanded={!!expandedSubsections['capabilities-gaps']}
                                        onToggle={() => toggleSubsection('capabilities-gaps')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Critical Capability Gaps</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., 1. International tax expertise (hire Big 4 advisor), 2. Supply chain ops (partner with 3PL), 3. Market entry skills (hire regional GM)"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Build vs. Buy vs. Partner Decisions</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Build: Internal analytics capability (12-month timeline). Buy: MarTech tools ($200k/year). Partner: Go-to-market with regional distributor."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                            {activeModal === 'execution' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="8.1 Execution Roadmap & Phases"
                                        description="Define project phases with key milestones and timelines"
                                        isExpanded={!!expandedSubsections['execution-roadmap']}
                                        onToggle={() => toggleSubsection('execution-roadmap')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-2 font-bold">Phase 1: Foundation (Months 1-3)</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Legal structure finalized, governance established, initial funding secured, team onboarded, stakeholder alignment"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-2 font-bold">Phase 2: Ramp (Months 4-9)</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Operations launched, first revenue generation, team scaling, process maturation"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-2 font-bold">Phase 3: Scale (Months 10-18+)</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Market expansion, full-scale operations, efficiency optimization, scale-out decisions"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="8.2 Critical Path & Dependencies"
                                        description="Identify critical items that cannot slip"
                                        isExpanded={!!expandedSubsections['execution-critical']}
                                        onToggle={() => toggleSubsection('execution-critical')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Critical Path Items</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., 1. Regulatory approval (90 days, blocks operations), 2. Partner integration (60 days, blocks revenue), 3. Go-live readiness (14 days before launch)"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Dependencies & Blockers</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Phase 2 depends on Phase 1 completion. Revenue depends on partner's system readiness. Scaling blocked by headcount availability."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="8.3 Go/No-Go Decision Criteria"
                                        description="Define gate criteria before advancing to next phase"
                                        isExpanded={!!expandedSubsections['execution-gates']}
                                        onToggle={() => toggleSubsection('execution-gates')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Phase 1 → 2 Gate Criteria</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., ☐ All contracts signed, ☐ Governance operational, ☐ Team hired, ☐ Systems operational, ☐ Budget available"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Phase 2 → 3 Gate Criteria</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., ☐ $500k revenue achieved, ☐ Operations at 90% efficiency, ☐ First customer references, ☐ Profitability path clear"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="8.4 Resource Plan & Contingencies"
                                        description="Allocate resources and identify buffers"
                                        isExpanded={!!expandedSubsections['execution-resources']}
                                        onToggle={() => toggleSubsection('execution-resources')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Resource Allocation by Phase</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Phase 1: 5 FTE + $500k budget. Phase 2: 12 FTE + $1.5M budget. Phase 3: 20 FTE + $3M budget."/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Schedule Buffers & Risk Buffers</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Schedule buffer: 20% (3 weeks in 15-week phase). Financial buffer: 15% contingency. Key person backup: Identified for all critical roles."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                            {activeModal === 'governance' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="9.1 Governance Structure & Decision Authority"
                                        description="Define decision-making bodies and authority matrix"
                                        isExpanded={!!expandedSubsections['governance-structure']}
                                        onToggle={() => toggleSubsection('governance-structure')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Steering Committee Members</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., CEO, Partner CEO, CFO, Chief Strategy Officer. Meet monthly. Authority: Strategy, major investments >$100k, risk approval, escalations."/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Operations Committee Members</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Operations Lead, Finance Lead, Technical Lead. Meet bi-weekly. Authority: Operational decisions, budget tracking, issue escalation."/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Decision Authority Matrix</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="Strategy decisions: Steering. OpEx <$50k: Operations. >$50k: Steering. Personnel: Sponsor approval. Risk escalation: Steering approval."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="9.2 Key Metrics & Health Scorecard"
                                        description="Define KPIs and ongoing health monitoring"
                                        isExpanded={!!expandedSubsections['governance-metrics']}
                                        onToggle={() => toggleSubsection('governance-metrics')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Financial KPIs</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Revenue ($), EBITDA margin (%), Cash burn rate (monthly), ROI trajectory (%)"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Operational KPIs</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Customer acquisition (count), Delivery efficiency (%), Team retention (%), Time-to-market (days)"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Strategic KPIs</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Market share (%), Competitive position (qualitative), Partnership strength (score), Innovation velocity (features/quarter)"/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="9.3 Escalation & Issue Management"
                                        description="Establish escalation procedures and issue resolution"
                                        isExpanded={!!expandedSubsections['governance-escalation']}
                                        onToggle={() => toggleSubsection('governance-escalation')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Escalation Triggers</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Revenue miss >20%, Budget overrun >$50k, Key person departure, Partner breach, Regulatory action"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Escalation Path</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., Day 1: Operations team identifies issue. Day 1-2: Team attempts resolution. Day 2: Escalate to Ops Committee. Day 3+: Escalate to Steering if unresolved."/>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="9.4 Contingency & Adaptation Framework"
                                        description="Plan for changes and contingencies"
                                        isExpanded={!!expandedSubsections['governance-contingency']}
                                        onToggle={() => toggleSubsection('governance-contingency')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Contingency Triggers & Plans</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., If market shrinks >15%: Reduce scope by 20%, focus on core. If partner exits: Activate backup partner list, consider acquisition. If funding unavailable: Reduce phase 2 from $2M to $1.5M."/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Change Management Process</label>
                                                <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-16" placeholder="e.g., All changes >5% budget impact require Steering approval. All timeline changes require Operations notification. All strategic pivots require full reassessment."/>
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
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Estimated Initial Investment ($)</label>
                                                <input type="number" value={roiInputs.investment} onChange={e => setRoiInputs(p => ({...p, investment: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 500000"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Projected Annual Revenue ($)</label>
                                                <input type="number" value={roiInputs.revenue} onChange={e => setRoiInputs(p => ({...p, revenue: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 200000"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Operational Costs ($/year)</label>
                                                <input type="number" value={roiInputs.costs} onChange={e => {
                                                    setRoiInputs(p => ({...p, costs: e.target.value}));
                                                    setRoiResult(null);
                                                }} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 75000"/>
                                            </div>
                                            <button onClick={calculateRoi} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Analyze ROI</button>
                                        </div>
                                        <div>
                                            {roiResult && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 h-full">
                                                    <h4 className="font-bold text-blue-900">Analysis Result</h4>
                                                    <p className="text-sm"><strong>Return on Investment (ROI):</strong> <span className={`font-bold text-lg ${roiResult.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>{roiResult.roi.toFixed(1)}%</span></p>
                                                    <p className="text-sm"><strong>Internal Rate of Return (IRR):</strong> <span className="font-bold text-lg">{roiResult.irr.toFixed(1)}%</span></p>
                                                    <p className="text-sm"><strong>Payback Period:</strong> <span className="font-bold text-lg">{roiResult.payback.toFixed(2)} years</span></p>
                                                </div>
                                            )}
                                            {!roiResult && (
                                                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 h-full flex items-center justify-center">
                                                    <p className="text-sm text-stone-500">Results will be displayed here.</p>
                                                </div>
                                            )}
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
                            {activeModal === 'analysis' && modalView === 'scenario-planning' && (
                                <div>
                                    <button onClick={() => setModalView('main')} className="text-sm text-blue-600 mb-4">&larr; Back to Analysis Tools</button>
                                    <h3 className="text-lg font-bold mb-4">Scenario Planning</h3>
                                    <p className="text-sm text-stone-600 mb-4">Define multiple scenarios to model potential outcomes for your strategy.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Scenario 1: Best Case</label>
                                            <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Rapid market adoption, 50% YoY growth."/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Scenario 2: Base Case</label>
                                            <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Steady growth, 20% YoY, moderate competition."/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Scenario 3: Worst Case</label>
                                            <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="e.g., Economic downturn, new major competitor enters."/>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'analysis' && modalView === 'financial-modeling' && (
                                <p>Financial Modeling interactive tool would be here.</p>
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
                            {activeModal === 'marketplace' && modalView === 'compatibility-engine' && (
                                <div>
                                    <button onClick={() => setModalView('main')} className="text-sm text-blue-600 mb-4">&larr; Back to Marketplace Tools</button>
                                    <h3 className="text-lg font-bold mb-4">Partner Compatibility Engine</h3>
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Potential Partner Name</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="Enter a company name to analyze synergy"/>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'generation' && (
                                <p>This modal is now deprecated in favor of the new finalization workflow.</p>
                            )}
                            {/* --- DOCUMENT GENERATION SUITE MODALS --- */}
                            {activeModal === 'doc-summary' && ( // Executive Summary
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Generates a high-level summary of the entire strategic roadmap. Ideal for circulating to stakeholders who need a quick overview of the key findings and recommendations.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Report Length</label>
                                        <select onChange={e => setGenerationConfig(p => ({...p, length: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm"><option>1-Page Brief</option><option>3-Page Standard</option><option>5-Page Detailed</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Target Audience</label>
                                        <select onChange={e => setGenerationConfig(p => ({...p, audience: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm"><option>Investor</option><option>Executive Board</option><option>Legal Team</option><option>Technical Team</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Key Sections to Emphasize</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Market Opportunity", "Financial Projections", "Risk Mitigation", "Team Strength"].map(sec => (
                                                <label key={sec} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                    <input type="checkbox" onChange={e => setGenerationConfig(p => ({...p, emphasized: {...p.emphasized, [sec]: e.target.checked}}))} className="h-4 w-4 text-indigo-800 focus:ring-amber-600"/>
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
                                                    <input type="checkbox" className="h-4 w-4 text-indigo-800 focus:ring-amber-600"/>
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
                                                    <input type="checkbox" className="h-4 w-4 text-indigo-800 focus:ring-amber-600"/>
                                                    <span className="text-sm">{clause} Clause</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Exclusivity Period (days)</label>
                                        <input type="number" onChange={e => setGenerationConfig(p => ({...p, exclusivity: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 90"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Governing Law (Jurisdiction)</label>
                                        <input type="text" onChange={e => setGenerationConfig(p => ({...p, jurisdiction: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., State of Delaware, USA"/>
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
                                        <input type="number" onChange={e => setGenerationConfig(p => ({...p, valuation: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 10000000"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Investment Amount ($)</label>
                                        <input type="number" onChange={e => setGenerationConfig(p => ({...p, investment: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 2000000"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Liquidation Preference</label>
                                        <input type="text" onChange={e => setGenerationConfig(p => ({...p, preference: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 1x, Non-participating"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Board Seats</label>
                                        <input type="text" onChange={e => setGenerationConfig(p => ({...p, boardSeats: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., 'One seat on the Board of Directors'"/>
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
                                                <label key={scope} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer"><input type="checkbox" className="h-4 w-4 text-indigo-800 focus:ring-amber-600"/> <span className="text-sm">{scope}</span></label>
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
                                        <div >
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Chart Title</label>
                                            <input type="text" value={chartConfig.title} onChange={(e) => setChartConfig(prev => ({...prev, title: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., Market Share Distribution"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Data Source</label>
                                            <select value={chartConfig.dataSource} onChange={(e) => setChartConfig(prev => ({...prev, dataSource: e.target.value}))} className="w-full p-2 border border-stone-200 rounded text-sm" disabled={!params.industry.length && !params.fundingSource}>
                                                <option value="">Select data to visualize...</option>
                                                {params.industry.length > 0 && <option value="industry">Industry Breakdown</option>}
                                                {/* Add a placeholder for competitor data */}
                                                <option value="competitor">Competitor Market Share</option>
                                                {params.fundingSource && <option value="funding">Funding Source Mix</option>}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Enhanced Modal Implementations for Full Feature Capacity */}

                            {/* Additional Document Generation Modals */}
                            {activeModal === 'doc-suite' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Generate comprehensive business documents including Letters of Intent, Memorandums of Understanding, partnership proposals, and formal business agreements.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Document Type</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Letter of Intent</option><option>Memorandum of Understanding</option><option>Partnership Proposal</option><option>Joint Venture Agreement</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Document Length</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Brief (1-2 pages)</option><option>Standard (3-5 pages)</option><option>Detailed (5+ pages)</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Include Sections</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Executive Summary", "Terms & Conditions", "Financial Projections", "Risk Assessment", "Governance Structure", "Exit Strategy"].map(sec => (
                                                <label key={sec} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                    <input type="checkbox" className="h-4 w-4 text-indigo-800 focus:ring-amber-600"/>
                                                    <span className="text-sm">{sec}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'doc-financial-model' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Generate detailed financial models and projections for your partnership opportunity.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Model Type</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Revenue Projection Model</option><option>Cost-Benefit Analysis</option><option>Cash Flow Model</option><option>ROI Calculator</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Time Horizon</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>1 Year</option><option>3 Years</option><option>5 Years</option><option>10 Years</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Key Assumptions</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Enter key financial assumptions..."/>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'doc-risk-assessment' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Comprehensive risk assessment report identifying, analyzing, and providing mitigation strategies for partnership risks.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Risk Categories to Include</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Financial Risk", "Operational Risk", "Legal Risk", "Market Risk", "Reputational Risk", "Geopolitical Risk"].map(risk => (
                                                <label key={risk} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-800 focus:ring-amber-600"/>
                                                    <span className="text-sm">{risk}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Risk Assessment Depth</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>High Level Overview</option><option>Detailed Analysis</option><option>Comprehensive Assessment</option></select>
                                    </div>
                                </div>
                            )}

                            {/* Additional Letter Generation Modals */}
                            {activeModal === 'letter-jv' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Generate a comprehensive Joint Venture Agreement outlining the terms, structure, and governance of the partnership.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">JV Structure</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>50/50 Partnership</option><option>Majority/Minority</option><option>Limited Partnership</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Governance Model</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Joint Board</option><option>Lead Partner Control</option><option>Independent Chairman</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Key Terms</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Specify key JV terms..."/>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'letter-nda' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Create a comprehensive Non-Disclosure Agreement to protect confidential information shared during partnership discussions.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Confidentiality Scope</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>All Information</option><option>Specified Information Only</option><option>Business Information</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Term Length</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>1 Year</option><option>2 Years</option><option>5 Years</option><option>Indefinite</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Permitted Disclosures</label>
                                        <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Specify exceptions to confidentiality..."/>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'letter-licensing' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-stone-600">Generate licensing agreements for intellectual property, technology, or brand usage rights.</p>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">License Type</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Exclusive License</option><option>Non-Exclusive License</option><option>Sole License</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Royalty Structure</label>
                                        <select className="w-full p-2 border border-stone-200 rounded text-sm"><option>Percentage of Revenue</option><option>Fixed Fee</option><option>Milestone Payments</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">Territory</label>
                                        <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="Specify geographic territory..."/>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Add-in Tool Modals */}
                            {activeModal === 'add-bar-chart' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Add Bar Chart</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Chart Title</label>
                                            <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., Revenue Comparison"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Data Source</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option value="">Select data to visualize...</option>
                                                <option value="industry">Industry Breakdown</option>
                                                <option value="competitor">Competitor Market Share</option>
                                                <option value="funding">Funding Source Mix</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Chart Type</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Vertical Bars</option><option>Horizontal Bars</option><option>Stacked Bars</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'add-line-chart' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Add Line Chart</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Chart Title</label>
                                            <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., Growth Trajectory"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Time Period</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>1 Year</option><option>3 Years</option><option>5 Years</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Metrics to Plot</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Revenue", "Profit", "Market Share", "Customer Growth"].map(metric => (
                                                    <label key={metric} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                        <input type="checkbox" className="h-4 w-4"/>
                                                        <span className="text-sm">{metric}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'add-data-table' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Add Data Table</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Table Title</label>
                                            <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="e.g., Financial Summary"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Data Source</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Financial Data</option><option>Market Data</option><option>Operational Metrics</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Columns to Include</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Metric", "Current", "Target", "Variance", "Trend"].map(col => (
                                                    <label key={col} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                        <input type="checkbox" defaultChecked className="h-4 w-4"/>
                                                        <span className="text-sm">{col}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AI Analysis Tool Modals */}
                            {activeModal === 'add-sentiment-analysis' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Sentiment Analysis</h3>
                                    <div className="space-y-4">
                                        <p className="text-sm text-stone-600">Analyze sentiment in partnership communications, market feedback, and stakeholder responses.</p>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Analysis Scope</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Partner Communications</option><option>Market Feedback</option><option>Stakeholder Surveys</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Time Period</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Last 30 Days</option><option>Last 90 Days</option><option>Last 6 Months</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'add-trend-analysis' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Trend Analysis</h3>
                                    <div className="space-y-4">
                                        <p className="text-sm text-stone-600">Identify and analyze market trends, partnership patterns, and strategic opportunities.</p>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Trend Category</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Market Trends</option><option>Partnership Trends</option><option>Technology Trends</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Analysis Depth</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Overview</option><option>Detailed Analysis</option><option>Predictive Modeling</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'add-risk-assessment' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Risk Assessment Module</h3>
                                    <div className="space-y-4">
                                        <p className="text-sm text-stone-600">Advanced risk modeling and assessment for partnership opportunities.</p>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Risk Categories</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Financial", "Operational", "Strategic", "Compliance", "Market", "Geopolitical"].map(risk => (
                                                    <label key={risk} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                        <input type="checkbox" defaultChecked className="h-4 w-4"/>
                                                        <span className="text-sm">{risk} Risk</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Assessment Method</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Quantitative</option><option>Qualitative</option><option>Mixed Methods</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'add-market-prediction' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Market Prediction Engine</h3>
                                    <div className="space-y-4">
                                        <p className="text-sm text-stone-600">AI-powered market forecasting and predictive analytics for strategic planning.</p>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Prediction Horizon</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>6 Months</option><option>1 Year</option><option>2 Years</option><option>5 Years</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Prediction Factors</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Economic Indicators", "Technology Trends", "Competitive Landscape", "Regulatory Changes", "Consumer Behavior", "Geopolitical Events"].map(factor => (
                                                    <label key={factor} className="flex items-center gap-2 p-2 border rounded-md hover:bg-stone-50 cursor-pointer">
                                                        <input type="checkbox" defaultChecked className="h-4 w-4"/>
                                                        <span className="text-sm">{factor}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content Enhancement Modals */}
                            {activeModal === 'add-text-block' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Add Text Block</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Block Type</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Paragraph</option><option>Bullet Points</option><option>Callout Box</option><option>Quote</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Content</label>
                                            <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-32" placeholder="Enter your text content..."/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Styling</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Normal</option><option>Bold</option><option>Italic</option><option>Highlighted</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'add-quote' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Add Quote</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Quote Text</label>
                                            <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Enter the quote..."/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Attribution</label>
                                            <input type="text" className="w-full p-2 border border-stone-200 rounded text-sm" placeholder="Who said this?"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Quote Style</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Large & Prominent</option><option>Sidebar Style</option><option>Inline Quote</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'add-callout' && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Add Callout Box</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Callout Type</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Important Note</option><option>Key Insight</option><option>Warning</option><option>Success Story</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Content</label>
                                            <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-24" placeholder="Enter callout content..."/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">Background Color</label>
                                            <select className="w-full p-2 border border-stone-200 rounded text-sm">
                                                <option>Blue</option><option>Green</option><option>Yellow</option><option>Red</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Placeholder for other modals */}
                            {activeModal && !['identity', 'mandate', 'partner-personas', 'market', 'risk', 'financial', 'risks', 'capabilities', 'execution', 'governance', 'generation', 'analysis', 'marketplace', 'doc-summary', 'doc-bi', 'doc-analyzer', 'doc-diversification', 'doc-ethics', 'doc-precedent', 'doc-suite', 'doc-financial-model', 'doc-risk-assessment', 'letter-loi', 'letter-termsheet', 'letter-mou', 'letter-proposal', 'letter-im', 'letter-ddr', 'letter-jv', 'letter-nda', 'letter-licensing', 'add-pie-chart', 'add-bar-chart', 'add-line-chart', 'add-data-table', 'add-sentiment-analysis', 'add-trend-analysis', 'add-risk-assessment', 'add-market-prediction', 'add-text-block', 'add-quote', 'add-callout'].includes(activeModal) && modalView === 'main' && (
                                <div className="text-center text-stone-400 p-16">
                                    <h3 className="text-lg font-bold text-stone-700 mb-2">Configure {activeModal.replace(/-/g, ' ')}</h3>
                                    <p>Configuration options for this tool would appear here.</p>
                                </div>
                            )}
                        </div>
                        {/* Modal Footer */}
                        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center gap-4 shrink-0">
                            <div>
                                {validationErrors.length > 0 && <p className="text-xs text-red-600 font-bold">Please fill in all required fields (*).</p>}
                            </div>
                            <div className="flex items-center gap-4">
                            {activeModal?.startsWith('add-') ? (
                                <button onClick={handleAddChart} className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded shadow-lg hover:bg-green-700 transition-all">Add to Report</button>
                            )
                            : ['doc-suite', 'doc-summary', 'doc-bi', 'doc-analyzer', 'doc-diversification', 'doc-ethics', 'doc-precedent', 'letter-loi', 'letter-termsheet', 'letter-mou', 'letter-proposal', 'letter-im', 'letter-ddr', 'analysis', 'marketplace'].includes(activeModal || '') ? (
                                <button onClick={handleGenerateDocument} className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded shadow-lg hover:bg-green-700 transition-all">
                                    {activeModal?.startsWith('add-') ? 'Add to Report' : 'Generate Document'}
                                </button>
                            ) : activeModal !== 'generation' ? (
                                <button onClick={handleModalClose} className="px-6 py-2 bg-gradient-to-r from-amber-800 to-gray-700 text-white text-sm font-bold rounded shadow-lg hover:bg-stone-800 transition-all">
                                    Close
                                </button>
                            ) : null}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- FINALIZATION MODAL --- */}
        <AnimatePresence>
            {showFinalizationModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-8"
                    onClick={() => setShowFinalizationModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-stone-200">
                            <h2 className="text-2xl font-serif font-bold text-indigo-800">Official Report Selection</h2>
                            <p className="text-sm text-stone-600 mt-1">Select which official documents to generate. Each will be created based on the finalized draft data.</p>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {reports.map(report => (
                                    <label key={report.id} className="p-4 border-2 rounded-lg cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50 transition-all">
                                        <div className="flex items-start gap-3">
                                            <input type="checkbox" checked={selectedFinalReports.includes(report.id)} onChange={() => handleFinalReportSelection(report.id)} className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300 rounded"/>
                                            <div>
                                                <div className="font-bold text-stone-900">{report.reportName}</div>
                                                <p className="text-xs text-stone-600 mt-1">{report.problemStatement || 'No description available'}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end items-center gap-4 shrink-0">
                            <button onClick={() => setShowFinalizationModal(false)} className="px-6 py-2 text-sm font-bold text-stone-600 hover:bg-stone-200 rounded">Cancel</button>
                            <button onClick={handleGenerateFinalDocs} disabled={selectedFinalReports.length === 0} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <CheckCircle size={20} />
                                Generate {selectedFinalReports.length} Official Document(s)
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- DOCUMENT GENERATION SUITE MODAL --- */}
        <AnimatePresence>
            {showDocGenSuite && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center"
                    onClick={() => setShowDocGenSuite(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-stone-50 rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DocumentGenerationSuite
                            entityName={params.organizationName}
                            targetMarket={params.userCity}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <DocumentUploadModal
            isOpen={showDocumentUpload}
            onClose={() => setShowDocumentUpload(false)}
            onDocumentProcessed={handleDocumentProcessed}
        />

        {/* --- RIGHT PANEL: THE ARTIFACT (OUTPUT) --- */}
        <div className="flex-1 bg-gradient-to-b from-slate-50 to-blue-50 relative flex flex-col items-center overflow-hidden pt-6" style={{ flexBasis: '70%' }}>
            {/* Toolbar Header */}
            <div className="w-full h-16 bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 backdrop-blur border-b-4 border-blue-700 flex items-center justify-between px-8 z-10 shrink-0 mt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest">
                    <History className="w-4 h-4" /> Live Document Preview
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <button 
                        onClick={() => window.print()}
                        className="px-4 py-2 hover:bg-blue-50 rounded text-blue-800 text-xs font-bold flex items-center gap-2 border-2 border-blue-300 hover:border-blue-600 transition-all" 
                        title="Print"
                    >
                        <Printer size={14}/> Print
                    </button>
                    <button
                      className={`px-6 py-2 text-xs font-bold rounded shadow-lg flex items-center gap-2 transition-all ${completeness < 70 ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-blue-700 text-white hover:bg-blue-800'}`}
                      disabled={completeness < 70}
                      title={completeness < 70 ? 'Complete required inputs to finalize' : 'Finalize Intelligence'}
                    >
                        <CheckCircle size={14} /> Finalize Intelligence
                    </button>
                    {renderCompletenessBadge()}
                </div>
            </div>

                        {(!identityComplete || !advisorSnapshot) && (
                            <div className="w-full px-8 mt-4">
                                <div className="bg-white border border-dashed border-blue-200 rounded-2xl p-6 text-center text-sm text-slate-600">
                                    Complete the Identity intake so the Advisor Console can match you with relevant precedents and KPIs.
                                </div>
                            </div>
                        )}

                        {identityComplete && advisorSnapshot && (
                            <div className="w-full px-8 mt-4">
                                <div className="bg-white border border-blue-100 rounded-2xl shadow-md overflow-hidden">
                                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                                        <div>
                                            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-700">Advisor Console</div>
                                            <p className="text-xs text-slate-600">Global intelligence synthesized from precedent programs</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="px-3 py-1 text-[11px] font-semibold border border-blue-300 text-blue-700 rounded-lg flex items-center gap-1 hover:bg-blue-50"
                                                onClick={handleAdvisorRefresh}
                                            >
                                                <RefreshCw size={12} className={advisorRefreshing ? 'animate-spin' : ''} />
                                                Refresh Intel
                                            </button>
                                            <button
                                                className="px-3 py-1 text-[11px] font-semibold border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
                                                onClick={() => setAdvisorExpanded(prev => !prev)}
                                            >
                                                {advisorExpanded ? 'Hide Panel' : 'Show Panel'}
                                            </button>
                                        </div>
                                    </div>
                                    {advisorExpanded && (
                                        <div className="p-5 space-y-5">
                                            <p className="text-sm text-slate-700 leading-relaxed">{advisorSnapshot.summary}</p>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Priority Moves</div>
                                                    {advisorSnapshot.priorityMoves.length > 0 ? (
                                                        <ul className="space-y-2 text-sm text-slate-700">
                                                            {advisorSnapshot.priorityMoves.map((move, idx) => (
                                                                <li key={idx} className="flex items-start gap-2">
                                                                    <ArrowRight size={12} className="text-blue-500 mt-0.5" />
                                                                    <span>{move}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-slate-500">Complete more intake data to unlock guided actions.</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Reference Engagements</div>
                                                    {advisorSnapshot.engagements.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {advisorSnapshot.engagements.map((engagement) => (
                                                                <div key={engagement.id} className="p-3 border border-slate-200 rounded-xl bg-gradient-to-br from-white to-slate-50">
                                                                    <div className="text-sm font-semibold text-slate-900">{engagement.scenario}</div>
                                                                    <div className="text-[11px] text-slate-500">{engagement.region} • {engagement.era}</div>
                                                                    <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-slate-600">
                                                                        {engagement.metrics?.capitalMobilized !== undefined && (
                                                                            <span className="px-2 py-0.5 border border-slate-200 rounded-full bg-white">Capital {formatCapitalFigure(engagement.metrics.capitalMobilized)}</span>
                                                                        )}
                                                                        {engagement.metrics?.timeToDeployMonths !== undefined && (
                                                                            <span className="px-2 py-0.5 border border-slate-200 rounded-full bg-white">Deploy {formatMonths(engagement.metrics.timeToDeployMonths)}</span>
                                                                        )}
                                                                        {engagement.metrics?.partnersInvolved !== undefined && (
                                                                            <span className="px-2 py-0.5 border border-slate-200 rounded-full bg-white">{engagement.metrics.partnersInvolved} partners</span>
                                                                        )}
                                                                    </div>
                                                                    {(engagement.playbook?.length ?? 0) > 0 && (
                                                                        <ul className="mt-2 text-[11px] text-slate-600 list-disc pl-4 space-y-1">
                                                                            {engagement.playbook!.slice(0, 2).map((play, idx) => (
                                                                                <li key={`${engagement.id}-play-${idx}`}>{play}</li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-slate-500">Add market specifics to match precedents from the intelligence graph.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {advisorSnapshot.signals.length > 0 && (
                                                <div>
                                                    <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Signals</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {advisorSnapshot.signals.map((signal, idx) => (
                                                            <span
                                                                key={`${signal.type}-${idx}`}
                                                                className={`text-[11px] border px-2 py-1 rounded-full ${getSignalBadgeClass(signal.type)}`}
                                                            >
                                                                <strong className="mr-1">{signal.type.toUpperCase()}:</strong>
                                                                {signal.description}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid gap-4 md:grid-cols-3">
                                                {[{
                                                    id: 'battlePlan',
                                                    artifact: advisorSnapshot.artifacts.battlePlan,
                                                    border: 'border-blue-200',
                                                }, {
                                                    id: 'riskBrief',
                                                    artifact: advisorSnapshot.artifacts.riskBrief,
                                                    border: 'border-rose-200',
                                                }, {
                                                    id: 'opportunityScan',
                                                    artifact: advisorSnapshot.artifacts.opportunityScan,
                                                    border: 'border-emerald-200',
                                                }].map(({ id, artifact, border }) => (
                                                    <div key={id} className={`p-4 rounded-xl bg-white border ${border} shadow-sm`}>
                                                        <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">{artifact.title}</div>
                                                        <p className="text-sm text-slate-700 leading-relaxed">{artifact.narrative}</p>
                                                        <ul className="mt-3 list-disc pl-4 space-y-1 text-[12px] text-slate-600">
                                                            {artifact.bullets.map((bullet, idx) => (
                                                                <li key={`${id}-bullet-${idx}`}>{bullet}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

            {/* Document Scroll Area */}
            <div className="flex-1 w-full overflow-y-auto custom-scrollbar p-8 flex justify-center relative">

                {/* The Page Itself */}
                <motion.div
                    layout
                    className="bg-white w-full max-w-[794px] min-h-[1123px] shadow-2xl shadow-slate-900/10 flex flex-col relative"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Doc Header */}
                    <div className="h-32 bg-white border-b border-slate-100 flex items-center justify-between px-12 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-800 to-slate-700 text-white flex items-center justify-center font-serif font-bold text-2xl">N</div>
                            <div>
                                <div className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase mb-1">BWGA Intelligence</div>
                                <div className="text-xl font-serif font-bold text-slate-900 tracking-tight">
                                    Strategic Roadmap
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-blue-700 uppercase font-bold tracking-wider mb-1">Confidential Draft</div>
                            <div className="text-xs font-mono text-slate-500">{new Date().toLocaleDateString()}</div>
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

                        {/* Partner Personas Section */}
                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">03. Partner Personas</h2>
                            {params.partnerPersonas && params.partnerPersonas.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {params.partnerPersonas.map((persona, index) => (
                                        <div key={index} className="p-4 border border-stone-200 rounded-lg bg-stone-50">
                                            <div className="font-bold text-sm text-stone-800">{persona}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-stone-400 italic">Awaiting partner personas...</p>
                            )}
                        </div>

                        {/* 3. Market Context Section */}
                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">03. Market Context</h2>
                            {enhancedReportData.marketAnalysis.content ? (
                                <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{enhancedReportData.marketAnalysis.content}</div>
                            ) : (
                                <p className="text-sm text-stone-400 italic">Awaiting market analysis...</p>
                            )}

                            {/* Display Computed Intelligence */}
                            {reportData && reportData.computedIntelligence && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="text-sm font-bold text-blue-900 mb-3">Computed Intelligence</h3>

                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="font-semibold">RROI:</span> {reportData.computedIntelligence?.rroi?.overallScore ?? 'N/A'}/100
                                        </div>
                                        <div>
                                            <span className="font-semibold">SPI:</span> {reportData.computedIntelligence?.spi?.spi ?? 'N/A'}/100
                                        </div>
                                        <div>
                                            <span className="font-semibold">Activation P50:</span> {reportData.computedIntelligence?.ivas?.p50Months ?? 'N/A'} mo
                                        </div>
                                        <div>
                                            <span className="font-semibold">Activation Band:</span> P10 {reportData.computedIntelligence?.ivas?.p10Months ?? '—'} / P90 {reportData.computedIntelligence?.ivas?.p90Months ?? '—'}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Impact P50:</span> ${reportData.computedIntelligence?.scf?.impactP50 ? Math.round(reportData.computedIntelligence.scf.impactP50).toLocaleString() : 'N/A'}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Impact Band:</span> P10 ${reportData.computedIntelligence?.scf?.impactP10 ? Math.round(reportData.computedIntelligence.scf.impactP10).toLocaleString() : '—'} / P90 ${reportData.computedIntelligence?.scf?.impactP90 ? Math.round(reportData.computedIntelligence.scf.impactP90).toLocaleString() : '—'}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <span className="font-semibold text-xs">Top Symbiotic Partners:</span>
                                        <ul className="text-xs mt-1">
                                            {reportData.computedIntelligence?.symbioticPartners?.slice(0, 2).map((partner, idx: number) => (
                                                <li key={idx} className="text-stone-700">• {partner.entityName} (Score: {partner.symbiosisScore})</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-stone-600">
                                        <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Confidence: {reportData.confidenceScores?.overall ?? '—'}/100</span>
                                        <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Economic: {reportData.confidenceScores?.economicReadiness ?? '—'}</span>
                                        <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Political: {reportData.confidenceScores?.politicalStability ?? '—'}</span>
                                        <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Velocity: {reportData.confidenceScores?.activationVelocity ?? '—'}</span>
                                    </div>

                                    {reportData.computedIntelligence?.provenance && (
                                        <div className="mt-3 text-[10px] text-stone-600">
                                            <div className="font-semibold text-stone-700 mb-1">Traceability</div>
                                            <ul className="space-y-1">
                                                {reportData.computedIntelligence.provenance.map((p, idx) => (
                                                    <li key={idx} className="flex flex-wrap gap-2 items-center">
                                                        <span className="font-semibold text-stone-700">{p.metric}:</span>
                                                        <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">{p.source}</span>
                                                        <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Freshness: {p.freshness}</span>
                                                        {p.coverage !== undefined && (
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Coverage: {p.coverage}%</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Injected components will render here */}
                        {injectedComponents.map((comp, index) => renderInjectedComponent(comp, index))}

                        {/* 4. Risk & Historical */}
                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">04. Risk & Historical Validation</h2>
                            {enhancedReportData.risks.content ? (
                                <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{enhancedReportData.risks.content}</div>
                            ) : (
                                <p className="text-sm text-stone-400 italic">Awaiting risk assessment...</p>
                            )}
                        </div>

                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">05. Advanced Analysis</h2>
                            <p className="text-sm text-stone-400 italic">Awaiting advanced analysis...</p>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">06. Marketplace Opportunities</h2>
                            <p className="text-sm text-stone-400 italic">Awaiting marketplace analysis...</p>
                        </div>
                    </div>

                    {/* Doc Footer */}
                    <div className="h-16 bg-white border-t border-stone-100 flex items-center justify-between px-12 text-[9px] text-stone-400 font-sans uppercase tracking-widest shrink-0">
                        <span>Generated by Nexus Core v4.2</span>
                        <span>Page 1 of 1</span>
                    </div>
                </motion.div>

                {isDraftFinalized && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                        <button 
                            onClick={() => setShowFinalizationModal(true)}
                            className="px-8 py-4 bg-bw-gold text-indigo-800 font-bold rounded-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3 animate-pulse"
                        >
                            <CheckCircle size={20} /> Accept Draft & Proceed to Report Selection
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};


export default MainCanvas;





