import type { ActionTask, ExecutionRecord, GovernanceDecision, OutcomeRecord } from '../../types/autonomy';
import type { MissionCaseInput } from './MissionGraphService';

export interface ExecutionBatchResult {
  tasks: ActionTask[];
  executionRecords: ExecutionRecord[];
  outcomes: OutcomeRecord[];
}

const shouldExecute = (task: ActionTask, decision?: GovernanceDecision): boolean => {
  if (!decision) return false;
  if (decision.decision !== 'approved') return false;
  return task.status === 'ready';
};

export class ActionExecutionEngine {
  static executeApprovedTasks(
    tasks: ActionTask[],
    decisions: GovernanceDecision[],
    input: MissionCaseInput
  ): ExecutionBatchResult {
    const decisionMap = new Map(decisions.map((decision) => [decision.taskId, decision]));
    const executionRecords: ExecutionRecord[] = [];
    const outcomes: OutcomeRecord[] = [];

    const updatedTasks = tasks.map((task) => {
      const decision = decisionMap.get(task.taskId);
      if (!shouldExecute(task, decision)) return task;

      const startedAt = new Date().toISOString();
      const succeeded = (task.simulation?.baseCase ?? 0) >= 60;
      const finishedAt = new Date().toISOString();

      const executionRecord: ExecutionRecord = {
        runId: `run-${task.taskId}`,
        taskId: task.taskId,
        startedAt,
        finishedAt,
        status: succeeded ? 'completed' : 'failed',
        outputs: {
          taskType: task.type,
          missionReadiness: input.readinessScore,
          criticalGapCount: input.criticalGapCount
        },
        errors: succeeded ? [] : ['Execution confidence did not meet minimum threshold'],
        retries: succeeded ? 0 : 1
      };
      executionRecords.push(executionRecord);

      const expectedReadinessDelta = task.type === 'case-gap-resolution' ? 8 : 5;
      const observedReadinessDelta = succeeded ? Math.max(3, expectedReadinessDelta - Math.max(0, input.criticalGapCount - 1)) : 0;

      outcomes.push({
        taskId: task.taskId,
        expectedKPIChange: { readiness: expectedReadinessDelta },
        observedKPIChange: { readiness: observedReadinessDelta },
        variance: expectedReadinessDelta - observedReadinessDelta,
        verdict: succeeded ? 'met' : 'missed',
        rootCauseTags: succeeded ? ['governance-pass', 'execution-success'] : ['execution-confidence-drop'],
        lesson: succeeded
          ? 'Approved tasks with strong base-case confidence execute reliably'
          : 'Tasks with marginal confidence need higher evidence before autonomous execution'
      });

      const nextStatus: ActionTask['status'] = succeeded ? 'completed' : 'failed';

      return {
        ...task,
        status: nextStatus
      };
    });

    return {
      tasks: updatedTasks,
      executionRecords,
      outcomes
    };
  }
}

export default ActionExecutionEngine;
