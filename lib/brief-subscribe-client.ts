import { saveBriefSubscription } from './brief-subscribe';

export type BriefDeliveryMode = 'resend' | 'webhook' | 'feed';

export interface BriefSubscribeResponse {
  ok: boolean;
  mode?: BriefDeliveryMode;
  welcomeSent?: boolean;
  message?: string;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseSubscribePayload(data: unknown): BriefSubscribeResponse {
  if (!data || typeof data !== 'object') {
    return { ok: false, error: 'Invalid server response. Try RSS at /brief/feed.xml.' };
  }
  const record = data as Record<string, unknown>;
  if (record.ok === true) {
    const mode =
      record.mode === 'resend' || record.mode === 'webhook' || record.mode === 'feed'
        ? record.mode
        : 'feed';
    return {
      ok: true,
      mode,
      welcomeSent: Boolean(record.welcomeSent),
      message: typeof record.message === 'string' ? record.message : undefined,
    };
  }
  return {
    ok: false,
    error:
      typeof record.error === 'string'
        ? record.error
        : 'Subscription failed. Use RSS feeds at /brief/feed.xml.',
  };
}

/**
 * Subscribe to Protocol Brief — saves locally first, then POSTs to API.
 * Network failures after local save succeed in feed mode with a notice.
 */
export async function submitBriefSubscription(email: string): Promise<BriefSubscribeResponse> {
  const trimmed = email.trim();
  if (!trimmed) {
    return { ok: false, error: 'Email is required.' };
  }
  if (!EMAIL_RE.test(trimmed)) {
    return { ok: false, error: 'Enter a valid email address.' };
  }

  const saved = saveBriefSubscription(trimmed);
  if (!saved) {
    return {
      ok: false,
      error: 'Could not save preference — check browser storage or privacy settings.',
    };
  }

  try {
    const res = await fetch('/api/brief/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmed }),
    });

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      return {
        ok: false,
        error: 'Server returned an unreadable response. RSS feeds remain available at /brief/feed.xml.',
      };
    }

    const parsed = parseSubscribePayload(data);
    if (!parsed.ok) return parsed;

    if (!res.ok) {
      return {
        ok: false,
        error: parsed.error ?? `Server error (${res.status}). Try again or use RSS feeds.`,
      };
    }

    return parsed;
  } catch {
    return {
      ok: true,
      mode: 'feed',
      message: 'Saved locally. Add /brief/feed.xml while email delivery reconnects.',
    };
  }
}