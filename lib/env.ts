/** Runtime environment helpers — single place for production guards */
import { timingSafeEqual } from 'crypto';

export function isProduction(): boolean {
  return process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
}

export function isVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

/**
 * Require a secret in production; allow open access in dev/preview when unset.
 * Returns null when the check passes, or a 503 response body for missing config.
 */
export function requireSecretInProduction(
  secret: string | undefined,
  name: string,
): { error: string; status: 503 } | null {
  if (secret) return null;
  if (!isProduction()) return null;
  return {
    error: `${name} is required in production`,
    status: 503,
  };
}

/** Constant-time secret comparison — use for any header/bearer secret check. */
export function safeEqual(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
