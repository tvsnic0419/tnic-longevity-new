import { citationRegistry } from './trust';
import { SITE } from './site';
import type { SourceCitation } from './types';

function bibTeXKey(c: SourceCitation): string {
  const author = (c.authors ?? 'unknown').split(/[\s,]+/)[0]?.toLowerCase() ?? 'unknown';
  return `${author}${c.year}_${c.id.replace(/[^a-z0-9]/gi, '_')}`;
}

export function citationToBibTeX(c: SourceCitation): string {
  const type =
    c.type === 'clinical' || c.type === 'preclinical'
      ? 'article'
      : c.type === 'guideline'
        ? 'misc'
        : 'article';

  const lines = [
    `@${type}{${bibTeXKey(c)},`,
    `  title = {${c.title}},`,
  ];

  if (c.authors) lines.push(`  author = {${c.authors}},`);
  lines.push(`  journal = {${c.journal}},`);
  lines.push(`  year = {${c.year}},`);
  if (c.pmid) lines.push(`  note = {PMID: ${c.pmid}},`);
  if (c.doi) lines.push(`  doi = {${c.doi}},`);
  if (c.pmid) {
    lines.push(`  url = {https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/},`);
  } else if (c.url) {
    lines.push(`  url = {${c.url}},`);
  }

  lines.push('}');
  return lines.join('\n');
}

export interface CitationExportBundle {
  exportedAt: string;
  source: string;
  site: string;
  count: number;
  citations: SourceCitation[];
}

export function buildCitationBibTeX(citations: SourceCitation[] = citationRegistry): string {
  const header = [
    `% TNiC Citation Registry — ${citations.length} entries`,
    `% Exported from ${SITE.url}/trust`,
    `% ${new Date().toISOString()}`,
    '',
  ].join('\n');

  return header + citations.map(citationToBibTeX).join('\n\n');
}

export function buildCitationJson(citations: SourceCitation[] = citationRegistry): string {
  const bundle: CitationExportBundle = {
    exportedAt: new Date().toISOString(),
    source: 'TNiC Citation Registry',
    site: SITE.url,
    count: citations.length,
    citations,
  };
  return JSON.stringify(bundle, null, 2);
}