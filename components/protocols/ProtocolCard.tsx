import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import type { Protocol } from '@/lib/protocols';
import type { ThemeAccent } from '@/lib/design-system';
import { libraryModuleTitles } from '@/lib/breadcrumb-titles';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

const ACCENT: Record<ThemeAccent, string> = {
  cyan: 'var(--accent-cyan)',
  emerald: 'var(--accent-emerald)',
  violet: 'var(--accent-violet)',
  rose: 'var(--accent-rose)',
  amber: 'var(--accent-amber)',
};

const hallmarkTitle = new Map(hallmarkLibrary.map((h) => [h.id, { title: h.title, slug: h.slug }]));

function compoundName(slug: string) {
  return libraryModuleTitles[`compounds/${slug}`] ?? slug;
}

/**
 * One protocol as a confident, buildable plan: the formula and benefit up top,
 * then the layered steps (each compound's job + when to take it), the hallmarks
 * it targets, and links out to every compound and the full deep-dive. Server
 * component — all links, no client state.
 */
export function ProtocolCard({ protocol }: { protocol: Protocol }) {
  const accent = ACCENT[protocol.theme];
  return (
    <article
      className="premium-card flex h-full flex-col rounded-2xl p-6 md:p-7"
      style={{ '--card-accent': accent } as CSSProperties}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-micro font-semibold uppercase tracking-widest" style={{ color: accent }}>
            {protocol.formula}
          </p>
          <h3 className="heading-card mt-1.5 text-xl">{protocol.name}</h3>
        </div>
        <EvidenceTag tier={protocol.evidence} size="sm" />
      </div>

      <p className="text-body-sm font-medium text-foreground">{protocol.goal}</p>
      <p className="text-body-sm mt-2 leading-relaxed text-muted-foreground">{protocol.pitch}</p>

      {/* The stack, layered — role + timing choreography */}
      <ol className="mt-5 flex flex-col gap-px overflow-hidden rounded-xl border border-border/60">
        {protocol.steps.map((step) => (
          <li key={step.slug} className="bg-card/40">
            <Link
              href={`/library/compounds/${step.slug}`}
              className="focus-ring group flex items-center gap-3 px-3.5 py-3 hover:bg-white/[0.03]"
            >
              <span
                className="mt-0.5 inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 font-mono text-micro font-semibold"
                style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)`, color: accent }}
              >
                <Clock className="h-3 w-3" aria-hidden="true" />
                {step.timing}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body-sm font-semibold text-foreground group-hover:text-accent-cyan">
                  {compoundName(step.slug)}
                </span>
                <span className="block text-caption text-muted-foreground">{step.role}</span>
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-cyan"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ol>

      {/* Hallmarks targeted */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="text-label text-muted-foreground">Targets</span>
        {protocol.hallmarkIds.map((id) => {
          const h = hallmarkTitle.get(id);
          if (!h) return null;
          return (
            <Link
              key={id}
              href={`/hallmarks/${h.slug}`}
              className="focus-ring rounded border border-border/60 bg-card/40 px-1.5 py-0.5 text-micro font-medium text-muted-foreground transition-colors hover:border-accent-violet/40 hover:text-accent-violet"
            >
              {h.title}
            </Link>
          );
        })}
      </div>

      {protocol.moduleHref && (
        <Link
          href={protocol.moduleHref}
          className="focus-ring group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: accent }}
        >
          Read the full protocol
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
