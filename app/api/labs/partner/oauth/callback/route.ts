import { NextResponse } from 'next/server';
import { DEMO_PARTNER_ID } from '@/lib/lab-partner-oauth';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';

/** OAuth callback — forwards code to Labs hub for client token exchange */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const partner = url.searchParams.get('state') ?? url.searchParams.get('partner') ?? DEMO_PARTNER_ID;
  const error = url.searchParams.get('error');

  const redirect = new URL('/labs', SITE.url);
  redirect.hash = 'lab-partner-oauth';

  if (error) {
    redirect.searchParams.set('oauth_error', error);
    return NextResponse.redirect(redirect);
  }

  if (!code) {
    redirect.searchParams.set('oauth_error', 'missing_code');
    return NextResponse.redirect(redirect);
  }

  redirect.searchParams.set('oauth_code', code);
  redirect.searchParams.set('partner', partner);
  return NextResponse.redirect(redirect);
}