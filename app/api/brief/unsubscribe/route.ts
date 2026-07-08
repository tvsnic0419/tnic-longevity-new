import { NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/brief-unsubscribe';
import { removeBriefSubscriber } from '@/lib/resend';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';

/** One-click unsubscribe from Protocol Brief emails */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email')?.trim().toLowerCase() ?? '';
  const token = url.searchParams.get('token') ?? '';

  const redirect = new URL('/brief', SITE.url);
  redirect.hash = 'brief-subscribe';

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    redirect.searchParams.set('unsubscribe', 'invalid');
    return NextResponse.redirect(redirect);
  }

  try {
    const result = await removeBriefSubscriber(email);
    redirect.searchParams.set('unsubscribe', result.ok ? 'ok' : 'partial');
  } catch {
    redirect.searchParams.set('unsubscribe', 'error');
  }

  return NextResponse.redirect(redirect);
}