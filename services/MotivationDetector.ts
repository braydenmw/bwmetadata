import { ReportParameters, MotivationAnalysis, MotivationRedFlag } from '../types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

class MotivationDetector {
  static analyze(params: ReportParameters): MotivationAnalysis {
    const statedMotivation = params.missionRequestSummary || params.problemStatement || 'Not explicitly stated';
    const impliedMotivation = this.deriveImpliedMotivation(params);
    const redFlags = this.buildRedFlags(params);

    let alignmentScore = 72;
    if (params.stakeholderAlignment?.length) alignmentScore += 6;
    if (params.partnerReadinessLevel === 'high') alignmentScore += 4;
    if (params.expansionTimeline?.includes('3')) alignmentScore -= 8;
    alignmentScore -= redFlags.reduce((sum, flag) => sum + Math.round(flag.probability * 10), 0);
    const normalizedScore = clamp(alignmentScore, 5, 95);

    const narrativeParts: string[] = [];
    narrativeParts.push(`Declared motive centers on ${impliedMotivation.toLowerCase()}.`);
    if (redFlags.length) {
      narrativeParts.push(`${redFlags.length} conflicting signals detected across capital, governance, or timing.`);
    } else {
      narrativeParts.push('No material motivation contradictions detected.');
    }
    if (params.priorityThemes?.length) {
      narrativeParts.push(`Priority themes (${params.priorityThemes.join(', ')}) reinforce the stated posture.`);
    }

    return {
      statedMotivation,
      impliedMotivation,
      alignmentScore: normalizedScore,
      redFlags,
      narrative: narrativeParts.join(' ')
    };
  }

  private static deriveImpliedMotivation(params: ReportParameters): string {
    if (params.strategicIntent?.some(intent => /turnaround|stabilize|rescue/i.test(intent))) {
      return 'crisis stabilization and damage control';
    }
    if (params.priorityThemes?.some(theme => /capital|liquidity|financing/i.test(theme))) {
      return 'capital relief and liquidity access';
    }
    if (params.strategicIntent?.some(intent => /expansion|scale|market entry/i.test(intent))) {
      return 'aggressive market expansion';
    }
    if (params.priorityThemes?.some(theme => /governance|compliance|risk/i.test(theme))) {
      return 'risk hedging and governance hardening';
    }
    return 'balanced growth and partnership building';
  }

  private static buildRedFlags(params: ReportParameters): MotivationRedFlag[] {
    const redFlags: MotivationRedFlag[] = [];

    if ((params.expansionTimeline?.includes('3') || params.expansionTimeline?.includes('0_6')) && params.dealSize && params.riskTolerance === 'low') {
      redFlags.push({
        flag: 'Urgency/aversion mismatch',
        evidence: `Compressed timeline (${params.expansionTimeline}) declared with low risk tolerance.`,
        probability: 0.65
      });
    }

    if (params.dealSize && !params.calibration?.constraints?.budgetCap) {
      redFlags.push({
        flag: 'Opaque capital plan',
        evidence: `Deal size ${params.dealSize} specified without any budget ceiling in calibration block.`,
        probability: 0.55
      });
    }

    if (!params.stakeholderAlignment?.length && params.partnerPersonas?.length) {
      redFlags.push({
        flag: 'Unaligned stakeholders',
        evidence: 'Partner personas documented but no internal stakeholder alignment declared.',
        probability: 0.45
      });
    }

    if (params.politicalSensitivities?.includes('Corruption') || params.politicalSensitivities?.includes('Sanctions')) {
      redFlags.push({
        flag: 'Governance pressure',
        evidence: 'User highlighted corruption or sanctions sensitivities, indicating legacy issues.',
        probability: 0.5
      });
    }

    if (params.partnerReadinessLevel === 'low' && params.strategicIntent?.some(intent => /acquisition|joint venture|partnership/i.test(intent || ''))) {
      redFlags.push({
        flag: 'Readiness gap',
        evidence: 'Low partner readiness despite partnership-centric mandate.',
        probability: 0.4
      });
    }

    return redFlags;
  }
}

export default MotivationDetector;
