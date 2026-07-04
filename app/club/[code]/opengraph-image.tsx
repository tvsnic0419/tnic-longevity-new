import { ImageResponse } from 'next/og';
import { decodeMember, memberId, CHARTER_YEAR } from '@/lib/club';

export const alt = 'The 150-Year Club — Charter Member Card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const m = decodeMember(code);
  const name = m?.name ?? 'Charter Member';
  const id = memberId(name);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #030712 0%, #052e2b 55%, #0a1628 100%)',
          padding: 72,
          fontFamily: 'sans-serif',
          position: 'relative',
          justifyContent: 'space-between',
        }}
      >
        {/* glow */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 400,
            height: 400,
            background: 'rgba(52,211,153,0.18)',
            borderRadius: 9999,
            filter: 'blur(40px)',
          }}
        />

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', fontSize: 40, color: '#34d399' }}>∞</div>
            <div style={{ display: 'flex', color: '#fafafa', fontSize: 34, fontWeight: 800 }}>
              The 150-Year Club
            </div>
          </div>
          <div style={{ display: 'flex', color: '#71717a', fontSize: 24 }}>
            Charter Class {CHARTER_YEAR}
          </div>
        </div>

        {/* member */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', color: '#71717a', fontSize: 26, textTransform: 'uppercase', letterSpacing: 3 }}>
            Charter Member
          </div>
          <div style={{ display: 'flex', color: '#fafafa', fontSize: 96, fontWeight: 900, lineHeight: 1.05 }}>
            {name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', color: '#71717a', fontSize: 20 }}>Member ID</div>
              <div style={{ display: 'flex', color: '#22d3ee', fontSize: 34, fontWeight: 700 }}>{id}</div>
            </div>
            {m?.grade ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', color: '#71717a', fontSize: 20 }}>Longevity grade</div>
                <div style={{ display: 'flex', color: '#34d399', fontSize: 34, fontWeight: 700 }}>{m.grade}</div>
              </div>
            ) : null}
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', color: '#d4d4d8', fontSize: 26, fontWeight: 600, maxWidth: 640 }}>
            The evidence-based pursuit of maximum healthspan.
          </div>
          <div
            style={{
              display: 'flex',
              padding: '14px 32px',
              borderRadius: 999,
              background: 'linear-gradient(90deg, #22d3ee, #34d399)',
              color: '#030712',
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Join free → tnic.help/club
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
