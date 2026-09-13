import { describe, expect, it } from 'vitest';
import { signBiohackToken, verifyBiohackToken } from './access';

describe('biohack access tokens', () => {
  it('rejects empty and junk tokens', () => {
    expect(verifyBiohackToken('')).toBe(false);
    expect(verifyBiohackToken('not-a-token')).toBe(false);
  });

  it('accepts a token signed with the configured secret', () => {
    process.env.BIOHACK_UNLOCK_SECRET = 'test-secret-biohack';
    const token = signBiohackToken('buyer@example.com');
    expect(token.length).toBeGreaterThan(20);
    expect(verifyBiohackToken(token)).toBe(true);
    expect(verifyBiohackToken(`${token}x`)).toBe(false);
  });
});
