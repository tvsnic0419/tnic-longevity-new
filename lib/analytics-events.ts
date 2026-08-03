/**
 * Canonical analytics event names, shared by client and server tracking.
 *
 * Kept dependency-free so it is safe to import from anywhere — client
 * components, the edge affiliate route, and tests — without pulling the
 * Vercel Analytics client into a server bundle.
 */
export const ANALYTICS_EVENTS = {
  /** A visitor finished the 3-question quiz and saw a recommended stack. */
  quizCompleted: 'quiz_completed',
  /** A visitor subscribed to the Protocol Brief. */
  emailSubscribed: 'email_subscribed',
  /** A visitor exported their stack / physician summary from the OS. */
  stackExported: 'stack_exported',
  /** A visitor clicked through the affiliate redirect layer (revenue signal). */
  affiliateClick: 'affiliate_click',
  /** A visitor added a compound to their Pathway Architect protocol. */
  pathwayArchitectAdd: 'pathway_architect_add',
  /** A visitor removed a compound from their Pathway Architect protocol. */
  pathwayArchitectRemove: 'pathway_architect_remove',
  /** A visitor loaded one of the four Pathway Architect starter stacks. */
  pathwayArchitectStarterStack: 'pathway_architect_starter_stack',
  /** A visitor copied a shareable Pathway Architect protocol link. */
  pathwayArchitectShare: 'pathway_architect_share',
  /** A visitor printed their Pathway Architect protocol. */
  pathwayArchitectPrint: 'pathway_architect_print',
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
