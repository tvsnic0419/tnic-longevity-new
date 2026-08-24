"use client";

import Link from "next/link";
import { MoleculeStage } from "./MoleculeStage";
import { VIZ, FONT, HUES, type RGB } from "./tokens";

// ─────────────────────────────────────────────────────────────────────────────
// CinematicHubHero — a reusable, Descent-language opening band for hub pages.
// A full-bleed molecular field (via the shared MoleculeStage), an editorial
// Fraunces headline, a live stat rail, and gradient CTAs — all keyed to a hub's
// signature hue so it sits inside the same site-wide camera as everything else.
// Content is real: callers pass stats joined from lib data, never invented.
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
  const rgb: RGB = HUES[hue] ?? HUES.violet;
  const hueCss = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

  return (
    <section className="tnic-hubhero" style={{ "--hue": hueCss } as React.CSSProperties}>
      <style>{HUBHERO_CSS}</style>

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
              <div className="hh-stat stat-instrument" key={s.label}>
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

const HUBHERO_CSS = `
.tnic-hubhero {
  position: relative; isolation: isolate; overflow: hidden;
  padding: clamp(72px, 12vh, 140px) 0 clamp(48px, 8vh, 96px);
  font-family: ${FONT.sans};
  color: ${VIZ.ink};
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
    linear-gradient(180deg, transparent 40%, rgba(5,7,16,0.5) 100%);
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
  margin: 0; max-width: 18ch; color: ${VIZ.ink};
}
.hh-title em { font-style: italic; color: var(--hue); }
.hh-lead {
  font-size: clamp(15px, 2vw, 19px); line-height: 1.6; color: ${VIZ.muted};
  max-width: 56ch; margin: 22px 0 0;
}
.hh-stats {
  display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px;
}
/* Each stat is now an instrument cell — the shared .stat-instrument treatment
   (accent floor bloom + top hairline light-catch, keyed to the hub hue) with
   mono tabular figures — the same instrument-readout language the homepage
   hero uses, in place of the old flat text rail. */
.hh-stat {
  --flair-accent: var(--hue);
  display: flex; flex-direction: column; gap: 6px;
  padding: 13px 18px 15px; border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--hue) 16%, rgba(255,255,255,0.05));
  min-width: 116px;
}
.hh-stat .v {
  font-family: ${FONT.mono}; font-size: clamp(24px, 3vw, 34px); font-weight: 700;
  line-height: 1; letter-spacing: -0.01em; font-variant-numeric: tabular-nums;
  color: var(--hue);
  text-shadow: 0 0 24px color-mix(in srgb, var(--hue) 30%, transparent);
}
.hh-stat .k {
  font-family: ${FONT.mono}; font-size: 10px; letter-spacing: 0.16em;
  text-transform: uppercase; color: ${VIZ.faint};
}
.hh-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 36px; }
.hh-cta {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 24px; border-radius: 999px; text-decoration: none;
  font-weight: 600; font-size: 15px;
  /* Hue-internal sheen (light tint → hue → deeper hue) — a dimensional gradient
     that stays entirely inside the hub's own accent. The prior recipe mixed
     every hue toward mint #6ee7b7, dragging violet/rose/amber CTAs green. */
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--hue) 75%, #ffffff) 0%,
    var(--hue) 50%,
    color-mix(in srgb, var(--hue) 82%, #071019) 100%);
  color: #050a12; box-shadow: 0 0 30px color-mix(in srgb, var(--hue) 35%, transparent);
  transition: transform .2s ease, box-shadow .2s ease;
}
.hh-cta:hover { transform: translateY(-1px); box-shadow: 0 0 42px color-mix(in srgb, var(--hue) 50%, transparent); }
.hh-cta .arr { transition: transform .2s ease; }
.hh-cta:hover .arr { transform: translateX(4px); }
.hh-cta.ghost {
  background: transparent; color: ${VIZ.ink};
  border: 1px solid ${VIZ.line}; box-shadow: none;
}
.hh-cta.ghost:hover { border-color: var(--hue); }

/* Cinematic staggered entrance — the hero elements rise in on load. Gated on
   motion preference; reduced-motion users get the final composed state. */
@media (prefers-reduced-motion: no-preference) {
  .hh-kicker, .hh-title, .hh-lead, .hh-stat, .hh-ctas {
    animation: hh-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .hh-title { animation-delay: 0.05s; }
  .hh-lead  { animation-delay: 0.12s; }
  .hh-stat  { animation-delay: 0.20s; }
  .hh-stat:nth-child(2) { animation-delay: 0.26s; }
  .hh-stat:nth-child(3) { animation-delay: 0.32s; }
  .hh-stat:nth-child(4) { animation-delay: 0.38s; }
  .hh-ctas  { animation-delay: 0.44s; }
}
@keyframes hh-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
