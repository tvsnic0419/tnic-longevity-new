"use client";

import Link from "next/link";
import { MoleculeStage } from "./MoleculeStage";
import { FONT, HUES, paletteFor, type RGB } from "./tokens";
import { useTheme } from "@/components/theme/ThemeProvider";

// ─────────────────────────────────────────────────────────────────────────────
// CinematicHubHero — a reusable, Descent-language opening band for hub pages.
// A full-bleed molecular field (via the shared MoleculeStage), an editorial
// Fraunces headline, a live stat rail, and gradient CTAs — all keyed to a hub's
// signature hue so it sits inside the same site-wide camera as everything else.
// Content is real: callers pass stats joined from lib data, never invented.
//
// Theme-aware: reads the site's resolved dark/light theme and swaps in the
// matching palette from viz/tokens (paletteFor) rather than only ever
// rendering the dark "evidence-noir" look.
// ─────────────────────────────────────────────────────────────────────────────

export type HubStat = { value: string; label: string };

export function CinematicHubHero({
  hue = "violet",
  kicker,
  title,
  lead,
  stats,
  primary,
  secondary,
}: {
  hue?: keyof typeof HUES;
  kicker: string;
  /** Headline; wrap the accent fragment in <em> for the hue-colored italic. */
  title: React.ReactNode;
  lead: string;
  stats: HubStat[];
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  const { resolved } = useTheme();
  const { viz, hues } = paletteFor(resolved);
  const rgb: RGB = hues[hue] ?? hues.violet;
  const hueCss = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

  return (
    <section className="tnic-hubhero" style={{ "--hue": hueCss } as React.CSSProperties}>
      <style>{hubHeroCss(viz)}</style>

      {/* full-bleed molecular field, masked to ambience */}
      <div className="hh-field" aria-hidden="true">
        <MoleculeStage hue={rgb} interactive={false} />
      </div>
      <div className="hh-veil" aria-hidden="true" />

      <div className="hh-inner">
        <p className="hh-kicker">{kicker}</p>
        {/* Decorative cover headline — the page's semantic <h1> lives in the
            hub's own PageHeader below, so this stays a non-heading to avoid a
            duplicate top-level heading. */}
        <p className="hh-title">{title}</p>
        <p className="hh-lead">{lead}</p>

        {stats.length > 0 && (
          <div className="hh-stats">
            {stats.map((s) => (
              <div className="hh-stat" key={s.label}>
                <span className="v">{s.value}</span>
                <span className="k">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {(primary || secondary) && (
          <div className="hh-ctas">
            {primary && (
              <Link href={primary.href} className="hh-cta">
                {primary.label} <span className="arr">→</span>
              </Link>
            )}
            {secondary && (
              <Link href={secondary.href} className="hh-cta ghost">
                {secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function hubHeroCss(viz: { ink: string; muted: string; faint: string; line: string; void: string; indigo: string }) {
  return `
.tnic-hubhero {
  position: relative; isolation: isolate; overflow: hidden;
  padding: clamp(72px, 12vh, 140px) 0 clamp(48px, 8vh, 96px);
  font-family: ${FONT.sans};
  color: ${viz.ink};
  -webkit-font-smoothing: antialiased;
}
.tnic-hubhero * { box-sizing: border-box; }
.hh-field {
  position: absolute; inset: -10% -5% auto -5%; height: 120%;
  z-index: 0; opacity: 0.5; pointer-events: none;
  -webkit-mask-image: radial-gradient(80% 75% at 50% 35%, #000 0%, transparent 78%);
  mask-image: radial-gradient(80% 75% at 50% 35%, #000 0%, transparent 78%);
}
.hh-veil {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background:
    radial-gradient(90% 60% at 50% 0%, color-mix(in srgb, var(--hue) 10%, transparent), transparent 60%),
    linear-gradient(180deg, transparent 40%, color-mix(in srgb, ${viz.void} 55%, transparent) 100%);
}
.hh-inner {
  position: relative; z-index: 2;
  max-width: 80rem; margin: 0 auto; padding: 0 clamp(20px, 5vw, 40px);
}
.hh-kicker {
  font-family: ${FONT.mono}; font-size: 12px; letter-spacing: 0.28em;
  text-transform: uppercase; color: var(--hue); margin: 0 0 18px;
  display: inline-flex; align-items: center; gap: 12px;
}
.hh-kicker::before { content: ''; width: 28px; height: 1px; background: var(--hue); opacity: .6; }
.hh-title {
  font-family: ${FONT.display}; font-weight: 400;
  font-size: clamp(40px, 7vw, 84px); line-height: 0.98; letter-spacing: -0.025em;
  margin: 0; max-width: 18ch; color: ${viz.ink};
}
.hh-title em { font-style: italic; color: var(--hue); }
.hh-lead {
  font-size: clamp(15px, 2vw, 19px); line-height: 1.6; color: ${viz.muted};
  max-width: 56ch; margin: 22px 0 0;
}
.hh-stats {
  display: flex; flex-wrap: wrap; gap: clamp(20px, 4vw, 48px); margin-top: 34px;
}
@media (max-width: 640px) {
  /* Below the point where 4 stats fit one flex row, an odd count (our hero
     rails run 4) leaves one item orphaned alone on its own line — a
     deliberate 2-column grid reads as designed instead of accidental wrap. */
  .hh-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px 16px; }
}
.hh-stat { display: flex; flex-direction: column; gap: 4px; }
.hh-stat .v {
  font-family: ${FONT.display}; font-size: clamp(28px, 4vw, 42px); font-weight: 500;
  line-height: 1; letter-spacing: -0.02em; color: var(--hue);
}
.hh-stat .k {
  font-family: ${FONT.mono}; font-size: 10.5px; letter-spacing: 0.16em;
  text-transform: uppercase; color: ${viz.faint};
}
.hh-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 36px; }
.hh-cta {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 24px; border-radius: 999px; text-decoration: none;
  font-weight: 600; font-size: 15px;
  background: linear-gradient(135deg, var(--hue), color-mix(in srgb, var(--hue) 55%, ${viz.indigo}));
  color: #050710; box-shadow: 0 0 30px color-mix(in srgb, var(--hue) 35%, transparent);
  transition: transform .2s ease, box-shadow .2s ease;
}
.hh-cta:hover { transform: translateY(-1px); box-shadow: 0 0 42px color-mix(in srgb, var(--hue) 50%, transparent); }
.hh-cta .arr { transition: transform .2s ease; }
.hh-cta:hover .arr { transform: translateX(4px); }
.hh-cta.ghost {
  background: transparent; color: ${viz.ink};
  border: 1px solid ${viz.line}; box-shadow: none;
}
.hh-cta.ghost:hover { border-color: var(--hue); }
`;
}
