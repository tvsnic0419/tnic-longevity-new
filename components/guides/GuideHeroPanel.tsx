import { LongevityGaugeArc } from '@/components/ui/LongevityGaugeArc';
import { GlassPanel } from '@/components/ui/GlassPanel';

/**
 * The guide hero's companion panel — fills the blank right-hand column at
 * desktop widths with the guide's own headline stats, elevated rather than
 * decorated. The optional gauge only appears when a guide has a genuine
 * 0-100 percentage to visualize; forcing one onto every guide (e.g.
 * berberine's "≈5 g/day" dose or sulforaphane's "200+" gene count) would
 * misrepresent numbers that were never meant to read as a fill level.
 */

interface GuideStat {
  value: string;
  label: string;
  colorClass?: string;
}

interface GuideHeadline {
  score: number;
  label: string;
  sublabel?: string;
  color?: string;
}

export function GuideHeroPanel({
  stats,
  headline,
  glowColor = 'var(--accent-cyan)',
}: {
  stats: GuideStat[];
  headline?: GuideHeadline;
  glowColor?: string;
}) {
  return (
    <GlassPanel depth="content" tilt className="relative overflow-hidden rounded-3xl p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: `radial-gradient(circle at 50% 30%, ${glowColor}1f, transparent 65%)` }}
      />

      {headline && (
        <div className="mx-auto mb-6 max-w-[220px]">
          <LongevityGaugeArc
            score={headline.score}
            label={headline.label}
            sublabel={headline.sublabel}
            color={headline.color}
            size={200}
            immediate
          />
        </div>
      )}

      <ul className="space-y-2.5">
        {stats.map((s) => (
          <li
            key={s.label}
            className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3"
          >
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className={`shrink-0 font-mono text-sm font-bold ${s.colorClass ?? 'text-foreground'}`}>
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
