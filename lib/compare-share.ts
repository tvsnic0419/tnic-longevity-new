import type { CompareVerdict, EvidenceComparison } from './comparisons';
import { SITE } from './site';

const verdictShort: Record<CompareVerdict, string> = {
  a: 'A edge',
  b: 'B edge',
  tie: 'Even',
  context: 'Context-dependent',
};

export function buildCompareShareUrl(slug: string): string {
  return `${SITE.url}/library/compare/${slug}`;
}

/** One-line OG / social preview */
export function buildCompareOgSnippet(comp: EvidenceComparison): string {
  return `${comp.title} — Tier ${comp.evidenceTier} evidence comparison. ${comp.verdict}`;
}

export function buildCompareShareText(comp: EvidenceComparison): string {
  const url = buildCompareShareUrl(comp.slug);
  const highlights = comp.rows
    .slice(0, 3)
    .map((r) => `• ${r.dimension}: ${verdictShort[r.verdict]}`)
    .join('\n');

  return [
    `${comp.title} (${comp.labelA} vs ${comp.labelB})`,
    comp.subtitle,
    '',
    comp.verdict,
    '',
    highlights,
    '',
    url,
    '',
    '#longevity #evidence #TNiC',
  ].join('\n');
}

export function buildCompareShareMarkdown(comp: EvidenceComparison): string {
  const url = buildCompareShareUrl(comp.slug);
  const ogImage = `${SITE.url}/library/compare/${comp.slug}/opengraph-image`;

  const tableRows = comp.rows
    .map(
      (r) =>
        `| ${r.dimension} | ${r.a.replace(/\|/g, '\\|')} | ${r.b.replace(/\|/g, '\\|')} | ${verdictShort[r.verdict]}${r.pmid ? ` ([PMID ${r.pmid}](https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/))` : ''} |`,
    )
    .join('\n');

  const chooseA = comp.whenChooseA.map((x) => `- ${x}`).join('\n');
  const chooseB = comp.whenChooseB.map((x) => `- ${x}`).join('\n');
  const related = comp.relatedHrefs.map((l) => `- [${l.label}](${SITE.url}${l.href})`).join('\n');

  return `# ${comp.title}

> ${comp.subtitle}

**Evidence tier:** ${comp.evidenceTier} · **Category:** ${comp.category}

${comp.summary}

## TNiC verdict

${comp.verdict}

## Comparison table

| Dimension | ${comp.labelA} | ${comp.labelB} | Verdict |
| --- | --- | --- | --- |
${tableRows}

## Choose ${comp.labelA} when

${chooseA}

## Choose ${comp.labelB} when

${chooseB}

## Related

${related}

---

Read online: [${url}](${url})  
OG preview: ${ogImage}

*Educational only — not medical advice. TNiC may earn a commission on affiliate product links at no extra cost to you.*
`;
}