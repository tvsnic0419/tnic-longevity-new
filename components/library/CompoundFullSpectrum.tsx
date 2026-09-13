import Link from 'next/link';
import { FlaskConical, ShieldCheck, ExternalLink, Sparkles, Gauge, Network, Beaker } from 'lucide-react';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { TIER_COLOR_VAR } from '@/lib/trust';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import type { CompoundProfile } from '@/lib/compound-profile';

/**
 * CompoundFullSpectrum — the flagship, state-of-the-art "data package" for a
 * compound deep-dive. It assembles, in one coherent module, everything the site
 * already knows about a compound (via lib/compound-profile.ts): identity and
 * chemical class, the full hallmark-coverage matrix (its "chemical matrix
 * abilities"), molecular pathways engaged, the measured practical profile
 * (bioavailability %, dose, timing), grounded mechanism, synergies, and the
 * PMID-linked evidence spine.
 *
 * Server-rendered — no client hooks — so the whole package ships in the initial
 * HTML (CLAUDE.md §3) and is crawlable/citeable.
 *
 * Honesty contract (NOTES-COMPOUND-LIBRARY.md): it renders only authored data
 * and OMITS what a compound lacks — it never fabricates a magnitude, dose, or
 * PMID, and never renders an absent value as zero. The 0–100 curated magnitudes
 * are deliberately NOT duplicated here: when the engine has scored a compound,
 * the interactive Compound Intelligence Matrix on the same page owns those
 * meters, and this panel instead shows the *measured* bioavailability % from
 * the library — explicitly labelled to keep the rating-vs-percentage distinction
 * the codebase has flagged before.
 */

const ALL_HALLMARKS = [...hallmarkLibrary].sort((a, b) => a.number - b.number);
const pubmedUrl = (pmid: string) => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;

export function CompoundFullSpectrum({
  profile,
  hasMatrix,
}: {
  profile: CompoundProfile;
  /** True when the interactive Compound Intelligence Matrix renders on this page. */
  hasMatrix: boolean;
}) {
  const accent = TIER_COLOR_VAR[profile.tier];
  const engagedIds = new Set(profile.hallmarks.map((h) => h.id));
  const engagedCount = profile.hallmarks.length;
  const hasMeasuredProfile =
    profile.measuredBioavailability !== undefined || Boolean(profile.dose) || Boolean(profile.timing);
  const visibleStudies = profile.studies.slice(0, 8);
  const hiddenStudies = profile.studies.length - visibleStudies.length;

  return (
    <section id="full-spectrum-profile" className="container-page py-6 md:py-8" aria-label={`${profile.name} full-spectrum profile`}>
      <div className="premium-card cfs" style={{ ['--card-accent' as string]: accent }}>
        <style>{CFS_CSS}</style>

        {/* ── Identity ─────────────────────────────────────────────── */}
        <div className="cfs-head">
          <div className="cfs-id">
            <p className="cfs-eyebrow">
              <Sparkles className="cfs-ic" aria-hidden="true" /> Full-Spectrum Profile
            </p>
            {/* The compound name repeats the page <h1> verbatim (both are the
                module title). Rendered as text, not a heading, so the deep-dive
                keeps a single h1-first outline — the <section>'s aria-label still
                names this region for assistive tech. */}
            <p className="cfs-name">{profile.name}</p>
            {profile.fullName && <p className="cfs-full">{profile.fullName}</p>}
            <div className="cfs-meta">
              {profile.chemicalClass && <span className="cfs-chip">{profile.chemicalClass}</span>}
              <span className="cfs-chip cfs-chip-tier">
                <EvidenceTag tier={profile.tier} size="sm" showTooltip={false} />
              </span>
              {profile.hasEngineData && (
                <span className="cfs-chip cfs-chip-rct">
                  <ShieldCheck className="cfs-ic" aria-hidden="true" /> RCT-backed
                </span>
              )}
              {profile.pmidCount > 0 && (
                <span className="cfs-chip">
                  <FlaskConical className="cfs-ic" aria-hidden="true" />
                  {profile.pmidCount} cited {profile.pmidCount === 1 ? 'study' : 'studies'}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="cfs-summary">{profile.note ?? profile.summary}</p>

        {/* ── Chemical matrix: hallmark coverage ───────────────────── */}
        <div className="cfs-block">
          <p className="cfs-block-label">
            <Gauge className="cfs-ic" aria-hidden="true" />
            Chemical matrix · engages {engagedCount} of 12 hallmarks of aging
          </p>
          <ul className="cfs-hallmark-grid" aria-label="Hallmarks of aging this compound engages">
            {ALL_HALLMARKS.map((h) => {
              const on = engagedIds.has(h.id);
              return (
                <li
                  key={h.id}
                  className={`cfs-hm ${on ? 'cfs-hm-on' : 'cfs-hm-off'}`}
                  aria-label={`${h.title}: ${on ? 'engaged' : 'not a primary target'}`}
                >
                  <span className="cfs-hm-num">{String(h.number).padStart(2, '0')}</span>
                  {on ? (
                    <Link href={`/library/${h.slug}`} className="cfs-hm-title cfs-hm-link focus-ring">
                      {h.title}
                    </Link>
                  ) : (
                    <span className="cfs-hm-title">{h.title}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Molecular pathways engaged ───────────────────────────── */}
        {profile.pathways.length > 0 && (
          <div className="cfs-block">
            <p className="cfs-block-label">
              <Network className="cfs-ic" aria-hidden="true" /> Molecular pathways engaged
            </p>
            <div className="cfs-tags">
              {profile.pathways.map((p) =>
                p.slug ? (
                  <Link key={p.label} href={`/pathways/${p.slug}`} className="cfs-tag cfs-tag-link focus-ring">
                    {p.label}
                  </Link>
                ) : (
                  <span key={p.label} className="cfs-tag">
                    {p.label}
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {/* ── Measured practical profile ───────────────────────────── */}
        {hasMeasuredProfile && (
          <div className="cfs-block">
            <p className="cfs-block-label">
              <Beaker className="cfs-ic" aria-hidden="true" /> Measured profile
            </p>
            <dl className="cfs-facts">
              {profile.measuredBioavailability !== undefined && (
                <div className="cfs-fact">
                  <dt>Oral bioavailability</dt>
                  <dd>
                    <span className="cfs-fact-num" style={{ color: accent }}>
                      {profile.measuredBioavailability}%
                    </span>
                    <span className="cfs-fact-note">measured, standard form</span>
                  </dd>
                </div>
              )}
              {profile.dose && (
                <div className="cfs-fact">
                  <dt>Studied dose</dt>
                  <dd>{profile.dose}</dd>
                </div>
              )}
              {profile.timing && (
                <div className="cfs-fact">
                  <dt>Timing</dt>
                  <dd>{profile.timing}</dd>
                </div>
              )}
            </dl>
            {hasMatrix && (
              <p className="cfs-xref">
                Effect · bioavailability · safety <em>ratings</em> (0–100) are scored in the Compound
                Intelligence Matrix below — a separate synthesis from the measured percentage above.
              </p>
            )}
          </div>
        )}

        {/* ── Mechanism of action ──────────────────────────────────── */}
        {profile.mechanism && (
          <div className="cfs-block">
            <p className="cfs-block-label">Mechanism of action</p>
            <p className="cfs-prose">{profile.mechanism}</p>
          </div>
        )}

        {/* ── Synergies ────────────────────────────────────────────── */}
        {profile.synergies.length > 0 && (
          <div className="cfs-block">
            <p className="cfs-block-label">Documented synergies</p>
            <div className="cfs-tags">
              {profile.synergies.map((s) =>
                s.href ? (
                  <Link key={s.id} href={s.href} className="cfs-tag cfs-tag-syn focus-ring">
                    {s.name}
                  </Link>
                ) : (
                  <span key={s.id} className="cfs-tag cfs-tag-syn-flat">
                    {s.name}
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {/* ── Evidence spine ───────────────────────────────────────── */}
        {profile.studies.length > 0 && (
          <div className="cfs-block">
            <p className="cfs-block-label">Evidence · PubMed-linked</p>
            <ul className="cfs-studies">
              {visibleStudies.map((s) => (
                <li key={s.pmid}>
                  <Link
                    href={pubmedUrl(s.pmid)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cfs-study focus-ring"
                  >
                    <span className="cfs-study-title">{s.title}</span>
                    <span className="cfs-study-meta">
                      {s.journal} {s.year} · PMID {s.pmid}
                      <ExternalLink className="cfs-ic" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {hiddenStudies > 0 && (
              <p className="cfs-more">+{hiddenStudies} more cited in the deep-dive below.</p>
            )}
          </div>
        )}

        <div className="cfs-foot">
          <span>
            Every field here traces to already-authored, cited data — nothing is invented, and a value
            a compound lacks is left out rather than guessed.
          </span>
          {profile.lastReviewed && <span className="cfs-reviewed">Last reviewed {profile.lastReviewed}</span>}
        </div>
      </div>
    </section>
  );
}

const CFS_CSS = `
.cfs { gap: 0; padding: clamp(20px, 3vw, 30px); }
.cfs-ic { width: 13px; height: 13px; display: inline-block; vertical-align: -2px; }

.cfs-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 20px; }
.cfs-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 11px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--color-text-muted); margin: 0 0 8px;
}
.cfs-name {
  font-family: var(--font-display, Fraunces, serif); font-weight: 500;
  font-size: clamp(22px, 3vw, 30px); line-height: 1.05; letter-spacing: -0.02em;
  color: var(--color-text-primary); margin: 0;
  /* Carried over from the global h1–h4 rule this element no longer matches. */
  text-wrap: balance;
}
.cfs-full { font-size: 13px; color: var(--color-text-muted); margin: 4px 0 0; }
.cfs-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.cfs-chip {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 11px;
  color: var(--color-text-secondary); padding: 4px 10px; border-radius: 999px;
  border: 1px solid var(--color-border-subtle); background: var(--color-bg-muted);
}
.cfs-chip-tier { padding: 2px 6px; }
.cfs-chip-rct { color: var(--accent-emerald); border-color: color-mix(in srgb, var(--accent-emerald) 40%, transparent); }

.cfs-summary { font-size: 14px; line-height: 1.6; color: var(--color-text-secondary); margin: 18px 0 0; max-width: 68ch; }

.cfs-block { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-border-subtle); }
.cfs-block-label {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 10.5px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--color-text-faint); margin: 0 0 12px;
}

.cfs-hallmark-grid {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;
}
@media (max-width: 720px) { .cfs-hallmark-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 440px) { .cfs-hallmark-grid { grid-template-columns: 1fr; } }
.cfs-hm {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 11px; border-radius: 10px;
  border: 1px solid var(--color-border-subtle); background: var(--color-bg-muted);
}
.cfs-hm-num {
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 10px; font-weight: 600;
  letter-spacing: 0.04em; flex: 0 0 auto;
}
.cfs-hm-title { font-size: 12.5px; line-height: 1.25; }
.cfs-hm-on {
  border-color: color-mix(in srgb, var(--card-accent) 45%, transparent);
  background: color-mix(in srgb, var(--card-accent) 10%, transparent);
}
.cfs-hm-on .cfs-hm-num { color: var(--card-accent); }
.cfs-hm-on .cfs-hm-title { color: var(--color-text-primary); font-weight: 500; }
.cfs-hm-link { text-decoration: none; }
.cfs-hm-link:hover { text-decoration: underline; }
.cfs-hm-off { opacity: 0.55; }
.cfs-hm-off .cfs-hm-num { color: var(--color-text-faint); }
.cfs-hm-off .cfs-hm-title { color: var(--color-text-muted); }

.cfs-tags { display: flex; flex-wrap: wrap; gap: 7px; }
.cfs-tag {
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px;
  color: var(--color-text-secondary); padding: 5px 11px; border-radius: 999px;
  border: 1px solid var(--color-border-subtle); background: var(--color-bg-muted); text-decoration: none;
}
.cfs-tag-link { color: var(--accent-cyan); border-color: color-mix(in srgb, var(--accent-cyan) 28%, transparent); }
.cfs-tag-link:hover { text-decoration: underline; }
.cfs-tag-syn, .cfs-tag-syn-flat { color: var(--accent-emerald); border-color: color-mix(in srgb, var(--accent-emerald) 28%, transparent); }
.cfs-tag-syn:hover { text-decoration: underline; }

.cfs-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 0; }
@media (max-width: 560px) { .cfs-facts { grid-template-columns: 1fr; } }
.cfs-fact dt {
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 10px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--color-text-faint); margin-bottom: 5px;
}
.cfs-fact dd { margin: 0; font-size: 14px; color: var(--color-text-secondary); display: flex; flex-direction: column; gap: 2px; }
.cfs-fact-num { font-family: var(--font-mono, ui-monospace, monospace); font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; }
.cfs-fact-note { font-size: 11px; color: var(--color-text-faint); }
.cfs-xref { margin: 12px 0 0; font-size: 11.5px; line-height: 1.5; color: var(--color-text-faint); }

.cfs-prose { margin: 0; font-size: 13.5px; line-height: 1.65; color: var(--color-text-secondary); max-width: 72ch; }

.cfs-studies { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.cfs-study {
  display: flex; flex-direction: column; gap: 2px; text-decoration: none;
  padding: 9px 12px; border-radius: 10px;
  border: 1px solid var(--color-border-subtle); background: var(--color-bg-muted);
}
.cfs-study:hover { border-color: color-mix(in srgb, var(--accent-cyan) 35%, transparent); }
.cfs-study-title { font-size: 13px; line-height: 1.35; color: var(--color-text-primary); }
.cfs-study-meta {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono, ui-monospace, monospace); font-size: 11px; color: var(--accent-cyan);
}
.cfs-more { margin: 10px 0 0; font-size: 12px; color: var(--color-text-faint); }

.cfs-foot {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;
  margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--color-border-subtle);
  font-size: 11.5px; line-height: 1.5; color: var(--color-text-faint);
}
.cfs-reviewed { white-space: nowrap; }
`;
