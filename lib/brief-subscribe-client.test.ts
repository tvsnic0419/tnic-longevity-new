import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { submitBriefSubscription } from './brief-subscribe-client';

describe('submitBriefSubscription', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('rejects empty email', async () => {
    const result = await submitBriefSubscription('  ');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  it('rejects invalid email format', async () => {
    const result = await submitBriefSubscription('not-an-email');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/valid email/i);
  });

  it('returns feed mode when network fails after local save', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const result = await submitBriefSubscription('user@example.com');
    expect(result.ok).toBe(true);
    expect(result.mode).toBe('feed');
    expect(result.message).toBeTruthy();
  });

  it('surfaces API validation errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ ok: false, error: 'Valid email required' }),
      }),
    );

    const result = await submitBriefSubscription('user@example.com');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/valid email/i);
  });
});