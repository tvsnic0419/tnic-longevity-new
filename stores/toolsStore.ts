'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProtocolGoal } from '@/lib/tools/protocol-customizer';
import type { ToolsStoreState } from '@/lib/tools/types';
import { biomarkers } from '@/lib/data';

interface ToolsStore extends ToolsStoreState {
  setProtocolGoals: (goals: ProtocolGoal[]) => void;
  toggleProtocolGoal: (goal: ProtocolGoal) => void;
  setProtocolBudget: (budget: ToolsStoreState['protocolBudget']) => void;
  setProtocolComplexity: (complexity: ToolsStoreState['protocolComplexity']) => void;
  setNetworkHighlightNode: (id: string | null) => void;
  setNetworkFilter: (filter: ToolsStoreState['networkFilter']) => void;
  setDashboardMarkerId: (id: string) => void;
  setForecastHorizonWeeks: (weeks: ToolsStoreState['forecastHorizonWeeks']) => void;
  setShowForecastBands: (show: boolean) => void;
  resetToolsPreferences: () => void;
}

const initialState: ToolsStoreState = {
  protocolGoals: ['longevity', 'energy'],
  protocolBudget: 'moderate',
  protocolComplexity: 'standard',
  networkHighlightNode: null,
  networkFilter: 'all',
  dashboardMarkerId: biomarkers[0]?.id ?? 'gsh',
  forecastHorizonWeeks: 24,
  showForecastBands: true,
};

export const useToolsStore = create<ToolsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProtocolGoals: (goals) => set({ protocolGoals: goals }),

      toggleProtocolGoal: (goal) => {
        const current = get().protocolGoals;
        if (current.includes(goal)) {
          if (current.length > 1) set({ protocolGoals: current.filter((g) => g !== goal) });
        } else {
          set({ protocolGoals: [...current, goal] });
        }
      },

      setProtocolBudget: (budget) => set({ protocolBudget: budget }),
      setProtocolComplexity: (complexity) => set({ protocolComplexity: complexity }),
      setNetworkHighlightNode: (id) => set({ networkHighlightNode: id }),
      setNetworkFilter: (filter) => set({ networkFilter: filter }),
      setDashboardMarkerId: (id) => set({ dashboardMarkerId: id }),
      setForecastHorizonWeeks: (weeks) => set({ forecastHorizonWeeks: weeks }),
      setShowForecastBands: (show) => set({ showForecastBands: show }),

      resetToolsPreferences: () => set(initialState),
    }),
    {
      name: 'tnic-tools-preferences',
      partialize: (s) => ({
        protocolGoals: s.protocolGoals,
        protocolBudget: s.protocolBudget,
        protocolComplexity: s.protocolComplexity,
        dashboardMarkerId: s.dashboardMarkerId,
        forecastHorizonWeeks: s.forecastHorizonWeeks,
        showForecastBands: s.showForecastBands,
      }),
    },
  ),
);