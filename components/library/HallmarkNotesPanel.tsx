'use client';

import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import { NotebookPen, TrendingUp } from 'lucide-react';
import type { HallmarkLibraryEntry } from '@/lib/types';

export function HallmarkNotesPanel({ hallmark }: { hallmark: HallmarkLibraryEntry }) {
  const { hallmarkNotes, setHallmarkNote, selected } = usePlatform();
  const entry = hallmarkNotes[hallmark.id] ?? { status: 50, notes: '', updatedAt: '' };

  const activeCompounds = hallmark.relatedCompoundIds.filter((id) => selected.includes(id));

  return (
    <div className="gradient-border p-6">
      <div className="flex items-center gap-2 mb-5">
        <NotebookPen className="w-4 h-4 text-accent-emerald" />
        <p className="text-[10px] font-mono text-accent-emerald uppercase tracking-wider">
          My Results & Notes
        </p>
      </div>

      <div className="mb-5">
        <div className="flex justify-between mb-2">
          <label className="text-xs text-muted-foreground">Personal status (how this hallmark feels for you)</label>
          <span className="font-mono text-sm text-accent-emerald">{entry.status}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={entry.status}
          onChange={(e) => setHallmarkNote(hallmark.id, { status: Number(e.target.value) })}
          className="w-full age-slider"
        />
        <div className="flex justify-between text-[10px] text-caption font-mono mt-1">
          <span>Critical</span>
          <span>Optimal</span>
        </div>
      </div>

      <div className="mb-5">
        <label className="text-xs text-muted-foreground block mb-2">Private notes (saved locally)</label>
        <textarea
          value={entry.notes}
          onChange={(e) => setHallmarkNote(hallmark.id, { notes: e.target.value })}
          placeholder="Lab results, symptoms, protocol changes, physician feedback…"
          rows={4}
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-emerald/50 resize-y min-h-[100px]"
        />
        {entry.updatedAt && (
          <p className="text-[10px] text-caption mt-1">Last updated: {entry.updatedAt.slice(0, 10)}</p>
        )}
      </div>

      <div className="glass rounded-xl p-4 mb-4">
        <p className="text-[10px] font-mono text-muted-foreground uppercase mb-2">Tracking prompts</p>
        <ul className="space-y-1">
          {hallmark.personalPrompts.map((p) => (
            <li key={p} className="text-xs text-muted-foreground flex items-start gap-2">
              <TrendingUp className="w-3 h-3 text-caption shrink-0 mt-0.5" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass rounded-xl p-4">
        <p className="text-[10px] font-mono text-muted-foreground uppercase mb-2">Your stack coverage</p>
        {activeCompounds.length > 0 ? (
          <p className="text-xs text-accent-emerald">
            {activeCompounds.length} of {hallmark.relatedCompoundIds.length} TNiC compounds active in your stack
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            No targeting compounds in your active stack.{' '}
            <Link href="/#stacks" className="text-accent-cyan hover:underline">Build stack →</Link>
          </p>
        )}
        <p className="text-[10px] text-caption mt-2">
          Biomarkers: {hallmark.biomarkers.join(' · ')}
          {' — '}
          <Link href="/labs" className="text-accent-rose hover:underline">Log in Lab Hub</Link>
        </p>
      </div>
    </div>
  );
}
