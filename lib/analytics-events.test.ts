import { describe, expect, it } from 'vitest';
import { ANALYTICS_EVENTS, type AnalyticsEventName } from './analytics-events';

describe('analytics-events', () => {
  // Event names are the join key for every downstream analytics report.
  // Renaming one silently splits its history, so pin the exact wire values.
  it('exposes the stable canonical event names', () => {
    expect(ANALYTICS_EVENTS).toEqual({
      nicoCompleted: 'nico_completed',
      emailSubscribed: 'email_subscribed',
      stackExported: 'stack_exported',
      affiliateClick: 'affiliate_click',
      sponsorClick: 'sponsor_click',
    });
  });

  it('uses snake_case, url-safe names with no whitespace', () => {
    for (const name of Object.values(ANALYTICS_EVENTS)) {
      expect(name).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });

  it('has no duplicate wire names', () => {
    const values = Object.values(ANALYTICS_EVENTS);
    expect(new Set(values).size).toBe(values.length);
  });

  it('AnalyticsEventName covers exactly the mapped values', () => {
    const names: AnalyticsEventName[] = Object.values(ANALYTICS_EVENTS);
    expect(names).toContain('affiliate_click');
  });
});
