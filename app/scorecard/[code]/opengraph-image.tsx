import { ImageResponse } from 'next/og';
import {
  decodeScorecard,
  scorecardGrade,
  gradeColors,
  gradeLabels,
} from '@/lib/scorecard';

export const alt = 'TNiC Longevity Scorecard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const p = decodeScorecard(code) ?? {
    age: 0,
    bioAge: 0,
    synergy: 0,
    coverage: 0,
    stackSize: 0,
  };
  const grade = scorecardGrade(p);
  const color = gradeColors[grade];
  const showBioAge = p.bioAge > 0 && p.age > 0;
  const delta = p.age - p.bioAge;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #030712 0%, #0a1628 55%, #052e2b 100%)',
          padding: 64,
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* top brand row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #22d3ee, #34d399)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#030712',
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              TN
            </div>
            <div style={{ display: 'flex', color: '#fafafa', fontSize: 32, fontWeight: 800 }}>
              TNiC · Longevity Scorecard
            </div>
          </div>
          <div style={{ display: 'flex', color: '#71717a', fontSize: 22 }}>tnic.help</div>
        </div>

        {/* main row */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 72, marginTop: 24 }}>
          {/* grade block */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 260,
                fontWeight: 900,
                color,
                lineHeight: 1,
              }}
            >
              {grade}
            </div>
            <div style={{ display: 'flex', color: '#d4d4d8', fontSize: 28, fontWeight: 700 }}>
              {gradeLabels[grade]}
            </div>
          </div>

          {/* stats column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, flex: 1 }}>
            {showBioAge && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px 32px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(52,211,153,0.35)',
                }}
              >
                <div style={{ display: 'flex', color: '#71717a', fontSize: 20, textTransform: 'uppercase', letterSpacing: 2 }}>
                  Biological age
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <div style={{ display: 'flex', color: '#34d399', fontSize: 64, fontWeight: 800 }}>{p.bioAge}</div>
                  <div style={{ display: 'flex', color: '#a1a1aa', fontSize: 26 }}>
                    {delta > 0 ? `${delta} yrs younger than ${p.age}` : `chronological: ${p.age}`}
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 24 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: '20px 28px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(34,211,238,0.3)',
                }}
              >
                <div style={{ display: 'flex', color: '#71717a', fontSize: 18, textTransform: 'uppercase', letterSpacing: 2 }}>
                  Hallmark coverage
                </div>
                <div style={{ display: 'flex', color: '#22d3ee', fontSize: 52, fontWeight: 800 }}>{p.coverage}%</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: '20px 28px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(167,139,250,0.3)',
                }}
              >
                <div style={{ display: 'flex', color: '#71717a', fontSize: 18, textTransform: 'uppercase', letterSpacing: 2 }}>
                  Synergy score
                </div>
                <div style={{ display: 'flex', color: '#a78bfa', fontSize: 52, fontWeight: 800 }}>{p.synergy}</div>
              </div>
            </div>
          </div>
        </div>

        {/* footer CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', color: '#d4d4d8', fontSize: 26, fontWeight: 600 }}>
            What&rsquo;s your longevity grade?
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
            Free 3-min quiz → tnic.help
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
