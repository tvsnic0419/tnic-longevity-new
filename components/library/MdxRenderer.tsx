import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AlertTriangle,
  Eye,
  FlaskConical,
  ClipboardList,
  Lightbulb,
  OctagonX,
  ListTree,
  BookMarked,
} from 'lucide-react';
import type { EvidenceTier } from '@/lib/types';
import type { HallmarkVisualType } from '@/lib/hallmark-visuals';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { HallmarkIcon } from '@/components/library/HallmarkIcon';
import { PathwayDiagram } from '@/components/library/PathwayDiagram';
import { InterventionCompare } from '@/components/library/InterventionCompare';
import {
  LifestyleDecisionTree,
  parseDecisionNodes,
} from '@/components/library/LifestyleDecisionTree';
import { citationRegistry } from '@/lib/trust';
import { glossary } from '@/lib/data';
import { crossLinkTerms } from '@/lib/cross-links';

const PMID_PATTERN = /\bPMID:?\s?(\d{7,8})\b/g;
// Bare DOIs in prose (e.g. "DOI: 10.1038/s41586-020-2975-4" or "doi:10.1000/xyz").
// The DOI syntax allows a wide character set after the "10.NNNN/" prefix.
const DOI_PATTERN = /\bdoi:?\s?(10\.\d{4,9}\/[^\s)]+)/gi;
const LINK_CLASS =
  'text-accent-cyan hover:text-accent-emerald underline underline-offset-2 decoration-accent-cyan/40 hover:decoration-accent-emerald transition-colors';
const PMID_CLASS =
  'text-accent-emerald hover:text-accent-cyan font-medium no-underline hover:underline underline-offset-2';

function pubmedUrl(pmid: string): string {
  return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
}

function doiUrl(doi: string): string {
  return `https://doi.org/${doi.replace(/[.,;]+$/, '')}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Longest-term-first so e.g. "Epigenetic Clock" is tried before any shorter overlap. */
const GLOSSARY_TERMS_BY_LENGTH = [...glossary].sort((a, b) => b.term.length - a.term.length);

/**
 * Links the first on-page occurrence of each glossary term to an inline,
 * hover/focus tooltip carrying its plain-English definition — readers hit
 * jargon (AMPK, incretin, immunosenescence, ...) without leaving the page.
 * Only the first occurrence per page is linked (via the shared `linkedTerms`
 * set) so dense tables don't turn into a wall of underlined spans.
 */
function linkGlossaryTerms(text: string, linkedTerms: Set<string>): string {
  let out = text;
  for (const { term, simple } of GLOSSARY_TERMS_BY_LENGTH) {
    if (linkedTerms.has(term)) continue;
    const pattern = new RegExp(`(?<![a-zA-Z0-9])(${escapeRegExp(term)})(?![a-zA-Z0-9])`, 'i');
    if (!pattern.test(out)) continue;
    linkedTerms.add(term);
    out = out.replace(
      pattern,
      (matched) =>
        `<span class="glossary-term" tabindex="0">${matched}<span class="glossary-tooltip" role="tooltip">${escapeHtml(simple)} <a href="/learn?tab=glossary" class="glossary-tooltip-link">Full glossary →</a></span></span>`,
    );
  }
  return out;
}

/**
 * Inline markdown → HTML. Handles links, PMID citations, and first-occurrence
 * glossary tooltips in addition to emphasis/code. Links are tokenized out
 * first so later regexes (emphasis, PMID auto-linking, glossary linking)
 * never rewrite characters inside an href or double-wrap an already-linked
 * phrase.
 */
function renderInline(text: string, linkedTerms: Set<string>, inHeading = false): string {
  const tokens: string[] = [];
  const stash = (html: string): string => {
    tokens.push(html);
    return `\uE000T${tokens.length - 1}\uE000`;
  };

  let out = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
    const external = /^https?:\/\//.test(href);
    const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return stash(`<a href="${href}"${rel} class="${LINK_CLASS}">${label}</a>`);
  });

  out = out
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="text-accent-cyan bg-muted/50 px-1 rounded text-xs">$1</code>');

  out = out.replace(PMID_PATTERN, (_m, id: string) =>
    stash(
      `<a href="${pubmedUrl(id)}" target="_blank" rel="noopener noreferrer" class="${PMID_CLASS}">PMID ${id}</a>`,
    ),
  );

  out = out.replace(DOI_PATTERN, (_m, doi: string) => {
    const clean = doi.replace(/[.,;]+$/, '');
    return stash(
      `<a href="${doiUrl(clean)}" target="_blank" rel="noopener noreferrer" class="${PMID_CLASS}">DOI ${clean}</a>`,
    );
  });

  // Cross-link the first on-page mention of each compound/hallmark to its
  // deep-dive (skipped in headings and never a self-link). Runs after markdown
  // links and PMIDs are stashed, so already-linked names aren't re-wrapped.
  if (!inHeading) {
    for (const { name, href } of crossLinkTerms) {
      // Self-link is skipped via a pre-seeded `xlink:<selfHref>` key (see MdxRenderer).
      const key = `xlink:${href}`;
      if (linkedTerms.has(key)) continue;
      const pattern = new RegExp(`(?<![a-zA-Z0-9])(${escapeRegExp(name)})(?![a-zA-Z0-9])`, 'i');
      if (!pattern.test(out)) continue;
      linkedTerms.add(key);
      out = out.replace(pattern, (m) => stash(`<a href="${href}" class="${LINK_CLASS}">${m}</a>`));
    }
  }

  out = linkGlossaryTerms(out, linkedTerms);

  return out.replace(/\uE000T(\d+)\uE000/g, (_m, i: string) => tokens[Number(i)] ?? '');
}

/** Strip inline markdown (links/emphasis/code) down to its visible text. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1');
}

function slugify(text: string): string {
  return stripMarkdown(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Collect h2/h3 headings from prose blocks (directive bodies are excluded). */
function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  let insideDirective = false;

  for (const raw of content.split('\n')) {
    if (raw.startsWith(':::')) {
      insideDirective = !insideDirective;
      continue;
    }
    if (insideDirective) continue;

    const match = raw.match(/^(#{2,3})\s+(.*)$/);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const rawText = match[2].trim();
    let id = slugify(rawText);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    headings.push({ id, text: stripMarkdown(rawText), level });
  }
  return headings;
}

/** Ordered, de-duplicated PMIDs cited anywhere in the prose or directives. */
function extractPmids(content: string): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const match of content.matchAll(PMID_PATTERN)) {
    const pmid = match[1];
    if (!seen.has(pmid)) {
      seen.add(pmid);
      ordered.push(pmid);
    }
  }
  return ordered;
}

const citationByPmid = new Map(citationRegistry.map((c) => [c.pmid, c]));

const WORDS_PER_MINUTE = 200;

/** Rough word-count-based estimate — strips directive markers/attrs and
 * table separator rows so they don't inflate the count, then counts
 * whitespace-separated tokens at a standard ~200 wpm reading speed. */
function estimateReadingMinutes(content: string): number {
  const stripped = content
    .replace(/^:::.*$/gm, '')
    .replace(/^\|[\s-|]+\|$/gm, '')
    .replace(/[|#>*_`-]/g, ' ');
  const words = stripped.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function TableOfContents({ headings, readingMinutes }: { headings: Heading[]; readingMinutes: number }) {
  return (
    <nav
      aria-label="On this page"
      className="not-prose mb-8 rounded-xl border border-border bg-muted/20 p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ListTree className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
          <p className="text-micro font-mono uppercase tracking-wider text-muted-foreground">
            On this page
          </p>
        </div>
        <p className="text-micro font-mono uppercase tracking-wider text-muted-foreground">
          ~{readingMinutes} min read
        </p>
      </div>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${h.id}`}
              className="focus-ring rounded text-sm text-muted-foreground transition-colors hover:text-accent-cyan"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ReferencesSection({ pmids }: { pmids: string[] }) {
  return (
    <section aria-labelledby="references-heading" className="mt-12 border-t border-border pt-6">
      <div className="mb-4 flex items-center gap-2">
        <BookMarked className="h-4 w-4 text-accent-emerald" aria-hidden="true" />
        <h2 id="references-heading" className="text-lg font-semibold text-foreground">
          References
        </h2>
      </div>
      <ol className="list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
        {pmids.map((pmid) => {
          const cite = citationByPmid.get(pmid);
          return (
            <li key={pmid} className="leading-relaxed">
              {cite ? (
                <>
                  {cite.authors ? (
                    <span>{cite.authors.replace(/\.\s*$/, '')}. </span>
                  ) : null}
                  <span className="text-[var(--color-text-secondary)]">
                    {cite.title.replace(/\.\s*$/, '')}.
                  </span>{' '}
                  <em>{cite.journal}</em>
                  {cite.year ? <span> ({cite.year})</span> : null}.{' '}
                </>
              ) : null}
              <a
                href={pubmedUrl(pmid)}
                target="_blank"
                rel="noopener noreferrer"
                className={PMID_CLASS}
              >
                PMID {pmid}
              </a>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-xs text-muted-foreground">
        Links open PubMed. TNiC does not sell supplements; citations support education, not medical
        advice.
      </p>
    </section>
  );
}

function parseAttrs(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

type ParsedBlock =
  | { kind: 'directive'; type: string; attrs: Record<string, string>; body: string }
  | { kind: 'markdown'; content: string };

function parseBlocks(content: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  const lines = content.split('\n');
  let i = 0;
  let mdBuffer: string[] = [];

  const flushMd = () => {
    if (mdBuffer.length) {
      const joined = mdBuffer.join('\n').trim();
      if (joined) blocks.push({ kind: 'markdown', content: joined });
      mdBuffer = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith(':::')) {
      flushMd();
      const header = line.slice(3).trim();
      const spaceIdx = header.indexOf(' ');
      const type = spaceIdx > 0 ? header.slice(0, spaceIdx) : header;
      const attrString = spaceIdx > 0 ? header.slice(spaceIdx + 1) : '';
      const attrs = parseAttrs(attrString);
      if (!attrs.tier && /^[ABC]$/.test(type)) {
        attrs.tier = type;
      }
      i++;
      const bodyLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith(':::')) {
        bodyLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].startsWith(':::')) i++;
      blocks.push({ kind: 'directive', type: /^[ABC]$/.test(type) ? 'evidence' : type, attrs, body: bodyLines.join('\n').trim() });
    } else {
      mdBuffer.push(line);
      i++;
    }
  }
  flushMd();
  return blocks;
}

function renderDirective(
  block: Extract<ParsedBlock, { kind: 'directive' }>,
  key: number,
  linkedTerms: Set<string>,
) {
  const { type, attrs, body } = block;

  if (type === 'cta') {
    const href = attrs.href ?? '/stacks';
    const title = attrs.title ?? 'Take action';
    const variant = attrs.variant ?? 'primary';
    const isPrimary = variant === 'primary';
    return (
      <div
        key={key}
        className={`my-6 rounded-xl p-5 border ${
          isPrimary
            ? 'bg-accent-cyan/10 border-accent-cyan/30'
            : 'glass border-border'
        }`}
      >
        <p className="text-sm font-semibold text-foreground mb-2">{title}</p>
        {body && (
          <p
            className="text-sm text-muted-foreground mb-4"
            dangerouslySetInnerHTML={{ __html: renderInline(body, linkedTerms) }}
          />
        )}
        <Link
          href={href}
          className="focus-ring interactive inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan hover:text-accent-emerald rounded-md"
        >
          {attrs.label ?? 'Open'} <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  if (type === 'visual') {
    return (
      <div
        key={key}
        className="my-6 rounded-xl p-5 border border-accent-violet/20 bg-accent-violet/5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-accent-violet" aria-hidden="true" />
          <p className="text-micro font-mono text-accent-violet uppercase tracking-wider">Suggested visual</p>
        </div>
        <p
          className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderInline(body || attrs.description || '', linkedTerms) }}
        />
      </div>
    );
  }

  if (type === 'evidence') {
    const tier = (attrs.tier ?? 'B') as EvidenceTier;
    return (
      <div
        key={key}
        className="my-6 rounded-xl p-5 border border-border bg-muted/30"
      >
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
          <EvidenceTag tier={tier} size="sm" />
        </div>
        <p
          className="text-sm text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderInline(body, linkedTerms) }}
        />
      </div>
    );
  }

  if (type === 'warning') {
    return (
      <div
        key={key}
        className="my-6 rounded-xl p-5 border border-accent-amber/30 bg-accent-amber/5"
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-accent-amber" aria-hidden="true" />
          <p className="text-micro font-mono text-accent-amber uppercase tracking-wider">
            {attrs.title ?? 'Important'}
          </p>
        </div>
        <p
          className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderInline(body, linkedTerms) }}
        />
      </div>
    );
  }

  if (type === 'practical') {
    return (
      <div
        key={key}
        className="my-6 rounded-xl p-5 border border-accent-cyan/30 bg-accent-cyan/5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-accent-cyan" aria-hidden="true" />
          <p className="text-micro font-mono text-accent-cyan uppercase tracking-wider">
            {attrs.title ?? 'Practical application'}
          </p>
        </div>
        {renderMarkdownBlock(body, key, linkedTerms)}
      </div>
    );
  }

  if (type === 'redflag' || type === 'redflags') {
    return (
      <div
        key={key}
        className="my-6 rounded-xl p-5 border border-accent-rose/40 bg-accent-rose/8"
        role="alert"
      >
        <div className="flex items-center gap-2 mb-3">
          <OctagonX className="w-4 h-4 text-accent-rose" aria-hidden="true" />
          <p className="text-micro font-mono text-accent-rose uppercase tracking-wider">
            {attrs.title ?? 'Red flags'}
          </p>
        </div>
        {renderMarkdownBlock(body, key, linkedTerms)}
      </div>
    );
  }

  if (type === 'decision') {
    return (
      <div key={key} className="my-6">
        <LifestyleDecisionTree
          title={attrs.title ?? 'Decision tree'}
          nodes={parseDecisionNodes(body)}
        />
        <p className="mt-2 text-caption text-muted-foreground">
          Educational decision aid — a way to organize the evidence, not a prescription. Doses and
          timing shown are those used in studies; confirm anything you act on with a clinician or
          pharmacist.
        </p>
      </div>
    );
  }

  if (type === 'personal') {
    return (
      <div
        key={key}
        className="my-6 rounded-xl p-5 border border-accent-emerald/20 bg-accent-emerald/5"
      >
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
          <p className="text-micro font-mono text-accent-emerald uppercase tracking-wider">
            {attrs.title ?? 'Personal results template'}
          </p>
        </div>
        {renderMarkdownBlock(body, key, linkedTerms)}
      </div>
    );
  }

  if (type === 'pathway') {
    const nodeSpecs = (attrs.nodes ?? body.split('\n')[0] ?? '').split(',').filter(Boolean);
    const edgeSpecs = (attrs.edges ?? body.split('\n')[1] ?? '').split(',').filter(Boolean);
    const nodes = nodeSpecs.map((spec, i) => {
      const [label, sublabel, accent] = spec.split('|').map((s) => s.trim());
      return {
        id: `n${i}`,
        label: label ?? spec,
        sublabel: sublabel || undefined,
        accent: (accent as 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose') || undefined,
      };
    });
    const edges = edgeSpecs.map((spec) => {
      const [pair, label] = spec.split('|').map((s) => s.trim());
      const [fromLabel, toLabel] = (pair ?? '').split('->').map((s) => s.trim());
      const fromIdx = nodes.findIndex((n) => n.label === fromLabel);
      const toIdx = nodes.findIndex((n) => n.label === toLabel);
      return {
        from: fromIdx >= 0 ? `n${fromIdx}` : 'n0',
        to: toIdx >= 0 ? `n${toIdx}` : 'n0',
        label: label || undefined,
      };
    });
    return (
      <div key={key} className="my-6">
        <PathwayDiagram title={attrs.title} nodes={nodes} edges={edges} />
      </div>
    );
  }

  if (type === 'compare') {
    const rows = body.split('\n').filter((l) => l.includes('|'));
    const metrics = rows.map((row) => {
      const [label, before, after] = row.split('|').map((s) => s.trim());
      return { label: label ?? '', before: before ?? '', after: after ?? '', improved: true };
    });
    return (
      <div key={key} className="my-6">
        <InterventionCompare
          title={attrs.title}
          beforeLabel={attrs.before}
          afterLabel={attrs.after}
          summary={attrs.summary}
          metrics={metrics}
        />
      </div>
    );
  }

  if (type === 'hallmark') {
    const visual = (attrs.type ?? 'dna') as HallmarkVisualType;
    return (
      <div
        key={key}
        className="my-6 flex items-center gap-4 rounded-xl border border-border bg-card/40 p-4"
      >
        <HallmarkIcon type={visual} size={48} />
        <div>
          <p className="text-sm font-semibold text-foreground">{attrs.title ?? 'Hallmark'}</p>
          {body && (
            <p
              className="text-sm text-muted-foreground mt-1"
              dangerouslySetInnerHTML={{ __html: renderInline(body, linkedTerms) }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div key={key} className="my-4 text-sm text-muted-foreground font-mono">
      [{type}] {body}
    </div>
  );
}

function renderMarkdownBlock(content: string, blockKey: number, linkedTerms: Set<string>) {
  const paragraphs = content.split(/\n\n+/);
  const elements: ReactNode[] = [];

  paragraphs.forEach((block, i) => {
    const key = `${blockKey}-${i}`;
    const trimmed = block.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key} className="text-2xl font-bold tracking-tight text-balance mt-2 mb-4 text-foreground">
          {trimmed.slice(2)}
        </h1>,
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3);
      const numbered = text.match(/^(\d+)\.\s+(.*)$/);
      elements.push(
        <h2
          key={key}
          id={slugify(text)}
          className="scroll-mt-24 mt-8 mb-3 flex items-baseline gap-3 text-xl font-bold text-foreground"
        >
          {numbered ? (
            <>
              <span className="shrink-0 font-mono text-sm text-accent-cyan" aria-hidden="true">
                {numbered[1].padStart(2, '0')}
              </span>
              <span className="text-balance" dangerouslySetInnerHTML={{ __html: renderInline(numbered[2], linkedTerms, true) }} />
            </>
          ) : (
            <span className="text-balance" dangerouslySetInnerHTML={{ __html: renderInline(text, linkedTerms, true) }} />
          )}
        </h2>,
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4);
      elements.push(
        <h3
          key={key}
          id={slugify(text)}
          className="scroll-mt-24 text-lg font-semibold tracking-tight text-balance mt-6 mb-2 text-foreground"
          dangerouslySetInnerHTML={{ __html: renderInline(text, linkedTerms, true) }}
        />,
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={key}
          className="border-l-2 border-accent-cyan/50 pl-4 my-4 text-sm text-muted-foreground italic text-pretty"
          dangerouslySetInnerHTML={{ __html: renderInline(trimmed.slice(2), linkedTerms) }}
        />,
      );
      return;
    }

    if (trimmed.startsWith('|')) {
      const rows = trimmed.split('\n').filter((r) => !r.match(/^\|[\s-|]+\|$/));
      const headerCells = rows[0]?.split('|').filter(Boolean).map((c) => c.trim()) ?? [];
      elements.push(
        <div key={key} className="my-4">
          <div className="overflow-x-auto" role="region" aria-label="Data table">
            <table className="w-full text-sm border-collapse">
              {rows.length > 0 && (
                <thead>
                  <tr className="border-b border-accent-cyan/20">
                    {headerCells.map((cell, ci) => (
                      <th
                        key={ci}
                        scope="col"
                        className="py-2 px-3 text-left text-micro font-mono text-muted-foreground uppercase whitespace-nowrap"
                        dangerouslySetInnerHTML={{ __html: renderInline(cell, linkedTerms) }}
                      />
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {rows.slice(1).map((row, ri) => {
                  const cells = row.split('|').filter(Boolean).map((c) => c.trim());
                  return (
                    <tr key={ri} className="border-b border-border even:bg-muted/20 hover:bg-muted/40 transition-colors">
                      {cells.map((cell, ci) => (
                        <td
                          key={ci}
                          className="py-2 px-3 text-left text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: renderInline(cell, linkedTerms) }}
                        />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {headerCells.length > 3 && (
            <p className="mt-1.5 text-micro font-mono uppercase tracking-wider text-muted-foreground md:hidden">
              ← Swipe for more columns →
            </p>
          )}
        </div>,
      );
      return;
    }

    if (trimmed.match(/^\d+\.\s/)) {
      const items = trimmed.split('\n').filter((l) => l.match(/^\d+\.\s/));
      elements.push(
        <ol key={key} className="list-decimal list-inside space-y-1 my-4 text-sm text-muted-foreground">
          {items.map((item, li) => (
            <li key={li} dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^\d+\.\s/, ''), linkedTerms) }} />
          ))}
        </ol>,
      );
      return;
    }

    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-1 my-4 text-sm text-muted-foreground">
          {items.map((item, li) => (
            <li key={li} dangerouslySetInnerHTML={{ __html: renderInline(item.slice(2), linkedTerms) }} />
          ))}
        </ul>,
      );
      return;
    }

    elements.push(
      <p
        key={key}
        className="text-sm text-muted-foreground leading-relaxed text-pretty my-3"
        dangerouslySetInnerHTML={{ __html: renderInline(trimmed, linkedTerms) }}
      />,
    );
  });

  return <>{elements}</>;
}

export function MdxRenderer({
  content,
  showToc = true,
  showReferences = true,
  selfHref,
}: {
  content: string;
  showToc?: boolean;
  showReferences?: boolean;
  /** This page's own href, so the prose cross-linker never self-links. */
  selfHref?: string;
}) {
  const blocks = parseBlocks(content);
  const elements: ReactNode[] = [];
  const linkedTerms = new Set<string>();
  // Pre-seed the current page's own cross-link key so the prose cross-linker
  // never self-links (e.g. the NMN page won't link the word "NMN" to itself).
  if (selfHref) linkedTerms.add(`xlink:${selfHref}`);

  blocks.forEach((block, i) => {
    if (block.kind === 'directive') {
      elements.push(renderDirective(block, i, linkedTerms));
    } else {
      elements.push(<div key={i}>{renderMarkdownBlock(block.content, i, linkedTerms)}</div>);
    }
  });

  const headings = showToc ? extractHeadings(content) : [];
  const pmids = showReferences ? extractPmids(content) : [];
  const readingMinutes = estimateReadingMinutes(content);

  return (
    <article className="max-w-none">
      {headings.length >= 3 && <TableOfContents headings={headings} readingMinutes={readingMinutes} />}
      {elements}
      {pmids.length > 0 && <ReferencesSection pmids={pmids} />}
    </article>
  );
}