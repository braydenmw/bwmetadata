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
    LAIResult
} from '../types';
import { GLOBAL_CITY_DATABASE } from '../constants';
import { LiveDataService } from './LiveDataService';

// --- 1. MARKET DIVERSIFICATION ENGINE ---

export class MarketDiversificationEngine {
  static calculateHHI(markets: MarketShare[]): number {
    return markets.reduce((acc, m) => acc + Math.pow(m.share, 2), 0);
  }

  static analyzeConcentration(markets: MarketShare[]): DiversificationAnalysis {
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

    // Mock recommendations based on typical diversification strategies
    const recommendedMarkets: MarketOpportunity[] = [
      {
        country: 'Vietnam',
        growthRate: 6.8,
        easeOfEntry: 65,
        talentAvailability: 70,
        innovationIndex: 55,
        regulatoryFriction: 60,
        marketSize: '$400B',
        opportunityScore: 88,
        recommendedStrategy: 'Supply Chain Hedge',
        rationale: 'High growth potential with lower labor costs creates an ideal hedge against East Asian concentration.'
      },
      {
        country: 'Poland',
        growthRate: 4.5,
        easeOfEntry: 80,
        talentAvailability: 85,
        innovationIndex: 75,
        regulatoryFriction: 30,
        marketSize: '$700B',
        opportunityScore: 82,
        recommendedStrategy: 'Nearshoring Hub',
        rationale: 'Excellent technical talent pool and EU market access offers stability and quality.'
      },
      {
        country: 'Mexico',
        growthRate: 3.2,
        easeOfEntry: 75,
        talentAvailability: 65,
        innovationIndex: 60,
        regulatoryFriction: 45,
        marketSize: '$1.3T',
        opportunityScore: 79,
        recommendedStrategy: 'Logistics Proximity',
        rationale: 'Strategic proximity to North American markets minimizes logistics risks.'
      }
    ];

    return {
      hhiScore: hhi,
      riskLevel,
      concentrationAnalysis: analysis,
      recommendedMarkets
    };
  }
}

const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num));

const seededRandom = (seed: string) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    return () => {
        h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
        return (h >>> 0) / 4294967296;
    };
};

const percentile = (arr: number[], p: number) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = (sorted.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
};

const score12Components = (regionProfile: RegionProfile) => {
    const rnd = seededRandom(regionProfile.id || regionProfile.name);
    const pick = () => Math.round(55 + (rnd() - 0.5) * 30);
    const components = {
        infrastructure: pick(),
        talent: pick(),
        costEfficiency: pick(),
        marketAccess: pick(),
        regulatory: pick(),
        politicalStability: pick(),
        growthPotential: pick(),
        riskFactors: pick(),
        digitalReadiness: pick(),
        sustainability: pick(),
        innovation: pick(),
        supplyChain: pick()
    };

    const weights: Record<keyof typeof components, number> = {
        infrastructure: 0.1,
        talent: 0.1,
        costEfficiency: 0.08,
        marketAccess: 0.1,
        regulatory: 0.08,
        politicalStability: 0.08,
        growthPotential: 0.1,
        riskFactors: 0.08,
        digitalReadiness: 0.07,
        sustainability: 0.07,
        innovation: 0.07,
        supplyChain: 0.07,
    };

    const overall = Object.entries(components).reduce((sum, [k, v]) => sum + v * weights[k as keyof typeof components], 0);
    return { components, overall: Math.round(overall) };
};

const computeIVAS = (regionProfile: RegionProfile, compositeScore: number) => {
    const rnd = seededRandom(regionProfile.id + '-ivas');

    // Base draws
    const frictionBase = 0.25 + rnd() * 0.35; // 0.25–0.6
    const partnerQualityBase = 70 + rnd() * 25; // 70–95

    // Monte Carlo around friction/partner quality
    const trials = 200;
    const monthsSamples: number[] = [];
    for (let i = 0; i < trials; i++) {
        const jitter = seededRandom(regionProfile.id + '-ivas-' + i);
        const friction = clamp(frictionBase + (jitter() - 0.5) * 0.12, 0.15, 0.7);
        const partnerQuality = clamp(partnerQualityBase + (jitter() - 0.5) * 8, 50, 99);
        const base = compositeScore * 0.6 + partnerQuality * 0.4;
        const ivasScore = clamp(Math.round(base - friction * 40), 30, 99);
        const months = clamp(Math.round(18 - ivasScore / 10 + friction * 12), 4, 48);
        monthsSamples.push(months);
    }

    const p10 = Math.round(percentile(monthsSamples, 0.1));
    const p50 = Math.round(percentile(monthsSamples, 0.5));
    const p90 = Math.round(percentile(monthsSamples, 0.9));

    const frLabel = frictionBase > 0.45 ? 'High' : frictionBase > 0.32 ? 'Medium' : 'Low';
    const oqLabel = partnerQualityBase > 85 ? 'High' : 'Medium';

    return {
        ivasScore: clamp(Math.round(compositeScore * 0.6 + partnerQualityBase * 0.4 - frictionBase * 40), 30, 99),
        activationMonths: p50,
        breakdown: {
            activationFriction: frLabel,
            opportunityQuantum: oqLabel
        },
        p10Months: p10,
        p50Months: p50,
        p90Months: p90
    };
};

const computeSCF = (regionProfile: RegionProfile, compositeScore: number) => {
    const rnd = seededRandom(regionProfile.id + '-scf');
    const marketSizeUSD = (regionProfile.gdp || 50_000_000_000) * 0.1; // reachable market proxy
    const captureBase = 0.0025 + rnd() * 0.0035; // 0.25%–0.6%

    const trials = 200;
    const impactSamples: number[] = [];
    const jobsSamples: number[] = [];

    for (let i = 0; i < trials; i++) {
        const jitter = seededRandom(regionProfile.id + '-scf-' + i);
        const capture = clamp(captureBase + (jitter() - 0.5) * 0.0015, 0.0015, 0.007);
        const totalImpact = marketSizeUSD * capture * (0.8 + compositeScore / 150);
        const jobs = totalImpact / 140000;
        impactSamples.push(totalImpact);
        jobsSamples.push(jobs);
    }

    const p10Impact = percentile(impactSamples, 0.1);
    const p50Impact = percentile(impactSamples, 0.5);
    const p90Impact = percentile(impactSamples, 0.9);
    const p50Jobs = jobsSamples.sort((a, b) => a - b)[Math.floor(jobsSamples.length / 2)];

    return {
        totalEconomicImpactUSD: p50Impact,
        directJobs: Math.round(p50Jobs),
        indirectJobs: Math.round(p50Jobs * 2.3),
        annualizedImpact: p50Impact / 5,
        impactP10: p10Impact,
        impactP50: p50Impact,
        impactP90: p90Impact,
        jobsP10: Math.round(percentile(jobsSamples, 0.1)),
        jobsP50: Math.round(p50Jobs),
        jobsP90: Math.round(percentile(jobsSamples, 0.9))
    };
};

export const runOpportunityOrchestration = async (regionProfile: RegionProfile): Promise<OrchResult> => {
    await new Promise(r => setTimeout(r, 1000));

    const { components, overall } = score12Components(regionProfile);
    const ivas = computeIVAS(regionProfile, overall);
    const scf = computeSCF(regionProfile, overall);

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
                { metric: 'IVAS', source: 'Composite readiness + friction model (seeded)', freshness: 'simulated' },
                { metric: 'SCF', source: 'Composite readiness + capture Monte Carlo (seeded)', freshness: 'simulated' },
                { metric: 'RROI/SEAM', source: '12-component composite (seeded)', freshness: 'simulated' }
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

export const generateRROI = async (params: ReportParameters): Promise<RROI_Index> => {
    const regionProfile = buildRegionProfileFromParams(params);
    const { components, overall } = score12Components(regionProfile);

    const infra = components.infrastructure;
    const talent = components.talent;
    const regulatory = components.regulatory;
    const market = components.marketAccess;

    const summary = `RROI for ${params.country} (${params.region}) shows ${overall > 75 ? 'strong' : overall > 60 ? 'moderate' : 'guarded'} alignment. Drivers: infra ${infra}, talent ${talent}, regulatory ${regulatory}, market ${market}.`;

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                overallScore: overall,
                summary,
                components: {
                    infrastructure: { name: "Infrastructure Readiness", score: Math.round(infra), analysis: "Transport, digital, utilities readiness." },
                    talent: { name: "Talent Availability", score: Math.round(talent), analysis: "Skill depth and availability." },
                    regulatory: { name: "Regulatory Ease", score: Math.round(regulatory), analysis: "Permitting, compliance, predictability." },
                    market: { name: "Market Access", score: Math.round(market), analysis: "Reach, agreements, shipping time." }
                }
            });
        }, 800);
    });
};

// --- 4. SEAM ENGINE ---

export const generateSEAM = async (params: ReportParameters): Promise<SEAM_Blueprint> => {
    const regionProfile = buildRegionProfileFromParams(params);
    const { overall } = score12Components(regionProfile);
    const rnd = seededRandom(regionProfile.id + '-seam');

    const partnerBase = [
        { name: `National ${params.industry[0] || 'Trade'} Board`, role: "Regulator / Enabler", synergy: 80 + Math.round(rnd() * 10) },
        { name: "Regional Logistics Alliance", role: "Supply Chain", synergy: 75 + Math.round(rnd() * 15) },
        { name: `${params.country || 'Target'} Tech Institute`, role: "Talent Pipeline", synergy: 72 + Math.round(rnd() * 12) },
        { name: "Global Chamber of Commerce", role: "Network Access", synergy: 68 + Math.round(rnd() * 10) }
    ];

    const gaps = overall > 75
        ? ["Scale specialized legal for IP/FDI", "Deepen advanced manufacturing QA"]
        : ["Strengthen logistics transparency", "Formalize compliance playbooks", "Upskill workforce for target sector"];

    const score = clamp(Math.round(overall + (rnd() - 0.5) * 10), 55, 98);

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                score,
                ecosystemHealth: score > 85 ? "Thriving" : score > 70 ? "Emerging" : "Nascent",
                partners: partnerBase,
                gaps
            });
        }, 900);
    });
};

// --- 5. SYMBIOTIC MATCHING ENGINE ---

export const generateSymbioticMatches = async (params: ReportParameters): Promise<SymbioticPartner[]> => {
    // Simulated Matchmaking with deterministic names based on region
    const regionPrefix = params.region === 'Asia-Pacific' ? 'Asian' : params.region === 'Europe' ? 'Euro' : 'Global';
    const country = params.country || "Target Market";

    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    entityName: `${regionPrefix} Innovations Group`,
                    location: country,
                    entityType: "Private Enterprise",
                    symbiosisScore: 94,
                    asymmetryAnalysis: "High capital efficiency. They have excess manufacturing capacity that matches your production needs.",
                    mutualBenefit: "You get low-cost production; they get utilization of idle assets.",
                    riskFactors: ["Currency fluctuation"]
                },
                {
                    entityName: `${country} Development Fund`,
                    location: params.region || "Regional Capital",
                    entityType: "Government Agency",
                    symbiosisScore: 89,
                    asymmetryAnalysis: "They offer non-dilutive grants for tech transfer.",
                    mutualBenefit: "You get capital; they get economic development KPIs met.",
                    riskFactors: ["Bureaucratic timeline"]
                },
                {
                    entityName: "Orion Logistics",
                    location: "Logistics Hub",
                    entityType: "Service Provider",
                    symbiosisScore: 85,
                    asymmetryAnalysis: "Deep local distribution network but lacks digital tracking.",
                    mutualBenefit: "You provide the digital layer; they provide physical reach.",
                    riskFactors: ["Integration complexity"]
                }
            ]);
        }, 1800);
    });
};

// --- 6. ETHICS & COMPLIANCE ENGINE ---

export const runEthicalSafeguards = (params: ReportParameters): EthicalCheckResult => {
    const flags: EthicsFlag[] = [];
    let score = 100;
    let status: EthicsStatus = 'PASS';

    // Rule 1: Sanctions Check (Mocked basic keyword check)
    const sanctionedEntities = ['North Korea', 'Iran', 'Crimea', 'SpecificSanctionedEntity'];
    const isSanctioned = sanctionedEntities.some(e => (params.country || '').includes(e) || (params.problemStatement || '').includes(e));
    
    if (isSanctioned) {
        flags.push({ name: 'Sanctions Match', flag: 'BLOCK', reason: 'Jurisdiction or entity appears on OFAC/UN sanctions list.', evidence: ['OFAC List Match'] });
        score = 0;
        status = 'BLOCK';
    }

    // Rule 2: High Risk Industry
    const highRiskIndustries = ['Defense', 'Extraction', 'Mining', 'Gambling'];
    if (params.industry.some(i => highRiskIndustries.includes(i))) {
        flags.push({ name: 'High-Risk Industry', flag: 'CAUTION', reason: 'Sector requires enhanced due diligence (EDD) and ESIA documentation.', evidence: ['Sector Analysis'] });
        score -= 20;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    // Rule 3: CPI (Corruption Perception) Check (Simplified)
    const lowCPICountries = ['SomeHighRiskCountry', 'AnotherRiskyOne']; // Placeholders
    if (lowCPICountries.includes(params.country)) {
        flags.push({ name: 'CPI Threshold', flag: 'CAUTION', reason: 'Region falls below CPI threshold of 40.', evidence: ['Transparency International Index'] });
        score -= 15;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    // Rule 4: Data Completeness (Transparency)
    if (!params.organizationName || params.organizationName.length < 3) {
        flags.push({ name: 'Anonymous Actor', flag: 'CAUTION', reason: 'Insufficient entity identification provided.', evidence: ['Input Validation'] });
        score -= 10;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    const mitigation: MitigationStep[] = [];
    if (status === 'BLOCK') {
        mitigation.push({ step: "Immediate Halt", detail: "Transaction/Analysis cannot proceed under current compliance rules." });
        mitigation.push({ step: "Legal Review", detail: "Escalate to General Counsel for sanctions validation." });
    } else if (status === 'CAUTION') {
        mitigation.push({ step: "Enhanced Due Diligence", detail: "Trigger Level-3 forensic audit on local partners." });
        mitigation.push({ step: "Anti-Bribery Certification", detail: "Require ISO 37001 certification from counterparties." });
    } else {
        mitigation.push({ step: "Standard Monitor", detail: "Proceed with standard quarterly compliance reviews." });
    }

    return {
        passed: status !== 'BLOCK',
        score: Math.max(0, score),
        overallFlag: status,
        flags: flags,
        mitigation: mitigation,
        timestamp: new Date().toISOString(),
        version: "4.2.0"
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

// Cache for real data to avoid repeated API calls
const realDataCache = new Map<string, { gdp: number; population: number; fdi: number; timestamp: number }>();
const REAL_DATA_CACHE_DURATION = 3600000; // 1 hour

const fetchRealMarketData = async (country: string): Promise<{ gdp: number; population: number; fdi: number }> => {
    const cached = realDataCache.get(country);
    if (cached && Date.now() - cached.timestamp < REAL_DATA_CACHE_DURATION) {
        return { gdp: cached.gdp, population: cached.population, fdi: cached.fdi };
    }

    try {
        const [gdp, population, fdi] = await Promise.all([
            LiveDataService.getRealGDP(country),
            LiveDataService.getRealPopulation(country),
            LiveDataService.getRealFDI(country)
        ]);
        
        const data = { gdp, population, fdi };
        realDataCache.set(country, { ...data, timestamp: Date.now() });
        console.log(`📊 Fetched REAL data for ${country}: GDP $${(gdp/1e9).toFixed(1)}B, Pop ${(population/1e6).toFixed(1)}M`);
        return data;
    } catch (error) {
        console.warn(`Failed to fetch real data for ${country}, using defaults:`, error);
        return { gdp: 50_000_000_000, population: 10_000_000, fdi: 10_000_000_000 };
    }
};

const buildRegionProfileFromParams = (params: ReportParameters): RegionProfile => ({
    id: `region-${(params.region || params.country || 'global').replace(/\s+/g, '-').toLowerCase()}`,
    name: params.region || params.country || 'Global',
    country: params.country || params.region || 'Global',
    population: 10_000_000, // Will be updated with real data in async functions
    gdp: 50_000_000_000, // Will be updated with real data in async functions
    rawFeatures: [
        { name: params.industry[0] || 'Strategic Hub', rarityScore: 7, relevanceScore: 8, marketProxy: 40_000 },
        { name: 'Logistics Corridor', rarityScore: 6, relevanceScore: 7, marketProxy: 30_000 }
    ]
});

// Enhanced version that fetches real data
const buildRegionProfileWithRealData = async (params: ReportParameters): Promise<RegionProfile> => {
    const country = params.country || params.region || 'Global';
    const realData = await fetchRealMarketData(country);
    
    return {
        id: `region-${(params.region || params.country || 'global').replace(/\s+/g, '-').toLowerCase()}`,
        name: params.region || params.country || 'Global',
        country,
        population: realData.population,
        gdp: realData.gdp,
        fdi: realData.fdi,
        rawFeatures: [
            { name: params.industry[0] || 'Strategic Hub', rarityScore: 7, relevanceScore: 8, marketProxy: 40_000 },
            { name: 'Logistics Corridor', rarityScore: 6, relevanceScore: 7, marketProxy: 30_000 }
        ],
        dataSource: 'World Bank Open Data API'
    };
};

export const calculateSPI = (params: ReportParameters): SPIResult => {
    // Derive composite readiness from 12-component scorer for better grounding
    const regionProfile = buildRegionProfileFromParams(params);
    const { components, overall } = score12Components(regionProfile);

    // Economic Readiness (ER) informed by composite infra/talent/marketAccess
    const ER = Math.round((components.infrastructure * 0.35) + (components.talent * 0.35) + (components.marketAccess * 0.3));

    // Symbiotic Fit (SP)
    const hasTech = params.industry.includes('Technology');
    const regionNeedsTech = params.region === 'Asia-Pacific' || params.region === 'Middle East';
    const SP = hasTech && regionNeedsTech ? 88 : Math.round(65 + (components.innovation / 5));

    // Political Stability (PS)
    const PS = getRegionRiskScore(params.region, params.country);

    // Partner Reliability (PR)
    const PR = params.dueDiligenceDepth === 'Deep' ? 95 : params.dueDiligenceDepth === 'Standard' ? 80 : 60;

    // Ethics/Compliance (EA)
    const ethicsResult = runEthicalSafeguards(params);
    const EA = ethicsResult.score;

    // Activation Velocity (CA) inversely tied to composite friction (use overall as proxy)
    const CA = clamp(Math.round(70 + (overall - 60)), 40, 95);

    // User Transparency (UT)
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

    return {
        spi: Math.round(rawSPI),
        ciLow: Math.round(rawSPI - ciDelta),
        ciHigh: Math.round(rawSPI + ciDelta),
        breakdown: [
            { label: 'Economic Readiness', value: Math.round(ER) },
            { label: 'Symbiotic Fit', value: Math.round(SP) },
            { label: 'Political Stability', value: Math.round(PS) },
            { label: 'Partner Reliability', value: Math.round(PR) },
            { label: 'Ethical Alignment', value: Math.round(EA) },
            { label: 'Activation Velocity', value: Math.round(CA) },
            { label: 'Transparency', value: Math.round(UT) }
        ]
    };
};

export const generateFastSuggestion = async (input: string, context: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`${input} (Optimized for ${context})`);
        }, 600);
    });
};