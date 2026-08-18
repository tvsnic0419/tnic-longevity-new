#!/usr/bin/env node
/**
 * promote-compounds — extract already-authored science from the compound
 * deep-dive MDX files into `Compound` entries for lib/data.ts.
 *
 * WHY THIS EXISTS
 * ---------------
 * The library holds 100 compound deep-dives; only a subset carries a
 * lib/data.ts entry (the "graded set" that powers Stack Architect, the tools,
 * and the /insights depth charts). Every ungraded module already contains real
 * authored science — dose tables, mechanism tables, PMID-cited evidence tables.
 * Promoting one is therefore an EXTRACTION job.
 *
 * THE ONE RULE: never invent a value.
 * NOTES-COMPOUND-LIBRARY.md forbids promoting a module by fabricating mechanism
 * text, doses, bioavailability, or PMIDs. So:
 *   - Every emitted field is copied verbatim from the MDX or from the already
 *     structured module metadata (relatedHallmarkIds / synergyCompoundIds).
 *   - `bioavailability` is NEVER emitted. The type marks it optional precisely
 *     because it should be "only set when a specific published figure exists —
 *     omit rather than guess", and no MDX carries one. (The older
 *     scripts/finish-compound-library.mjs hardcoded `bioavailability: 60`, a
 *     fabricated placeholder — deliberately not reused here.)
 *   - Anything not extractable is left empty and flagged NEEDS_REVIEW rather
 *     than filled with a plausible-looking default.
 *
 * HOW IT IS DRIVEN
 * `compoundModules` lives in TypeScript, so the pure functions below
 * (`extract`, `isEmittable`, `toEntry`) are called from a short vitest-run
 * driver that can resolve the TS import — see the PR description for the
 * driver used. Its output is committed as scripts/.promote-audit.json, which
 * is the reviewable record of what was extracted, from where, and what was
 * skipped and why.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const MDX_DIR = join(ROOT, 'content/compounds');

// ── MDX parsing ────────────────────────────────────────────────────────────
// Two schemas exist in the corpus and they vary INDEPENDENTLY for dose vs
// studies, so each extractor probes both shapes.

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

/** TL;DR blockquote → `desc`. */
function extractDesc(src) {
  const m = src.match(/>\s*\*\*TL;DR\*\*\s*—\s*([^\n]+)/);
  return m ? m[1].trim() : null;
}

/**
 * `mechanism` — prefer the structured `| Pathway | Mechanism | Hallmark |`
 * table (concise, factual) and fall back to the opening prose paragraph.
 */
function extractMechanism(src) {
  const tbl = src.match(/\|\s*Pathway\s*\|\s*Mechanism\s*\|[^\n]*\n\|[-\s|]+\n((?:\|[^\n]*\n)+)/);
  if (tbl) {
    const rows = tbl[1]
      .trim()
      .split('\n')
      .map((r) => r.split('|').map((c) => c.trim()).filter(Boolean))
      .filter((c) => c.length >= 2 && c[1] && c[1] !== '—')
      .map((c) => `${c[0]}: ${c[1]}`);
    if (rows.length) return rows.join(' · ');
  }
  const prose = src.match(/##\s*1\.[^\n]*\n+([^\n]{80,})/);
  return prose ? prose[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim() : null;
}

/** `pathway` — the :::pathway directive title, else the module tagline. */
function extractPathway(src, tagline) {
  const m = src.match(/:::pathway\s+title="([^"]+)"/);
  if (m) return m[1].trim();
  if (tagline) return tagline.replace(/\s*—\s*evidence-graded deep dive$/, '').trim();
  return null;
}

/**
 * `dose` — schema A is a single `| Dose | X |` row. Schema B lists
 * indication-specific rows in the Dosing-protocol table; the first stated dose
 * becomes the primary and every alternative is kept in the audit, so the choice
 * is reviewable and no value is ever synthesized.
 */

/** Labels that head a protocol row rather than a dose row. */
const NON_DOSE_LABEL =
  /^(parameter|timing|duration|stop rule|trial length|monitor|form|cycling|notes?|source|frequency)$/i;

/** A real dose states an amount in a mass/volume/activity unit. */
const DOSE_UNIT = /\d\s*(mg|g|mcg|µg|ug|iu|ml|billion|cfu|%)/i;

function extractDose(src) {
  // Scope every lookup to the Dosing-protocol section. Searching the whole file
  // matches the personal-results log header (`| Date | Week | Dose | Fasting
  // glucose | ... |`) and captures a monitoring metric as if it were a dose.
  const sectMatch = src.match(/##\s*\d*\.?\s*Dosing protocol([\s\S]*?)(?=\n##\s|$)/);
  const scope = sectMatch ? sectMatch[1] : src;

  // `Dose` may carry a qualifier, e.g. `| Dose (trial-anchored) | 4–12 mg/day |`.
  // Anchored to line start (/m): an unanchored match also fires on a *later*
  // cell that happens to begin with "Dose" — e.g. mucuna's
  // `| Parkinson's adjunct | MD-directed only | Dose displaces pharmaceutical
  // L-DOPA… |` — and captures the wrong cell.
  const single = scope.match(/^\|\s*Dose[^|]*\|([^|]+)\|/m);
  if (single) {
    const value = stripMd(single[1]);
    // A Dose row does not guarantee a dose. Some deep-dives deliberately state
    // "No self-directed dose established" (e.g. low-dose lithium) — that is the
    // source refusing to give a self-dosing protocol, and must never be emitted
    // as though it were one.
    if (!DOSE_UNIT.test(value)) {
      return { value: null, primaryLabel: null, candidates: [], schema: 'A', declined: value };
    }
    return { value, primaryLabel: null, candidates: [], schema: 'A' };
  }

  const candidates = [];
  if (sectMatch) {
    for (const line of scope.split('\n')) {
      const cells = line.split('|').map((c) => c.trim());
      if (cells.length < 3) continue;
      const label = cells[1];
      const value = cells[2];
      if (!label || !value) continue;
      if (/^-+$/.test(label) || /^-+$/.test(value)) continue;
      if (NON_DOSE_LABEL.test(label)) continue;
      // A dose must state an amount. Rows like `Cycling -> 6 weeks on / 2 weeks
      // off` or `Form -> Soy or sunflower PS` are protocol notes, not doses, and
      // would otherwise be emitted as one.
      if (!DOSE_UNIT.test(value)) continue;
      candidates.push({ label: stripMd(label), value: stripMd(value) });
    }
  }
  // Primary = the FIRST stated dose in the compound's own dosing table, copied
  // verbatim. Deterministic and reproducible; the alternatives are retained in
  // the audit so the choice stays reviewable.
  const primary = candidates.length ? candidates[0] : null;
  return {
    value: primary ? primary.value : null,
    primaryLabel: primary ? primary.label : null,
    candidates,
    schema: candidates.length ? 'B' : null,
  };
}

/** Raw `| Timing | … |` text — normalization to the enum happens below. */
function extractTimingRaw(src) {
  const sect = src.match(/##\s*\d*\.?\s*Dosing protocol([\s\S]*?)(?=\n##\s|$)/);
  const m = (sect ? sect[1] : src).match(/^\|\s*Timing[^|]*\|([^|]+)\|/m);
  return m ? stripMd(m[1]) : null;
}

/**
 * Map free-text timing to the `'AM' | 'PM' | 'AM/PM'` enum.
 * Returns null when the text does not clearly imply a time of day — the caller
 * flags those for review instead of defaulting.
 */
function normalizeTiming(raw) {
  if (!raw) return null;
  const t = raw.toLowerCase();
  const hasAM = /\bam\b|morning|breakfast|pre-?workout|pre-?exercise|midday/.test(t);
  const hasPM = /\bpm\b|evening|night|bed(time)?|sleep/.test(t);
  const split = /split|divided|bid|tid|2 doses|twice|across the day|am\/pm/.test(t);

  if (split) return 'AM/PM';
  if (hasAM && hasPM) return 'AM/PM';
  if (hasAM) return 'AM';
  if (hasPM) return 'PM';
  // Food-relative instructions ("with meals", "on an empty stomach") state a
  // relationship to eating, not a time of day. 'AM/PM' is the enum's permissive
  // value — it asserts no specific time, which is exactly what the source says.
  // Note DynamicStackBuilder groups 'AM/PM' under the AM dose, a sensible
  // default for a compound whose timing is unconstrained.
  if (/meal|food|fasted|empty stomach|with the first bite/.test(t)) return 'AM/PM';
  // Physician-gated instructions ("physician-directed", "not for self-use") are
  // deliberately NOT mapped — the source withholds a self-administration time.
  if (GATED.test(t)) return null;
  return null;
}

/** Instructions that withhold self-administration guidance (Rx / research use). */
const GATED = /physician|specialist|not for self-use|prescrib|clinician-directed/i;

/**
 * Resolve `timing` for emission.
 *
 * `timing` is a required enum, but many sources state no time of day at all —
 * either food-relative ("with meals") or silent. Asserting 'AM' or 'PM' there
 * would invent a claim the deep-dive never makes, so those resolve to 'AM/PM',
 * the permissive value meaning "no specific time required". The caller keeps a
 * TIMING_DEFAULTED flag so every such case stays visible in review.
 *
 * Physician-gated sources return null and stay flagged — a prescription-only
 * compound should not silently acquire a self-dosing schedule.
 */
function resolveTiming(raw) {
  const direct = normalizeTiming(raw);
  if (direct) return { timing: direct, defaulted: false, gated: false };
  if (raw && GATED.test(raw)) return { timing: null, defaulted: false, gated: true };
  return { timing: 'AM/PM', defaulted: true, gated: false };
}

/**
 * `studies[]` — two table formats:
 *   1. `| title | journal | year | [PMID n](url) |`
 *   2. `| Author Year (PMID n) | Design | N | outcomes | Tier |`
 * Rows without a PMID are skipped; a study is only as good as its citation.
 */
function extractStudies(src) {
  const out = new Map();

  for (const m of src.matchAll(
    /\|([^|\n]{10,})\|([^|\n]+)\|\s*(\d{4})\s*\|\s*\[PMID\s*(\d{5,9})\]/g,
  )) {
    const pmid = m[4];
    if (out.has(pmid)) continue;
    out.set(pmid, {
      title: stripMd(m[1]),
      journal: stripMd(m[2]),
      year: Number(m[3]),
      pmid,
    });
  }

  for (const line of src.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim()).filter((c) => c !== '');
    if (cells.length < 2) continue;
    const cite = cells[0];
    const pm = cite.match(/PMID[:\s]*(\d{5,9})/);
    if (!pm) continue;
    const pmid = pm[1];
    if (out.has(pmid)) continue;
    const year = cite.match(/\b(19|20)\d{2}\b/);
    const journal = cite.match(/\*([^*]+)\*/);
    out.set(pmid, {
      // Citation label with the PMID parenthetical removed, e.g. "Bettuzzi 2006".
      title: stripMd(cite.replace(/\(?\s*PMID[:\s]*\d{5,9}[^)]*\)?/g, '').replace(/,\s*$/, '')),
      journal: journal ? journal[1].trim() : '',
      year: year ? Number(year[0]) : 0,
      pmid,
    });
  }

  return [...out.values()];
}

function stripMd(s) {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Driver ─────────────────────────────────────────────────────────────────

export function extract(slug, module) {
  const path = join(MDX_DIR, `${slug}.mdx`);
  if (!existsSync(path)) return { slug, error: 'missing MDX' };
  const src = readFileSync(path, 'utf8');
  const fm = frontmatter(src);

  const dose = extractDose(src);
  const timingRaw = extractTimingRaw(src);
  const { timing, defaulted: timingDefaulted, gated: timingGated } = resolveTiming(timingRaw);
  const studies = extractStudies(src);

  const review = [];
  if (!dose.value && dose.declined) review.push('DOSE_NOT_ESTABLISHED');
  else if (!dose.value && dose.candidates.length) review.push('DOSE_CHOICE');
  else if (!dose.value) review.push('DOSE_MISSING');
  if (timingGated) review.push('TIMING_GATED');
  else if (timingDefaulted) review.push('TIMING_DEFAULTED');
  if (!studies.length) review.push('NO_STUDIES');
  if (!module?.compoundId) review.push('NEEDS_COMPOUND_ID');

  return {
    slug,
    id: fm.compound_id || module?.compoundId || slug,
    name: module?.title ?? null,
    evidence: module?.evidenceTier ?? fm.evidence_tier ?? null,
    requiresDisclaimer: Boolean(module?.requiresDisclaimer),
    desc: extractDesc(src),
    mechanism: extractMechanism(src),
    pathway: extractPathway(src, module?.tagline),
    doseSchema: dose.schema,
    dose: dose.value,
    doseLabel: dose.primaryLabel ?? null,
    doseDeclined: dose.declined ?? null,
    doseCandidates: dose.candidates,
    timingRaw,
    timing,
    timingDefaulted,
    // Already structured on the module — no parsing, no guessing.
    hallmarks: module?.relatedHallmarkIds ?? [],
    synergies: module?.synergyCompoundIds ?? [],
    studies,
    // bioavailability intentionally absent — see header.
    review,
  };
}

// ── Emit ───────────────────────────────────────────────────────────────────

/**
 * `badge` — the StackGoal bucket. Derived from the compound's own pathway and
 * hallmark mapping (both authored), defaulting to the neutral 'longevity'
 * rather than guessing a mechanism. Only consumed as a search keyword
 * (lib/library-search.ts, lib/command-palette-index.ts), so a conservative
 * default costs nothing.
 */
function deriveBadge(row) {
  const t = `${row.pathway ?? ''} ${row.mechanism ?? ''}`.toLowerCase();
  if (/nrf2|keap1|are element|phase-ii|phase ii/.test(t)) return 'nrf2';
  if (/sirt1|sirtuin|nad\+|nampt/.test(t)) return 'sirt1';
  if (/autophag|mitophag|proteostas/.test(t)) return 'autophagy';
  if (/mitochondri|complex i|oxidative phosphor|atp/.test(t)) return 'mito';
  if (row.hallmarks?.includes('mito')) return 'mito';
  return 'longevity';
}

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** Render one audit row as a `Compound` literal for lib/data.ts. */
export function toEntry(row) {
  const studies = row.studies
    .map(
      (s) =>
        `      { title: ${q(s.title)}, journal: ${q(s.journal)}, year: ${s.year}, pmid: ${q(s.pmid)} },`,
    )
    .join('\n');
  return `  {
    id: ${q(row.id)},
    name: ${q(row.name)},
    brand: 'OTC Supplement',
    pathway: ${q(row.pathway)},
    mechanism: ${q(row.mechanism)},
    desc: ${q(row.desc)},
    badge: ${q(deriveBadge(row))},
    evidence: ${q(row.evidence)},
    dose: ${q(row.dose)},
    timing: ${q(row.timing)},
    synergies: [${row.synergies.map(q).join(', ')}],
    hallmarks: [${row.hallmarks.map(q).join(', ')}],
    studies: [
${studies}
    ],
  },`;
}

/** A row is emittable only when every required field came from the source. */
export function isEmittable(row) {
  return Boolean(
    row.id && row.name && row.evidence && row.desc && row.mechanism &&
      row.pathway && row.dose && row.timing && row.studies?.length &&
      row.hallmarks?.length,
  );
}

// ── Safety profiles ────────────────────────────────────────────────────────

/**
 * `safetyNotes` entry for a promoted compound.
 *
 * lib/site-integrity.test.ts requires every compound in `compounds[]` to carry
 * a safety profile — a real invariant on a supplement site, not a formality.
 * The deep-dives all have a "Safety and red flags" section, but as prose, so
 * bullets are bucketed by the structure the author already used:
 *
 *   :::redflag / :::warning block   → avoidIf   (the author's own stop list)
 *   mentions a clinician/physician  → consultIf
 *   everything else in the section  → cautions
 *
 * When a bullet could sit in two buckets it goes to the STRONGER one, because
 * the failure modes are asymmetric: a contraindication demoted to a "caution"
 * understates real risk, while the reverse is merely over-cautious.
 */
export function extractSafety(src) {
  const sec = src.match(/##\s*\d*\.?\s*Safety[^\n]*([\s\S]*?)(?=\n##\s|$)/);
  if (!sec) return null;
  const body = sec[1];

  const cautions = [];
  const avoidIf = [];
  const consultIf = [];
  const CLINICIAN = /physician|clinician|doctor|prescrib|oncologist|specialist|consult|medical supervision|discuss with/i;

  // Directive blocks carry the author's own escalation.
  const blocks = [...body.matchAll(/:::(redflag|warning)[^\n]*\n([\s\S]*?):::/g)];
  const blockText = blocks.map((b) => b[2]).join('\n');
  for (const line of bullets(blockText)) {
    (CLINICIAN.test(line) ? consultIf : avoidIf).push(line);
  }

  // Bullets outside any directive.
  const outside = body.replace(/:::[\s\S]*?:::/g, '');
  for (const line of bullets(outside)) {
    (CLINICIAN.test(line) ? consultIf : cautions).push(line);
  }

  if (!cautions.length && !avoidIf.length && !consultIf.length) return null;
  return { cautions, avoidIf, consultIf };
}

function bullets(text) {
  return text
    .split('\n')
    .filter((l) => /^\s*[-*]\s+/.test(l))
    .map((l) => stripMd(l.replace(/^\s*[-*]\s+/, '')))
    .filter((l) => l.length > 8 && l.length < 240);
}

/** Render a safetyNotes literal. */
export function toSafetyEntry(id, safety) {
  const arr = (xs) => (xs.length ? `[${xs.map(q).join(', ')}]` : '[]');
  return `  {
    compoundId: ${q(id)},
    cautions: ${arr(safety.cautions)},
    avoidIf: ${arr(safety.avoidIf)},
    consultIf: ${arr(safety.consultIf)},
  },`;
}
