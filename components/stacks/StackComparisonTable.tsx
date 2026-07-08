'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ArrowUpDown } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { compounds } from '@/lib/data';
import {
  eliteStacks,
  goalLabels,
  costLabels,
  simplicityLabels,
} from '@/lib/stacks-library';
import type { CostTier, SimplicityTier, StackGoal } from '@/lib/types';
import { useStack } from '@/context/PlatformContext';

type SortKey = 'synergy' | 'cost' | 'simplicity' | 'compounds';

const allGoals = [...new Set(eliteStacks.map((s) => s.goal))] as StackGoal[];
const allCosts = [...new Set(eliteStacks.map((s) => s.costTier))] as CostTier[];
const allSimplicity = [...new Set(eliteStacks.map((s) => s.simplicity))] as SimplicityTier[];

const tierColor = { A: 'text-accent-emerald', B: 'text-accent-cyan', C: 'text-accent-amber' };

export function StackComparisonTable() {
  const { setSelected } = useStack();
  const [goalFilter, setGoalFilter] = useState<StackGoal | 'all'>('all');
  const [costFilter, setCostFilter] = useState<CostTier | 'all'>('all');
  const [simplicityFilter, setSimplicityFilter] = useState<SimplicityTier | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('synergy');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let list = [...eliteStacks];
    if (goalFilter !== 'all') list = list.filter((s) => s.goal === goalFilter);
    if (costFilter !== 'all') list = list.filter((s) => s.costTier === costFilter);
    if (simplicityFilter !== 'all') list = list.filter((s) => s.simplicity === simplicityFilter);

    list.sort((a, b) => {
      let diff = 0;
      switch (sortKey) {
        case 'synergy':
          diff = a.synergyRating - b.synergyRating;
          break;
        case 'cost':
          diff = a.costMonthlyUsd.low - b.costMonthlyUsd.low;
          break;
        case 'simplicity':
          diff = a.simplicityScore - b.simplicityScore;
          break;
        case 'compounds':
          diff = a.compoundIds.length - b.compoundIds.length;
          break;
      }
      return sortAsc ? diff : -diff;
    });
    return list;
  }, [goalFilter, costFilter, simplicityFilter, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-[10px] font-mono text-accent-violet uppercase">
          <Filter className="w-3.5 h-3.5" /> Filters
        </div>
        <select
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value as StackGoal | 'all')}
          aria-label="Filter by goal"
          className="input-base !min-h-10 !py-2 text-xs w-auto"
        >
          <option value="all">All Goals</option>
          {allGoals.map((g) => (
            <option key={g} value={g}>{goalLabels[g]}</option>
          ))}
        </select>
        <select
          value={costFilter}
          onChange={(e) => setCostFilter(e.target.value as CostTier | 'all')}
          aria-label="Filter by cost"
          className="input-base !min-h-10 !py-2 text-xs w-auto"
        >
          <option value="all">All Costs</option>
          {allCosts.map((c) => (
            <option key={c} value={c}>{costLabels[c]}</option>
          ))}
        </select>
        <select
          value={simplicityFilter}
          onChange={(e) => setSimplicityFilter(e.target.value as SimplicityTier | 'all')}
          aria-label="Filter by complexity"
          className="input-base !min-h-10 !py-2 text-xs w-auto"
        >
          <option value="all">All Complexity</option>
          {allSimplicity.map((s) => (
            <option key={s} value={s}>{simplicityLabels[s]}</option>
          ))}
        </select>
        <span className="text-[10px] font-mono text-caption ml-auto">
          {filtered.length} stack{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <DataTable caption="Elite stack comparison with filters and sorting">
          <thead>
            <tr>
              <th scope="col">Stack</th>
              <th scope="col">Goal</th>
              <th scope="col">Compounds</th>
              <th scope="col">
                <button onClick={() => toggleSort('synergy')} className="focus-ring flex items-center gap-1 hover:text-accent-violet uppercase">
                  Synergy <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th scope="col">
                <button onClick={() => toggleSort('cost')} className="focus-ring flex items-center gap-1 hover:text-accent-violet uppercase">
                  Cost/mo <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th scope="col">
                <button onClick={() => toggleSort('simplicity')} className="focus-ring flex items-center gap-1 hover:text-accent-violet uppercase">
                  Simplicity <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th scope="col">Evidence</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((stack, i) => (
              <motion.tr
                key={stack.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-t border-border hover:bg-muted/30 transition"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-sm">{stack.name}</p>
                  {stack.rxCompounds && (
                    <span className="text-[9px] font-mono text-accent-rose">Rx</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{goalLabels[stack.goal]}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {stack.compoundIds.map((id) => (
                      <span key={id} className="text-[9px] font-mono bg-accent-violet/10 text-accent-violet px-1.5 py-0.5 rounded">
                        {compounds.find((c) => c.id === id)?.name.split(' ')[0] ?? id}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold text-accent-emerald">{stack.synergyRating}</span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  ${stack.costMonthlyUsd.low}–{stack.costMonthlyUsd.high}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{simplicityLabels[stack.simplicity]}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold ${tierColor[stack.evidenceTier]}`}>
                    Tier {stack.evidenceTier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      setSelected([...stack.compoundIds]);
                      document.getElementById('stack-builder')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-accent-violet hover:text-accent-cyan transition whitespace-nowrap"
                  >
                    Load →
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
      </DataTable>
    </div>
  );
}