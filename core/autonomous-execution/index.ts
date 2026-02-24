// Autonomous Execution Module
// Typed autonomous action execution with policy checks and in-memory audit trail.

export type ActionContext = {
  actor: string;
  correlationId?: string;
  approved?: boolean;
};

export type ActionRequest<TPayload = Record<string, unknown>> = {
  type: string;
  payload: TPayload;
  context: ActionContext;
};

export type ActionResult<TData = Record<string, unknown>> = {
  status: 'completed' | 'rejected' | 'failed';
  action: string;
  timestamp: string;
  data?: TData;
  error?: string;
};

type ActionHandler = (request: ActionRequest) => Promise<Record<string, unknown>>;

const actionRegistry = new Map<string, ActionHandler>();
const actionAuditLog: ActionResult[] = [];

function ensureApproved(request: ActionRequest): void {
  if (!request.context.actor?.trim()) {
    throw new Error('Action rejected: actor is required');
  }
  if (!request.context.approved) {
    throw new Error('Action rejected: approval flag is required for autonomous execution');
  }
}

export function registerAction(type: string, handler: ActionHandler): void {
  actionRegistry.set(type, handler);
}

export async function executeAction<TPayload = Record<string, unknown>>(
  action: string,
  params: TPayload,
  context: ActionContext = { actor: 'system', approved: false }
): Promise<ActionResult> {
  const timestamp = new Date().toISOString();

  try {
    const request: ActionRequest<TPayload> = { type: action, payload: params, context };
    ensureApproved(request);

    const handler = actionRegistry.get(action);
    if (!handler) {
      const rejected: ActionResult = {
        status: 'rejected',
        action,
        timestamp,
        error: `No registered handler for action type: ${action}`
      };
      actionAuditLog.push(rejected);
      return rejected;
    }

    const data = await handler(request as ActionRequest);
    const completed: ActionResult = {
      status: 'completed',
      action,
      timestamp,
      data
    };
    actionAuditLog.push(completed);
    return completed;
  } catch (error) {
    const failed: ActionResult = {
      status: 'failed',
      action,
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown execution error'
    };
    actionAuditLog.push(failed);
    return failed;
  }
}

export function getExecutionAuditLog(): ActionResult[] {
  return [...actionAuditLog];
}

// Register a deterministic health-check action so module has at least one real executable path.
registerAction('system.healthCheck', async (request) => ({
  ok: true,
  actor: request.context.actor,
  correlationId: request.context.correlationId ?? null,
  receivedAt: new Date().toISOString()
}));

