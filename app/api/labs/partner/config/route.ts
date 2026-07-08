import { NextResponse } from 'next/server';
import { getConnectablePartners } from '@/lib/lab-partner-oauth';

export const runtime = 'nodejs';

/** Returns partners available for OAuth connect (env-resolved on server) */
export async function GET() {
  return NextResponse.json({
    partners: getConnectablePartners().map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
    })),
  });
}