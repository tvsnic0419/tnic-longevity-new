import type { EvidenceTier } from './types';

/**
 * The trial index — every study row the library already cites, as one dataset.
 *
 * 87 of the 100 compound deep-dives carry an authored evidence table: study,
 * design, N, duration, outcome, tier, most with a PMID. That is the richest
 * evidence detail on the site and it existed nowhere except inside prose. The
 * structured set in `lib/data.ts` is not a substitute — a `StudyRef` there is
 * title/journal/year/PMID only, with no design, no sample size, no duration and
 * no outcome. So a reader could not ask the library the one question it is
 * actually equipped to answer: which human trials, in whom, for how long, at
 * what dose, finding what.
 *
 * NOTHING HERE IS AUTHORED. Every field is lifted verbatim from the compound's
 * own table. The parser's job is to find the table and put its cells in named
 * fields; it never fills a cell the table left empty, never normalises a number,
 * and never rewrites an outcome. A column the source shape does not have comes
 * back `null` and renders as "not stated" rather than being inferred from a
 * neighbouring cell. `lib/trial-index.test.ts` enforces this by checking that
 * every extracted string occurs verbatim in the file it claims to come from.
 *
 * This module is deliberately free of `fs`: it holds the types, the parser and
 * the classifiers, all pure, so the client table can import the labels and types
 * without dragging Node built-ins into the browser bundle. Reading the MDX files
 * lives next door in `trial-index.server.ts`.
 *
 * The two derived fields — `designClass` and `evidenceBase` — are classifications
 * OVER the authored design text, never replacements for it. Both are kept beside
 * the verbatim `design` string, both fail to `unclassified`/`unclear` rather than
 * guessing, and the UI shows the authored text as the primary value. A design
 * naming both a human and a non-human population classifies as `mixed`, not as
 * whichever keyword matched first — "multi-species + human association" is a real
 * authored design and calling it human evidence would be the exact overclaim this
 * library exists to avoid.
 */

export type TrialDesignClass =
  | 'meta-analysis'
  | 'rct'
  | 'crossover'
  | 'observational'
  | 'open-label'
  | 'pharmacokinetic'
  | 'review'
  | 'preclinical'
  | 'mechanistic'
  | 'unclassified';

/** Whether the row's design describes people, animals/cells, both, or neither clearly. */
export type TrialEvidenceBase = 'human' | 'preclinical' | 'mixed' | 'unclear';

export interface TrialRecord {
  /** Stable row id: compound slug + ordinal within that compound's table. */
  id: string;
  compoundSlug: string;
  compoundTitle: string;
  /** The tier on the compound's own module — the page-level grade, not the row's. */
  compoundTier: EvidenceTier;
  href: string;

  /** The Study cell, verbatim. */
  citation: string;
  /** Four-digit year found in the citation cell, or null. Not inferred. */
  year: number | null;
  /** PMID found anywhere in the row, or null. */
  pmid: string | null;

  /** The Design / Model / Study type cell, verbatim. */
  design: string | null;
  designClass: TrialDesignClass;
  evidenceBase: TrialEvidenceBase;

  /** Population cell where the table has one, verbatim. */
  population: string | null;
  /** The N cell, verbatim — "60", "~1000+", "24" all stay as written. */
  participants: string | null;
  /** Duration cell, verbatim — "16 wk", "Acute", "Lifelong". */
  duration: string | null;
  /** Dose cell where the table has one, verbatim. */
  dose: string | null;
  /** Key outcome(s) cell, verbatim — including the arrows and emphasis markers. */
  outcome: string | null;

  /** Leading A/B/C of the Tier cell, or null where the cell is not a letter grade. */
  tier: EvidenceTier | null;
  /** The whole Tier cell, verbatim — "C (preclinical)", "Preclinical → B", "—". */
  tierLabel: string | null;
}

/* ── Column mapping ───────────────────────────────────────────────────────────
   17 header shapes across 89 tables. Each canonical field lists the headers the
   library actually uses for it; an unrecognised header is ignored rather than
   guessed into a field, so a new shape degrades to missing data, not wrong data. */
const COLUMN_ALIASES: Record<string, RegExp> = {
  citation: /^(study|study \/ review|study type|trial)$/i,
  design: /^(design|model|comparison|trials|molecule)$/i,
  population: /^(population)$/i,
  participants: /^(n|participants)$/i,
  duration: /^(duration|dose \/ duration)$/i,
  dose: /^(dose)$/i,
  outcome: /^(key outcomes?|key reported outcome|outcome)$/i,
  tier: /^(tier)$/i,
};

/**
 * A header row qualifies as an evidence table when it names a study AND at least
 * one study attribute. Requiring both keeps the mechanism tables out — several
 * deep-dives open with an "Enzyme | NAD+ role | Hallmark link" table that would
 * otherwise match on shape alone.
 */
function isEvidenceHeader(cells: string[]): boolean {
  const joined = cells.join(' | ').toLowerCase();
  return /\b(study|trial)\b/.test(joined) && /\b(design|dose|outcome|model|population)\b/.test(joined);
}

const SEPARATOR = /^\|[\s:|-]+\|$/;

function splitRow(line: string): string[] {
  const cells = line.trim().split('|').map((c) => c.trim());
  // A pipe-delimited row has empty first/last members from the outer pipes.
  if (cells[0] === '') cells.shift();
  if (cells[cells.length - 1] === '') cells.pop();
  return cells;
}

/* ── Derived classification ───────────────────────────────────────────────────
   Ordered most-specific first: "RCT, crossover" is a randomised trial that
   happens to be crossover, so the RCT rule must win over the crossover rule. */
const DESIGN_RULES: ReadonlyArray<[TrialDesignClass, RegExp]> = [
  // "Meta", "Meta of 9 RCTs" and "Meta (topical)" are all used as shorthand for
  // a pooled analysis in these tables, so the bare word counts. It cannot
  // collide with "metabolic" — \b requires a non-word character after "meta".
  ['meta-analysis', /\b(meta[- ]?analys|\bmeta\b|systematic|pooled)/i],
  ['rct', /\b(rcts?|randomi[sz]ed|randomised|double[- ]blind|placebo[- ]controlled)\b/i],
  ['crossover', /\bcross[- ]?over\b/i],
  ['observational', /\b(cohort|prospective|retrospective|observational|epidemiolog|case[- ]control|case series|cross[- ]sectional|association|registry|nhanes)\b/i],
  ['pharmacokinetic', /\b(pharmacokinetic|pk\b|bioavailability|absorption)\b/i],
  ['open-label', /\b(open[- ]label|single[- ]arm|uncontrolled|pilot)\b/i],
  ['preclinical', /\b(animal|mouse|mice|murine|rat\b|rats\b|dogs?\b|in vitro|ex vivo|culture|cell|preclinical|worm|c\.? ?elegans|drosophila|yeast|rodent|canine|primate|zebrafish)\b/i],
  ['review', /\b(review|narrative|position stand)\b/i],
  // Lowest priority on purpose: "Mechanistic review" is a review that happens to
  // be mechanistic, and the review rule above should claim it first.
  ['mechanistic', /\bmechanistic\b/i],
];

const HUMAN_MARKER =
  /\b(rcts?|randomi[sz]ed|randomised|double[- ]blind|placebo[- ]controlled|cross[- ]?over|cohort|humans?|patients?|adults?|men\b|women\b|volunteers?|participants?|prospective|case[- ]control|case series|cross[- ]sectional|clinical|trials?|nhanes|phase [i1v]+)\b/i;

const NONHUMAN_MARKER =
  /\b(animal|mouse|mice|murine|rat\b|rats\b|dogs?\b|in vitro|ex vivo|culture|cell line|cells?\b|preclinical|worm|c\.? ?elegans|drosophila|yeast|rodent|canine|primate|zebrafish|multi[- ]species)\b/i;

export function classifyDesign(design: string | null): TrialDesignClass {
  if (!design) return 'unclassified';
  for (const [cls, re] of DESIGN_RULES) if (re.test(design)) return cls;
  return 'unclassified';
}

/**
 * Human, preclinical, both or unclear — read off the authored design and
 * population text only. Deliberately returns `unclear` rather than defaulting to
 * human: an unlabelled row is not evidence of a human trial.
 */
export function classifyEvidenceBase(design: string | null, population: string | null): TrialEvidenceBase {
  const text = [design, population].filter(Boolean).join(' ');
  if (!text) return 'unclear';
  const human = HUMAN_MARKER.test(text);
  const nonHuman = NONHUMAN_MARKER.test(text);
  if (human && nonHuman) return 'mixed';
  if (human) return 'human';
  if (nonHuman) return 'preclinical';
  return 'unclear';
}

/** Leading letter grade only. "Preclinical → B" has no leading letter, so null. */
function parseTier(cell: string | null): { tier: EvidenceTier | null; label: string | null } {
  if (!cell) return { tier: null, label: null };
  const label = cell.trim();
  if (!label || label === '—' || label === '-') return { tier: null, label: label || null };
  const m = label.match(/^([ABC])\b/);
  return { tier: (m?.[1] as EvidenceTier | undefined) ?? null, label };
}

/** PMIDs are 7–8 digits. Anchored to the literal token so a sample size cannot match. */
function parsePmid(row: string): string | null {
  return row.match(/PMID:?\s*(\d{7,8})/i)?.[1] ?? null;
}

/** A 19xx/20xx year inside the citation cell. Never inferred from anywhere else. */
function parseYear(citation: string | null): number | null {
  if (!citation) return null;
  const m = citation.match(/\b(19\d{2}|20\d{2})\b/);
  return m ? Number(m[1]) : null;
}

/**
 * Pull every evidence-table row out of one MDX body.
 * Exported for the guardrail test, which re-runs it against the raw files.
 */
export function parseTrialRows(
  body: string,
  ctx: { slug: string; title: string; tier: EvidenceTier; href: string },
): TrialRecord[] {
  const lines = body.split('\n');
  const out: TrialRecord[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) continue;

    const header = splitRow(line);
    if (!isEvidenceHeader(header)) continue;
    if (!SEPARATOR.test(lines[i + 1]?.trim() ?? '')) continue;

    // Map this table's columns onto canonical field names once, up front.
    const columnOf: Record<number, string> = {};
    header.forEach((h, idx) => {
      for (const [field, re] of Object.entries(COLUMN_ALIASES)) {
        if (re.test(h)) {
          columnOf[idx] = field;
          return;
        }
      }
    });

    for (let j = i + 2; j < lines.length; j++) {
      const raw = lines[j];
      if (!raw.trim().startsWith('|')) break;
      const cells = splitRow(raw);

      const pick = (field: string): string | null => {
        const idx = Number(Object.keys(columnOf).find((k) => columnOf[Number(k)] === field) ?? -1);
        if (idx < 0) return null;
        const v = cells[idx]?.trim();
        return v && v !== '—' && v !== '-' ? v : null;
      };

      const citation = pick('citation');
      if (!citation) continue; // a row with no study is a spacer, not a trial

      const design = pick('design');
      const population = pick('population');
      const { tier, label } = parseTier(cells[Number(Object.keys(columnOf).find((k) => columnOf[Number(k)] === 'tier') ?? -1)] ?? null);

      out.push({
        id: `${ctx.slug}-${out.length + 1}`,
        compoundSlug: ctx.slug,
        compoundTitle: ctx.title,
        compoundTier: ctx.tier,
        href: ctx.href,
        citation,
        year: parseYear(citation),
        pmid: parsePmid(raw),
        design,
        designClass: classifyDesign(design),
        evidenceBase: classifyEvidenceBase(design, population),
        population,
        participants: pick('participants'),
        duration: pick('duration'),
        dose: pick('dose'),
        outcome: pick('outcome'),
        tier,
        tierLabel: label,
      });
    }

    i++; // header consumed; continue scanning after it
  }

  return out;
}

export interface TrialIndexStats {
  total: number;
  compoundsCovered: number;
  compoundsTotal: number;
  withPmid: number;
  byEvidenceBase: Record<TrialEvidenceBase, number>;
  byDesignClass: Record<TrialDesignClass, number>;
  byTier: Record<'A' | 'B' | 'C' | 'ungraded', number>;
  /** Human rows classified RCT, crossover or meta-analysis — the strongest subset. */
  humanControlled: number;
  yearRange: { earliest: number | null; latest: number | null };
}

export function computeTrialStats(rows: TrialRecord[], compoundTotal: number): TrialIndexStats {
  const byEvidenceBase = { human: 0, preclinical: 0, mixed: 0, unclear: 0 } as Record<TrialEvidenceBase, number>;
  const byDesignClass = {
    'meta-analysis': 0, rct: 0, crossover: 0, observational: 0, 'open-label': 0,
    pharmacokinetic: 0, review: 0, preclinical: 0, mechanistic: 0, unclassified: 0,
  } as Record<TrialDesignClass, number>;
  const byTier = { A: 0, B: 0, C: 0, ungraded: 0 };
  const years: number[] = [];
  let withPmid = 0;
  let humanControlled = 0;

  for (const r of rows) {
    byEvidenceBase[r.evidenceBase]++;
    byDesignClass[r.designClass]++;
    byTier[r.tier ?? 'ungraded']++;
    if (r.pmid) withPmid++;
    if (r.year) years.push(r.year);
    if (
      (r.evidenceBase === 'human' || r.evidenceBase === 'mixed') &&
      (r.designClass === 'rct' || r.designClass === 'crossover' || r.designClass === 'meta-analysis')
    ) {
      humanControlled++;
    }
  }

  return {
    total: rows.length,
    compoundsCovered: new Set(rows.map((r) => r.compoundSlug)).size,
    compoundsTotal: compoundTotal,
    withPmid,
    byEvidenceBase,
    byDesignClass,
    byTier,
    humanControlled,
    yearRange: {
      earliest: years.length ? Math.min(...years) : null,
      latest: years.length ? Math.max(...years) : null,
    },
  };
}

/** Human-readable labels for the derived design classes. */
export const DESIGN_CLASS_LABEL: Record<TrialDesignClass, string> = {
  'meta-analysis': 'Meta-analysis',
  rct: 'Randomised trial',
  crossover: 'Crossover',
  observational: 'Observational',
  'open-label': 'Open-label / pilot',
  pharmacokinetic: 'Pharmacokinetic',
  review: 'Review',
  preclinical: 'Preclinical',
  mechanistic: 'Mechanistic',
  unclassified: 'Unclassified',
};

export const EVIDENCE_BASE_LABEL: Record<TrialEvidenceBase, string> = {
  human: 'Human',
  preclinical: 'Preclinical',
  mixed: 'Mixed',
  unclear: 'Not stated',
};
