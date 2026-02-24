// Human Oversight & Explainability Module
// Responsible for review requests, decision logging, and transparent reporting.

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface HumanReviewRecord {
  taskId: string;
  status: ReviewStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  rationale?: string;
}

const reviewRecords = new Map<string, HumanReviewRecord>();

export function requestHumanReview(taskId: string): HumanReviewRecord {
  const existing = reviewRecords.get(taskId);
  if (existing) return existing;

  const created: HumanReviewRecord = {
    taskId,
    status: 'pending',
    requestedAt: new Date().toISOString()
  };
  reviewRecords.set(taskId, created);
  return created;
}

export function resolveHumanReview(
  taskId: string,
  decision: Exclude<ReviewStatus, 'pending'>,
  reviewer: string,
  rationale: string
): HumanReviewRecord {
  const current = reviewRecords.get(taskId) ?? requestHumanReview(taskId);
  const updated: HumanReviewRecord = {
    ...current,
    status: decision,
    reviewer,
    rationale,
    reviewedAt: new Date().toISOString()
  };
  reviewRecords.set(taskId, updated);
  return updated;
}

export function getHumanReview(taskId: string): HumanReviewRecord | null {
  return reviewRecords.get(taskId) ?? null;
}

export function listHumanReviews(): HumanReviewRecord[] {
  return Array.from(reviewRecords.values()).sort((a, b) => {
    const aTime = Date.parse(a.requestedAt);
    const bTime = Date.parse(b.requestedAt);
    return bTime - aTime;
  });
}

