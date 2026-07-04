import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };

export function OgImage({
  title,
  subtitle = 'Evidence-graded longevity intelligence',
  accent = '#22d3ee',
}: {
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #030712 100%)',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${accent}, #34d399)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 700,
              color: '#030712',
            }}
          >
            T
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
            TN<span style={{ color: accent }}>i</span>C
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 26, color: '#94a3b8', lineHeight: 1.4 }}>{subtitle}</div>
        </div>

        <div style={{ display: 'flex', gap: 24, fontSize: 18, color: '#64748b' }}>
          <span>Tier A/B/C graded</span>
          <span>·</span>
          <span>Local-first OS</span>
          <span>·</span>
          <span>tnic.help</span>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}