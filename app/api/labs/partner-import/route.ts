import { NextResponse } from 'next/server';
import { parsePartnerJson, PARTNER_SCHEMA } from '@/lib/lab-partner-import';

export const runtime = 'nodejs';

/** Stateless partner JSON normalizer — no PHI persisted server-side */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = parsePartnerJson(body);

    if (result.entries.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          schema: PARTNER_SCHEMA,
          errors: result.errors.length ? result.errors : ['No importable entries'],
          meta: result.meta,
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      ok: true,
      entries: result.entries,
      errors: result.errors,
      meta: result.meta,
    });
  } catch {
    return NextResponse.json(
      { ok: false, errors: ['Invalid JSON body'], schema: PARTNER_SCHEMA },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    schema: PARTNER_SCHEMA,
    method: 'POST',
    description: 'Submit PartnerImportPayload JSON. Returns normalized lab entries for client-side import.',
  });
}