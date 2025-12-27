import {
  ReportParameters,
  AdversarialShieldResult,
  AdversarialInputCheck,
  PersonaPanelResult,
  PersonaInsight,
  PersonaRole,
  MotivationAnalysis,
  CounterfactualLabResult,
  CounterfactualScenario,
  OutcomeLearningSnapshot,
  OutcomeAlignment
} from '../types';
import { InputShieldService, ShieldReport, ValidationResult } from './InputShieldService';
import { PersonaEngine, FullPersonaAnalysis, PersonaFinding } from './PersonaEngine';
import { CounterfactualEngine, CounterfactualAnalysis, Scenario } from './CounterfactualEngine';
import OutcomeTracker from './OutcomeTracker';
import MotivationDetector from './MotivationDetector';

export interface AdversarialOutputs {
  adversarialShield: AdversarialShieldResult;
  personaPanel: PersonaPanelResult;
  motivation: MotivationAnalysis;
  counterfactuals: CounterfactualLabResult;
  outcomeLearning: OutcomeLearningSnapshot;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

class AdversarialReasoningService {
  static async generate(params: ReportParameters): Promise<AdversarialOutputs> {
    const personaAnalysis = await PersonaEngine.runFullAnalysis(params);
    const shieldReport = InputShieldService.validate(params);
    const motivation = MotivationDetector.analyze(params);
    const counterfactualAnalysis = CounterfactualEngine.analyze(params);
    const outcomeLearning = this.buildOutcomeSnapshot(params);

    return {
      adversarialShield: this.mapShield(shieldReport),
      personaPanel: this.mapPersonaPanel(personaAnalysis),
      motivation,
      counterfactuals: this.mapCounterfactuals(counterfactualAnalysis),
      outcomeLearning
    };
  }

  private static mapShield(report: ShieldReport): AdversarialShieldResult {
    const checks: AdversarialInputCheck[] = report.validationResults.map((result: ValidationResult) => ({
      field: result.field,
      userClaim: String(result.userValue ?? 'n/a'),
      externalEvidence: result.authoritySource ? [result.authoritySource] : [],
      contradictionLevel: this.computeContradictionLevel(result.flag),
      challengePrompt: result.message,
      severity: result.flag === 'critical' ? 'critical' : result.flag === 'warning' || result.flag === 'concern' ? 'warning' : 'info'
    }));

    const escalations = report.patternMatches
      .filter(match => match.severity === 'critical')
      .map(match => `${match.pattern}: ${match.description}`);

    const contradictionIndex = clamp(100 - report.overallTrust, 0, 100);

    return {
      contradictionIndex,
      checks,
      escalations,
      reviewedAt: report.timestamp.toISOString()
    };
  }

  private static mapPersonaPanel(analysis: FullPersonaAnalysis): PersonaPanelResult {
    const consensus = this.mapConsensus(analysis.synthesis.overallRecommendation);
    const agreementLevel = clamp(100 - analysis.synthesis.disagreements.length * 12, 20, 95);

    const insights: PersonaInsight[] = [
      this.buildPersonaInsight('Skeptic', 'oppose', [...analysis.skeptic.dealKillers, ...analysis.skeptic.hiddenRisks]),
      this.buildPersonaInsight('Advocate', 'support', [...analysis.advocate.upsidePotential, ...analysis.advocate.valueLevers]),
      this.buildPersonaInsight('Regulator', 'neutral', [...analysis.regulator.legalIssues, ...analysis.regulator.sanctionsRisks]),
      this.buildPersonaInsight('Accountant', 'neutral', [...analysis.accountant.cashflowConcerns, ...analysis.accountant.marginAnalysis]),
      this.buildPersonaInsight('Operator', 'neutral', [...analysis.operator.executionRisks, ...analysis.operator.teamGaps])
    ].filter((insight): insight is PersonaInsight => Boolean(insight));

    const blindSpots = analysis.synthesis.disagreements.map(disagreement => disagreement.topic);

    return {
      consensus,
      agreementLevel,
      insights,
      blindSpots
    };
  }

  private static buildPersonaInsight(persona: PersonaRole, stance: PersonaInsight['stance'], findings: PersonaFinding[]): PersonaInsight | null {
    if (!findings.length) return null;
    const headline = findings[0];
    const riskCallouts = findings
      .filter(finding => finding.severity === 'critical' || finding.severity === 'warning')
      .map(finding => finding.title);

    return {
      persona,
      stance,
      summary: headline.description,
      evidence: headline.evidence.slice(0, 2),
      riskCallouts
    };
  }

  private static mapCounterfactuals(analysis: CounterfactualAnalysis): CounterfactualLabResult {
    const baseline = analysis.baseCase;
    const scenarios: CounterfactualScenario[] = analysis.alternativeScenarios.map(scenario => this.buildCounterfactualScenario(baseline, scenario));
    const highest = scenarios.reduce((prev, curr) => {
      const prevScore = (prev?.opportunityCostUSD || 0) * (prev?.regretProbability || 0);
      const currScore = (curr.opportunityCostUSD || 0) * (curr.regretProbability || 0);
      return currScore > prevScore ? curr : prev;
    }, scenarios[0]);

    return {
      scenarios,
      highestRegretScenario: highest?.scenario
    };
  }

  private static buildCounterfactualScenario(baseline: Scenario, alt: Scenario): CounterfactualScenario {
    const baselineExpected = baseline.outcomes.financial.expected;
    const altExpected = alt.outcomes.financial.expected;
    const opportunityCostUSD = (baselineExpected ?? 0) - (altExpected ?? 0);
    const activationMonthsDelta = this.estimateMonths(alt.outcomes.timeline.expected) - this.estimateMonths(baseline.outcomes.timeline.expected);
    const rroiDelta = ((altExpected ?? 0) - (baselineExpected ?? 0)) / Math.max(1, Math.abs(baselineExpected || 1)) * 100;
    const spiDelta = alt.probability - baseline.probability;

    return {
      scenario: alt.name,
      baseline: baseline.description,
      opposite: alt.description,
      impactDelta: {
        spiDelta,
        rroiDelta,
        scfDeltaUSD: Math.round((altExpected ?? 0) - (baselineExpected ?? 0)),
        activationMonthsDelta
      },
      opportunityCostUSD,
      regretProbability: clamp(alt.probability + (opportunityCostUSD > 0 ? 15 : 0), 5, 95),
      recommendation: alt.keyDifferences[0] || alt.description
    };
  }

  private static buildOutcomeSnapshot(params: ReportParameters): OutcomeLearningSnapshot {
    const accuracy = OutcomeTracker.getPredictionAccuracy();
    const insights = OutcomeTracker.getApplicableInsights(params).slice(0, 3);

    const predictions: OutcomeAlignment[] = [
      {
        metric: 'Success prediction accuracy',
        predicted: clamp(accuracy.accuracyMetrics.successPredictionAccuracy, 0, 100),
        status: 'tracking'
      },
      {
        metric: 'Risk calibration',
        predicted: clamp(accuracy.accuracyMetrics.riskPredictionAccuracy, 0, 100),
        status: accuracy.calibration.overconfidentCases > accuracy.calibration.underconfidentCases ? 'pending' : 'tracking'
      },
      {
        metric: 'ROI precision',
        predicted: clamp(accuracy.accuracyMetrics.roiPredictionAccuracy, 0, 100),
        status: accuracy.accuracyMetrics.roiPredictionAccuracy >= 60 ? 'tracking' : 'pending'
      }
    ];

    const learningActions = insights.length
      ? insights.map(insight => `${insight.category}: ${insight.insight}`)
      : ['Capture more outcome data to improve calibration.', 'Close loop on in-progress decisions.'];

    return {
      reportId: params.id,
      predictions,
      learningActions,
      lastUpdated: new Date().toISOString()
    };
  }

  private static computeContradictionLevel(flag: ValidationResult['flag']): number {
    switch (flag) {
      case 'critical':
        return 95;
      case 'concern':
        return 70;
      case 'warning':
        return 45;
      default:
        return 15;
    }
  }

  private static mapConsensus(recommendation: FullPersonaAnalysis['synthesis']['overallRecommendation']): PersonaPanelResult['consensus'] {
    switch (recommendation) {
      case 'proceed':
        return 'go';
      case 'proceed-with-caution':
        return 'hold';
      default:
        return 'block';
    }
  }

  private static estimateMonths(timeline?: string): number {
    if (!timeline) return 12;
    const numeric = parseFloat(timeline.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(numeric)) return 12;
    if (/year/i.test(timeline)) return numeric * 12;
    return numeric;
  }
}

export default AdversarialReasoningService;
