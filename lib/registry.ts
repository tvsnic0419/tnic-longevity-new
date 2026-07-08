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
  | 'healthspan';

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
];

export function getToolById(id: ToolId): ToolRegistryEntry | undefined {
  return toolsRegistry.find((t) => t.id === id);
}

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