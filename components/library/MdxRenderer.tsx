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

function renderInline(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="text-accent-cyan bg-muted/50 px-1 rounded text-xs">$1</code>');
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

function renderDirective(block: Extract<ParsedBlock, { kind: 'directive' }>, key: number) {
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
            dangerouslySetInnerHTML={{ __html: renderInline(body) }}
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
          <p className="text-[10px] font-mono text-accent-violet uppercase tracking-wider">Suggested visual</p>
        </div>
        <p
          className="text-sm text-foreground/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderInline(body || attrs.description || '') }}
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
          dangerouslySetInnerHTML={{ __html: renderInline(body) }}
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
          <p className="text-[10px] font-mono text-accent-amber uppercase tracking-wider">
            {attrs.title ?? 'Important'}
          </p>
        </div>
        <p
          className="text-sm text-foreground/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderInline(body) }}
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
          <p className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider">
            {attrs.title ?? 'Practical application'}
          </p>
        </div>
        {renderMarkdownBlock(body, key)}
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
          <p className="text-[10px] font-mono text-accent-rose uppercase tracking-wider">
            {attrs.title ?? 'Red flags'}
          </p>
        </div>
        {renderMarkdownBlock(body, key)}
      </div>
    );
  }

  if (type === 'decision') {
    return (
      <LifestyleDecisionTree
        key={key}
        title={attrs.title ?? 'Decision tree'}
        nodes={parseDecisionNodes(body)}
      />
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
          <p className="text-[10px] font-mono text-accent-emerald uppercase tracking-wider">
            {attrs.title ?? 'Personal results template'}
          </p>
        </div>
        {renderMarkdownBlock(body, key)}
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
              dangerouslySetInnerHTML={{ __html: renderInline(body) }}
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

function renderMarkdownBlock(content: string, blockKey: number) {
  const paragraphs = content.split(/\n\n+/);
  const elements: ReactNode[] = [];

  paragraphs.forEach((block, i) => {
    const key = `${blockKey}-${i}`;
    const trimmed = block.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key} className="text-2xl font-bold mt-2 mb-4 text-foreground">
          {trimmed.slice(2)}
        </h1>,
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key} className="text-xl font-bold mt-8 mb-3 text-foreground">
          {trimmed.slice(3)}
        </h2>,
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key} className="text-lg font-semibold mt-6 mb-2 text-foreground">
          {trimmed.slice(4)}
        </h3>,
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={key}
          className="border-l-2 border-accent-cyan/50 pl-4 my-4 text-sm text-muted-foreground italic"
          dangerouslySetInnerHTML={{ __html: renderInline(trimmed.slice(2)) }}
        />,
      );
      return;
    }

    if (trimmed.startsWith('|')) {
      const rows = trimmed.split('\n').filter((r) => !r.match(/^\|[\s-|]+\|$/));
      const headerCells = rows[0]?.split('|').filter(Boolean).map((c) => c.trim()) ?? [];
      elements.push(
        <div key={key} className="overflow-x-auto my-4" role="region" aria-label="Data table">
          <table className="w-full text-sm border-collapse">
            {rows.length > 0 && (
              <thead>
                <tr className="border-b border-border">
                  {headerCells.map((cell, ci) => (
                    <th
                      key={ci}
                      scope="col"
                      className="py-2 px-3 text-left text-[10px] font-mono text-muted-foreground uppercase"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.slice(1).map((row, ri) => {
                const cells = row.split('|').filter(Boolean).map((c) => c.trim());
                return (
                  <tr key={ri} className="border-b border-border">
                    {cells.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-left text-muted-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>,
      );
      return;
    }

    if (trimmed.match(/^\d+\.\s/)) {
      const items = trimmed.split('\n').filter((l) => l.match(/^\d+\.\s/));
      elements.push(
        <ol key={key} className="list-decimal list-inside space-y-1 my-4 text-sm text-muted-foreground">
          {items.map((item, li) => (
            <li key={li} dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^\d+\.\s/, '')) }} />
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
            <li key={li} dangerouslySetInnerHTML={{ __html: renderInline(item.slice(2)) }} />
          ))}
        </ul>,
      );
      return;
    }

    elements.push(
      <p
        key={key}
        className="text-sm text-muted-foreground leading-relaxed my-3"
        dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
      />,
    );
  });

  return <>{elements}</>;
}

export function MdxRenderer({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  const elements: ReactNode[] = [];

  blocks.forEach((block, i) => {
    if (block.kind === 'directive') {
      elements.push(renderDirective(block, i));
    } else {
      elements.push(<div key={i}>{renderMarkdownBlock(block.content, i)}</div>);
    }
  });

  return <article className="max-w-none">{elements}</article>;
}