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
import AdaptiveQuestionnaire from '../services/AdaptiveQuestionnaire';
import { BWConsultantAgenticAI } from '../services/BWConsultantAgenticAI';
import CaseStudyAnalyzer from '../services/CaseStudyAnalyzer';
import CaseGraphBuilder, { type CaseGraph } from '../services/CaseGraphBuilder';
import RecommendationScorer, { type RecommendationScore } from '../services/RecommendationScorer';

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
  userName: string;
  organizationName: string;
  organizationType: string;
  contactRole: string;
  country: string;
  jurisdiction: string;
  organizationMandate: string;
  targetAudience: string;
  decisionDeadline: string;
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
  rationale: string;
  pageRange: string;
  supportingDocuments: string[];
  contactLetterFor?: string;
}

interface JurisdictionPolicyPack {
  id: string;
  label: string;
  triggers: string[];
  regulatoryTone: 'government-formal' | 'investor-formal' | 'legal-defensive' | 'executive-brief';
  requiredSupportDocuments: string[];
  requiredLetters: string[];
  complianceFocus: string[];
}

const JURISDICTION_POLICY_PACKS: JurisdictionPolicyPack[] = [
  {
    id: 'australia',
    label: 'Australia Regulatory Pack',
    triggers: ['australia', 'au', 'queensland', 'nsw', 'victoria', 'wa'],
    regulatoryTone: 'government-formal',
    requiredSupportDocuments: ['Regulatory obligations matrix', 'Risk register', 'Financial model'],
    requiredLetters: ['Agency submission letter', 'Stakeholder engagement letter'],
    complianceFocus: ['Environmental compliance', 'Procurement governance', 'State/federal approvals']
  },
  {
    id: 'philippines',
    label: 'Philippines Compliance Pack',
    triggers: ['philippines', 'ph', 'manila', 'cebu', 'mindanao'],
    regulatoryTone: 'government-formal',
    requiredSupportDocuments: ['LGU alignment note', 'Implementation roadmap', 'Socioeconomic impact annex'],
    requiredLetters: ['LGU coordination letter', 'National agency submission letter'],
    complianceFocus: ['National/local permitting', 'PPP alignment', 'Community impact']
  },
  {
    id: 'eu',
    label: 'EU Governance Pack',
    triggers: ['european union', 'eu', 'germany', 'france', 'italy', 'spain', 'netherlands'],
    regulatoryTone: 'legal-defensive',
    requiredSupportDocuments: ['Data protection note', 'Compliance control matrix', 'Assurance checklist'],
    requiredLetters: ['Regulatory notice letter', 'Partner compliance undertaking letter'],
    complianceFocus: ['Cross-border compliance', 'Transparency controls', 'Data/privacy obligations']
  },
  {
    id: 'mena',
    label: 'MENA Investment Pack',
    triggers: ['saudi', 'uae', 'qatar', 'oman', 'bahrain', 'kuwait', 'middle east'],
    regulatoryTone: 'investor-formal',
    requiredSupportDocuments: ['Investment structure brief', 'Sovereign risk profile', 'Execution governance plan'],
    requiredLetters: ['Investor submission letter', 'Government liaison letter'],
    complianceFocus: ['Investment approvals', 'Institutional counterpart alignment', 'Execution governance']
  }
];

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
    userName: '',
    organizationName: '',
    organizationType: '',
    contactRole: '',
    country: '',
    jurisdiction: '',
    organizationMandate: '',
    targetAudience: '',
    decisionDeadline: '',
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
  const [allowAllDocumentAccess, setAllowAllDocumentAccess] = useState(false);
  const [adaptiveQuestionsAsked, setAdaptiveQuestionsAsked] = useState(0);
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert' | 'custom'>('beginner');
  const [readinessScore, setReadinessScore] = useState(0);
  const [caseGraph, setCaseGraph] = useState<CaseGraph | null>(null);
  const [recommendationRationaleMap, setRecommendationRationaleMap] = useState<Record<string, string>>({});
  const [recommendationScoreMap, setRecommendationScoreMap] = useState<Record<string, RecommendationScore>>({});

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSession = useRef(getChatSession());
  const intakeQuestionIndex = useRef(0);
  const agenticAIRef = useRef(new BWConsultantAgenticAI());

  // Intake questions progression
  const intakeQuestions = [
    {
      key: 'userName',
      question: `Hello, I'm your BW Consultant AI. I will build your case file, diagnose your situation, and recommend the right reports, documents, and letters.

Let's start properly:

**What is your full name?**`
    },
    {
      key: 'organizationName',
      question: `Great. **What organization do you represent?**`
    },
    {
      key: 'organizationType',
      question: `**What type of organization is it?** (government agency, private company, NGO, investor, legal advisory, regional council, etc.)`
    },
    {
      key: 'contactRole',
      question: `**What is your role and decision authority?** (e.g., CEO, legal counsel, policy director, project lead)`
    },
    {
      key: 'country',
      question: `**Which country and region are you operating in?**`
    },
    {
      key: 'jurisdiction',
      question: `**What legal/regulatory jurisdiction should this follow?** (national, state/provincial, international standard, mixed)`
    },
    {
      key: 'organizationMandate',
      question: `**What mandate are you accountable for?** (investment attraction, compliance, procurement, partnerships, litigation, policy delivery, etc.)`
    },
    {
      key: 'situationType',
      question: `**What type of matter is this?** (investment, partnership, market entry, compliance, dispute, strategic decision, due diligence)`
    },
    {
      key: 'currentMatter',
      question: `Now detail the case:

**What exactly is happening, who is involved, and what decision must be made?**`
    },
    {
      key: 'objectives',
      question: `**What is your objective and desired outcome?** Include measurable targets if possible.`
    },
    {
      key: 'targetAudience',
      question: `**Who is the primary audience for final outputs?** (board, regulator, ministry, investor, partner, court, internal executive team)`
    },
    {
      key: 'decisionDeadline',
      question: `**What is your decision deadline / timeline?**`
    },
    {
      key: 'constraints',
      question: `Final intake question:

**What constraints must be respected?** (budget, timeline, politics, compliance, resources, stakeholder sensitivity)`
    }
  ];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Intake questions (static)
  const intakeQuestionsRef = useRef(intakeQuestions);

  const computeReadiness = useCallback((draft: CaseStudy) => {
    const weightedChecks = [
      { ok: draft.userName.length > 1, weight: 8 },
      { ok: draft.organizationName.length > 1, weight: 8 },
      { ok: draft.organizationType.length > 2, weight: 8 },
      { ok: draft.contactRole.length > 2, weight: 8 },
      { ok: draft.country.length > 1, weight: 8 },
      { ok: draft.jurisdiction.length > 1, weight: 8 },
      { ok: draft.organizationMandate.length > 2, weight: 8 },
      { ok: draft.currentMatter.length > 40, weight: 14 },
      { ok: draft.objectives.length > 20, weight: 10 },
      { ok: draft.constraints.length > 10, weight: 8 },
      { ok: draft.targetAudience.length > 2, weight: 8 },
      { ok: draft.decisionDeadline.length > 2, weight: 4 }
    ];

    const baseScore = weightedChecks.reduce((sum, item) => sum + (item.ok ? item.weight : 0), 0);
    const evidenceBoost = Math.min(10, draft.uploadedDocuments.length * 5);
    const contextBoost = Math.min(10, draft.additionalContext.length * 2);
    return Math.min(100, baseScore + evidenceBoost + contextBoost);
  }, []);

  const toAgenticParams = useCallback((draft: CaseStudy) => ({
    organizationName: draft.organizationName,
    organizationType: draft.organizationType,
    role: draft.contactRole,
    country: draft.country,
    region: draft.jurisdiction,
    problemStatement: draft.currentMatter,
    strategicObjective: draft.objectives,
    audience: draft.targetAudience,
    constraints: draft.constraints,
    mandate: draft.organizationMandate,
    timeline: draft.decisionDeadline,
    context: draft.additionalContext
  }), []);

  const resolvePolicyPack = useCallback((draft: CaseStudy): JurisdictionPolicyPack => {
    const context = `${draft.country} ${draft.jurisdiction}`.toLowerCase();
    const matched = JURISDICTION_POLICY_PACKS.find((pack) =>
      pack.triggers.some((trigger) => context.includes(trigger))
    );

    return matched || {
      id: 'global-default',
      label: 'Global Advisory Pack',
      triggers: [],
      regulatoryTone: 'executive-brief',
      requiredSupportDocuments: ['Decision brief', 'Risk register', 'Stakeholder map'],
      requiredLetters: ['Primary counterpart letter'],
      complianceFocus: ['Cross-jurisdiction consistency', 'Traceable assumptions']
    };
  }, []);

  useEffect(() => {
    setReadinessScore(computeReadiness(caseStudy));
    const detected = AdaptiveQuestionnaire.detectSkillLevel({
      organizationName: caseStudy.organizationName,
      strategicIntent: caseStudy.objectives,
      customData: {
        mandate: caseStudy.organizationMandate,
        audience: caseStudy.targetAudience,
        jurisdiction: caseStudy.jurisdiction,
        constraints: caseStudy.constraints
      }
    });
    setSkillLevel(detected);
  }, [caseStudy, computeReadiness]);

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
      const policyPack = resolvePolicyPack(caseStudy);
      const systemPrompt = `You are BW Consultant AI, an expert business intelligence consultant. You are currently in the "${currentPhase}" phase of building a case study.

Current case context:
${JSON.stringify(caseStudy, null, 2)}

Applicable policy pack:
${JSON.stringify(policyPack, null, 2)}

User's latest input: "${userInput}"
Phase context: ${context}

Instructions based on phase:
- INTAKE: Ask clarifying questions to gather baseline information. Be warm but professional.
- DISCOVERY: Probe deeper into the specifics. Ask about stakeholders, risks, opportunities, and details not yet covered.
- ANALYSIS: Synthesize what you've learned. Identify patterns, risks, and opportunities.
- RECOMMENDATIONS: Based on the case, recommend specific documents and letters that would help.
- GENERATION: Generate professional document content.

Policy pack execution rules:
- Respect regulatory tone: ${policyPack.regulatoryTone}
- Ensure required support docs are reflected: ${policyPack.requiredSupportDocuments.join(', ')}
- Ensure required letters are reflected: ${policyPack.requiredLetters.join(', ')}
- Emphasize compliance focus: ${policyPack.complianceFocus.join(', ')}

Respond naturally and helpfully. If in intake/discovery, end with a clarifying question. Keep responses focused and actionable.`;

      const response = await chatSession.current.sendMessage({ 
        message: `${systemPrompt}\n\nUser says: ${userInput}` 
      });
      
      return response.text || "I understand. Let me process that information.";
    } catch (error) {
      console.error('AI processing error:', error);
      return "I'm having trouble connecting to my analysis engine. Let me continue with what I understand so far.";
    }
  }, [currentPhase, caseStudy, resolvePolicyPack]);

  // Handle intake progression
  const progressIntake = useCallback((userResponse: string) => {
    const currentQ = intakeQuestionsRef.current[intakeQuestionIndex.current];
    
    // Update case study based on which question was answered
    switch (currentQ.key) {
      case 'userName':
        setCaseStudy(prev => ({ ...prev, userName: userResponse }));
        break;
      case 'organizationName':
        setCaseStudy(prev => ({ ...prev, organizationName: userResponse }));
        break;
      case 'organizationType':
        setCaseStudy(prev => ({ ...prev, organizationType: userResponse }));
        break;
      case 'contactRole':
        setCaseStudy(prev => ({ ...prev, contactRole: userResponse }));
        break;
      case 'country':
        setCaseStudy(prev => ({ ...prev, country: userResponse }));
        break;
      case 'jurisdiction':
        setCaseStudy(prev => ({ ...prev, jurisdiction: userResponse }));
        break;
      case 'organizationMandate':
        setCaseStudy(prev => ({ ...prev, organizationMandate: userResponse }));
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
      case 'targetAudience':
        setCaseStudy(prev => ({ ...prev, targetAudience: userResponse }));
        break;
      case 'decisionDeadline':
        setCaseStudy(prev => ({ ...prev, decisionDeadline: userResponse }));
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
    const audience = caseStudy.targetAudience.toLowerCase();
    const policyPack = resolvePolicyPack(caseStudy);
    const hasRegulatoryAudience = /regulator|ministry|government|court|compliance/.test(audience);
    const hasInvestorAudience = /investor|board|fund|vc|capital/.test(audience);
    
    // Investment/funding situations
    if (caseType.includes('invest') || caseType.includes('fund')) {
      docs.push(
        {
          id: 'investment-memo',
          title: 'Investment Memorandum',
          description: 'Structured funding proposal for decision makers',
          icon: <BarChart3 size={18} />,
          category: 'report',
          relevance: 95,
          rationale: 'Best fit for capital allocation decisions and investor due diligence.',
          pageRange: '12-25 pages',
          supportingDocuments: ['Financial model', 'Market assumptions', 'Risk register'],
          contactLetterFor: 'Investor committee'
        },
        {
          id: 'due-diligence',
          title: 'Due Diligence Report',
          description: 'Comprehensive risk, compliance, and viability analysis',
          icon: <Shield size={18} />,
          category: 'report',
          relevance: 90,
          rationale: 'Required to validate claims, risks, and assumptions before commitment.',
          pageRange: '15-30 pages',
          supportingDocuments: ['Corporate filings', 'Ownership records', 'Contracts'],
          contactLetterFor: 'External reviewer'
        },
        {
          id: 'investor-update',
          title: 'Investor Update Letter',
          description: 'Formal communication for investor/stakeholder updates',
          icon: <FileText size={18} />,
          category: 'letter',
          relevance: 70,
          rationale: 'Keeps decision stakeholders aligned with current case status and asks.',
          pageRange: '1-2 pages',
          supportingDocuments: ['Executive summary'],
          contactLetterFor: 'Investors and board'
        }
      );
    }
    
    // Partnership situations
    if (caseType.includes('partner') || caseType.includes('joint') || caseType.includes('jv')) {
      docs.push(
        {
          id: 'partnership-letter',
          title: 'Partnership Proposal Letter',
          description: 'Formal outreach letter for counterpart engagement',
          icon: <Mail size={18} />,
          category: 'letter',
          relevance: 95,
          rationale: 'Creates structured first contact with clear terms and value proposition.',
          pageRange: '1-3 pages',
          supportingDocuments: ['One-page project brief', 'Counterparty profile'],
          contactLetterFor: 'Target partner leadership'
        },
        {
          id: 'stakeholder-report',
          title: 'Stakeholder Analysis Report',
          description: 'Relationship map, influence matrix, and alignment plan',
          icon: <Users size={18} />,
          category: 'report',
          relevance: 85,
          rationale: 'Reduces partnership execution risk by clarifying influence and incentives.',
          pageRange: '8-14 pages',
          supportingDocuments: ['Stakeholder list', 'Engagement history'],
          contactLetterFor: 'Stakeholder outreach'
        },
        {
          id: 'due-diligence',
          title: 'Partner Due Diligence',
          description: 'Counterparty vetting and risk profile',
          icon: <Shield size={18} />,
          category: 'report',
          relevance: 80,
          rationale: 'Validates partner credibility, track record, and legal exposure.',
          pageRange: '10-20 pages',
          supportingDocuments: ['Legal records', 'Financial statements'],
          contactLetterFor: 'Compliance / legal counterpart'
        }
      );
    }
    
    // Market entry
    if (caseType.includes('market') || caseType.includes('entry') || caseType.includes('expan')) {
      docs.push(
        {
          id: 'country-brief',
          title: 'Market Intelligence Brief',
          description: 'Country/region analysis for entry decisions',
          icon: <Globe size={18} />,
          category: 'report',
          relevance: 95,
          rationale: 'Assesses jurisdiction, market dynamics, and entry barriers by location.',
          pageRange: '10-18 pages',
          supportingDocuments: ['Regulatory profile', 'Competitor map', 'Demand indicators'],
          contactLetterFor: 'Trade/investment authority'
        },
        {
          id: 'executive-report',
          title: 'Executive Summary',
          description: 'Decision-ready summary for leadership',
          icon: <Briefcase size={18} />,
          category: 'report',
          relevance: 85,
          rationale: 'Provides concise direction for go/no-go or phase-gate decisions.',
          pageRange: '3-6 pages',
          supportingDocuments: ['Core case facts', 'Risk summary'],
          contactLetterFor: 'Board or executive team'
        }
      );
    }
    
    // Regulatory/compliance
    if (caseType.includes('regul') || caseType.includes('compli') || caseType.includes('legal')) {
      docs.push(
        {
          id: 'compliance-report',
          title: 'Compliance Assessment',
          description: 'Regulatory obligations, gaps, and mitigation plan',
          icon: <Scale size={18} />,
          category: 'report',
          relevance: 95,
          rationale: 'Essential when regulatory exposure influences approval or viability.',
          pageRange: '12-24 pages',
          supportingDocuments: ['Applicable laws', 'Licensing checklist', 'Control matrix'],
          contactLetterFor: 'Regulator / legal counsel'
        },
        {
          id: 'govt-submission',
          title: 'Government Submission Letter',
          description: 'Official submission letter for agencies and regulators',
          icon: <FileCheck size={18} />,
          category: 'letter',
          relevance: 90,
          rationale: 'Required formal communication to initiate or support official review.',
          pageRange: '1-3 pages',
          supportingDocuments: ['Compliance report', 'Annexures'],
          contactLetterFor: 'Agency focal point'
        }
      );
    }

    if (hasRegulatoryAudience && !docs.find(d => d.id === 'govt-submission')) {
      docs.push({
        id: 'govt-submission',
        title: 'Government Submission Letter',
        description: 'Formal agency/regulator communication',
        icon: <FileCheck size={18} />,
        category: 'letter',
        relevance: 86,
        rationale: 'Audience includes regulator/ministry, so formal submission letter is advised.',
        pageRange: '1-2 pages',
        supportingDocuments: ['Executive summary', 'Compliance annex'],
        contactLetterFor: 'Regulatory authority'
      });
    }

    if (hasInvestorAudience && !docs.find(d => d.id === 'investment-memo')) {
      docs.push({
        id: 'investment-memo',
        title: 'Investment Memorandum',
        description: 'Investor decision package',
        icon: <BarChart3 size={18} />,
        category: 'report',
        relevance: 88,
        rationale: 'Audience includes investment decision makers requiring structured rationale.',
        pageRange: '10-20 pages',
        supportingDocuments: ['Financial model', 'Risk appendix'],
        contactLetterFor: 'Investment committee'
      });
    }
    
    // Always offer executive summary and custom
    if (!docs.find(d => d.id === 'executive-report')) {
      docs.push({
        id: 'executive-report',
        title: 'Executive Summary',
        description: 'Leadership overview',
        icon: <Briefcase size={18} />,
        category: 'report',
        relevance: 60,
        rationale: 'Universal output to summarize findings and recommended action.',
        pageRange: '2-5 pages',
        supportingDocuments: ['Key findings', 'Decision options']
      });
    }
    docs.push({
      id: 'custom',
      title: 'Custom Document',
      description: 'Specify your needs',
      icon: <PenTool size={18} />,
      category: 'report',
      relevance: 50,
      rationale: 'Use when specialized format or policy template is required.',
      pageRange: '1-40 pages (user defined)',
      supportingDocuments: ['User-provided outline']
    });
    
    // Policy-pack required outputs (documents)
    policyPack.requiredSupportDocuments.forEach((requiredDoc, index) => {
      if (!docs.find(d => d.title.toLowerCase() === requiredDoc.toLowerCase())) {
        docs.push({
          id: `policy-doc-${index}`,
          title: requiredDoc,
          description: `${policyPack.label} required support document`,
          icon: <FileText size={18} />,
          category: 'report',
          relevance: 84 - index,
          rationale: `Required by ${policyPack.label} for jurisdictional completeness.`,
          pageRange: '2-8 pages',
          supportingDocuments: ['Jurisdiction notes', 'Case facts'],
          contactLetterFor: 'Review authority'
        });
      }
    });

    // Policy-pack required outputs (letters)
    policyPack.requiredLetters.forEach((requiredLetter, index) => {
      if (!docs.find(d => d.title.toLowerCase() === requiredLetter.toLowerCase())) {
        docs.push({
          id: `policy-letter-${index}`,
          title: requiredLetter,
          description: `${policyPack.label} required letter`,
          icon: <Mail size={18} />,
          category: 'letter',
          relevance: 82 - index,
          rationale: `Required by ${policyPack.label} to support formal communication.`,
          pageRange: '1-2 pages',
          supportingDocuments: policyPack.requiredSupportDocuments,
          contactLetterFor: requiredLetter.replace(/letter/i, '').trim() || 'Primary counterpart'
        });
      }
    });

    const graph = CaseGraphBuilder.build(caseStudy);
    setCaseGraph(graph);

    const scored = RecommendationScorer.rank({
      candidates: docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        relevance: doc.relevance,
        rationale: doc.rationale,
        supportingDocuments: doc.supportingDocuments
      })),
      graph,
      context: {
        targetAudience: caseStudy.targetAudience,
        jurisdiction: `${caseStudy.country} ${caseStudy.jurisdiction}`,
        decisionDeadline: caseStudy.decisionDeadline,
        situationType: caseStudy.situationType,
        constraints: caseStudy.constraints
      }
    });

    const scoreMap = new Map(scored.map((item) => [item.id, item]));
    const enrichedDocs = docs
      .map((doc) => {
        const score = scoreMap.get(doc.id);
        if (!score) return doc;
        return {
          ...doc,
          relevance: Math.round(score.total),
          rationale: `${doc.rationale} ${score.rationale}`
        };
      })
      .sort((a, b) => b.relevance - a.relevance);

    setRecommendationRationaleMap(
      scored.reduce<Record<string, string>>((acc, item) => {
        acc[item.id] = item.rationale;
        return acc;
      }, {})
    );

    setRecommendationScoreMap(
      scored.reduce<Record<string, RecommendationScore>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {})
    );

    setRecommendedDocs(enrichedDocs);
  }, [caseStudy, resolvePolicyPack]);

  // Handle send message
  const handleSend = useCallback(async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    let userContent = inputValue.trim();
    
    const discoveredDocs: DocumentOption[] = [];

    // Process uploaded files
    if (uploadedFiles.length > 0) {
      const fileContents = await Promise.all(uploadedFiles.map(readFileContent));
      userContent += `\n\n**Uploaded Documents:**\n${fileContents.join('\n\n')}`;

      for (let index = 0; index < uploadedFiles.length; index += 1) {
        const file = uploadedFiles[index];
        const fileContent = fileContents[index] || '';
        if (fileContent.length < 400 || file.name.toLowerCase().endsWith('.pdf')) {
          continue;
        }

        try {
          const analysis = CaseStudyAnalyzer.analyze(file.name, fileContent);
          const summary = CaseStudyAnalyzer.toConsultantSummary(analysis);
          setCaseStudy(prev => ({
            ...prev,
            aiInsights: [...prev.aiInsights, summary],
            additionalContext: [...prev.additionalContext, `Uploaded analysis: ${analysis.title}`]
          }));

          analysis.suggestedDocuments.slice(0, 3).forEach((docName, suggestionIndex) => {
            discoveredDocs.push({
              id: `case-doc-${index}-${suggestionIndex}`,
              title: docName,
              description: `Suggested from uploaded case study (${analysis.country} / ${analysis.sector})`,
              icon: <FileText size={18} />,
              category: 'report',
              relevance: Math.max(65, analysis.scores.overallViability - suggestionIndex * 5),
              rationale: 'Derived from uploaded case-study analysis and NSIL-style scoring diagnostics.',
              pageRange: '8-20 pages',
              supportingDocuments: ['Uploaded case evidence', 'Historical parallels'],
              contactLetterFor: analysis.stakeholders[0]
            });
          });

          analysis.suggestedLetters.slice(0, 2).forEach((letterName, suggestionIndex) => {
            discoveredDocs.push({
              id: `case-letter-${index}-${suggestionIndex}`,
              title: letterName,
              description: `Stakeholder letter generated from case analysis`,
              icon: <Mail size={18} />,
              category: 'letter',
              relevance: 72 - suggestionIndex * 4,
              rationale: 'Recommended to support contact and alignment with key counterparties.',
              pageRange: '1-2 pages',
              supportingDocuments: ['Executive summary', 'Case-specific annexures'],
              contactLetterFor: analysis.stakeholders[suggestionIndex] || 'Primary stakeholder'
            });
          });
        } catch (analysisError) {
          console.warn('CaseStudyAnalyzer skipped file:', file.name, analysisError);
        }
      }

      setCaseStudy(prev => ({
        ...prev,
        uploadedDocuments: [...prev.uploadedDocuments, ...uploadedFiles.map(f => f.name)]
      }));

      if (discoveredDocs.length > 0) {
        setRecommendedDocs(prev => {
          const existing = new Set(prev.map(item => item.title.toLowerCase()));
          const merged = [...prev];
          discoveredDocs.forEach(item => {
            if (!existing.has(item.title.toLowerCase())) {
              merged.push(item);
            }
          });
          return merged.sort((a, b) => b.relevance - a.relevance);
        });
      }
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
          setAdaptiveQuestionsAsked(0);
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
        const liveReadiness = computeReadiness(caseStudy);

        try {
          const agenticInsights = await agenticAIRef.current.consult(toAgenticParams(caseStudy), 'case_discovery');
          if (agenticInsights.length > 0) {
            const insightSummary = agenticInsights
              .slice(0, 2)
              .map((insight) => `• ${insight.title}: ${insight.content}`)
              .join('\n');

            setCaseStudy(prev => ({
              ...prev,
              aiInsights: [...prev.aiInsights, ...agenticInsights.slice(0, 2).map(i => `${i.title}: ${i.content}`)]
            }));

            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: 'system',
              content: `NSIL Agentic Insight\n${insightSummary}`,
              timestamp: new Date(),
              phase: 'discovery'
            }]);
          }
        } catch (agenticError) {
          console.warn('Agentic insight generation failed:', agenticError);
        }

        // AI-driven discovery
        responseContent = await processWithAI(
          userContent,
          `Continue gathering information. If you have enough context (organization, situation, objectives, constraints, key details), transition to analysis by summarizing what you understand and asking if anything is missing. Otherwise, ask another clarifying question.`
        );
        
        setCaseStudy(prev => ({
          ...prev,
          additionalContext: [...prev.additionalContext, userContent]
        }));

        const adaptiveFollowUp = AdaptiveQuestionnaire.getNextQuestion(
          skillLevel,
          {
            organizationName: caseStudy.organizationName,
            strategicIntent: caseStudy.objectives,
            customData: {
              mandate: caseStudy.organizationMandate,
              jurisdiction: caseStudy.jurisdiction,
              audience: caseStudy.targetAudience,
              latestInput: userContent
            }
          },
          adaptiveQuestionsAsked
        );

        // Check if ready to move to recommendations
        const discoveryCount = messages.filter(m => m.phase === 'discovery' && m.role === 'user').length;
        if (liveReadiness >= 80 || discoveryCount >= 5) {
          setCurrentPhase('analysis');
          generateRecommendations();
        } else if (adaptiveFollowUp && adaptiveQuestionsAsked < 4) {
          responseContent += `\n\nTo improve your case precision, I need one more detail:\n${adaptiveFollowUp}`;
          setAdaptiveQuestionsAsked(prev => prev + 1);
        }
      } else if (currentPhase === 'analysis') {
        responseContent = await processWithAI(
          userContent,
          `You are now analyzing the case. Provide a brief synthesis of what you understand, identify key insights, and transition to recommending specific documents that would help this situation.`
        );
        setCurrentPhase('recommendations');
        generateRecommendations();
      } else if (currentPhase === 'recommendations') {
        if (readinessScore < 80) {
          setCurrentPhase('discovery');
          responseContent = `Your case file readiness is currently ${readinessScore}%. I need a little more information before recommending final outputs. Please provide more detail on stakeholders, evidence, and decision constraints.`;
        } else {
        // User is selecting documents
        responseContent = await processWithAI(
          userContent,
          `User is in document selection phase. Help them choose the right documents or proceed to generation if they've selected.`
        );
        }
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
  }, [
    inputValue,
    uploadedFiles,
    currentPhase,
    readFileContent,
    progressIntake,
    processWithAI,
    generateRecommendations,
    messages,
    adaptiveQuestionsAsked,
    caseStudy,
    computeReadiness,
    readinessScore,
    skillLevel,
    toAgenticParams
  ]);

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
    if (readinessScore < 80) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Your case file readiness is ${readinessScore}%. I need at least 80% before final generation. Please continue answering clarifying questions or upload supporting evidence.`,
        timestamp: new Date(),
        phase: 'recommendations'
      }]);
      return;
    }
    if (!allowAllDocumentAccess) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Please enable access to all relevant uploaded material before final generation. This improves accuracy, page estimates, and evidence traceability.',
        timestamp: new Date(),
        phase: 'recommendations'
      }]);
      return;
    }
    
    setCurrentPhase('generation');
    setIsLoading(true);
    
    const docNames = selectedDocs.map(id => recommendedDocs.find(d => d.id === id)?.title).filter(Boolean).join(', ');
    
    try {
      const response = await processWithAI(
        `Generate the following documents: ${docNames}`,
        `Based on the complete case study, generate professional document content for: ${docNames}. Format with proper markdown headings, sections, and professional language. Include all relevant details from the case study.

Each selected output must include:
- Why this output is appropriate for ${caseStudy.targetAudience || 'the target audience'}
- Estimated page length
- Required support documents/annexures
- Contact letter guidance where relevant`
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
  }, [selectedDocs, readinessScore, allowAllDocumentAccess, recommendedDocs, processWithAI, caseStudy.targetAudience]);

  // Phase indicator
  const phaseLabels: Record<CasePhase, { label: string; description: string }> = {
    intake: { label: 'Intake', description: 'Understanding who you are' },
    discovery: { label: 'Discovery', description: 'Learning about your situation' },
    analysis: { label: 'Analysis', description: 'Synthesizing insights' },
    recommendations: { label: 'Recommendations', description: 'Selecting documents' },
    generation: { label: 'Generation', description: 'Creating your documents' }
  };

  const primaryRecommendation =
    recommendedDocs.find((doc) => selectedDocs.includes(doc.id)) ||
    recommendedDocs[0] ||
    null;

  const alternativeRecommendations = primaryRecommendation
    ? recommendedDocs.filter((doc) => doc.id !== primaryRecommendation.id).slice(0, 2)
    : [];

  const getRankUpgradeHint = useCallback((alternativeId: string) => {
    if (!primaryRecommendation) return null;

    const primaryScore = recommendationScoreMap[primaryRecommendation.id];
    const altScore = recommendationScoreMap[alternativeId];
    if (!primaryScore || !altScore) return null;

    const gaps = [
      { key: 'fit', delta: primaryScore.fitScore - altScore.fitScore },
      { key: 'evidence', delta: primaryScore.evidenceScore - altScore.evidenceScore },
      { key: 'urgency', delta: primaryScore.urgencyScore - altScore.urgencyScore },
      { key: 'compliance', delta: primaryScore.complianceScore - altScore.complianceScore }
    ]
      .filter((item) => item.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 2)
      .map((item) => item.key);

    const suggestions: string[] = [];

    if (gaps.includes('fit')) {
      suggestions.push('tighten objective/audience alignment in your case description');
    }
    if (gaps.includes('evidence')) {
      suggestions.push('add stronger supporting documents or quantified evidence');
    }
    if (gaps.includes('urgency')) {
      suggestions.push('clarify deadline urgency and decision timeline');
    }
    if (gaps.includes('compliance')) {
      suggestions.push('add jurisdiction-specific compliance details and required annexes');
    }

    if (suggestions.length === 0) {
      return 'This option is already close; add more case detail to improve ranking confidence.';
    }

    return `To rank this #1: ${suggestions.join('; ')}.`;
  }, [primaryRecommendation, recommendationScoreMap]);

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
              <div className="mt-2 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1">
                Policy Pack: {resolvePolicyPack(caseStudy).label}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 border border-blue-200 font-semibold">
                  Readiness: {readinessScore}%
                </span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                  {skillLevel}
                </span>
              </div>
              {caseGraph && (
                <div className="mt-2 text-[11px] text-slate-600 bg-white border border-stone-200 px-2 py-1">
                  Case Graph: confidence {Math.round(caseGraph.summary.confidence)}% • evidence {Math.round(caseGraph.summary.evidenceStrength)}%
                </div>
              )}
              <div className="mt-3 space-y-2 text-xs">
                {caseStudy.userName && (
                  <div className="flex items-start gap-2">
                    <User size={12} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-slate-500">User:</span>
                      <p className="text-slate-700">{caseStudy.userName}</p>
                    </div>
                  </div>
                )}
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
                {caseStudy.country && (
                  <div className="flex items-start gap-2">
                    <Globe size={12} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-slate-500">Jurisdiction:</span>
                      <p className="text-slate-700">{caseStudy.country} / {caseStudy.jurisdiction || 'Not specified'}</p>
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
                          <p className={`text-[11px] mt-1 ${selectedDocs.includes(doc.id) ? 'text-blue-100' : 'text-slate-600'}`}>
                            {doc.rationale}
                          </p>
                          {recommendationRationaleMap[doc.id] && (
                            <p className={`text-[10px] mt-1 ${selectedDocs.includes(doc.id) ? 'text-blue-100' : 'text-slate-500'}`}>
                              {recommendationRationaleMap[doc.id]}
                            </p>
                          )}
                          <p className={`text-[11px] mt-1 ${selectedDocs.includes(doc.id) ? 'text-blue-100' : 'text-slate-600'}`}>
                            Length: {doc.pageRange}
                          </p>
                          {doc.supportingDocuments.length > 0 && (
                            <p className={`text-[10px] mt-1 ${selectedDocs.includes(doc.id) ? 'text-blue-100' : 'text-slate-500'}`}>
                              Support docs: {doc.supportingDocuments.join(', ')}
                            </p>
                          )}
                          {doc.contactLetterFor && (
                            <p className={`text-[10px] mt-1 ${selectedDocs.includes(doc.id) ? 'text-blue-100' : 'text-slate-500'}`}>
                              Contact letter: {doc.contactLetterFor}
                            </p>
                          )}
                        </div>
                        <div className={`text-xs font-medium ${selectedDocs.includes(doc.id) ? 'text-blue-200' : 'text-blue-600'}`}>
                          {doc.relevance}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {primaryRecommendation && (
                  <div className="mt-4 border border-blue-200 bg-blue-50 p-3">
                    <p className="text-[11px] font-semibold text-blue-800">Why Selected</p>
                    <p className="text-xs text-slate-700 mt-1">
                      <strong>{primaryRecommendation.title}</strong> ranks highest for this case based on fit, evidence strength, urgency, and compliance alignment.
                    </p>
                    {recommendationRationaleMap[primaryRecommendation.id] && (
                      <p className="text-[11px] text-slate-600 mt-1">{recommendationRationaleMap[primaryRecommendation.id]}</p>
                    )}

                    {alternativeRecommendations.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold text-slate-700">Why Not Selected (Top Alternatives)</p>
                        <ul className="mt-1 space-y-1">
                          {alternativeRecommendations.map((alt) => {
                            const primaryScore = recommendationScoreMap[primaryRecommendation.id]?.total ?? primaryRecommendation.relevance;
                            const altScore = recommendationScoreMap[alt.id]?.total ?? alt.relevance;
                            const delta = Math.max(0, Math.round(primaryScore - altScore));
                            const upgradeHint = getRankUpgradeHint(alt.id);
                            return (
                              <li key={alt.id} className="text-[11px] text-slate-600">
                                <strong>{alt.title}</strong> scored {delta} points lower due to weaker fit/evidence for current objective, audience, or jurisdiction.
                                {upgradeHint && (
                                  <div className="mt-1 text-[10px] text-blue-700 bg-blue-100 border border-blue-200 p-1.5">
                                    {upgradeHint}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {selectedDocs.length > 0 && currentPhase !== 'generation' && (
                  <>
                    <label className="mt-4 flex items-start gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={allowAllDocumentAccess}
                        onChange={(e) => setAllowAllDocumentAccess(e.target.checked)}
                        className="mt-0.5"
                      />
                      Allow BW Consultant to use all uploaded material for final generation and support-document mapping.
                    </label>
                    <button
                      onClick={handleGenerateDocuments}
                      disabled={isLoading || readinessScore < 80 || !allowAllDocumentAccess}
                      className={`mt-3 w-full py-3 font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                        isLoading || readinessScore < 80 || !allowAllDocumentAccess
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
                    {(readinessScore < 80 || !allowAllDocumentAccess) && (
                      <p className="text-[10px] mt-2 text-amber-700 bg-amber-50 border border-amber-200 p-2">
                        Generation requires readiness ≥ 80 and access permission enabled.
                      </p>
                    )}
                  </>
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
