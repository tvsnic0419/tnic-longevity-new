'use client';

import { GitBranch, HelpCircle, AlertOctagon } from 'lucide-react';

export interface DecisionNode {
  kind: 'question' | 'branch' | 'redflag';
  label: string;
  depth: number;
}

interface LifestyleDecisionTreeProps {
  title?: string;
  nodes: DecisionNode[];
}

export function LifestyleDecisionTree({ title, nodes }: LifestyleDecisionTreeProps) {
  return (
    <div className="my-6 card-premium p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <GitBranch className="w-4 h-4 text-accent-violet" aria-hidden="true" />
        <p className="text-label text-accent-violet">{title ?? 'Decision tree'}</p>
      </div>

      <div className="space-y-2">
        {nodes.map((node, i) => {
          const isQuestion = node.kind === 'question';
          const isRedflag = node.kind === 'redflag';
          const branchMatch = node.label.match(/^(YES|NO|IF|ELSE)\s*→\s*(.+)$/i);

          return (
            <div
              key={i}
              style={{ marginLeft: `${node.depth * 1.25}rem` }}
              className={[
                'rounded-xl px-4 py-3 border transition-colors',
                isQuestion
                  ? 'border-accent-violet/30 bg-accent-violet/8'
                  : isRedflag
                    ? 'border-accent-rose/35 bg-accent-rose/8'
                    : 'border-border/50 bg-muted/20',
              ].join(' ')}
            >
              <div className="flex items-start gap-2.5">
                {isQuestion && (
                  <HelpCircle className="w-4 h-4 text-accent-violet shrink-0 mt-0.5" aria-hidden="true" />
                )}
                {isRedflag && (
                  <AlertOctagon className="w-4 h-4 text-accent-rose shrink-0 mt-0.5" aria-hidden="true" />
                )}
                {node.kind === 'branch' && branchMatch && (
                  <span
                    className={[
                      'text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0',
                      branchMatch[1].toUpperCase() === 'YES'
                        ? 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/25'
                        : branchMatch[1].toUpperCase() === 'NO'
                          ? 'bg-accent-amber/15 text-accent-amber border border-accent-amber/25'
                          : 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25',
                    ].join(' ')}
                  >
                    {branchMatch[1].toUpperCase()}
                  </span>
                )}
                <p
                  className={[
                    'text-sm leading-relaxed',
                    isQuestion ? 'font-semibold text-foreground' : '',
                    isRedflag ? 'font-semibold text-accent-rose' : 'text-muted-foreground',
                  ].join(' ')}
                  dangerouslySetInnerHTML={{
                    __html: (branchMatch ? branchMatch[2] : node.label)
                      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                      .replace(
                        /\[([^\]]+)\]\(([^)]+)\)/g,
                        '<a href="$2" class="text-accent-cyan hover:text-accent-emerald underline underline-offset-2">$1</a>',
                      ),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function parseDecisionNodes(body: string): DecisionNode[] {
  const lines = body.split('\n').filter((l) => l.trim());
  const nodes: DecisionNode[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    const depth = Math.floor((line.length - line.trimStart().length) / 2);
    const lower = trimmed.toLowerCase();

    if (lower.startsWith('redflag |')) {
      nodes.push({ kind: 'redflag', label: trimmed.slice(9).trim(), depth });
      return;
    }
    if (lower.startsWith('node |')) {
      nodes.push({ kind: 'question', label: trimmed.slice(6).trim(), depth });
      return;
    }
    const branchMatch = trimmed.match(/^(yes|no|if|else)\s*\|\s*(.+)$/i);
    if (branchMatch) {
      nodes.push({
        kind: 'branch',
        label: `${branchMatch[1].toUpperCase()} → ${branchMatch[2].trim()}`,
        depth,
      });
      return;
    }
    if (trimmed.endsWith('?')) {
      nodes.push({ kind: 'question', label: trimmed, depth });
      return;
    }
    nodes.push({ kind: 'branch', label: trimmed, depth });
  });

  return nodes;
}