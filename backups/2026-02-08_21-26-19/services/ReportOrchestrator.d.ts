import { ReportParameters, ReportPayload } from '../types';
export declare class ReportOrchestrator {
    static assembleReportPayload(params: ReportParameters): Promise<ReportPayload>;
    private static buildRegionProfile;
    private static buildRegionalProfile;
    private static buildEconomicSignals;
    private static buildOpportunityMatches;
    private static buildRisks;
    private static buildRecommendations;
    private static buildConfidenceScores;
    private static runDiversificationAnalysis;
    static validatePayload(payload: ReportPayload): {
        isComplete: boolean;
        missingFields: string[];
    };
    static logPayload(payload: ReportPayload): void;
    private static toRefinedIntake;
}
