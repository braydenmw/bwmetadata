/**
 * NSIL INTELLIGENCE HUB - Unified Brain Interface
 * 
 * This is the central orchestrator that brings together all intelligence components:
 * - PersonaEngine (5 personas: Skeptic, Advocate, Regulator, Accountant, Operator)
 * - InputShieldService (adversarial input validation)
 * - CounterfactualEngine (alternative scenarios & Monte Carlo)
 * - OutcomeTracker (learning from past decisions)
 * - UnbiasedAnalysisEngine (pros/cons, alternatives, debate mode)
 * 
 * The Hub provides a single interface for the UI to access all intelligence capabilities.
 */

import { ReportParameters } from '../types';
import { PersonaEngine, FullPersonaAnalysis } from './PersonaEngine';
import { InputShieldService, ShieldReport } from './InputShieldService';
import { CounterfactualEngine, CounterfactualAnalysis } from './CounterfactualEngine';
import { OutcomeTracker, PredictionAccuracy, LearningInsight } from './OutcomeTracker';
import { UnbiasedAnalysisEngine, FullUnbiasedAnalysis } from './UnbiasedAnalysisEngine';

// ============================================================================
// TYPES
// ============================================================================

export interface IntelligenceReport {
  id: string;
  timestamp: Date;
  parameters: Partial<ReportParameters>;
  
  // Pre-flight validation
  inputValidation: ShieldReport;
  
  // Multi-persona analysis (only if inputs pass validation)
  personaAnalysis?: FullPersonaAnalysis;
  
  // Counterfactual analysis
  counterfactual?: CounterfactualAnalysis;
  
  // Unbiased analysis
  unbiasedAnalysis?: FullUnbiasedAnalysis;
  
  // Applicable insights from past decisions
  applicableInsights: LearningInsight[];
  
  // Unified recommendation
  recommendation: {
    action: 'proceed' | 'proceed-with-caution' | 'revise-and-retry' | 'do-not-proceed';
    confidence: number;
    summary: string;
    criticalActions: string[];
    keyRisks: string[];
    keyOpportunities: string[];
  };
  
  // Meta
  processingTime: number;
  componentsRun: string[];
}

export interface QuickAssessment {
  trustScore: number; // 0-100
  status: 'green' | 'yellow' | 'orange' | 'red';
  headline: string;
  topConcerns: string[];
  topOpportunities: string[];
  nextStep: string;
}

// ============================================================================
// NSIL INTELLIGENCE HUB
// ============================================================================

export class NSILIntelligenceHub {
  
  /**
   * Run full intelligence analysis
   * This is the main entry point for comprehensive analysis
   */
  static async runFullAnalysis(params: Partial<ReportParameters>): Promise<IntelligenceReport> {
    const startTime = Date.now();
    const componentsRun: string[] = [];
    const reportId = `INTEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Step 1: Input Validation (always runs first)
    const inputValidation = InputShieldService.validate(params);
    componentsRun.push('InputShield');
    
    // Step 2: Get applicable insights from past decisions
    const applicableInsights = OutcomeTracker.getApplicableInsights(params);
    componentsRun.push('OutcomeTracker');
    
    // Step 3: Run remaining components only if inputs are not rejected
    let personaAnalysis: FullPersonaAnalysis | undefined;
    let counterfactual: CounterfactualAnalysis | undefined;
    let unbiasedAnalysis: FullUnbiasedAnalysis | undefined;
    
    if (inputValidation.overallStatus !== 'rejected') {
      // Run analyses in parallel for speed
      const [personaResult, counterfactualResult, unbiasedResult] = await Promise.all([
        PersonaEngine.runFullAnalysis(params),
        Promise.resolve(CounterfactualEngine.analyze(params)),
        Promise.resolve(UnbiasedAnalysisEngine.analyze(params))
      ]);
      
      personaAnalysis = personaResult;
      counterfactual = counterfactualResult;
      unbiasedAnalysis = unbiasedResult;
      
      componentsRun.push('PersonaEngine', 'CounterfactualEngine', 'UnbiasedAnalysis');
    }
    
    // Step 4: Synthesize unified recommendation
    const recommendation = this.synthesizeRecommendation(
      inputValidation,
      personaAnalysis,
      counterfactual,
      unbiasedAnalysis,
      applicableInsights
    );
    
    const processingTime = Date.now() - startTime;
    
    return {
      id: reportId,
      timestamp: new Date(),
      parameters: params,
      inputValidation,
      personaAnalysis,
      counterfactual,
      unbiasedAnalysis,
      applicableInsights,
      recommendation,
      processingTime,
      componentsRun
    };
  }
  
  /**
   * Quick assessment - faster, less comprehensive
   * Good for real-time UI feedback
   */
  static quickAssess(params: Partial<ReportParameters>): QuickAssessment {
    // Quick input check
    const inputCheck = InputShieldService.quickCheck(params);
    
    // Quick counterfactual
    const counterfactualQuick = CounterfactualEngine.getQuickSummary(params);
    
    // Calculate trust score
    let trustScore = 70; // Base score
    
    if (!inputCheck.safe) {
      trustScore = 20;
    } else {
      trustScore = Math.min(95, Math.max(30, 
        50 + counterfactualQuick.confidence * 0.3 - inputCheck.issues.length * 15
      ));
    }
    
    // Determine status color
    let status: QuickAssessment['status'] = 'yellow';
    if (!inputCheck.safe) {
      status = 'red';
    } else if (trustScore >= 70) {
      status = 'green';
    } else if (trustScore >= 50) {
      status = 'yellow';
    } else {
      status = 'orange';
    }
    
    // Generate headline
    let headline = '';
    if (status === 'red') {
      headline = 'Critical issues must be resolved before analysis';
    } else if (status === 'green') {
      headline = 'Inputs validated - analysis ready to proceed';
    } else if (status === 'yellow') {
      headline = 'Some concerns identified - review recommended';
    } else {
      headline = 'Multiple concerns require attention';
    }
    
    // Next step
    let nextStep = '';
    if (status === 'red') {
      nextStep = `Resolve: ${inputCheck.issues[0] || 'Critical validation issues'}`;
    } else if (counterfactualQuick.keyRisks.length > 0) {
      nextStep = `Address: ${counterfactualQuick.keyRisks[0]}`;
    } else {
      nextStep = 'Run full analysis for detailed recommendations';
    }
    
    return {
      trustScore,
      status,
      headline,
      topConcerns: [
        ...inputCheck.issues.slice(0, 2),
        ...counterfactualQuick.keyRisks.slice(0, 2)
      ].slice(0, 3),
      topOpportunities: counterfactualQuick.shouldProceed 
        ? ['Opportunity appears viable', 'No critical blockers identified']
        : [],
      nextStep
    };
  }
  
  /**
   * Get prediction accuracy and learning metrics
   */
  static getSystemAccuracy(): PredictionAccuracy {
    return OutcomeTracker.getPredictionAccuracy();
  }
  
  /**
   * Track a decision for future learning
   */
  static trackDecision(
    params: Partial<ReportParameters>,
    predictions: {
      compositeScore: number;
      riskScore: number;
      successProbability: number;
      estimatedROI: number;
      estimatedTimeline: string;
      keyRisks: string[];
      keyOpportunities: string[];
    },
    decision: 'proceed' | 'declined' | 'modified' | 'deferred',
    rationale?: string
  ): string {
    return OutcomeTracker.trackDecision(params, predictions, decision, rationale);
  }
  
  /**
   * Record outcome for a tracked decision
   */
  static recordOutcome(
    decisionId: string,
    outcome: {
      success: boolean;
      actualROI?: number;
      actualTimeline?: string;
      keyLessons: string[];
      unexpectedFactors: string[];
      outcomeScore: number;
    }
  ): void {
    OutcomeTracker.recordOutcome(decisionId, {
      recordedAt: new Date(),
      ...outcome
    });
  }
  
  /**
   * Get all learning insights
   */
  static getInsights(): LearningInsight[] {
    return OutcomeTracker.getInsights();
  }
  
  /**
   * Synthesize unified recommendation from all components
   */
  private static synthesizeRecommendation(
    inputValidation: ShieldReport,
    personaAnalysis?: FullPersonaAnalysis,
    counterfactual?: CounterfactualAnalysis,
    unbiasedAnalysis?: FullUnbiasedAnalysis,
    applicableInsights?: LearningInsight[]
  ): IntelligenceReport['recommendation'] {
    
    // If inputs were rejected, return early
    if (inputValidation.overallStatus === 'rejected') {
      return {
        action: 'do-not-proceed',
        confidence: 95,
        summary: 'Critical validation issues prevent analysis. Resolve the following before proceeding.',
        criticalActions: inputValidation.recommendations,
        keyRisks: inputValidation.validationResults
          .filter(r => r.flag === 'critical')
          .map(r => r.message),
        keyOpportunities: []
      };
    }
    
    // Collect signals from all components
    const signals = {
      inputTrust: inputValidation.overallTrust,
      personaRecommendation: personaAnalysis?.synthesis.overallRecommendation,
      personaConfidence: personaAnalysis?.synthesis.confidenceLevel || 0,
      counterfactualRobustness: counterfactual?.robustness.score || 0,
      monteCarloLossProb: counterfactual?.monteCarlo.probabilityOfLoss || 50,
      unbiasedBalance: unbiasedAnalysis?.balanceScore || 50
    };
    
    // Calculate weighted action decision
    let actionScore = 0;
    let confidenceFactors: number[] = [];
    
    // Input validation weight
    actionScore += (signals.inputTrust - 50) * 0.2;
    confidenceFactors.push(signals.inputTrust);
    
    // Persona recommendation weight
    if (signals.personaRecommendation === 'proceed') actionScore += 25;
    else if (signals.personaRecommendation === 'proceed-with-caution') actionScore += 10;
    else if (signals.personaRecommendation === 'significant-concerns') actionScore -= 15;
    else if (signals.personaRecommendation === 'do-not-proceed') actionScore -= 30;
    confidenceFactors.push(signals.personaConfidence);
    
    // Counterfactual weight
    actionScore += (signals.counterfactualRobustness - 50) * 0.3;
    actionScore -= (signals.monteCarloLossProb - 30) * 0.2;
    confidenceFactors.push(signals.counterfactualRobustness);
    
    // Determine action
    let action: IntelligenceReport['recommendation']['action'];
    if (actionScore >= 20) action = 'proceed';
    else if (actionScore >= 0) action = 'proceed-with-caution';
    else if (actionScore >= -20) action = 'revise-and-retry';
    else action = 'do-not-proceed';
    
    // Calculate confidence
    const confidence = Math.round(
      confidenceFactors.reduce((a, b) => a + b, 0) / confidenceFactors.length
    );
    
    // Collect critical actions
    const criticalActions: string[] = [
      ...(personaAnalysis?.synthesis.criticalActions || []),
      ...(counterfactual?.robustness.vulnerabilities.map(v => `Address: ${v}`) || [])
    ].slice(0, 5);
    
    // Collect key risks
    const keyRisks: string[] = [
      ...(personaAnalysis?.skeptic.dealKillers.map(d => d.title) || []),
      ...(personaAnalysis?.skeptic.hiddenRisks.map(r => r.title) || [])
    ].slice(0, 5);
    
    // Collect key opportunities
    const keyOpportunities: string[] = [
      ...(personaAnalysis?.advocate.upsidePotential.map(u => u.title) || []),
      ...(personaAnalysis?.advocate.synergies.map(s => s.title) || [])
    ].slice(0, 5);
    
    // Generate summary
    let summary = '';
    if (action === 'proceed') {
      summary = `Analysis indicates a viable opportunity with ${confidence}% confidence. ${
        personaAnalysis?.synthesis.summary || 'Multiple perspectives support proceeding.'
      }`;
    } else if (action === 'proceed-with-caution') {
      summary = `Opportunity shows promise but has notable concerns. ${
        keyRisks.length > 0 ? `Key risk: ${keyRisks[0]}. ` : ''
      }Consider the critical actions before full commitment.`;
    } else if (action === 'revise-and-retry') {
      summary = `Current plan has significant issues that should be addressed. ${
        keyRisks.length > 0 ? `Primary concern: ${keyRisks[0]}. ` : ''
      }Revise approach and re-analyze.`;
    } else {
      summary = `Analysis does not support proceeding at this time. ${
        criticalActions.length > 0 ? criticalActions[0] : 'Multiple critical issues identified.'
      }`;
    }
    
    // Add insight if applicable
    if (applicableInsights && applicableInsights.length > 0) {
      const topInsight = applicableInsights[0];
      summary += ` Historical insight: ${topInsight.insight}`;
    }
    
    return {
      action,
      confidence,
      summary,
      criticalActions,
      keyRisks,
      keyOpportunities
    };
  }
  
  /**
   * Get component health status
   */
  static getComponentStatus(): Array<{
    component: string;
    status: 'operational' | 'degraded' | 'offline';
    lastCheck: Date;
  }> {
    return [
      { component: 'PersonaEngine', status: 'operational', lastCheck: new Date() },
      { component: 'InputShieldService', status: 'operational', lastCheck: new Date() },
      { component: 'CounterfactualEngine', status: 'operational', lastCheck: new Date() },
      { component: 'OutcomeTracker', status: 'operational', lastCheck: new Date() },
      { component: 'UnbiasedAnalysisEngine', status: 'operational', lastCheck: new Date() }
    ];
  }
}

export default NSILIntelligenceHub;

