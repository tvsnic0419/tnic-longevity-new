import type { ThemeAccent } from './design-system';
import type { EvidenceTier } from './types';
import { pathways } from './pathways';
import { hallmarkLibrary } from './hallmarks-library';
import { hallmarkVisualRegistry } from './hallmark-visuals';
import { compounds } from './data';
import { peptideLibrary } from './peptides-library';

/**
 * The Mechanism Atlas assembles TNiC's three primary content axes —
 * hallmarks (what fails), pathways (the mechanism), and compound/peptide
 * levers (what you can pull) — into ONE cross-linked graph. Every edge is
 * derived, not authored: `pathway.relatedHallmarkIds` gives the hallmark
 * edges, `pathway.levers` gives the lever edges. Nothing here invents a
 * relationship the pathway data doesn't already assert.
 *
 * Two of the twelve hallmarks (telomere attrition, dysbiosis) are engaged by
 * no named convergence pathway. That is not a data gap — it's the site's own
 * position: both hallmarks' `whyItMatters` copy states lifestyle (stress/sleep
 * for telomeres; fiber/fermented foods for dysbiosis) is the primary lever,
 * not a pathway-targeting compound. The atlas surfaces that honestly via
 * `lifestyleLed` rather than hiding those two nodes.
 */

export type LeverKind = 'compound' | 'peptide' | 'rx';

export interface AtlasHallmarkNode {
  kind: 'hallmark';
  key: string;
  id: string;
  number: number;
  title: string;
  shortLabel: string;
  tagline: string;
  theme: ThemeAccent;
  href: string;
  pathwaySlugs: string[];
  /** True when no convergence pathway engages this hallmark — lifestyle-led. */
  lifestyleLed: boolean;
}

export interface AtlasPathwayNode {
  kind: 'pathway';
  key: string;
  slug: string;
  name: string;
  shortLabel: string;
  tagline: string;
  theme: ThemeAccent;
  href: string;
  hallmarkIds: string[];
  leverKeys: string[];
}

export interface AtlasLeverNode {
  kind: 'lever';
  key: string;
  leverKind: LeverKind;
  name: string;
  href: string;
  /** Best (A > B > C) evidence tier across every pathway role this lever plays. */
  evidenceTier: EvidenceTier;
  /** True if it is a primary lever on at least one pathway. */
  isPrimaryAnywhere: boolean;
  pathwaySlugs: string[];
}

export interface MechanismAtlas {
  hallmarks: AtlasHallmarkNode[];
  pathways: AtlasPathwayNode[];
  levers: AtlasLeverNode[];
}

/** Compact center-column labels — full pathway names are too long for a node. */
const PATHWAY_SHORT_LABEL: Record<string, string> = {
  'ampk-activation': 'AMPK',
  'nrf2-keap1-antioxidant-response': 'NRF2 / KEAP1',
  'sirtuin-nad-axis': 'Sirtuins / NAD+',
  'mtor-nutrient-sensing': 'mTOR',
  'mitochondrial-quality-control': 'Mito QC',
  'senescence-clearance': 'Senescence',
};

/** Short graph-node labels for the levers whose catalog names are brand-y or long. */
const LEVER_SHORT_NAME: Record<string, string> = {
  glynac: 'GlyNAC',
  nmn: 'NMN',
  resveratrol: 'Resveratrol',
  rala: 'R-ALA',
  cakg: 'Ca-AKG',
  urolithina: 'Urolithin A',
  coq10: 'CoQ10',
  omega3: 'Omega-3',
  berberine: 'Berberine',
};

const TIER_RANK: Record<EvidenceTier, number> = { A: 3, B: 2, C: 1 };

function bestTier(a: EvidenceTier, b: EvidenceTier): EvidenceTier {
  return TIER_RANK[a] >= TIER_RANK[b] ? a : b;
}

function compoundDisplayName(compoundId: string): string {
  if (LEVER_SHORT_NAME[compoundId]) return LEVER_SHORT_NAME[compoundId];
  return compounds.find((c) => c.id === compoundId)?.name ?? compoundId;
}

export function buildMechanismAtlas(): MechanismAtlas {
  // Reverse indexes accumulated while walking pathways.
  const hallmarkPathways = new Map<string, string[]>();
  const leverAcc = new Map<
    string,
    {
      leverKind: LeverKind;
      name: string;
      href: string;
      evidenceTier: EvidenceTier;
      isPrimaryAnywhere: boolean;
      pathwaySlugs: string[];
    }
  >();

  const pathwayNodes: AtlasPathwayNode[] = pathways.map((p) => {
    const hallmarkIds = p.relatedHallmarkIds.filter((id) =>
      hallmarkLibrary.some((h) => h.id === id),
    );
    for (const id of hallmarkIds) {
      hallmarkPathways.set(id, [...(hallmarkPathways.get(id) ?? []), p.slug]);
    }

    const leverKeys: string[] = [];
    for (const lever of p.levers) {
      let key: string;
      let leverKind: LeverKind;
      let name: string;
      let href: string;

      if (lever.compoundId) {
        leverKind = 'compound';
        key = `lever:compound:${lever.compoundId}`;
        name = compoundDisplayName(lever.compoundId);
        href = `/library/compounds/${lever.compoundId}`;
      } else if (lever.peptideId) {
        leverKind = 'peptide';
        key = `lever:peptide:${lever.peptideId}`;
        name =
          LEVER_SHORT_NAME[lever.peptideId] ??
          peptideLibrary.find((pep) => pep.id === lever.peptideId)?.name ??
          lever.peptideId;
        href = `/peptides/${lever.peptideId}`;
      } else {
        // Rx / no-module lever (rapamycin, metformin) — carries its own name + href.
        leverKind = 'rx';
        const display = (lever.name ?? 'Rx').replace(/\s*\(Rx\)\s*$/i, '');
        key = `lever:rx:${display.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        name = display;
        href = lever.href ?? '#';
      }

      leverKeys.push(key);
      const prev = leverAcc.get(key);
      if (prev) {
        prev.evidenceTier = bestTier(prev.evidenceTier, lever.evidenceTier);
        prev.isPrimaryAnywhere = prev.isPrimaryAnywhere || lever.strength === 'primary';
        if (!prev.pathwaySlugs.includes(p.slug)) prev.pathwaySlugs.push(p.slug);
      } else {
        leverAcc.set(key, {
          leverKind,
          name,
          href,
          evidenceTier: lever.evidenceTier,
          isPrimaryAnywhere: lever.strength === 'primary',
          pathwaySlugs: [p.slug],
        });
      }
    }

    return {
      kind: 'pathway' as const,
      key: `pathway:${p.slug}`,
      slug: p.slug,
      name: p.name,
      shortLabel: PATHWAY_SHORT_LABEL[p.slug] ?? p.name,
      tagline: p.tagline,
      theme: p.theme,
      href: `/library/pathways/${p.slug}`,
      hallmarkIds,
      // dedupe lever keys within a pathway (defensive; levers are already distinct)
      leverKeys: Array.from(new Set(leverKeys)),
    };
  });

  const hallmarkNodes: AtlasHallmarkNode[] = hallmarkLibrary.map((h) => {
    const slugs = hallmarkPathways.get(h.id) ?? [];
    const visual = hallmarkVisualRegistry[h.visual];
    return {
      kind: 'hallmark' as const,
      key: `hallmark:${h.id}`,
      id: h.id,
      number: h.number,
      title: h.title,
      shortLabel: visual.shortLabel,
      tagline: h.tagline,
      theme: visual.theme,
      href: `/library/${h.slug}`,
      pathwaySlugs: slugs,
      lifestyleLed: slugs.length === 0,
    };
  });

  const leverNodes: AtlasLeverNode[] = Array.from(leverAcc.entries()).map(([key, v]) => ({
    kind: 'lever' as const,
    key,
    leverKind: v.leverKind,
    name: v.name,
    href: v.href,
    evidenceTier: v.evidenceTier,
    isPrimaryAnywhere: v.isPrimaryAnywhere,
    pathwaySlugs: v.pathwaySlugs,
  }));

  // Order levers: primary-anywhere first, then by tier, then by pathway breadth,
  // so the strongest, most cross-cutting levers cluster near the top of the column.
  leverNodes.sort((a, b) => {
    if (a.isPrimaryAnywhere !== b.isPrimaryAnywhere) return a.isPrimaryAnywhere ? -1 : 1;
    if (a.evidenceTier !== b.evidenceTier) return TIER_RANK[b.evidenceTier] - TIER_RANK[a.evidenceTier];
    if (b.pathwaySlugs.length !== a.pathwaySlugs.length) return b.pathwaySlugs.length - a.pathwaySlugs.length;
    return a.name.localeCompare(b.name);
  });

  return { hallmarks: hallmarkNodes, pathways: pathwayNodes, levers: leverNodes };
}

export const mechanismAtlas: MechanismAtlas = buildMechanismAtlas();
