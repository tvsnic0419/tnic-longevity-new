import Link from 'next/link';
import { TIER_COLOR_VAR } from '@/lib/trust';
import { ExternalLink, ShieldCheck, FlaskConical, AlertTriangle } from 'lucide-react';
import {
  subscoresOf,
  overallOf,
  DEFAULT_WEIGHTS,
  PATHWAY_LABELS,
  HALLMARK_MAP,
  pubmedUrl,
  type Compound,
  type StagedItem,
  type Subscores,
  type Tier,
} from '@/lib/compound-engine-data';

// Performance gradient for a 0–100 score, drawn from the site's canonical,
// theme-aware accent tokens (not the engine's component-scoped --sie-* vars):
// strong = emerald, solid = cyan, moderate = amber, weak = rose.
function perfColor(v: number): string {
  return v >= 78 ? 'var(--accent-emerald)' : v >= 60 ? 'var(--accent-cyan)' : v >= 42 ? 'var(--accent-amber)' : 'var(--accent-rose)';
}
// Canonical evidence-tier accent — matches EvidenceTag / lib/trust.ts.
/* A/B/C come from the canonical map; D is local to this matrix (it grades a
   fourth bucket the site-wide tier scale doesn't have). */
const TIER_ACCENT: Record<Tier, string> = {
  ...TIER_COLOR_VAR,
  D: 'var(--accent-rose)',
};

// ─────────────────────────────────────────────────────────────────────────────
// CompoundIntelligenceMatrix — a dense, quantitative intelligence panel for the
// compound deep-dive. Everything here is REAL curated data from the engine's
// mechanistic library (lib/compound-engine-data.ts): the five scored analytic
// dimensions, the composite Longevity Quotient, mechanistic pathway coverage,
// hallmark coverage, and the practical caveat flags. Server-only so the engine
// dataset never enters a client bundle. No invented figures.
// ─────────────────────────────────────────────────────────────────────────────

const DIMENSIONS: { key: keyof Subscores; label: string; hint: string }[] = [
  { key: 'evidence', label: 'Clinical evidence', hint: 'RCT quality, human trial depth, study count' },
  { key: 'effect', label: 'Effect size', hint: 'Magnitude of the measured benefit' },
  { key: 'breadth', label: 'Mechanistic breadth', hint: 'How many aging pathways it engages' },
  { key: 'bioavail', label: 'Bioavailability', hint: 'Absorption in a standard oral form' },
  { key: 'safety', label: 'Safety profile', hint: 'Tolerability and adverse-event rate' },
];

function ScoreMeter({ label, hint, value }: { label: string; hint: string; value: number }) {
  const bar = perfColor(value);
  const ink = bar;
  return (
    <div className="cim-row" role="group" aria-label={`${label}: ${value} out of 100`}>
      <div className="cim-row-head">
        <span className="cim-row-label" title={hint}>{label}</span>
        <span className="cim-row-value" style={{ color: ink }}>{value}</span>
      </div>
      <div className="cim-track" aria-hidden="true">
        <div className="cim-fill" style={{ width: `${value}%`, background: bar, boxShadow: `0 0 10px -2px ${bar}` }} />
      </div>
    </div>
  );
}

export function CompoundIntelligenceMatrix({ compound }: { compound: Compound }) {
  const c = compound;
  const staged: StagedItem = {
    uid: c.id,
    data: c,
    name: c.name,
    brand: '',
    dose: c.dose,
    form: 'std',
    source: 'curated',
  };
  const subs = subscoresOf(staged);
  const overall = overallOf(subs, DEFAULT_WEIGHTS);
  const tColor = TIER_ACCENT[c.tier];
  const tInk = tColor;
  const oColor = perfColor(overall);
  const oInk = oColor;

  const pathways = c.pathways.map((p) => PATHWAY_LABELS[p]).filter(Boolean);
  const hallmarks = c.hallmarks.map((h) => HALLMARK_MAP[h]).filter(Boolean);

  return (
    <section className="container-page py-6 md:py-8" aria-label="Compound intelligence matrix">
      <div className="premium-card cim" style={{ ['--card-accent' as string]: oColor }}>
        <style>{CIM_CSS}</style>

        {/* Header — identity + composite Longevity Quotient */}
        <div className="cim-head">
          <div className="cim-id">
            <p className="cim-eyebrow">Compound Intelligence Matrix</p>
            <h2 className="cim-name">{c.full}</h2>
            <div className="cim-meta">
              <span className="cim-chip">{c.cls}</span>
              <span className="cim-chip cim-tier" style={{ color: tInk, borderColor: `color-mix(in srgb, ${tColor} 45%, transparent)` }}>
                Tier {c.tier}
              </span>
              {c.rct && (
                <span className="cim-chip cim-rct">
                  <ShieldCheck className="cim-chip-ic" aria-hidden="true" /> RCT-backed
                </span>
              )}
              <span className="cim-chip">
                <FlaskConical className="cim-chip-ic" aria-hidden="true" />
                {c.studies.toLocaleString()} studies indexed
              </span>
            </div>
          </div>
          <div className="cim-lq" role="group" aria-label={`Longevity Quotient ${overall} out of 100`}>
            <span className="cim-lq-num" style={{ color: oInk }}>{overall}</span>
            <span className="cim-lq-cap">Longevity&nbsp;Quotient</span>
          </div>
        </div>

        {/* The five scored dimensions — the analytic matrix */}
        <div className="cim-grid">
          {DIMENSIONS.map((d) => (
            <ScoreMeter key={d.key} label={d.label} hint={d.hint} value={subs[d.key]} />
          ))}
        </div>

        {/* Coverage — mechanistic pathways + hallmarks engaged */}
        <div className="cim-cover">
          {pathways.length > 0 && (
            <div className="cim-cover-block">
              <p className="cim-cover-label">Pathways engaged</p>
              <div className="cim-tags">
                {pathways.map((p) => (
                  <span key={p} className="cim-tag cim-tag-path">{p}</span>
                ))}
              </div>
            </div>
          )}
          {hallmarks.length > 0 && (
            <div className="cim-cover-block">
              <p className="cim-cover-label">Hallmarks targeted · {hallmarks.length}/12</p>
              <div className="cim-tags">
                {hallmarks.map((h) => (
                  <span key={h.id} className="cim-tag" title={h.blurb}>
                    <span className="cim-tag-short">{h.short}</span>{h.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Practical intelligence — the caveat flags */}
        {c.flags.length > 0 && (
          <div className="cim-flags">
            <p className="cim-cover-label">
              <AlertTriangle className="cim-chip-ic" aria-hidden="true" /> Practical flags
            </p>
            <ul className="cim-flag-list">
              {c.flags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="cim-foot">
          <span>Scores are TNiC’s deterministic synthesis of the cited human evidence — a comparison tool, not a medical claim.</span>
          <Link href={pubmedUrl(c.name)} target="_blank" rel="noopener noreferrer" className="cim-pubmed focus-ring">
            PubMed <ExternalLink className="cim-chip-ic" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const CIM_CSS = `
.cim { gap: 0; padding: clamp(20px, 3vw, 30px); }
.cim-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 20px; }
.cim-eyebrow {
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 11px; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--color-text-muted); margin: 0 0 8px;
}
.cim-name {
  font-family: var(--font-display, Fraunces, serif); font-weight: 500;
  font-size: clamp(22px, 3vw, 30px); line-height: 1.05; letter-spacing: -0.02em;
  color: var(--color-text-primary); margin: 0 0 12px;
}
.cim-meta { display: flex; flex-wrap: wrap; gap: 8px; }
.cim-chip {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 11px; letter-spacing: 0.02em;
  color: var(--color-text-secondary); padding: 4px 10px; border-radius: 999px;
  border: 1px solid var(--color-border-subtle); background: var(--color-bg-muted);
}
.cim-chip-ic { width: 13px; height: 13px; }
.cim-rct { color: var(--accent-emerald); border-color: color-mix(in srgb, var(--accent-emerald) 40%, transparent); }
.cim-lq {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 110px; padding: 10px 18px; border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--card-accent) 35%, transparent);
  background: radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--card-accent) 12%, transparent), transparent 70%);
}
.cim-lq-num { font-family: var(--font-display, Fraunces, serif); font-weight: 600; font-size: 44px; line-height: 0.9; letter-spacing: -0.03em; }
.cim-lq-cap { font-family: var(--font-mono, ui-monospace, monospace); font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--color-text-faint); margin-top: 6px; }

.cim-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 32px; margin-top: 24px; padding-top: 24px;
  border-top: 1px solid var(--color-border-subtle);
}
@media (max-width: 640px) { .cim-grid { grid-template-columns: 1fr; } }
.cim-row { display: flex; flex-direction: column; gap: 6px; }
.cim-row-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.cim-row-label { font-size: 13px; color: var(--color-text-secondary); }
.cim-row-value { font-family: var(--font-mono, ui-monospace, monospace); font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; }
.cim-track { height: 8px; border-radius: 999px; background: color-mix(in srgb, var(--color-text-primary) 8%, transparent); overflow: hidden; }
.cim-fill { height: 100%; border-radius: 999px; min-width: 3px; }

.cim-cover { display: grid; grid-template-columns: 1fr; gap: 18px; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-border-subtle); }
.cim-cover-label {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 10.5px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--color-text-faint); margin: 0 0 10px;
}
.cim-tags { display: flex; flex-wrap: wrap; gap: 7px; }
.cim-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--color-text-secondary);
  padding: 5px 11px; border-radius: 999px;
  border: 1px solid var(--color-border-subtle); background: var(--color-bg-muted);
}
.cim-tag-path { color: var(--accent-cyan); border-color: color-mix(in srgb, var(--accent-cyan) 28%, transparent); }
.cim-tag-short {
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 9px; letter-spacing: 0.08em;
  color: var(--color-text-faint); background: var(--color-bg-base); padding: 2px 5px; border-radius: 5px;
}

.cim-flags { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-border-subtle); }
.cim-flag-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.cim-flag-list li {
  position: relative; padding-left: 18px; font-size: 13px; line-height: 1.5; color: var(--color-text-secondary);
}
.cim-flag-list li::before {
  content: ''; position: absolute; left: 4px; top: 8px; width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent-amber); box-shadow: 0 0 8px var(--accent-amber);
}

.cim-foot {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;
  margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--color-border-subtle);
  font-size: 11.5px; line-height: 1.5; color: var(--color-text-faint);
}
.cim-pubmed { display: inline-flex; align-items: center; gap: 5px; color: var(--accent-cyan); text-decoration: none; white-space: nowrap; }
.cim-pubmed:hover { text-decoration: underline; }

@media (prefers-reduced-motion: reduce) { .cim-fill { transition: none; } }
`;
