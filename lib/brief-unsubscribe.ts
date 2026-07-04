import { createHmac, timingSafeEqual } from 'crypto';

function getUnsubscribeSecret(): string | undefined {
  return process.env.BRIEF_UNSUBSCRIBE_SECRET ?? process.env.CRON_SECRET;
}

export function createUnsubscribeToken(email: string): string | null {
  const secret = getUnsubscribeSecret();
  if (!secret) return null;
  return createHmac('sha256', secret).update(email.trim().toLowerCase()).digest('base64url');
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = createUnsubscribeToken(email);
  if (!expected || !token) return false;
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(token);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function buildUnsubscribeUrl(email: string): string | null {
  const token = createUnsubscribeToken(email);
  if (!token) return null;
  const params = new URLSearchParams({
    email: email.trim().toLowerCase(),
    token,
  });
  return `/api/brief/unsubscribe?${params.toString()}`;
}