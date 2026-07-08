import { NextResponse } from 'next/server';
import { DEMO_PARTNER_ID, getResolvedPartner } from '@/lib/lab-partner-oauth';
import { getOAuthCallbackUrl } from '@/lib/lab-partner-live';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';

/** Initiate OAuth — demo redirects inline; live partners use authorize URL */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const partnerId = url.searchParams.get('partner') ?? DEMO_PARTNER_ID;
  const partner = getResolvedPartner(partnerId);

  if (!partner) {
    return NextResponse.json({ error: 'Unknown partner' }, { status: 404 });
  }

  if (partner.status === 'coming_soon') {
    return NextResponse.json({ error: 'Partner not yet available', partner: partnerId }, { status: 501 });
  }

  if (partner.status === 'demo') {
    const code = `demo_${Date.now().toString(36)}`;
    const redirect = new URL('/labs', SITE.url);
    redirect.searchParams.set('oauth_code', code);
    redirect.searchParams.set('partner', partnerId);
    redirect.hash = 'lab-partner-oauth';
    return NextResponse.redirect(redirect);
  }

  if (partner.status === 'live' && partner.oauthAuthorizeUrl) {
    const auth = new URL(partner.oauthAuthorizeUrl);
    auth.searchParams.set('client_id', process.env.LONGEVITY_DIRECT_CLIENT_ID ?? process.env.LAB_OAUTH_CLIENT_ID ?? 'tnic');
    auth.searchParams.set('redirect_uri', getOAuthCallbackUrl());
    auth.searchParams.set('response_type', 'code');
    auth.searchParams.set('scope', partner.scopes.join(' '));
    auth.searchParams.set('state', partnerId);
    return NextResponse.redirect(auth);
  }

  return NextResponse.json({ error: 'Partner OAuth not configured' }, { status: 501 });
}