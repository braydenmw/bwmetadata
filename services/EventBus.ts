/**
 * EventBus — Unified pub/sub for the BWGA Intelligence AI ecosystem
 *
 * Connects: agentic worker, orchestrator, self-learning engine, consultant, App
 * Enables all modules to see the whole "meadow" (bee, flower, ecosystem).
 */
import type {
  ReportPayload,
  CopilotInsight,
  IntakeMappingSnapshot,
  ApprovalRecord,
  ProvenanceEntry,
  MandateRecord
} from '../types';

// Ecosystem pulse: the "meadow" view (alignment, bottlenecks, opportunities)
export type EcosystemPulse = {
  alignment: number; // 0-100 from SEAM or composite
  bottlenecks: string[];
  opportunities: string[];
};

// Memory case from prior runs
export type MemoryCase = {
  id: string;
  score: number;
  why: string[];
  organizationName?: string;
  country?: string;
};

// Executive brief structure
export type ExecutiveBrief = {
  proceedSignal: 'proceed' | 'pause' | 'restructure';
  topDrivers: string[];
  topRisks: string[];
  nextActions: string[];
};

// All event types in the system
export type NexusEvent =
  | { type: 'intakeUpdated'; reportId: string; snapshot: IntakeMappingSnapshot }
  | { type: 'payloadAssembled'; reportId: string; payload: ReportPayload }
  | { type: 'executiveBriefReady'; reportId: string; brief: ExecutiveBrief }
  | { type: 'insightsGenerated'; reportId: string; insights: CopilotInsight[] }
  | { type: 'suggestionsReady'; reportId: string; actions: string[] }
  | { type: 'memoryUpdated'; reportId: string; cases: MemoryCase[] }
  | { type: 'outcomeRecorded'; reportId: string; outcome: { success: boolean; notes?: string } }
  | { type: 'proactiveDiscovery'; reportId: string; actions: string[]; sources: string[] }
  | { type: 'learningUpdate'; reportId: string; message: string; improvements?: string[] }
  | { type: 'ecosystemPulse'; reportId: string; signals: EcosystemPulse }
  | { type: 'approvalUpdated'; reportId: string; approval: ApprovalRecord; mandate?: MandateRecord }
  | { type: 'provenanceLogged'; reportId: string; entry: ProvenanceEntry; mandate?: MandateRecord };

type Handler<T extends NexusEvent['type']> = (event: Extract<NexusEvent, { type: T }>) => void;

class EventBusImpl {
  private listeners: Map<string, Set<Function>> = new Map();
  private eventLog: Array<{ ts: number; type: string; reportId: string }> = [];

  subscribe<T extends NexusEvent['type']>(type: T, handler: Handler<T>): () => void {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(handler as Function);
    return () => {
      this.listeners.get(type)?.delete(handler as Function);
    };
  }

  publish(event: NexusEvent): void {
    // Log for traceability
    this.eventLog.push({ ts: Date.now(), type: event.type, reportId: event.reportId });
    if (this.eventLog.length > 100) this.eventLog.shift();

    const set = this.listeners.get(event.type);
    if (!set || set.size === 0) {
      console.debug(`[EventBus] No handlers for ${event.type}`);
      return;
    }
    console.log(`[EventBus] ${event.type} → ${set.size} handler(s)`);
    for (const handler of set) {
      try {
        (handler as Function)(event);
      } catch (e) {
        console.warn('[EventBus] Handler error for', event.type, e);
      }
    }
  }

  /** Recent events for debugging */
  getRecentEvents(n = 10) {
    return this.eventLog.slice(-n);
  }

  /** Clear all (for tests) */
  clear() {
    this.listeners.clear();
    this.eventLog = [];
  }
}

export const EventBus = new EventBusImpl();
