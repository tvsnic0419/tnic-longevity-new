/**
 * Canonical analytics event names, shared by client and server tracking.
 *
 * Kept dependency-free so it is safe to import from anywhere — client
 * components, the edge affiliate route, and tests — without pulling the
 * Vercel Analytics client into a server bundle.
 */
export const ANALYTICS_EVENTS = {
  /** A visitor finished the NICO Starter Questionnaire and saw a recommended stack. */
  nicoCompleted: 'nico_completed',
  /** A visitor subscribed to the Protocol Brief. */
  emailSubscribed: 'email_subscribed',
  /** A visitor exported their stack / physician summary from the OS. */
  stackExported: 'stack_exported',
  /** A visitor clicked through the affiliate redirect layer (revenue signal). */
  affiliateClick: 'affiliate_click',
  /** A visitor clicked a clearly-labeled sponsor placement (revenue signal). */
  sponsorClick: 'sponsor_click',
  /** A visitor moved from an active stack to its buyer-verification flow. */
  stackShopOpened: 'stack_shop_opened',
  /** A visitor chose a curated stack preset in Protocol Shop. */
  shopPresetLoaded: 'shop_preset_loaded',
  /** A visitor reviewed or cleared a buyer-checklist item in Protocol Shop. */
  shopChecklistProgress: 'shop_checklist_progress',
  /** A visitor saved, updated, or cleared a local research question; question text is never tracked. */
  researchIntentSet: 'research_intent_set',
  /** A visitor opened a source-backed evidence trail from a decision surface. */
  evidenceTraceOpened: 'evidence_trace_opened',
  /** A visitor opened the bounded local lab review context. */
  labReviewOpened: 'lab_review_opened',
  /** A visitor opened a selected hallmark in the connected systems map. */
  hallmarkSystemsOpened: 'hallmark_systems_opened',
  /** A visitor expanded the NICO result research route. */
  nicoResearchRouteOpened: 'nico_research_route_opened',
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
