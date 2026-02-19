import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Brain,
  FileText,
  Loader,
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
  Target,
  RotateCcw,
  Save,
  Printer,
  History,
  Users,
  Shield,
  FileCheck,
  Briefcase
} from 'lucide-react';
import { type ReportParameters, type ReportData, type GenerationPhase, type CopilotInsight, type IngestedDocumentMeta } from '../types';
import DocumentTypeRouter, { type DocumentTypeConfig, type LetterTypeConfig } from '../services/DocumentTypeRouter';

type SidebarTab = 'howto' | 'intake' | 'steps' | 'outputs' | 'uploads';
type MainMode = 'objective' | 'live-report';
type DecisionTrack = 'known_target' | 'discovery_target';
type ScoreDimension = 'strategicFit' | 'executionReadiness' | 'investorAttractiveness' | 'localSpillover' | 'resilienceRisk';
type DecisionOutcome = 'NOT_READY' | 'GO' | 'CONDITIONAL_GO' | 'NOT_YET' | 'NO_GO';
type ConfidenceLevel = 'high' | 'medium' | 'low';

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

interface IntakeStepDef {
  id: string;
  title: string;
  hint: string;
  options: { value: string; label: string }[];
}

interface StepTemplate {
  id: string;
  name: string;
  createdAt: string;
  selections: Record<string, string[]>;
}

interface QuickAction {
  id: string;
  label: string;
  hint: string;
  explanation: string;
  steps: string[];
  defaults: Record<string, string[]>;
  outputImpact: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const intakeSteps: IntakeStepDef[] = [
  {
    id: 's1',
    title: 'Objective Definition',
    hint: 'What are you trying to achieve?',
    options: [
      { value: 'market_entry', label: 'Market Entry / Expansion' },
      { value: 'partnership', label: 'Strategic Partnership' },
      { value: 'investment', label: 'Investment Decision' },
      { value: 'acquisition', label: 'M&A / Acquisition' },
      { value: 'supplier_network', label: 'Supplier Network' },
      { value: 'infrastructure', label: 'Infrastructure Development' }
    ]
  },
  {
    id: 's2',
    title: 'Strategic Intent',
    hint: 'Why this objective, why now?',
    options: [
      { value: 'growth_mandate', label: 'Growth Mandate' },
      { value: 'cost_optimization', label: 'Cost Optimization' },
      { value: 'risk_diversification', label: 'Risk Diversification' },
      { value: 'regulatory_pressure', label: 'Regulatory / Policy Pressure' },
      { value: 'competitive_response', label: 'Competitive Response' },
      { value: 'innovation_access', label: 'Innovation / Technology Access' }
    ]
  },
  {
    id: 's3',
    title: 'Market Context',
    hint: 'Region, sector, development stage.',
    options: [
      { value: 'emerging_market', label: 'Emerging Market' },
      { value: 'developed_market', label: 'Developed Market' },
      { value: 'frontier_market', label: 'Frontier Market' },
      { value: 'regional_hub', label: 'Regional Hub' },
      { value: 'special_zone', label: 'Special Economic Zone' },
      { value: 'cross_border', label: 'Cross-Border Corridor' }
    ]
  },
  {
    id: 's4',
    title: 'Counterparty / Stakeholders',
    hint: 'Who is involved or impacted?',
    options: [
      { value: 'government', label: 'Government / Public Sector' },
      { value: 'private_sector', label: 'Private Sector Partner' },
      { value: 'multilateral', label: 'Multilateral / DFI' },
      { value: 'local_community', label: 'Local Community' },
      { value: 'industry_assoc', label: 'Industry Association' },
      { value: 'institutional', label: 'Institutional Investor' }
    ]
  },
  {
    id: 's5',
    title: 'Financial Frame',
    hint: 'Scale, assumptions, funding frame.',
    options: [
      { value: 'sub_1m', label: 'Under $1M' },
      { value: '1m_10m', label: '$1M - $10M' },
      { value: '10m_50m', label: '$10M - $50M' },
      { value: '50m_100m', label: '$50M - $100M' },
      { value: '100m_500m', label: '$100M - $500M' },
      { value: 'over_500m', label: 'Over $500M' }
    ]
  },
  {
    id: 's6',
    title: 'Risk & Controls',
    hint: 'Main risks and mitigation controls.',
    options: [
      { value: 'political_risk', label: 'Political / Sovereign Risk' },
      { value: 'currency_risk', label: 'Currency / FX Risk' },
      { value: 'regulatory_risk', label: 'Regulatory Risk' },
      { value: 'execution_risk', label: 'Execution Risk' },
      { value: 'reputational_risk', label: 'Reputational Risk' },
      { value: 'environmental_risk', label: 'Environmental / ESG Risk' }
    ]
  },
  {
    id: 's7',
    title: 'Capability & Resources',
    hint: 'Team, systems, readiness gaps.',
    options: [
      { value: 'internal_team', label: 'Internal Team Capacity' },
      { value: 'external_advisors', label: 'External Advisors Required' },
      { value: 'tech_systems', label: 'Technology / Systems' },
      { value: 'local_presence', label: 'Local Presence Needed' },
      { value: 'training_upskill', label: 'Training / Upskilling' },
      { value: 'partnership_support', label: 'Partnership Support' }
    ]
  },
  {
    id: 's8',
    title: 'Execution Pathway',
    hint: 'Milestones, dependencies, sequencing.',
    options: [
      { value: 'immediate', label: 'Immediate (0-3 months)' },
      { value: 'short_term', label: 'Short-term (3-12 months)' },
      { value: 'medium_term', label: 'Medium-term (1-3 years)' },
      { value: 'long_term', label: 'Long-term (3-5 years)' },
      { value: 'phased', label: 'Phased Rollout' },
      { value: 'pilot_first', label: 'Pilot First' }
    ]
  },
  {
    id: 's9',
    title: 'Governance & Reporting',
    hint: 'Decision rights and reporting cadence.',
    options: [
      { value: 'board_approval', label: 'Board Approval Required' },
      { value: 'exec_approval', label: 'Executive Approval' },
      { value: 'committee_review', label: 'Committee Review' },
      { value: 'weekly_reporting', label: 'Weekly Reporting' },
      { value: 'monthly_reporting', label: 'Monthly Reporting' },
      { value: 'quarterly_reporting', label: 'Quarterly Reporting' }
    ]
  },
  {
    id: 's10',
    title: 'Readiness Decision',
    hint: 'Go / no-go criteria and threshold.',
    options: [
      { value: 'ready_go', label: 'Ready - Proceed' },
      { value: 'conditional_go', label: 'Conditional - With Mitigations' },
      { value: 'not_yet', label: 'Not Yet - More Work Needed' },
      { value: 'no_go', label: 'No Go - Fundamental Blockers' },
      { value: 'escalate', label: 'Escalate for Decision' },
      { value: 'defer', label: 'Defer / Re-evaluate Later' }
    ]
  }
];

const scoreWeights: Record<ScoreDimension, number> = {
  strategicFit: 20,
  executionReadiness: 25,
  investorAttractiveness: 20,
  localSpillover: 20,
  resilienceRisk: 15
};

const scoreLabels: Record<ScoreDimension, string> = {
  strategicFit: 'Strategic Fit',
  executionReadiness: 'Execution Readiness',
  investorAttractiveness: 'Investor Attractiveness',
  localSpillover: 'Local Spillover Quality',
  resilienceRisk: 'Resilience and Risk'
};

const STEP_TEMPLATE_STORAGE_KEY = 'bw.stepTemplates.v1';
const WORKSPACE_MEMORY_KEY = 'bw.workspaceMemory.v1';

interface WorkspaceMemory {
  savedAt: string;
  stepSelections: Record<string, string[]>;
  chatMessages: Array<{ sender: 'user' | 'bw'; text: string }>;
  dimensionScores: Record<ScoreDimension, number>;
  confidenceLevel: ConfidenceLevel;
  decisionTrack: DecisionTrack;
  activeQuickAction: string | null;
  selectedReports: string[];
  selectedLetters: string[];
  expandedSteps: Record<string, boolean>;
}

const stepGuidance: Record<string, string> = {
  s1: 'Describe the exact result, owner, and timeline. Example: “Select 3 priority sectors for 24-month investment attraction.”',
  s2: 'State why now: growth target, risk pressure, policy deadline, or competitive move.',
  s3: 'Define market setting (maturity, access, regulatory context) so recommendations are context-valid.',
  s4: 'List who decides, who executes, and who can block. This drives governance and document type.',
  s5: 'Set financial boundaries early (scale/funding horizon) to avoid unrealistic output pathways.',
  s6: 'Pick the dominant risks and required controls; this directly affects risk memos and diligence outputs.',
  s7: 'Capture current capability gaps; this determines whether recommendations are “do now” or “build first”.',
  s8: 'Sequence milestones and dependencies; this shapes implementation plans and progress reporting outputs.',
  s9: 'Define cadence and authority model; this drives decision brief and governance document recommendations.',
  s10: 'Set explicit go/no-go thresholds so generated outputs can justify proceed / pause / reject decisions.'
};

const quickActions: QuickAction[] = [
  {
    id: 'market',
    label: 'Analyze a market',
    hint: 'Sector and regional dynamics',
    explanation: 'Best for market prioritization and entry sequencing. It pre-loads market + risk + financial framing steps.',
    steps: ['s1', 's3', 's5', 's6'],
    defaults: {
      s1: ['market_entry'],
      s3: ['regional_hub', 'cross_border'],
      s5: ['10m_50m'],
      s6: ['regulatory_risk', 'execution_risk']
    },
    outputImpact: 'Emphasizes market briefs, regional comparison docs, and investment-readiness letters.',
    icon: Globe
  },
  {
    id: 'company',
    label: 'Assess a company',
    hint: 'Partner due diligence',
    explanation: 'Best for counterparty fit and risk evaluation. It pre-loads stakeholder + risk + governance steps.',
    steps: ['s1', 's4', 's6', 's9'],
    defaults: {
      s1: ['partnership'],
      s4: ['private_sector', 'institutional'],
      s6: ['reputational_risk', 'execution_risk'],
      s9: ['committee_review', 'monthly_reporting']
    },
    outputImpact: 'Emphasizes due-diligence reports, partner-fit summaries, and governance decision documents.',
    icon: Building2
  },
  {
    id: 'regional',
    label: 'Regional intelligence',
    hint: 'Infrastructure outlook',
    explanation: 'Best for place-based development and infrastructure constraints. It pre-loads context + capability + execution.',
    steps: ['s3', 's7', 's8'],
    defaults: {
      s3: ['regional_hub', 'special_zone'],
      s7: ['tech_systems', 'local_presence'],
      s8: ['phased', 'medium_term']
    },
    outputImpact: 'Emphasizes regional intelligence products, infrastructure gap diagnostics, and phased action plans.',
    icon: Target
  },
  {
    id: 'investment',
    label: 'Investment guidance',
    hint: 'Project viability assessment',
    explanation: 'Best for investment/no-investment decisions. It pre-loads financial, risk, readiness, and governance criteria.',
    steps: ['s5', 's6', 's9', 's10'],
    defaults: {
      s5: ['50m_100m'],
      s6: ['currency_risk', 'political_risk'],
      s9: ['exec_approval', 'monthly_reporting'],
      s10: ['conditional_go']
    },
    outputImpact: 'Emphasizes investment committee packs, risk-adjusted viability reports, and go/no-go letters.',
    icon: Brain
  },
  {
    id: 'proposal',
    label: 'Build a proposal',
    hint: 'Funding or partnership proposal',
    explanation: 'Best for structuring persuasive proposals backed by data. Pre-loads objective, stakeholder, financial, and execution steps.',
    steps: ['s1', 's4', 's5', 's8'],
    defaults: {
      s1: ['partnership', 'investment'],
      s4: ['government', 'multilateral'],
      s5: ['10m_50m'],
      s8: ['phased', 'short_term']
    },
    outputImpact: 'Emphasizes proposal documents, partnership frameworks, and funding request letters.',
    icon: Briefcase
  },
  {
    id: 'risk',
    label: 'Risk deep-dive',
    hint: 'Comprehensive risk analysis',
    explanation: 'Best for understanding and mitigating risk exposure. Pre-loads risk, governance, capability, and readiness steps.',
    steps: ['s6', 's7', 's9', 's10'],
    defaults: {
      s6: ['political_risk', 'currency_risk', 'regulatory_risk'],
      s7: ['external_advisors', 'tech_systems'],
      s9: ['committee_review', 'weekly_reporting'],
      s10: ['conditional_go']
    },
    outputImpact: 'Emphasizes risk memos, mitigation plans, and governance decision briefs.',
    icon: Shield
  },
  {
    id: 'stakeholder',
    label: 'Stakeholder mapping',
    hint: 'Engagement and alignment strategy',
    explanation: 'Best for multi-party coordination. Pre-loads stakeholder, governance, execution, and capability steps.',
    steps: ['s4', 's7', 's8', 's9'],
    defaults: {
      s4: ['government', 'private_sector', 'multilateral'],
      s7: ['local_presence', 'partnership_support'],
      s8: ['medium_term'],
      s9: ['exec_approval', 'monthly_reporting']
    },
    outputImpact: 'Emphasizes stakeholder maps, engagement strategies, and alignment letters.',
    icon: Users
  },
  {
    id: 'compliance',
    label: 'Compliance check',
    hint: 'Regulatory and policy assessment',
    explanation: 'Best for regulatory readiness and policy alignment. Pre-loads risk, governance, readiness, and strategic intent steps.',
    steps: ['s2', 's6', 's9', 's10'],
    defaults: {
      s2: ['regulatory_pressure'],
      s6: ['regulatory_risk', 'reputational_risk'],
      s9: ['board_approval', 'quarterly_reporting'],
      s10: ['conditional_go', 'escalate']
    },
    outputImpact: 'Emphasizes compliance reports, regulatory gap analyses, and policy alignment documents.',
    icon: FileCheck
  }
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
  const [decisionTrack, setDecisionTrack] = useState<DecisionTrack>('discovery_target');
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>('medium');
  const [dimensionScores, setDimensionScores] = useState<Record<ScoreDimension, number>>({
    strategicFit: 3,
    executionReadiness: 3,
    investorAttractiveness: 3,
    localSpillover: 3,
    resilienceRisk: 3
  });

  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bw'; text: string }>>([]);

  const [uploadedDocs, setUploadedDocs] = useState<IngestedDocumentMeta[]>(params.ingestedDocuments ?? []);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [showFullLibraries, setShowFullLibraries] = useState(false);
  const [reportSearch, setReportSearch] = useState('');
  const [letterSearch, setLetterSearch] = useState('');
  const [stepSelections, setStepSelections] = useState<Record<string, string[]>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [customStepInput, setCustomStepInput] = useState<Record<string, string>>({});
  const [stepSearch, setStepSearch] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [savedStepTemplates, setSavedStepTemplates] = useState<StepTemplate[]>([]);
  const [templateStatus, setTemplateStatus] = useState('');
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [memoryReportOpen, setMemoryReportOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const templateImportRef = useRef<HTMLInputElement>(null);

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

  const schemaChecks = useMemo(() => {
    return {
      objectiveName: Boolean(params.reportName?.trim()),
      regionScope: Boolean(params.country?.trim()),
      planningHorizon: Boolean(params.analysisTimeframe?.trim() || params.expansionTimeline?.trim()),
      strategicOutcomes: Boolean((params.strategicObjectives?.length ?? 0) > 0 || (params.successMetrics?.length ?? 0) > 0),
      constraints: Boolean(params.riskTolerance?.trim() || params.riskAppetiteStatement?.trim()),
      policyTools: Boolean((params.partnershipSupportNeeds?.length ?? 0) > 0 || params.procurementMode?.trim()),
      evidenceBase: uploadedDocs.length > 0 || Boolean(params.complianceEvidence?.trim()),
      comparatorSet: Boolean((params.strategicLens?.length ?? 0) > 0 || (params.developmentOutcomes?.length ?? 0) > 0),
      stakeholderMap: Boolean((params.stakeholderAlignment?.length ?? 0) > 0 || (params.targetCounterpartType?.length ?? 0) > 0),
      riskAppetite: Boolean(params.riskTolerance?.trim() || params.riskAppetiteStatement?.trim()),
      hardStops: Boolean(params.goNoGoCriteria?.trim()),
      successKpis: Boolean((params.successMetrics?.length ?? 0) > 0),
      trackRequirement:
        decisionTrack === 'known_target'
          ? Boolean(params.targetPartner?.trim() || params.idealPartnerProfile?.trim())
          : Boolean((params.industry?.length ?? 0) > 0 || (params.priorityThemes?.length ?? 0) > 0)
    };
  }, [
    decisionTrack,
    params.analysisTimeframe,
    params.complianceEvidence,
    params.country,
    params.developmentOutcomes,
    params.expansionTimeline,
    params.goNoGoCriteria,
    params.idealPartnerProfile,
    params.industry,
    params.partnershipSupportNeeds,
    params.priorityThemes,
    params.procurementMode,
    params.reportName,
    params.riskAppetiteStatement,
    params.riskTolerance,
    params.stakeholderAlignment,
    params.strategicLens,
    params.strategicObjectives,
    params.successMetrics,
    params.targetCounterpartType,
    params.targetPartner,
    uploadedDocs.length
  ]);

  const schemaCompletedCount = useMemo(
    () => Object.values(schemaChecks).filter(Boolean).length,
    [schemaChecks]
  );

  const schemaReady = schemaCompletedCount >= 10;

  const completedStepCount = useMemo(() => Object.values(stepSelections).filter(arr => arr.length > 0).length, [stepSelections]);
  const librariesUnlocked = objectiveReady && completedStepCount >= 4;

  const evidenceGates = useMemo(() => {
    const capabilityBaseline = Boolean(
      completedStepCount >= 3 &&
      (
        (params.capabilityAssessments?.length ?? 0) > 0 ||
        params.capabilityGaps?.trim() ||
        params.teamBenchAssessment?.trim() ||
        params.vendorStack?.trim()
      )
    );

    const constraintRealism = Boolean(
      (params.riskTolerance?.trim() || params.riskAppetiteStatement?.trim()) &&
      (params.totalInvestment?.trim() || params.dealSize?.trim() || params.fundingSource?.trim())
    );

    const comparatorAnalysis = Boolean(
      (params.strategicLens?.length ?? 0) > 0 ||
      (params.developmentOutcomes?.length ?? 0) > 0 ||
      (params.partnerPersonas?.length ?? 0) > 0
    );

    const additionalitySpillover = Boolean(
      (params.developmentOutcomes?.length ?? 0) > 0 &&
      ((params.successMetrics?.length ?? 0) > 0 || params.specificOpportunity?.trim())
    );

    const deliveryOwnership = Boolean(
      (params.executiveLead?.trim() || params.executiveSponsor?.trim()) &&
      (params.riskOwners?.length ?? 0) > 0 &&
      (params.riskReportingCadence?.trim() || params.milestonePlan?.trim())
    );

    return {
      capabilityBaseline,
      constraintRealism,
      comparatorAnalysis,
      additionalitySpillover,
      deliveryOwnership
    };
  }, [
    completedStepCount,
    params.capabilityAssessments,
    params.capabilityGaps,
    params.dealSize,
    params.developmentOutcomes,
    params.executiveLead,
    params.executiveSponsor,
    params.fundingSource,
    params.milestonePlan,
    params.partnerPersonas,
    params.riskAppetiteStatement,
    params.riskOwners,
    params.riskReportingCadence,
    params.riskTolerance,
    params.specificOpportunity,
    params.strategicLens,
    params.successMetrics,
    params.teamBenchAssessment,
    params.totalInvestment,
    params.vendorStack
  ]);

  const allGatesPass = useMemo(() => Object.values(evidenceGates).every(Boolean), [evidenceGates]);

  const weightedScore = useMemo(() => {
    return (Object.keys(scoreWeights) as ScoreDimension[]).reduce((acc, key) => {
      const raw = Math.max(0, Math.min(5, dimensionScores[key] || 0));
      return acc + (raw / 5) * scoreWeights[key];
    }, 0);
  }, [dimensionScores]);

  const hardStopViolation = useMemo(() => {
    const text = (params.goNoGoCriteria || '').toLowerCase();
    return text.includes('hard stop fail') || text.includes('hard-stop fail') || text.includes('violation');
  }, [params.goNoGoCriteria]);

  const decisionOutcome: DecisionOutcome = useMemo(() => {
    if (!schemaReady || !allGatesPass) return 'NOT_READY';
    if (hardStopViolation || weightedScore < 45) return 'NO_GO';
    if (weightedScore >= 75) return 'GO';
    if (weightedScore >= 60) return 'CONDITIONAL_GO';
    return 'NOT_YET';
  }, [allGatesPass, hardStopViolation, schemaReady, weightedScore]);

  const generationEligible = decisionOutcome === 'GO' || decisionOutcome === 'CONDITIONAL_GO';

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
    try {
      const raw = window.localStorage.getItem(STEP_TEMPLATE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StepTemplate[];
      if (Array.isArray(parsed)) {
        setSavedStepTemplates(parsed);
      }
    } catch {
      setSavedStepTemplates([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STEP_TEMPLATE_STORAGE_KEY, JSON.stringify(savedStepTemplates));
    } catch {
      // ignore storage write errors
    }
  }, [savedStepTemplates]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WORKSPACE_MEMORY_KEY);
      if (!raw) return;
      const memory = JSON.parse(raw) as WorkspaceMemory;
      if (memory.stepSelections) setStepSelections(memory.stepSelections);
      if (memory.chatMessages) setChatMessages(memory.chatMessages);
      if (memory.dimensionScores) setDimensionScores(memory.dimensionScores);
      if (memory.confidenceLevel) setConfidenceLevel(memory.confidenceLevel);
      if (memory.decisionTrack) setDecisionTrack(memory.decisionTrack);
      if (memory.activeQuickAction !== undefined) setActiveQuickAction(memory.activeQuickAction);
      if (memory.selectedReports) setSelectedReports(memory.selectedReports);
      if (memory.selectedLetters) setSelectedLetters(memory.selectedLetters);
      if (memory.expandedSteps) setExpandedSteps(memory.expandedSteps);
      if (memory.savedAt) setLastSavedAt(memory.savedAt);
    } catch {
      // ignore invalid stored memory
    }
  }, []);

  useEffect(() => {
    if (!initialConsultantQuery) return;
    const timer = window.setTimeout(() => {
      setChatMessages([
        { sender: 'user', text: initialConsultantQuery },
        {
          sender: 'bw',
          text: 'I captured your objective. Start in "How to Use", complete Intake + 10 Steps, then switch to Live Report. Output libraries unlock once core intake is complete.'
        }
      ]);
      onInitialConsultantQueryHandled?.();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initialConsultantQuery, onInitialConsultantQueryHandled]);

  const updateField = <K extends keyof ReportParameters>(key: K, value: ReportParameters[K]) => {
    setParams({ ...params, [key]: value });
  };

  const getStepLabel = (step: IntakeStepDef, rawValue: string) => {
    const builtIn = step.options.find((opt) => opt.value === rawValue);
    if (builtIn) return builtIn.label;
    if (rawValue.startsWith('custom:')) return rawValue.replace('custom:', '');
    return rawValue;
  };

  const addCustomStepValue = (stepId: string) => {
    const nextValue = (customStepInput[stepId] || '').trim();
    if (!nextValue) return;
    const encoded = `custom:${nextValue}`;

    setStepSelections((prev) => {
      const current = prev[stepId] ?? [];
      if (current.some((item) => item.toLowerCase() === encoded.toLowerCase())) {
        return prev;
      }
      return { ...prev, [stepId]: [...current, encoded] };
    });

    setCustomStepInput((prev) => ({ ...prev, [stepId]: '' }));
  };

  const normalizeTemplateSelections = (selections: unknown): Record<string, string[]> => {
    if (!selections || typeof selections !== 'object') return {};
    const input = selections as Record<string, unknown>;
    return intakeSteps.reduce<Record<string, string[]>>((acc, step) => {
      const stepValues = input[step.id];
      if (Array.isArray(stepValues)) {
        const cleaned = stepValues.filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
        if (cleaned.length > 0) acc[step.id] = cleaned;
      }
      return acc;
    }, {});
  };

  const buildTemplateFingerprint = (name: string, selections: Record<string, string[]>) => {
    const normalizedName = name.trim().toLowerCase();
    const normalizedSelections = Object.keys(selections)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, string[]>>((acc, stepId) => {
        const values = (selections[stepId] || [])
          .map((value) => value.trim().toLowerCase())
          .filter((value) => value.length > 0)
          .sort((a, b) => a.localeCompare(b));
        if (values.length > 0) {
          acc[stepId] = values;
        }
        return acc;
      }, {});

    return JSON.stringify({ name: normalizedName, selections: normalizedSelections });
  };

  const saveCurrentTemplate = () => {
    const name = templateName.trim();
    if (!name) return;

    const normalizedSelections = normalizeTemplateSelections(stepSelections);
    const candidateFingerprint = buildTemplateFingerprint(name, normalizedSelections);
    const duplicateExists = savedStepTemplates.some(
      (template) => buildTemplateFingerprint(template.name, normalizeTemplateSelections(template.selections)) === candidateFingerprint
    );

    if (duplicateExists) {
      setTemplateStatus(`Template "${name}" already exists (same content).`);
      return;
    }

    const nextTemplate: StepTemplate = {
      id: `${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      selections: normalizedSelections
    };

    setSavedStepTemplates((prev) => [nextTemplate, ...prev]);
    setTemplateName('');
    setTemplateStatus(`Saved template "${name}".`);
  };

  const applyTemplate = (templateId: string) => {
    const template = savedStepTemplates.find((item) => item.id === templateId);
    if (!template) return;
    setStepSelections(template.selections || {});
    setTemplateStatus(`Applied template "${template.name}".`);
  };

  const deleteTemplate = (templateId: string) => {
    const target = savedStepTemplates.find((item) => item.id === templateId);
    setSavedStepTemplates((prev) => prev.filter((item) => item.id !== templateId));
    if (target) setTemplateStatus(`Deleted template "${target.name}".`);
  };

  const applyQuickAction = (action: QuickAction) => {
    setActiveQuickAction(action.id);
    setMainMode('objective');
    setActiveTab('steps');
    setExpandedSteps((prev) => {
      const next = { ...prev };
      action.steps.forEach((stepId) => {
        next[stepId] = true;
      });
      return next;
    });

    setStepSelections((prev) => {
      const next = { ...prev };
      Object.entries(action.defaults).forEach(([stepId, defaults]) => {
        const current = next[stepId] ?? [];
        next[stepId] = Array.from(new Set([...current, ...defaults]));
      });
      return next;
    });

    setChatInput(action.hint);
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'bw',
        text: `Quick action "${action.label}" applied. Updated steps: ${action.steps.join(', ')}. Output impact: ${action.outputImpact}`
      }
    ]);
  };

  const resetWorkspace = () => {
    setActiveQuickAction(null);
    setStepSelections({});
    setExpandedSteps({});
    setCustomStepInput({});
    setStepSearch('');
    setChatMessages([{ sender: 'bw', text: 'Workspace reset. All step selections, quick actions, and chat history have been cleared. Intake fields and saved templates are preserved.' }]);
    setChatInput('');
    setTemplateStatus('');
    setSelectedReports([]);
    setSelectedLetters([]);
    setShowFullLibraries(false);
    setReportSearch('');
    setLetterSearch('');
    setDimensionScores({
      strategicFit: 3,
      executionReadiness: 3,
      investorAttractiveness: 3,
      localSpillover: 3,
      resilienceRisk: 3
    });
    setConfidenceLevel('medium');
    setMemoryReportOpen(false);
  };

  const saveWorkspace = () => {
    const memory: WorkspaceMemory = {
      savedAt: new Date().toISOString(),
      stepSelections,
      chatMessages,
      dimensionScores,
      confidenceLevel,
      decisionTrack,
      activeQuickAction,
      selectedReports,
      selectedLetters,
      expandedSteps
    };
    try {
      window.localStorage.setItem(WORKSPACE_MEMORY_KEY, JSON.stringify(memory));
      setLastSavedAt(memory.savedAt);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bw', text: `Workspace saved at ${new Date().toLocaleString()}. Your step selections, scores, chat history, and output choices are preserved. Use the Memory button to review or restore.` }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bw', text: 'Save failed: browser storage may be full.' }
      ]);
    }
  };

  const loadWorkspaceMemory = () => {
    try {
      const raw = window.localStorage.getItem(WORKSPACE_MEMORY_KEY);
      if (!raw) return;
      const memory = JSON.parse(raw) as WorkspaceMemory;
      if (memory.stepSelections) setStepSelections(memory.stepSelections);
      if (memory.chatMessages) setChatMessages(memory.chatMessages);
      if (memory.dimensionScores) setDimensionScores(memory.dimensionScores);
      if (memory.confidenceLevel) setConfidenceLevel(memory.confidenceLevel);
      if (memory.decisionTrack) setDecisionTrack(memory.decisionTrack);
      if (memory.activeQuickAction !== undefined) setActiveQuickAction(memory.activeQuickAction);
      if (memory.selectedReports) setSelectedReports(memory.selectedReports);
      if (memory.selectedLetters) setSelectedLetters(memory.selectedLetters);
      if (memory.expandedSteps) setExpandedSteps(memory.expandedSteps);
      if (memory.savedAt) setLastSavedAt(memory.savedAt);
      setChatMessages((prev) => [...prev, { sender: 'bw', text: 'Workspace restored from last save.' }]);
    } catch {
      // ignore
    }
  };

  const clearWorkspaceMemory = () => {
    try {
      window.localStorage.removeItem(WORKSPACE_MEMORY_KEY);
      setLastSavedAt(null);
      setMemoryReportOpen(false);
      setChatMessages((prev) => [...prev, { sender: 'bw', text: 'Saved workspace memory cleared.' }]);
    } catch {
      // ignore
    }
  };

  const printWorkspaceSummary = () => {
    const lines = [
      '\u2550'.repeat(50),
      'BW CONSULTANT \u2014 WORKSPACE SUMMARY',
      '\u2550'.repeat(50),
      `Date: ${new Date().toLocaleString()}`,
      '',
      '\u2500\u2500 INTAKE \u2500\u2500',
      `Organization: ${params.organizationName || '\u2014'}`,
      `Country/Region: ${params.country || '\u2014'}`,
      `Report Title: ${params.reportName || '\u2014'}`,
      `Objective: ${params.problemStatement || '\u2014'}`,
      `Decision Track: ${decisionTrack === 'known_target' ? 'Known Target' : 'Discovery Target'}`,
      '',
      '\u2500\u2500 10-STEP SELECTIONS \u2500\u2500',
      ...intakeSteps.map((step) => {
        const selected = stepSelections[step.id] ?? [];
        return `${step.title}: ${selected.length > 0 ? selected.map((v) => getStepLabel(step, v)).join(', ') : '(none)'}`;
      }),
      '',
      '\u2500\u2500 SCORING & DECISION \u2500\u2500',
      `Weighted Score: ${weightedScore.toFixed(1)} / 100`,
      `Confidence: ${confidenceLevel}`,
      `Decision: ${decisionOutcome}`,
      `Evidence Gates: ${allGatesPass ? 'All Passed' : 'Pending'}`,
      `Schema: ${schemaCompletedCount}/13 complete`,
      '',
      '\u2500\u2500 OUTPUTS \u2500\u2500',
      `Active Reports: ${selectedReports.length}`,
      `Active Letters: ${selectedLetters.length}`,
      `Evidence Files: ${uploadedDocs.length}`,
      '',
      '\u2500\u2500 CONVERSATION \u2500\u2500',
      ...chatMessages.map((m) => `[${m.sender === 'user' ? 'You' : 'BW'}] ${m.text}`),
      '',
      '\u2550'.repeat(50)
    ];

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(
        `<html><head><title>BW Consultant - Workspace Summary</title>` +
        `<style>body{font-family:'Segoe UI',Roboto,sans-serif;padding:40px;font-size:13px;line-height:1.6;white-space:pre-wrap;color:#1e293b;}</style>` +
        `</head><body>${lines.join('\n')}</body></html>`
      );
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportTemplatesAsJson = () => {
    if (savedStepTemplates.length === 0) {
      setTemplateStatus('No templates to export yet.');
      return;
    }

    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      templates: savedStepTemplates
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `bw-step-templates-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    setTemplateStatus(`Exported ${savedStepTemplates.length} template(s).`);
  };

  const importTemplatesFromJson = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as { templates?: unknown } | StepTemplate[];
      const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.templates) ? parsed.templates : [];

      const existingFingerprints = new Set(
        savedStepTemplates.map((template) =>
          buildTemplateFingerprint(template.name, normalizeTemplateSelections(template.selections))
        )
      );

      let skippedAsDuplicate = 0;

      const imported = (list as unknown[])
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const source = item as Partial<StepTemplate>;
          const name = `${source.name || ''}`.trim();
          if (!name) return null;
          const normalizedSelections = normalizeTemplateSelections(source.selections);
          const candidateFingerprint = buildTemplateFingerprint(name, normalizedSelections);

          if (existingFingerprints.has(candidateFingerprint)) {
            skippedAsDuplicate += 1;
            return null;
          }

          existingFingerprints.add(candidateFingerprint);

          return {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name,
            createdAt: source.createdAt || new Date().toISOString(),
            selections: normalizedSelections
          } satisfies StepTemplate;
        })
        .filter((template): template is StepTemplate => Boolean(template));

      if (imported.length === 0) {
        setTemplateStatus(
          skippedAsDuplicate > 0
            ? `No new templates imported (${skippedAsDuplicate} duplicate template${skippedAsDuplicate === 1 ? '' : 's'} skipped).`
            : 'No valid templates found in file.'
        );
      } else {
        setSavedStepTemplates((prev) => [...imported, ...prev]);
        setTemplateStatus(
          `Imported ${imported.length} template(s)` +
            (skippedAsDuplicate > 0 ? `, skipped ${skippedAsDuplicate} duplicate(s).` : '.')
        );
      }
    } catch {
      setTemplateStatus('Import failed. Please use a valid JSON template file.');
    } finally {
      if (templateImportRef.current) {
        templateImportRef.current.value = '';
      }
    }
  };

  const filteredSteps = useMemo(() => {
    const q = stepSearch.trim().toLowerCase();
    if (!q) return intakeSteps;

    return intakeSteps.filter((step) => {
      const optionMatch = step.options.some((opt) => `${opt.label} ${opt.value}`.toLowerCase().includes(q));
      const selectedValues = stepSelections[step.id] ?? [];
      const selectedMatch = selectedValues
        .map((value) => getStepLabel(step, value).toLowerCase())
        .some((label) => label.includes(q));

      return `${step.title} ${step.hint}`.toLowerCase().includes(q) || optionMatch || selectedMatch;
    });
  }, [stepSearch, stepSelections]);

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
      `Schema readiness: ${schemaCompletedCount}/13 required fields`,
      `Evidence gates: ${allGatesPass ? 'Passed' : 'Pending'}`,
      `Weighted score: ${weightedScore.toFixed(1)}/100 (${confidenceLevel} confidence)`,
      `Decision: ${decisionOutcome}`,
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
                  <p className="text-sm">Every action changes downstream logic. Quick actions pre-load steps, steps shape readiness/gates, and readiness controls what documents/letters can be generated.</p>
                </div>
                {[
                  '1) Choose a quick action to preload relevant 10-step logic (or start manually).',
                  '2) Fill Intake fields (organization, location, title, objective) to establish mission context.',
                  '3) Complete 10 Steps with selections/custom entries; these selections affect readiness and output emphasis.',
                  '4) Add evidence in Uploads; evidence and steps together drive decision confidence and document suitability.',
                  '5) Unlock Outputs, then activate/generate the right reports and letters based on your configured pathway.',
                  '6) Use Live Report to review context, scores, and finalize generation decisions.'
                ].map((line, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg">{line}</div>
                ))}
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
                  Cause-and-effect: Quick Action → Step Selections → Readiness/Gates → Output Type Emphasis → Generated Documents/Letters.
                </div>
              </div>
            )}

            {activeTab === 'intake' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Decision Track</label>
                  <select
                    value={decisionTrack}
                    onChange={(e) => setDecisionTrack(e.target.value as DecisionTrack)}
                    className="w-full border border-slate-300 px-3 py-2 text-sm rounded"
                  >
                    <option value="discovery_target">Discovery Target</option>
                    <option value="known_target">Known Target</option>
                  </select>
                </div>
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
                <div className="p-3 text-xs rounded border border-slate-200 bg-white space-y-2">
                  <p className="font-semibold text-slate-700">Objective Schema</p>
                  <p className="text-slate-500">Required fields complete: <span className="font-semibold text-blue-700">{schemaCompletedCount}/13</span></p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {Object.entries(schemaChecks).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-slate-600">{key}</span>
                        <span className={value ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>{value ? 'ok' : 'missing'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="space-y-2">
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                  <input
                    value={stepSearch}
                    onChange={(e) => setStepSearch(e.target.value)}
                    className="w-full border border-slate-300 px-3 py-2 rounded text-xs"
                    placeholder="Search any step, option, or selected value"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="flex-1 border border-slate-300 px-2 py-1.5 rounded text-xs"
                      placeholder="Template name"
                    />
                    <button
                      type="button"
                      onClick={saveCurrentTemplate}
                      className="px-2.5 py-1.5 text-xs font-medium rounded bg-slate-800 text-white hover:bg-slate-700"
                    >
                      Save Template
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={exportTemplatesAsJson}
                      className="px-2.5 py-1.5 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Export JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => templateImportRef.current?.click()}
                      className="px-2.5 py-1.5 text-xs font-medium rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                    >
                      Import JSON
                    </button>
                    <input
                      ref={templateImportRef}
                      type="file"
                      accept="application/json,.json"
                      className="hidden"
                      onChange={(e) => void importTemplatesFromJson(e.target.files)}
                    />
                  </div>
                  {templateStatus && <p className="text-[11px] text-slate-600">{templateStatus}</p>}
                  {savedStepTemplates.length > 0 && (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {savedStepTemplates.map((template) => (
                        <div key={template.id} className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-700 truncate">{template.name}</p>
                            <p className="text-[10px] text-slate-500">{new Date(template.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => applyTemplate(template.id)}
                              className="px-2 py-1 text-[10px] rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Apply
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTemplate(template.id)}
                              className="px-2 py-1 text-[10px] rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {filteredSteps.map((step) => {
                  const isExpanded = expandedSteps[step.id] ?? false;
                  const selected = stepSelections[step.id] ?? [];
                  const hasSelections = selected.length > 0;
                  return (
                    <div key={step.id} className={`bg-white border rounded-lg overflow-hidden ${hasSelections ? 'border-emerald-400' : 'border-slate-200'}`}>
                      <button
                        type="button"
                        onClick={() => setExpandedSteps(prev => ({ ...prev, [step.id]: !prev[step.id] }))}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${hasSelections ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {hasSelections ? '✓' : step.id.replace('s', '')}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{step.title}</p>
                            <p className="text-[11px] text-slate-500">
                              {hasSelections ? selected.map((value) => getStepLabel(step, value)).join(', ') : step.hint}
                            </p>
                            {!hasSelections && <p className="text-[10px] text-blue-700 mt-1">{stepGuidance[step.id]}</p>}
                          </div>
                        </div>
                        <span className="text-slate-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50">
                          <p className="text-[10px] text-slate-500 mb-2">Select all that apply:</p>
                          <p className="text-[10px] text-blue-700 mb-2">Why this step matters: {stepGuidance[step.id]}</p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {step.options.map(opt => {
                              const isSelected = selected.includes(opt.value);
                              return (
                                <label
                                  key={opt.value}
                                  className={`flex items-center gap-2 p-2 rounded cursor-pointer text-xs transition-colors ${isSelected ? 'bg-blue-100 text-blue-800' : 'bg-white hover:bg-slate-100 text-slate-700'}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      setStepSelections(prev => {
                                        const current = prev[step.id] ?? [];
                                        const updated = isSelected
                                          ? current.filter(v => v !== opt.value)
                                          : [...current, opt.value];
                                        return { ...prev, [step.id]: updated };
                                      });
                                    }}
                                    className="h-3.5 w-3.5 accent-blue-600"
                                  />
                                  {opt.label}
                                </label>
                              );
                            })}
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-[10px] text-slate-500 mb-2">Add custom selection (no limit):</p>
                            <div className="flex items-center gap-2">
                              <input
                                value={customStepInput[step.id] ?? ''}
                                onChange={(e) => setCustomStepInput((prev) => ({ ...prev, [step.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addCustomStepValue(step.id);
                                  }
                                }}
                                className="flex-1 border border-slate-300 px-2 py-1.5 rounded text-xs"
                                placeholder="Type any specific requirement..."
                              />
                              <button
                                type="button"
                                onClick={() => addCustomStepValue(step.id)}
                                className="px-2.5 py-1.5 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredSteps.length === 0 && (
                  <div className="p-3 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg">No steps match your search.</div>
                )}
                <div className="p-2 text-xs rounded border border-slate-200 bg-white">
                  Progress: <span className="font-semibold text-blue-700">{completedStepCount}/10</span> — {completedStepCount >= 4 ? 'Ready for outputs' : `Select options in ${4 - completedStepCount} more steps`}
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

                <div className="p-3 border rounded-lg bg-white space-y-1.5">
                  <p className="text-xs text-slate-600">Evidence Gates</p>
                  {Object.entries(evidenceGates).map(([gate, passed]) => (
                    <div key={gate} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{gate}</span>
                      <span className={passed ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>{passed ? 'pass' : 'pending'}</span>
                    </div>
                  ))}
                  <div className="pt-1 text-xs">
                    Decision: <span className={`font-semibold ${decisionOutcome === 'GO' || decisionOutcome === 'CONDITIONAL_GO' ? 'text-emerald-600' : decisionOutcome === 'NO_GO' ? 'text-red-600' : 'text-amber-600'}`}>{decisionOutcome}</span>
                  </div>
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
              disabled={isGenerating || !librariesUnlocked || totalActiveOutputs === 0 || !generationEligible}
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
              className={`px-3 py-1.5 rounded text-xs font-semibold ${mainMode === 'live-report' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Open Live Report
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button
              onClick={resetWorkspace}
              className="px-2.5 py-1.5 rounded text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
              title="Reset all selections and start fresh"
            >
              <RotateCcw size={12} />
              Refresh
            </button>
            <button
              onClick={saveWorkspace}
              className="px-2.5 py-1.5 rounded text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
              title="Save workspace to browser memory"
            >
              <Save size={12} />
              Save
            </button>
            <button
              onClick={() => setMemoryReportOpen((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 ${memoryReportOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              title="View saved workspace memory"
            >
              <History size={12} />
              Memory
            </button>
            <button
              onClick={printWorkspaceSummary}
              className="px-2.5 py-1.5 rounded text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
              title="Print workspace summary"
            >
              <Printer size={12} />
              Print
            </button>
          </div>
          <p className="text-xs text-slate-500">{lastSavedAt ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()} \u2022 ` : ''}Objective {objectiveReady ? 'ready' : 'not ready'} \u2022 Steps {completedStepCount}/10 \u2022 Score {weightedScore.toFixed(0)} \u2022 Decision {decisionOutcome}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {chatMessages.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickActions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => applyQuickAction(item)}
                    className="text-left p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon size={14} className="text-blue-600" />
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{item.hint}</p>
                    <p className="text-[11px] text-slate-700 mb-1">{item.explanation}</p>
                    <p className="text-[10px] text-blue-700">Affects steps: {item.steps.join(', ')} • {item.outputImpact}</p>
                  </button>
                ))}
              </div>
            )}

            {activeQuickAction && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                Active quick action: <span className="font-semibold">{quickActions.find((q) => q.id === activeQuickAction)?.label}</span>. This preloads relevant steps and biases output emphasis; you can still edit everything manually.
              </div>
            )}

            {memoryReportOpen && (
              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <History size={14} className="text-blue-600" />
                    <p className="text-sm font-semibold text-slate-800">Memory Report</p>
                  </div>
                  <button onClick={() => setMemoryReportOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                </div>
                {lastSavedAt ? (
                  <div className="space-y-2 text-xs text-slate-600">
                    <p>Last saved: <span className="font-semibold text-slate-800">{new Date(lastSavedAt).toLocaleString()}</span></p>
                    <div className="grid grid-cols-2 gap-2">
                      <p>Steps configured: <span className="font-semibold">{Object.values(stepSelections).filter(a => a.length > 0).length}/10</span></p>
                      <p>Chat messages: <span className="font-semibold">{chatMessages.length}</span></p>
                      <p>Active reports: <span className="font-semibold">{selectedReports.length}</span></p>
                      <p>Active letters: <span className="font-semibold">{selectedLetters.length}</span></p>
                      <p>Score: <span className="font-semibold">{weightedScore.toFixed(0)}/100</span></p>
                      <p>Decision: <span className="font-semibold">{decisionOutcome}</span></p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <button onClick={saveWorkspace} className="px-3 py-1.5 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700">Save Now</button>
                      <button onClick={loadWorkspaceMemory} className="px-3 py-1.5 rounded text-xs font-medium bg-slate-200 text-slate-700 hover:bg-slate-300">Restore Last Save</button>
                      <button onClick={clearWorkspaceMemory} className="px-3 py-1.5 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100">Clear Memory</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">
                    <p>No saved workspace found. Click <strong>Save</strong> in the toolbar to store your current work.</p>
                    <p className="mt-1">Saved data includes: step selections, chat history, scores, output choices, and quick action state.</p>
                    <button onClick={saveWorkspace} className="mt-2 px-3 py-1.5 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700">Save Now</button>
                  </div>
                )}
              </div>
            )}

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <p className="font-semibold text-slate-700 mb-1">Personalise your report</p>
              <p>Use the <button onClick={() => { setSidebarOpen(true); setActiveTab('intake'); }} className="text-blue-600 hover:underline font-medium">Intake tab</button> to set organization details, then <button onClick={() => { setSidebarOpen(true); setActiveTab('steps'); }} className="text-blue-600 hover:underline font-medium">10 Steps</button> to define your requirements. Your selections in the sidebar directly shape which reports and letters are generated and how they are tailored. Open <button onClick={() => { setSidebarOpen(true); setActiveTab('outputs'); }} className="text-blue-600 hover:underline font-medium">Outputs</button> to choose specific documents, and <button onClick={() => { setSidebarOpen(true); setActiveTab('uploads'); }} className="text-blue-600 hover:underline font-medium">Uploads</button> to attach evidence that strengthens the final draft.</p>
            </div>

            {mainMode === 'live-report' && (
              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <p className="text-sm font-semibold text-slate-800 mb-2">Live Report Context</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                  <p><strong>Organization:</strong> {params.organizationName || '—'}</p>
                  <p><strong>Location:</strong> {params.country || '—'}</p>
                  <p><strong>Report:</strong> {params.reportName || '—'}</p>
                  <p><strong>Evidence Files:</strong> {uploadedDocs.length}</p>
                  <p><strong>Decision Track:</strong> {decisionTrack === 'known_target' ? 'Known Target' : 'Discovery Target'}</p>
                  <p><strong>Schema:</strong> {schemaCompletedCount}/13 complete</p>
                  <p><strong>Gates:</strong> {allGatesPass ? 'Passed' : 'Pending'}</p>
                  <p><strong>Decision:</strong> {decisionOutcome}</p>
                  <p><strong>Score:</strong> {weightedScore.toFixed(1)} / 100</p>
                  <p><strong>Confidence:</strong> {confidenceLevel}</p>
                  <p className="md:col-span-2"><strong>Objective:</strong> {params.problemStatement || '—'}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                  <p className="text-xs font-semibold text-slate-700">Weighted Scoring</p>
                  {(Object.keys(scoreWeights) as ScoreDimension[]).map((key) => (
                    <div key={key} className="grid grid-cols-12 gap-2 items-center text-xs">
                      <label className="col-span-5 text-slate-600">{scoreLabels[key]} ({scoreWeights[key]})</label>
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={1}
                        value={dimensionScores[key]}
                        onChange={(e) => setDimensionScores((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                        className="col-span-5"
                      />
                      <span className="col-span-2 text-right font-semibold text-slate-700">{dimensionScores[key]}/5</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-12 gap-2 items-center text-xs">
                    <label className="col-span-5 text-slate-600">Confidence</label>
                    <select
                      value={confidenceLevel}
                      onChange={(e) => setConfidenceLevel(e.target.value as ConfidenceLevel)}
                      className="col-span-7 border border-slate-300 px-2 py-1 rounded"
                    >
                      <option value="high">high</option>
                      <option value="medium">medium</option>
                      <option value="low">low</option>
                    </select>
                  </div>
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
