import { SITE } from '@/lib/site';
import { compoundModules, getModulePath } from '@/lib/library-modules';
import { compounds } from '@/lib/data';
import { hallmarkLibrary } from '@/lib/hallmarks-library';

/**
 * /compounds.json — the evidence-graded compound library as clean, structured
 * data. Lets LLM assistants, aggregators, and researchers ingest TNiC's grading
 * without scraping HTML, reinforcing TNiC as the citeable source in this niche.
 * Built from the same registries the pages render from.
 */

export const dynamic = 'force-static';

const hallmarkTitle = new Map(hallmarkLibrary.map((h) => [h.id, h.title]));
const dataById = new Map(compounds.map((c) => [c.id, c]));

function build() {
  const items = compoundModules.map((m) => {
    const detail = dataById.get(m.compoundId ?? m.slug);
    return {
      slug: m.slug,
      name: m.title,
      url: `${SITE.url}${getModulePath(m)}`,
      evidenceTier: m.evidenceTier,
      summary: m.summary,
      hallmarks: m.relatedHallmarkIds.map((id) => hallmarkTitle.get(id) ?? id),
      ...(detail
        ? {
            pathway: detail.pathway,
            dose: detail.dose,
            timing: detail.timing,
            bioavailabilityPct: detail.bioavailability ?? null,
            pmids: [...new Set((detail.studies ?? []).map((s) => s.pmid).filter(Boolean))],
          }
        : {}),
    };
  });

  return {
    name: `${SITE.fullName} — compound library`,
    description:
      'Evidence-graded longevity compounds (A/B/C human-evidence tiers) mapped to the 12 hallmarks of aging, with studied doses and PubMed citations.',
    url: `${SITE.url}/library/compounds`,
    license: `${SITE.url}/terms`,
    evidenceTiers: {
      A: 'Multiple human RCTs',
      B: 'At least one human trial plus mechanistic support',
      C: 'Mechanistic or animal evidence only',
    },
    count: items.length,
    generated: new Date().toISOString().slice(0, 10),
    compounds: items,
  };
}

export function GET(): Response {
  return new Response(JSON.stringify(build(), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
