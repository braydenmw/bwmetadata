import { ProactiveAction, ThinkingChain } from './ReactiveIntelligenceEngine';
import { ReportParameters } from '../types';
/**
 * AutonomousOrchestrator: End-to-end autonomous problem-solving loop
 * - Accepts a problem/task
 * - Analyzes and proposes solutions
 * - Executes actions (if permitted)
 * - Logs outcomes and triggers learning
 * - Provides full reasoning and audit trail
 */
type AuditEntry = Record<string, unknown>;
export declare class AutonomousOrchestrator {
    /**
     * Solve a problem end-to-end, optionally auto-executing actions
     */
    static solveAndAct(problem: string, context: unknown, params: ReportParameters, options: {
        autoAct: boolean;
        urgency: 'immediate' | 'normal' | 'low';
    }): Promise<{
        solutions: ProactiveAction[];
        actionsTaken: ProactiveAction[];
        reasoning: ThinkingChain[];
        auditTrail: AuditEntry[];
        confidence: number;
        explainabilityReportPath?: string;
    }>;
}
export {};
