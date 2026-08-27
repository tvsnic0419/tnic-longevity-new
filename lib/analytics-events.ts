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
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
