import { track } from '@vercel/analytics';
import type { AnalyticsEventName } from './analytics-events';

/**
 * Client-side conversion tracking.
 *
 * Vercel Web Analytics is cookieless and stores no personal data, which is
 * consistent with the site's privacy principles (no cookies, no server-side
 * database of user data). `track` is a no-op unless Analytics is live
 * (production on Vercel), so these calls are safe to invoke anywhere in the
 * browser — including during local development and tests.
 */
type EventProps = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: AnalyticsEventName, properties?: EventProps): void {
  try {
    track(name, properties);
  } catch {
    // Analytics must never break the user experience.
  }
}
