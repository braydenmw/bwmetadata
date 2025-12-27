import { ReportParameters, ReportPayload, SPIResult, RROI_Index, SEAM_Blueprint, SymbioticPartner, DiversificationAnalysis, EthicalCheckResult, RefinedIntake, RegionProfile, MarketShare } from '../types';
import { calculateSPI, generateRROI, generateSEAM, generateSymbioticMatches, runEthicalSafeguards } from './engine';
import { MarketDiversificationEngine } from './engine';
import { runOpportunityOrchestration } from './engine';
import { GLOBAL_CITY_DATABASE } from '../constants';
import { mapToSPI, mapToIVAS, mapToSCF } from './intakeMapping';
import DerivedIndexService from './DerivedIndexService';
import AdvancedIndexService from './MissingFormulasEngine';
import AdversarialReasoningService from './AdversarialReasoningService';

const clampValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export class ReportOrchestrator {
  static async assembleReportPayload(params: ReportParameters): Promise<ReportPayload> {
    console.log('DEBUG: Starting ReportOrchestrator assembly for', params.organizationName);

    const refinedIntake = this.toRefinedIntake(params);
    const spiInput = mapToSPI(refinedIntake);
    const ivasInput = mapToIVAS(refinedIntake);
    const scfInput = mapToSCF(refinedIntake);

    // Run all intelligence engines in parallel
    const [
      spiResult,
      rroiResult,
      seamResult,
      symbioticPartners,
      diversificationAnalysis,
      ethicsCheck,
      orchestrationResult,
      priResult,
      tcoResult,
      criResult,
      advancedIndices,
      adversarialStack
    ] = await Promise.all([
      calculateSPI(params),
      generateRROI(params),
      generateSEAM(params),
      generateSymbioticMatches(params),
      this.runDiversificationAnalysis(params),
      runEthicalSafeguards(params),
      runOpportunityOrchestration(this.buildRegionProfile(params)),
      DerivedIndexService.calculatePRI(params),
      DerivedIndexService.calculateTCO(params),
      DerivedIndexService.calculateCRI(params),
      AdvancedIndexService.computeIndices(params),
      AdversarialReasoningService.generate(params)
    ]);

    console.log('DEBUG: All engines completed');

    // Build the structured payload
    const payload: ReportPayload = {
      metadata: {
        requesterType: params.organizationType,
        country: params.country,
        region: params.region,
        timestamp: new Date().toISOString(),
        reportId: params.id,
        dataSources: [
          'World Bank Open Data API',
          'Open Exchange Rates API',
          'REST Countries API',
          'Monte Carlo Simulation (200 trials)',
          'Composite Score Engine v2'
        ]
      },
      problemDefinition: {
        statedProblem: params.problemStatement,
        constraints: params.calibration?.constraints ?
          Object.values(params.calibration.constraints).filter(c => typeof c === 'string') as string[] :
          [],
        urgency: params.expansionTimeline
      },
      regionalProfile: this.buildRegionalProfile(params),
      economicSignals: this.buildEconomicSignals(params, rroiResult),
      opportunityMatches: this.buildOpportunityMatches(symbioticPartners, spiResult),
      risks: this.buildRisks(params, ethicsCheck),
      recommendations: this.buildRecommendations(seamResult, diversificationAnalysis),
      confidenceScores: this.buildConfidenceScores(spiResult),
      computedIntelligence: {
        spi: spiResult,
        rroi: rroiResult,
        seam: seamResult,
        symbioticPartners,
        diversificationAnalysis,
        ethicsCheck,
        ivas: orchestrationResult.details.ivas,
        scf: orchestrationResult.details.scf,
        intakeMapping: {
          refinedIntake,
          spiInput,
          ivasInput,
          scfInput
        },
        pri: priResult,
        tco: tcoResult,
        cri: criResult,
        advancedIndices,
        adversarialShield: adversarialStack.adversarialShield,
        personaPanel: adversarialStack.personaPanel,
        motivationAnalysis: adversarialStack.motivation,
        counterfactuals: adversarialStack.counterfactuals,
        outcomeLearning: adversarialStack.outcomeLearning
      }
    };

    console.log('DEBUG: ReportPayload assembled successfully');
    return payload;
  }

  private static buildRegionProfile(params: ReportParameters): RegionProfile {
    const cityData = GLOBAL_CITY_DATABASE[params.country];
    const population = cityData?.population ?? 10_000_000;
    const gdpBillion = cityData?.gdp.totalBillionUSD ?? 100;
    const regulatoryComplexity = cityData
      ? clampValue(100 - (cityData.businessEnvironment.regulatoryQuality ?? 60), 5, 90)
      : undefined;
    const permitBacklogMonths = cityData
      ? clampValue(
          18 - (cityData.businessEnvironment.easeOfDoingBusiness ?? 60) / 10 +
            (cityData.businessEnvironment.corruptionIndex ?? 50) / 20,
          4,
          36
        )
      : undefined;

    return {
      id: `${params.country || 'unknown'}-${params.region || 'region'}`,
      name: params.country || 'Target Region',
      country: params.country,
      population,
      gdp: gdpBillion * 1_000_000_000,
      rawFeatures: cityData ? [
        { name: 'Infrastructure', rarityScore: cityData.infrastructure.transportation, relevanceScore: 80, marketProxy: cityData.infrastructure.digital },
        { name: 'Talent Pool', rarityScore: cityData.talentPool.skillsAvailability, relevanceScore: 85, marketProxy: cityData.talentPool.educationLevel }
      ] : [],
      sectorHint: params.industry?.[0],
      regulatoryComplexity,
      permitBacklogMonths,
      infrastructureSignal: cityData?.infrastructure.transportation,
      talentSignal: cityData?.talentPool.skillsAvailability
    };
  }

  private static buildRegionalProfile(params: ReportParameters): ReportPayload['regionalProfile'] {
    const cityData = GLOBAL_CITY_DATABASE[params.country];
    return {
      demographics: {
        population: cityData?.population || 10000000,
        gdpPerCapita: cityData?.gdp.perCapitaUSD || 50000,
        laborCosts: cityData?.talentPool.laborCosts || 50
      },
      infrastructure: {
        transportation: cityData?.infrastructure.transportation || 70,
        digital: cityData?.infrastructure.digital || 70,
        utilities: cityData?.infrastructure.utilities || 70
      },
      logistics: {
        regionalConnectivity: cityData?.marketAccess.regionalConnectivity || 70,
        exportPotential: cityData?.marketAccess.exportPotential || 70
      }
    };
  }

  private static buildEconomicSignals(params: ReportParameters, rroi: RROI_Index): ReportPayload['economicSignals'] {
    return {
      tradeExposure: rroi.components.market.score,
      tariffSensitivity: 100 - rroi.components.regulatory.score,
      costAdvantages: [
        `Labor costs ${params.region === 'Asia-Pacific' ? 'below' : 'above'} global average`,
        `Infrastructure readiness: ${rroi.components.infrastructure.score}/100`,
        `Talent availability: ${rroi.components.talent.score}/100`
      ],
      bottleneckReliefPotential: rroi.overallScore
    };
  }

  private static buildOpportunityMatches(symbioticPartners: SymbioticPartner[], spi: SPIResult): ReportPayload['opportunityMatches'] {
    return {
      sectors: symbioticPartners.map(p => p.entityType),
      partnerTypes: symbioticPartners.map(p => p.location),
      riskAdjustedROI: spi.spi
    };
  }

  private static buildRisks(params: ReportParameters, ethicsCheck: EthicalCheckResult): ReportPayload['risks'] {
    const cityData = GLOBAL_CITY_DATABASE[params.country];
    return {
      political: {
        stabilityScore: cityData?.businessEnvironment.regulatoryQuality || 70,
        regionalConflictRisk: params.region === 'Middle East' ? 80 : 30
      },
      regulatory: {
        corruptionIndex: cityData?.businessEnvironment.corruptionIndex || 50,
        regulatoryFriction: 100 - (cityData?.businessEnvironment.easeOfDoingBusiness || 70),
        complianceRoadmap: ethicsCheck.mitigation.map(m => m.detail)
      },
      operational: {
        supplyChainDependency: 45, // Mock value
        currencyRisk: params.region === 'Emerging Markets' ? 'High volatility expected' : 'Moderate stability'
      }
    };
  }

  private static buildRecommendations(seam: SEAM_Blueprint, diversification: DiversificationAnalysis): ReportPayload['recommendations'] {
    return {
      shortTerm: seam.gaps.slice(0, 2),
      midTerm: diversification.recommendedMarkets.slice(0, 2).map(m => m.recommendedStrategy),
      longTerm: seam.partners.map(p => `Partner with ${p.name} for ${p.role}`)
    };
  }

  private static buildConfidenceScores(spi: SPIResult): ReportPayload['confidenceScores'] {
    return {
      overall: spi.spi,
      economicReadiness: spi.breakdown.find(b => b.label === 'Economic Readiness')?.value || 70,
      symbioticFit: spi.breakdown.find(b => b.label === 'Symbiotic Fit')?.value || 70,
      politicalStability: spi.breakdown.find(b => b.label === 'Political Stability')?.value || 70,
      partnerReliability: spi.breakdown.find(b => b.label === 'Partner Reliability')?.value || 70,
      ethicalAlignment: spi.breakdown.find(b => b.label === 'Ethical Alignment')?.value || 70,
      activationVelocity: spi.breakdown.find(b => b.label === 'Activation Velocity')?.value || 70,
      transparency: spi.breakdown.find(b => b.label === 'Transparency')?.value || 70
    };
  }

  private static async runDiversificationAnalysis(params: ReportParameters): Promise<DiversificationAnalysis> {
    // Mock market shares for demonstration
    const mockMarkets: MarketShare[] = [
      { country: params.country, share: 60 },
      { country: 'Vietnam', share: 20 },
      { country: 'India', share: 15 },
      { country: 'Other', share: 5 }
    ];

    return MarketDiversificationEngine.analyzeConcentration(mockMarkets);
  }

  // Method to validate payload completeness
  static validatePayload(payload: ReportPayload): { isComplete: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    // Check metadata
    if (!payload.metadata.requesterType) missingFields.push('metadata.requesterType');
    if (!payload.metadata.country) missingFields.push('metadata.country');

    // Check problem definition
    if (!payload.problemDefinition.statedProblem) missingFields.push('problemDefinition.statedProblem');

    // Check regional profile
    if (!payload.regionalProfile.demographics) missingFields.push('regionalProfile.demographics');

    // Check confidence scores
    if (payload.confidenceScores.overall === undefined) missingFields.push('confidenceScores.overall');

    return {
      isComplete: missingFields.length === 0,
      missingFields
    };
  }

  // Method to log payload for debugging
  static logPayload(payload: ReportPayload): void {
    console.log('=== REPORT PAYLOAD EXTRACTION LOG ===');
    console.log('Metadata:', payload.metadata);
    console.log('Problem Definition:', payload.problemDefinition);
    console.log('Regional Profile:', payload.regionalProfile);
    console.log('Economic Signals:', payload.economicSignals);
    console.log('Opportunity Matches:', payload.opportunityMatches);
    console.log('Risks:', payload.risks);
    console.log('Recommendations:', payload.recommendations);
    console.log('Confidence Scores:', payload.confidenceScores);
    console.log('Computed Intelligence Keys:', Object.keys(payload.computedIntelligence));
    console.log('=====================================');
  }

  private static toRefinedIntake(params: ReportParameters): RefinedIntake {
    const yearsOperating = params.yearsOperation ? Number(params.yearsOperation) : undefined;
    return {
      identity: {
        entityName: params.organizationName || 'Unnamed Entity',
        registrationCountry: params.country,
        registrationCity: params.userCity,
        industryClassification: params.industry?.[0],
        legalStructure: params.organizationType,
        yearsOperating: Number.isFinite(yearsOperating) ? yearsOperating : undefined,
      },
      mission: {
        strategicIntent: params.strategicIntent || [],
        objectives: params.strategicObjectives || [],
        timelineHorizon: params.expansionTimeline as RefinedIntake['mission']['timelineHorizon'],
      },
      counterparties: (params.partnerPersonas || []).map(name => ({ name, relationshipStage: 'intro' })),
      constraints: {
        budgetUSD: params.dealSize ? Number(params.dealSize) : undefined,
        riskTolerance: params.riskTolerance as 'low' | 'medium' | 'high' | undefined,
      },
      proof: { documents: [] },
      contacts: {},
    };
  }
}