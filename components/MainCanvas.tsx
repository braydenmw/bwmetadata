/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    Building2, Target, ShieldCheck, Shield,
    Download, Printer, Globe, MapPin,
    Check, CheckCircle,
    Network, History,
    Zap, Users, Scale, GitBranch,
    FileText, BarChart3, Handshake, TrendingUp,
    Database, Calculator, PieChart, Activity, Cpu, AlertCircle,
    X, Plus, MessageCircle, Send, User, ArrowRight, DollarSign, RefreshCw,
    Volume2, VolumeX, Square
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ReportParameters, ReportData, GenerationPhase, CopilotInsight, toolCategories, RefinedIntake } from '../types';
import DocumentGenerationSuite from './DocumentGenerationSuite';
import { DocumentUploadModal } from './DocumentUploadModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ENTITY_TYPES, COUNTRIES, INDUSTRIES } from '../constants/businessData';
import { CITY_PROFILES } from '../data/globalLocationProfiles.ts';
import { GLOBAL_STRATEGIC_INTENTS, INTENT_SCOPE_OPTIONS, DEVELOPMENT_OUTCOME_OPTIONS, GLOBAL_COUNTERPART_TYPES, TIME_HORIZON_OPTIONS, MACRO_FACTOR_OPTIONS, REGULATORY_FACTOR_OPTIONS, ECONOMIC_FACTOR_OPTIONS, CURRENCY_OPTIONS, PRIORITY_THEMES, TARGET_INCENTIVES, STRATEGIC_LENSES, POLITICAL_SENSITIVITIES } from '../constants';
import { evaluateDocReadiness } from '../services/intakeMapping';
import useAdvisorSnapshot from '../hooks/useAdvisorSnapshot';
import useBrainObserver, { BrainSignal } from '../hooks/useBrainObserver';
import ContextualAIAssistant from './ContextualAIAssistant';
import { LiveReportBuilder, type LiveReportState } from '../services/MultiAgentBrainSystem';
import { bwConsultantAI } from '../services/BWConsultantAgenticAI';
import { researchLocation } from '../services/geminiLocationService';

const REQUIRED_FIELDS: Record<string, (keyof ReportParameters)[]> = {
    identity: ['organizationName', 'organizationType', 'country'],
    mandate: ['strategicIntent', 'problemStatement'],
    market: ['userCity'],
    'partner-personas': ['partnerPersonas'],
    risks: ['riskTolerance'],
    'rate-liquidity': [],
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
    'External Advisors / Consultants',
    'Procurement / Sourcing',
    'Human Resources / Talent',
    'Marketing & Communications',
    'Risk Management',
    'IT / Information Security',
    'Strategic Partners',
    'Labor Unions / Worker Councils'
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
    'Talent Access',
    'Government Relationships',
    'Brand Strength',
    'Innovation Capability',
    'Supply Chain Reach',
    'Customer Base Overlap',
    'Complementary Products',
    'Shared Values / Vision',
    'Financial Stability'
];

const RELATIONSHIP_GOALS = [
    'Co-develop Solutions',
    'Enter New Market',
    'Secure Policy Support',
    'Scale Distribution Network',
    'Launch Joint Innovation Lab',
    'Create Investment Vehicle',
    'Share Infrastructure',
    'Accelerate Commercialization',
    'Access New Customer Segments',
    'Reduce Operational Costs',
    'Transfer Technology / Know-how',
    'Build Supply Chain Resilience',
    'Expand Geographic Footprint',
    'Acquire Talent / Expertise',
    'Diversify Revenue Streams',
    'Achieve Regulatory Compliance'
];

const PARTNER_READINESS_LEVELS = [
    'Initial Research',
    'Exploration / Discovery',
    'Shortlisting Candidates',
    'Initial Outreach',
    'Preliminary Discussions',
    'Due Diligence (Financial)',
    'Due Diligence (Legal)',
    'Due Diligence (Technical)',
    'Term Sheet Negotiation',
    'Contract Drafting',
    'Final Approval / Signing',
    'Implementation / Launch',
    'Scaling Partnership',
    'Partnership Review / Renewal'
];

const RISK_CATEGORIES = [
    'Market Risk',
    'Operational Risk',
    'Financial Risk',
    'Legal / Regulatory Risk',
    'Relationship / Partner Risk',
    'Technology / Cyber Risk',
    'Reputational Risk',
    'Political / Geopolitical Risk',
    'Currency / FX Risk',
    'Execution / Delivery Risk'
];

const CAPABILITY_AREAS = [
    { name: 'Sales & Business Development', key: 'sales' },
    { name: 'Operations & Delivery', key: 'ops' },
    { name: 'Product Development', key: 'product' },
    { name: 'Finance & Control', key: 'finance' },
    { name: 'Risk Management', key: 'risk' }
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

const formatPercent = (value?: number) => {
    if (value === undefined || value === null) return 'n/a';
    return `${Math.round(value * 100)}%`;
};

const getSignalBadgeStyle = (type?: string) => {
    const normalized = (type || '').toLowerCase();

    if (normalized.includes('risk') || normalized.includes('vulnerability') || normalized.includes('warning')) {
        return SIGNAL_BADGE_STYLES.risk;
    }

    if (normalized.includes('opportunity')) {
        return SIGNAL_BADGE_STYLES.opportunity;
    }

    if (normalized.includes('timing') || normalized.includes('regime') || normalized.includes('trend')) {
        return SIGNAL_BADGE_STYLES.trend;
    }

    if (normalized.includes('correlation') || normalized.includes('benchmark')) {
        return SIGNAL_BADGE_STYLES.benchmark;
    }

    return 'bg-slate-50 text-slate-700 border-slate-200';
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
    const [rateStressInputs, setRateStressInputs] = useState({
        rate30: '',
        rate90: '',
        hedgeRatio: '',
        currencyMix: '',
        dscrBase: '',
        icrBase: '',
        liquidityDays: '',
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

    const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'bw', timestamp: Date, action?: { label: string; type: 'open-gli' | 'open-docs' }}>>([
    { text: "👋 Welcome — I'm your BW Consultant, a fully autonomous AI advisor.\n\n**What I can do for you:**\n• Research any city, country, company, government, or person — just type a name\n• Provide strategic guidance on every step of your intake\n• Analyse risks, markets, financials, and regulatory environments\n• Generate proactive intelligence as you build your report\n\n💡 **Try it now:** Type \"Tell me about Manila, Philippines\" or ask any strategic question.", sender: 'bw', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
    const lastObservedStepRef = useRef<string | null>(null);
    const lastObservedParamsRef = useRef<string>('');
  const [agentThinking, setAgentThinking] = useState(false);
    const [liveAgenticState, setLiveAgenticState] = useState<LiveReportState | null>(null);
    const liveAgenticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Voice synthesis function - speaks text aloud
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || typeof window === 'undefined') return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Clean text for speech (remove markdown formatting)
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/•/g, '')
      .replace(/📋|🔍|🤝|📊|📄|🌴|🎯|⚠️|💡|✅/g, '')
      .replace(/\n\n/g, '. ')
      .replace(/\n/g, '. ');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a professional-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Microsoft') || 
      v.name.includes('Samantha') ||
      v.lang.startsWith('en')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Stop speaking function
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);
    const { snapshot: advisorSnapshot, refresh: refreshAdvisorSnapshot } = useAdvisorSnapshot(params);
    const brainObservation = useBrainObserver(params);
    const [advisorExpanded, setAdvisorExpanded] = useState(true);
    const [advisorRefreshing, setAdvisorRefreshing] = useState(false);
    const [unifiedConsultantMode, setUnifiedConsultantMode] = useState(true);
    const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const advisorPanelRef = useRef<HTMLDivElement | null>(null);
    const documentScrollRef = useRef<HTMLDivElement | null>(null);
    const documentScrollPositionRef = useRef(0);
    const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);
    const chatScrollRef = useRef<HTMLDivElement | null>(null);

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

    // Auto-scroll document preview when content changes
    useEffect(() => {
        // Removed auto-scroll to bottom - let users scroll manually from the top
        // if (documentScrollRef.current) {
        //     documentScrollRef.current.scrollTo({
        //         top: documentScrollRef.current.scrollHeight,
        //         behavior: 'smooth'
        //     });
        // }
    }, [params, reportData, injectedComponents]);

    // Ensure document preview starts at top on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            if (documentScrollRef.current) {
                documentScrollRef.current.scrollTop = 0;
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleDocumentScroll = useCallback(() => {
        if (!documentScrollRef.current) return;
        documentScrollPositionRef.current = documentScrollRef.current.scrollTop;
    }, []);

    // Keep Live Document Preview scroll stable when chat updates
    useEffect(() => {
        if (!documentScrollRef.current) return;
        const restore = () => {
            if (!documentScrollRef.current) return;
            documentScrollRef.current.scrollTop = documentScrollPositionRef.current;
        };
        requestAnimationFrame(restore);
    }, [chatMessages]);

    // Auto-scroll chat messages when new messages are added (only within chat container)
    useEffect(() => {
        if (!chatScrollRef.current) return;
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }, [chatMessages]);

    // Ensure sidebar starts at top on component mount
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            const sidebarContainer = document.querySelector('.flex-1.overflow-y-auto.custom-scrollbar');
            if (sidebarContainer) {
                sidebarContainer.scrollTop = 0;
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const scrollAdvisorPanelIntoView = useCallback(() => {
        setAdvisorExpanded(true);
        advisorPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [setAdvisorExpanded]);

    // ===== AUTONOMOUS AGENTIC BW CONSULTANT =====
    // This effect observes user actions and proactively provides guidance
    useEffect(() => {
        // Only trigger when activeModal changes (user navigates to a new step)
        if (activeModal && activeModal !== lastObservedStepRef.current) {
            lastObservedStepRef.current = activeModal;
            const startThinking = setTimeout(() => setAgentThinking(true), 0);
            
            // Simulate agent "thinking" before responding
            const thinkingDelay = setTimeout(() => {
                setAgentThinking(false);
                
                // Generate proactive guidance based on the step
                const stepGuidance: Record<string, string> = {
                    'identity': `🧠 **I'm observing you've entered the Identity section.**\n\nI'm now analyzing your organization profile. Here's what I'm looking for:\n• Entity type determines partnership structures available\n• Country selection affects regulatory frameworks\n• Industry classification unlocks sector-specific intelligence\n\n💡 **My recommendation:** Start with your organization name, then I'll automatically suggest relevant entity types and industries based on market patterns.`,
                    'mandate': `🎯 **Strategic Mandate detected.**\n\nI'm now learning your objectives to customize recommendations. Key insights I'll derive:\n• Strategic intent shapes partner matching criteria\n• KPIs inform success metrics for the roadmap\n• Problem statement helps identify solution partners\n\n💡 **Observation:** ${params.organizationName ? `For ${params.organizationName}` : 'Organizations'} in ${params.country || 'your market'}, successful mandates typically focus on 2-3 primary objectives. I'll help you prioritize.`,
                    'market': `🌍 **Market Analysis activated.**\n\nI'm cross-referencing your profile against global market intelligence:\n• Regulatory landscape for ${params.country || 'your target region'}\n• Competitive dynamics in ${params.industry?.[0] || 'your sector'}\n• Entry barriers and enablers\n\n💡 **Auto-learning:** As you specify cities and regions, I'll surface relevant precedent cases and local partner opportunities.`,
                    'partner-personas': `🤝 **Partner Persona module engaged.**\n\nBased on your mandate${params.strategicIntent?.length ? ` (${params.strategicIntent[0]})` : ''}, I'm computing ideal partner profiles:\n• Fit criteria weighted by your objectives\n• Relationship goals aligned with timeline\n• Stakeholder mapping for governance\n\n💡 **Intelligence:** I'll match your criteria against 50,000+ global entities in my database.`,
                    'financial': `💰 **Financial modeling initiated.**\n\nI'm preparing scenario analysis based on your inputs:\n• Deal size parameters\n• Investment thresholds\n• Currency and FX considerations for ${params.country || 'international'} operations\n\n💡 **Autonomous analysis:** I'll stress-test your financial assumptions against regional economic indicators.`,
                    'risks': `⚠️ **Risk assessment framework loaded.**\n\nI'm scanning for risk factors specific to:\n• ${params.country || 'Target'} political/regulatory environment\n• ${params.industry?.[0] || 'Sector'} operational risks\n• Partnership execution risks\n\n💡 **Proactive alert:** I've pre-loaded common risk categories. I'll auto-suggest mitigations based on precedent cases.`,
                    'capabilities': `🔧 **Capability mapping started.**\n\nI'm analyzing capability gaps against your objectives:\n• Team strength assessment\n• Technology requirements\n• Resource allocation optimization\n\n💡 **Learning mode:** Tell me your strengths and I'll identify complementary partner capabilities.`,
                    'execution': `📋 **Execution roadmap builder active.**\n\nI'm structuring your implementation timeline:\n• Phase dependencies\n• Milestone sequencing\n• Go/no-go decision points\n\n💡 **Autonomous planning:** Based on ${params.expansionTimeline || 'your timeline'}, I'll suggest realistic milestones with buffer for regional complexities.`,
                    'governance': `⚖️ **Governance framework initiated.**\n\nI'm preparing decision structures for:\n• Authority matrices\n• Escalation protocols\n• Change management procedures\n\n💡 **Best practice:** I'll map governance to your organization type (${params.organizationType || 'entity structure'}) and regional requirements.`,
                    'rate-liquidity': `📊 **Financial resilience analysis started.**\n\nI'm modeling stress scenarios:\n• Interest rate sensitivity\n• Currency hedging strategies\n• Cash runway projections\n\n💡 **Autonomous modeling:** I'll factor in current ${params.currency || 'currency'} volatility and regional lending rates.`,
                };
                
                const guidance = stepGuidance[activeModal];
                if (guidance) {
                    setChatMessages(prev => [...prev, {
                        text: guidance,
                        sender: 'bw',
                        timestamp: new Date()
                    }]);
                }
            }, 800);
            
            return () => {
                clearTimeout(startThinking);
                clearTimeout(thinkingDelay);
            };
        }
    }, [activeModal, params]);

    // Autonomous observation of key field changes
    useEffect(() => {
        const paramsHash = JSON.stringify({
            org: params.organizationName,
            country: params.country,
            intent: params.strategicIntent,
            industry: params.industry,
        });
        
        if (paramsHash !== lastObservedParamsRef.current && lastObservedParamsRef.current !== '') {
            // Detect what changed and provide contextual feedback
            const prevParams = lastObservedParamsRef.current ? JSON.parse(lastObservedParamsRef.current) : {};
            
            // Organization name changed
            if (params.organizationName && params.organizationName !== prevParams.org) {
                setTimeout(() => {
                    setChatMessages(prev => [...prev, {
                        text: `✅ **Registered:** ${params.organizationName}\n\nI'm now tailoring all recommendations to your organization. My learning algorithms are adapting to your profile.`,
                        sender: 'bw',
                        timestamp: new Date()
                    }]);
                }, 500);
            }
            
            // Country changed
            if (params.country && params.country !== prevParams.country) {
                setTimeout(() => {
                    setChatMessages(prev => [...prev, {
                        text: `🌍 **Market context updated:** ${params.country}\n\nI've loaded regional intelligence including:\n• Regulatory frameworks\n• Market entry precedents\n• Local partnership opportunities\n• Risk factors specific to this jurisdiction`,
                        sender: 'bw',
                        timestamp: new Date()
                    }]);
                }, 600);
            }
            
            // Strategic intent changed
            if (params.strategicIntent?.length > 0 && 
                JSON.stringify(params.strategicIntent) !== JSON.stringify(prevParams.intent || [])) {
                setTimeout(() => {
                    setChatMessages(prev => [...prev, {
                        text: `🎯 **Objectives learned:** ${params.strategicIntent.join(', ')}\n\nI'm recalibrating partner matching algorithms and success metrics based on these priorities. My recommendations will now be weighted toward these goals.`,
                        sender: 'bw',
                        timestamp: new Date()
                    }]);
                }, 700);
            }
        }
        
        lastObservedParamsRef.current = paramsHash;
    }, [params.organizationName, params.country, params.strategicIntent, params.industry]);

    // Completeness calculation - must be defined before useEffects that depend on it
    const completeness = React.useMemo(() => {
        const total = Object.values(REQUIRED_FIELDS).flat().length;
        let filled = 0;
        Object.values(REQUIRED_FIELDS).flat().forEach(field => {
            const value = params[field as keyof ReportParameters];
            if (Array.isArray(value) ? value.length > 0 : Boolean(value)) filled += 1;
        });
        return Math.round((filled / Math.max(total, 1)) * 100);
    }, [params]);

    // Step completion checks - must be defined before useEffects that reference them
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

    // Proactive completeness nudges
    useEffect(() => {
        // Provide guidance when completeness hits certain thresholds
        if (completeness === 25 && chatMessages.length < 5) {
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    text: `📈 **Progress: 25% complete**\n\nGreat start! I'm beginning to see patterns in your requirements. Keep going — once you hit 50%, I'll generate your first draft analysis.`,
                    sender: 'bw',
                    timestamp: new Date()
                }]);
            }, 1000);
        } else if (completeness >= 50 && completeness < 70 && chatMessages.length < 8) {
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    text: `🚀 **Milestone: 50%+ complete**\n\nExcellent! You've unlocked draft generation. I can now produce preliminary strategic documents. The more context you provide, the more precise my recommendations become.`,
                    sender: 'bw',
                    timestamp: new Date()
                }]);
            }, 1000);
        }
    }, [completeness, chatMessages.length]);

    // Proactive advisor intelligence — inject insights into chat when advisor data becomes available
    const lastAdvisorHashRef = useRef<string>('');
    useEffect(() => {
        if (identityComplete && advisorSnapshot) {
            const hash = JSON.stringify({ s: advisorSnapshot.summary?.slice(0, 50), m: advisorSnapshot.priorityMoves?.length });
            if (hash !== lastAdvisorHashRef.current) {
                lastAdvisorHashRef.current = hash;
                let advisorBrief = `📋 **PROACTIVE INTELLIGENCE BRIEFING**\n\n`;
                if (advisorSnapshot.summary) advisorBrief += `${advisorSnapshot.summary}\n\n`;
                if (advisorSnapshot.priorityMoves?.length > 0) {
                    advisorBrief += `**Priority Actions:**\n`;
                    advisorSnapshot.priorityMoves.slice(0, 3).forEach((move: string) => { advisorBrief += `→ ${move}\n`; });
                    advisorBrief += `\n`;
                }
                if (advisorSnapshot.signals?.length > 0) {
                    advisorBrief += `**Active Signals:** ${advisorSnapshot.signals.slice(0, 4).map((s: any) => s.type?.toUpperCase()).join(' • ')}\n\n`;
                }
                advisorBrief += `💡 I'll continue monitoring your inputs and will proactively alert you to opportunities and risks as you progress.`;
                setTimeout(() => {
                    setChatMessages(prev => [...prev, { text: advisorBrief, sender: 'bw', timestamp: new Date() }]);
                }, 1500);
            }
        }
    }, [identityComplete, advisorSnapshot]);

    // Proactive live summary injection into chat
    const lastSummaryRef = useRef<string>('');
    useEffect(() => {
        if (liveAgenticState?.generatedSummary && liveAgenticState.generatedSummary !== lastSummaryRef.current) {
            lastSummaryRef.current = liveAgenticState.generatedSummary;
            const summaryMsg = `📊 **LIVE ANALYSIS UPDATE** (${liveAgenticState.completeness}% complete)\n\n${liveAgenticState.generatedSummary}`;
            setTimeout(() => {
                setChatMessages(prev => [...prev, { text: summaryMsg, sender: 'bw', timestamp: new Date() }]);
            }, 2000);
        }
    }, [liveAgenticState?.generatedSummary, liveAgenticState?.completeness]);

    // Live multi-agent builder sync (drives autonomous live report insights)
    useEffect(() => {
        const reportId = params.id || 'live-report';
        if (liveAgenticTimerRef.current) {
            clearTimeout(liveAgenticTimerRef.current);
        }
        liveAgenticTimerRef.current = setTimeout(async () => {
            try {
                const state = await LiveReportBuilder.updateFromParams(reportId, params);
                setLiveAgenticState(state);
            } catch (error) {
                console.warn('Live multi-agent sync failed', error);
            }
        }, 900);

        return () => {
            if (liveAgenticTimerRef.current) {
                clearTimeout(liveAgenticTimerRef.current);
            }
        };
    }, [params, activeModal]);

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

    const handleOpenGlobalLocationReport = () => {
        const target = (params.userCity || params.country || '').trim();
        if (target) {
            localStorage.setItem('gli-target', target);
        }
        if (onChangeViewMode) {
            onChangeViewMode('global-location-intel');
        }
    };

    const upsertRiskRegister = useCallback((category: string, field: keyof ReportParameters['riskRegister'][number], value: string) => {
        const current = params.riskRegister || [];
        const idx = current.findIndex(entry => entry.category === category);
        const existing = idx >= 0 ? current[idx] : { category };
        const nextEntry = { ...existing, [field]: value };
        const next = idx >= 0
            ? current.map((entry, i) => (i === idx ? nextEntry : entry))
            : [...current, nextEntry];
        setParams({ ...params, riskRegister: next });
    }, [params, setParams]);

    const getRiskEntry = useCallback((category: string) => {
        return (params.riskRegister || []).find(entry => entry.category === category);
    }, [params.riskRegister]);

    const upsertCapability = useCallback((area: string, updates: Partial<ReportParameters['capabilityAssessments'][number]>) => {
        const current = params.capabilityAssessments || [];
        const idx = current.findIndex(item => item.area === area);
        const existing = idx >= 0 ? current[idx] : { area };
        const nextEntry = { ...existing, ...updates };
        const next = idx >= 0
            ? current.map((item, i) => (i === idx ? nextEntry : item))
            : [...current, nextEntry];
        setParams({ ...params, capabilityAssessments: next });
    }, [params, setParams]);

    const getCapability = useCallback((area: string) => {
        return (params.capabilityAssessments || []).find(item => item.area === area);
    }, [params.capabilityAssessments]);

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
                if (!chatInput.trim()) return;

                const userQuestion = chatInput.trim();
                const newMessage = { text: userQuestion, sender: 'user' as const, timestamp: new Date() };
                setChatMessages(prev => [...prev, newMessage]);
                setChatInput('');

                setAgentThinking(true);

                // Detect if this is a location/entity research request
                const lower = userQuestion.toLowerCase();
                const isLocationResearch = /\b(tell me about|research|look up|investigate|brief|background|intel|information on|info on|what do you know about|who is|what is|where is|find out about|search for|search|analyze|analyse)\b/i.test(userQuestion) 
                    || /\b(city|country|region|company|government|council|ministry|corporation|organization|organisation|municipality|province|state|person|leader|mayor|ceo|director)\b/i.test(userQuestion);

                setTimeout(async () => {
                        try {
                                if (isLocationResearch) {
                                        // Extract the target entity from the question
                                        const target = userQuestion
                                                .replace(/^(tell me about|research|look up|investigate|give me a brief on|background on|intel on|information on|info on|what do you know about|who is|what is|where is|find out about|search for|search|analyze|analyse)\s*/i, '')
                                                .replace(/[?.!]$/g, '')
                                                .trim();

                                        setChatMessages(prev => [...prev, {
                                                text: `🔍 **Researching: "${target}"**\n\nI'm now pulling intelligence from multiple sources — demographics, economic data, leadership, infrastructure, regulatory environment, and risk indicators. This may take 10–20 seconds...`,
                                                sender: 'bw' as const,
                                                timestamp: new Date()
                                        }]);

                                        try {
                                                const result = await Promise.race([
                                                        researchLocation(target || userQuestion),
                                                        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 35000))
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                ]) as any;

                                                if (result?.profile) {
                                                        const p = result.profile;

                                                        // Build a comprehensive intel brief directly in chat
                                                        let brief = `📊 **INTELLIGENCE BRIEF: ${p.city || target}${p.country ? `, ${p.country}` : ''}**\n\n`;
                                                        
                                                        // Demographics
                                                        if (p.population || p.demographics) {
                                                                brief += `**DEMOGRAPHICS**\n`;
                                                                if (p.population) brief += `• Population: ${typeof p.population === 'number' ? p.population.toLocaleString() : p.population}\n`;
                                                                if (p.demographics?.medianAge) brief += `• Median Age: ${p.demographics.medianAge}\n`;
                                                                if (p.demographics?.urbanization) brief += `• Urbanization: ${p.demographics.urbanization}\n`;
                                                                if (p.demographics?.literacy) brief += `• Literacy Rate: ${p.demographics.literacy}\n`;
                                                                if (p.demographics?.languages) brief += `• Languages: ${Array.isArray(p.demographics.languages) ? p.demographics.languages.join(', ') : p.demographics.languages}\n`;
                                                                brief += `\n`;
                                                        }

                                                        // Economics
                                                        if (p.economics || p.gdp) {
                                                                brief += `**ECONOMIC PROFILE**\n`;
                                                                if (p.economics?.gdpLocal) brief += `• GDP: ${p.economics.gdpLocal}\n`;
                                                                if (p.economics?.gdpPerCapita) brief += `• GDP per Capita: ${p.economics.gdpPerCapita}\n`;
                                                                if (p.economics?.growthRate) brief += `• Growth Rate: ${p.economics.growthRate}\n`;
                                                                if (p.economics?.inflation) brief += `• Inflation: ${p.economics.inflation}\n`;
                                                                if (p.economics?.unemployment) brief += `• Unemployment: ${p.economics.unemployment}\n`;
                                                                if (p.economics?.currency) brief += `• Currency: ${p.economics.currency}\n`;
                                                                if (p.economics?.majorExports) brief += `• Major Exports: ${Array.isArray(p.economics.majorExports) ? p.economics.majorExports.join(', ') : p.economics.majorExports}\n`;
                                                                if (p.economics?.majorImports) brief += `• Major Imports: ${Array.isArray(p.economics.majorImports) ? p.economics.majorImports.join(', ') : p.economics.majorImports}\n`;
                                                                brief += `\n`;
                                                        }

                                                        // Key Industries/Sectors
                                                        const sectors = p.keySectors || p.industries || p.keyIndustries;
                                                        if (sectors?.length) {
                                                                brief += `**KEY INDUSTRIES & SECTORS**\n`;
                                                                (Array.isArray(sectors) ? sectors : [sectors]).forEach((s: string) => { brief += `• ${s}\n`; });
                                                                brief += `\n`;
                                                        }

                                                        // Leadership
                                                        if (p.leaders?.length || p.leadership) {
                                                                brief += `**LEADERSHIP & GOVERNANCE**\n`;
                                                                const leaders = p.leaders || (p.leadership ? [p.leadership] : []);
                                                                leaders.slice(0, 5).forEach((l: any) => {
                                                                        if (typeof l === 'string') { brief += `• ${l}\n`; }
                                                                        else { brief += `• ${l.name}${l.role ? ` — ${l.role}` : ''}${l.party ? ` (${l.party})` : ''}\n`; }
                                                                });
                                                                brief += `\n`;
                                                        }

                                                        // Infrastructure
                                                        if (p.infrastructure) {
                                                                brief += `**INFRASTRUCTURE**\n`;
                                                                const infra = p.infrastructure;
                                                                if (infra.airports?.length) brief += `• Airports: ${infra.airports.join(', ')}\n`;
                                                                if (infra.seaports?.length) brief += `• Seaports: ${infra.seaports.join(', ')}\n`;
                                                                if (infra.internetPenetration) brief += `• Internet Penetration: ${infra.internetPenetration}\n`;
                                                                if (infra.powerGrid) brief += `• Power Grid: ${infra.powerGrid}\n`;
                                                                if (infra.transportLinks) brief += `• Transport: ${Array.isArray(infra.transportLinks) ? infra.transportLinks.join(', ') : infra.transportLinks}\n`;
                                                                brief += `\n`;
                                                        }

                                                        // Regulatory
                                                        if (p.regulatory || p.regulatoryEnvironment) {
                                                                brief += `**REGULATORY ENVIRONMENT**\n`;
                                                                const reg = p.regulatory || p.regulatoryEnvironment;
                                                                if (typeof reg === 'string') { brief += `• ${reg}\n`; }
                                                                else {
                                                                        if (reg.easeOfBusiness) brief += `• Ease of Doing Business: ${reg.easeOfBusiness}\n`;
                                                                        if (reg.taxRate) brief += `• Corporate Tax Rate: ${reg.taxRate}\n`;
                                                                        if (reg.foreignInvestmentPolicy) brief += `• FDI Policy: ${reg.foreignInvestmentPolicy}\n`;
                                                                        if (reg.specialEconomicZones) brief += `• Special Economic Zones: ${Array.isArray(reg.specialEconomicZones) ? reg.specialEconomicZones.join(', ') : reg.specialEconomicZones}\n`;
                                                                        if (reg.keyRegulations) brief += `• Key Regulations: ${Array.isArray(reg.keyRegulations) ? reg.keyRegulations.join(', ') : reg.keyRegulations}\n`;
                                                                }
                                                                brief += `\n`;
                                                        }

                                                        // Risk Assessment
                                                        if (p.risks || p.riskFactors) {
                                                                brief += `**RISK ASSESSMENT**\n`;
                                                                const risks = p.risks || p.riskFactors;
                                                                if (Array.isArray(risks)) {
                                                                        risks.forEach((r: any) => {
                                                                                if (typeof r === 'string') { brief += `• ${r}\n`; }
                                                                                else { brief += `• ${r.type || r.category}: ${r.level || r.severity || ''} — ${r.description || r.detail || ''}\n`; }
                                                                        });
                                                                } else if (typeof risks === 'object') {
                                                                        Object.entries(risks).forEach(([key, val]) => { brief += `• ${key}: ${val}\n`; });
                                                                }
                                                                brief += `\n`;
                                                        }

                                                        // Summary
                                                        if (result.summary) {
                                                                brief += `**ANALYST SUMMARY**\n${result.summary}\n\n`;
                                                        }

                                                        brief += `💡 **Proactive recommendation:** You can use this intelligence to inform Steps 3–10 of your intake. I've stored this research for reference across your report.`;

                                                        // Store for reuse
                                                        localStorage.setItem('lastLocationResult', JSON.stringify(result));
                                                        localStorage.setItem('gli-target', `${p.city}, ${p.country}`);

                                                        setChatMessages(prev => [...prev, {
                                                                text: brief,
                                                                sender: 'bw' as const,
                                                                timestamp: new Date(),
                                                                action: { label: 'Open Full Location Report', type: 'open-gli' }
                                                        }]);
                                                } else {
                                                        // Fallback to standard consultant
                                                        const insights = await bwConsultantAI.consult({ ...params, userQuestion, conversationHistory: chatMessages.slice(-5).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })) }, 'live_report_chat');
                                                        const topInsights = insights.slice(0, 3);
                                                        const responseText = topInsights.length
                                                                ? `I researched "${target}" but could not find a comprehensive profile. Here's what I gathered:\n\n${topInsights.map(i => `• ${i.title}: ${i.content}`).join('\n')}\n\n💡 Try being more specific — e.g. "Manila, Philippines" or "Northland Regional Council, New Zealand".`
                                                                : `I couldn't find detailed intelligence on "${target}". Try specifying a city name with country (e.g. "Melbourne, Australia") or a specific organisation name.`;
                                                        setChatMessages(prev => [...prev, { text: responseText, sender: 'bw' as const, timestamp: new Date() }]);
                                                }
                                        } catch (researchErr) {
                                                const errMsg = researchErr instanceof Error ? researchErr.message : 'Unknown error';
                                                setChatMessages(prev => [...prev, {
                                                        text: `⚠️ Research encountered an issue: ${errMsg.includes('timeout') ? 'The request timed out. Try a simpler search term.' : errMsg}\n\nI'm still here to help — try rephrasing your question or ask me about a specific topic.`,
                                                        sender: 'bw' as const,
                                                        timestamp: new Date()
                                                }]);
                                        }
                                } else {
                                        // Standard consultant query — strategy, advice, formulas etc.
                                        const insights = await bwConsultantAI.consult({
                                                ...params,
                                                userQuestion,
                                                conversationHistory: chatMessages.slice(-5).map(m => ({
                                                        role: m.sender === 'user' ? 'user' : 'assistant',
                                                        content: m.text
                                                }))
                                        }, 'live_report_chat');

                                        const topInsights = insights.slice(0, 3);
                                        let responseText = topInsights.length
                                                ? `${topInsights.map(i => `**${i.title}**\n${i.content}`).join('\n\n')}`
                                                : 'I\'m ready to assist. You can ask me to research any city, country, company, or government entity — or ask about your project strategy, scores, risk analysis, or any aspect of your intake.';

                                        // Proactive follow-up suggestions
                                        if (!lower.includes('help') && !lower.includes('what can')) {
                                                responseText += `\n\n💡 **I can also:**\n• Research any location, company, or entity — just ask\n• Explain your scores and how to improve them\n• Provide strategic recommendations based on your intake data`;
                                        }

                                        let action: { label: string; type: 'open-gli' | 'open-docs' } | undefined;
                                        if (lower.includes('report') || lower.includes('document') || lower.includes('generate')) {
                                                action = { label: 'Open Document Suite', type: 'open-docs' };
                                        }

                                        setChatMessages(prev => [...prev, {
                                                text: responseText,
                                                sender: 'bw' as const,
                                                timestamp: new Date(),
                                                ...(action ? { action } : {})
                                        }]);
                                }
                        } catch (error) {
                                console.error('BW Consultant chat error:', error);
                                setChatMessages(prev => [...prev, {
                                        text: `I encountered an error while generating a response. ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again — I'm still operational.`,
                                        sender: 'bw' as const,
                                        timestamp: new Date()
                                }]);
                        } finally {
                                setAgentThinking(false);
                        }
                }, 400);
        };

    const renderCompletenessBadge = () => {
        if (completeness <= 0) return null;
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                <div className="w-24 h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${completeness}%` }} />
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

                case 'global-location-intel':
                    appendContent('marketAnalysis', `**BW Intel Fact Sheet (${params.userCity || params.country || 'Target Location'}):**\n- Snapshot scope: demographics, infrastructure, utilities, logistics corridors, regulatory friction, incentives, FDI activity, labor availability, education pipeline, land availability, real estate cost, safety, governance transparency, digital connectivity, climate exposure.\n- Verification policy: official government and primary statistical sources only; validate against latest releases before use.`);
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

    const proactiveBriefing = reportData.computedIntelligence?.proactiveBriefing;

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
            <div className="p-5 border-b border-stone-200 bg-gradient-to-r from-stone-50 to-amber-50">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-stone-600 font-bold">Report Builder</div>
                        <div className="mt-2 text-sm font-semibold text-stone-900">
                            {params.organizationName?.trim() ? params.organizationName : 'New Report'}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-amber-600">{completeness}%</div>
                        <div className="mt-1 w-16 h-2 bg-amber-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${completeness}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-5 space-y-4">
                    {/* Contextual AI Assistant (shows when a step is active) */}
                    {activeModal && onChangeViewMode && (
                        <ContextualAIAssistant
                            activeStep={activeModal}
                            onLaunchFeature={(featureId) => {
                                setActiveModal(null);
                                onChangeViewMode(featureId);
                            }}
                            organizationName={params.organizationName}
                            country={params.country}
                            city={params.userCity}
                        />
                    )}

                    {/* BW Consultant AI — moved here from right sidebar to give live report more space */}
                    <div className="bg-white border border-indigo-200 rounded-lg overflow-hidden flex flex-col">
                        {/* Consultant Header */}
                        <div className="px-3 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Cpu size={12} className="text-white" />
                                        {agentThinking && (
                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold tracking-wider uppercase text-white">BW Consultant</span>
                                        <span className="text-[10px] ml-1 px-1 py-0.5 bg-white/20 text-white/90 rounded uppercase font-semibold">AI</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {isSpeaking && <button onClick={stopSpeaking} className="p-1 rounded bg-red-400/30 text-white"><Square size={8} /></button>}
                                    <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-1 rounded ${voiceEnabled ? 'bg-emerald-400/30 text-white' : 'bg-white/10 text-white/60'}`}>
                                        {voiceEnabled ? <Volume2 size={10} /> : <VolumeX size={10} />}
                                    </button>
                                </div>
                            </div>
                            <p className="text-[9px] text-white/70 mt-1">Research any location, company, or entity · Strategic advice · Proactive intelligence</p>
                        </div>

                        {/* Step Indicator */}
                        <div className="px-3 py-1.5 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {activeModal ? (
                                    <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider">
                                        Step: {activeModal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-slate-500">Select a step to begin</span>
                                )}
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="max-h-[280px] overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
                            {chatMessages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[92%] px-2.5 py-1.5 rounded-xl text-[11px] whitespace-pre-wrap leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gradient-to-br from-slate-50 to-indigo-50 text-stone-800 border border-indigo-100 rounded-bl-sm'}`}>
                                        {msg.text}
                                        {msg.action?.type === 'open-gli' && (
                                            <button
                                                onClick={handleOpenGlobalLocationReport}
                                                className="mt-2 w-full px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider bg-amber-500 text-black rounded-md hover:bg-amber-400"
                                            >
                                                {msg.action.label}
                                            </button>
                                        )}
                                        {msg.action?.type === 'open-docs' && (
                                            <button
                                                onClick={() => setShowDocGenSuite(true)}
                                                className="mt-2 w-full px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider bg-blue-600 text-white rounded-md hover:bg-blue-500"
                                            >
                                                {msg.action.label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {agentThinking && (
                                <div className="flex justify-start">
                                    <div className="px-2.5 py-1.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-[11px] text-amber-700 flex items-center gap-2 rounded-bl-sm">
                                        <Cpu size={10} className="animate-spin" />
                                        <span>Researching & analyzing...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatMessagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-slate-200 px-2.5 py-2 bg-white">
                            <div className="flex items-center gap-1.5">
                                <input 
                                    type="text" 
                                    data-testid="consultant-chat-input" 
                                    value={chatInput} 
                                    onChange={(e) => setChatInput(e.target.value)} 
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); }}} 
                                    placeholder="Research a location, company, or ask anything..." 
                                    className="flex-1 text-[11px] border border-indigo-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" 
                                />
                                <button 
                                    data-testid="consultant-chat-send" 
                                    onClick={handleSendMessage} 
                                    disabled={agentThinking}
                                    className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={12} />
                                </button>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-1 text-center">Try: "Tell me about Manila, Philippines" or "What are the risks in Southeast Asia?"</p>
                        </div>
                    </div>

                    {/* Preferred Guidance Level */}
                    <div className="bg-white border border-stone-200 rounded-lg p-3">
                        <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Preferred Guidance Level</div>
                        <p className="text-[11px] text-stone-600 mb-2">Choose how much hand-holding vs. autonomy you want from the platform. This sets how each step prompts you and what depth the system expects.</p>
                        <div className="grid grid-cols-1 gap-2">
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
                        <div className="mt-2 text-[11px] text-stone-600">
                            The system keeps the 10 critical steps intact, but adapts the depth and guidance so every user reaches the same standard.
                        </div>
                    </div>

                    {/* Global Location Intelligence */}
                    {/* STRATEGIC INTAKE WIZARD: 10 Sections */}
                    <div>
                        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Strategic Intake Wizard</h3>
                        <p className="text-[11px] text-stone-600 mb-3">Complete each section to build your comprehensive strategic analysis. Select multiple options in each step to capture the full scope of your needs. Guidance level above calibrates how deeply each step prompts you.</p>
                        <div className="space-y-2">
                            {[
                                {id: 'identity', label: '1. Identity', description: 'WHO you are: Organization profile, entity types, countries, industries, competitive position', icon: Building2},
                                {id: 'mandate', label: '2. Mandate', description: 'WHAT you want: Strategic objectives, KPIs, target outcomes, problem statement', icon: Target},
                                {id: 'market', label: '3. Market', description: 'WHERE you operate: Target markets, competitors, customers, regulatory landscape', icon: Globe},
                                {id: 'partner-personas', label: '4. Partners', description: 'WHO you need: Partner profiles, fit criteria, relationship goals, stakeholder alignment', icon: Users},
                                {id: 'financial', label: '5. Financial', description: 'HOW MUCH: Investment, funding, revenue projections, scenario modeling', icon: DollarSign},
                                {id: 'risks', label: '6. Risks', description: 'WHAT COULD GO WRONG: Risk register, mitigation strategies, contingency plans', icon: AlertCircle},
                                {id: 'capabilities', label: '7. Capabilities', description: 'WHAT YOU HAVE: Team strength, technology stack, capability gaps, development plans', icon: Cpu},
                                {id: 'execution', label: '8. Execution', description: 'HOW TO DO IT: Roadmap phases, milestones, dependencies, go/no-go criteria', icon: GitBranch},
                                {id: 'governance', label: '9. Governance', description: 'HOW TO MANAGE: Decision authority, KPIs, escalation paths, change management', icon: Scale},
                                {id: 'rate-liquidity', label: '10. Rate & Liquidity Stress', description: 'FINANCIAL RESILIENCE: Interest rate sensitivity, currency hedging, runway analysis', icon: Shield},
                            ].map((step, idx) => (
                                <button
                                    key={step.id}
                                    onClick={() => openModal(step.id)}
                                    className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                                        activeModal === step.id
                                            ? 'bg-amber-50 border-amber-200'
                                            : 'bg-white border-stone-200 hover:border-stone-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${activeModal === step.id ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'}`}>
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
                        {/* Dynamic AI Recommendations */}
                        <details className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <summary className="p-2 cursor-pointer flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Cpu size={12} className="text-blue-600" />
                                    <span className="text-xs font-semibold text-blue-900">System Thinking</span>
                                </div>
                            </summary>
                            <div className="px-3 pb-2 text-[11px] text-blue-800 space-y-1">
                                {completeness < 30 && <p>Start with Identity</p>}
                                {completeness >= 30 && completeness < 60 && <p>Add Financial data</p>}
                                {completeness >= 60 && <p>Great progress!</p>}
                            </div>
                        </details>
                    </div>

                    <div className="w-full h-px bg-stone-200"></div>

                    {/* DOCUMENT UPLOAD */}
                    <div>
                        <button
                            onClick={() => setShowDocumentUpload(true)}
                            className="w-full px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            <FileText size={14} />
                            Upload Documents
                        </button>
                        {(params.ingestedDocuments?.length || 0) > 0 && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                                {params.ingestedDocuments!.length} document{params.ingestedDocuments!.length > 1 ? 's' : ''} uploaded
                            </div>
                        )}
                    </div>

                    <div className="w-full h-px bg-stone-200"></div>

                    {/* ACTIONS - Compact */}
                    <div>
                        <div className="flex gap-2">
                            <button
                                onClick={onGenerate}
                                disabled={completeness < 50}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${completeness >= 50 ? 'bg-stone-700 text-white hover:bg-stone-800' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
                            >
                                <Zap size={14} />
                                Generate
                            </button>
                            <button
                                onClick={() => setShowDocGenSuite(true)}
                                disabled={!canLaunchDocSuite}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${canLaunchDocSuite ? 'border border-amber-300 text-amber-600 hover:bg-amber-50' : 'border border-stone-200 text-stone-400 cursor-not-allowed'}`}
                            >
                                <Download size={14} />
                                Docs
                            </button>
                        </div>
                        {!canLaunchDocSuite && (
                            <p className="text-[10px] text-stone-500 mt-1">Set country, city, partner to unlock docs</p>
                        )}
                    </div>

                    <div className="w-full h-px bg-stone-200"></div>

                    {/* SUMMARY BLUEPRINT - Compact status bar */}
                    <details className="rounded-lg border border-stone-200 bg-white overflow-hidden">
                        <summary className="cursor-pointer px-3 py-2 flex items-center justify-between hover:bg-stone-50">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Blueprint</span>
                                <div className="flex gap-1">
                                    {summaryBlueprint.map(step => (
                                        <div key={step.id} className={`w-2 h-2 rounded-full ${step.complete ? 'bg-emerald-500' : step.id === 'draft' && !readinessForDraft ? 'bg-stone-300' : 'bg-amber-400'}`} title={step.label}></div>
                                    ))}
                                </div>
                                <span className="text-[10px] text-stone-500">{summaryBlueprint.filter(s => s.complete).length}/{summaryBlueprint.length}</span>
                            </div>
                            <span className="text-[10px] text-stone-400">expand</span>
                        </summary>
                        <div className="p-2 border-t border-stone-100 space-y-2 bg-stone-50">
                            {summaryBlueprint.map(step => {
                                const isLocked = step.id === 'draft' && !readinessForDraft;
                                return (
                                    <button key={step.id} onClick={step.onClick} disabled={Boolean((step as any).disabled)} className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-[11px] ${step.complete ? 'bg-emerald-50 text-emerald-800' : isLocked ? 'bg-stone-100 text-stone-400' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'}`}>
                                        <span>{step.label}</span>
                                        <span className="text-[9px] font-bold uppercase">{step.complete ? '✓' : isLocked ? 'Locked' : 'Next'}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </details>

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
                                            { id: 'global-location-intel', label: 'GLI Brief', icon: MapPin },
                                        ].map(option => (
                                            <label key={option.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer text-xs transition-all ${selectedIntelligenceEnhancements.includes(option.id) ? 'bg-amber-50 border border-amber-200' : 'hover:bg-stone-50'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIntelligenceEnhancements.includes(option.id)}
                                                    onChange={() => handleIntelligenceEnhancementToggle(option.id)}
                                                    className="h-3 w-3 text-amber-600"
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

                    {/* BRAIN INTELLIGENCE - Compact live alerts, only shown when there's content */}
                    {(brainObservation.isThinking || brainObservation.globalSignals.length > 0 || brainObservation.suggestions.length > 0 || brainObservation.scores.composite !== null) && (
                        <>
                            <div className="w-full h-px bg-stone-200"></div>
                            <details className="rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden" open>
                                <summary className="cursor-pointer px-3 py-2 flex items-center justify-between hover:bg-indigo-100/50">
                                    <div className="flex items-center gap-2">
                                        {brainObservation.isThinking && <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>}
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-700">Brain</span>
                                        {brainObservation.scores.composite !== null && (
                                            <span className="text-xs font-bold text-amber-600">{Math.round(brainObservation.scores.composite)}%</span>
                                        )}
                                        {brainObservation.globalSignals.length > 0 && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-200 text-indigo-800">{brainObservation.globalSignals.length} alerts</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-indigo-400">details</span>
                                </summary>
                                <div className="p-2 border-t border-indigo-100 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {/* Compact Scores Row */}
                                    {(brainObservation.scores.spi !== null || brainObservation.scores.rroi !== null) && (
                                        <div className="flex gap-2 text-[10px]">
                                            {brainObservation.scores.spi !== null && <span className="px-2 py-0.5 bg-white rounded border">SPI: <b className="text-indigo-700">{Math.round(brainObservation.scores.spi)}</b></span>}
                                            {brainObservation.scores.rroi !== null && <span className="px-2 py-0.5 bg-white rounded border">RROI: <b className="text-emerald-700">{Math.round(brainObservation.scores.rroi)}</b></span>}
                                            {brainObservation.scores.seam !== null && <span className="px-2 py-0.5 bg-white rounded border">SEAM: <b className="text-purple-700">{Math.round(brainObservation.scores.seam)}</b></span>}
                                        </div>
                                    )}
                                    {/* Suggestions as single lines */}
                                    {brainObservation.suggestions.map((s, i) => (
                                        <div key={i} className="text-[11px] text-emerald-800 flex items-center gap-1"><span className="text-emerald-500">→</span> {s}</div>
                                    ))}
                                    {/* Signals as compact alerts */}
                                    {brainObservation.globalSignals.slice(0, 4).map((signal, i) => (
                                        <div key={i} className={`text-[11px] px-2 py-1 rounded flex items-start gap-2 ${signal.severity === 'critical' ? 'bg-rose-100 text-rose-800' : signal.severity === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-white text-stone-700'}`}>
                                            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${signal.severity === 'critical' ? 'bg-rose-500' : signal.severity === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'}`}></span>
                                            <span><b>{signal.title}</b> — {signal.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        </>
                    )}

                    {/* Legacy autonomous mode - kept for backward compatibility */}
                    {autonomousMode && insights.filter(i => i.isAutonomous).length > 0 && (
                        <>
                            <div className="w-full h-px bg-stone-200"></div>
                            <div>
                                <div className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wide mb-2">Additional Insights</div>
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
        {activeModal && (
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
                onClick={() => setActiveModal(null)}
            >
                <div
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
                                        description="Tell us who you are—legal name, address, and entity type. This information anchors all analysis."
                                        isExpanded={!!expandedSubsections['identity-entity']}
                                        onToggle={() => toggleSubsection('identity-entity')}
                                        color="from-indigo-50 to-blue-100"
                                     >
                                        <div className="space-y-4">
                                            {/* Organization Name */}
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Organization Name <span className="text-red-500">*</span></label>
                                                <p className="text-[10px] text-stone-500 mb-1.5">Full legal name as registered (e.g., "Acme Holdings Pty Ltd" not "Acme")</p>
                                                <input
                                                    type="text"
                                                    value={params.organizationName}
                                                    onChange={(e) => setParams({ ...params, organizationName: e.target.value })}
                                                    className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent ${isFieldInvalid('organizationName') ? 'border-red-500' : 'border-stone-200'}`}
                                                    placeholder="e.g., Philippine National Oil Company, Vestas Wind Systems A/S"
                                                />
                                            </div>
                                            
                                            {/* Registered Address */}
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Registered Address <span className="text-red-500">*</span></label>
                                                <p className="text-[10px] text-stone-500 mb-1.5">Official business address for legal correspondence</p>
                                                <textarea
                                                    value={params.organizationAddress || ''}
                                                    onChange={(e) => setParams({ ...params, organizationAddress: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-16"
                                                    placeholder="e.g., 123 Energy Park Drive, Suite 400, Manila 1000, Philippines"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* Legal Entity Type */}
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Legal Entity Type(s) <span className="text-red-500">*</span> <span className="text-stone-400 font-normal">(select all that apply)</span></label>
                                                    <p className="text-[10px] text-stone-500 mb-1.5">How is your organization legally structured? Select one or more.</p>
                                                    <div className="max-h-48 overflow-y-auto border border-stone-200 rounded p-2 bg-white">
                                                        {Object.entries(ENTITY_TYPES.reduce((acc: any, item) => {
                                                            if (!acc[item.category]) acc[item.category] = [];
                                                            acc[item.category].push(item);
                                                            return acc;
                                                        }, {})).map(([category, items]: any) => (
                                                            <div key={category} className="mb-2">
                                                                <div className="text-[10px] font-semibold text-stone-500 uppercase mb-1">{category}</div>
                                                                {items.map((item: any) => {
                                                                    const currentTypes = params.organizationTypes || (params.organizationType ? [params.organizationType] : []);
                                                                    const isSelected = currentTypes.includes(item.value);
                                                                    return (
                                                                        <label key={item.value} className="flex items-center gap-2 p-1 hover:bg-stone-50 cursor-pointer">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isSelected}
                                                                                onChange={() => {
                                                                                    const newTypes = isSelected
                                                                                        ? currentTypes.filter(t => t !== item.value)
                                                                                        : [...currentTypes, item.value];
                                                                                    setParams({ 
                                                                                        ...params, 
                                                                                        organizationTypes: newTypes,
                                                                                        organizationType: newTypes[0] || '' // Keep primary for backward compat
                                                                                    });
                                                                                }}
                                                                                className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                                            />
                                                                            <span className="text-sm">{item.label}</span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {(params.organizationTypes?.length || 0) > 0 && (
                                                        <div className="mt-1 text-[10px] text-amber-700">Selected: {params.organizationTypes?.join(', ')}</div>
                                                    )}
                                                    <div className="mt-2 flex gap-1">
                                                        <input type="text" placeholder="Not listed? Type and press Enter..." className="flex-1 text-xs p-1 border border-dashed border-stone-300 rounded" onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { const val = (e.target as HTMLInputElement).value.trim(); const curr = params.organizationTypes || []; if (!curr.includes(val)) setParams({...params, organizationTypes: [...curr, val], organizationType: curr[0] || val}); (e.target as HTMLInputElement).value = ''; }}} />
                                                        <span className="text-[9px] text-stone-400 self-center">↵</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* Country of Registration */}
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Country of Registration <span className="text-red-500">*</span> <span className="text-stone-400 font-normal">(select all jurisdictions)</span></label>
                                                    <p className="text-[10px] text-stone-500 mb-1.5">Where is your entity legally incorporated or registered?</p>
                                                    <div className="max-h-48 overflow-y-auto border border-stone-200 rounded p-2 bg-white">
                                                        {Object.entries(COUNTRIES.reduce((acc: any, item) => {
                                                            if (!acc[item.region]) acc[item.region] = [];
                                                            acc[item.region].push(item);
                                                            return acc;
                                                        }, {})).map(([region, items]: any) => (
                                                            <div key={region} className="mb-2">
                                                                <div className="text-[10px] font-semibold text-stone-500 uppercase mb-1">{region}</div>
                                                                {items.map((item: any) => {
                                                                    const currentCountries = params.countries || (params.country ? [params.country] : []);
                                                                    const isSelected = currentCountries.includes(item.value);
                                                                    return (
                                                                        <label key={item.value} className="flex items-center gap-2 p-1 hover:bg-stone-50 cursor-pointer">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isSelected}
                                                                                onChange={() => {
                                                                                    const newCountries = isSelected
                                                                                        ? currentCountries.filter(c => c !== item.value)
                                                                                        : [...currentCountries, item.value];
                                                                                    setParams({ 
                                                                                        ...params, 
                                                                                        countries: newCountries,
                                                                                        country: newCountries[0] || '' // Keep primary for backward compat
                                                                                    });
                                                                                }}
                                                                                className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                                            />
                                                                            <span className="text-sm">{item.label}</span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {(params.countries?.length || 0) > 0 && (
                                                        <div className="mt-1 text-[10px] text-amber-700">Selected: {params.countries?.join(', ')}</div>
                                                    )}
                                                    <div className="mt-2 flex gap-1">
                                                        <input type="text" placeholder="Add custom country..." className="flex-1 text-xs p-1 border border-dashed border-stone-300 rounded" onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { const val = (e.target as HTMLInputElement).value.trim(); const curr = params.countries || []; if (!curr.includes(val)) setParams({...params, countries: [...curr, val], country: curr[0] || val}); (e.target as HTMLInputElement).value = ''; }}} />
                                                        <span className="text-[9px] text-stone-400 self-center">↵</span>
                                                    </div>
                                                </div>
                                                {/* Operating Regions */}
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Operating Regions / Markets</label>
                                                    <p className="text-[10px] text-stone-500 mb-1.5">Where do you actively conduct business? (separate with commas)</p>
                                                    <input
                                                        type="text"
                                                        value={params.region || ''}
                                                        onChange={(e) => setParams({ ...params, region: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                        placeholder="e.g., Greater Manila, Visayas, ASEAN, North America"
                                                    />
                                                </div>
                                            </div>

                                            {/* Entity Classification */}
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Entity Ownership / Classification <span className="text-red-500">*</span></label>
                                                <p className="text-[10px] text-stone-500 mb-2">Who ultimately owns or controls this entity? This shapes which regulatory precedents and deal structures apply.</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    {ENTITY_CLASSIFICATIONS.map(option => {
                                                        const isActive = params.entityClassification === option.value;
                                                        return (
                                                            <button
                                                                key={option.value}
                                                                type="button"
                                                                onClick={() => setParams({ ...params, entityClassification: option.value })}
                                                                className={`w-full border rounded-lg px-3 py-2 text-left text-sm transition ${isActive ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm' : 'border-stone-200 hover:border-amber-200 hover:bg-stone-50'}`}
                                                            >
                                                                <div className="font-semibold">{option.label}</div>
                                                                <p className="text-[11px] text-stone-500 leading-snug">{option.description}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Parent Organization */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Parent Ministry / Holding Company</label>
                                                    <p className="text-[10px] text-stone-500 mb-1.5">If you report to a government ministry or parent company, name it here</p>
                                                    <input
                                                        type="text"
                                                        value={params.parentAgency || ''}
                                                        onChange={(e) => setParams({ ...params, parentAgency: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                        placeholder="e.g., Department of Energy, PNOC Holdings Inc."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Operating Unit / Department</label>
                                                    <p className="text-[10px] text-stone-500 mb-1.5">Which division or team is driving this initiative?</p>
                                                    <input
                                                        type="text"
                                                        value={params.operatingUnit || ''}
                                                        onChange={(e) => setParams({ ...params, operatingUnit: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                        placeholder="e.g., Strategic Partnerships Division, Infrastructure Delivery Office"
                                                    />
                                                </div>
                                            </div>

                                            {/* Mission Request */}
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">What are you asking Nexus AI to help with? <span className="text-red-500">*</span></label>
                                                <p className="text-[10px] text-stone-500 mb-1.5">Describe your objective in plain language—no jargon required. What outcome do you need?</p>
                                                <textarea
                                                    value={params.missionRequestSummary || ''}
                                                    onChange={(e) => setParams({ ...params, missionRequestSummary: e.target.value })}
                                                    className="w-full p-3 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-24"
                                                    placeholder="e.g., Evaluate a wind farm JV with a Danish OEM for our Visayas expansion. Need board-ready analysis in 48 hours."
                                                />
                                            </div>

                                            {/* Experience Background */}
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Your Background / Experience Level</label>
                                                <p className="text-[10px] text-stone-500 mb-1.5">Help us calibrate the depth and tone of guidance. Are you new to this or a veteran?</p>
                                                <textarea
                                                    value={params.assistanceBackground || ''}
                                                    onChange={(e) => setParams({ ...params, assistanceBackground: e.target.value })}
                                                    className="w-full p-3 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-20"
                                                    placeholder="e.g., 15 years in energy sector, first time structuring a cross-border JV / New to PPP deals, need step-by-step guidance"
                                                />
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
                                                <div className="mt-2 flex gap-1">
                                                    <input type="text" placeholder="Add custom industry..." className="flex-1 text-xs p-1 border border-dashed border-stone-300 rounded" onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { const val = (e.target as HTMLInputElement).value.trim(); const curr = params.industry || []; if (!curr.includes(val)) setParams({...params, industry: [...curr, val]}); (e.target as HTMLInputElement).value = ''; }}} />
                                                    <span className="text-[9px] text-stone-400 self-center">↵</span>
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Primary Strategic Intent <span className="text-red-500">*</span></label>
                                                    <select
                                                        value={params.strategicIntent[0] || ''}
                                                        onChange={(e) => {
                                                            const primary = e.target.value;
                                                            const supporting = (params.strategicIntent || []).filter(i => i !== primary);
                                                            setParams({ ...params, strategicIntent: primary ? [primary, ...supporting] : supporting });
                                                        }}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                    >
                                                        <option value="">Select primary goal...</option>
                                                        {GLOBAL_STRATEGIC_INTENTS.map(intent => (
                                                            <option key={intent} value={intent}>{intent}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Scope / Level (multi-select)</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {INTENT_SCOPE_OPTIONS.map(scope => (
                                                            <label key={scope} className="flex items-center gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={(params.intentScope || []).includes(scope)}
                                                                    onChange={() => {
                                                                        const current = params.intentScope || [];
                                                                        const next = current.includes(scope) ? current.filter(s => s !== scope) : [...current, scope];
                                                                        setParams({ ...params, intentScope: next });
                                                                    }}
                                                                    className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                                />
                                                                <span className="text-xs text-stone-700">{scope}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Supporting Strategic Intents (global library, multi-select)</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-stone-200 rounded p-2">
                                                    {GLOBAL_STRATEGIC_INTENTS.map(intent => (
                                                        <label key={intent} className="flex items-start gap-2 p-2 rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={params.strategicIntent.includes(intent)}
                                                                onChange={() => {
                                                                    const exists = params.strategicIntent.includes(intent);
                                                                    const filtered = params.strategicIntent.filter(i => i !== intent);
                                                                    const next = exists ? filtered : [...params.strategicIntent, intent];
                                                                    const primary = params.strategicIntent[0];
                                                                    const normalized = primary && next.includes(primary)
                                                                        ? [primary, ...next.filter(i => i !== primary)]
                                                                        : next;
                                                                    setParams({ ...params, strategicIntent: Array.from(new Set(normalized)) });
                                                                }}
                                                                className="h-4 w-4 mt-0.5 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700 leading-snug">{intent}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Vision Narrative (long-term)</label>
                                                    <textarea
                                                        value={params.visionStatement || ''}
                                                        onChange={(e) => setParams({ ...params, visionStatement: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-20"
                                                        placeholder="e.g., Build a pan-regional logistics backbone that doubles trade velocity and lowers cost-to-serve"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Mission / Strategic Objective (3-5 years)</label>
                                                    <textarea
                                                        value={params.missionStatement || ''}
                                                        onChange={(e) => setParams({ ...params, missionStatement: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-20"
                                                        placeholder="e.g., Achieve $5B FDI, 150k jobs, and 35% domestic value-add across the target corridor"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Economic & Development Outcomes (multi-select)</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                    {DEVELOPMENT_OUTCOME_OPTIONS.map(outcome => (
                                                        <label key={outcome} className="flex items-start gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.developmentOutcomes || []).includes(outcome)}
                                                                onChange={() => {
                                                                    const current = params.developmentOutcomes || [];
                                                                    const next = current.includes(outcome) ? current.filter(o => o !== outcome) : [...current, outcome];
                                                                    setParams({ ...params, developmentOutcomes: next });
                                                                }}
                                                                className="h-4 w-4 mt-0.5 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700 leading-snug">{outcome}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Problem Statement <span className="text-red-500">*</span></label>
                                                <textarea value={params.problemStatement} onChange={(e) => setParams({ ...params, problemStatement: e.target.value })} className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-24 ${isFieldInvalid('problemStatement') ? 'border-red-500' : 'border-stone-200'}`} placeholder="Describe the core problem this strategy aims to solve."/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Specific Opportunity</label>
                                                <input
                                                    type="text"
                                                    value={params.specificOpportunity || ''}
                                                    onChange={(e) => setParams({ ...params, specificOpportunity: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                    placeholder="e.g., Solar mini-grid PPP in Kenya, EV charging network JV in Indonesia"
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="1.5 Risk Appetite & Tolerance Framework"
                                        description="Define your organization's risk appetite — how much uncertainty are you willing to accept?"
                                        isExpanded={!!expandedSubsections['risk-appetite']}
                                        onToggle={() => toggleSubsection('risk-appetite')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 mb-2">
                                                <strong>💡 Tip:</strong> Your risk tolerance affects partner matching, investment recommendations, and strategic options presented.
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-2">Risk Tolerance <span className="text-red-500">*</span></label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {[
                                                        { value: 'Very Low', desc: 'Capital preservation priority, minimal uncertainty' },
                                                        { value: 'Low', desc: 'Conservative approach, proven strategies only' },
                                                        { value: 'Medium', desc: 'Balanced approach, calculated risks acceptable' },
                                                        { value: 'High', desc: 'Growth-focused, significant risks acceptable' },
                                                        { value: 'Very High', desc: 'Aggressive strategy, high volatility acceptable' },
                                                        { value: 'Variable', desc: 'Depends on opportunity type and size' }
                                                    ].map(option => (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => setParams({ ...params, riskTolerance: option.value })}
                                                            className={`w-full text-left p-3 border rounded-lg transition ${params.riskTolerance === option.value ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400' : 'border-stone-200 hover:border-amber-200 hover:bg-stone-50'}`}
                                                        >
                                                            <div className="font-semibold text-sm text-stone-800">{option.value}</div>
                                                            <div className="text-xs text-stone-500">{option.desc}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Risk Appetite Statement (optional)</label>
                                                <textarea
                                                    value={params.riskAppetiteStatement || ''}
                                                    onChange={(e) => setParams({ ...params, riskAppetiteStatement: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="Describe your risk philosophy, e.g., 'We accept operational risks but avoid regulatory and reputational risks'"
                                                />
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
                                                        <option value="Family Office">Family Office</option>
                                                        <option value="Strategic Investor">Strategic Investor</option>
                                                    </optgroup>
                                                    <optgroup label="Debt">
                                                        <option value="Bank Debt">Bank Debt / Credit Facility</option>
                                                        <option value="Bonds / Debentures">Bonds / Debentures</option>
                                                        <option value="Project Finance">Project Finance</option>
                                                        <option value="Trade Finance">Trade Finance</option>
                                                    </optgroup>
                                                    <optgroup label="Public & Government">
                                                        <option value="Government Grants">Government Grants</option>
                                                        <option value="Development Finance">Development Finance Institution (DFI)</option>
                                                        <option value="Sovereign Wealth">Sovereign Wealth Fund</option>
                                                        <option value="Export Credit">Export Credit Agency</option>
                                                    </optgroup>
                                                    <optgroup label="Other">
                                                        <option value="Internal Capital">Internal Capital / Balance Sheet</option>
                                                        <option value="Joint Venture">Joint Venture Partner Contribution</option>
                                                        <option value="Mixed Sources">Mixed / Blended Finance</option>
                                                        <option value="Crowdfunding">Crowdfunding / Tokenization</option>
                                                    </optgroup>
                                                </select>
                                                <div className="mt-2 flex gap-1">
                                                    <input type="text" placeholder="Or enter custom source..." className="flex-1 text-xs p-1 border border-dashed border-stone-300 rounded" onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { setParams({...params, fundingSource: (e.target as HTMLInputElement).value.trim()}); (e.target as HTMLInputElement).value = ''; }}} />
                                                    <span className="text-[9px] text-stone-400 self-center">↵</span>
                                                </div>
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

                                    {/* INLINE BRAIN INTELLIGENCE FOR IDENTITY */}
                                    {brainObservation.stepIntelligence['identity'] && (
                                        <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Cpu size={16} className="text-indigo-600" />
                                                <h4 className="text-sm font-bold text-indigo-900">Brain Analysis</h4>
                                                {brainObservation.isThinking && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                )}
                                                <div className="ml-auto text-[10px] text-stone-500">
                                                    Step Completeness: {brainObservation.stepIntelligence['identity'].completeness}%
                                                </div>
                                            </div>

                                            {/* Historical Match */}
                                            {brainObservation.stepIntelligence['identity'].historicalMatch && (
                                                <div className="mb-3 p-3 bg-white rounded-lg border border-indigo-100">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <History size={14} className="text-indigo-500" />
                                                        <span className="text-xs font-semibold text-indigo-800">Historical Pattern Match</span>
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                                                            {Math.round(brainObservation.stepIntelligence['identity'].historicalMatch.relevance)}% match
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-stone-600">
                                                        <span className="font-medium">{brainObservation.stepIntelligence['identity'].historicalMatch.era}:</span>{' '}
                                                        {brainObservation.stepIntelligence['identity'].historicalMatch.scenario}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Live Signals for this step */}
                                            {brainObservation.stepIntelligence['identity'].signals.length > 0 && (
                                                <div className="space-y-2 mb-3">
                                                    {brainObservation.stepIntelligence['identity'].signals.slice(0, 3).map((signal, idx) => (
                                                        <div key={idx} className={`p-2 rounded-lg border text-xs ${
                                                            signal.severity === 'success' ? 'bg-emerald-50 border-emerald-200' :
                                                            signal.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                                                            'bg-white border-indigo-100'
                                                        }`}>
                                                            <div className="flex items-start gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                                                    signal.severity === 'success' ? 'bg-emerald-500' :
                                                                    signal.severity === 'warning' ? 'bg-amber-500' :
                                                                    'bg-indigo-500'
                                                                }`}></div>
                                                                <div>
                                                                    <div className="font-semibold text-stone-800">{signal.title}</div>
                                                                    <div className="text-stone-600 mt-0.5">{signal.description}</div>
                                                                    {signal.actionable && (
                                                                        <div className="text-blue-600 font-medium mt-1">→ {signal.actionable}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Next Steps */}
                                            <div className="p-2 bg-white rounded border border-indigo-100">
                                                <div className="text-[10px] font-semibold text-indigo-700 uppercase mb-1">Recommendations</div>
                                                <ul className="text-xs text-stone-600 space-y-1">
                                                    {brainObservation.stepIntelligence['identity'].recommendations.map((rec, idx) => (
                                                        <li key={idx} className="flex items-start gap-1.5">
                                                            <span className="text-indigo-500 shrink-0">•</span>
                                                            <span>{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
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
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Strategic Objectives (global library, multi-select) <span className="text-red-500">*</span></label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto border border-stone-200 rounded p-2">
                                                    {GLOBAL_STRATEGIC_INTENTS.map(obj => (
                                                        <label key={obj} className="flex items-start gap-2 p-2 rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.strategicObjectives || []).includes(obj)}
                                                                onChange={() => {
                                                                    const current = params.strategicObjectives || [];
                                                                    const next = current.includes(obj) ? current.filter(o => o !== obj) : [...current, obj];
                                                                    setParams({ ...params, strategicObjectives: next });
                                                                }}
                                                                className="h-4 w-4 mt-0.5 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700 leading-snug">{obj}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <div className="mt-2 flex gap-1">
                                                    <input type="text" placeholder="Add custom objective..." className="flex-1 text-xs p-1 border border-dashed border-stone-300 rounded" onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { const val = (e.target as HTMLInputElement).value.trim(); const curr = params.strategicObjectives || []; if (!curr.includes(val)) setParams({...params, strategicObjectives: [...curr, val]}); (e.target as HTMLInputElement).value = ''; }}} />
                                                    <span className="text-[9px] text-stone-400 self-center">↵</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Scope / Level (for objectives)</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {INTENT_SCOPE_OPTIONS.map(scope => (
                                                            <label key={scope} className="flex items-center gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={(params.intentScope || []).includes(scope)}
                                                                    onChange={() => {
                                                                        const current = params.intentScope || [];
                                                                        const next = current.includes(scope) ? current.filter(s => s !== scope) : [...current, scope];
                                                                        setParams({ ...params, intentScope: next });
                                                                    }}
                                                                    className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                                />
                                                                <span className="text-xs text-stone-700">{scope}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Economic & Development Outcomes</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {DEVELOPMENT_OUTCOME_OPTIONS.map(outcome => (
                                                            <label key={outcome} className="flex items-center gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={(params.developmentOutcomes || []).includes(outcome)}
                                                                    onChange={() => {
                                                                        const current = params.developmentOutcomes || [];
                                                                        const next = current.includes(outcome) ? current.filter(o => o !== outcome) : [...current, outcome];
                                                                        setParams({ ...params, developmentOutcomes: next });
                                                                    }}
                                                                    className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                                />
                                                                <span className="text-xs text-stone-700">{outcome}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-1">
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
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Target Counterpart Type (global catalog)</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto border border-stone-200 rounded p-2">
                                                    {GLOBAL_COUNTERPART_TYPES.map(ct => (
                                                        <label key={ct} className="flex items-start gap-2 p-2 rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.targetCounterpartType || []).includes(ct)}
                                                                onChange={() => {
                                                                    const current = params.targetCounterpartType || [];
                                                                    const next = current.includes(ct) ? current.filter(c => c !== ct) : [...current, ct];
                                                                    setParams({ ...params, targetCounterpartType: next });
                                                                }}
                                                                className="h-4 w-4 mt-0.5 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700 leading-snug">{ct}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={params.corridorFocus || ''}
                                                    onChange={(e) => setParams({ ...params, corridorFocus: e.target.value })}
                                                    className="mt-2 w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                    placeholder="Optional: corridor / zone focus (e.g., ASEAN corridor, SEZ name)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Partner Capabilities Sought (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    value={(params.partnerCapabilities || []).join(', ')}
                                                    onChange={(e) => setParams({ ...params, partnerCapabilities: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                    placeholder="e.g., Manufacturing, Distribution, Technology, Capital"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Partnership Support Needs (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    value={(params.partnershipSupportNeeds || []).join(', ')}
                                                    onChange={(e) => setParams({ ...params, partnershipSupportNeeds: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                    placeholder="e.g., Legal structuring, Due diligence, Integration support, Change management"
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
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Priority Themes</label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-stone-200 rounded p-3">
                                                    {PRIORITY_THEMES.map(theme => (
                                                        <label key={theme} className="flex items-center gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.priorityThemes || []).includes(theme)}
                                                                onChange={() => {
                                                                    const current = params.priorityThemes || [];
                                                                    const next = current.includes(theme) ? current.filter(t => t !== theme) : [...current, theme];
                                                                    setParams({ ...params, priorityThemes: next });
                                                                }}
                                                                className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700">{theme}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Strategic Lenses</label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    {STRATEGIC_LENSES.map(lens => (
                                                        <label key={lens.id} className="flex items-start gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.strategicLens || []).includes(lens.id)}
                                                                onChange={() => {
                                                                    const current = params.strategicLens || [];
                                                                    const next = current.includes(lens.id) ? current.filter(l => l !== lens.id) : [...current, lens.id];
                                                                    setParams({ ...params, strategicLens: next });
                                                                }}
                                                                className="h-4 w-4 mt-0.5 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <div>
                                                                <span className="text-xs font-semibold text-stone-800">{lens.label}</span>
                                                                <p className="text-[10px] text-stone-500">{lens.desc}</p>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Target Incentives Sought</label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-stone-200 rounded p-3">
                                                    {TARGET_INCENTIVES.map(incentive => (
                                                        <label key={incentive} className="flex items-center gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.targetIncentives || []).includes(incentive)}
                                                                onChange={() => {
                                                                    const current = params.targetIncentives || [];
                                                                    const next = current.includes(incentive) ? current.filter(i => i !== incentive) : [...current, incentive];
                                                                    setParams({ ...params, targetIncentives: next });
                                                                }}
                                                                className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700">{incentive}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
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
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Governance Model(s)</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                    {["Joint Venture (JV)", "Strategic Alliance", "Licensing", "Distribution", "Equity Investment", "Consortium", "PPP / Concession", "SPV / ProjectCo"].map(model => (
                                                        <label key={model} className="flex items-center gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.governanceModels || []).includes(model)}
                                                                onChange={() => {
                                                                    const current = (params as any).governanceModels || [];
                                                                    const next = current.includes(model) ? current.filter((m: string) => m !== model) : [...current, model];
                                                                    setParams({ ...params, governanceModels: next } as any);
                                                                }}
                                                                className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700">{model}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Decision Rights & Vetoes</label>
                                                    <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="Board seats, veto rights, reserved matters, quorum rules" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Operating Cadence & Escalation</label>
                                                    <textarea className="w-full p-2 border border-stone-200 rounded text-sm h-20" placeholder="Steering committee cadence, SLAs, escalation path, RACI" />
                                                </div>
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
                                                    {TIME_HORIZON_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Critical Path / Milestones</label>
                                                <textarea value={params.milestonePlan || ''} onChange={(e) => setParams({ ...params, milestonePlan: e.target.value })} className="w-full p-2 border border-stone-200 rounded text-sm h-20 focus:ring-1 focus:ring-amber-600 focus:border-transparent" placeholder="Gate reviews, pilot/soft launch, hard launch, stabilization"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Base Currency & FX Assumption</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <select value={params.currency || ''} onChange={(e) => setParams({ ...params, currency: e.target.value })} className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent">
                                                        <option value="">Select currency...</option>
                                                        {CURRENCY_OPTIONS.map(cur => (<option key={cur} value={cur}>{cur}</option>))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={params.fxAssumption || ''}
                                                        onChange={(e) => setParams({ ...params, fxAssumption: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent"
                                                        placeholder="e.g., USD base, ±5% fx swing"
                                                    />
                                                </div>
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
                                        description="Describe your ideal partners — who are they, what do they bring, and what do they need?"
                                        isExpanded={!!expandedSubsections['partner-personas-definition']}
                                        onToggle={() => toggleSubsection('partner-personas-definition')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="mb-3 p-2 bg-emerald-50 border border-emerald-100 rounded text-xs text-emerald-800">
                                            <strong>💡 Tip:</strong> Add multiple personas to cover different partnership types. Examples: "Technology partner with AI expertise", "Government agency for regulatory access", "Distribution partner in Southeast Asia"
                                        </div>
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
                                                <div className="mt-2 flex gap-1">
                                                    <input type="text" placeholder="Add custom group..." className="flex-1 text-xs p-1 border border-dashed border-stone-300 rounded" onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { const val = (e.target as HTMLInputElement).value.trim(); const curr = params.stakeholderAlignment || []; if (!curr.includes(val)) setParams({...params, stakeholderAlignment: [...curr, val]}); (e.target as HTMLInputElement).value = ''; }}} />
                                                    <span className="text-[9px] text-stone-400 self-center">↵</span>
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
                                        description="Define where you want to operate — select cities, regions, market sizes, and timeframes"
                                        isExpanded={!!expandedSubsections['market-target']}
                                        onToggle={() => toggleSubsection('market-target')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800">
                                            <strong>💡 Tip:</strong> Be as specific as possible about your target markets. Include primary and secondary cities, and estimate market sizes where known.
                                        </div>
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
                                                    <option value="0-6 Months">0-6 Months (Immediate)</option>
                                                    <option value="6-12 Months">6-12 Months (Short-term)</option>
                                                    <option value="1-Year">1 Year</option>
                                                    <option value="1-2 Years">1-2 Years (Medium-term)</option>
                                                    <option value="3-Year">3 Years</option>
                                                    <option value="3-5 Years">3-5 Years (Long-term)</option>
                                                    <option value="5-Year">5 Years</option>
                                                    <option value="5+ Years">5+ Years (Strategic)</option>
                                                    <option value="10+ Years">10+ Years (Generational)</option>
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
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Macro Factors (select all)</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                    {MACRO_FACTOR_OPTIONS.map(item => (
                                                        <label key={item} className="flex items-start gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.macroFactors || []).includes(item)}
                                                                onChange={() => {
                                                                    const current = params.macroFactors || [];
                                                                    const next = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
                                                                    setParams({ ...params, macroFactors: next });
                                                                }}
                                                                className="h-4 w-4 mt-0.5 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700 leading-snug">{item}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Regulatory Focus Areas</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                    {REGULATORY_FACTOR_OPTIONS.map(item => (
                                                        <label key={item} className="flex items-start gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.regulatoryFactors || []).includes(item)}
                                                                onChange={() => {
                                                                    const current = params.regulatoryFactors || [];
                                                                    const next = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
                                                                    setParams({ ...params, regulatoryFactors: next });
                                                                }}
                                                                className="h-4 w-4 mt-0.5 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700 leading-snug">{item}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Economic & Incentive Factors</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                    {ECONOMIC_FACTOR_OPTIONS.map(item => (
                                                        <label key={item} className="flex items-start gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.economicFactors || []).includes(item)}
                                                                onChange={() => {
                                                                    const current = params.economicFactors || [];
                                                                    const next = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
                                                                    setParams({ ...params, economicFactors: next });
                                                                }}
                                                                className="h-4 w-4 mt-0.5 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700 leading-snug">{item}</span>
                                                        </label>
                                                    ))}
                                                </div>
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
                                                <textarea
                                                    value={params.riskPrimaryConcerns || ''}
                                                    onChange={(e) => setParams({ ...params, riskPrimaryConcerns: e.target.value })}
                                                    className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-amber-600 focus:border-transparent h-24 ${isFieldInvalid('riskTolerance') ? 'border-red-500' : 'border-stone-200'}`}
                                                    placeholder="List main risks: financial, operational, reputational, geopolitical, etc."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Risk Appetite Statement</label>
                                                <textarea
                                                    value={params.riskAppetiteStatement || ''}
                                                    onChange={(e) => setParams({ ...params, riskAppetiteStatement: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="Describe your organization's overall risk appetite: Conservative, Moderate, Aggressive. What risks are acceptable? Which are zero-tolerance?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Political Sensitivities</label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-stone-200 rounded p-3">
                                                    {POLITICAL_SENSITIVITIES.map(sens => (
                                                        <label key={sens} className="flex items-center gap-2 p-2 border rounded hover:bg-stone-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={(params.politicalSensitivities || []).includes(sens)}
                                                                onChange={() => {
                                                                    const current = params.politicalSensitivities || [];
                                                                    const next = current.includes(sens) ? current.filter(s => s !== sens) : [...current, sens];
                                                                    setParams({ ...params, politicalSensitivities: next });
                                                                }}
                                                                className="h-4 w-4 text-indigo-800 focus:ring-amber-600"
                                                            />
                                                            <span className="text-xs text-stone-700">{sens}</span>
                                                        </label>
                                                    ))}
                                                </div>
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
                                                <textarea
                                                    value={params.riskMitigationSummary || ''}
                                                    onChange={(e) => setParams({ ...params, riskMitigationSummary: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-24"
                                                    placeholder="For each risk identified, what is the plan to reduce its likelihood or impact?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Contingency Plans</label>
                                                <textarea
                                                    value={params.contingencyPlans || ''}
                                                    onChange={(e) => setParams({ ...params, contingencyPlans: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-24"
                                                    placeholder="What are the backup plans if a major risk materializes? What are the exit triggers?"
                                                />
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
                                                <textarea
                                                    value={params.riskKriNotes || ''}
                                                    onChange={(e) => setParams({ ...params, riskKriNotes: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-24"
                                                    placeholder="What specific metrics will be tracked to monitor risk levels? (e.g., currency fluctuation %, partner dependency ratio)"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Reporting Frequency</label>
                                                    <select
                                                        value={params.riskReportingCadence || ''}
                                                        onChange={(e) => setParams({ ...params, riskReportingCadence: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    >
                                                        <option value="">Select cadence...</option>
                                                        <option value="Weekly">Weekly</option>
                                                        <option value="Monthly">Monthly</option>
                                                        <option value="Quarterly">Quarterly</option>
                                                        <option value="Semi-Annual">Semi-Annual</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Risk Horizon</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Short-term (0-6mo)', 'Medium (6-18mo)', 'Long-term (18mo+)', 'Tail risk'].map(h => (
                                                            <label key={h} className="flex items-center gap-1 text-xs bg-stone-50 px-2 py-1 rounded border cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={(params.riskHorizon || []).includes(h)}
                                                                    onChange={() => {
                                                                        const current = params.riskHorizon || [];
                                                                        const next = current.includes(h) ? current.filter(x => x !== h) : [...current, h];
                                                                        setParams({ ...params, riskHorizon: next });
                                                                    }}
                                                                    className="h-3 w-3 text-indigo-800"
                                                                />
                                                                <span>{h}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Risk Owners (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    value={(params.riskOwners || []).join(', ')}
                                                    onChange={(e) => setParams({ ...params, riskOwners: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., CFO, Head of Legal, Risk Committee"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Risk Monitoring Process</label>
                                                <textarea
                                                    value={params.riskMonitoringProcess || ''}
                                                    onChange={(e) => setParams({ ...params, riskMonitoringProcess: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="Describe the ongoing risk monitoring process, escalation procedures, and governance structure"
                                                />
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
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Total Investment Required</label>
                                                    <input
                                                        type="text"
                                                        value={params.totalInvestment || ''}
                                                        onChange={(e) => setParams({ ...params, totalInvestment: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 5,000,000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Currency</label>
                                                    <select
                                                        value={params.currency || ''}
                                                        onChange={(e) => setParams({ ...params, currency: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    >
                                                        <option value="">Select currency...</option>
                                                        {CURRENCY_OPTIONS.map(cur => (
                                                            <option key={cur} value={cur}>{cur}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Funding Source</label>
                                                    <select
                                                        value={params.fundingSource || ''}
                                                        onChange={(e) => setParams({ ...params, fundingSource: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    >
                                                        <option value="">Select funding source...</option>
                                                        <option value="Own Capital">Own Capital</option>
                                                        <option value="Partner Capital">Partner Capital</option>
                                                        <option value="External Debt">External Debt</option>
                                                        <option value="Equity Investment">Equity Investment</option>
                                                        <option value="Mixed Sources">Mixed Sources</option>
                                                        <option value="Sovereign Wealth">Sovereign Wealth</option>
                                                        <option value="Government Grant">Government Grant</option>
                                                        <option value="Venture Capital">Venture Capital</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Procurement Mode</label>
                                                    <select
                                                        value={params.procurementMode || ''}
                                                        onChange={(e) => setParams({ ...params, procurementMode: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    >
                                                        <option value="">Select procurement mode...</option>
                                                        <option value="Competitive Bidding">Competitive Bidding</option>
                                                        <option value="Direct Negotiation">Direct Negotiation</option>
                                                        <option value="Sole Source">Sole Source</option>
                                                        <option value="Public-Private Partnership (PPP)">Public-Private Partnership (PPP)</option>
                                                        <option value="G2G Framework">G2G Framework</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Deal Size (Transaction Value)</label>
                                                    <input
                                                        type="text"
                                                        value={params.dealSize || ''}
                                                        onChange={(e) => setParams({ ...params, dealSize: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 50,000,000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">FX Assumption / Hedging</label>
                                                    <input
                                                        type="text"
                                                        value={params.fxAssumption || ''}
                                                        onChange={(e) => setParams({ ...params, fxAssumption: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., USD/MXN 18.5, hedged at 70%"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Capital Allocation Breakdown</label>
                                                <textarea
                                                    value={params.capitalAllocation || ''}
                                                    onChange={(e) => setParams({ ...params, capitalAllocation: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="e.g., Technology: 40%, Operations: 35%, Marketing: 15%, Contingency: 10%"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Cash Flow Timing (Monthly/Quarterly)</label>
                                                <textarea
                                                    value={params.cashFlowTiming || ''}
                                                    onChange={(e) => setParams({ ...params, cashFlowTiming: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="When will capital be deployed? e.g., Month 1-3: $1M setup, Month 4-12: $2M operations"
                                                />
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
                                                <textarea
                                                    value={params.revenueStreams || ''}
                                                    onChange={(e) => setParams({ ...params, revenueStreams: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="e.g., Licensing fees, Transaction commissions, Subscription model, Equity upside"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 1 Revenue ({params.currency || 'currency'})</label>
                                                    <input
                                                        type="text"
                                                        value={params.revenueYear1 || ''}
                                                        onChange={(e) => setParams({ ...params, revenueYear1: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 1,000,000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 3 Revenue ({params.currency || 'currency'})</label>
                                                    <input
                                                        type="text"
                                                        value={params.revenueYear3 || ''}
                                                        onChange={(e) => setParams({ ...params, revenueYear3: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 3,500,000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 5 Revenue ({params.currency || 'currency'})</label>
                                                    <input
                                                        type="text"
                                                        value={params.revenueYear5 || ''}
                                                        onChange={(e) => setParams({ ...params, revenueYear5: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 7,000,000"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Unit Economics (if applicable)</label>
                                                <textarea
                                                    value={params.unitEconomics || ''}
                                                    onChange={(e) => setParams({ ...params, unitEconomics: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="e.g., Average transaction value: $50k, Commission rate: 3%, Expected volume: 500 transactions/year"
                                                />
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
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 1 COGS ({params.currency || 'currency'})</label>
                                                    <input
                                                        type="text"
                                                        value={params.cogsYear1 || ''}
                                                        onChange={(e) => setParams({ ...params, cogsYear1: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 400,000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Year 1 OpEx ({params.currency || 'currency'})</label>
                                                    <input
                                                        type="text"
                                                        value={params.opexYear1 || ''}
                                                        onChange={(e) => setParams({ ...params, opexYear1: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 300,000"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Cost Breakdown</label>
                                                <textarea
                                                    value={params.costBreakdown || ''}
                                                    onChange={(e) => setParams({ ...params, costBreakdown: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="e.g., Salaries: 40%, Tech/Infrastructure: 25%, Marketing: 20%, G&A: 15%"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Headcount Plan</label>
                                                <textarea
                                                    value={params.headcountPlan || ''}
                                                    onChange={(e) => setParams({ ...params, headcountPlan: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="e.g., Year 1: 10 staff ($300k), Year 2: 15 staff ($450k), Year 3: 20 staff ($650k)"
                                                />
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
                                                    <input
                                                        type="text"
                                                        value={params.ebitdaMarginYear1 || ''}
                                                        onChange={(e) => setParams({ ...params, ebitdaMarginYear1: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., -30%"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Break-Even Year</label>
                                                    <input
                                                        type="text"
                                                        value={params.breakEvenYear || ''}
                                                        onChange={(e) => setParams({ ...params, breakEvenYear: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., Year 2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Target Exit Multiple</label>
                                                    <input
                                                        type="text"
                                                        value={params.targetExitMultiple || ''}
                                                        onChange={(e) => setParams({ ...params, targetExitMultiple: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 4.5x EBITDA"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Expected IRR (%)</label>
                                                    <input
                                                        type="text"
                                                        value={params.expectedIrr || ''}
                                                        onChange={(e) => setParams({ ...params, expectedIrr: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 35%"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Payback Period (Years)</label>
                                                    <input
                                                        type="text"
                                                        value={params.paybackPeriod || ''}
                                                        onChange={(e) => setParams({ ...params, paybackPeriod: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 3.5"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">NPV @ Discount Rate (5yr)</label>
                                                    <input
                                                        type="text"
                                                        value={params.npv || ''}
                                                        onChange={(e) => setParams({ ...params, npv: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="e.g., 2,500,000"
                                                    />
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
                                                <textarea
                                                    value={params.downsideCase || ''}
                                                    onChange={(e) => setParams({ ...params, downsideCase: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="Year 3 Revenue: $2.6M, Break-even: Year 3, IRR: 18%"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Base Case</label>
                                                <textarea
                                                    value={params.baseCase || ''}
                                                    onChange={(e) => setParams({ ...params, baseCase: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="Year 3 Revenue: $3.5M, Break-even: Year 2, IRR: 35%"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Upside Case (+25% revenue)</label>
                                                <textarea
                                                    value={params.upsideCase || ''}
                                                    onChange={(e) => setParams({ ...params, upsideCase: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="Year 3 Revenue: $4.4M, Break-even: Year 1.5, IRR: 52%"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Key Sensitivity Drivers</label>
                                                <textarea
                                                    value={params.sensitivityDrivers || ''}
                                                    onChange={(e) => setParams({ ...params, sensitivityDrivers: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="Critical assumptions: Achieve 50% market share targets by Year 2; partner investment timing; currency swings"
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="5.4 Financial Stages (Phased Funding)"
                                        description="Define capital requirements by project phase"
                                        isExpanded={!!expandedSubsections['financial-stages']}
                                        onToggle={() => toggleSubsection('financial-stages')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs border-collapse">
                                                    <thead>
                                                        <tr className="bg-stone-100">
                                                            <th className="border border-stone-200 p-2 text-left">Stage</th>
                                                            <th className="border border-stone-200 p-2 text-left">CapEx</th>
                                                            <th className="border border-stone-200 p-2 text-left">OpEx</th>
                                                            <th className="border border-stone-200 p-2 text-left">Funding Mix</th>
                                                            <th className="border border-stone-200 p-2 text-left">Timing</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {['Pre-Investment', 'Investment', 'Operations', 'Scale-Up'].map(stage => {
                                                            const existing = (params.financialStages || []).find(s => s.stage === stage);
                                                            const updateStage = (field: keyof typeof existing, value: string) => {
                                                                const stages = params.financialStages || [];
                                                                const idx = stages.findIndex(s => s.stage === stage);
                                                                if (idx >= 0) {
                                                                    const updated = [...stages];
                                                                    updated[idx] = { ...updated[idx], [field]: value };
                                                                    setParams({ ...params, financialStages: updated });
                                                                } else {
                                                                    setParams({ ...params, financialStages: [...stages, { stage, [field]: value }] });
                                                                }
                                                            };
                                                            return (
                                                                <tr key={stage} className="border-t border-stone-200">
                                                                    <td className="border border-stone-200 p-2 font-bold">{stage}</td>
                                                                    <td className="border border-stone-200 p-1">
                                                                        <input type="text" value={existing?.capex || ''} onChange={(e) => updateStage('capex', e.target.value)} className="w-full p-1 border rounded text-xs" placeholder="e.g., $500k"/>
                                                                    </td>
                                                                    <td className="border border-stone-200 p-1">
                                                                        <input type="text" value={existing?.opex || ''} onChange={(e) => updateStage('opex', e.target.value)} className="w-full p-1 border rounded text-xs" placeholder="e.g., $100k/mo"/>
                                                                    </td>
                                                                    <td className="border border-stone-200 p-1">
                                                                        <input type="text" value={existing?.fundingMix || ''} onChange={(e) => updateStage('fundingMix', e.target.value)} className="w-full p-1 border rounded text-xs" placeholder="e.g., 60% equity / 40% debt"/>
                                                                    </td>
                                                                    <td className="border border-stone-200 p-1">
                                                                        <input type="text" value={existing?.timing || ''} onChange={(e) => updateStage('timing', e.target.value)} className="w-full p-1 border rounded text-xs" placeholder="e.g., Q1 2025"/>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                    <CollapsibleSection
                                        title="5.5 Financial Scenarios (Stress Testing)"
                                        description="Define multiple financial scenarios for stress testing"
                                        isExpanded={!!expandedSubsections['financial-scenarios']}
                                        onToggle={() => toggleSubsection('financial-scenarios')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs border-collapse">
                                                    <thead>
                                                        <tr className="bg-stone-100">
                                                            <th className="border border-stone-200 p-2 text-left">Scenario</th>
                                                            <th className="border border-stone-200 p-2 text-left">Revenue</th>
                                                            <th className="border border-stone-200 p-2 text-left">Margin</th>
                                                            <th className="border border-stone-200 p-2 text-left">Cash Burn</th>
                                                            <th className="border border-stone-200 p-2 text-left">Notes</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {['Bear Case', 'Base Case', 'Bull Case', 'Black Swan'].map(name => {
                                                            const existing = (params.financialScenarios || []).find(s => s.name === name);
                                                            const updateScenario = (field: keyof typeof existing, value: string) => {
                                                                const scenarios = params.financialScenarios || [];
                                                                const idx = scenarios.findIndex(s => s.name === name);
                                                                if (idx >= 0) {
                                                                    const updated = [...scenarios];
                                                                    updated[idx] = { ...updated[idx], [field]: value };
                                                                    setParams({ ...params, financialScenarios: updated });
                                                                } else {
                                                                    setParams({ ...params, financialScenarios: [...scenarios, { name, [field]: value }] });
                                                                }
                                                            };
                                                            return (
                                                                <tr key={name} className="border-t border-stone-200">
                                                                    <td className="border border-stone-200 p-2 font-bold">{name}</td>
                                                                    <td className="border border-stone-200 p-1">
                                                                        <input type="text" value={existing?.revenue || ''} onChange={(e) => updateScenario('revenue', e.target.value)} className="w-full p-1 border rounded text-xs" placeholder="e.g., $2M"/>
                                                                    </td>
                                                                    <td className="border border-stone-200 p-1">
                                                                        <input type="text" value={existing?.margin || ''} onChange={(e) => updateScenario('margin', e.target.value)} className="w-full p-1 border rounded text-xs" placeholder="e.g., 15%"/>
                                                                    </td>
                                                                    <td className="border border-stone-200 p-1">
                                                                        <input type="text" value={existing?.cashBurn || ''} onChange={(e) => updateScenario('cashBurn', e.target.value)} className="w-full p-1 border rounded text-xs" placeholder="e.g., $50k/mo"/>
                                                                    </td>
                                                                    <td className="border border-stone-200 p-1">
                                                                        <input type="text" value={existing?.notes || ''} onChange={(e) => updateScenario('notes', e.target.value)} className="w-full p-1 border rounded text-xs" placeholder="Key assumptions"/>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
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
                                                            <th className="border border-stone-200 p-2">Owner</th>
                                                            <th className="border border-stone-200 p-2">Mitigation</th>
                                                            <th className="border border-stone-200 p-2">Residual Risk / KRI</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {RISK_CATEGORIES.map(cat => {
                                                            const entry = getRiskEntry(cat);
                                                            return (
                                                                <tr key={cat} className="border-t border-stone-200">
                                                                    <td className="border border-stone-200 p-2 font-bold">{cat}</td>
                                                                    <td className="border border-stone-200 p-2">
                                                                        <input
                                                                            type="text"
                                                                            value={entry?.description || ''}
                                                                            onChange={(e) => upsertRiskRegister(cat, 'description', e.target.value)}
                                                                            className="w-full p-1 border rounded text-xs"
                                                                            placeholder="Describe risk..."
                                                                        />
                                                                    </td>
                                                                    <td className="border border-stone-200 p-2">
                                                                        <select
                                                                            value={entry?.probability || ''}
                                                                            onChange={(e) => upsertRiskRegister(cat, 'probability', e.target.value)}
                                                                            className="w-full p-1 border rounded text-xs"
                                                                        >
                                                                            <option value="">-</option>
                                                                            <option value="Low">Low</option>
                                                                            <option value="Medium">Medium</option>
                                                                            <option value="High">High</option>
                                                                        </select>
                                                                    </td>
                                                                    <td className="border border-stone-200 p-2">
                                                                        <input
                                                                            type="text"
                                                                            value={entry?.impact || ''}
                                                                            onChange={(e) => upsertRiskRegister(cat, 'impact', e.target.value)}
                                                                            className="w-full p-1 border rounded text-xs"
                                                                            placeholder="e.g., $500k or qualitative"
                                                                        />
                                                                    </td>
                                                                    <td className="border border-stone-200 p-2">
                                                                        <input
                                                                            type="text"
                                                                            value={entry?.owner || ''}
                                                                            onChange={(e) => upsertRiskRegister(cat, 'owner', e.target.value)}
                                                                            className="w-full p-1 border rounded text-xs"
                                                                            placeholder="Accountable owner"
                                                                        />
                                                                    </td>
                                                                    <td className="border border-stone-200 p-2">
                                                                        <textarea
                                                                            value={entry?.mitigation || ''}
                                                                            onChange={(e) => upsertRiskRegister(cat, 'mitigation', e.target.value)}
                                                                            className="w-full p-1 border rounded text-xs h-16"
                                                                            placeholder="Primary mitigations"
                                                                        />
                                                                    </td>
                                                                    <td className="border border-stone-200 p-2">
                                                                        <textarea
                                                                            value={entry?.residualRisk || entry?.kri || ''}
                                                                            onChange={(e) => {
                                                                                upsertRiskRegister(cat, 'residualRisk', e.target.value);
                                                                                upsertRiskRegister(cat, 'kri', e.target.value);
                                                                            }}
                                                                            className="w-full p-1 border rounded text-xs h-16"
                                                                            placeholder="Residual risk & KRI"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
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
                                            {RISK_CATEGORIES.map(cat => {
                                                const entry = getRiskEntry(cat);
                                                return (
                                                    <div key={cat} className="space-y-2">
                                                        <label className="block text-xs font-bold text-stone-700 mb-1">{cat} Mitigation</label>
                                                        <textarea
                                                            value={entry?.mitigation || ''}
                                                            onChange={(e) => upsertRiskRegister(cat, 'mitigation', e.target.value)}
                                                            className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                            placeholder="Specific mitigation steps, controls, and insurance/hedging plans"
                                                        />
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Residual Risk / KRI</label>
                                                                <input
                                                                    type="text"
                                                                    value={entry?.residualRisk || ''}
                                                                    onChange={(e) => upsertRiskRegister(cat, 'residualRisk', e.target.value)}
                                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                                    placeholder="Residual risk rating or KRI trigger"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Owner</label>
                                                                <input
                                                                    type="text"
                                                                    value={entry?.owner || ''}
                                                                    onChange={(e) => upsertRiskRegister(cat, 'owner', e.target.value)}
                                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                                    placeholder="Named accountable owner"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
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
                                                                <input
                                                                    type="text"
                                                                    value={params.contingencyBudget || ''}
                                                                    onChange={(e) => setParams({ ...params, contingencyBudget: e.target.value })}
                                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                                    placeholder="e.g., 500000 (10% of investment)"
                                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Exit Triggers & Conditions</label>
                                                                <textarea
                                                                    value={params.contingencyPlans || ''}
                                                                    onChange={(e) => setParams({ ...params, contingencyPlans: e.target.value })}
                                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                                    placeholder="e.g., If revenue falls >40% below projection for 2 consecutive quarters, trigger exit review; If key partner exits, 30-day contingency evaluation"
                                                                />
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
                                                <input
                                                    type="text"
                                                    value={params.executiveLead || ''}
                                                    onChange={(e) => setParams({ ...params, executiveLead: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., John Smith, VP Strategy"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">CFO / Financial Lead</label>
                                                    <input
                                                        type="text"
                                                        value={params.cfoLead || ''}
                                                        onChange={(e) => setParams({ ...params, cfoLead: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="Name and background"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Operations / Delivery Lead</label>
                                                    <input
                                                        type="text"
                                                        value={params.opsLead || ''}
                                                        onChange={(e) => setParams({ ...params, opsLead: e.target.value })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="Name and background"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Team Bench Strength Assessment</label>
                                                <textarea
                                                    value={params.teamBenchAssessment || ''}
                                                    onChange={(e) => setParams({ ...params, teamBenchAssessment: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="e.g., Sponsor: 20 years M&A, strong board credibility, limited ops experience; CFO: Big 4 background; Bench depth"
                                                />
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
                                            {CAPABILITY_AREAS.map(cap => {
                                                const assessment = getCapability(cap.name);
                                                return (
                                                    <div key={cap.key} className="p-3 border border-stone-200 rounded bg-stone-50 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-bold text-stone-700">{cap.name}</span>
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4, 5].map(rating => (
                                                                    <button
                                                                        key={rating}
                                                                        onClick={() => upsertCapability(cap.name, { rating })}
                                                                        className={`px-3 py-1 border rounded text-xs ${assessment?.rating === rating ? 'bg-purple-600 text-white border-purple-600' : 'hover:bg-purple-100 hover:border-purple-500'}`}
                                                                    >
                                                                        {rating}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <textarea
                                                            value={assessment?.evidence || ''}
                                                            onChange={(e) => upsertCapability(cap.name, { evidence: e.target.value })}
                                                            className="w-full p-2 border border-stone-200 rounded text-xs"
                                                            placeholder="Evidence, certifications, vendors, remediation actions"
                                                        />
                                                    </div>
                                                );
                                            })}
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
                                                <textarea
                                                    value={params.vendorStack || ''}
                                                    onChange={(e) => setParams({ ...params, vendorStack: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="e.g., Cloud (AWS), APIs for integrations, Data warehouse (Snowflake), BI (Tableau)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Key Systems & Integrations</label>
                                                <textarea
                                                    value={params.integrationSystems || ''}
                                                    onChange={(e) => setParams({ ...params, integrationSystems: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="e.g., ERP (SAP), CRM (Salesforce), Financial systems (NetSuite)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Technology Gaps & Risks</label>
                                                <textarea
                                                    value={params.technologyRisks || ''}
                                                    onChange={(e) => setParams({ ...params, technologyRisks: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="e.g., Limited API capabilities, legacy system integrations, data governance challenges"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Compliance Evidence / Certifications</label>
                                                <textarea
                                                    value={params.complianceEvidence || ''}
                                                    onChange={(e) => setParams({ ...params, complianceEvidence: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="e.g., ISO 27001, SOC2, data residency controls, audit cadence"
                                                />
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
                                                <textarea
                                                    value={params.capabilityGaps || ''}
                                                    onChange={(e) => setParams({ ...params, capabilityGaps: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="e.g., 1. International tax expertise (hire Big 4 advisor), 2. Supply chain ops (partner with 3PL), 3. Market entry skills (hire regional GM)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Build vs. Buy vs. Partner Decisions</label>
                                                <textarea
                                                    value={params.buildBuyPartnerPlan || ''}
                                                    onChange={(e) => setParams({ ...params, buildBuyPartnerPlan: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-20"
                                                    placeholder="e.g., Build: Internal analytics capability (12-month timeline). Buy: MarTech tools ($200k/year). Partner: Go-to-market with regional distributor."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Capability Notes & Evidence</label>
                                                <textarea
                                                    value={params.capabilityNotes || ''}
                                                    onChange={(e) => setParams({ ...params, capabilityNotes: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm h-16"
                                                    placeholder="Link to audits, certifications, vendor SLAs, or remediation timelines"
                                                />
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
                                    <CollapsibleSection
                                        title="8.5 Calibration & Constraints"
                                        description="Fine-tune AI analysis with capabilities and constraints"
                                        isExpanded={!!expandedSubsections['execution-calibration']}
                                        onToggle={() => toggleSubsection('execution-calibration')}
                                        color="from-indigo-50 to-blue-100"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Budget Cap (Max Investment)</label>
                                                <input
                                                    type="text"
                                                    value={params.calibration?.constraints?.budgetCap || ''}
                                                    onChange={(e) => setParams({ ...params, calibration: { ...params.calibration, constraints: { ...params.calibration?.constraints, budgetCap: e.target.value } } })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., $10,000,000"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Debt % (Capital Mix)</label>
                                                    <input
                                                        type="number"
                                                        value={params.calibration?.constraints?.capitalMix?.debt ?? 0}
                                                        onChange={(e) => setParams({ ...params, calibration: { ...params.calibration, constraints: { ...params.calibration?.constraints, capitalMix: { ...params.calibration?.constraints?.capitalMix, debt: Number(e.target.value), equity: params.calibration?.constraints?.capitalMix?.equity ?? 0, grant: params.calibration?.constraints?.capitalMix?.grant ?? 0 } } } })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="0-100"
                                                        min={0}
                                                        max={100}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Equity %</label>
                                                    <input
                                                        type="number"
                                                        value={params.calibration?.constraints?.capitalMix?.equity ?? 0}
                                                        onChange={(e) => setParams({ ...params, calibration: { ...params.calibration, constraints: { ...params.calibration?.constraints, capitalMix: { ...params.calibration?.constraints?.capitalMix, debt: params.calibration?.constraints?.capitalMix?.debt ?? 0, equity: Number(e.target.value), grant: params.calibration?.constraints?.capitalMix?.grant ?? 0 } } } })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="0-100"
                                                        min={0}
                                                        max={100}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Grant %</label>
                                                    <input
                                                        type="number"
                                                        value={params.calibration?.constraints?.capitalMix?.grant ?? 0}
                                                        onChange={(e) => setParams({ ...params, calibration: { ...params.calibration, constraints: { ...params.calibration?.constraints, capitalMix: { ...params.calibration?.constraints?.capitalMix, debt: params.calibration?.constraints?.capitalMix?.debt ?? 0, equity: params.calibration?.constraints?.capitalMix?.equity ?? 0, grant: Number(e.target.value) } } } })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                        placeholder="0-100"
                                                        min={0}
                                                        max={100}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Capabilities We Have (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    value={(params.calibration?.capabilitiesHave || []).join(', ')}
                                                    onChange={(e) => setParams({ ...params, calibration: { ...params.calibration, capabilitiesHave: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., Strong brand, Local relationships, Technical expertise"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Capabilities We Need (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    value={(params.calibration?.capabilitiesNeed || []).join(', ')}
                                                    onChange={(e) => setParams({ ...params, calibration: { ...params.calibration, capabilitiesNeed: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., Regulatory access, Distribution network, Funding"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Tax Structure</label>
                                                    <select
                                                        value={params.calibration?.operationalChassis?.taxStructure || ''}
                                                        onChange={(e) => setParams({ ...params, calibration: { ...params.calibration, operationalChassis: { ...params.calibration?.operationalChassis, taxStructure: e.target.value } } })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    >
                                                        <option value="">Select structure...</option>
                                                        <option value="Onshore Standard">Onshore Standard</option>
                                                        <option value="Tax Treaty Optimized">Tax Treaty Optimized</option>
                                                        <option value="Holding Company">Holding Company</option>
                                                        <option value="SEZ / Free Zone">SEZ / Free Zone</option>
                                                        <option value="Regional HQ">Regional HQ</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-700 mb-1">Entity Preference</label>
                                                    <select
                                                        value={params.calibration?.operationalChassis?.entityPreference || ''}
                                                        onChange={(e) => setParams({ ...params, calibration: { ...params.calibration, operationalChassis: { ...params.calibration?.operationalChassis, entityPreference: e.target.value } } })}
                                                        className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    >
                                                        <option value="">Select preference...</option>
                                                        <option value="JV">Joint Venture (JV)</option>
                                                        <option value="SPV">Special Purpose Vehicle (SPV)</option>
                                                        <option value="Branch">Branch Office</option>
                                                        <option value="Subsidiary">Wholly-Owned Subsidiary</option>
                                                        <option value="LLP">Limited Liability Partnership</option>
                                                    </select>
                                                </div>
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
                            {activeModal === 'rate-liquidity' && (
                                <div className="space-y-4">
                                    <CollapsibleSection
                                        title="10.1 Rate & Liquidity Stress Harness"
                                        description="Capture short/medium rate signals, hedge stance, and runway to gate exports"
                                        isExpanded={!!expandedSubsections['rate-liquidity-core']}
                                        onToggle={() => toggleSubsection('rate-liquidity-core')}
                                        color="from-blue-50 to-indigo-50"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">30d Rate (%)</label>
                                                <input
                                                    type="number"
                                                    value={rateStressInputs.rate30}
                                                    onChange={(e) => setRateStressInputs({ ...rateStressInputs, rate30: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., 6.25"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">90d Rate (%)</label>
                                                <input
                                                    type="number"
                                                    value={rateStressInputs.rate90}
                                                    onChange={(e) => setRateStressInputs({ ...rateStressInputs, rate90: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., 5.90"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Hedge Ratio (%)</label>
                                                <input
                                                    type="number"
                                                    value={rateStressInputs.hedgeRatio}
                                                    onChange={(e) => setRateStressInputs({ ...rateStressInputs, hedgeRatio: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., 65"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Currency Mix</label>
                                                <input
                                                    type="text"
                                                    value={rateStressInputs.currencyMix}
                                                    onChange={(e) => setRateStressInputs({ ...rateStressInputs, currencyMix: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., 60% USD / 40% PHP"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Base DSCR</label>
                                                <input
                                                    type="number"
                                                    value={rateStressInputs.dscrBase}
                                                    onChange={(e) => setRateStressInputs({ ...rateStressInputs, dscrBase: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., 1.4"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Base ICR</label>
                                                <input
                                                    type="number"
                                                    value={rateStressInputs.icrBase}
                                                    onChange={(e) => setRateStressInputs({ ...rateStressInputs, icrBase: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., 3.0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-1">Liquidity Runway (days)</label>
                                                <input
                                                    type="number"
                                                    value={rateStressInputs.liquidityDays}
                                                    onChange={(e) => setRateStressInputs({ ...rateStressInputs, liquidityDays: e.target.value })}
                                                    className="w-full p-2 border border-stone-200 rounded text-sm"
                                                    placeholder="e.g., 75"
                                                />
                                            </div>
                                        </div>
                                        {(() => {
                                            const rate30 = parseFloat(rateStressInputs.rate30) || 0;
                                            const rate90 = parseFloat(rateStressInputs.rate90) || 0;
                                            const delta = rate30 - rate90;
                                            const deltaLabel = delta > 0 ? 'Inversion / near-term stress' : delta < 0 ? 'Normal upward curve' : 'Flat curve';
                                            const dscrBase = parseFloat(rateStressInputs.dscrBase) || 0;
                                            const icrBase = parseFloat(rateStressInputs.icrBase) || 0;
                                            const dscr100 = dscrBase ? Math.max(dscrBase - 0.25, 0).toFixed(2) : '—';
                                            const dscr200 = dscrBase ? Math.max(dscrBase - 0.50, 0).toFixed(2) : '—';
                                            const icr100 = icrBase ? Math.max(icrBase - 0.35, 0).toFixed(2) : '—';
                                            const icr200 = icrBase ? Math.max(icrBase - 0.70, 0).toFixed(2) : '—';
                                            return (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                                        <div className="text-xs font-bold text-blue-900 mb-1">Δ30/90 Spread</div>
                                                        <div className="text-lg font-bold text-blue-800">{delta.toFixed(2)}%</div>
                                                        <div className="text-xs text-blue-700">{deltaLabel}</div>
                                                    </div>
                                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg space-y-1">
                                                        <div className="text-xs font-bold text-amber-900">DSCR / ICR under +100 / +200 bps</div>
                                                        <div className="text-sm text-amber-800">DSCR: {dscr100} / {dscr200}</div>
                                                        <div className="text-sm text-amber-800">ICR: {icr100} / {icr200}</div>
                                                        <div className="text-[11px] text-amber-700">Update base values to see stressed headroom.</div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        <div className="mt-4 p-3 bg-stone-50 border border-stone-200 rounded text-[12px] text-stone-700 leading-relaxed">
                                            ECS/TIS gating runs automatically. If evidence is weak, language and export actions will be clamped until hedges, covenants, and liquidity buffers are validated.
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
                </div>
            </div>
        )}

        {/* --- FINALIZATION MODAL --- */}
        {showFinalizationModal && (
            <div
                className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-8"
                onClick={() => setShowFinalizationModal(false)}
            >
                <div
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
                </div>
            </div>
        )}

        {/* --- DOCUMENT GENERATION SUITE MODAL --- */}
        {showDocGenSuite && (
            <div
                className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center"
                onClick={() => setShowDocGenSuite(false)}
            >
                <div
                    className="bg-stone-50 rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DocumentGenerationSuite
                        entityName={params.organizationName}
                        targetMarket={params.userCity}
                        reportData={enhancedReportData}
                        reportParams={params}
                    />
                </div>
            </div>
        )}

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

            {/* Document Scroll Area - Main content with scrolling */}
            <div ref={documentScrollRef} onScroll={handleDocumentScroll} className="flex-1 w-full overflow-y-auto custom-scrollbar p-8 flex justify-center relative">
                
                {/* The Page — full width now that consultant moved to left sidebar */}
                <div className="flex-1 flex justify-center">
                <motion.div
                    layout
                    className="bg-white w-full max-w-4xl min-h-[1123px] shadow-2xl shadow-slate-900/10 flex flex-col relative"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Doc Header */}
                    <div className="h-32 bg-white border-b border-slate-100 flex items-center justify-between px-12 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-800 to-slate-700 text-white flex items-center justify-center font-serif font-bold text-2xl">N</div>
                            <div>
                                <div className="text-[11px] font-bold tracking-[0.3em] text-slate-500 uppercase mb-1">BWGA Intelligence</div>
                                <div className="text-xl font-serif font-bold text-slate-900 tracking-tight">
                                    Strategic Roadmap
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[11px] text-blue-700 uppercase font-bold tracking-wider mb-1">Confidential Draft</div>
                            <div className="text-[11px] font-mono text-slate-500">{new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    {/* Doc Body */}
                    <div className="p-12 flex-1 font-serif text-stone-900">
                        {/* 1. Identity Section */}
                        <div className="mb-12">
                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">01. Principal Entity</h2>
                            {params.organizationName ? (
                                <>
                                    <div className="text-3xl font-bold text-stone-900 mb-2">{params.organizationName}</div>
                                    <div className="text-lg text-stone-600 italic mb-4">
                                        {(params.organizationTypes?.length || 0) > 0 
                                            ? params.organizationTypes?.join(', ') 
                                            : params.organizationType} • {(params.countries?.length || 0) > 0 
                                            ? params.countries?.join(', ') 
                                            : params.country}
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-stone-400 italic">No entity defined</p>
                            )}
                        </div>

                        {/* 2. Mandate Section */}
                        <div className="mb-12">
                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">02. Strategic Mandate</h2>
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
                                <p className="text-sm text-stone-400 italic">No mandate defined</p>
                            )}
                        </div>

                        {/* Partner Personas Section */}
                        <div className="mb-12">
                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">03. Partner Personas</h2>
                            {params.partnerPersonas && params.partnerPersonas.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {params.partnerPersonas.map((persona, index) => (
                                        <div key={index} className="p-4 border border-stone-200 rounded-lg bg-stone-50">
                                            <div className="font-bold text-sm text-stone-800">{persona}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-stone-400 italic">No partner personas defined</p>
                            )}
                        </div>

                        {/* 3. Market Context Section */}
                        <div className="mb-12">
                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">03. Market Context</h2>
                            {enhancedReportData.marketAnalysis.content ? (
                                <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{enhancedReportData.marketAnalysis.content}</div>
                            ) : (
                                <p className="text-sm text-stone-400 italic">No market data</p>
                            )}

                            {/* Display Computed Intelligence */}
                            {reportData && reportData.computedIntelligence && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="text-sm font-bold text-blue-900 mb-3">Computed Intelligence</h3>

                                    <div className="grid grid-cols-2 gap-4 text-[11px]">
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
                                        <span className="font-semibold text-[11px]">Top Symbiotic Partners:</span>
                                        <ul className="text-[11px] mt-1">
                                            {reportData.computedIntelligence?.symbioticPartners?.slice(0, 2).map((partner, idx: number) => (
                                                <li key={idx} className="text-stone-700">• {partner.entityName} (Score: {partner.symbiosisScore})</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-stone-600">
                                        <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Confidence: {reportData.confidenceScores?.overall ?? '—'}/100</span>
                                        <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Economic: {reportData.confidenceScores?.economicReadiness ?? '—'}</span>
                                        <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Political: {reportData.confidenceScores?.politicalStability ?? '—'}</span>
                                        <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Velocity: {reportData.confidenceScores?.activationVelocity ?? '—'}</span>
                                    </div>

                                    {reportData.computedIntelligence?.provenance && (
                                        <div className="mt-3 text-[11px] text-stone-600">
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

                            {proactiveBriefing && (
                                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <h3 className="text-sm font-bold text-amber-900 mb-3">Proactive Briefing</h3>

                                    <div className="grid grid-cols-2 gap-4 text-[11px] text-amber-900">
                                        <div>
                                            <span className="font-semibold">Confidence:</span> {formatPercent(proactiveBriefing.confidence)}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Backtest Accuracy:</span> {formatPercent(proactiveBriefing.backtestAccuracy)}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Context:</span> {proactiveBriefing.context.country} / {proactiveBriefing.context.sector}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Strategy:</span> {proactiveBriefing.context.strategy}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Investment:</span> {formatCapitalFigure(proactiveBriefing.context.investmentSizeM * 1_000_000)}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Year:</span> {proactiveBriefing.context.year}
                                        </div>
                                    </div>

                                    <div className="mt-3 text-[11px] text-stone-700 space-y-2">
                                        <p><span className="font-semibold text-amber-900">Calibration:</span> {proactiveBriefing.calibrationSummary}</p>
                                        <p><span className="font-semibold text-amber-900">Drift:</span> {proactiveBriefing.driftSummary}</p>
                                        <p><span className="font-semibold text-amber-900">Cognition:</span> {proactiveBriefing.cognitiveSummary}</p>
                                    </div>

                                    <div className="mt-3">
                                        <div className="font-semibold text-[11px] text-amber-900 mb-1">Action Priorities</div>
                                        {proactiveBriefing.actionPriorities.length > 0 ? (
                                            <ul className="text-[11px] text-stone-700 space-y-1">
                                                {proactiveBriefing.actionPriorities.slice(0, 5).map((action, idx) => (
                                                    <li key={idx} className="flex gap-2">
                                                        <span className="text-amber-800">-</span>
                                                        <span>{action}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-[11px] text-stone-500 italic">No action priorities flagged.</p>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <div className="font-semibold text-[11px] text-amber-900 mb-1">Proactive Signals</div>
                                        {proactiveBriefing.proactiveSignals.length > 0 ? (
                                            <div className="space-y-2">
                                                {proactiveBriefing.proactiveSignals.slice(0, 5).map((signal) => (
                                                    <div key={signal.id} className="rounded border border-amber-100 bg-white px-2 py-2 text-[11px]">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded-full border ${getSignalBadgeStyle(signal.type)}`}>
                                                                {signal.type.replace(/_/g, ' ')}
                                                            </span>
                                                            <span className="font-semibold text-stone-800">{signal.title}</span>
                                                            <span className="text-stone-500">Confidence {formatPercent(signal.confidence)}</span>
                                                            <span className="text-stone-500">Urgency {signal.urgency}</span>
                                                        </div>
                                                        <div className="mt-1 text-stone-600">{signal.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[11px] text-stone-500 italic">No proactive signals available.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Injected components will render here */}
                        {injectedComponents.map((comp, index) => renderInjectedComponent(comp, index))}

                        {/* 4. Risk & Historical */}
                        <div className="mb-12">
                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">04. Risk & Historical Validation</h2>
                            {enhancedReportData.risks.content ? (
                                <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{enhancedReportData.risks.content}</div>
                            ) : (
                                <p className="text-sm text-stone-400 italic">No risk data</p>
                            )}
                        </div>

                        <div className="mb-12">
                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">05. Advanced Analysis</h2>
                            <p className="text-sm text-stone-400 italic">No advanced analysis</p>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">06. Marketplace Opportunities</h2>
                            <p className="text-sm text-stone-400 italic">No marketplace data</p>
                        </div>
                    </div>

                    {/* Doc Footer */}
                    <div className="h-16 bg-white border-t border-stone-100 flex items-center justify-between px-12 text-[11px] text-stone-400 font-sans uppercase tracking-widest shrink-0">
                        <span>Generated by Nexus Intelligence OS v6.0 · NSIL v3.2</span>
                        <span>Page 1 of 1</span>
                    </div>
                </motion.div>
                </div>

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
