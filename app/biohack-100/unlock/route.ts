import { NextResponse } from 'next/server';
import { biohackCookieHeader, signBiohackToken, verifyBiohackToken } from '@/lib/biohack/access';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const valid = verifyBiohackToken(token) ? token : signIfSupportGrant(url);
  if (!valid) {
    return NextResponse.redirect(new URL('/biohack-100?need=access', url.origin));
  }
  const res = NextResponse.redirect(new URL('/biohack-100/read', url.origin));
  res.headers.append('Set-Cookie', biohackCookieHeader(valid));
  return res;
}

function signIfSupportGrant(url: URL) {
  const grant = url.searchParams.get('grant');
  if (!grant) return null;
  if (grant !== process.env.BIOHACK_UNLOCK_SECRET) return null;
  return signBiohackToken(`grant:${Date.now()}`);
}
