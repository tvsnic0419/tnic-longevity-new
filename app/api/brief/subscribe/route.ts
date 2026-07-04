import { NextResponse } from 'next/server';
import {
  addBriefSubscriber,
  isResendConfigured,
  getResendAudienceId,
  sendWelcomeEmail,
} from '@/lib/resend';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Protocol Brief subscribe — Resend audience first, then webhook, then RSS/JSON feeds.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Valid email required' }, { status: 400 });
    }

    let mode: 'resend' | 'webhook' | 'feed' = 'feed';
    let welcomeSent = false;

    if (isResendConfigured() && getResendAudienceId()) {
      try {
        const result = await addBriefSubscriber(email);
        if (result.ok) {
          mode = 'resend';
          const welcome = await sendWelcomeEmail(email);
          welcomeSent = welcome.ok;
        }
      } catch {
        /* fall through */
      }
    }

    if (mode === 'feed') {
      const webhook = process.env.BRIEF_SUBSCRIBE_WEBHOOK_URL;
      if (webhook) {
        try {
          const res = await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              source: 'tnic-protocol-brief',
              subscribed_at: new Date().toISOString(),
              frequency: 'weekly',
            }),
          });
          if (res.ok) mode = 'webhook';
        } catch {
          /* fall through to feed mode */
        }
      }
    }

    const messages: Record<typeof mode, string> = {
      resend: welcomeSent
        ? 'Subscribed — welcome email sent; weekly Protocol Brief drops follow.'
        : 'Subscribed — weekly Protocol Brief emails will arrive from TNiC.',
      webhook: 'Subscribed — weekly delivery will start when the list is processed.',
      feed: 'Use RSS/JSON feeds for automated delivery until email backend is fully live.',
    };

    return NextResponse.json({
      ok: true,
      mode,
      welcomeSent,
      message: messages[mode],
      feeds: {
        rss: '/brief/feed.xml',
        json: '/brief/feed.json',
      },
    });
  } catch (err) {
    console.error('[brief/subscribe]', err);
    return NextResponse.json({ ok: false, error: 'Subscription service unavailable' }, { status: 500 });
  }
}