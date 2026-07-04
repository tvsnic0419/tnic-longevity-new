import { getAllBriefIssues } from './brief-research-sync';

/** ISO week number (1–53) for stable weekly rotation */
export function getIsoWeekNumber(date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/** Rotate through curated issues — one issue per ISO week */
export function getWeeklyIssueIndex(date = new Date()): number {
  const issues = getAllBriefIssues();
  const count = issues.length;
  if (count === 0) return 0;
  return (getIsoWeekNumber(date) - 1) % count;
}

export function getWeeklyIssueId(date = new Date()): string {
  const issues = getAllBriefIssues();
  const index = getWeeklyIssueIndex(date);
  return issues[index]?.id ?? issues[0].id;
}