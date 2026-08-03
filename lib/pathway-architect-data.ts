/**
 * Pathway Architect — starter stacks + shareable-URL helpers.
 *
 * Pathway Architect is its own tool (distinct from the Compound Intelligence
 * Engine at /compound-engine), but deliberately reuses the engine's curated
 * dataset (`COMPOUND_DB`, `analyzeStack`, `SYNERGY_PAIRS`) rather than
 * re-curating pathway/hallmark tags for a second time — that data only exists
 * once, reviewed once, in `lib/compound-engine-data.ts`.
 */
import { resolveCompound, type Compound } from './compound-engine-data';

export interface StarterStack {
  key: string;
  label: string;
  desc: string;
  ids: string[];
}

/**
 * Every id below is chosen so the pairing is already a curated entry in
 * `SYNERGY_PAIRS` — these are real, reviewed mechanistic pairings, not
 * marketing groupings invented for this page.
 */
export const STARTER_STACKS: StarterStack[] = [
  {
    key: 'nad-trinity',
    label: 'NAD+ Trinity',
    desc: 'A precursor, its methyl-donor buffer, and a CD38 brake — three distinct routes to raising and holding the NAD+ pool.',
    ids: ['nmn', 'tmg', 'apigenin'],
  },
  {
    key: 'mito-triple',
    label: 'Mitochondrial Triple',
    desc: 'Biogenesis signal (PQQ), electron-transport-chain cofactor (CoQ10), and mitophagy (Urolithin A) — grow new mitochondria and clear the damaged ones.',
    ids: ['pqq', 'coq10', 'urolithina'],
  },
  {
    key: 'sirtuin-duo',
    label: 'Sirtuin Duo',
    desc: "Resveratrol's SIRT1 signal, paired with the oral bioavailability it lacks on its own.",
    ids: ['resveratrol', 'pterostilbene'],
  },
  {
    key: 'senolytic-duo',
    label: 'Senolytic Duo',
    desc: 'Two senolytic flavonoids stacked to broaden senescent-cell clearance beyond either alone.',
    ids: ['fisetin', 'quercetin'],
  },
];

/** Query param for a shareable protocol — e.g. ?p=nmn,tmg,resveratrol */
export const PATHWAY_PARAM = 'p';

/**
 * Parse the `?p=` param into resolved compounds. Reuses the engine's
 * cross-namespace id/alias/name resolution, so a link built from any of the
 * site's id spellings still resolves. Unknown tokens are dropped.
 */
export function parsePathwayParam(param: string | null | undefined): Compound[] {
  if (!param) return [];
  const seen = new Set<string>();
  const out: Compound[] = [];
  for (const token of param.split(',')) {
    const c = resolveCompound(token);
    if (c && !seen.has(c.id)) {
      seen.add(c.id);
      out.push(c);
    }
  }
  return out;
}

export function buildPathwayArchitectUrl(ids: string[]): string {
  return ids.length > 0
    ? `/tools/pathway-architect?${PATHWAY_PARAM}=${ids.join(',')}`
    : '/tools/pathway-architect';
}
