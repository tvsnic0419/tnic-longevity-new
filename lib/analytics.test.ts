import { describe, expect, it, vi, beforeEach } from 'vitest';

const track = vi.fn();
vi.mock('@vercel/analytics', () => ({ track: (...args: unknown[]) => track(...args) }));

// Imported after the mock is registered.
const { trackEvent } = await import('./analytics');
const { ANALYTICS_EVENTS } = await import('./analytics-events');

describe('trackEvent', () => {
  beforeEach(() => {
    track.mockReset();
  });

  it('forwards the event name and properties to the analytics client', () => {
    trackEvent(ANALYTICS_EVENTS.quizCompleted, { preset: 'starter' });
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(ANALYTICS_EVENTS.quizCompleted, { preset: 'starter' });
  });

  it('works with no properties', () => {
    trackEvent(ANALYTICS_EVENTS.emailSubscribed);
    expect(track).toHaveBeenCalledWith(ANALYTICS_EVENTS.emailSubscribed, undefined);
  });

  it('never throws when the analytics client fails', () => {
    track.mockImplementation(() => {
      throw new Error('analytics offline');
    });
    expect(() => trackEvent(ANALYTICS_EVENTS.stackExported, { format: 'json' })).not.toThrow();
  });
});
