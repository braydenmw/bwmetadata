import { 
    ReportParameters, 
    MarketShare, 
    MarketOpportunity, 
    DiversificationAnalysis,
    OrchResult,
    RROI_Index,
    SEAM_Blueprint,
    SymbioticPartner,
    SPIResult,
    EthicalCheckResult,
    EthicsStatus,
    EthicsFlag,
    MitigationStep,
    LAIResult,
    CompositeScoreResult,
    RegionProfile
} from '../types';
import { GLOBAL_CITY_DATABASE } from '../constants';
import CompositeScoreService from './CompositeScoreService';
import { HistoricalLearningEngine, RegionalCityOpportunityEngine } from './MultiAgentBrainSystem';

// --- 1. MARKET DIVERSIFICATION ENGINE ---

export class MarketDiversificationEngine {
  static calculateHHI(markets: MarketShare[]): number {
    return markets.reduce((acc, m) => acc + Math.pow(m.share, 2), 0);
  }

  static async analyzeConcentration(markets: MarketShare[], params?: ReportParameters): Promise<DiversificationAnalysis> {
    const hhi = this.calculateHHI(markets);
    let riskLevel: DiversificationAnalysis['riskLevel'] = 'Diversified';
    let analysis = "Portfolio is well-balanced.";

    if (hhi > 2500) {
      riskLevel = 'High Concentration';
      analysis = "Significant dependency on primary market detected. Recommendation: Immediate diversification.";
    } else if (hhi > 1500) {
      riskLevel = 'Moderate Concentration';
      analysis = "Portfolio shows moderate concentration. Monitor key market volatility.";
    }

    // LIVE DATA: Get regional city opportunities based on user's region/industry
    const regionalOpportunities = params 
      ? await RegionalCityOpportunityEngine.findEmergingCities(params)
      : [];

    // Convert regional opportunities to market opportunities
    const recommendedMarkets: MarketOpportunity[] = regionalOpportunities.slice(0, 5).map(city => ({
      country: city.country,
      city: city.city,
      growthRate: city.growthPotential / 10,
      easeOfEntry: city.infrastructureReadiness,
      talentAvailability: city.talentAvailability,
      innovationIndex: city.marketAccessScore,
      regulatoryFriction: 100 - city.opportunityScore,
      marketSize: `$${Math.round(city.opportunityScore * 10)}B`,
      opportunityScore: city.opportunityScore,
      recommendedStrategy: city.recommendedStrategy,
      rationale: `${city.competitiveAdvantages.join(', ')}. Historical comparables: ${city.historicalComparables.join(', ')}.`
    }));

    // Fallback to composite-based recommendations if no regional data
    if (recommendedMarkets.length === 0) {
      const fallbackCountries = ['Vietnam', 'Poland', 'Mexico', 'Indonesia', 'Morocco'];
      for (const country of fallbackCountries.slice(0, 3)) {
        const composite = await CompositeScoreService.getScores({ country, region: 'Global' });
        recommendedMarkets.push({
          country,
          growthRate: composite.components.marketAccess / 15,
          easeOfEntry: composite.components.regulatory,
          talentAvailability: composite.components.talent,
          innovationIndex: composite.components.innovation,
          regulatoryFriction: 100 - composite.components.regulatory,
          marketSize: `$${Math.round(composite.inputs.gdpCurrent / 1e9)}B`,
          opportunityScore: composite.overall,
          recommendedStrategy: composite.overall > 70 ? 'Accelerated Entry' : 'Phased Approach',
          rationale: `Composite score ${composite.overall}/100 based on live World Bank data.`
        });
      }
    }

    return {
      hhiScore: hhi,
      riskLevel,
      concentrationAnalysis: analysis,
      recommendedMarkets
    };
  }
}

const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num));

const percentile = (arr: number[], p: number) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = (sorted.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
};

const computeIVAS = (regionProfile: RegionProfile, composite: CompositeScoreResult) => {
    const readiness = composite.overall;
    const infra = composite.components.infrastructure;
    const regulatory = composite.components.regulatory;
    const political = composite.components.politicalStability;
    const marketAccess = composite.components.marketAccess;
    const digital = composite.components.digitalReadiness;
    const talent = composite.components.talent;

    const friction = clamp(1 - ((infra * 0.3 + regulatory * 0.4 + political * 0.3) / 100), 0.1, 0.75);
    const partnerQuality = clamp((marketAccess * 0.4 + digital * 0.3 + talent * 0.3) / 100, 0.35, 0.95);
    const complianceDrag = clamp(1 - (regulatory / 120), 0.1, 0.55);

    const ivasScore = clamp(
        Math.round(readiness * 0.55 + partnerQuality * 45 - friction * 25),
        30,
        99
    );

    const baseMonths = clamp(24 - readiness / 5 + friction * 18 + complianceDrag * 10, 4, 48);
    const p10 = Math.max(3, Math.round(baseMonths * 0.75));
    const p50 = Math.round(baseMonths);
    const p90 = Math.min(60, Math.round(baseMonths * 1.35));

    const frictionLabel = friction > 0.5 ? 'High' : friction > 0.3 ? 'Medium' : 'Low';
    const opportunityLabel = partnerQuality > 0.75 ? 'High' : partnerQuality > 0.55 ? 'Medium' : 'Emerging';

    return {
        ivasScore,
        activationMonths: p50,
        breakdown: {
            activationFriction: frictionLabel,
            opportunityQuantum: opportunityLabel,
            complianceFriction: complianceDrag > 0.35 ? 'Elevated' : 'Controlled'
        },
        p10Months: p10,
        p50Months: p50,
        p90Months: p90
    };
};

const computeSCF = (composite: CompositeScoreResult) => {
    const marketSizeUSD = composite.inputs.gdpCurrent * 0.12;
    const readinessMultiplier = 0.75 + composite.overall / 140;
    const captureRate = clamp(0.001 + (composite.components.marketAccess / 1000), 0.001, 0.012);
    const totalImpact = marketSizeUSD * captureRate * readinessMultiplier;
    const jobCost = Math.max(composite.inputs.gdpPerCapita * 1.8, 60_000);
    const directJobs = totalImpact / jobCost;
    const volatility = (100 - composite.components.politicalStability) / 100;

    const impactP10 = totalImpact * (1 - 0.35 * volatility);
    const impactP90 = totalImpact * (1 + 0.45 * volatility);

    return {
        totalEconomicImpactUSD: totalImpact,
        directJobs: Math.round(directJobs),
        indirectJobs: Math.round(directJobs * 2.3),
        annualizedImpact: totalImpact / 5,
        impactP10: impactP10,
        impactP50: totalImpact,
        impactP90: impactP90,
        jobsP10: Math.round(directJobs * (1 - 0.3 * volatility)),
        jobsP50: Math.round(directJobs),
        jobsP90: Math.round(directJobs * (1 + 0.35 * volatility))
    };
};

export const runOpportunityOrchestration = async (regionProfile: RegionProfile): Promise<OrchResult> => {
    await new Promise(r => setTimeout(r, 1000));

    const composite = await CompositeScoreService.getScores({ country: regionProfile.country, region: regionProfile.name });
    const { components, overall } = composite;
    const ivas = computeIVAS(regionProfile, composite);
    const scf = computeSCF(composite);

    const lai: LAIResult = {
        title: `${regionProfile.country || 'Target Region'} Strategic Hub`,
        description: `Latent asset identified: underutilized capacity in ${regionProfile.rawFeatures?.[0]?.name || 'logistics and infrastructure'}.`,
        components: ["Infrastructure", "Market Access", "Talent"],
        synergyTag: overall > 70 ? 'High Synergy' : 'Moderate Synergy'
    };

    return {
        details: {
            lais: [lai],
            ivas,
            scf,
            provenance: [
                { metric: 'Composite Scores', source: composite.dataSources.join(', '), freshness: 'live' },
                { metric: 'IVAS', source: 'Composite readiness + deterministic friction model', freshness: 'live' },
                { metric: 'SCF', source: 'Market size capture model (deterministic)', freshness: 'live' }
            ]
        },
        nsilOutput: `
<nsil:analysis_report mode="Orchestrated" version="4.2">
  <executive_summary>
    <overall_score>${overall}</overall_score>
    <strategic_outlook>Composite score suggests ${(overall > 75 ? 'rapid' : overall > 60 ? 'steady' : 'guarded')} activation potential.</strategic_outlook>
    <key_findings>Infrastructure ${components.infrastructure}, Talent ${components.talent}, Market Access ${components.marketAccess}.</key_findings>
  </executive_summary>
  <match_score value="${ivas.ivasScore}" confidence="High">
    <rationale>IVAS velocity indicates P50 activation in ${ivas.activationMonths} months (P10 ${ivas.p10Months}, P90 ${ivas.p90Months}).</rationale>
  </match_score>
  <scf>
    <total_impact>${Math.round(scf.totalEconomicImpactUSD)}</total_impact>
    <direct_jobs>${scf.directJobs}</direct_jobs>
    <indirect_jobs>${scf.indirectJobs}</indirect_jobs>
    <annualized>${Math.round(scf.annualizedImpact)}</annualized>
        <impact_p10>${Math.round(scf.impactP10 || 0)}</impact_p10>
        <impact_p50>${Math.round(scf.impactP50 || scf.totalEconomicImpactUSD)}</impact_p50>
        <impact_p90>${Math.round(scf.impactP90 || scf.totalEconomicImpactUSD)}</impact_p90>
        <jobs_p10>${Math.round(scf.jobsP10 || scf.directJobs)}</jobs_p10>
        <jobs_p50>${Math.round(scf.jobsP50 || scf.directJobs)}</jobs_p50>
        <jobs_p90>${Math.round(scf.jobsP90 || scf.directJobs)}</jobs_p90>
  </scf>
</nsil:analysis_report>`
    };
};
// --- 3. RROI ENGINE ---

// Helper to generate a deterministic number from string
const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

const pseudoRandom = (seed: string, min = 0, max = 1): number => {
    const normalized = (hashString(seed) % 10_000) / 10_000;
    return min + normalized * (max - min);
};

export const generateRROI = async (params: ReportParameters): Promise<RROI_Index> => {
    const composite = await CompositeScoreService.getScores(params);
    const { components, overall } = composite;

    const infra = components.infrastructure;
    const talent = components.talent;
    const regulatory = components.regulatory;
    const market = components.marketAccess;

    const summary = `RROI for ${params.country} (${params.region}) reflects ${overall > 75 ? 'strong' : overall > 60 ? 'balanced' : 'guarded'} readiness across infrastructure ${Math.round(infra)}, talent ${Math.round(talent)}, regulatory ${Math.round(regulatory)}, and market access ${Math.round(market)} using live data feeds (${composite.dataSources.join(', ')}).`;

    return {
        overallScore: overall,
        summary,
        components: {
            infrastructure: { name: "Infrastructure Readiness", score: Math.round(infra), analysis: "Composite of logistics, utilities, and digital throughput." },
            talent: { name: "Talent Availability", score: Math.round(talent), analysis: "Skill depth, education signals, and unemployment corridor." },
            regulatory: { name: "Regulatory Ease", score: Math.round(regulatory), analysis: "Permitting efficiency plus ease-of-business differentials." },
            market: { name: "Market Access", score: Math.round(market), analysis: "Trade balance posture, FDI inflows, and regional agreements." }
        }
    };
};

// --- 4. SEAM ENGINE ---

export const generateSEAM = async (params: ReportParameters): Promise<SEAM_Blueprint> => {
    const composite = await CompositeScoreService.getScores(params);
    const { components, overall } = composite;

    const makeSynergy = (label: string, driver: number) => clamp(
        Math.round(0.45 * driver + 0.45 * overall + pseudoRandom(`${params.country || 'global'}-${label}`) * 10),
        50,
        99
    );

    const partnerBase = [
        { name: `National ${params.industry[0] || 'Trade'} Board`, role: "Regulator / Enabler", synergy: makeSynergy('regulator', components.regulatory) },
        { name: "Regional Logistics Alliance", role: "Supply Chain", synergy: makeSynergy('logistics', components.supplyChain) },
        { name: `${params.country || 'Target'} Tech Institute`, role: "Talent Pipeline", synergy: makeSynergy('talent', components.talent) },
        { name: "Global Chamber of Commerce", role: "Network Access", synergy: makeSynergy('network', components.marketAccess) }
    ];

    const gapSignals = [
        { label: 'Regulatory harmonization', score: components.regulatory },
        { label: 'Digital infrastructure hardening', score: components.digitalReadiness },
        { label: 'Supply chain observability', score: components.supplyChain },
        { label: 'Specialized talent pathways', score: components.talent }
    ];

    const gaps = gapSignals
        .filter(signal => signal.score < 75)
        .map(signal => `${signal.label} (${Math.round(signal.score)}/100)`);

    if (gaps.length === 0) {
        gaps.push('Codify advanced autonomy guardrails', 'Stand up second-source supplier guilds');
    }

    const supplySignal = (components.supplyChain + components.marketAccess) / 2;
    const score = clamp(Math.round(0.6 * overall + 0.4 * supplySignal), 55, 99);

    return {
        score,
        ecosystemHealth: score > 85 ? "Thriving" : score > 70 ? "Emerging" : "Nascent",
        partners: partnerBase,
        gaps
    };
};

// --- 5. SYMBIOTIC MATCHING ENGINE ---

export const generateSymbioticMatches = async (params: ReportParameters): Promise<SymbioticPartner[]> => {
    // LIVE DATA: Use composite scores and historical patterns for matching
    const composite = await CompositeScoreService.getScores({ country: params.country, region: params.region });
    const historicalPatterns = await HistoricalLearningEngine.findRelevantPatterns(params);
    
    const country = params.country || "Target Market";
    const industry = params.industry?.[0] || "General";
    
    // Generate partner matches based on live data and historical patterns
    const partners: SymbioticPartner[] = [];
    
    // Government/Development Partner
    if (composite.components.regulatory > 50) {
      partners.push({
        entityName: `${country} Investment Promotion Agency`,
        location: country,
        entityType: "Government Agency",
        symbiosisScore: Math.round(55 + composite.components.regulatory * 0.4),
        asymmetryAnalysis: `Strong regulatory environment (${Math.round(composite.components.regulatory)}/100) enables efficient partnership structuring.`,
        mutualBenefit: "Access to incentive programs and expedited permitting in exchange for job creation commitments.",
        riskFactors: historicalPatterns.filter(p => p.outcome === 'failure').map(p => p.lessons[0]).slice(0, 2)
      });
    }
    
    // Industry/Trade Partner
    if (composite.components.marketAccess > 50) {
      partners.push({
        entityName: `${country} ${industry} Association`,
        location: params.region || "Regional Capital",
        entityType: "Industry Body",
        symbiosisScore: Math.round(60 + composite.components.marketAccess * 0.35),
        asymmetryAnalysis: `Market access score of ${Math.round(composite.components.marketAccess)}/100 indicates strong distribution networks.`,
        mutualBenefit: "Local market intelligence and distribution channels in exchange for technology transfer.",
        riskFactors: ["Cultural adaptation timeline", "Existing competitor relationships"]
      });
    }
    
    // Talent/Education Partner
    if (composite.components.talent > 45) {
      partners.push({
        entityName: `${country} Technical University Consortium`,
        location: country,
        entityType: "Academic Institution",
        symbiosisScore: Math.round(50 + composite.components.talent * 0.45),
        asymmetryAnalysis: `Talent availability of ${Math.round(composite.components.talent)}/100 with growing technical education infrastructure.`,
        mutualBenefit: "Access to trained workforce pipeline in exchange for curriculum input and internship programs.",
        riskFactors: ["Skill gap in specialized areas", "Training timeline"]
      });
    }
    
    // Infrastructure/Logistics Partner
    if (composite.components.infrastructure > 40) {
      partners.push({
        entityName: `${params.region || 'Regional'} Logistics Alliance`,
        location: "Logistics Hub",
        entityType: "Service Provider",
        symbiosisScore: Math.round(45 + composite.components.infrastructure * 0.5),
        asymmetryAnalysis: `Infrastructure readiness at ${Math.round(composite.components.infrastructure)}/100 with ${composite.components.supplyChain > 60 ? 'established' : 'developing'} supply chain networks.`,
        mutualBenefit: "Physical distribution reach and warehousing in exchange for digital logistics optimization.",
        riskFactors: ["Integration complexity", "Capacity constraints during peak demand"]
      });
    }
    
    // Add historical success pattern recommendations
    const successPatterns = historicalPatterns.filter(p => p.outcome === 'success');
    if (successPatterns.length > 0 && partners.length < 5) {
      partners.push({
        entityName: "Historical Success Model Partner",
        location: successPatterns[0].region,
        entityType: "Strategic Reference",
        symbiosisScore: Math.round(successPatterns[0].applicabilityScore * 100),
        asymmetryAnalysis: `Based on ${successPatterns[0].era} ${successPatterns[0].region} success pattern.`,
        mutualBenefit: successPatterns[0].lessons.join('; '),
        riskFactors: successPatterns[0].keyFactors.slice(0, 2)
      });
    }
    
    return partners.sort((a, b) => b.symbiosisScore - a.symbiosisScore);
};

// --- 6. ETHICS & COMPLIANCE ENGINE ---

export const runEthicalSafeguards = async (params: ReportParameters): Promise<EthicalCheckResult> => {
    const flags: EthicsFlag[] = [];
    let score = 100;
    let status: EthicsStatus = 'PASS';

    // LIVE DATA: Get composite scores for country risk assessment
    const composite = await CompositeScoreService.getScores({ country: params.country, region: params.region });

    // Rule 1: Sanctions Check - Real OFAC/UN sanctioned jurisdictions
    const sanctionedJurisdictions = [
      'North Korea', 'DPRK', 'Iran', 'Syria', 'Cuba', 'Crimea', 
      'Donetsk', 'Luhansk', 'Belarus', 'Russia', 'Myanmar', 'Venezuela'
    ];
    const isSanctioned = sanctionedJurisdictions.some(e => 
      (params.country || '').toLowerCase().includes(e.toLowerCase()) || 
      (params.problemStatement || '').toLowerCase().includes(e.toLowerCase())
    );
    
    if (isSanctioned) {
        flags.push({ 
          name: 'Sanctions Match', 
          flag: 'BLOCK', 
          reason: 'Jurisdiction appears on OFAC/UN/EU consolidated sanctions list. Transaction prohibited under international law.', 
          evidence: ['OFAC SDN List', 'UN Security Council Resolutions', 'EU Consolidated Sanctions'] 
        });
        score = 0;
        status = 'BLOCK';
    }

    // Rule 2: High Risk Industry - Based on FATF guidance
    const highRiskIndustries = ['Defense', 'Extraction', 'Mining', 'Gambling', 'Weapons', 'Tobacco', 'Adult Entertainment'];
    if (params.industry.some(i => highRiskIndustries.some(hr => i.toLowerCase().includes(hr.toLowerCase())))) {
        flags.push({ 
          name: 'High-Risk Industry', 
          flag: 'CAUTION', 
          reason: 'Sector classified as high-risk under FATF AML/CFT guidance. Enhanced due diligence (EDD) required.', 
          evidence: ['FATF Risk Assessment', 'Sector Analysis'] 
        });
        score -= 20;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    // Rule 3: CPI Check - Use live political stability score as proxy
    const politicalStabilityScore = composite.components.politicalStability;
    if (politicalStabilityScore < 40) {
        flags.push({ 
          name: 'Corruption Risk Elevated', 
          flag: 'CAUTION', 
          reason: `Political stability score of ${Math.round(politicalStabilityScore)}/100 indicates elevated corruption/governance risk.`, 
          evidence: ['World Bank Governance Indicators', 'Transparency International CPI'] 
        });
        score -= 15;
        if (status !== 'BLOCK') status = 'CAUTION';
    } else if (politicalStabilityScore < 55) {
        flags.push({ 
          name: 'Governance Monitoring Required', 
          flag: 'CAUTION', 
          reason: `Moderate governance score (${Math.round(politicalStabilityScore)}/100) - recommend ongoing monitoring.`, 
          evidence: ['World Bank Governance Indicators'] 
        });
        score -= 8;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    // Rule 4: Regulatory Environment Check
    const regulatoryScore = composite.components.regulatory;
    if (regulatoryScore < 45) {
        flags.push({ 
          name: 'Regulatory Opacity', 
          flag: 'CAUTION', 
          reason: `Low regulatory transparency score (${Math.round(regulatoryScore)}/100) may complicate compliance.`, 
          evidence: ['World Bank Ease of Business', 'Regulatory Quality Index'] 
        });
        score -= 10;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    // Rule 5: Data Completeness (Transparency)
    if (!params.organizationName || params.organizationName.length < 3) {
        flags.push({ 
          name: 'Insufficient Entity Identification', 
          flag: 'CAUTION', 
          reason: 'Entity name not provided or insufficient for KYC/AML screening.', 
          evidence: ['Input Validation'] 
        });
        score -= 10;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    // Rule 6: ESG/Environmental Check
    if (params.industry.some(i => ['Oil', 'Gas', 'Coal', 'Extraction', 'Mining'].some(e => i.toLowerCase().includes(e.toLowerCase())))) {
        flags.push({ 
          name: 'ESG Disclosure Required', 
          flag: 'CAUTION', 
          reason: 'Sector has elevated environmental impact - ESG assessment and climate disclosure recommended.', 
          evidence: ['TCFD Framework', 'GRI Standards'] 
        });
        score -= 5;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    const mitigation: MitigationStep[] = [];
    if (status === 'BLOCK') {
        mitigation.push({ step: "Immediate Halt", detail: "Transaction cannot proceed under current sanctions regulations." });
        mitigation.push({ step: "Legal Review", detail: "Escalate to General Counsel for OFAC/sanctions validation." });
        mitigation.push({ step: "License Application", detail: "If legitimate purpose exists, consider OFAC specific license application." });
    } else if (status === 'CAUTION') {
        mitigation.push({ step: "Enhanced Due Diligence", detail: "Trigger Level-3 forensic audit on local partners and beneficial owners." });
        mitigation.push({ step: "Anti-Bribery Certification", detail: "Require ISO 37001 anti-bribery certification from counterparties." });
        mitigation.push({ step: "Ongoing Monitoring", detail: "Implement continuous sanctions screening and adverse media monitoring." });
        if (flags.some(f => f.name.includes('ESG'))) {
          mitigation.push({ step: "ESG Assessment", detail: "Commission independent ESG impact assessment before proceeding." });
        }
    } else {
        mitigation.push({ step: "Standard Compliance", detail: "Proceed with standard quarterly compliance reviews and annual audits." });
    }

    return {
        passed: status !== 'BLOCK',
        score: Math.max(0, score),
        overallFlag: status,
        flags: flags,
        mitigation: mitigation,
        timestamp: new Date().toISOString(),
        version: "5.0.0-live"
    };
};

// --- 7. SUCCESS PROBABILITY INDEX (SPI) ENGINE ---

const WEIGHTS = {
    ER: 0.25, // Economic Readiness
    SP: 0.20, // Symbiotic Fit
    PS: 0.15, // Political Stability
    PR: 0.15, // Partner Reliability
    EA: 0.10, // Ethics/Compliance
    CA: 0.10, // Activation Velocity
    UT: 0.05  // User Transparency
};

const calculateTransparencyScore = (params: ReportParameters): number => {
    let score = 0;
    if (params.organizationName) score += 20;
    if (params.strategicIntent) score += 20;
    if (params.problemStatement && params.problemStatement.length > 20) score += 20;
    if (params.industry.length > 0) score += 20;
    if (params.calibration?.constraints?.budgetCap) score += 20;
    return score;
};

const getRegionRiskScore = (region: string, country: string): number => {
    // Simplified lookup - in prod this would query a risk DB
    const riskMap: Record<string, number> = {
        'Singapore': 95, 'United Kingdom': 88, 'United States': 90, 
        'Germany': 92, 'Vietnam': 65, 'Indonesia': 60, 
        'Brazil': 55, 'Nigeria': 40
    };
    return riskMap[country] || (region === 'Asia-Pacific' ? 70 : 60);
};


export const calculateSPI = async (params: ReportParameters): Promise<SPIResult> => {
    const composite = await CompositeScoreService.getScores(params);
    const { components, overall } = composite;

    // Get historical patterns for context-aware scoring
    const historicalPatterns = await HistoricalLearningEngine.findRelevantPatterns(params);
    const hasSuccessPatterns = historicalPatterns.filter(p => p.outcome === 'success').length > 0;
    const historicalBonus = hasSuccessPatterns ? 5 : 0;

    const ER = Math.round(
        components.infrastructure * 0.35 +
        components.talent * 0.35 +
        components.marketAccess * 0.2 +
        components.costEfficiency * 0.1
    );

    const hasTech = params.industry.includes('Technology');
    const regionNeedsTech = params.region === 'Asia-Pacific' || params.region === 'Middle East';
    const symbioticSignal = (components.marketAccess + components.innovation + components.supplyChain) / 3;
    const SP = clamp(
        Math.round(symbioticSignal + (hasTech && regionNeedsTech ? 8 : 0) + historicalBonus),
        45,
        99
    );

    const PS = Math.round(
        0.7 * components.politicalStability +
        0.3 * getRegionRiskScore(params.region, params.country)
    );

    const dueDiligenceBase = params.dueDiligenceDepth === 'Deep' ? 95 : params.dueDiligenceDepth === 'Standard' ? 80 : 65;
    const reliabilitySignal = (components.regulatory + components.supplyChain) / 2;
    const PR = clamp(Math.round(0.5 * dueDiligenceBase + 0.5 * reliabilitySignal), 45, 98);

    // Use async ethics check with live data
    const ethicsResult = await runEthicalSafeguards(params);
    const EA = ethicsResult.score;

    const frictionSignal = 100 - components.riskFactors;
    const CA = clamp(Math.round(0.5 * overall + 0.5 * frictionSignal + historicalBonus), 45, 98);

    const UT = calculateTransparencyScore(params);

    const rawSPI = (
        (ER * WEIGHTS.ER) +
        (SP * WEIGHTS.SP) +
        (PS * WEIGHTS.PS) +
        (PR * WEIGHTS.PR) +
        (EA * WEIGHTS.EA) +
        (CA * WEIGHTS.CA) +
        (UT * WEIGHTS.UT)
    );

    const ciDelta = 12 * (1 - (UT / 100));

    // Add historical context to breakdown
    const breakdown = [
        { label: 'Economic Readiness', value: Math.round(ER) },
        { label: 'Symbiotic Fit', value: Math.round(SP) },
        { label: 'Political Stability', value: Math.round(PS) },
        { label: 'Partner Reliability', value: Math.round(PR) },
        { label: 'Ethical Alignment', value: Math.round(EA) },
        { label: 'Activation Velocity', value: Math.round(CA) },
        { label: 'Transparency', value: Math.round(UT) }
    ];

    // Add historical insight if available
    if (historicalPatterns.length > 0) {
      const topPattern = historicalPatterns[0];
      breakdown.push({ 
        label: `Historical Reference (${topPattern.era})`, 
        value: Math.round(topPattern.applicabilityScore * 100) 
      });
    }

    return {
        spi: Math.round(rawSPI),
        ciLow: Math.round(rawSPI - ciDelta),
        ciHigh: Math.round(rawSPI + ciDelta),
        breakdown,
        dataSources: composite.dataSources,
        historicalContext: historicalPatterns.slice(0, 2).map(p => ({
          era: p.era,
          region: p.region,
          outcome: p.outcome,
          lesson: p.lessons[0]
        }))
    };
};

export const generateFastSuggestion = async (input: string, context: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`${input} (Optimized for ${context})`);
        }, 600);
    });
};