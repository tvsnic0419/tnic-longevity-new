'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FlaskConical, Dna } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pathwayGroups, getPathwaysForHallmark, getPathwaysForCompound } from '@/lib/relations';
import type { PathwayGroup } from '@/lib/relations';

const compoundNames: Record<string, string> = {
  nmn: 'NMN',
  cakg: 'Ca-AKG',
  resveratrol: 'Resveratrol',
  sulforaphane: 'Sulforaphane',
  glynac: 'GlyNAC',
  rala: 'R-ALA',
  fisetin: 'Fisetin',
  quercetin: 'Quercetin',
  omega3: 'Omega-3',
  urolithina: 'Urolithin A',
  spermidine: 'Spermidine',
};

const hallmarkNames: Record<string, string> = {
  genomic:      'Genomic',
  telomeres:    'Telomeres',
  epigenetic:   'Epigenetic',
  proteostasis: 'Proteostasis',
  autophagy:    'Autophagy',
  mito:         'Mitochondria',
  senescence:   'Senescence',
  stem:         'Stem Cells',
  communication:'Communication',
  inflammation: 'Inflammation',
  dysbiosis:    'Gut Dysbiosis',
  nutrient:     'Nutrient Sensing',
};

const accentClasses: Record<string, { text: string; bg: string; border: string; badge: string }> = {
  cyan:    { text: 'text-accent-cyan',    bg: 'bg-accent-cyan/8',    border: 'border-accent-cyan/25',    badge: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30' },
  emerald: { text: 'text-accent-emerald', bg: 'bg-accent-emerald/8', border: 'border-accent-emerald/25', badge: 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/30' },
  violet:  { text: 'text-accent-violet',  bg: 'bg-accent-violet/8',  border: 'border-accent-violet/25',  badge: 'bg-accent-violet/15 text-accent-violet border-accent-violet/30' },
  amber:   { text: 'text-accent-amber',   bg: 'bg-accent-amber/8',   border: 'border-accent-amber/25',   badge: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30' },
  rose:    { text: 'text-accent-rose',    bg: 'bg-accent-rose/8',    border: 'border-accent-rose/25',    badge: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30' },
};

function PathwayCard({ group, highlight }: { group: PathwayGroup; highlight?: boolean }) {
  const [open, setOpen] = useState(false);
  const ac = accentClasses[group.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border transition-all',
        highlight ? `${ac.bg} ${ac.border}` : 'border-border/50 bg-card/30',
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className={cn('text-sm font-bold mb-0.5', ac.text)}>{group.name}</p>
            <p className="text-xs text-muted-foreground leading-snug">{group.tagline}</p>
          </div>
          {open ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {group.hallmarkIds.map((id) => (
            <span key={id} className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded-md border', ac.badge)}>
              {hallmarkNames[id] ?? id}
            </span>
          ))}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-border/40 space-y-4">
              {/* Key molecules */}
              <div>
                <p className="text-[9px] font-mono text-muted-foreground uppercase mb-2">Key Molecules</p>
                <div className="flex flex-wrap gap-1">
                  {group.keyMolecules.map((mol) => (
                    <span key={mol} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground">
                      {mol}
                    </span>
                  ))}
                </div>
              </div>

              {/* Synergy insight */}
              <div className={cn('rounded-lg p-3', ac.bg)}>
                <p className={cn('text-[9px] font-mono uppercase mb-1.5', ac.text)}>Synergy Mechanism</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{group.synergy}</p>
              </div>

              {/* Compounds */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <FlaskConical className={cn('w-3 h-3', ac.text)} />
                  <p className="text-[9px] font-mono text-muted-foreground uppercase">TNiC Compounds</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.compoundIds.map((id) => (
                    <span key={id} className={cn('text-xs font-semibold px-2.5 py-1 rounded-lg border', ac.badge)}>
                      {compoundNames[id] ?? id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface PathwaySynthesisProps {
  hallmarkId?: string;
  compoundId?: string;
  className?: string;
  showAll?: boolean;
}

export function PathwaySynthesis({ hallmarkId, compoundId, className, showAll = false }: PathwaySynthesisProps) {
  const relevant = hallmarkId
    ? getPathwaysForHallmark(hallmarkId)
    : compoundId
    ? getPathwaysForCompound(compoundId)
    : [];

  const relevantIds = new Set(relevant.map((g) => g.id));
  const groups = showAll ? pathwayGroups : relevant;

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <Dna className="w-8 h-8 opacity-30" />
        <p className="text-xs">No pathway data for this selection.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {showAll && relevant.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">{relevant.length} pathway{relevant.length !== 1 ? 's' : ''}</span> directly relevant — highlighted below.
        </p>
      )}
      {groups.map((group) => (
        <PathwayCard
          key={group.id}
          group={group}
          highlight={showAll ? relevantIds.has(group.id) : true}
        />
      ))}
    </div>
  );
}
