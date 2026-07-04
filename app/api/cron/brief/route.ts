import { NextResponse } from 'next/server';
import { requireSecretInProduction } from '@/lib/env';
import { sendWeeklyBriefDigest, isResendConfigured } from '@/lib/resend';

export const runtime = 'nodejs';

/** Weekly Protocol Brief send — protect with CRON_SECRET */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const missingSecret = requireSecretInProduction(cronSecret, 'CRON_SECRET');
  if (missingSecret) {
    return NextResponse.json({ error: missingSecret.error }, { status: missingSecret.status });
  }

  const auth = request.headers.get('authorization');
  const bearer = auth?.replace(/^Bearer\s+/i, '');

  if (bearer !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isResendConfigured()) {
    return NextResponse.json({
      ok: false,
      error: 'Resend not configured — set RESEND_API_KEY and RESEND_FROM_EMAIL',
    }, { status: 503 });
  }

  const result = await sendWeeklyBriefDigest();

  return NextResponse.json({
    ok: result.sent > 0,
    ...result,
    timestamp: new Date().toISOString(),
  });
}