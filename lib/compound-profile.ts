import { compounds } from './data';
import { hallmarkLibrary } from './hallmarks-library';
import { getPathwaysForCompound } from './pathways';
import { getModuleBySlug } from './library-modules';
import {
  resolveCompound as resolveEngineCompound,
  subscoresOf,
  overallOf,
  DEFAULT_WEIGHTS,
  PATHWAY_LABELS,
  type Compound as EngineCompound,
  type StagedItem,
} from './compound-engine-data';
import type { Compound as DataCompound, EvidenceTier, StudyRef } from './types';

/**
 * Full-Spectrum compound profile — a single, normalized "data package" joined
 * from the three per-compound sources the site already maintains:
 *
 *   • lib/data.ts            — mechanism, measured bioavailability %, dose,
 *                              timing, synergies, cited studies (PMIDs).
 *   • lib/compound-engine-data.ts — the mechanistic "matrix": chemical class,
 *                              pathways engaged, hallmark fan-out, and the
 *                              0–100 effect/bioavail/safety magnitudes.
 *   • lib/library-modules.ts — the deep-dive module (title, summary, tier,
 *                              related hallmarks) + its MDX body.
 *
 * The one rule this file enforces, per NOTES-COMPOUND-LIBRARY.md: it INVENTS
 * nothing. Every field is copied from an authored source or left absent. An
 * absent magnitude is `undefined`, never 0 — a compound the engine has not
 * scored must not read as scoring zero. This mirrors the honesty contract in
 * lib/head-to-head.ts and lib/insights.ts.
 *
 * Hallmark id reconciliation: the engine dataset uses a slightly different id
 * namespace than the canonical hallmark library (`telomere`/`stemcell`/
 * `intercellular` vs `telomeres`/`stem`/`communication`). ENGINE_HALLMARK_ALIAS
 * maps the three that differ so the union resolves against one namespace — the
 * library's — which is also what lib/data.ts and module.relatedHallmarkIds use.
 */

/** Engine hallmark id → canonical hallmark-library id (only the three differ). */
const ENGINE_HALLMARK_ALIAS: Record<string, string> = {
  telomere: 'telomeres',
  stemcell: 'stem',
  intercellular: 'communication',
};

const normalizeHallmarkId = (id: string): string => ENGINE_HALLMARK_ALIAS[id] ?? id;

export interface ProfileHallmark {
  id: string;
  title: string;
  number: number;
}

export interface ProfilePathway {
  /** Display label, e.g. "NAD⁺", "AMPK", or a registry pathway name. */
  label: string;
  /** Set when the pathway has a /pathways/<slug> deep-dive to link to. */
  slug?: string;
}

export interface ProfileSynergy {
  id: string;
  name: string;
  /** Deep-dive link when the partner has a compound module; else undefined. */
  href?: string;
}

/** The five curated 0–100 magnitudes + composite, present only for engine compounds. */
export interface ProfileMagnitudes {
  evidence: number;
  effect: number;
  breadth: number;
  bioavail: number;
  safety: number;
  /** Composite Longevity Quotient (deterministic synthesis, not a claim). */
  lq: number;
}

export interface CompoundProfile {
  /** Module slug (equals the compound id for compound modules). */
  slug: string;
  /** Short display name (module title). */
  name: string;
  /** Full chemical / systematic name, when the engine carries one. */
  fullName?: string;
  /** Chemical class, e.g. "NAD⁺ precursor" — engine only. */
  chemicalClass?: string;
  /** Canonical A/B/C evidence tier from the module. */
  tier: EvidenceTier;
  summary: string;
  /** Grounded mechanism prose from lib/data.ts (never invented). */
  mechanism?: string;
  /** One-line grounded note from the engine, when present. */
  note?: string;
  /** Hallmarks engaged — union across sources, sorted by canonical number. */
  hallmarks: ProfileHallmark[];
  /** Molecular pathways engaged — engine labels ∪ pathway-registry names. */
  pathways: ProfilePathway[];
  /** 0–100 curated magnitudes + LQ — undefined when the engine hasn't scored it. */
  magnitudes?: ProfileMagnitudes;
  /** Measured oral bioavailability %, only when a published figure exists. */
  measuredBioavailability?: number;
  /** Studied dose (data.ts preferred, else engine's studied range). */
  dose?: string;
  /** Studied timing (AM/PM), data.ts only. */
  timing?: string;
  /** Practical caveat flags — engine only. */
  flags: string[];
  /** Cited studies with PMIDs from lib/data.ts. */
  studies: StudyRef[];
  /** Distinct PMID count across studies + the MDX body. */
  pmidCount: number;
  /** Synergistic partners, linked when a deep-dive exists. */
  synergies: ProfileSynergy[];
  /** ISO date of last review, from MDX frontmatter. */
  lastReviewed?: string;
  /** True when the mechanistic engine has a curated entry (drives the Matrix). */
  hasEngineData: boolean;
  /** True when lib/data.ts has a graded record (mechanism, PMIDs, %). */
  hasDataRecord: boolean;
}

const HALLMARK_BY_ID = new Map(hallmarkLibrary.map((h) => [h.id, h]));

function resolveHallmarks(ids: string[]): ProfileHallmark[] {
  const seen = new Set<string>();
  const out: ProfileHallmark[] = [];
  for (const raw of ids) {
    const id = normalizeHallmarkId(raw);
    if (seen.has(id)) continue;
    const h = HALLMARK_BY_ID.get(id);
    if (!h) continue; // never surface an id with no canonical hallmark record
    seen.add(id);
    out.push({ id: h.id, title: h.title, number: h.number });
  }
  return out.sort((a, b) => a.number - b.number);
}

function resolvePathways(
  slug: string,
  engine: EngineCompound | null,
): ProfilePathway[] {
  const out: ProfilePathway[] = [];
  const seen = new Set<string>();
  // Engine pathway ids → canonical labels first (mechanistic vocabulary).
  if (engine) {
    for (const p of engine.pathways) {
      const label = PATHWAY_LABELS[p];
      if (label && !seen.has(label)) {
        seen.add(label);
        out.push({ label });
      }
    }
  }
  // Registry pathways that have real /pathways/<slug> deep-dives to link to.
  for (const p of getPathwaysForCompound(slug)) {
    if (seen.has(p.name)) {
      // Upgrade the existing label with a link when the registry has one.
      const existing = out.find((o) => o.label === p.name);
      if (existing && !existing.slug) existing.slug = p.slug;
      continue;
    }
    seen.add(p.name);
    out.push({ label: p.name, slug: p.slug });
  }
  return out;
}

function resolveMagnitudes(engine: EngineCompound | null): ProfileMagnitudes | undefined {
  if (!engine) return undefined;
  const staged: StagedItem = {
    uid: engine.id,
    data: engine,
    name: engine.name,
    brand: '',
    dose: engine.dose,
    form: 'std',
    source: 'curated',
  };
  const subs = subscoresOf(staged);
  return { ...subs, lq: overallOf(subs, DEFAULT_WEIGHTS) };
}

function resolveSynergies(data: DataCompound | undefined): ProfileSynergy[] {
  if (!data) return [];
  return data.synergies.map((id) => {
    const partner = compounds.find((c) => c.id === id);
    const mod = getModuleBySlug('compounds', id);
    return {
      id,
      name: partner?.name ?? id,
      href: mod ? `/library/compounds/${id}` : undefined,
    };
  });
}

/** Distinct 7–8 digit PMIDs found in a block of text (e.g. an MDX body). */
function pmidsInText(text: string | null | undefined): string[] {
  if (!text) return [];
  return (text.match(/\bPMID:?\s*(\d{7,8})\b/g) ?? []).map((m) => m.replace(/\D/g, ''));
}

/**
 * Build the full-spectrum profile for a compound module slug. Returns null when
 * the slug is not a compound module — callers render nothing rather than a shell.
 */
export function resolveCompoundProfile(
  slug: string,
  opts: { mdxBody?: string | null; lastReviewed?: string } = {},
): CompoundProfile | null {
  const mod = getModuleBySlug('compounds', slug);
  if (!mod) return null;

  const data = mod.compoundId
    ? compounds.find((c) => c.id === mod.compoundId)
    : compounds.find((c) => c.id === slug);
  const engine = resolveEngineCompound(slug);

  const hallmarkIds = [
    ...(data?.hallmarks ?? []),
    ...(engine?.hallmarks ?? []),
    ...mod.relatedHallmarkIds,
  ];

  const studies = data?.studies ?? [];
  const distinctPmids = new Set<string>([
    ...studies.map((s) => s.pmid).filter(Boolean),
    ...pmidsInText(opts.mdxBody),
  ]);

  return {
    slug: mod.slug,
    name: mod.title,
    fullName: engine?.full && engine.full !== engine.name ? engine.full : undefined,
    chemicalClass: engine?.cls,
    tier: mod.evidenceTier,
    summary: mod.summary,
    mechanism: data?.mechanism,
    note: engine?.note,
    hallmarks: resolveHallmarks(hallmarkIds),
    pathways: resolvePathways(slug, engine),
    magnitudes: resolveMagnitudes(engine),
    measuredBioavailability: data?.bioavailability,
    dose: data?.dose ?? engine?.dose,
    timing: data?.timing,
    flags: engine?.flags ?? [],
    studies,
    pmidCount: distinctPmids.size,
    synergies: resolveSynergies(data),
    lastReviewed: opts.lastReviewed,
    hasEngineData: Boolean(engine),
    hasDataRecord: Boolean(data),
  };
}
