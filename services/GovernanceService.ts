import { ApprovalRecord, MandateRecord, ProvenanceEntry, ApprovalStage, ApprovalDecision, ApproverRole } from '../types';
import { EventBus } from './EventBus';

const stageRank: Record<ApprovalStage, number> = {
  draft: 0,
  review: 1,
  approved: 2,
  signed: 3
};

const API_BASE = '/api/governance';

const postJson = async (url: string, body: Record<string, unknown>) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
};

const putJson = async (url: string, body: Record<string, unknown>) => {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
};

const getJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
};

export const GovernanceService = {
  async upsertMandate(reportId: string, mandate?: Partial<MandateRecord>) {
    return putJson(`${API_BASE}/${reportId}/mandate`, mandate || {});
  },

  async recordApproval(input: {
    reportId: string;
    stage: ApprovalStage;
    decision: ApprovalDecision;
    actor: string;
    role: ApproverRole;
    notes?: string;
    attachment?: string;
    versionId?: string;
  }): Promise<ApprovalRecord> {
    const res = await postJson(`${API_BASE}/${input.reportId}/approval`, input);
    EventBus.publish({ type: 'approvalUpdated', reportId: input.reportId, approval: res.approval, mandate: res.mandate });
    return res.approval as ApprovalRecord;
  },

  async recordProvenance(input: {
    reportId: string;
    artifact: string;
    action: string;
    actor: string;
    source?: string;
    checksum?: string;
    tags?: string[];
    relatedApprovalId?: string;
  }): Promise<ProvenanceEntry> {
    const res = await postJson(`${API_BASE}/${input.reportId}/provenance`, input);
    EventBus.publish({ type: 'provenanceLogged', reportId: input.reportId, entry: res.entry, mandate: res.mandate });
    return res.entry as ProvenanceEntry;
  },

  async getMandate(reportId: string): Promise<MandateRecord | undefined> {
    const res = await getJson(`${API_BASE}/${reportId}/timeline`);
    return res.mandate as MandateRecord;
  },

  async getTimeline(reportId: string): Promise<{ approvals: ApprovalRecord[]; provenance: ProvenanceEntry[]; mandate: MandateRecord }> {
    const res = await getJson(`${API_BASE}/${reportId}/timeline`);
    return res as { approvals: ApprovalRecord[]; provenance: ProvenanceEntry[]; mandate: MandateRecord };
  },

  async ensureStage(reportId: string, minimum: ApprovalStage = 'approved'): Promise<{ ok: boolean; stage?: ApprovalStage }> {
    try {
      const res = await getJson(`${API_BASE}/${reportId}/stage`);
      const current = (res.stage as ApprovalStage) || 'draft';
      const ok = stageRank[current] >= stageRank[minimum];
      return { ok, stage: current };
    } catch {
      return { ok: false, stage: 'draft' };
    }
  }
};
