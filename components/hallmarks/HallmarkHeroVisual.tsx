import type { HallmarkLibraryEntry } from '@/lib/types';
import { getHallmarkVisual } from '@/lib/hallmark-visuals';
import { HallmarkIcon } from '@/components/library/HallmarkIcon';
import { TiltGlassPanel } from '@/components/ui/TiltGlassPanel';
import { tierColor } from '@/components/viz/tokens';

/**
 * The hallmark hero's one primary glass moment (see GlassPanel's own
 * comment on that convention) — an orbital map of the hallmark's own
 * top-ranked interventions around a live coverage ring, plus its real key
 * molecules below. Every label here is sourced from lib/hallmarks-library.ts,
 * the same data InterventionCards and the homepage hallmarks grid read from,
 * so this stays accurate as that data changes instead of drifting like a
 * hand-drawn diagram would.
 */

// Canonical evidence-tier colors (A = clinical/emerald, B = emerging/cyan,
// C = preclinical/amber). Read through `tierColor()` rather than re-declared
// as literals here — the values were already correct, but a hand-copied map
// is exactly how lib/hero-network.ts silently drifted off canonical.
const TIER_COLOR: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: tierColor('A'),
  B: tierColor('B'),
  C: tierColor('C'),
  D: tierColor('D'),
};

export function HallmarkHeroVisual({ hallmark }: { hallmark: HallmarkLibraryEntry }) {
  const meta = getHallmarkVisual(hallmark.visual);
  const top = [...hallmark.interventions].sort((a, b) => a.rank - b.rank).slice(0, 5);
  const count = top.length;

  const ringR = 16;
  const ringCircumference = 2 * Math.PI * ringR;
  const ringOffset = ringCircumference - (hallmark.coverage / 100) * ringCircumference;

  return (
    <TiltGlassPanel depth="content" className="relative overflow-hidden rounded-3xl p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: `radial-gradient(circle at 50% 38%, ${meta.colorVar}1f, transparent 65%)` }}
      />

      <div className="relative mx-auto aspect-square w-full max-w-[300px]">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <circle cx="50" cy="50" r="22" fill={`${meta.colorVar}14`} className="constellation-core" />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke={meta.colorVar}
            strokeOpacity="0.14"
            strokeWidth="0.3"
            className="constellation-orbit"
          />
          <circle cx="50" cy="50" r={ringR} fill="none" stroke="var(--color-border-subtle)" strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r={ringR}
            fill="none"
            stroke={meta.colorVar}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            transform="rotate(-90 50 50)"
          />
          {top.map((iv, i) => {
            const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
            const x2 = 50 + Math.cos(angle) * 38;
            const y2 = 50 + Math.sin(angle) * 38;
            return (
              <line
                key={iv.id}
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke={meta.colorVar}
                strokeOpacity="0.16"
                strokeWidth="0.3"
              />
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <HallmarkIcon type={hallmark.visual} size={28} ring={false} />
          <span className="tnic-tabular mt-1 text-xl font-bold" style={{ color: meta.colorVar }}>
            {hallmark.coverage}%
          </span>
          <span className="text-micro font-mono uppercase tracking-wider text-muted-foreground">TNiC coverage</span>
        </div>

        {top.map((iv, i) => {
          const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
          const topPct = 50 + Math.sin(angle) * 38;
          const leftPct = 50 + Math.cos(angle) * 38;
          return (
            <div
              key={iv.id}
              className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${topPct}%`, left: `${leftPct}%` }}
              title={iv.name}
            >
              <span
                className="flex h-full w-full items-center justify-center rounded-full border font-mono text-micro font-bold backdrop-blur-sm"
                style={{ borderColor: TIER_COLOR[iv.evidence], color: TIER_COLOR[iv.evidence], background: 'color-mix(in srgb, var(--glass-bg) 88%, transparent)' }}
              >
                {iv.evidence}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-label mb-2 mt-6 text-center text-muted-foreground">Top interventions</p>
      <ul className="space-y-1.5">
        {top.map((iv) => (
          <li key={iv.id} className="flex items-baseline gap-2 text-xs">
            <span className="w-3.5 shrink-0 font-mono font-bold" style={{ color: TIER_COLOR[iv.evidence] }}>
              {iv.evidence}
            </span>
            <span className="text-muted-foreground">{iv.name}</span>
          </li>
        ))}
      </ul>

      {hallmark.keyMolecules && hallmark.keyMolecules.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/40 pt-4">
          {hallmark.keyMolecules.map((m) => (
            <span
              key={m}
              className="rounded-md border border-border/60 bg-card/60 px-2 py-1 font-mono text-micro text-muted-foreground"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </TiltGlassPanel>
  );
}
