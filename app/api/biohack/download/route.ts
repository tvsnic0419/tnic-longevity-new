import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { BIOHACK_COOKIE, verifyBiohackToken } from '@/lib/biohack/access';

export const runtime = 'nodejs';

export async function GET() {
  const jar = await cookies();
  const token = jar.get(BIOHACK_COOKIE)?.value;
  if (!verifyBiohackToken(token)) {
    return NextResponse.json({ ok: false, error: 'Unlock required' }, { status: 401 });
  }

  const filePath = path.join(process.cwd(), 'content/biohack/TNIC_Bio_Bible_BIOHACK_100.pdf');
  try {
    const buf = await readFile(filePath);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="TNIC_Bio_Bible_BIOHACK_100.pdf"',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'PDF artifact is not mounted yet. Use the in-app reader.' },
      { status: 404 },
    );
  }
}
