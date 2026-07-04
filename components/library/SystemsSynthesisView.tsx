'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitFork, Zap, Route, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CrossHallmarkEffects } from './CrossHallmarkEffects';
import { ImpactPropagationView } from './ImpactPropagationView';
import { PathwaySynthesis } from './PathwaySynthesis';
import { EmergentEffectsView } from './EmergentEffectsView';

type TabId = 'cross' | 'propagation' | 'pathways' | 'emergent';

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'cross',       label: 'Cross-Hallmark',  icon: GitFork },
  { id: 'propagation', label: 'Propagation',     icon: Zap },
  { id: 'pathways',    label: 'Pathways',        icon: Route },
  { id: 'emergent',    label: 'Emergent',        icon: Sparkles },
];

const tabAccent: Record<TabId, string> = {
  cross:       'text-accent-cyan   bg-accent-cyan/15   border-accent-cyan/30',
  propagation: 'text-accent-amber  bg-accent-amber/15  border-accent-amber/30',
  pathways:    'text-accent-emerald bg-accent-emerald/15 border-accent-emerald/30',
  emergent:    'text-accent-violet bg-accent-violet/15  border-accent-violet/30',
};

const tabDescriptions: Record<TabId, string> = {
  cross:       'Which hallmarks does targeting this one affect — and which hallmarks are driving it?',
  propagation: 'How do effects cascade downstream through the systems map? Leverage score and ripple chains.',
  pathways:    'Which shared molecular pathways does this hallmark participate in?',
  emergent:    'What benefits emerge only when targeting this hallmark alongside related ones?',
};

interface SystemsSynthesisViewProps {
  hallmarkId: string;
  className?: string;
}

export function SystemsSynthesisView({ hallmarkId, className }: SystemsSynthesisViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('cross');

  return (
    <div className={cn('space-y-4', className)}>
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-card border border-border rounded-xl overflow-x-auto scrollbar-none">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg whitespace-nowrap transition-all shrink-0',
                active ? `border ${tabAccent[id]}` : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab description */}
      <p className="text-xs text-muted-foreground leading-relaxed px-1">{tabDescriptions[activeTab]}</p>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'cross' && (
          <CrossHallmarkEffects hallmarkId={hallmarkId} />
        )}
        {activeTab === 'propagation' && (
          <ImpactPropagationView hallmarkId={hallmarkId} />
        )}
        {activeTab === 'pathways' && (
          <PathwaySynthesis hallmarkId={hallmarkId} />
        )}
        {activeTab === 'emergent' && (
          <EmergentEffectsView hallmarkId={hallmarkId} />
        )}
      </motion.div>
    </div>
  );
}
