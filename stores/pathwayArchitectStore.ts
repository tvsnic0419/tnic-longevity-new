'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PathwayArchitectStore {
  selectedIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  setAll: (ids: string[]) => void;
  clear: () => void;
}

export const usePathwayArchitectStore = create<PathwayArchitectStore>()(
  persist(
    (set, get) => ({
      selectedIds: [],

      add: (id) => {
        if (!get().selectedIds.includes(id)) {
          set({ selectedIds: [...get().selectedIds, id] });
        }
      },

      remove: (id) => set({ selectedIds: get().selectedIds.filter((x) => x !== id) }),

      toggle: (id) => {
        const current = get().selectedIds;
        set({
          selectedIds: current.includes(id)
            ? current.filter((x) => x !== id)
            : [...current, id],
        });
      },

      setAll: (ids) => set({ selectedIds: ids }),

      clear: () => set({ selectedIds: [] }),
    }),
    {
      name: 'tnic-pathway-architect',
    },
  ),
);
