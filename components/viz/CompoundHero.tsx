"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { hasGeometry, getGeometry } from "./molecule";
import { VIZ, FONT, tierColor, signatureHue } from "./tokens";

// ─────────────────────────────────────────────────────────────────────────────
// CompoundHero — a "mini-Descent" overture band for every compound page.
// Composes the shared MoleculeStage with an editorial header, evidence
// medallion, mechanism hook, and a fact rail built entirely from real fields
// in lib/data.ts. The compound's large cover name is decorative (aria-hidden)
// — the page's semantic <h1> still lives in LibraryModuleDetail below.
// ─────────────────────────────────────────────────────────────────────────────

export type CompoundHeroData = {
  id: string;
  name: string;
  pathway: string;
  mechanism: string;
  evidence: string;
  dose: string;
  timing: string;
  bioavailability?: number;
  studyCount: number;
  synergyCount: number;
  hallmarks: string[];
};

const LazyMoleculeStage = dynamic(
  () => import("./MoleculeStage").then((module) => module.MoleculeStage),
  { ssr: false },
);

/**
 * The molecular canvas is an optional visual aid, not the source of the page's
 * evidence or meaning. Delaying its client bundle until the browser is idle
 * keeps the editorial hero responsive while preserving the same reserved space
 * and accessible caption. The 1.2 s timeout protects the enhancement from
 * waiting indefinitely on a busy device.
 */
function DeferredCompoundMoleculeStage({
  geometryId,
  hue,
  ariaLabel,
}: {
  geometryId?: string;
  hue: [number, number, number];
  ariaLabel: string;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const activate = () => setIsReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(activate, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(activate, 300);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return isReady ? (
    <LazyMoleculeStage geometryId={geometryId} hue={hue} ariaLabel={ariaLabel} />
  ) : (
    <div className="chero-stage-placeholder" aria-hidden="true" />
  );
}

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : text).trim();
}

export function CompoundHero(data: CompoundHeroData) {
  const hue = signatureHue(data.id);
  const hueCss = `rgb(${hue[0]},${hue[1]},${hue[2]})`;
  const structured = hasGeometry(data.id);
  const geom = structured ? getGeometry(data.id) : null;
  const tint = tierColor(data.evidence);
  // Canonical evidence signal-strength encoding, shared with EvidenceTag:
  // A = 3 bars (strongest human evidence) · B = 2 · C = 1. A faithful visual
  // encoding of the existing ordinal tier — no new claim, same grading spine.
  const tierLevel = data.evidence === "A" ? 3 : data.evidence === "B" ? 2 : 1;

  const facts: Array<{ k: string; v: string; meter?: number }> = [
    { k: "Evidence", v: `Tier ${data.evidence}` },
    { k: "Studies", v: `${data.studyCount} cited` },
    { k: "Dose", v: data.dose },
    { k: "Timing", v: data.timing },
  ];
  if (typeof data.bioavailability === "number") {
    // Rendered with a gauge (see .chero-meter) so absorption reads as an
    // instrument value, not just a number.
    facts.push({ k: "Oral bioavail.", v: `${data.bioavailability}%`, meter: data.bioavailability });
  }
  facts.push({ k: "Synergies", v: `${data.synergyCount} mapped` });

  return (
    <div className="tnic-chero" style={{ "--hue": hueCss } as React.CSSProperties}>
      <style>{CHERO_CSS}</style>

      <div className="chero-grid">
        <div className="chero-stage-wrap">
          <div className="chero-stage">
            <DeferredCompoundMoleculeStage
              geometryId={structured ? data.id : undefined}
              hue={hue}
              ariaLabel={structured ? `${data.name} molecular structure visualization` : `${data.name} orbital field visualization`}
            />
            <div className="chero-hint">
              <span className="dot" />
              {structured ? "drag · scroll to zoom" : "orbital field · illustrative"}
            </div>
          </div>
          <p className="chero-cap">
            {structured
              ? `Rendered structure${geom?.label ? ` · ${geom.label}` : ""} · stylized for legibility, not a crystallographic reproduction`
              : "Illustrative orbital motif — not the literal molecular structure. See the deep-dive below for the mechanism."}
          </p>
        </div>

        <div className="chero-body">
          <p className="chero-kicker">{data.pathway}</p>
          <div className="chero-name" aria-hidden="true">{data.name}</div>
          <div className="chero-medallion" style={{ color: tint, borderColor: tint }}>
            <span className="chero-tiermeter" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} className={i < tierLevel ? "on" : ""} />
              ))}
            </span>
            Evidence Tier {data.evidence}
          </div>
          <p className="chero-mech">{firstSentence(data.mechanism)}</p>

          <div className="chero-facts">
            {facts.map((f) => (
              <div className="chero-fact" key={f.k}>
                <span className="k">{f.k}</span>
                <span className="v">{f.v}</span>
                {typeof f.meter === "number" && (
                  <span className="chero-meter" aria-hidden="true">
                    <span className="fill" style={{ width: `${Math.max(0, Math.min(100, f.meter))}%` }} />
                  </span>
                )}
              </div>
            ))}
          </div>

          {data.hallmarks.length > 0 && (
            <div className="chero-hallmarks">
              <span className="lbl">Targets</span>
              {data.hallmarks.map((h) => (
                <span className="chip" key={h}>{h}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CHERO_CSS = `
.tnic-chero {
  position: relative;
  max-width: 80rem; margin: 0 auto; padding: clamp(20px, 4vw, 40px) 24px 8px;
  font-family: ${FONT.sans};
  color: ${VIZ.ink};
  -webkit-font-smoothing: antialiased;
}
.tnic-chero * { box-sizing: border-box; }
.chero-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(20px, 4vw, 44px); align-items: center; }
@media (max-width: 860px) { .chero-grid { grid-template-columns: 1fr; } }

.chero-stage-wrap { display: flex; flex-direction: column; gap: 10px; }
.chero-stage {
  position: relative; width: 100%; aspect-ratio: 16/11; border-radius: 20px; overflow: hidden;
  border: 1px solid ${VIZ.line};
  background:
    radial-gradient(100% 100% at 30% 20%, color-mix(in srgb, var(--hue) 14%, transparent), transparent 60%),
    radial-gradient(100% 100% at 80% 90%, rgba(140,140,245,0.06), transparent 60%),
    linear-gradient(rgba(150,170,220,0.05) 1px, transparent 1px) 0 0/38px 38px,
    linear-gradient(90deg, rgba(150,170,220,0.05) 1px, transparent 1px) 0 0/38px 38px,
    linear-gradient(180deg, rgba(14,20,38,0.6), rgba(10,14,30,0.9));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05), inset 0 0 60px -20px rgba(0,0,0,.6);
}
/* Instrument viewport frame — four corner registration brackets that read the
   molecule as a measured field, not a stock illustration. Above the canvas,
   never over the molecule's center. */
.chero-stage::after {
  content: ''; position: absolute; inset: 10px; z-index: 4; pointer-events: none;
  border-radius: 12px;
  background:
    linear-gradient(color-mix(in srgb, var(--hue) 40%, transparent), color-mix(in srgb, var(--hue) 40%, transparent)) 0 0/14px 1px no-repeat,
    linear-gradient(color-mix(in srgb, var(--hue) 40%, transparent), color-mix(in srgb, var(--hue) 40%, transparent)) 0 0/1px 14px no-repeat,
    linear-gradient(color-mix(in srgb, var(--hue) 40%, transparent), color-mix(in srgb, var(--hue) 40%, transparent)) 100% 0/14px 1px no-repeat,
    linear-gradient(color-mix(in srgb, var(--hue) 40%, transparent), color-mix(in srgb, var(--hue) 40%, transparent)) 100% 0/1px 14px no-repeat,
    linear-gradient(color-mix(in srgb, var(--hue) 40%, transparent), color-mix(in srgb, var(--hue) 40%, transparent)) 0 100%/14px 1px no-repeat,
    linear-gradient(color-mix(in srgb, var(--hue) 40%, transparent), color-mix(in srgb, var(--hue) 40%, transparent)) 0 100%/1px 14px no-repeat,
    linear-gradient(color-mix(in srgb, var(--hue) 40%, transparent), color-mix(in srgb, var(--hue) 40%, transparent)) 100% 100%/14px 1px no-repeat,
    linear-gradient(color-mix(in srgb, var(--hue) 40%, transparent), color-mix(in srgb, var(--hue) 40%, transparent)) 100% 100%/1px 14px no-repeat;
  opacity: .6;
}
.chero-stage-placeholder {
  width: 100%; height: 100%;
  background:
    radial-gradient(34% 42% at 48% 48%, color-mix(in srgb, var(--hue) 20%, transparent), transparent 72%),
    radial-gradient(66% 66% at 25% 20%, rgba(140,140,245,0.08), transparent 78%);
}
.chero-hint {
  position: absolute; bottom: 12px; right: 14px;
  font-family: ${FONT.mono}; font-size: 11px; color: ${VIZ.faint}; letter-spacing: .06em;
  display: flex; align-items: center; gap: 7px; pointer-events: none;
}
.chero-hint .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--hue); box-shadow: 0 0 10px var(--hue); }
.chero-cap { font-family: ${FONT.mono}; font-size: 11px; color: ${VIZ.faint}; letter-spacing: .03em; line-height: 1.5; margin: 0; }

.chero-body { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.chero-kicker {
  font-family: ${FONT.mono}; font-size: 12px; letter-spacing: .26em; text-transform: uppercase;
  color: var(--hue); margin: 0; display: inline-flex; align-items: center; gap: 12px;
}
.chero-kicker::before { content: ''; width: 26px; height: 1px; background: var(--hue); opacity: .6; }
.chero-name {
  font-family: ${FONT.display}; font-weight: 400; font-size: clamp(34px, 5.5vw, 72px);
  line-height: 1.0; letter-spacing: -0.025em; color: ${VIZ.ink}; margin: 2px 0;
  max-width: 100%; overflow-wrap: break-word; word-break: break-word; hyphens: auto; text-wrap: balance;
}
.chero-medallion {
  display: inline-flex; align-items: center; gap: 10px; align-self: flex-start;
  font-family: ${FONT.mono}; font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  padding: 7px 14px; border: 1px solid; border-radius: 999px;
  background: color-mix(in srgb, currentColor 8%, transparent);
}
/* Signal-strength meter — three ascending bars filled to the tier level, the
   site's canonical evidence mark (matches EvidenceTag). */
.chero-medallion .chero-tiermeter { display: inline-flex; align-items: flex-end; gap: 2px; height: 12px; }
.chero-medallion .chero-tiermeter span { width: 3px; border-radius: 1px; background: currentColor; opacity: .22; }
.chero-medallion .chero-tiermeter span:nth-child(1) { height: 6px; }
.chero-medallion .chero-tiermeter span:nth-child(2) { height: 9px; }
.chero-medallion .chero-tiermeter span:nth-child(3) { height: 12px; }
.chero-medallion .chero-tiermeter span.on { opacity: 1; box-shadow: 0 0 8px -1px currentColor; }
.chero-mech { font-size: clamp(15px, 1.9vw, 18px); line-height: 1.6; color: ${VIZ.muted}; margin: 4px 0 0; max-width: 52ch; }

.chero-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px; }
@media (max-width: 520px) { .chero-facts { grid-template-columns: repeat(2, 1fr); } }
.chero-fact {
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; gap: 4px; padding: 13px 15px;
  background: linear-gradient(180deg, rgba(19,26,48,0.72), rgba(14,20,38,0.72));
  border: 1px solid ${VIZ.line}; border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 6px 18px -14px rgba(0,0,0,.7);
  transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
}
/* Engineered instrument tells — a hue top light-catch and a corner
   registration tick that reward close inspection without adding noise. */
.chero-fact::before {
  content: ''; position: absolute; inset-inline: 0; top: 0; height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--hue) 42%, transparent), transparent);
  opacity: .55; pointer-events: none;
}
.chero-fact::after {
  content: ''; position: absolute; top: 8px; right: 8px; width: 5px; height: 5px;
  border-top: 1px solid color-mix(in srgb, var(--hue) 55%, transparent);
  border-right: 1px solid color-mix(in srgb, var(--hue) 55%, transparent);
  opacity: .5; pointer-events: none;
}
@media (hover: hover) {
  .chero-fact:hover { border-color: color-mix(in srgb, var(--hue) 32%, ${VIZ.line}); box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 12px 26px -16px color-mix(in srgb, var(--hue) 50%, transparent); }
}
.chero-fact .k { font-family: ${FONT.mono}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: ${VIZ.faint}; }
.chero-fact .v { font-size: 14px; color: ${VIZ.ink}; font-weight: 500; font-variant-numeric: tabular-nums; }
.chero-fact .chero-meter {
  position: relative; height: 3px; margin-top: 3px; border-radius: 999px;
  background: rgba(255,255,255,0.08); overflow: hidden;
}
.chero-fact .chero-meter .fill {
  position: absolute; inset: 0 auto 0 0; border-radius: 999px;
  background: linear-gradient(90deg, var(--hue), color-mix(in srgb, var(--hue) 45%, transparent));
}

.chero-hallmarks { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 6px; }
.chero-hallmarks .lbl { font-family: ${FONT.mono}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: ${VIZ.faint}; margin-right: 4px; }
.chero-hallmarks .chip {
  font-size: 12px; color: ${VIZ.muted}; padding: 5px 11px; border-radius: 999px;
  border: 1px solid ${VIZ.line}; background: rgba(14,20,38,0.5);
}

@media (prefers-reduced-motion: reduce) {
  .chero-hint .dot { box-shadow: none; }
}
`;
