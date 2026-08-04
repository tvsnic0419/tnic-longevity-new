"use client";

import { MoleculeStage } from "./MoleculeStage";
import { hasGeometry, getGeometry } from "./molecule";
import { VIZ, FONT, tierColor, signatureHue } from "./tokens";

// ─────────────────────────────────────────────────────────────────────────────
// ModuleHero — the overture band for "library-only" compound pages (the 28
// compounds with no lib/data.ts entry, so no CompoundHero). It gives them the
// same cinematic opener as the 27 stack-buildable compounds, but its fact rail
// is built only from fields a library module actually has (evidence tier, live
// PMID count, hallmarks) — nothing renders empty, and nothing is fabricated.
// The large cover name is decorative (aria-hidden); the semantic <h1> still
// lives in LibraryModuleDetail below.
// ─────────────────────────────────────────────────────────────────────────────

export type ModuleHeroData = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  evidenceTier: string;
  studyCount: number;
  hallmarks: string[];
};

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : text).trim();
}

export function ModuleHero(data: ModuleHeroData) {
  const hue = signatureHue(data.id);
  const hueCss = `rgb(${hue[0]},${hue[1]},${hue[2]})`;
  const structured = hasGeometry(data.id);
  const geom = structured ? getGeometry(data.id) : null;
  const tint = tierColor(data.evidenceTier);

  // Drop the "Studies" tile when the body cites none, rather than show a hollow
  // "0 cited". The fact rail's column count follows the number of tiles so the
  // grid never leaves an empty cell.
  const facts: Array<{ k: string; v: string }> = [
    { k: "Evidence", v: `Tier ${data.evidenceTier}` },
    ...(data.studyCount > 0 ? [{ k: "Studies", v: `${data.studyCount} cited` }] : []),
    ...(data.hallmarks.length > 0 ? [{ k: "Hallmarks", v: `${data.hallmarks.length} targeted` }] : []),
  ];

  return (
    <div className="tnic-mhero" style={{ "--hue": hueCss } as React.CSSProperties}>
      <style>{MHERO_CSS}</style>

      <div className="mhero-grid">
        <div className="mhero-stage-wrap">
          <div className="mhero-stage">
            <MoleculeStage geometryId={structured ? data.id : undefined} hue={hue} />
            <div className="mhero-hint">
              <span className="dot" />
              {structured ? "drag · scroll to zoom" : "orbital field · illustrative"}
            </div>
          </div>
          <p className="mhero-cap">
            {structured
              ? `Rendered structure${geom?.label ? ` · ${geom.label}` : ""} · stylized for legibility, not a crystallographic reproduction`
              : "Illustrative orbital motif — not the literal molecular structure. See the deep-dive below for the mechanism."}
          </p>
        </div>

        <div className="mhero-body">
          <p className="mhero-kicker">{data.kicker}</p>
          <div className="mhero-name" aria-hidden="true">{data.title}</div>
          <div className="mhero-medallion" style={{ color: tint, borderColor: tint }}>
            <span className="ring" /> Evidence Tier {data.evidenceTier}
          </div>
          {data.summary && <p className="mhero-mech">{firstSentence(data.summary)}</p>}

          <div
            className="mhero-facts"
            style={{ gridTemplateColumns: `repeat(${facts.length}, minmax(0, 1fr))` }}
          >
            {facts.map((f) => (
              <div className="mhero-fact" key={f.k}>
                <span className="k">{f.k}</span>
                <span className="v">{f.v}</span>
              </div>
            ))}
          </div>

          {data.hallmarks.length > 0 && (
            <div className="mhero-hallmarks">
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

const MHERO_CSS = `
.tnic-mhero {
  position: relative;
  max-width: 80rem; margin: 0 auto; padding: clamp(20px, 4vw, 40px) 24px 8px;
  font-family: ${FONT.sans};
  color: ${VIZ.ink};
  -webkit-font-smoothing: antialiased;
}
.tnic-mhero * { box-sizing: border-box; }
.mhero-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(20px, 4vw, 44px); align-items: center; }
@media (max-width: 860px) { .mhero-grid { grid-template-columns: 1fr; } }

.mhero-stage-wrap { display: flex; flex-direction: column; gap: 10px; }
.mhero-stage {
  position: relative; width: 100%; aspect-ratio: 16/11; border-radius: 20px; overflow: hidden;
  border: 1px solid ${VIZ.line};
  background:
    radial-gradient(100% 100% at 30% 20%, color-mix(in srgb, var(--hue) 14%, transparent), transparent 60%),
    radial-gradient(100% 100% at 80% 90%, rgba(140,140,245,0.06), transparent 60%),
    linear-gradient(180deg, rgba(14,20,38,0.6), rgba(10,14,30,0.9));
}
.mhero-hint {
  position: absolute; bottom: 12px; right: 14px;
  font-family: ${FONT.mono}; font-size: 11px; color: ${VIZ.faint}; letter-spacing: .06em;
  display: flex; align-items: center; gap: 7px; pointer-events: none;
}
.mhero-hint .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--hue); box-shadow: 0 0 10px var(--hue); }
.mhero-cap { font-family: ${FONT.mono}; font-size: 11px; color: ${VIZ.faint}; letter-spacing: .03em; line-height: 1.5; margin: 0; }

.mhero-body { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.mhero-kicker {
  font-family: ${FONT.mono}; font-size: 12px; letter-spacing: .26em; text-transform: uppercase;
  color: var(--hue); margin: 0; display: inline-flex; align-items: center; gap: 12px;
}
.mhero-kicker::before { content: ''; width: 26px; height: 1px; background: var(--hue); opacity: .6; }
.mhero-name {
  font-family: ${FONT.display}; font-weight: 400; font-size: clamp(34px, 5.5vw, 72px);
  line-height: 1.0; letter-spacing: -0.025em; color: ${VIZ.ink}; margin: 2px 0;
  max-width: 100%; overflow-wrap: break-word; word-break: break-word; hyphens: auto; text-wrap: balance;
}
.mhero-medallion {
  display: inline-flex; align-items: center; gap: 9px; align-self: flex-start;
  font-family: ${FONT.mono}; font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  padding: 7px 14px; border: 1px solid; border-radius: 999px;
}
.mhero-medallion .ring { width: 8px; height: 8px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }
.mhero-mech { font-size: clamp(15px, 1.9vw, 18px); line-height: 1.6; color: ${VIZ.muted}; margin: 4px 0 0; max-width: 52ch; }

.mhero-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px; }
@media (max-width: 520px) { .mhero-facts { grid-template-columns: repeat(3, 1fr); } }
.mhero-fact {
  display: flex; flex-direction: column; gap: 4px; padding: 12px 14px;
  background: linear-gradient(180deg, rgba(19,26,48,0.7), rgba(14,20,38,0.7));
  border: 1px solid ${VIZ.line}; border-radius: 12px;
}
.mhero-fact .k { font-family: ${FONT.mono}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: ${VIZ.faint}; }
.mhero-fact .v { font-size: 14px; color: ${VIZ.ink}; font-weight: 500; }

.mhero-hallmarks { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 6px; }
.mhero-hallmarks .lbl { font-family: ${FONT.mono}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: ${VIZ.faint}; margin-right: 4px; }
.mhero-hallmarks .chip {
  font-size: 12px; color: ${VIZ.muted}; padding: 5px 11px; border-radius: 999px;
  border: 1px solid ${VIZ.line}; background: rgba(14,20,38,0.5);
}

@media (prefers-reduced-motion: reduce) {
  .mhero-hint .dot { box-shadow: none; }
}
`;
