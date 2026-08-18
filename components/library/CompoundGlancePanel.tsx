import Link from 'next/link';
import { Activity, Clock, FileText, Route, Target } from 'lucide-react';
import type { Compound } from '@/lib/types';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { StatTile } from '@/components/ui/StatTile';

/**
 * "Compound at a glance" — a scannable identity panel that surfaces the
 * structured facts otherwise buried in prose: mechanism pathway, oral
 * bioavailability, protocol, citation depth, and the hallmarks the compound
 * targets. Built entirely from the canonical `compounds` dataset so every
 * stack-buildable compound page presents the same shape. Presentational and
 * server-safe (no hooks).
 */

const firstSentence = (text: string): string => {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
};

export function CompoundGlancePanel({ compound }: { compound: Compound }) {
  const targetHallmarks = compound.hallmarks
    .map((id) => hallmarkLibrary.find((h) => h.id === id))
    .filter((h): h is (typeof hallmarkLibrary)[number] => Boolean(h));

  return (
    <section
      className="card-elevated p-6 md:p-7"
      aria-label={`${compound.name} at a glance`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-label text-accent-cyan">Compound at a glance</p>
        <EvidenceTag tier={compound.evidence} showTooltip href="/trust/methodology" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Route} label="Pathway">
          <p className="text-sm font-semibold text-foreground">{compound.pathway}</p>
        </StatTile>

        <StatTile icon={Activity} label="Bioavailability">
          {compound.bioavailability != null ? (
            <>
              <p className="font-display text-xl font-medium leading-none text-accent-cyan">
                {compound.bioavailability}
                <span className="font-sans text-xs font-medium text-muted-foreground">%</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-emerald"
                  style={{ width: `${Math.min(100, Math.max(0, compound.bioavailability))}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm font-semibold text-muted-foreground">—</p>
          )}
        </StatTile>

        <StatTile icon={Clock} label="Protocol">
          <p className="text-sm font-semibold text-foreground">{compound.dose}</p>
          <p className="mt-1 text-xs text-muted-foreground">{compound.timing} dosing</p>
        </StatTile>

        <StatTile icon={FileText} label="Evidence base" accent="emerald">
          <p className="font-display text-xl font-medium leading-none text-accent-emerald">
            {compound.studies.length}
            <span className="font-sans ml-1 text-xs font-medium text-muted-foreground">
              indexed {compound.studies.length === 1 ? 'study' : 'studies'}
            </span>
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">Peer-reviewed PMIDs</p>
        </StatTile>
      </div>

      {targetHallmarks.length > 0 && (
        <div className="mt-5">
          <div className="mb-2.5 flex items-center gap-1.5 text-micro font-mono uppercase tracking-widest text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-accent-violet" aria-hidden="true" />
            Targets {targetHallmarks.length} hallmark{targetHallmarks.length === 1 ? '' : 's'} of aging
          </div>
          <div className="flex flex-wrap gap-2">
            {targetHallmarks.map((h) => (
              <Link
                key={h.id}
                href={`/library/${h.slug}`}
                className="focus-ring interactive inline-flex items-center gap-1.5 rounded-full border border-accent-violet/25 bg-accent-violet/5 px-3 py-1 text-xs text-muted-foreground transition hover:border-accent-violet/50 hover:text-accent-violet"
              >
                <span className="font-mono text-micro text-accent-violet">
                  {String(h.number).padStart(2, '0')}
                </span>
                {h.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-5 border-t border-border/50 pt-4 text-sm leading-relaxed text-muted-foreground">
        <span className="font-mono text-micro uppercase tracking-widest text-accent-cyan">
          Primary mechanism
        </span>
        <br />
        {firstSentence(compound.mechanism)}
      </p>
    </section>
  );
}
