/** Merge class names — shadcn/ui convention */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

const REVIEW_DATE_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Formats a "YYYY-MM-DD" frontmatter date for display (e.g. "July 16, 2026").
 * Parses the parts manually rather than `new Date("YYYY-MM-DD")`, which
 * constructs a UTC midnight timestamp that can render as the previous day
 * in timezones behind UTC.
 */
export function formatReviewDate(isoDate: string | undefined): string | null {
  const match = isoDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, year, month, day] = match;
  const monthName = REVIEW_DATE_MONTHS[Number(month) - 1];
  if (!monthName) return null;
  return `${monthName} ${Number(day)}, ${year}`;
}