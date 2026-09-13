import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { signBiohackToken } from '@/lib/biohack/access';

export const runtime = 'nodejs';

function validSignature(raw: string, header: string | null) {
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const expected = createHmac('sha256', secret).update(raw).digest('hex');
  try {
    const a = Buffer.from(header);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get('x-whop-signature') || request.headers.get('whop-signature');
  if (!validSignature(raw, signature)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let event: { type?: string; data?: { user?: { email?: string }; email?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const type = event.type || '';
  if (!/membership|payment|checkout/i.test(type)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const email = event.data?.user?.email || event.data?.email;
  if (email && process.env.RESEND_API_KEY) {
    const token = signBiohackToken(email);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnic.help';
    const unlock = `${origin}/biohack-100/unlock?token=${encodeURIComponent(token)}`;
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'TNiC <brief@send.tnic.help>',
          to: [email],
          subject: 'Your TNiC Bio Bible unlock',
          text: `Your Bio Bible is ready.\n\nOpen this link once to unlock the reader and PDF:\n${unlock}\n\nEducational reference only — not medical advice.`,
        }),
      });
    } catch {
      /* entitlement email is best-effort */
    }
  }

  return NextResponse.json({ ok: true });
}
