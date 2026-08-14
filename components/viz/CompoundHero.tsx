"use client";

import { VIZ, FONT, tierColor, signatureHue } from "./tokens";
import type { CompoundRetailProduct } from "@/lib/compound-products";

// ─────────────────────────────────────────────────────────────────────────────
// CompoundHero — a "mini-Descent" overture band for every compound page.
// The left column is a real "where to buy" list (top retail products for this
// compound, verified pick first) — the earlier orbital motif was illustrative,
// not a real structure, so it was replaced with something useful. The right
// column keeps the editorial header, evidence medallion, mechanism hook, and a
// fact rail built entirely from real fields in lib/data.ts. The compound's large
// cover name is decorative (aria-hidden) — the page's semantic <h1> still lives
// in LibraryModuleDetail below.
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
  /** Real retail products for this compound (verified pick first). */
  products?: CompoundRetailProduct[];
};

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : text).trim();
}

export function CompoundHero(data: CompoundHeroData) {
  const hue = signatureHue(data.id);
  const hueCss = `rgb(${hue[0]},${hue[1]},${hue[2]})`;
  const tint = tierColor(data.evidence);
  const products = data.products ?? [];

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
        <div className="chero-buy">
          <div className="chero-buy-head">
            <span className="lbl">Where to buy · {data.name}</span>
            <a className="all" href="/products">TNiC Verified →</a>
          </div>
          {products.length > 0 ? (
            <>
              <ul className="chero-plist">
                {products.map((p, i) => (
                  <li key={`${p.brand}-${p.product}`} className={p.verified ? "is-verified" : ""}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                    >
                      <span className="rank" aria-hidden="true">{p.verified ? "✓" : i + 1}</span>
                      <span className="pmain">
                        <span className="pbrand">
                          {p.brand}
                          {p.verified && <em className="vbadge">TNiC pick</em>}
                        </span>
                        <span className="pname">
                          {p.product}
                          {p.dose ? <span className="pdose"> · {p.dose}</span> : null}
                        </span>
                        {p.note ? <span className="pnote">{p.note}</span> : null}
                      </span>
                      <span className="parrow" aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="chero-cap">
                Real retail options from reputable brands — confirm the current formulation and its
                third-party COA before buying. No brand pays for placement.
              </p>
            </>
          ) : (
            <div className="chero-buy-empty">
              <p>No verified retail pick published yet for {data.name}.</p>
              <a href="/products">Browse TNiC Verified →</a>
            </div>
          )}
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
.chero-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(20px, 4vw, 44px); align-items: start; }
@media (max-width: 860px) { .chero-grid { grid-template-columns: 1fr; } }

/* Left column — real "where to buy" list (replaces the old illustrative motif). */
.chero-buy { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.chero-buy-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.chero-buy-head .lbl {
  font-family: ${FONT.mono}; font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  color: ${VIZ.faint}; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.chero-buy-head .all {
  font-family: ${FONT.mono}; font-size: 11px; letter-spacing: .04em; color: var(--hue);
  text-decoration: none; white-space: nowrap; opacity: .9; transition: opacity .2s ease;
}
.chero-buy-head .all:hover { opacity: 1; }

.chero-plist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.chero-plist li { margin: 0; }
.chero-plist a {
  display: grid; grid-template-columns: 26px 1fr auto; align-items: center; gap: 12px;
  padding: 11px 13px; border-radius: 13px; text-decoration: none;
  background: linear-gradient(180deg, rgba(19,26,48,0.55), rgba(14,20,38,0.55));
  border: 1px solid ${VIZ.line};
  transition: border-color .22s ease, transform .22s ease, background .22s ease;
}
.chero-plist a:hover {
  border-color: color-mix(in srgb, var(--hue) 42%, transparent);
  transform: translateY(-1px);
  background: linear-gradient(180deg, rgba(24,32,58,0.7), rgba(16,22,42,0.7));
}
.chero-plist a:focus-visible { outline: 2px solid color-mix(in srgb, var(--hue) 70%, transparent); outline-offset: 2px; }
.chero-plist .rank {
  display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px;
  border-radius: 999px; font-family: ${FONT.mono}; font-size: 12px; font-weight: 600;
  color: ${VIZ.muted}; background: rgba(255,255,255,0.05); border: 1px solid ${VIZ.line};
}
.chero-plist li.is-verified .rank {
  color: #051018; background: var(--hue); border-color: transparent;
  box-shadow: 0 0 12px -2px var(--hue);
}
.chero-plist li.is-verified a { border-color: color-mix(in srgb, var(--hue) 34%, transparent); }
.chero-plist .pmain { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.chero-plist .pbrand {
  display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap;
  font-size: 14px; font-weight: 600; color: ${VIZ.ink}; line-height: 1.2;
}
.chero-plist .vbadge {
  font-family: ${FONT.mono}; font-style: normal; font-size: 9px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--hue); border: 1px solid color-mix(in srgb, var(--hue) 45%, transparent);
  padding: 1px 6px; border-radius: 999px;
}
.chero-plist .pname { font-size: 12.5px; color: ${VIZ.muted}; line-height: 1.35; overflow-wrap: anywhere; }
.chero-plist .pdose { color: ${VIZ.faint}; }
.chero-plist .pnote { font-size: 11px; color: ${VIZ.faint}; line-height: 1.4; margin-top: 1px; }
.chero-plist .parrow { color: ${VIZ.faint}; font-size: 14px; transition: transform .22s ease, color .22s ease; }
.chero-plist a:hover .parrow { color: var(--hue); transform: translate(2px, -2px); }

.chero-buy-empty {
  display: flex; flex-direction: column; gap: 8px; align-items: flex-start;
  padding: 20px; border-radius: 14px; border: 1px dashed ${VIZ.line};
}
.chero-buy-empty p { margin: 0; font-size: 14px; color: ${VIZ.muted}; }
.chero-buy-empty a { font-family: ${FONT.mono}; font-size: 12px; color: var(--hue); text-decoration: none; }

.chero-cap { font-family: ${FONT.mono}; font-size: 11px; color: ${VIZ.faint}; letter-spacing: .03em; line-height: 1.5; margin: 2px 0 0; }

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
  display: inline-flex; align-items: center; gap: 9px; align-self: flex-start;
  font-family: ${FONT.mono}; font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  padding: 7px 14px; border: 1px solid; border-radius: 999px;
}
.chero-medallion .ring { width: 8px; height: 8px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }
.chero-mech { font-size: clamp(15px, 1.9vw, 18px); line-height: 1.6; color: ${VIZ.muted}; margin: 4px 0 0; max-width: 52ch; }

.chero-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px; }
@media (max-width: 520px) { .chero-facts { grid-template-columns: repeat(2, 1fr); } }
.chero-fact {
  display: flex; flex-direction: column; gap: 4px; padding: 12px 14px;
  background: linear-gradient(180deg, rgba(19,26,48,0.7), rgba(14,20,38,0.7));
  border: 1px solid ${VIZ.line}; border-radius: 12px;
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
  .chero-plist a:hover { transform: none; }
  .chero-plist a:hover .parrow { transform: none; }
}
`;
