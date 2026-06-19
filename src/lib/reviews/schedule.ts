export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 15] as const;

export function getNextReviewIntervalDays(previousIntervalDays?: number) {
  if (!previousIntervalDays) {
    return REVIEW_INTERVALS_DAYS[0];
  }

  const currentIndex = REVIEW_INTERVALS_DAYS.findIndex((interval) => interval === previousIntervalDays);
  return REVIEW_INTERVALS_DAYS[Math.min(currentIndex + 1, REVIEW_INTERVALS_DAYS.length - 1)];
}

export function buildReviewDueDate(from: Date, intervalDays: number) {
  const dueAt = new Date(from);
  dueAt.setDate(dueAt.getDate() + intervalDays);
  return dueAt;
}
