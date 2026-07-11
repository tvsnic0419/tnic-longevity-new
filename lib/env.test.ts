import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { isProduction, requireSecretInProduction, safeEqual } from './env';

describe('env', () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env = { ...original };
  });

  afterEach(() => {
    process.env = original;
  });

  it('isProduction is true when VERCEL_ENV is production', () => {
    process.env.VERCEL_ENV = 'production';
    expect(isProduction()).toBe(true);
  });

  it('requireSecretInProduction blocks production when secret missing', () => {
    process.env.VERCEL_ENV = 'production';
    expect(requireSecretInProduction(undefined, 'CRON_SECRET')).toEqual({
      error: 'CRON_SECRET is required in production',
      status: 503,
    });
  });

  it('requireSecretInProduction allows preview when secret missing', () => {
    process.env.VERCEL_ENV = 'preview';
    expect(requireSecretInProduction(undefined, 'CRON_SECRET')).toBeNull();
  });

  it('requireSecretInProduction passes when secret is set', () => {
    process.env.VERCEL_ENV = 'production';
    expect(requireSecretInProduction('abc', 'CRON_SECRET')).toBeNull();
  });

  it('safeEqual matches equal strings', () => {
    expect(safeEqual('shared-secret', 'shared-secret')).toBe(true);
  });

  it('safeEqual rejects mismatched strings', () => {
    expect(safeEqual('shared-secret', 'wrong')).toBe(false);
  });

  it('safeEqual rejects when either side is missing', () => {
    expect(safeEqual(undefined, 'shared-secret')).toBe(false);
    expect(safeEqual('shared-secret', undefined)).toBe(false);
    expect(safeEqual(undefined, undefined)).toBe(false);
  });

  it('safeEqual rejects different-length strings without throwing', () => {
    expect(safeEqual('short', 'a-much-longer-secret')).toBe(false);
  });
});