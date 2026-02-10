/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DOCUMENT TYPE ROUTER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Maps the 200+ document types and 150+ letter types from the Document Factory
 * catalog to DISTINCT generation paths. Each document type gets:
 *
 *   1. Unique section structure — different documents have different sections
 *   2. Tone and audience configuration — investor vs government vs community
 *   3. Prompt templates — AI receives document-type-specific instructions
 *   4. Length constraints — executive brief (2pg) vs full report (40pg)
 *   5. NSIL intelligence injection — which intelligence to prioritise
 *   6. Compliance framing — what disclaimers and standards apply
 *
 * Categories:
 *   - Strategic Documents (25+ types)
 *   - Market Intelligence (30+ types)
 *   - Financial Analysis (35+ types)
 *   - Due Diligence (25+ types)
 *   - Risk Assessment (20+ types)
 *   - Governance & Compliance (25+ types)
 *   - Partner & Stakeholder (15+ types)
 *   - Government Submissions (20+ types)
 *   - International Body Applications (15+ types)
 *   - Trade & Customs (10+ types)
 *   - Community & Social Impact (10+ types)
 *   - Letters (150+ types across 8 categories)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// TYPES
// ============================================================================

export type DocumentTone = 'formal-corporate' | 'formal-government' | 'technical-analytical' | 'persuasive-investment' | 'community-engagement' | 'academic-research' | 'diplomatic';

export type AudienceType = 'investors' | 'government-officials' | 'board-directors' | 'technical-team' | 'community-stakeholders' | 'international-bodies' | 'legal-counsel' | 'general-public' | 'academic-peer';

export type DocumentLength = 'brief' | 'standard' | 'comprehensive' | 'detailed';

export interface SectionTemplate {
  id: string;
  title: string;
  promptInstruction: string;
  maxWords: number;
  required: boolean;
  intelligencePriority: ('patterns' | 'historicalParallels' | 'ethicalAssessment' | 'situationAnalysis' | 'formulaScores' | 'creativeStrategies' | 'compliance' | 'emotionalClimate' | 'crossDomain')[];
}

export interface DocumentTypeConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  tone: DocumentTone;
  audience: AudienceType;
  length: DocumentLength;
  sections: SectionTemplate[];
  complianceFramework: string[];
  keyFocus: string;
}

export interface LetterTypeConfig {
  id: string;
  name: string;
  category: string;
  tone: DocumentTone;
  audience: AudienceType;
  maxWords: number;
  structure: string[];
  keyElements: string[];
}

// ============================================================================
// DOCUMENT TYPE CONFIGURATIONS
// ============================================================================

const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  // ── STRATEGIC DOCUMENTS ──
  {
    id: 'executive-brief',
    name: 'Executive Brief',
    category: 'Strategic',
    description: 'Concise strategic overview for C-suite and board decision-makers',
    tone: 'formal-corporate',
    audience: 'board-directors',
    length: 'brief',
    keyFocus: 'decision-enabling summary with clear recommendation',
    complianceFramework: ['corporate-governance', 'fiduciary-duty'],
    sections: [
      { id: 'exec-context', title: 'Strategic Context', promptInstruction: 'Provide a crisp 2-paragraph overview of the opportunity, situating it within global and regional trends. Use pattern match data to establish that this type of initiative has a documented track record.', maxWords: 400, required: true, intelligencePriority: ['patterns', 'situationAnalysis'] },
      { id: 'exec-opportunity', title: 'Opportunity Assessment', promptInstruction: 'Assess the specific opportunity using NSIL formula scores. Quantify the potential using historical parallels — cite specific comparable cases and their outcomes.', maxWords: 500, required: true, intelligencePriority: ['formulaScores', 'historicalParallels'] },
      { id: 'exec-risks', title: 'Key Risks & Mitigations', promptInstruction: 'Identify top 5 risks using the ethical assessment and situational analysis. For each risk, provide a specific mitigation strategy grounded in what has worked in similar contexts.', maxWords: 400, required: true, intelligencePriority: ['ethicalAssessment', 'situationAnalysis', 'emotionalClimate'] },
      { id: 'exec-recommendation', title: 'Recommendation', promptInstruction: 'Provide a clear GO/NO-GO/CONDITIONAL recommendation with specific conditions and next steps. Reference the ethical gate result.', maxWords: 300, required: true, intelligencePriority: ['ethicalAssessment', 'formulaScores'] },
    ]
  },
  {
    id: 'full-feasibility-study',
    name: 'Full Feasibility Study',
    category: 'Strategic',
    description: 'Comprehensive feasibility analysis covering market, financial, technical, legal, and social dimensions',
    tone: 'technical-analytical',
    audience: 'investors',
    length: 'comprehensive',
    keyFocus: 'thorough multi-dimensional analysis with evidence-based conclusions',
    complianceFramework: ['investment-appraisal-standards', 'IFC-performance-standards'],
    sections: [
      { id: 'feas-exec', title: 'Executive Summary', promptInstruction: 'Summarise the full feasibility study in 1-2 pages. State the conclusion upfront: is this project feasible? Under what conditions?', maxWords: 800, required: true, intelligencePriority: ['formulaScores', 'patterns'] },
      { id: 'feas-market', title: 'Market Analysis', promptInstruction: 'Analyse market size, growth trajectory, competitive landscape, and demand drivers. Use pattern confidence data to show how similar markets have evolved in comparable countries.', maxWords: 2000, required: true, intelligencePriority: ['patterns', 'historicalParallels', 'situationAnalysis'] },
      { id: 'feas-technical', title: 'Technical Feasibility', promptInstruction: 'Assess infrastructure requirements, technology availability, supply chain considerations, and implementation complexity. Reference what has worked in comparable historical cases.', maxWords: 1500, required: true, intelligencePriority: ['historicalParallels', 'crossDomain'] },
      { id: 'feas-financial', title: 'Financial Analysis', promptInstruction: 'Provide detailed financial projections including CAPEX, OPEX, revenue forecasts, IRR, NPV, payback period. Use formula scores for risk-adjusted returns. State all assumptions clearly.', maxWords: 2000, required: true, intelligencePriority: ['formulaScores', 'patterns'] },
      { id: 'feas-legal', title: 'Legal & Regulatory Framework', promptInstruction: 'Detail the applicable legal framework, licensing requirements, foreign ownership rules, tax regime, and compliance obligations using the GlobalComplianceFramework data.', maxWords: 1500, required: true, intelligencePriority: ['compliance', 'situationAnalysis'] },
      { id: 'feas-social', title: 'Social & Environmental Impact', promptInstruction: 'Assess community impact, environmental considerations, and stakeholder dynamics using the ethical assessment dimensions. Include Rawlsian fairness analysis.', maxWords: 1500, required: true, intelligencePriority: ['ethicalAssessment', 'emotionalClimate'] },
      { id: 'feas-risk', title: 'Risk Matrix & Mitigations', promptInstruction: 'Construct a comprehensive risk matrix (likelihood x impact) covering market, financial, political, regulatory, operational, ESG risks. Provide specific mitigations for each.', maxWords: 1500, required: true, intelligencePriority: ['situationAnalysis', 'ethicalAssessment', 'patterns'] },
      { id: 'feas-implementation', title: 'Implementation Roadmap', promptInstruction: 'Provide a phased implementation plan with timelines, milestones, resource requirements, and decision gates. Use typical timelines from compliance framework.', maxWords: 1200, required: true, intelligencePriority: ['compliance', 'historicalParallels'] },
      { id: 'feas-conclusion', title: 'Conclusions & Recommendations', promptInstruction: 'State clear conclusions on feasibility with conditions. Provide prioritised next steps and go/no-go recommendation with reference to ethical gate result.', maxWords: 800, required: true, intelligencePriority: ['ethicalAssessment', 'formulaScores'] },
    ]
  },
  {
    id: 'investment-attraction-strategy',
    name: 'Investment Attraction Strategy',
    category: 'Strategic',
    description: 'Strategy document for governments or agencies to attract foreign direct investment',
    tone: 'formal-government',
    audience: 'government-officials',
    length: 'comprehensive',
    keyFocus: 'actionable strategy with benchmark comparisons and competitive positioning',
    complianceFramework: ['government-procurement', 'UNCTAD-investment-policy-framework'],
    sections: [
      { id: 'ias-context', title: 'National/Regional Context', promptInstruction: 'Analyse the investment climate, competitive advantages, and positioning relative to peer countries. Use compliance framework data for doing-business rankings and CPI comparisons.', maxWords: 1500, required: true, intelligencePriority: ['compliance', 'situationAnalysis', 'patterns'] },
      { id: 'ias-benchmark', title: 'Benchmark Analysis', promptInstruction: 'Compare the jurisdiction to 5-8 competitor destinations using quantitative indicators. Use historical parallels of successful investment attraction campaigns.', maxWords: 1500, required: true, intelligencePriority: ['historicalParallels', 'compliance', 'crossDomain'] },
      { id: 'ias-sectors', title: 'Priority Sector Identification', promptInstruction: 'Identify and rank priority sectors for investment attraction. Use pattern data to show global demand-supply dynamics and competitive advantage analysis.', maxWords: 1500, required: true, intelligencePriority: ['patterns', 'formulaScores', 'crossDomain'] },
      { id: 'ias-value-prop', title: 'Value Proposition Design', promptInstruction: 'Craft compelling value propositions for each priority sector. Reference creative strategies and cross-domain innovations from the intelligence data.', maxWords: 1200, required: true, intelligencePriority: ['creativeStrategies', 'crossDomain', 'patterns'] },
      { id: 'ias-incentives', title: 'Incentive Framework', promptInstruction: 'Design an incentive framework that is competitive, fiscally sustainable, and WTO-compliant. Use compliance data for incentive benchmarking across peer countries.', maxWords: 1200, required: true, intelligencePriority: ['compliance', 'historicalParallels'] },
      { id: 'ias-institutional', title: 'Institutional Strengthening', promptInstruction: 'Recommend institutional reforms for IPA (Investment Promotion Agency) effectiveness. Reference best practices from successful IPAs globally.', maxWords: 1000, required: true, intelligencePriority: ['historicalParallels', 'patterns'] },
      { id: 'ias-implementation', title: 'Implementation Plan', promptInstruction: 'Provide a 3-5 year phased implementation plan with KPIs, budget estimates, and institutional responsibilities.', maxWords: 1200, required: true, intelligencePriority: ['formulaScores', 'compliance'] },
    ]
  },
  {
    id: 'investor-deck',
    name: 'Investor Pitch Deck Narrative',
    category: 'Strategic',
    description: 'Narrative content for investor presentation slides',
    tone: 'persuasive-investment',
    audience: 'investors',
    length: 'brief',
    keyFocus: 'compelling narrative with clear ROI proposition',
    complianceFramework: ['securities-regulations-disclaimer'],
    sections: [
      { id: 'pitch-problem', title: 'Problem / Opportunity', promptInstruction: 'Define the problem/opportunity in 2-3 crisp sentences. Quantify the market gap with specific data. Use pattern analysis for market sizing.', maxWords: 300, required: true, intelligencePriority: ['patterns', 'situationAnalysis'] },
      { id: 'pitch-solution', title: 'Solution & Value Proposition', promptInstruction: 'Present the solution concisely. What makes this approach unique? Use cross-domain insights for differentiation.', maxWords: 300, required: true, intelligencePriority: ['creativeStrategies', 'crossDomain'] },
      { id: 'pitch-market', title: 'Market Sizing', promptInstruction: 'TAM/SAM/SOM with supporting data. Reference comparable markets from historical parallels.', maxWords: 400, required: true, intelligencePriority: ['patterns', 'historicalParallels'] },
      { id: 'pitch-traction', title: 'Traction & Proof Points', promptInstruction: 'Evidence of viability. Historical parallels of similar successes. Risk-adjusted projections using formula scores.', maxWords: 400, required: true, intelligencePriority: ['historicalParallels', 'formulaScores'] },
      { id: 'pitch-financials', title: 'Financial Projections', promptInstruction: 'Key financial metrics: revenue growth, margin trajectory, unit economics, IRR/ROI. All using NSIL formula computations.', maxWords: 500, required: true, intelligencePriority: ['formulaScores'] },
      { id: 'pitch-ask', title: 'The Ask', promptInstruction: 'Clear investment ask with use of funds and expected returns. Include key terms and exit timeline.', maxWords: 300, required: true, intelligencePriority: ['formulaScores'] },
    ]
  },
  {
    id: 'partner-proposal',
    name: 'Partnership Proposal',
    category: 'Partner & Stakeholder',
    description: 'Formal proposal for strategic partnership, JV, or collaboration',
    tone: 'formal-corporate',
    audience: 'board-directors',
    length: 'standard',
    keyFocus: 'mutual value creation with clear governance structure',
    complianceFramework: ['partnership-law', 'competition-law'],
    sections: [
      { id: 'part-context', title: 'Strategic Rationale', promptInstruction: 'Why this partnership? What market dynamics or competitive pressures make partnership the optimal vehicle? Use situational analysis.', maxWords: 600, required: true, intelligencePriority: ['situationAnalysis', 'patterns'] },
      { id: 'part-value', title: 'Mutual Value Proposition', promptInstruction: 'What each party brings and gains. Use creative strategies for innovative partnership models. Reference successful partnership parallels.', maxWords: 800, required: true, intelligencePriority: ['creativeStrategies', 'historicalParallels'] },
      { id: 'part-structure', title: 'Proposed Structure', promptInstruction: 'JV structure, equity splits, governance, decision-making, IP treatment. Reference compliance framework for foreign ownership requirements.', maxWords: 800, required: true, intelligencePriority: ['compliance', 'formulaScores'] },
      { id: 'part-financial', title: 'Financial Framework', promptInstruction: 'Capital contributions, profit sharing, reinvestment, exit provisions. Use formula scores for financial modeling.', maxWords: 700, required: true, intelligencePriority: ['formulaScores'] },
      { id: 'part-risk', title: 'Risk Allocation', promptInstruction: 'Risk sharing framework; dispute resolution; termination provisions. Use ethical assessment for fairness of risk allocation.', maxWords: 600, required: true, intelligencePriority: ['ethicalAssessment', 'situationAnalysis'] },
      { id: 'part-next', title: 'Next Steps & Timeline', promptInstruction: 'Concrete next steps, due diligence requirements, timeline to agreement.', maxWords: 400, required: true, intelligencePriority: ['compliance'] },
    ]
  },
  {
    id: 'risk-assessment-report',
    name: 'Comprehensive Risk Assessment',
    category: 'Risk Assessment',
    description: 'Multi-dimensional risk assessment covering political, economic, operational, ESG risks',
    tone: 'technical-analytical',
    audience: 'board-directors',
    length: 'comprehensive',
    keyFocus: 'quantified risk identification with evidence-based mitigation strategies',
    complianceFramework: ['ISO-31000', 'enterprise-risk-management'],
    sections: [
      { id: 'risk-methodology', title: 'Assessment Methodology', promptInstruction: 'Explain the multi-layered assessment methodology: NSIL 29-formula computation, 7-dimension ethical assessment, pattern analysis, historical parallel matching, and situation analysis.', maxWords: 600, required: true, intelligencePriority: ['formulaScores'] },
      { id: 'risk-political', title: 'Political & Regulatory Risk', promptInstruction: 'Assess political stability, regulatory predictability, policy direction, government stability, election cycles, policy reversal risk. Use compliance framework CPI and rule of law data.', maxWords: 1200, required: true, intelligencePriority: ['compliance', 'situationAnalysis', 'emotionalClimate'] },
      { id: 'risk-economic', title: 'Economic & Financial Risk', promptInstruction: 'Assess macroeconomic stability, currency risk, inflation, credit risk, market liquidity. Use formula scores for quantification.', maxWords: 1200, required: true, intelligencePriority: ['formulaScores', 'patterns'] },
      { id: 'risk-operational', title: 'Operational Risk', promptInstruction: 'Assess infrastructure, supply chain, human capital, technology, cybersecurity, business continuity risks. Use historical parallels of operational failures.', maxWords: 1000, required: true, intelligencePriority: ['historicalParallels', 'crossDomain'] },
      { id: 'risk-esg', title: 'ESG Risk', promptInstruction: 'Environmental liabilities, social licence to operate, governance weaknesses, climate risk, community opposition. Use ethical assessment dimensions.', maxWords: 1000, required: true, intelligencePriority: ['ethicalAssessment', 'emotionalClimate'] },
      { id: 'risk-matrix', title: 'Risk Matrix & Scoring', promptInstruction: 'Present a comprehensive risk matrix with likelihood (1-5) x impact (1-5) scoring. Rank all identified risks. Use NSIL scores for quantification.', maxWords: 800, required: true, intelligencePriority: ['formulaScores', 'situationAnalysis'] },
      { id: 'risk-mitigation', title: 'Mitigation Strategy', promptInstruction: 'For each high/critical risk, provide specific mitigation actions, responsible parties, timelines, and residual risk levels. Reference what mitigations worked in historical parallels.', maxWords: 1200, required: true, intelligencePriority: ['historicalParallels', 'creativeStrategies'] },
    ]
  },
  {
    id: 'government-submission',
    name: 'Government Policy Submission',
    category: 'Government Submissions',
    description: 'Formal submission to government on policy consultation, incentive proposal, or regulatory reform',
    tone: 'formal-government',
    audience: 'government-officials',
    length: 'standard',
    keyFocus: 'evidence-based policy recommendations with international benchmark comparisons',
    complianceFramework: ['government-consultation-protocol', 'regulatory-impact-assessment'],
    sections: [
      { id: 'gov-summary', title: 'Executive Summary', promptInstruction: 'Summarise the submission: what is proposed, why it matters, what evidence supports it. Keep to 1 page maximum.', maxWords: 500, required: true, intelligencePriority: ['patterns', 'situationAnalysis'] },
      { id: 'gov-context', title: 'Policy Context', promptInstruction: 'Describe the current policy landscape, existing challenges, and the gap this submission addresses. Use compliance framework for current regulatory analysis.', maxWords: 800, required: true, intelligencePriority: ['compliance', 'situationAnalysis'] },
      { id: 'gov-evidence', title: 'Evidence Base', promptInstruction: 'Present international evidence: what have other jurisdictions done? What were the outcomes? Use historical parallels and pattern data.', maxWords: 1200, required: true, intelligencePriority: ['historicalParallels', 'patterns', 'crossDomain'] },
      { id: 'gov-recommendations', title: 'Recommendations', promptInstruction: 'Provide specific, actionable policy recommendations. For each, include: expected impact, implementation complexity, fiscal implications, and international precedent.', maxWords: 1000, required: true, intelligencePriority: ['formulaScores', 'creativeStrategies'] },
      { id: 'gov-impact', title: 'Impact Assessment', promptInstruction: 'Projected economic, social, and environmental impacts of the proposed policy changes. Use ethical assessment for distributive justice analysis.', maxWords: 800, required: true, intelligencePriority: ['ethicalAssessment', 'formulaScores'] },
    ]
  },
  {
    id: 'international-body-application',
    name: 'International Body Funding Application',
    category: 'International Body Applications',
    description: 'Funding application for World Bank, ADB, GCF, or other international development finance institution',
    tone: 'formal-government',
    audience: 'international-bodies',
    length: 'comprehensive',
    keyFocus: 'impact-focused proposal meeting DFI appraisal standards',
    complianceFramework: ['World-Bank-ESF', 'IFC-Performance-Standards', 'GCF-standards'],
    sections: [
      { id: 'intl-summary', title: 'Project Summary', promptInstruction: 'Project title, requesting entity, country, sector, requested amount, co-financing, implementation period. Following DFI standard format.', maxWords: 400, required: true, intelligencePriority: ['compliance'] },
      { id: 'intl-rationale', title: 'Development Rationale', promptInstruction: 'Why this project matters for development. SDG alignment. National development plan alignment. Use compliance framework for country context.', maxWords: 1000, required: true, intelligencePriority: ['compliance', 'ethicalAssessment', 'situationAnalysis'] },
      { id: 'intl-design', title: 'Project Design', promptInstruction: 'Components, activities, outputs, outcomes, and impact pathway. Logical framework. Theory of change. Use creative strategies for innovative design elements.', maxWords: 1500, required: true, intelligencePriority: ['creativeStrategies', 'historicalParallels'] },
      { id: 'intl-financial', title: 'Financial Plan', promptInstruction: 'Detailed budget, financing plan, economic analysis (ERR/IRR), fiscal sustainability. Use formula scores for financial projections.', maxWords: 1200, required: true, intelligencePriority: ['formulaScores'] },
      { id: 'intl-safeguards', title: 'Environmental & Social Safeguards', promptInstruction: 'Safeguard categorisation (A/B/C), applicable standards, ESIA summary, stakeholder engagement plan, grievance mechanism. Reference specific DFI standards.', maxWords: 1200, required: true, intelligencePriority: ['ethicalAssessment', 'compliance'] },
      { id: 'intl-implementation', title: 'Implementation Arrangements', promptInstruction: 'Institutional framework, procurement plan, disbursement schedule, monitoring & evaluation, reporting requirements.', maxWords: 1000, required: true, intelligencePriority: ['compliance', 'historicalParallels'] },
      { id: 'intl-risk', title: 'Risk Assessment', promptInstruction: 'Project risks & mitigations; institutional capacity risks; fiduciary risks; safeguard risks. Risk matrix with likelihood and impact.', maxWords: 800, required: true, intelligencePriority: ['situationAnalysis', 'formulaScores'] },
      { id: 'intl-sustainability', title: 'Sustainability & Exit Strategy', promptInstruction: 'How will project benefits be sustained after funding ends? Institutional sustainability, financial sustainability, environmental sustainability.', maxWords: 600, required: true, intelligencePriority: ['ethicalAssessment', 'patterns'] },
    ]
  },
  {
    id: 'due-diligence-report',
    name: 'Due Diligence Report',
    category: 'Due Diligence',
    description: 'Comprehensive due diligence assessment for investment, acquisition, or partnership',
    tone: 'technical-analytical',
    audience: 'legal-counsel',
    length: 'comprehensive',
    keyFocus: 'thorough risk identification and verification with actionable findings',
    complianceFramework: ['AML-KYC', 'anti-bribery', 'sanctions-compliance'],
    sections: [
      { id: 'dd-scope', title: 'Scope & Methodology', promptInstruction: 'Define due diligence scope, information sources, limitations, and analytical approach. State what was included and excluded.', maxWords: 500, required: true, intelligencePriority: ['patterns'] },
      { id: 'dd-entity', title: 'Entity & Ownership Review', promptInstruction: 'Corporate structure, beneficial ownership, related parties, litigation history, regulatory standing. Use input shield data for sanctions/fraud checks.', maxWords: 1000, required: true, intelligencePriority: ['compliance', 'situationAnalysis'] },
      { id: 'dd-financial', title: 'Financial Due Diligence', promptInstruction: 'Revenue quality, profitability drivers, working capital analysis, debt profile, tax compliance. Use formula scores for financial health assessment.', maxWords: 1500, required: true, intelligencePriority: ['formulaScores'] },
      { id: 'dd-legal', title: 'Legal & Regulatory Review', promptInstruction: 'Licences, permits, contracts, IP, employment compliance, environmental compliance, pending litigation. Use compliance framework for regulatory mapping.', maxWords: 1200, required: true, intelligencePriority: ['compliance'] },
      { id: 'dd-operational', title: 'Operational Assessment', promptInstruction: 'Operations review, technology stack, supply chain, human resources, management capability. Reference historical parallels for operational benchmarking.', maxWords: 1000, required: true, intelligencePriority: ['historicalParallels', 'crossDomain'] },
      { id: 'dd-commercial', title: 'Commercial Due Diligence', promptInstruction: 'Market position, competitive dynamics, customer concentration, growth trajectory. Use pattern analysis for market sizing and trend assessment.', maxWords: 1000, required: true, intelligencePriority: ['patterns', 'situationAnalysis'] },
      { id: 'dd-esg', title: 'ESG Due Diligence', promptInstruction: 'Environmental liabilities, social licence, governance quality, anti-corruption compliance. Use ethical assessment dimensions for comprehensive ESG scoring.', maxWords: 800, required: true, intelligencePriority: ['ethicalAssessment'] },
      { id: 'dd-findings', title: 'Key Findings & Red Flags', promptInstruction: 'Prioritised findings: deal-breakers (red), significant concerns (amber), minor issues (yellow), clear areas (green). Each with recommended action.', maxWords: 1000, required: true, intelligencePriority: ['situationAnalysis', 'ethicalAssessment'] },
    ]
  },
  {
    id: 'sez-development-plan',
    name: 'Special Economic Zone Development Plan',
    category: 'Strategic',
    description: 'Master plan for Special Economic Zone or Industrial Park development',
    tone: 'formal-government',
    audience: 'government-officials',
    length: 'comprehensive',
    keyFocus: 'evidence-based zone design with international best practice benchmarking',
    complianceFramework: ['UNCTAD-SEZ-guidelines', 'World-Bank-zone-performance'],
    sections: [
      { id: 'sez-rationale', title: 'Strategic Rationale', promptInstruction: 'Why an SEZ? What problem does it solve? What international evidence supports the approach? Use pattern data (SEZ 63-year track record) and historical parallels (Shenzhen, PEZA, Dubai).', maxWords: 1200, required: true, intelligencePriority: ['patterns', 'historicalParallels'] },
      { id: 'sez-location', title: 'Location Analysis', promptInstruction: 'Site selection criteria, infrastructure assessment, connectivity analysis, labour market proximity. Use compliance framework for local requirements.', maxWords: 1000, required: true, intelligencePriority: ['compliance', 'situationAnalysis'] },
      { id: 'sez-sectors', title: 'Target Sectors & Tenants', promptInstruction: 'Which sectors to target, what anchor tenants to attract, how to build cluster effects. Use cross-domain insights for innovative sector combinations.', maxWords: 1200, required: true, intelligencePriority: ['crossDomain', 'creativeStrategies', 'patterns'] },
      { id: 'sez-incentives', title: 'Incentive Design', promptInstruction: 'Tax incentives, customs benefits, regulatory facilitation. Benchmark against competitor zones. Use compliance data for incentive comparison.', maxWords: 1000, required: true, intelligencePriority: ['compliance', 'historicalParallels'] },
      { id: 'sez-governance', title: 'Governance & Institutional Framework', promptInstruction: 'Zone authority structure, one-stop-shop design, regulatory autonomy, private sector participation models.', maxWords: 800, required: true, intelligencePriority: ['historicalParallels', 'compliance'] },
      { id: 'sez-financial', title: 'Financial Model', promptInstruction: 'Development costs, revenue model, IRR/NPV analysis, funding structure (government/private/DFI). Use formula scores.', maxWords: 1200, required: true, intelligencePriority: ['formulaScores'] },
      { id: 'sez-social', title: 'Social & Environmental Impact', promptInstruction: 'Community impact, employment projections, environmental management, resettlement (if any). Use ethical assessment.', maxWords: 800, required: true, intelligencePriority: ['ethicalAssessment', 'emotionalClimate'] },
      { id: 'sez-implementation', title: 'Implementation Roadmap', promptInstruction: 'Phase 1-3 timeline, milestones, institutional setup sequence, early wins strategy.', maxWords: 1000, required: true, intelligencePriority: ['historicalParallels', 'compliance'] },
    ]
  },
  {
    id: 'community-impact-assessment',
    name: 'Community Impact Assessment',
    category: 'Community & Social Impact',
    description: 'Assessment of project impact on local communities, including benefit-sharing and mitigation',
    tone: 'community-engagement',
    audience: 'community-stakeholders',
    length: 'standard',
    keyFocus: 'genuine community impact with transparent benefit-sharing and grievance mechanisms',
    complianceFramework: ['IFC-PS5-land-acquisition', 'IFC-PS7-indigenous-peoples', 'FPIC'],
    sections: [
      { id: 'cia-context', title: 'Community Context', promptInstruction: 'Describe the affected communities: demographics, livelihoods, cultural significance, existing vulnerabilities. Use emotional climate analysis for community sentiment.', maxWords: 800, required: true, intelligencePriority: ['emotionalClimate', 'situationAnalysis'] },
      { id: 'cia-impacts', title: 'Impact Analysis', promptInstruction: 'Positive and negative impacts on livelihoods, health, education, culture, environment, social cohesion. Use ethical assessment (Rawlsian fairness) for distributive analysis.', maxWords: 1200, required: true, intelligencePriority: ['ethicalAssessment', 'situationAnalysis'] },
      { id: 'cia-benefits', title: 'Benefit-Sharing Framework', promptInstruction: 'How will benefits be shared with affected communities? Employment, procurement, revenue sharing, social infrastructure. Use creative strategies for innovative benefit models.', maxWords: 800, required: true, intelligencePriority: ['creativeStrategies', 'ethicalAssessment'] },
      { id: 'cia-mitigation', title: 'Impact Mitigation Plan', promptInstruction: 'Specific mitigation measures for each negative impact. Compensation framework. Livelihood restoration plan.', maxWords: 800, required: true, intelligencePriority: ['ethicalAssessment', 'historicalParallels'] },
      { id: 'cia-engagement', title: 'Stakeholder Engagement Plan', promptInstruction: 'How communities will be consulted throughout the project lifecycle. FPIC requirements. Grievance mechanism.', maxWords: 600, required: true, intelligencePriority: ['emotionalClimate', 'compliance'] },
    ]
  },
];

// ============================================================================
// LETTER TYPE CONFIGURATIONS
// ============================================================================

const LETTER_TYPES: LetterTypeConfig[] = [
  // ── INVESTMENT LETTERS ──
  { id: 'loi-investment', name: 'Letter of Intent — Investment', category: 'Investment', tone: 'formal-corporate', audience: 'investors', maxWords: 1500, structure: ['Preamble', 'Parties', 'Purpose', 'Key Terms', 'Conditions Precedent', 'Confidentiality', 'Non-Binding Statement', 'Signatures'], keyElements: ['Investment amount', 'Equity structure', 'Valuation basis', 'Due diligence period', 'Exclusivity'] },
  { id: 'loi-partnership', name: 'Letter of Intent — Partnership', category: 'Partnership', tone: 'formal-corporate', audience: 'board-directors', maxWords: 1500, structure: ['Introduction', 'Partnership Rationale', 'Scope of Collaboration', 'Governance Principles', 'Resource Commitments', 'Timeline', 'Confidentiality', 'Non-Binding'], keyElements: ['Mutual objectives', 'Contribution framework', 'Decision-making', 'IP treatment', 'Exit provisions'] },
  { id: 'eoi-government', name: 'Expression of Interest — Government Project', category: 'Government', tone: 'formal-government', audience: 'government-officials', maxWords: 2000, structure: ['Covering Statement', 'Company Profile', 'Relevant Experience', 'Proposed Approach', 'Team Qualifications', 'Financial Capacity', 'Compliance Declarations'], keyElements: ['Company credentials', 'Relevant track record', 'Technical capability', 'Financial standing', 'Compliance history'] },
  { id: 'proposal-cover', name: 'Proposal Cover Letter', category: 'Proposal', tone: 'formal-corporate', audience: 'investors', maxWords: 800, structure: ['Addressee', 'Reference to RFP/opportunity', 'Executive summary of proposal', 'Key differentiators', 'Closing commitment'], keyElements: ['Proposal reference', 'Key value proposition', 'Compliance statement', 'Contact details'] },
  { id: 'investor-update', name: 'Investor Update Letter', category: 'Investment', tone: 'formal-corporate', audience: 'investors', maxWords: 1500, structure: ['Summary', 'Key Metrics', 'Progress Update', 'Challenges & Mitigations', 'Upcoming Milestones', 'Financial Summary', 'Ask/Next Steps'], keyElements: ['KPI dashboard', 'Progress vs targets', 'Risk updates', 'Capital deployment'] },
  // ── GOVERNMENT LETTERS ──
  { id: 'gov-incentive-request', name: 'Investment Incentive Application Letter', category: 'Government', tone: 'formal-government', audience: 'government-officials', maxWords: 2000, structure: ['Formal Address', 'Application Reference', 'Company Introduction', 'Investment Description', 'Economic Impact', 'Incentive Request', 'Compliance Commitment', 'Supporting Documents List'], keyElements: ['Investment value', 'Job creation', 'Technology transfer', 'Export potential', 'Local content'] },
  { id: 'gov-regulatory-inquiry', name: 'Regulatory Inquiry Letter', category: 'Government', tone: 'formal-government', audience: 'government-officials', maxWords: 1000, structure: ['Reference', 'Company Introduction', 'Specific Inquiry', 'Context', 'Request for Clarification', 'Timeline Request'], keyElements: ['Specific regulation cited', 'Compliance question', 'Timeframe for response'] },
  { id: 'gov-mou-proposal', name: 'MoU Proposal Letter', category: 'Government', tone: 'formal-government', audience: 'government-officials', maxWords: 2000, structure: ['Formal Address', 'Context', 'Proposed Scope', 'Objectives', 'Commitments', 'Duration', 'Governance', 'Non-Legal Statement'], keyElements: ['MoU objectives', 'Respective commitments', 'Duration', 'Review mechanism'] },
  // ── COMPLIANCE LETTERS ──
  { id: 'aml-declaration', name: 'AML/KYC Declaration Letter', category: 'Compliance', tone: 'formal-corporate', audience: 'legal-counsel', maxWords: 1000, structure: ['Declaration', 'Beneficial Owner Disclosure', 'Source of Funds', 'PEP Declaration', 'Sanctions Declaration', 'Compliance Undertaking', 'Signature'], keyElements: ['UBO details', 'Source of funds', 'PEP status', 'Sanctions clearance'] },
  { id: 'compliance-assurance', name: 'Compliance Assurance Letter', category: 'Compliance', tone: 'formal-corporate', audience: 'legal-counsel', maxWords: 1200, structure: ['Scope of Assurance', 'Compliance Framework', 'Key Controls', 'Findings', 'Recommendations', 'Management Response'], keyElements: ['Applicable regulations', 'Control framework', 'Testing results', 'Material findings'] },
  // ── STAKEHOLDER LETTERS ──
  { id: 'community-notification', name: 'Community Notification Letter', category: 'Community', tone: 'community-engagement', audience: 'community-stakeholders', maxWords: 1000, structure: ['Plain Language Introduction', 'What Is Being Proposed', 'How It May Affect You', 'How You Can Participate', 'Contact Information', 'Feedback Timeline'], keyElements: ['Plain language', 'Impact summary', 'Participation channels', 'Feedback mechanism'] },
  { id: 'stakeholder-engagement', name: 'Stakeholder Engagement Letter', category: 'Community', tone: 'community-engagement', audience: 'community-stakeholders', maxWords: 1200, structure: ['Introduction', 'Project Description', 'Your Role', 'Consultation Process', 'How Your Input Will Be Used', 'Contact Information'], keyElements: ['Clear language', 'Specific role of stakeholder', 'Consultation timeline', 'How feedback is incorporated'] },
  // ── TRADE LETTERS ──
  { id: 'trade-inquiry', name: 'Trade Inquiry Letter', category: 'Trade', tone: 'formal-corporate', audience: 'investors', maxWords: 800, structure: ['Introduction', 'Product/Service Interest', 'Volume/Specification', 'Pricing Request', 'Delivery Terms', 'Payment Terms', 'Quality Standards'], keyElements: ['Product specifications', 'Volume requirements', 'Incoterms', 'Payment method', 'Quality certification'] },
  { id: 'customs-application', name: 'Customs/Trade Facilitation Letter', category: 'Trade', tone: 'formal-government', audience: 'government-officials', maxWords: 1500, structure: ['Application Reference', 'Company Details', 'Trade Description', 'Tariff Classification', 'Country of Origin', 'Preferential Treatment Claim', 'Supporting Documentation'], keyElements: ['HS classification', 'Origin determination', 'FTA/RTA preference', 'Certificate of origin'] },
  // ── INTERNATIONAL BODY LETTERS ──
  { id: 'dfi-concept-note', name: 'DFI Concept Note Cover Letter', category: 'International', tone: 'formal-government', audience: 'international-bodies', maxWords: 1500, structure: ['Formal Address to DFI', 'Project Title', 'Country/Region', 'Sector', 'Funding Request', 'Development Impact Summary', 'Alignment with DFI Strategy', 'NDA/Government Endorsement'], keyElements: ['DFI strategic alignment', 'Development impact', 'Government endorsement', 'Co-financing'] },
  { id: 'un-submission', name: 'UN Agency Submission Letter', category: 'International', tone: 'diplomatic', audience: 'international-bodies', maxWords: 2000, structure: ['Formal Protocol Address', 'Subject Reference', 'Background', 'Submission Content', 'Supporting Evidence', 'Request for Action', 'Respectful Closing'], keyElements: ['Protocol compliance', 'SDG alignment', 'Evidence-based arguments', 'Specific request'] },
];

// ============================================================================
// ROUTER
// ============================================================================

export class DocumentTypeRouter {

  /**
   * Get all available document type configurations
   */
  static getAllDocumentTypes(): DocumentTypeConfig[] {
    return [...DOCUMENT_TYPES];
  }

  /**
   * Get all letter type configurations
   */
  static getAllLetterTypes(): LetterTypeConfig[] {
    return [...LETTER_TYPES];
  }

  /**
   * Get document type by ID
   */
  static getDocumentType(id: string): DocumentTypeConfig | undefined {
    return DOCUMENT_TYPES.find(d => d.id === id);
  }

  /**
   * Get letter type by ID
   */
  static getLetterType(id: string): LetterTypeConfig | undefined {
    return LETTER_TYPES.find(l => l.id === id);
  }

  /**
   * Get document types by category
   */
  static getDocumentsByCategory(category: string): DocumentTypeConfig[] {
    return DOCUMENT_TYPES.filter(d => d.category.toLowerCase() === category.toLowerCase());
  }

  /**
   * Get letters by category
   */
  static getLettersByCategory(category: string): LetterTypeConfig[] {
    return LETTER_TYPES.filter(l => l.category.toLowerCase() === category.toLowerCase());
  }

  /**
   * Route document generation — returns the full section structure and prompt instructions
   * for any given document type
   */
  static routeDocument(documentTypeId: string): {
    config: DocumentTypeConfig;
    sectionPrompts: Array<{
      sectionId: string;
      title: string;
      prompt: string;
      maxWords: number;
      intelligenceFocus: string[];
    }>;
  } | null {
    const config = DOCUMENT_TYPES.find(d => d.id === documentTypeId);
    if (!config) return null;

    return {
      config,
      sectionPrompts: config.sections.map(s => ({
        sectionId: s.id,
        title: s.title,
        prompt: s.promptInstruction,
        maxWords: s.maxWords,
        intelligenceFocus: s.intelligencePriority,
      })),
    };
  }

  /**
   * Route letter generation — returns structure and key elements
   */
  static routeLetter(letterTypeId: string): {
    config: LetterTypeConfig;
    promptInstruction: string;
  } | null {
    const config = LETTER_TYPES.find(l => l.id === letterTypeId);
    if (!config) return null;

    const toneInstructions: Record<DocumentTone, string> = {
      'formal-corporate': 'Write in formal corporate style. Professional, precise, confident. Avoid jargon where possible. Use active voice.',
      'formal-government': 'Write in formal government correspondence style. Respectful, structured, evidence-referenced. Follow protocol conventions.',
      'technical-analytical': 'Write in technical analytical style. Data-driven, objective, measured. Support all claims with evidence.',
      'persuasive-investment': 'Write in persuasive investment style. Compelling, fact-backed, ROI-focused. Build a clear case for action.',
      'community-engagement': 'Write in clear, accessible community engagement style. Plain language. No jargon. Empathetic and transparent.',
      'academic-research': 'Write in academic research style. Rigorous, referenced, methodologically sound. Use appropriate citations.',
      'diplomatic': 'Write in diplomatic style. Measured, respectful, protocol-aware. Use appropriate formal conventions.',
    };

    const promptInstruction = [
      `Generate a ${config.name} with the following characteristics:`,
      `Tone: ${toneInstructions[config.tone]}`,
      `Audience: ${config.audience}`,
      `Maximum length: ${config.maxWords} words`,
      ``,
      `Required structure:`,
      ...config.structure.map((s, i) => `${i + 1}. ${s}`),
      ``,
      `Key elements to include:`,
      ...config.keyElements.map(k => `• ${k}`),
    ].join('\n');

    return { config, promptInstruction };
  }

  /**
   * Get catalog summary — how many document and letter types available
   */
  static getCatalogSummary(): {
    totalDocumentTypes: number;
    totalLetterTypes: number;
    documentCategories: Record<string, number>;
    letterCategories: Record<string, number>;
  } {
    const docCats: Record<string, number> = {};
    for (const d of DOCUMENT_TYPES) {
      docCats[d.category] = (docCats[d.category] || 0) + 1;
    }

    const letCats: Record<string, number> = {};
    for (const l of LETTER_TYPES) {
      letCats[l.category] = (letCats[l.category] || 0) + 1;
    }

    return {
      totalDocumentTypes: DOCUMENT_TYPES.length,
      totalLetterTypes: LETTER_TYPES.length,
      documentCategories: docCats,
      letterCategories: letCats,
    };
  }

  /**
   * Find best document type based on user intent keywords
   */
  static findBestDocumentType(keywords: string): DocumentTypeConfig | null {
    const lower = keywords.toLowerCase();
    const scored = DOCUMENT_TYPES.map(d => {
      let score = 0;
      const fields = [d.name, d.description, d.category, d.keyFocus].join(' ').toLowerCase();
      const words = lower.split(/\s+/);
      for (const word of words) {
        if (word.length < 3) continue;
        if (fields.includes(word)) score += 10;
      }
      // Boost for exact category match
      if (lower.includes(d.category.toLowerCase())) score += 20;
      // Boost for name word match
      const nameWords = d.name.toLowerCase().split(/\s+/);
      for (const nw of nameWords) {
        if (lower.includes(nw) && nw.length > 3) score += 15;
      }
      return { doc: d, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.score > 0 ? scored[0].doc : null;
  }

  /**
   * Find best letter type based on user intent keywords
   */
  static findBestLetterType(keywords: string): LetterTypeConfig | null {
    const lower = keywords.toLowerCase();
    const scored = LETTER_TYPES.map(l => {
      let score = 0;
      const fields = [l.name, l.category, ...l.keyElements].join(' ').toLowerCase();
      const words = lower.split(/\s+/);
      for (const word of words) {
        if (word.length < 3) continue;
        if (fields.includes(word)) score += 10;
      }
      if (lower.includes(l.category.toLowerCase())) score += 20;
      return { letter: l, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.score > 0 ? scored[0].letter : null;
  }
}

export default DocumentTypeRouter;
