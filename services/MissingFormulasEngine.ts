
import {
  ReportParameters,
  AdvancedIndexResults,
  BARNAResult,
  NVIResult,
  CAPResult,
  AGIResult,
  VCIResult,
  ATIResult,
  ESIResult,
  ISIResult,
  OSIResult,
  RNIResult,
  SRAResult,
  IDVResult,
  CompositeScoreResult,
  InsightBand
} from '../types';
import CompositeScoreService from './CompositeScoreService';
import LiveDataService from './LiveDataService';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const determineBand = (score: number): InsightBand => {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'low';
  return 'critical';
};

const HEADCOUNT_LOOKUP: Record<string, number> = {
  '<5': 4,
  '5-10': 8,
  '10-50': 30,
  '11-50': 30,
  '50-100': 75,
  '51-100': 75,
  '100-250': 160,
  '250-500': 375,
  '500-1000': 750,
  '1000_5000': 2500,
  'over_10000': 12000
};

const parseHeadcount = (band?: string) => HEADCOUNT_LOOKUP[band || ''] || 500;
const parseDealSizeUSD = (dealSize?: string, custom?: string): number => {
  const source = custom || dealSize;
  if (!source) return 50_000_000;
  const numeric = Number(source.replace(/[^0-9.]/g, ''));
  if (Number.isFinite(numeric) && numeric > 0) {
    if (/b/i.test(source)) return numeric * 1_000_000_000;
    if (/m/i.test(source)) return numeric * 1_000_000;
    if (/k/i.test(source)) return numeric * 1_000;
    return numeric;
  }
  return 50_000_000;
};

class AdvancedIndexService {
  static async computeIndices(params: ReportParameters): Promise<AdvancedIndexResults> {
    const composite = await CompositeScoreService.getScores(params);
    const liveData = await LiveDataService.getCountryIntelligence(params.country || params.region || 'Global');

    return {
      barna: this.computeBARNA(params, composite, liveData.profile?.region),
      nvi: this.computeNVI(params, composite, liveData.economics?.gdpCurrent),
      cap: this.computeCAP(params, composite),
      agi: this.computeAGI(params, composite),
      vci: this.computeVCI(params, composite, liveData.economics?.fdiInflows),
      ati: this.computeATI(params, composite),
      esi: this.computeESI(params, composite),
      isi: this.computeISI(params, composite),
      osi: this.computeOSI(params, composite),
      rni: this.computeRNI(params, composite),
      sra: this.computeSRA(params, composite, liveData.economics?.inflation),
      idv: this.computeIDV(params, composite, liveData.profile?.region)
    };
  }

  private static buildSources(composite: CompositeScoreResult, liveSources?: string[]): string[] {
    return Array.from(new Set([...(composite.dataSources || []), ...(liveSources || [])]));
  }

  private static computeBARNA(params: ReportParameters, composite: CompositeScoreResult, region?: string): BARNAResult {
    let score = 58;
    const drivers: string[] = [];
    const pressurePoints: string[] = [];

    if (params.fundingSource === 'Internal Cashflow') {
      score += 7;
      drivers.push('Internal cash reserves reduce dependency on counterparties');
    }
    if ((params.targetCounterpartType?.length || 0) >= 2) {
      score += 5;
      drivers.push('Multiple partner archetypes available for parallel negotiations');
    }
    if ((params.partnerPersonas?.length || 0) === 0) {
      score -= 8;
      pressurePoints.push('No documented partner personas to pressure-test leverage');
    }
    if (composite.components.regulatory > 75) {
      score += 6;
      drivers.push('Regulatory clarity increases leverage on deal terms');
    }
    if (composite.components.riskFactors > 60) {
      score -= 6;
      pressurePoints.push('Macroeconomic risk softens fallback positions');
    }

    const leverageProfile = score >= 78 ? 'dominant' : score >= 60 ? 'balanced' : 'weak';
    const fallbackPositions = params.targetIncentives?.length
      ? params.targetIncentives.map(t => `Reframe around ${t}`)
      : ['Escalate to phased commitments', 'Swap equity for offtake guarantees'];

    const recommendation = leverageProfile === 'dominant'
      ? 'Lock in upside clauses (earn-outs, IP royalties) while leverage remains high.'
      : 'Prepare alternative phasing (pilot + option) to avoid unfavorable concessions.';

    return {
      score: clamp(score, 0, 100),
      band: determineBand(score),
      drivers,
      pressurePoints,
      recommendation,
      dataSources: composite.dataSources,
      leverageProfile,
      fallbackPositions,
      confidence: clamp(0.55 + (params.dueDiligenceDepth === 'Deep' ? 0.2 : 0) + (params.problemStatement ? 0.05 : 0), 0.4, 0.95)
    };
  }

  private static computeNVI(params: ReportParameters, composite: CompositeScoreResult, gdpCurrent?: number): NVIResult {
    const marketSignal = (composite.components.marketAccess + composite.components.innovation) / 2;
    let score = clamp(0.65 * marketSignal + 0.35 * composite.overall, 20, 98);
    if (params.specificOpportunity) score += 4;
    if (params.priorityThemes?.includes('Innovation')) score += 3;

    const monetaryValueUSD = Math.round(((gdpCurrent || composite.inputs.gdpCurrent || 80_000_000_000) * 0.00045) * (score / 100));
    const intangibleValueNarrative = `Brand signal gains from ${regionLabel(params)} plus innovation spillovers lift perceived value even if monetary capture is capped at $${(monetaryValueUSD/1_000_000).toFixed(1)}M.`;

    return {
      score: clamp(score, 0, 100),
      band: determineBand(score),
      drivers: [
        `Market access score ${Math.round(composite.components.marketAccess)}/100`,
        `Innovation index ${Math.round(composite.components.innovation)}/100`
      ],
      pressurePoints: composite.components.costEfficiency < 55 ? ['Cost structure still above regional peers'] : [],
      recommendation: 'Monetize the value surplus via premium SLAs or proprietary data licensing.',
      dataSources: composite.dataSources,
      monetaryValueUSD,
      intangibleValueNarrative
    };
  }

  private static computeCAP(params: ReportParameters, composite: CompositeScoreResult): CAPResult {
    const dueDiligenceDepth = (params.dueDiligenceDepth?.toLowerCase() as CAPResult['diligenceDepth']) || 'standard';
    let score = clamp(0.5 * composite.components.regulatory + 0.5 * composite.components.politicalStability, 30, 95);
    if (params.partnerFitCriteria?.length) score += 5;
    if ((params.partnerPersonas?.length || 0) < 1) score -= 6;

    const trustSignals = [
      `Regulatory quality ${Math.round(composite.components.regulatory)}/100`,
      `Ethics score ${Math.round(composite.components.digitalReadiness)}/100` // proxy for transparency
    ];
    if (params.partnerFitCriteria?.length) trustSignals.push(`${params.partnerFitCriteria.length} partner fit criteria defined`);

    const redFlags = [] as string[];
    if (!params.partnerEngagementNotes) redFlags.push('No engagement notes logged against target counterparties');
    if (composite.components.riskFactors > 65) redFlags.push('Country risk remains elevated');

    return {
      score,
      band: determineBand(score),
      drivers: trustSignals,
      pressurePoints: redFlags,
      recommendation: redFlags.length ? 'Run enhanced diligence (KYC, sanctions refresh) before term sheet.' : 'Proceed with structured engagement playbook.',
      dataSources: composite.dataSources,
      counterpartiesAssessed: params.partnerPersonas?.length || 0,
      trustSignals,
      redFlags,
      diligenceDepth: dueDiligenceDepth
    };
  }

  private static computeAGI(params: ReportParameters, composite: CompositeScoreResult): AGIResult {
    const growthSignal = composite.components.growthPotential;
    let score = clamp(0.6 * growthSignal + 0.4 * composite.overall, 25, 98);
    if (params.expansionTimeline === '0_6_months') score += 6;
    else if (params.expansionTimeline === '6_12_months') score += 3;
    if (params.priorityThemes?.includes('Acceleration')) score += 4;

    const velocityScore = score;
    const baseMonths = params.expansionTimeline === '0_6_months' ? 6 : params.expansionTimeline === '6_12_months' ? 12 : 18;
    const p50 = Math.max(4, baseMonths - Math.round(score / 20));
    const p10 = Math.max(2, Math.round(p50 * 0.7));
    const p90 = Math.round(p50 * 1.4);
    const gatingFactors = composite.components.regulatory < 55 ? ['Permitting backlog'] : [];
    if (composite.components.talent < 60) gatingFactors.push('Specialized talent availability');

    return {
      score,
      band: determineBand(score),
      drivers: [`Growth potential ${Math.round(growthSignal)}/100`, `Composite strength ${composite.overall}/100`],
      pressurePoints: gatingFactors,
      recommendation: gatingFactors.length ? 'Sequence workstreams to unblock gating factors before scale-up.' : 'Accelerate activation with milestone-based funding.',
      dataSources: composite.dataSources,
      velocityScore,
      timeToValueMonths: { p10, p50, p90 },
      gatingFactors
    };
  }

  private static computeVCI(params: ReportParameters, composite: CompositeScoreResult, fdiInflows?: number): VCIResult {
    let score = clamp(0.5 * composite.components.costEfficiency + 0.5 * composite.components.marketAccess, 25, 95);
    if (params.strategicObjectives?.includes('Scale revenue')) score += 4;

    const revenueLiftUSD = Math.round((parseDealSizeUSD(params.dealSize, params.customDealSize) * 0.6) * (score / 100));
    const costSavingsUSD = Math.round(revenueLiftUSD * (composite.components.costEfficiency / 200));
    const strategicPremiumUSD = Math.round((fdiInflows || composite.inputs.fdiInflows || 5_000_000_000) * 0.02 * (score / 100));

    return {
      score,
      band: determineBand(score),
      drivers: [`Cost efficiency ${Math.round(composite.components.costEfficiency)}/100`, `Market reach ${Math.round(composite.components.marketAccess)}/100`],
      pressurePoints: composite.components.supplyChain < 55 ? ['Supply chain fragility may dilute value capture'] : [],
      recommendation: 'Tie incentives to realized value segments (revenue lift vs. cost savings) for clarity.',
      dataSources: composite.dataSources,
      valueBreakdown: {
        revenueLiftUSD,
        costSavingsUSD,
        strategicPremiumUSD
      }
    };
  }

  private static computeATI(params: ReportParameters, composite: CompositeScoreResult): ATIResult {
    let score = clamp(0.5 * composite.components.digitalReadiness + 0.5 * composite.components.infrastructure, 30, 95);
    if (params.skillLevel === 'expert') score += 5;
    if (params.skillLevel === 'novice') score -= 5;

    const transitionRoutes = [
      'Pilot > JV > Majority stake',
      'Sandbox regulatory regime > national license'
    ];
    const changeManagementNeeds = [] as string[];
    if (params.partnerReadinessLevel === 'low') changeManagementNeeds.push('Embed partner enablement office');
    if (composite.components.talent < 55) changeManagementNeeds.push('Upskill workforce via TVET partnerships');

    return {
      score,
      band: determineBand(score),
      drivers: [`Digital readiness ${Math.round(composite.components.digitalReadiness)}/100`, `Infrastructure ${Math.round(composite.components.infrastructure)}/100`],
      pressurePoints: changeManagementNeeds,
      recommendation: 'Sequence transitions with measurable guardrails (runbooks, KPIs).',
      dataSources: composite.dataSources,
      transitionRoutes,
      changeManagementNeeds
    };
  }

  private static computeESI(params: ReportParameters, composite: CompositeScoreResult): ESIResult {
    const headcount = parseHeadcount(params.headcountBand);
    let score = clamp(0.45 * composite.components.infrastructure + 0.35 * composite.components.talent + 0.2 * composite.components.marketAccess, 25, 96);
    if (params.fundingSource === 'Internal Cashflow') score += 4;
    if (headcount < 100) score -= 5;

    const executionGaps: string[] = [];
    if (composite.components.talent < 60) executionGaps.push('Need to supplement talent bench with external partners');
    if (composite.components.supplyChain < 60) executionGaps.push('Logistics reliability below threshold');

    return {
      score,
      band: determineBand(score),
      drivers: [`Infrastructure ${Math.round(composite.components.infrastructure)}/100`, `Talent pool ${Math.round(composite.components.talent)}/100`],
      pressurePoints: executionGaps,
      recommendation: executionGaps.length ? 'Close execution gaps via managed services or shared utilities.' : 'Institutionalize operating playbooks to codify advantages.',
      dataSources: composite.dataSources,
      capacityUtilization: Math.round((headcount / 5000) * 100),
      executionGaps,
      opsPlaybook: ['Codify PMO cadence', 'Embed KPI cockpit', 'Run readiness drills']
    };
  }

  private static computeISI(params: ReportParameters, composite: CompositeScoreResult): ISIResult {
    let score = clamp(0.6 * composite.components.innovation + 0.4 * composite.components.digitalReadiness, 20, 98);
    if (params.priorityThemes?.includes('Innovation')) score += 5;

    const core = Math.round(50 - (score - 60) * 0.3);
    const adjacent = Math.round(30 + (score - 60) * 0.2);
    const transformational = clamp(100 - core - adjacent, 10, 40);

    const ipSignals = [`Innovation score ${Math.round(composite.components.innovation)}/100`];
    if (params.priorityThemes?.includes('IP commercialization')) ipSignals.push('IP commercialization flagged as priority');

    return {
      score,
      band: determineBand(score),
      drivers: ipSignals,
      pressurePoints: composite.components.digitalReadiness < 60 ? ['Digital infrastructure not yet aligned with R&D ambitions'] : [],
      recommendation: 'Balance portfolio between core cashflows and transformational bets to avoid dilution.',
      dataSources: composite.dataSources,
      innovationPortfolioMix: {
        core: clamp(core, 20, 70),
        adjacent: clamp(adjacent, 15, 45),
        transformational
      },
      ipSignals
    };
  }

  private static computeOSI(params: ReportParameters, composite: CompositeScoreResult): OSIResult {
    let score = clamp(0.5 * composite.components.sustainability + 0.5 * composite.components.supplyChain, 20, 95);
    if (params.priorityThemes?.includes('Sustainability')) score += 5;
    if (params.politicalSensitivities?.includes('Environment')) score += 3;

    const pressurePoints = composite.components.costEfficiency < 55 ? ['Cost base may rise during sustainability retrofits'] : [];
    const sustainabilityMetrics = {
      emissionsScore: Math.round(composite.components.sustainability),
      circularityScore: Math.round((composite.components.marketAccess + composite.components.costEfficiency) / 2)
    };

    return {
      score,
      band: determineBand(score),
      drivers: [`Sustainability ${sustainabilityMetrics.emissionsScore}/100`, `Supply chain ${Math.round(composite.components.supplyChain)}/100`],
      pressurePoints,
      recommendation: 'Publish sustainability ledger (emissions + circularity) to unlock green financing.',
      dataSources: composite.dataSources,
      sustainabilityMetrics,
      resilienceDrivers: ['Supplier redundancy', 'Local clean-energy sourcing']
    };
  }

  private static computeRNI(params: ReportParameters, composite: CompositeScoreResult): RNIResult {
    let score = clamp(0.65 * composite.components.regulatory + 0.35 * composite.components.digitalReadiness, 25, 95);
    if (params.skillLevel === 'expert') score += 3;
    if (params.strategicIntent.some(intent => /government/i.test(intent))) score += 3;

    const pressurePoints: string[] = [];
    if (composite.components.regulatory < 55) pressurePoints.push('Regulatory opacity may slow approvals');
    if (!params.procurementMode) pressurePoints.push('Procurement mode not declared');

    const clearancePath = [
      'Validate investment incentives with promotion agency',
      'Secure environmental & labor clearances',
      'Lodge data-residency compliance package'
    ];

    return {
      score,
      band: determineBand(score),
      drivers: [`Regulatory ease ${Math.round(composite.components.regulatory)}/100`],
      pressurePoints,
      recommendation: 'Bundle filings (permits + incentives) to reduce sequential drift.',
      dataSources: composite.dataSources,
      clearancePath,
      policyWatchlist: ['Upcoming digital competition rules', 'Carbon border adjustments'],
      complianceEffort: score >= 70 ? 'light' : score >= 55 ? 'moderate' : 'heavy'
    };
  }

  private static computeSRA(params: ReportParameters, composite: CompositeScoreResult, inflation?: number): SRAResult {
    const stability = composite.components.politicalStability;
    const riskInverse = 100 - composite.components.riskFactors;
    let score = clamp(0.6 * stability + 0.4 * riskInverse, 15, 99);
    if (params.riskTolerance === 'low' || params.riskTolerance === 'very_low') score -= 4;

    const macroSignals = [
      `GDP growth ${composite.inputs.gdpGrowth?.toFixed(1) ?? 'n/a'}%`,
      `Inflation ${(inflation ?? composite.inputs.inflation ?? 0).toFixed(1)}%`
    ];

    const stressEvents: string[] = [];
    if (composite.inputs.tradeBalance < 0) stressEvents.push('Trade deficit pressure');
    if ((inflation ?? composite.inputs.inflation ?? 0) > 8) stressEvents.push('High inflation erosion');

    const band = score >= 75 ? 'secure' : score >= 55 ? 'watch' : 'distressed';

    return {
      score,
      band: determineBand(score),
      drivers: [`Political stability ${Math.round(stability)}/100`, `Risk buffer ${Math.round(riskInverse)}/100`],
      pressurePoints: stressEvents,
      recommendation: 'Structure sovereign protections (FX hedges, political risk insurance) matching the risk band.',
      dataSources: composite.dataSources,
      sovereignRiskBand: band,
      macroSignals,
      stressEvents
    };
  }

  private static computeIDV(params: ReportParameters, composite: CompositeScoreResult, region?: string): IDVResult {
    const sameCountry = (params.userCountry && params.userCountry === params.country);
    const sameRegion = region && params.region && region === params.region;
    let distance = sameCountry ? 20 : sameRegion ? 40 : 60;
    if (params.skillLevel === 'expert') distance -= 5;
    if (params.stakeholderAlignment?.length) distance -= 5;
    distance = clamp(distance, 10, 80);

    const culturalBridges = [] as string[];
    if (params.partnerPersonas?.length) culturalBridges.push('Mapped partner personas to local influencers');
    if (params.stakeholderAlignment?.includes('Government')) culturalBridges.push('Government stakeholder alignment declared');
    if (!culturalBridges.length) culturalBridges.push('Leverage diaspora or chambers to bridge governance gap');

    const alignmentPlaybook = [
      'Deploy bilingual negotiation pods',
      'Create shared compliance dashboard',
      'Run joint scenario workshops'
    ];

    const score = clamp(100 - distance + (params.skillLevel === 'expert' ? 5 : 0), 20, 98);

    return {
      score,
      band: determineBand(score),
      drivers: [`Institutional distance ${distance}`],
      pressurePoints: distance > 55 ? ['High institutional distance – expect governance frictions'] : [],
      recommendation: 'Institutionalize joint steering committee to keep governance gap visible.',
      dataSources: composite.dataSources,
      distanceScore: distance,
      culturalBridges,
      alignmentPlaybook
    };
  }
}

const regionLabel = (params: ReportParameters) => params.region || params.country || 'target market';

export const MissingFormulasEngine = AdvancedIndexService;
export default AdvancedIndexService;
