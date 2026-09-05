'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { PALETTE as COLORS, type Subscores } from '@/lib/compound-engine-data';

// Mono micro-labels never go below the 11px site floor (see `.text-label`).
const LABEL_PX = 11;

/**
 * The engine's per-compound subscore radar, split into its own client chunk so
 * recharts (~85 KB gz) loads only when this chart mounts — keeping it out of the
 * /compound-engine first-load bundle (imported via dynamic(ssr:false) upstream).
 */
export default function EngineRadar({ subs }: { subs: Subscores }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {/* outerRadius pulled in from the 80% default so the 11px mono axis labels render unclipped. */}
      <RadarChart
        outerRadius="55%"
        data={[
          { k: 'Evidence', v: subs.evidence },
          { k: 'Effect', v: subs.effect },
          { k: 'Breadth', v: subs.breadth },
          { k: 'Bioavail', v: subs.bioavail },
          { k: 'Safety', v: subs.safety },
        ]}
      >
        <PolarGrid stroke={COLORS.line} />
        <PolarAngleAxis dataKey="k" tick={{ fill: COLORS.muted, fontSize: LABEL_PX, fontFamily: 'var(--font-mono)' }} />
        <Radar dataKey="v" stroke={COLORS.jade} fill={COLORS.jade} fillOpacity={0.28} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
