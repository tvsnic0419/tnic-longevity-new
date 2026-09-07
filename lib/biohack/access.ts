import { createHmac, timingSafeEqual } from 'node:crypto';

export const BIOHACK_COOKIE = 'tnic_biohack';
export const BIOHACK_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function secret() {
  return process.env.BIOHACK_UNLOCK_SECRET || process.env.CRON_SECRET || '';
}

export function isBiohackCommerceConfigured() {
  return Boolean(process.env.WHOP_BIOHACK_CHECKOUT_URL || process.env.WHOP_BIOHACK_PLAN_ID);
}

export function biohackCheckoutUrl() {
  return process.env.WHOP_BIOHACK_CHECKOUT_URL || '';
}

export function signBiohackToken(payload: string, ttlSeconds = BIOHACK_COOKIE_MAX_AGE) {
  const key = secret();
  if (!key) return '';
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = `${payload}.${exp}`;
  const sig = createHmac('sha256', key).update(body).digest('hex');
  return `${body}.${sig}`;
}

export function verifyBiohackToken(token: string | null | undefined) {
  if (!token) return false;
  const key = secret();
  if (!key) return false;
  const parts = token.split('.');
  if (parts.length < 3) return false;
  const sig = parts.pop() as string;
  const exp = parts.pop() as string;
  const payload = parts.join('.');
  const body = `${payload}.${exp}`;
  const expected = createHmac('sha256', key).update(body).digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum < Math.floor(Date.now() / 1000)) return false;
  return true;
}

export function biohackCookieHeader(token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${BIOHACK_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${BIOHACK_COOKIE_MAX_AGE}${secure}`;
}
