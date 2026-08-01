"use client";

import { MoleculeStage } from "./MoleculeStage";
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
  formula?: string;
  molarMass?: string;
  chemFamily?: string;
  halfLife?: string;
  firstIsolated?: string;
  studyCount: number;
  synergyCount: number;
  hallmarks: string[];
};

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

  const facts: Array<{ k: string; v: string }> = [
    { k: "Evidence", v: `Tier ${data.evidence}` },
    { k: "Studies", v: `${data.studyCount} cited` },
    { k: "Dose", v: data.dose },
    { k: "Timing", v: data.timing },
  ];
  if (typeof data.bioavailability === "number") {
    facts.push({ k: "Oral bioavail.", v: `${data.bioavailability}%` });
  }
  facts.push({ k: "Synergies", v: `${data.synergyCount} mapped` });
  if (data.formula) facts.push({ k: "Formula", v: data.formula });
  if (data.molarMass) facts.push({ k: "Molar mass", v: data.molarMass });
  if (data.chemFamily) facts.push({ k: "Family", v: data.chemFamily });
  if (data.halfLife) facts.push({ k: "Half-life", v: data.halfLife });
  if (data.firstIsolated) facts.push({ k: "First isolated", v: data.firstIsolated });

  return (
    <div className="tnic-chero" style={{ "--hue": hueCss } as React.CSSProperties}>
      <style>{CHERO_CSS}</style>

      <div className="chero-grid">
        <div className="chero-stage-wrap">
          <div className="chero-stage">
            <MoleculeStage geometryId={structured ? data.id : undefined} hue={hue} />
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
            <span className="ring" /> Evidence Tier {data.evidence}
          </div>
          <p className="chero-mech">{firstSentence(data.mechanism)}</p>

          <div className="chero-facts">
            {facts.map((f) => (
              <div className="chero-fact" key={f.k}>
                <span className="k">{f.k}</span>
                <span className="v">{f.v}</span>
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
    linear-gradient(180deg, rgba(14,20,38,0.6), rgba(10,14,30,0.9));
  /* Deep Glass content-plane shadow (app/globals.css "Design System v8") — this
     is the hero glass moment of every compound page, so it earns the deepest
     stacked contact+lift+ambient shadow instead of a flat 1px border. */
  box-shadow: var(--glass-shadow-content, 0 20px 60px -20px rgba(0,0,0,0.55));
}
.chero-stage::before {
  content: '';
  position: absolute; inset: 0; z-index: 1; border-radius: inherit; padding: 1px;
  background: linear-gradient(
    135deg,
    var(--glass-edge-specular, rgba(255,255,255,0.35)) 0%,
    var(--glass-edge-cool, rgba(150,210,255,0.16)) 14%,
    transparent 42%, transparent 58%,
    var(--glass-edge-warm, rgba(255,185,130,0.1)) 86%,
    var(--glass-edge-shadow, rgba(0,0,0,0.4)) 100%
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
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
  font-family: ${FONT.display}; font-weight: 400; font-size: clamp(38px, 6.5vw, 76px);
  line-height: 0.98; letter-spacing: -0.025em; color: ${VIZ.ink}; margin: 2px 0;
}
.chero-medallion {
  display: inline-flex; align-items: center; gap: 9px; align-self: flex-start;
  font-family: ${FONT.mono}; font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  padding: 7px 14px; border: 1px solid; border-radius: 999px;
}
.chero-medallion .ring { width: 8px; height: 8px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }
.chero-mech { font-size: clamp(15px, 1.9vw, 18px); line-height: 1.6; color: ${VIZ.muted}; margin: 4px 0 0; max-width: 52ch; }

.chero-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px; }
@media (max-width: 520px) { .chero-facts { grid-template-columns: repeat(2, 1fr); } }
.chero-fact {
  position: relative;
  display: flex; flex-direction: column; gap: 4px; padding: 12px 14px;
  background: linear-gradient(180deg, rgba(19,26,48,0.7), rgba(14,20,38,0.7));
  border: 1px solid ${VIZ.line}; border-radius: 12px;
  /* Deep Glass mid-plane shadow — matches .card-elevated/.card-premium
     elsewhere on the site instead of a flat one-off border. */
  box-shadow: var(--glass-shadow-mid, 0 8px 20px -10px rgba(0,0,0,0.32));
  overflow: hidden;
}
.chero-fact::before {
  content: '';
  position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(
    135deg,
    var(--glass-edge-specular, rgba(255,255,255,0.3)) 0%,
    transparent 50%,
    var(--glass-edge-shadow, rgba(0,0,0,0.35)) 100%
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.chero-fact .k { font-family: ${FONT.mono}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: ${VIZ.faint}; }
.chero-fact .v { font-size: 14px; color: ${VIZ.ink}; font-weight: 500; }

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
