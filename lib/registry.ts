/**
 * Central registries for content modules and interactive tools.
 * Add new tools or library categories here — routing/UI picks them up automatically.
 */

import type { LibraryModuleCategory } from './library-modules';
import { libraryModules, libraryCategoryMeta } from './library-modules';

export type ToolId =
  | 'simulator'
  | 'network'
  | 'protocol'
  | 'biomarker'
  | 'impact'
  | 'healthspan'
  | 'inventory';

export interface ToolRegistryEntry {
  id: ToolId;
  slug: ToolId;
  label: string;
  shortLabel: string;
  description: string;
  href: string;
  keywords: string[];
  evidenceNote: string;
  badge?: string;
}

export const toolsRegistry: ToolRegistryEntry[] = [
  {
    id: 'simulator',
    slug: 'simulator',
    label: 'Stack Simulator',
    shortLabel: 'Synergy + risk',
    description:
      'Real-time synergy scoring, pair-level interaction checks, age-adjusted dosing, and side-effect risk index.',
    href: '/tools?tab=simulator',
    keywords: ['supplement synergy', 'drug interaction checker', 'stack dosing'],
    evidenceNote: 'Uses Tier A/B compound safety database and published trial dose ranges.',
  },
  {
    id: 'network',
    slug: 'network',
    label: 'Stack Network',
    shortLabel: 'Conflict graph',
    description:
      'Visual synergy and conflict network — interactive graph of compound interactions, cautions, and contraindications.',
    href: '/tools?tab=network',
    keywords: ['supplement interaction graph', 'stack conflict analyzer', 'synergy network'],
    evidenceNote: 'Pair-level edges from TNiC interaction database plus documented compound synergies.',
    badge: 'New',
  },
  {
    id: 'protocol',
    slug: 'protocol',
    label: 'Protocol Engine',
    shortLabel: 'AI-like planner',
    description:
      'Rule-based recommendation engine: goals, labs, lifestyle → multi-phase, multi-pathway protocol with transparent reasoning chain.',
    href: '/tools?tab=protocol',
    keywords: ['longevity protocol', 'personalized supplement plan', 'hallmarks protocol'],
    evidenceNote: 'Deterministic rule engine — not generative AI. Full reasoning trace for every recommendation.',
    badge: 'Advanced',
  },
  {
    id: 'biomarker',
    slug: 'biomarker',
    label: 'Biomarker Dashboard',
    shortLabel: 'Trends + forecast',
    description:
      'Dynamic lab trends, intervention impact forecasts, and ranked scenarios — with strong educational disclaimers.',
    href: '/tools?tab=biomarker',
    keywords: ['biomarker optimization', 'lab trend analysis', 'intervention forecast'],
    evidenceNote: 'Forecasts are illustrative models from published effect sizes — not clinical predictions.',
    badge: 'Advanced',
  },
  {
    id: 'impact',
    slug: 'impact',
    label: 'Biomarker Impact',
    shortLabel: 'Intervention ranking',
    description:
      'Rank supplements and lifestyle levers by modeled impact on each biomarker — with hallmark pathway mapping.',
    href: '/tools?tab=impact',
    keywords: ['biomarker impact', 'intervention ranking', 'supplement effect size'],
    evidenceNote: 'Effect sizes from published trials — illustrative, not predictive.',
    badge: 'New',
  },
  {
    id: 'healthspan',
    slug: 'healthspan',
    label: 'Healthspan Estimator',
    shortLabel: '24w projection',
    description:
      'Project healthspan score and biological age over 12–24 weeks from profile, stack, and labs.',
    href: '/tools?tab=healthspan',
    keywords: ['healthspan calculator', 'biological age estimate', 'longevity projection'],
    evidenceNote: 'Educational model based on trial timelines — not a medical prediction.',
  },
  {
    id: 'inventory',
    slug: 'inventory',
    label: 'Inventory Forecast',
    shortLabel: 'Stock + reorder',
    description:
      'Project supply requirements for your active stack over a 24-week cycle: adherence-weighted consumption, container counts, and reorder cadence.',
    href: '/tools?tab=inventory',
    keywords: ['supplement inventory calculator', 'reorder cadence', 'stack supply planner'],
    evidenceNote: 'Deterministic arithmetic from compound dose timing and your adherence input.',
    badge: 'New',
  },
];

export function getToolById(id: ToolId): ToolRegistryEntry | undefined {
  return toolsRegistry.find((t) => t.id === id);
}

/**
 * Standalone advanced-tool hubs featured from `/tools`. Not tabs of the tools
 * hub — each is its own top-level route — but rendered as "Featured tool"
 * cards on the hub. Listed here so `toolsRegistry.length + featuredAdvancedTools.length`
 * gives a single-source-of-truth count that never drifts from what a visitor
 * actually sees on the page.
 */
export interface FeaturedAdvancedTool {
  id: 'elite-8' | 'compound-engine' | 'pathway-architect';
  href: string;
  label: string;
  description: string;
  accent: 'amber' | 'cyan' | 'violet';
  cta: string;
}

export const featuredAdvancedTools: FeaturedAdvancedTool[] = [
  {
    id: 'elite-8',
    href: '/elite-8',
    label: 'Elite 8 Longevity Quotient',
    description:
      'Eight interventions ranked by modeled LQ score — head-to-head compare, weight tuner, Rx disclaimers, and links to evidence modules.',
    accent: 'amber',
    cta: 'Open ranking',
  },
  {
    id: 'compound-engine',
    href: '/compound-engine',
    label: 'Compound Intelligence Engine',
    description:
      'Score any compound on evidence, effect, breadth, bioavailability and safety — then resolve stack synergy, interaction cautions, and coverage across all 12 hallmarks of aging.',
    accent: 'cyan',
    cta: 'Open engine',
  },
  {
    id: 'pathway-architect',
    href: '/tools/pathway-architect',
    label: 'Pathway Architect',
    description:
      'Build a protocol from curated compounds mapped to molecular pathways — live synergy, redundancy, and interaction cautions, hallmark coverage, and a shareable link.',
    accent: 'violet',
    cta: 'Open builder',
  },
];

/** Total tool count as a visitor experiences it: hub tabs + featured hubs. */
export const totalToolCount = toolsRegistry.length + featuredAdvancedTools.length;

export function getLibraryCatalog() {
  return {
    categories: libraryCategoryMeta,
    modules: libraryModules,
    counts: {
      compounds: libraryModules.filter((m) => m.category === 'compounds').length,
      synergies: libraryModules.filter((m) => m.category === 'synergies').length,
      lifestyle: libraryModules.filter((m) => m.category === 'lifestyle').length,
      guides: libraryModules.filter((m) => m.category === 'guides').length,
      total: libraryModules.length,
    },
  };
}

export type { LibraryModuleCategory };