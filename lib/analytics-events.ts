/**
 * Canonical analytics event names, shared by client and server tracking.
 *
 * Kept dependency-free so it is safe to import from anywhere — client
 * components, the edge affiliate route, and tests — without pulling the
 * Vercel Analytics client into a server bundle.
 */
export const ANALYTICS_EVENTS = {
  /** A visitor finished the starter questionnaire and saw a recommended stack. */
  quizCompleted: 'quiz_completed',
  /** A visitor subscribed to the Protocol Brief. */
  emailSubscribed: 'email_subscribed',
  /** A visitor exported their stack / physician summary from the OS. */
  stackExported: 'stack_exported',
  /** A visitor clicked through the affiliate redirect layer (revenue signal). */
  affiliateClick: 'affiliate_click',
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
