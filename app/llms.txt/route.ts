import { SITE } from '@/lib/site';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { compoundModules, getModulePath } from '@/lib/library-modules';
import { evidenceComparisons } from '@/lib/comparisons';
import { peptideLibrary } from '@/lib/peptides-library';
import { PRIORITY_INDEX_PATHS } from '@/lib/index-priority';

/**
 * /llms.txt — a clean, structured map of the site for LLM assistants
 * (ChatGPT, Claude, Perplexity, Gemini, …), per the llmstxt.org convention.
 *
 * In this niche, AI assistants are an increasingly large discovery/referral
 * channel: people ask "what's the evidence for NMN?" and the assistant cites
 * whatever it can parse cleanly. This file makes TNiC that easy-to-cite source.
 * Generated from the same registries the site renders from, so it never drifts.
 */

export const dynamic = 'force-static';

const u = (path: string) => `${SITE.url}${path}`;

function build(): string {
  const lines: string[] = [];

  lines.push(`# ${SITE.fullName}`);
  lines.push('');
  lines.push(
    '> Independent, PubMed-backed longevity library. Nutrients and compounds graded A/B/C by the strength of human evidence, mapped to the 12 hallmarks of aging, with the doses actually studied. Not a supplement seller — no inventory, no health-data sales. Free, local-first, no account.',
  );
  lines.push('');
  lines.push(
    'Evidence tiers: **A** = multiple human RCTs · **B** = at least one human trial + mechanism · **C** = mechanistic / animal only. Every claim links to its PubMed source. TNiC is educational, not medical advice.',
  );
  lines.push('');
  lines.push(`Machine-readable compound dataset: ${u('/compounds.json')}`);
  lines.push('');

  lines.push('## Start here');
  lines.push(`- [NICO Starter Questionnaire](${u('/nico')}): personalized, evidence-graded stack computed from your goals, lifestyle, focus areas, and a safety screen.`);
  lines.push(`- [The 12 Hallmarks of Aging](${u('/hallmarks')}): the mechanistic framework (López-Otín 2013/2023) the whole library is organized around.`);
  lines.push(`- [Compound library](${u('/library/compounds')}): every evidence-graded compound with dosing, synergies, and citations.`);
  lines.push(`- [How TNiC grades evidence](${u('/trust/methodology')}): the A/B/C rubric, in full.`);
  lines.push('');

  lines.push('## Hallmarks of aging');
  for (const h of [...hallmarkLibrary].sort((a, b) => a.number - b.number)) {
    lines.push(`- [${h.title}](${u(`/hallmarks/${h.slug}`)}): ${h.tagline}`);
  }
  lines.push('');

  lines.push('## Evidence-graded compounds');
  for (const m of compoundModules) {
    lines.push(`- [${m.title}](${u(getModulePath(m))}) — Tier ${m.evidenceTier}: ${m.tagline}`);
  }
  lines.push('');

  lines.push('## Head-to-head evidence comparisons');
  for (const c of evidenceComparisons) {
    lines.push(`- [${c.title}](${u(`/library/compare/${c.slug}`)}): ${c.subtitle}`);
  }
  lines.push('');

  lines.push('## Peptides (evidence + legal status stated plainly)');
  for (const p of peptideLibrary) {
    lines.push(`- [${p.name}](${u(`/peptides/${p.slug}`)}) — Tier ${p.evidenceTier}: ${p.tagline}`);
  }
  lines.push('');

  lines.push('## High-intent guides');
  for (const path of PRIORITY_INDEX_PATHS.filter((p) => p.endsWith('-guide') || p.endsWith('guides'))) {
    lines.push(`- ${u(path)}`);
  }
  lines.push('');

  lines.push('## Trust & transparency');
  lines.push(`- [Methodology & evidence tiers](${u('/trust/methodology')})`);
  lines.push(`- [Citation registry](${u('/trust')})`);
  lines.push(`- [Corrections](${u('/corrections')})`);
  lines.push(`- [Editorial policy](${u('/editorial-policy')})`);
  lines.push(`- [Sitemap](${u('/sitemap.xml')})`);
  lines.push('');

  lines.push(`Contact: ${SITE.contactEmail}`);
  lines.push('');

  return lines.join('\n');
}

export function GET(): Response {
  return new Response(build(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
