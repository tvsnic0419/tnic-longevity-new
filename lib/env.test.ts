import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { isProduction, requireSecretInProduction } from './env';

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
});