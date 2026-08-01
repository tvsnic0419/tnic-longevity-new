"use client";

import { MoleculeStage } from "./MoleculeStage";
import { hasGeometry, getGeometry } from "./molecule";
import { FONT, paletteFor, tierColor, signatureHue, type RGB } from "./tokens";
import { useTheme } from "@/components/theme/ThemeProvider";

// ─────────────────────────────────────────────────────────────────────────────
// CompoundHero — a "mini-Descent" overture band for every compound page.
// Composes the shared MoleculeStage with an editorial header, evidence
// medallion, mechanism hook, and a fact rail built entirely from real fields
// in lib/data.ts. The compound's large cover name is decorative (aria-hidden)
// — the page's semantic <h1> still lives in LibraryModuleDetail below.
//
// Theme-aware: reads the site's resolved dark/light theme and swaps in the
// matching palette from viz/tokens (paletteFor) rather than only ever
// rendering the dark "evidence-noir" look.
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

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : text).trim();
}

export function CompoundHero(data: CompoundHeroData) {
  const { resolved } = useTheme();
  const { viz, hues } = paletteFor(resolved);
  const hue = signatureHue(data.id, hues);
  const hueCss = `rgb(${hue[0]},${hue[1]},${hue[2]})`;
  const structured = hasGeometry(data.id);
  const geom = structured ? getGeometry(data.id) : null;
  const tint = tierColor(data.evidence, viz);

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

  return (
    <div className="tnic-chero" style={{ "--hue": hueCss } as React.CSSProperties}>
      <style>{cheroCss(viz)}</style>

      <div className="chero-grid">
        <div className="chero-stage-wrap">
          <div className="chero-stage">
            <MoleculeStage geometryId={structured ? data.id : undefined} hue={hue as RGB} />
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

function cheroCss(viz: { ink: string; muted: string; faint: string; line: string; panel: string; panel2: string }) {
  return `
.tnic-chero {
  position: relative;
  max-width: 80rem; margin: 0 auto; padding: clamp(20px, 4vw, 40px) 24px 8px;
  font-family: ${FONT.sans};
  color: ${viz.ink};
  -webkit-font-smoothing: antialiased;
}
.tnic-chero * { box-sizing: border-box; }
.chero-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(20px, 4vw, 44px); align-items: center; }
@media (max-width: 860px) { .chero-grid { grid-template-columns: 1fr; } }

.chero-stage-wrap { display: flex; flex-direction: column; gap: 10px; }
.chero-stage {
  position: relative; width: 100%; aspect-ratio: 16/11; border-radius: 20px; overflow: hidden;
  border: 1px solid ${viz.line};
  background:
    radial-gradient(100% 100% at 30% 20%, color-mix(in srgb, var(--hue) 14%, transparent), transparent 60%),
    radial-gradient(100% 100% at 80% 90%, color-mix(in srgb, var(--hue) 8%, transparent), transparent 60%),
    linear-gradient(180deg, color-mix(in srgb, ${viz.panel2} 88%, transparent), color-mix(in srgb, ${viz.panel} 96%, transparent));
}
.chero-hint {
  position: absolute; bottom: 12px; right: 14px;
  font-family: ${FONT.mono}; font-size: 11px; color: ${viz.faint}; letter-spacing: .06em;
  display: flex; align-items: center; gap: 7px; pointer-events: none;
}
.chero-hint .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--hue); box-shadow: 0 0 10px var(--hue); }
.chero-cap { font-family: ${FONT.mono}; font-size: 11px; color: ${viz.faint}; letter-spacing: .03em; line-height: 1.5; margin: 0; }

.chero-body { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.chero-kicker {
  font-family: ${FONT.mono}; font-size: 12px; letter-spacing: .26em; text-transform: uppercase;
  color: var(--hue); margin: 0; display: inline-flex; align-items: center; gap: 12px;
}
.chero-kicker::before { content: ''; width: 26px; height: 1px; background: var(--hue); opacity: .6; }
.chero-name {
  font-family: ${FONT.display}; font-weight: 400; font-size: clamp(38px, 6.5vw, 76px);
  line-height: 0.98; letter-spacing: -0.025em; color: ${viz.ink}; margin: 2px 0;
}
.chero-medallion {
  display: inline-flex; align-items: center; gap: 9px; align-self: flex-start;
  font-family: ${FONT.mono}; font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  padding: 7px 14px; border: 1px solid; border-radius: 999px;
}
.chero-medallion .ring { width: 8px; height: 8px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }
.chero-mech { font-size: clamp(15px, 1.9vw, 18px); line-height: 1.6; color: ${viz.muted}; margin: 4px 0 0; max-width: 52ch; }

.chero-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px; }
@media (max-width: 520px) { .chero-facts { grid-template-columns: repeat(2, 1fr); } }
.chero-fact {
  display: flex; flex-direction: column; gap: 4px; padding: 12px 14px;
  background: linear-gradient(180deg, color-mix(in srgb, ${viz.panel2} 75%, transparent), color-mix(in srgb, ${viz.panel2} 70%, transparent));
  border: 1px solid ${viz.line}; border-radius: 12px;
}
.chero-fact .k { font-family: ${FONT.mono}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: ${viz.faint}; }
.chero-fact .v { font-size: 14px; color: ${viz.ink}; font-weight: 500; }

.chero-hallmarks { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 6px; }
.chero-hallmarks .lbl { font-family: ${FONT.mono}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: ${viz.faint}; margin-right: 4px; }
.chero-hallmarks .chip {
  font-size: 12px; color: ${viz.muted}; padding: 5px 11px; border-radius: 999px;
  border: 1px solid ${viz.line}; background: color-mix(in srgb, ${viz.panel2} 60%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .chero-hint .dot { box-shadow: none; }
}
`;
}
