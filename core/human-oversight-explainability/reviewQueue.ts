// Human Review Queue for Oversight
// Actions requiring human approval are queued here

const reviewQueue: Array<{ action: string; params: any; reason: string }> = [];

export function queueForReview(action: string, params: any, reason: string) {
  reviewQueue.push({ action, params, reason });
}

export function getReviewQueue() {
  return reviewQueue;
}

export function approveAction(index: number): { action: string; params: any } | null {
  if (reviewQueue[index]) {
    const { action, params } = reviewQueue.splice(index, 1)[0];
    return { action, params };
  }
  return null;
}

