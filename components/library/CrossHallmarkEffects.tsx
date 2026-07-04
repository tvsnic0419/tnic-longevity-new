'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RelationBadge } from './RelationBadge';
import { getOutgoingRelations, getIncomingRelations } from '@/lib/relations';
import type { HallmarkRelation } from '@/lib/relations';

const hallmarkAccent: Record<string, 'cyan' | 'amber' | 'violet' | 'emerald' | 'rose'> = {
  genomic:      'cyan',
  telomeres:    'amber',
  epigenetic:   'violet',
  proteostasis: 'violet',
  autophagy:    'cyan',
  mito:         'emerald',
  senescence:   'rose',
  stem:         'violet',
  communication:'amber',
  inflammation: 'rose',
  dysbiosis:    'emerald',
  nutrient:     'amber',
};

const hallmarkNames: Record<string, string> = {
  genomic:      'Genomic Instability',
  telomeres:    'Telomere Attrition',
  epigenetic:   'Epigenetic Alterations',
  proteostasis: 'Loss of Proteostasis',
  autophagy:    'Disabled Autophagy',
  mito:         'Mitochondrial Dysfunction',
  senescence:   'Cellular Senescence',
  stem:         'Stem Cell Exhaustion',
  communication:'Altered Communication',
  inflammation: 'Chronic Inflammation',
  dysbiosis:    'Gut Dysbiosis',
  nutrient:     'Nutrient Dysregulation',
};

const accentText: Record<string, string> = {
  cyan:    'text-accent-cyan',
  amber:   'text-accent-amber',
  violet:  'text-accent-violet',
  emerald: 'text-accent-emerald',
  rose:    'text-accent-rose',
};

const accentBorder: Record<string, string> = {
  cyan:    'border-accent-cyan/30',
  amber:   'border-accent-amber/30',
  violet:  'border-accent-violet/30',
  emerald: 'border-accent-emerald/30',
  rose:    'border-accent-rose/30',
};

const accentBg: Record<string, string> = {
  cyan:    'bg-accent-cyan/8',
  amber:   'bg-accent-amber/8',
  violet:  'bg-accent-violet/8',
  emerald: 'bg-accent-emerald/8',
  rose:    'bg-accent-rose/8',
};

function RelationRow({ relation, perspective }: { relation: HallmarkRelation; perspective: string }) {
  const [open, setOpen] = useState(false);
  const isOutgoing = relation.from === perspective;
  const other = isOutgoing ? relation.to : relation.from;
  const accent = hallmarkAccent[other] ?? 'cyan';

  return (
    <div className={cn('rounded-xl border transition-colors', accentBorder[accent], open ? accentBg[accent] : 'border-border/50')}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isOutgoing ? (
            <ArrowRight className={cn('w-3.5 h-3.5 shrink-0', accentText[accent])} aria-label="affects" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground rotate-180" aria-label="affected by" />
          )}
          <span className={cn('text-sm font-semibold truncate', accentText[accent])}>
            {hallmarkNames[other] ?? other}
          </span>
        </div>
        <RelationBadge type={relation.type} strength={relation.strength} />
        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
          Tier {relation.evidence}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
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
            <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{relation.mechanism}</p>
              {relation.keyMolecules.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {relation.keyMolecules.map((mol) => (
                    <span key={mol} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground">
                      {mol}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CrossHallmarkEffectsProps {
  hallmarkId: string;
  className?: string;
}

export function CrossHallmarkEffects({ hallmarkId, className }: CrossHallmarkEffectsProps) {
  const [tab, setTab] = useState<'outgoing' | 'incoming'>('outgoing');
  const outgoing = getOutgoingRelations(hallmarkId);
  const incoming = getIncomingRelations(hallmarkId);
  const currentList = tab === 'outgoing' ? outgoing : incoming;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-xl">
        <button
          onClick={() => setTab('outgoing')}
          className={cn(
            'flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-all',
            tab === 'outgoing'
              ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Downstream Effects ({outgoing.length})
        </button>
        <button
          onClick={() => setTab('incoming')}
          className={cn(
            'flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-all',
            tab === 'incoming'
              ? 'bg-accent-violet/15 text-accent-violet border border-accent-violet/25'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Upstream Drivers ({incoming.length})
        </button>
      </div>

      {currentList.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">No {tab} relations mapped yet.</p>
      ) : (
        <div className="space-y-2">
          {currentList
            .sort((a, b) => {
              const order = { strong: 0, moderate: 1, weak: 2 };
              return order[a.strength] - order[b.strength];
            })
            .map((rel) => (
              <RelationRow key={rel.id} relation={rel} perspective={hallmarkId} />
            ))}
        </div>
      )}
    </div>
  );
}
