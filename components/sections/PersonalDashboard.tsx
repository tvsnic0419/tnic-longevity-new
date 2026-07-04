'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Download,
  Upload,
  FlaskConical,
  Layers,
  Activity,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import { ShareScorecard } from '@/components/scorecard/ShareScorecard';
import { usePlatform } from '@/context/PlatformContext';
import { biomarkers, gettingStartedSteps } from '@/lib/data';
import { getLabStatus } from '@/lib/labs';

export function PersonalDashboard() {
  const {
    selected,
    score,
    selectedCompounds,
    profile,
    defenseProfile,
    labs,
    checklist,
    toggleChecklist,
    exportAll,
    importAll,
  } = usePlatform();

  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const labOptimal = labs.length > 0
    ? [...new Set(labs.map((e) => e.markerId))].filter((id) => {
        const latest = labs
          .filter((e) => e.markerId === id)
          .sort((a, b) => b.date.localeCompare(a.date))[0];
        return latest && getLabStatus(id, latest.value) === 'optimal';
      }).length
    : 0;

  const checklistTotal = gettingStartedSteps.length;
  const checklistDone = gettingStartedSteps.filter((s) =>
    checklist.includes(String(s.step)),
  ).length;

  const downloadAll = () => {
    const blob = new Blob([exportAll()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tnic-platform-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (text: string) => {
    const result = importAll(text);
    if (!result.ok) {
      setImportMsg(result.errors[0] ?? 'Invalid file — use a TNiC export.');
    } else {
      const warnNote =
        result.warnings.length > 0 ? ` (${result.warnings.length} warnings)` : '';
      setImportMsg(`Platform data restored.${warnNote}`);
    }
    setTimeout(() => setImportMsg(null), 4000);
  };

  const stats = [
    {
      label: 'Synergy Score',
      value: `${score}`,
      sub: `${selected.length} compounds active`,
      icon: Layers,
      color: 'text-accent-violet',
      href: '#stacks',
    },
    {
      label: 'Biological Age',
      value: profile.scanned ? `${defenseProfile.biologicalAge}` : '—',
      sub: profile.scanned
        ? `${defenseProfile.ageDelta > 0 ? '-' : '+'}${Math.abs(defenseProfile.ageDelta)} yr vs ${profile.age}`
        : 'Run defense scan',
      icon: Activity,
      color: 'text-accent-rose',
      href: '#calculator',
    },
    {
      label: 'Lab Markers',
      value: `${new Set(labs.map((e) => e.markerId)).size}`,
      sub: labs.length > 0 ? `${labOptimal} optimal · ${labs.length} readings` : 'No entries yet',
      icon: FlaskConical,
      color: 'text-accent-cyan',
      href: '/labs',
    },
    {
      label: 'Journey Progress',
      value: `${checklistDone}/${checklistTotal}`,
      sub: 'Getting started checklist',
      icon: CheckCircle2,
      color: 'text-accent-emerald',
      href: '#learn',
    },
  ];

  return (
    <SectionShell
      id="dashboard"
      mod="MOD-DSH-12"
      theme="emerald"
      badge="Personal Command Center"
      title="Your Longevity Operating System"
      subtitle="Stack, labs, bio age, and journey — unified in one dashboard, scored by the mechanistic engine."
      className="bg-gradient-to-b from-accent-emerald/5 to-transparent border-y border-border"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-body-sm text-muted-foreground">
          Homepage preview — open the full command center for stack builder and journey highlights.
        </p>
        <a
          href="/dashboard"
          className="focus-ring interactive inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-5 py-3 text-sm font-semibold text-black hover:bg-accent-cyan transition"
        >
          Open full dashboard
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="glass glass-hover rounded-2xl p-5 group transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <ArrowRight className="w-4 h-4 text-caption group-hover:text-accent-emerald transition" />
            </div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">{s.label}</p>
            <p className={`text-3xl font-bold font-mono mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </a>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 gradient-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <LayoutDashboard className="w-4 h-4 text-accent-emerald" />
            <p className="text-[10px] font-mono text-accent-emerald uppercase">Active Stack</p>
          </div>
          {selectedCompounds.length === 0 ? (
            <p className="text-sm text-muted-foreground">No compounds selected. <Link href="#stacks" className="text-accent-emerald hover:underline">Build your stack</Link></p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {selectedCompounds.map((c) => (
                <div key={c.id} className="glass rounded-xl px-4 py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.timing} · Tier {c.evidence}</p>
                  </div>
                  <span className="text-[10px] font-mono text-caption">{c.badge}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <p className="text-[10px] font-mono text-muted-foreground uppercase mb-3">Getting Started</p>
            <div className="space-y-2">
              {gettingStartedSteps.map((step) => {
                const done = checklist.includes(String(step.step));
                return (
                  <label key={step.step} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleChecklist(String(step.step))}
                      className="mt-1 accent-emerald-400"
                    />
                    <span className={`text-xs ${done ? 'text-muted-foreground line-through' : 'text-foreground/80 group-hover:text-foreground'}`}>
                      {step.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <p className="text-[10px] font-mono text-muted-foreground uppercase mb-3">Data Portability</p>
            <div className="flex gap-2">
              <button
                onClick={downloadAll}
                className="flex-1 flex items-center justify-center gap-2 bg-accent-emerald text-black py-2.5 rounded-xl text-xs font-semibold hover:bg-accent-cyan transition"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 glass py-2.5 rounded-xl text-xs font-semibold hover:border-accent-emerald/30 transition"
              >
                <Upload className="w-3.5 h-3.5" /> Import
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => handleImport(reader.result as string);
                reader.readAsText(file);
                e.target.value = '';
              }}
            />
            {importMsg && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-accent-emerald mt-3"
              >
                {importMsg}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <ShareScorecard />

      {labs.length > 0 && (
        <div className="mt-6 glass rounded-2xl p-5">
          <p className="text-[10px] font-mono text-muted-foreground uppercase mb-3">Latest Lab Snapshot</p>
          <div className="flex flex-wrap gap-3">
            {biomarkers.map((b) => {
              const latest = labs
                .filter((e) => e.markerId === b.id)
                .sort((a, c) => c.date.localeCompare(a.date))[0];
              if (!latest) return null;
              const status = getLabStatus(b.id, latest.value);
              const color = status === 'optimal' ? 'text-accent-emerald' : status === 'watch' ? 'text-accent-amber' : 'text-accent-rose';
              return (
                <div key={b.id} className="glass rounded-lg px-3 py-2 text-xs">
                  <span className="text-muted-foreground">{b.name}: </span>
                  <span className={`font-mono font-semibold ${color}`}>{latest.value}</span>
                  <span className="text-caption ml-1">{b.unit}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SectionShell>
  );
}