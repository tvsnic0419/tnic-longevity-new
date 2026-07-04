import { buildBriefDigestHtml, buildBriefDigestSubject } from './brief-email';
import { buildBriefWelcomeHtml, buildBriefWelcomeSubject } from './brief-welcome-email';
import { getWeeklyIssueIndex, getWeeklyIssueId } from './brief-rotation';

const RESEND_API = 'https://api.resend.com';

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export function getResendAudienceId(): string | undefined {
  return process.env.RESEND_AUDIENCE_ID;
}

async function resendFetch(path: string, init: RequestInit) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');

  const res = await fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `Resend error ${res.status}`);
  }
  return data;
}

/** Add subscriber to Resend audience (idempotent on duplicate email) */
export async function addBriefSubscriber(email: string): Promise<{ ok: boolean; id?: string }> {
  const audienceId = getResendAudienceId();
  if (!audienceId) {
    return { ok: false };
  }

  try {
    const data = (await resendFetch(`/audiences/${audienceId}/contacts`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        unsubscribed: false,
        first_name: 'Protocol',
        last_name: 'Brief',
      }),
    })) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.toLowerCase().includes('already')) return { ok: true };
    throw err;
  }
}

export async function listAudienceContacts(): Promise<{ id: string; email: string }[]> {
  const audienceId = getResendAudienceId();
  if (!audienceId) return [];

  const data = (await resendFetch(`/audiences/${audienceId}/contacts`, {
    method: 'GET',
  })) as { data?: { id: string; email: string }[] };

  return (data.data ?? []).filter((c) => c.email);
}

export async function listAudienceEmails(): Promise<string[]> {
  return (await listAudienceContacts()).map((c) => c.email);
}

export async function removeBriefSubscriber(email: string): Promise<{ ok: boolean }> {
  const audienceId = getResendAudienceId();
  if (!audienceId) return { ok: false };

  const contacts = await listAudienceContacts();
  const match = contacts.find((c) => c.email.toLowerCase() === email.toLowerCase());
  if (!match) return { ok: true };

  await resendFetch(`/audiences/${audienceId}/contacts/${match.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ unsubscribed: true }),
  });

  return { ok: true };
}

export async function sendWelcomeEmail(to: string): Promise<{ id?: string; ok: boolean }> {
  if (!isResendConfigured()) return { ok: false };

  try {
    const from = process.env.RESEND_FROM_EMAIL!;
    const data = (await resendFetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to: [to],
        subject: buildBriefWelcomeSubject(),
        html: buildBriefWelcomeHtml(to),
      }),
    })) as { id?: string };
    return { ok: true, id: data.id };
  } catch {
    return { ok: false };
  }
}

export async function sendBriefEmail(
  to: string,
  issueIndex = getWeeklyIssueIndex(),
): Promise<{ id?: string }> {
  const from = process.env.RESEND_FROM_EMAIL!;
  return resendFetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      from,
      to: [to],
      subject: buildBriefDigestSubject(issueIndex),
      html: buildBriefDigestHtml(issueIndex, to),
    }),
  }) as Promise<{ id?: string }>;
}

export async function sendWeeklyBriefDigest(): Promise<{
  sent: number;
  skipped: number;
  errors: string[];
  issueIndex: number;
  issueId: string;
}> {
  const issueIndex = getWeeklyIssueIndex();
  const issueId = getWeeklyIssueId();

  if (!isResendConfigured()) {
    return { sent: 0, skipped: 0, errors: ['Resend not configured'], issueIndex, issueId };
  }

  const emails = await listAudienceEmails();
  const errors: string[] = [];
  let sent = 0;

  if (emails.length === 0) {
    const fallback = process.env.BRIEF_FALLBACK_EMAIL;
    if (fallback) {
      try {
        await sendBriefEmail(fallback, issueIndex);
        return { sent: 1, skipped: 0, errors: [], issueIndex, issueId };
      } catch (e) {
        return { sent: 0, skipped: 0, errors: [String(e)], issueIndex, issueId };
      }
    }
    return { sent: 0, skipped: 0, errors: ['No audience contacts'], issueIndex, issueId };
  }

  for (const email of emails) {
    try {
      await sendBriefEmail(email, issueIndex);
      sent++;
    } catch (e) {
      errors.push(`${email}: ${e instanceof Error ? e.message : 'failed'}`);
    }
  }

  return { sent, skipped: emails.length - sent, errors, issueIndex, issueId };
}