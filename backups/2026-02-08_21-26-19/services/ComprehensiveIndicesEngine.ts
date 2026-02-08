/**
 * COMPREHENSIVE INDICES ENGINE
 * 
 * Implements ALL documented indices that were previously marked as "not implemented":
 * - BARNA: Barriers Analysis
 * - NVI: Network Value Index
 * - CRI: Country Risk Index
 * - CAP: Capability Assessment Profile
 * - AGI: Activation Gradient Index
 * - VCI: Value Creation Index
 * - ATI: Asset Transfer Index
 * - ESI: Ecosystem Strength Index
 * - ISI: Integration Speed Index
 * - OSI: Operational Synergy Index
 * - TCO: Total Cost of Ownership
 * - PRI: Political Risk Index
 * - RNI: Regulatory Navigation Index
 * - SRA: Strategic Risk Assessment
 * - IDV: Investment Default Variance
 */

import { ReportParameters } from '../types';
import CompositeScoreService from './CompositeScoreService';

// ============================================================================
// TYPES
// ============================================================================

export interface IndexResult {
  value: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  interpretation: string;
  components: Record<string, number>;
  recommendations: string[];
}

export interface AllIndicesResult {
  barna: IndexResult;
  nvi: IndexResult;
  cri: IndexResult;
  cap: IndexResult;
  agi: IndexResult;
  vci: IndexResult;
  ati: IndexResult;
  esi: IndexResult;
  isi: IndexResult;
  osi: IndexResult;
  tco: IndexResult;
  pri: IndexResult;
  rni: IndexResult;
  sra: IndexResult;
  idv: IndexResult;
  composite: {
    overallScore: number;
    riskAdjustedScore: number;
    opportunityScore: number;
    executionReadiness: number;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
};

const clamp = (value: number, min: number, max: number): number => 
  Math.min(max, Math.max(min, value));

// ============================================================================
// INDEX CALCULATIONS
// ============================================================================

/**
 * BARNA - Barriers Analysis
 * Measures entry barriers including regulatory, competitive, and operational
 */
export async function calculateBARNA(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  // Component calculations
  const regulatoryBarrier = 100 - composite.components.regulatory;
  // Estimate competitive barrier from industry and strategic intent
  const competitiveBarrier = params.industry?.length 
    ? Math.min(80, params.industry.length * 15)
    : 40;
  const capitalBarrier = params.dealSize 
    ? (parseFloat(String(params.dealSize).replace(/[^0-9.]/g, '')) > 50000000 ? 70 : 40)
    : 50;
  const marketAccessBarrier = 100 - composite.components.marketAccess;
  const culturalBarrier = params.country && params.userCountry && params.country !== params.userCountry ? 45 : 25;

  const components = {
    regulatory: regulatoryBarrier,
    competitive: competitiveBarrier,
    capital: capitalBarrier,
    marketAccess: marketAccessBarrier,
    cultural: culturalBarrier
  };

  const value = clamp(
    100 - (regulatoryBarrier * 0.25 + competitiveBarrier * 0.2 + capitalBarrier * 0.2 + 
           marketAccessBarrier * 0.2 + culturalBarrier * 0.15),
    10, 95
  );

  const recommendations: string[] = [];
  if (regulatoryBarrier > 60) recommendations.push('Engage local legal counsel early to navigate regulatory complexity');
  if (competitiveBarrier > 60) recommendations.push('Consider niche market positioning to avoid head-to-head competition');
  if (capitalBarrier > 60) recommendations.push('Explore phased investment approach to reduce capital barrier');
  if (marketAccessBarrier > 50) recommendations.push('Partner with local distributor for market access');
  if (culturalBarrier > 40) recommendations.push('Invest in cultural adaptation and local hiring');

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Low barriers to entry - favorable conditions for market entry'
      : value > 50
      ? 'Moderate barriers exist - strategic planning required'
      : 'Significant barriers - consider alternative approaches or markets',
    components,
    recommendations
  };
}

/**
 * NVI - Network Value Index
 * Measures the value and strength of partnership networks
 */
export async function calculateNVI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  // Calculate network components - use targetPartner as single value
  const existingPartners = params.targetPartner ? 1 : 0;
  const partnerDiversity = params.partnerPersonas?.length || 0;
  const networkReach = composite.components.marketAccess * 0.8;
  const relationshipDepth = params.partnerReadinessLevel === 'high' ? 85 : 
                            params.partnerReadinessLevel === 'medium' ? 60 : 35;
  const ecosystemStrength = (composite.components.innovation + composite.components.talent) / 2;

  const components = {
    partnerCount: Math.min(100, existingPartners * 15),
    diversity: Math.min(100, partnerDiversity * 20),
    reach: networkReach,
    depth: relationshipDepth,
    ecosystem: ecosystemStrength
  };

  const value = clamp(
    (components.partnerCount * 0.2 + components.diversity * 0.2 + 
     components.reach * 0.25 + components.depth * 0.2 + components.ecosystem * 0.15),
    10, 95
  );

  const recommendations: string[] = [];
  if (existingPartners < 3) recommendations.push('Expand partner network before market entry');
  if (partnerDiversity < 2) recommendations.push('Diversify partner types (government, commercial, academic)');
  if (relationshipDepth < 50) recommendations.push('Deepen existing relationships through pilot projects');

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Strong network foundation for market entry'
      : value > 50
      ? 'Network needs strengthening for optimal outcomes'
      : 'Significant network development required before proceeding',
    components,
    recommendations
  };
}

/**
 * CRI - Country Risk Index
 * Comprehensive country-level risk assessment
 */
export async function calculateCRI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const politicalRisk = 100 - composite.components.politicalStability;
  const economicRisk = 100 - (composite.inputs.gdpGrowth > 3 ? 70 : composite.inputs.gdpGrowth > 0 ? 50 : 30);
  // Currency risk derived from inflation as proxy for exchange rate volatility
  const currencyRisk = composite.inputs.inflation > 15 ? 70 : 
                       composite.inputs.inflation > 8 ? 50 : 30;
  const sovereignRisk = 100 - composite.components.regulatory * 0.8;
  const operationalRisk = 100 - composite.components.infrastructure;

  const components = {
    political: politicalRisk,
    economic: economicRisk,
    currency: currencyRisk,
    sovereign: sovereignRisk,
    operational: operationalRisk
  };

  // CRI is inverted - higher is better (lower risk)
  const riskScore = (politicalRisk * 0.25 + economicRisk * 0.2 + currencyRisk * 0.2 + 
                     sovereignRisk * 0.15 + operationalRisk * 0.2);
  const value = clamp(100 - riskScore, 10, 95);

  const recommendations: string[] = [];
  if (politicalRisk > 60) recommendations.push('Consider political risk insurance');
  if (currencyRisk > 50) recommendations.push('Implement currency hedging strategy');
  if (sovereignRisk > 50) recommendations.push('Seek bilateral investment treaty protection');
  if (operationalRisk > 50) recommendations.push('Build operational redundancy');

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Favorable country risk profile'
      : value > 50
      ? 'Moderate country risks - mitigation strategies recommended'
      : 'Elevated country risks - proceed with caution',
    components,
    recommendations
  };
}

/**
 * CAP - Capability Assessment Profile
 * Measures organizational readiness and capabilities
 */
export async function calculateCAP(params: Partial<ReportParameters>): Promise<IndexResult> {
  // Use partnerCapabilities as proxy for technical capabilities
  const technicalCapabilities = (params.partnerCapabilities || []).length;
  // Use dealSize as proxy for resource availability
  const resourceAvailability = params.dealSize ? 70 : 40;
  const experienceLevel = params.skillLevel === 'experienced' ? 85 : 
                          params.skillLevel === 'intermediate' ? 65 : 45;
  const organizationalScale = params.organizationType?.includes('Enterprise') ? 80 :
                              params.organizationType?.includes('Government') ? 75 : 55;
  const adaptability = params.strategicIntent?.some(i => 
    i.toLowerCase().includes('innovation') || i.toLowerCase().includes('digital')) ? 75 : 50;

  const components = {
    technical: Math.min(100, technicalCapabilities * 12),
    resources: resourceAvailability,
    experience: experienceLevel,
    scale: organizationalScale,
    adaptability: adaptability
  };

  const value = clamp(
    (components.technical * 0.25 + components.resources * 0.2 + 
     components.experience * 0.2 + components.scale * 0.15 + components.adaptability * 0.2),
    10, 95
  );

  const recommendations: string[] = [];
  if (technicalCapabilities < 3) recommendations.push('Document and strengthen core technical capabilities');
  if (resourceAvailability < 50) recommendations.push('Secure dedicated budget allocation before proceeding');
  if (experienceLevel < 60) recommendations.push('Consider hiring experienced market entry specialists');

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Strong organizational capability for execution'
      : value > 50
      ? 'Adequate capabilities with room for enhancement'
      : 'Capability gaps should be addressed before major initiatives',
    components,
    recommendations
  };
}

/**
 * AGI - Activation Gradient Index
 * Measures speed and ease of market activation
 */
export async function calculateAGI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const regulatorySpeed = composite.components.regulatory * 0.9;
  const partnerReadiness = params.partnerReadinessLevel === 'high' ? 90 : 
                           params.partnerReadinessLevel === 'medium' ? 65 : 40;
  const infrastructureReady = composite.components.infrastructure;
  const marketAccessibility = composite.components.marketAccess * 0.85;
  // Use expansion timeline as proxy for resource mobilization readiness
  const resourceMobilization = params.expansionTimeline?.includes('immediate') ? 80 :
                               params.expansionTimeline?.includes('short') ? 65 : 50;

  const components = {
    regulatory: regulatorySpeed,
    partner: partnerReadiness,
    infrastructure: infrastructureReady,
    market: marketAccessibility,
    resources: resourceMobilization
  };

  const value = clamp(
    (regulatorySpeed * 0.25 + partnerReadiness * 0.2 + infrastructureReady * 0.2 + 
     marketAccessibility * 0.2 + resourceMobilization * 0.15),
    10, 95
  );

  const recommendations: string[] = [];
  if (regulatorySpeed < 50) recommendations.push('Engage regulatory consultants to accelerate approvals');
  if (partnerReadiness < 50) recommendations.push('Accelerate partner due diligence and negotiations');
  if (resourceMobilization < 60) recommendations.push('Pre-position resources for rapid deployment');

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Fast activation possible - market can be entered quickly'
      : value > 50
      ? 'Moderate activation timeline expected'
      : 'Slow activation anticipated - plan for extended ramp-up',
    components,
    recommendations
  };
}

/**
 * VCI - Value Creation Index
 * Measures potential for value creation
 */
export async function calculateVCI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const marketGrowth = composite.inputs.gdpGrowth > 5 ? 90 : 
                       composite.inputs.gdpGrowth > 3 ? 75 : 
                       composite.inputs.gdpGrowth > 0 ? 55 : 35;
  const innovationPotential = composite.components.innovation;
  const synergyPotential = params.partnerPersonas?.length 
    ? Math.min(85, 50 + params.partnerPersonas.length * 10) : 50;
  // Use partnerCapabilities as proxy for core competencies
  const competitiveAdvantage = params.partnerCapabilities?.length 
    ? Math.min(90, 50 + params.partnerCapabilities.length * 8) : 45;
  const scalability = composite.components.marketAccess * 0.8;

  const components = {
    growth: marketGrowth,
    innovation: innovationPotential,
    synergy: synergyPotential,
    advantage: competitiveAdvantage,
    scale: scalability
  };

  const value = clamp(
    (marketGrowth * 0.25 + innovationPotential * 0.2 + synergyPotential * 0.2 + 
     competitiveAdvantage * 0.2 + scalability * 0.15),
    10, 95
  );

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'High value creation potential identified'
      : value > 50
      ? 'Moderate value creation opportunity'
      : 'Limited value creation expected - reassess strategy',
    components,
    recommendations: [
      'Focus on high-growth market segments',
      'Leverage unique capabilities for competitive differentiation',
      'Structure partnerships for mutual value creation'
    ]
  };
}

/**
 * ATI - Asset Transfer Index
 * Measures ease of asset/capability transfer
 */
export async function calculateATI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const ipProtection = composite.components.regulatory * 0.7;
  const contractEnforcement = composite.components.politicalStability * 0.6 + 30;
  const capitalMobility = composite.inputs.fdiInflows > 5 ? 80 : 
                          composite.inputs.fdiInflows > 2 ? 65 : 45;
  const knowledgeTransfer = composite.components.talent * 0.8;
  const operationalTransfer = composite.components.infrastructure * 0.75;

  const components = {
    ip: ipProtection,
    contracts: contractEnforcement,
    capital: capitalMobility,
    knowledge: knowledgeTransfer,
    operations: operationalTransfer
  };

  const value = clamp(
    (ipProtection * 0.25 + contractEnforcement * 0.2 + capitalMobility * 0.2 + 
     knowledgeTransfer * 0.2 + operationalTransfer * 0.15),
    10, 95
  );

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Favorable conditions for asset transfer'
      : value > 50
      ? 'Asset transfer possible with appropriate safeguards'
      : 'Asset transfer challenges - consider protective structures',
    components,
    recommendations: [
      'Conduct thorough IP protection assessment',
      'Structure contracts under favorable jurisdictions',
      'Plan phased capability transfer with milestones'
    ]
  };
}

/**
 * ESI - Ecosystem Strength Index
 * Measures the strength of the business ecosystem
 */
export async function calculateESI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const supplierNetwork = composite.components.supplyChain;
  const talentPool = composite.components.talent;
  const innovationHub = composite.components.innovation;
  const financialServices = composite.inputs.fdiInflows > 3 ? 75 : 55;
  const supportingIndustries = composite.components.infrastructure * 0.7 + composite.components.digitalReadiness * 0.3;

  const components = {
    suppliers: supplierNetwork,
    talent: talentPool,
    innovation: innovationHub,
    finance: financialServices,
    support: supportingIndustries
  };

  const value = clamp(
    (supplierNetwork * 0.25 + talentPool * 0.2 + innovationHub * 0.2 + 
     financialServices * 0.15 + supportingIndustries * 0.2),
    10, 95
  );

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Strong ecosystem supports business operations'
      : value > 50
      ? 'Adequate ecosystem with some gaps'
      : 'Weak ecosystem - consider ecosystem development investment',
    components,
    recommendations: [
      'Map key ecosystem players before entry',
      'Identify gaps requiring in-house capability',
      'Invest in ecosystem development if strategically important'
    ]
  };
}

/**
 * ISI - Integration Speed Index
 * Measures how quickly operations can be integrated
 */
export async function calculateISI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const processCompatibility = composite.components.digitalReadiness;
  const systemInteroperability = composite.components.infrastructure * 0.8;
  const culturalAlignment = params.country === params.userCountry ? 85 : 55;
  const changeReadiness = params.partnerReadinessLevel === 'high' ? 80 : 55;
  // Use dealSize as proxy for resource availability
  const resourceAvailability = params.dealSize ? 70 : 45;

  const components = {
    process: processCompatibility,
    systems: systemInteroperability,
    culture: culturalAlignment,
    change: changeReadiness,
    resources: resourceAvailability
  };

  const value = clamp(
    (processCompatibility * 0.25 + systemInteroperability * 0.2 + culturalAlignment * 0.2 + 
     changeReadiness * 0.2 + resourceAvailability * 0.15),
    10, 95
  );

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Rapid integration achievable'
      : value > 50
      ? 'Standard integration timeline expected'
      : 'Extended integration period anticipated',
    components,
    recommendations: [
      'Develop detailed integration playbook',
      'Identify integration quick wins for momentum',
      'Plan for cultural integration activities'
    ]
  };
}

/**
 * OSI - Operational Synergy Index
 * Measures potential operational synergies
 */
export async function calculateOSI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const processEfficiency = composite.components.infrastructure;
  const costSynergy = composite.inputs.gdpPerCapita < 30000 ? 75 : 50; // Lower cost markets = higher synergy potential
  // Use partnerCapabilities as proxy for core competencies
  const capabilityCombination = (params.partnerCapabilities?.length || 0) * 10 + 40;
  const scaleEconomies = composite.components.marketAccess * 0.7;
  const sharedServices = composite.components.digitalReadiness * 0.8;

  const components = {
    process: processEfficiency,
    cost: costSynergy,
    capability: Math.min(90, capabilityCombination),
    scale: scaleEconomies,
    shared: sharedServices
  };

  const value = clamp(
    (processEfficiency * 0.2 + costSynergy * 0.25 + capabilityCombination * 0.2 + 
     scaleEconomies * 0.2 + sharedServices * 0.15),
    10, 95
  );

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Strong operational synergy potential'
      : value > 50
      ? 'Moderate synergies achievable'
      : 'Limited synergy potential - may require operational restructuring',
    components,
    recommendations: [
      'Quantify synergy targets with clear timelines',
      'Identify quick-win synergies for early value',
      'Build synergy tracking mechanisms'
    ]
  };
}

/**
 * TCO - Total Cost of Ownership
 * Measures comprehensive cost profile (inverted - higher score = lower cost)
 */
export async function calculateTCO(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  // Lower values in these = higher TCO score (lower cost is better)
  const laborCost = composite.inputs.gdpPerCapita < 15000 ? 80 : 
                    composite.inputs.gdpPerCapita < 35000 ? 60 : 40;
  const regulatoryCost = composite.components.regulatory * 0.7;
  const infrastructureCost = composite.components.infrastructure * 0.6;
  const complianceCost = composite.components.politicalStability * 0.5 + 30;
  const operationalCost = (composite.components.supplyChain + composite.components.infrastructure) / 2;

  const components = {
    labor: laborCost,
    regulatory: regulatoryCost,
    infrastructure: infrastructureCost,
    compliance: complianceCost,
    operational: operationalCost
  };

  const value = clamp(
    (laborCost * 0.3 + regulatoryCost * 0.2 + infrastructureCost * 0.2 + 
     complianceCost * 0.15 + operationalCost * 0.15),
    10, 95
  );

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Favorable cost structure - competitive TCO'
      : value > 50
      ? 'Moderate cost profile - room for optimization'
      : 'High cost environment - requires cost management focus',
    components,
    recommendations: [
      'Benchmark costs against regional alternatives',
      'Identify cost optimization opportunities',
      'Consider shared services for cost reduction'
    ]
  };
}

/**
 * PRI - Political Risk Index (detailed)
 */
export async function calculatePRI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const govtStability = composite.components.politicalStability;
  const policyConsistency = composite.components.regulatory * 0.7;
  const expropiationRisk = composite.components.politicalStability * 0.8;
  const civilUnrest = composite.components.politicalStability * 0.6 + 20;
  // Use market access as proxy for trade openness
  const geopolitical = composite.components.marketAccess > 80 ? 75 : 55;

  const components = {
    stability: govtStability,
    policy: policyConsistency,
    expropiation: expropiationRisk,
    unrest: civilUnrest,
    geopolitical: geopolitical
  };

  const value = clamp(
    (govtStability * 0.3 + policyConsistency * 0.25 + expropiationRisk * 0.2 + 
     civilUnrest * 0.15 + geopolitical * 0.1),
    10, 95
  );

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Low political risk environment'
      : value > 50
      ? 'Moderate political risk - monitoring required'
      : 'Elevated political risk - mitigation essential',
    components,
    recommendations: value < 60 ? [
      'Obtain political risk insurance',
      'Structure investments for maximum protection',
      'Diversify across multiple markets'
    ] : ['Continue standard monitoring']
  };
}

/**
 * RNI - Regulatory Navigation Index
 */
export async function calculateRNI(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const transparency = composite.components.regulatory;
  const consistency = composite.components.politicalStability * 0.6 + 30;
  const processEfficiency = composite.components.digitalReadiness * 0.7 + 20;
  const appealMechanisms = composite.components.regulatory * 0.8;
  // Use market access as proxy for trade openness
  const stakeholderAccess = composite.components.marketAccess > 70 ? 75 : 55;

  const components = {
    transparency: transparency,
    consistency: consistency,
    efficiency: processEfficiency,
    appeals: appealMechanisms,
    access: stakeholderAccess
  };

  const value = clamp(
    (transparency * 0.3 + consistency * 0.2 + processEfficiency * 0.2 + 
     appealMechanisms * 0.15 + stakeholderAccess * 0.15),
    10, 95
  );

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Navigable regulatory environment'
      : value > 50
      ? 'Complex but manageable regulatory landscape'
      : 'Challenging regulatory navigation - expert support needed',
    components,
    recommendations: [
      'Engage local regulatory specialists',
      'Build relationships with regulatory stakeholders',
      'Document all regulatory interactions'
    ]
  };
}

/**
 * SRA - Strategic Risk Assessment
 */
export async function calculateSRA(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  const marketRisk = 100 - composite.components.marketAccess;
  const executionRisk = params.partnerReadinessLevel === 'high' ? 30 : 
                        params.partnerReadinessLevel === 'medium' ? 50 : 70;
  // Estimate competitive risk from industry complexity
  const competitiveRisk = params.industry?.length ? Math.min(80, params.industry.length * 15) : 50;
  const financialRisk = params.riskTolerance === 'low' ? 60 : 
                        params.riskTolerance === 'high' ? 40 : 50;
  const timingRisk = params.expansionTimeline?.includes('0-6') ? 65 : 45;

  const components = {
    market: marketRisk,
    execution: executionRisk,
    competitive: competitiveRisk,
    financial: financialRisk,
    timing: timingRisk
  };

  // Inverted - higher score means lower strategic risk
  const riskScore = (marketRisk * 0.25 + executionRisk * 0.25 + competitiveRisk * 0.2 + 
                     financialRisk * 0.15 + timingRisk * 0.15);
  const value = clamp(100 - riskScore, 10, 95);

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Low strategic risk profile'
      : value > 50
      ? 'Manageable strategic risks present'
      : 'Significant strategic risks - develop mitigation plans',
    components,
    recommendations: [
      'Develop contingency plans for key risks',
      'Build early warning indicators',
      'Review risk profile quarterly'
    ]
  };
}

/**
 * IDV - Investment Default Variance
 * Measures variance from expected investment outcomes
 */
export async function calculateIDV(params: Partial<ReportParameters>): Promise<IndexResult> {
  const composite = await CompositeScoreService.getScores({
    country: params.country,
    region: params.region
  });

  // Use inflation as proxy for market volatility (correlates with exchange rate issues)
  const marketVolatility = composite.inputs.inflation > 10 ? 40 : 70;
  const economicStability = composite.inputs.gdpGrowth > 0 ? 70 : 40;
  const partnerReliability = params.partnerReadinessLevel === 'high' ? 80 : 55;
  const executionVariance = composite.components.infrastructure * 0.7 + 20;
  const historicalPredictability = composite.components.politicalStability * 0.6 + 30;

  const components = {
    market: marketVolatility,
    economic: economicStability,
    partner: partnerReliability,
    execution: executionVariance,
    historical: historicalPredictability
  };

  const value = clamp(
    (marketVolatility * 0.25 + economicStability * 0.25 + partnerReliability * 0.2 + 
     executionVariance * 0.15 + historicalPredictability * 0.15),
    10, 95
  );

  return {
    value: Math.round(value),
    grade: getGrade(value),
    interpretation: value > 70 
      ? 'Low variance expected - predictable outcomes'
      : value > 50
      ? 'Moderate variance - plan for range of outcomes'
      : 'High variance - prepare for significant deviations',
    components,
    recommendations: [
      'Model multiple scenarios (P10/P50/P90)',
      'Build contingency reserves',
      'Set up early warning triggers'
    ]
  };
}

// ============================================================================
// COMPREHENSIVE INDEX CALCULATOR
// ============================================================================

export async function calculateAllIndices(params: Partial<ReportParameters>): Promise<AllIndicesResult> {
  // Calculate all indices in parallel
  const [barna, nvi, cri, cap, agi, vci, ati, esi, isi, osi, tco, pri, rni, sra, idv] = await Promise.all([
    calculateBARNA(params),
    calculateNVI(params),
    calculateCRI(params),
    calculateCAP(params),
    calculateAGI(params),
    calculateVCI(params),
    calculateATI(params),
    calculateESI(params),
    calculateISI(params),
    calculateOSI(params),
    calculateTCO(params),
    calculatePRI(params),
    calculateRNI(params),
    calculateSRA(params),
    calculateIDV(params)
  ]);

  // Calculate composite scores by category
  const opportunityIndices = [barna, nvi, vci, agi, esi];
  const riskIndices = [cri, pri, sra, idv];
  const readinessIndices = [cap, isi, osi, rni];

  // Cost indices (tco, ati) included in overall calculation below
  const overallScore = Math.round(
    [barna, nvi, cri, cap, agi, vci, ati, esi, isi, osi, tco, pri, rni, sra, idv]
      .reduce((sum, idx) => sum + idx.value, 0) / 15
  );

  const opportunityScore = Math.round(
    opportunityIndices.reduce((sum, idx) => sum + idx.value, 0) / opportunityIndices.length
  );

  const riskAdjustedScore = Math.round(
    (opportunityScore * 0.6 + riskIndices.reduce((sum, idx) => sum + idx.value, 0) / riskIndices.length * 0.4)
  );

  const executionReadiness = Math.round(
    readinessIndices.reduce((sum, idx) => sum + idx.value, 0) / readinessIndices.length
  );

  return {
    barna, nvi, cri, cap, agi, vci, ati, esi, isi, osi, tco, pri, rni, sra, idv,
    composite: {
      overallScore,
      riskAdjustedScore,
      opportunityScore,
      executionReadiness
    }
  };
}

export default {
  calculateBARNA,
  calculateNVI,
  calculateCRI,
  calculateCAP,
  calculateAGI,
  calculateVCI,
  calculateATI,
  calculateESI,
  calculateISI,
  calculateOSI,
  calculateTCO,
  calculatePRI,
  calculateRNI,
  calculateSRA,
  calculateIDV,
  calculateAllIndices
};
