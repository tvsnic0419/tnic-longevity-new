'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  Shield,
  ArrowRight,
  ClipboardCheck,
  ExternalLink,
  Link2,
  CheckCircle2,
  Copy,
  Info,
} from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { stackPresets, type PresetKey } from '@/lib/presets';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import {
  getNrAlternativeShopItem,
  getNrShopItems,
  getStackShopItems,
  getUnmatchedStackCompounds,
  shopDisclosure,
} from '@/lib/protocol-shop';
import { buildShopStackUrl, isPresetKey, parseStackParam } from '@/lib/stack-url';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { ProductPickCard } from '@/components/shop/ProductPickCard';
import { getHubContext } from '@/lib/hub-context';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

const presetOptions: { key: PresetKey; label: string }[] = [
  { key: 'starter', label: 'Starter Elite' },
  { key: 'nrf2', label: 'NRF2 Defense' },
  { key: 'mito', label: 'Mito Renewal' },
  { key: 'hybrid', label: 'Full Hybrid' },
  { key: 'longevity', label: 'Longevity Pro' },
  { key: 'metabolic', label: 'Cardio-Metabolic' },
  { key: 'full', label: 'Full-Spectrum 14' },
];

function ProtocolShopPanelInner() {
  const searchParams = useSearchParams();
  const { selected, setSelected } = usePlatform();
  const stackParam = searchParams.get('stack');
  const isNrOnlyMode = stackParam === 'nr';
  const items = isNrOnlyMode ? getNrShopItems() : getStackShopItems(selected);
  const nrAlternative =
    !isNrOnlyMode && selected.includes('nmn') ? getNrAlternativeShopItem() : null;
  // NR-only mode's `items` comes from a fixed single card unrelated to
  // `selected` — comparing them there would falsely claim compounds are
  // missing that were never meant to be shown as a stack.
  const unmatched = isNrOnlyMode ? [] : getUnmatchedStackCompounds(selected);
  const [deepLinked, setDeepLinked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviewedTaskIds, setReviewedTaskIds] = useState<string[]>([]);

  // Progress is deliberately local to this browser and keyed to the active
  // stack. It records only which checklist lines a visitor has reviewed — not
  // health data, purchasing details, or a claim that a product is suitable.
  const checklistKey = useMemo(
    () => `tnic:protocol-shop:checklist:v1:${isNrOnlyMode ? 'nr' : [...selected].sort().join(',') || 'empty'}`,
    [isNrOnlyMode, selected],
  );
  const checklistItems = useMemo(
    () =>
      items.flatMap((item) =>
        (item.buyerGuide?.coaDemands.slice(0, 2) ?? []).map((demand) => ({
          id: `${item.compoundId}:${demand.id}`,
          compoundName: item.compoundName,
          label: demand.label,
        })),
      ),
    [items],
  );
  const reviewedCount = checklistItems.filter((item) => reviewedTaskIds.includes(item.id)).length;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(window.localStorage.getItem(checklistKey) ?? '[]');
      setReviewedTaskIds(Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : []);
    } catch {
      setReviewedTaskIds([]);
    }
  }, [checklistKey]);

  useEffect(() => {
    if (!stackParam) return;
    if (stackParam === 'nr') {
      setDeepLinked(true);
      return;
    }
    const ids = parseStackParam(stackParam);
    if (!ids) return;
    setSelected(ids);
    setDeepLinked(true);
  }, [stackParam, setSelected]);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `${SITE.url}${buildShopStackUrl(selected)}`;
    }
    return `${window.location.origin}${buildShopStackUrl(selected)}`;
  }, [selected]);

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  const toggleChecklistTask = (taskId: string) => {
    const isReviewed = reviewedTaskIds.includes(taskId);
    const next = isReviewed
      ? reviewedTaskIds.filter((id) => id !== taskId)
      : [...reviewedTaskIds, taskId];
    setReviewedTaskIds(next);
    try {
      window.localStorage.setItem(checklistKey, JSON.stringify(next));
    } catch {
      // Checklist state is a convenience; storage availability must never block use.
    }
    trackEvent(ANALYTICS_EVENTS.shopChecklistProgress, {
      action: isReviewed ? 'unreviewed' : 'reviewed',
      reviewed: next.filter((id) => checklistItems.some((item) => item.id === id)).length,
      total: checklistItems.length,
    });
  };

  const clearChecklist = () => {
    setReviewedTaskIds([]);
    try {
      window.localStorage.removeItem(checklistKey);
    } catch {
      // See note above: local persistence is optional.
    }
    trackEvent(ANALYTICS_EVENTS.shopChecklistProgress, { action: 'cleared', reviewed: 0, total: checklistItems.length });
  };

  const exportChecklist = () => {
    const lines = [
      '# TNiC Protocol Shop — Verification Checklist',
      `# Generated ${new Date().toISOString().slice(0, 10)}`,
      `# Stack: ${selected.join(', ')}`,
      `# Shop link: ${shareUrl}`,
      '',
      ...items.flatMap((item) => [
        `## ${item.compoundName}`,
        `- Dose anchor: ${item.dose}`,
        `- Timing: ${item.timing}`,
        ...(item.buyerGuide?.formRequirements.map((r) => `- Form: ${r}`) ?? []),
        ...(item.buyerGuide?.coaDemands.map((c) => {
          const taskId = `${item.compoundId}:${c.id}`;
          return `- [${reviewedTaskIds.includes(taskId) ? 'x' : ' '}] COA: ${c.label}`;
        }) ?? []),
        ...(item.buyerGuide?.redFlags.slice(0, 2).map((r) => `- Red flag: ${r}`) ?? []),
        '',
      ]),
      shopDisclosure.body,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tnic-protocol-checklist-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const presetFromUrl = stackParam && isPresetKey(stackParam) ? stackPresets[stackParam].label : null;

  return (
    <>
      <CinematicHubHero
        hue="amber"
        kicker="Protocol Shop"
        title={<>Buy smart, <em>not branded</em>.</>}
        lead="Stack-filtered verification checklists from the buyer guides — what to look for on a label before you spend, never who paid to be listed."
        stats={[
          { value: String(Object.keys(stackPresets).length), label: 'Stack presets' },
          { value: String(COMPOUND_COUNT), label: 'Compounds covered' },
          { value: 'COA-first', label: 'Verification standard' },
        ]}
        primary={{ href: '/stacks', label: 'Build a stack to filter' }}
        secondary={{ href: '/products', label: 'See product picks' }}
      />
      <div>
      <PageHeader
        icon={ShoppingBag}
        eyebrow="Protocol Shop"
        title="Buy Smart — Not Branded"
        description="Stack-filtered verification checklists from buyer guides. Share /shop?stack= links to pre-load any preset or custom stack."
        theme="amber"
        context={getHubContext('shop')}
        contextVariant="compact"
      />

      {deepLinked && items.length > 0 && (
        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-6 bg-accent-emerald/10 text-accent-emerald">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          Loaded checklist from deep link
          {isNrOnlyMode
            ? ' · NR verification mode'
            : presetFromUrl
              ? ` · ${presetFromUrl} preset`
              : ` · ${selected.length} compounds`}
        </div>
      )}

      <div className="rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-5 mb-8 flex gap-3">
        <Shield className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold mb-1">{shopDisclosure.title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{shopDisclosure.body}</p>
          <p className="text-xs text-muted-foreground mt-2 italic">{shopDisclosure.affiliateNote}</p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="glass-deep glass-plane-mid rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link2 className="w-4 h-4 text-accent-cyan shrink-0" />
            <code className="text-micro sm:text-xs font-mono text-muted-foreground truncate">{shareUrl}</code>
          </div>
          <button
            type="button"
            onClick={copyShareUrl}
            className="focus-ring inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2 rounded-lg text-xs font-semibold bg-accent-cyan/15 border border-accent-cyan/25 text-accent-cyan hover:bg-accent-cyan/25 transition"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy shop link'}
          </button>
        </div>
      )}

      <section aria-labelledby="shop-preset-heading" className="mb-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-label text-accent-amber">Load a starting point</p>
            <h2 id="shop-preset-heading" className="mt-1 text-lg font-semibold text-foreground">Choose a stack by the question you want to inspect.</h2>
          </div>
          <Link href="/stacks" className="focus-ring text-sm font-semibold text-accent-cyan hover:underline">Custom stack in Architect →</Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {presetOptions.map((p) => {
            const preset = stackPresets[p.key];
            const active = stackParam === p.key;
            return (
              <Link
                key={p.key}
                href={`/shop?stack=${p.key}`}
                onClick={() => trackEvent(ANALYTICS_EVENTS.shopPresetLoaded, { preset: p.key, compounds: preset.ids.length })}
                className={cn(
                  'focus-ring group rounded-xl border p-3.5 transition-colors',
                  active
                    ? 'border-accent-amber/60 bg-accent-amber/[0.11] shadow-[0_0_0_1px_rgba(251,191,36,0.12)]'
                    : 'border-border/70 bg-card/35 hover:border-accent-amber/35 hover:bg-accent-amber/[0.04]',
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">{p.label}</span>
                  {active && <span className="rounded-full bg-accent-amber/15 px-2 py-0.5 text-micro font-mono font-semibold uppercase tracking-[0.08em] text-accent-amber">Loaded</span>}
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">{preset.desc}</span>
                <span className="mt-3 flex items-center justify-between text-micro font-mono uppercase tracking-[0.1em] text-muted-foreground"><span>{preset.ids.length} compounds</span><ArrowRight className="h-3.5 w-3.5 text-accent-amber transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
              </Link>
            );
          })}
          <Link
            href="/shop?stack=nr"
            onClick={() => trackEvent(ANALYTICS_EVENTS.shopPresetLoaded, { preset: 'nr_alternative', compounds: 1 })}
            className={cn('focus-ring group rounded-xl border p-3.5 transition-colors', isNrOnlyMode ? 'border-accent-violet/60 bg-accent-violet/[0.11]' : 'border-border/70 bg-card/35 hover:border-accent-violet/35 hover:bg-accent-violet/[0.04]')}
          >
            <span className="flex items-start justify-between gap-3"><span className="text-sm font-semibold text-foreground">NR alternative</span>{isNrOnlyMode && <span className="rounded-full bg-accent-violet/15 px-2 py-0.5 text-micro font-mono font-semibold uppercase tracking-[0.08em] text-accent-violet">Loaded</span>}</span>
            <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">A separate nicotinamide riboside verification view.</span>
            <span className="mt-3 flex items-center justify-between text-micro font-mono uppercase tracking-[0.1em] text-muted-foreground"><span>1 compound</span><ArrowRight className="h-3.5 w-3.5 text-accent-violet transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
          </Link>
        </div>
      </section>

      {items.length === 0 && selected.length === 0 ? (
        <div className="rounded-2xl border border-accent-amber/20 bg-accent-amber/5 p-6 md:p-8">
          <div className="max-w-2xl">
            <p className="text-label text-accent-amber mb-2">No stack loaded yet</p>
            <h2 className="text-2xl font-bold text-foreground mb-3">Turn a protocol into a buyer-grade checklist.</h2>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              Protocol Shop becomes useful once it knows what compounds you are evaluating. Load a preset,
              take the NICO Starter Questionnaire, or build a custom stack; TNiC will then narrow the shop to dose anchors,
              form requirements, COA demands, red flags, comparisons, and verified product cards.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 mt-6">
            {[
              {
                title: 'Start personalized',
                body: 'Answer a few questions and open a shop list matched to your goals.',
                href: '/nico',
                label: 'Take the questionnaire',
              },
              {
                title: 'Use a preset',
                body: 'Load NRF2, Mito, Longevity Pro, Metabolic, or Full-Spectrum in one click.',
                href: '/shop?stack=full',
                label: 'Load full spectrum',
              },
              {
                title: 'Build from scratch',
                body: 'Select compounds in Stack Architect, then return here with a filtered checklist.',
                href: '/stacks',
                label: 'Open architect',
              },
            ].map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="focus-ring glass glass-hover rounded-xl p-4 text-left transition"
              >
                <p className="font-semibold text-sm text-foreground mb-1">{option.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{option.body}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-amber">
                  {option.label} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-accent-amber/20 bg-accent-amber/5 p-6 md:p-8">
          <div className="max-w-2xl">
            <p className="text-label text-accent-amber mb-2">Stack loaded · no verified picks yet</p>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Your {selected.length}-compound stack is here — TNiC just hasn&apos;t verified a product for these yet.
            </h2>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              We add a manufacturer pick only after dose-matched COA verification, so none of these carry a
              verified card yet. Their evidence, dosing, and buyer cautions still live on each module.
            </p>
          </div>

          {unmatched.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {unmatched.map((c) => (
                <li key={c.compoundId}>
                  {c.moduleHref ? (
                    <Link
                      href={c.moduleHref}
                      className="focus-ring inline-flex items-center rounded-lg glass px-3 py-1.5 text-xs font-semibold text-accent-cyan hover:border-accent-cyan/30"
                    >
                      {c.compoundName}
                    </Link>
                  ) : (
                    <span className="inline-flex rounded-lg glass px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                      {c.compoundName}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="focus-ring inline-flex items-center gap-2 rounded-xl border border-accent-amber/30 bg-accent-amber/20 px-5 py-2.5 text-sm font-semibold text-accent-amber transition hover:bg-accent-amber/30"
            >
              See what is verified <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/stacks"
              className="focus-ring inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition hover:border-foreground/40 hover:text-foreground"
            >
              Adjust the stack in Architect
            </Link>
          </div>
        </div>
      ) : (
        <>
          {unmatched.length > 0 && (
            <div className="rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-4 mb-6 flex gap-3">
              <Info className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {unmatched.length} compound{unmatched.length !== 1 ? 's' : ''} in your stack{' '}
                {unmatched.length !== 1 ? "don't" : "doesn't"} have a verified pick yet — TNiC adds
                manufacturer picks only after dose-matched COA verification:{' '}
                {unmatched.map((c, i) => (
                  <span key={c.compoundId}>
                    {i > 0 && ', '}
                    {c.moduleHref ? (
                      <Link href={c.moduleHref} className="text-accent-cyan hover:underline">
                        {c.compoundName}
                      </Link>
                    ) : (
                      c.compoundName
                    )}
                  </span>
                ))}
                . See what IS verified on{' '}
                <Link href="/products" className="text-accent-cyan hover:underline">
                  Products
                </Link>
                .
              </p>
            </div>
          )}
          {checklistItems.length > 0 && (
            <section aria-labelledby="buyer-review-heading" className="mb-6 overflow-hidden rounded-2xl border border-accent-emerald/25 bg-accent-emerald/[0.035] p-5 md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-label flex items-center gap-2 text-accent-emerald"><ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" /> Buyer review</p>
                  <h2 id="buyer-review-heading" className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">Keep the checklist with the stack you are evaluating.</h2>
                  <p className="mt-1.5 max-w-2xl text-body-sm leading-relaxed text-muted-foreground">Mark a line after you review it. Progress stays only in this browser and does not indicate that a product is medically appropriate or suitable for you.</p>
                </div>
                {reviewedCount > 0 && <button type="button" onClick={clearChecklist} className="focus-ring shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground">Clear progress</button>}
              </div>
              <div className="mt-5 flex items-center gap-3" aria-live="polite">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-accent-emerald/15" role="progressbar" aria-label="Buyer-review checklist progress" aria-valuemin={0} aria-valuemax={checklistItems.length} aria-valuenow={reviewedCount}>
                  <div className="h-full rounded-full bg-accent-emerald transition-[width] duration-300" style={{ width: `${(reviewedCount / checklistItems.length) * 100}%` }} />
                </div>
                <span className="shrink-0 font-mono text-xs font-semibold text-accent-emerald">{reviewedCount}/{checklistItems.length} reviewed</span>
              </div>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {checklistItems.map((task) => {
                  const reviewed = reviewedTaskIds.includes(task.id);
                  return (
                    <li key={task.id}>
                      <label className={cn('focus-within:ring-2 focus-within:ring-accent-emerald/55 flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors', reviewed ? 'border-accent-emerald/35 bg-accent-emerald/[0.07]' : 'border-border/60 bg-card/35 hover:border-accent-emerald/25')}>
                        <input type="checkbox" checked={reviewed} onChange={() => toggleChecklistTask(task.id)} className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent-emerald)]" />
                        <span><span className="block text-micro font-mono uppercase tracking-[0.1em] text-accent-emerald">{task.compoundName}</span><span className={cn('mt-1 block text-xs leading-relaxed', reviewed ? 'text-[var(--color-text-secondary)] line-through decoration-accent-emerald/60' : 'text-muted-foreground')}>{task.label}</span></span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div
                key={item.compoundId}
                className="glass glass-hover rounded-2xl p-5 border border-border/80"
              >
                <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-5">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{item.compoundName}</h3>
                          <span
                            className={cn(
                              'text-micro font-mono uppercase px-2 py-0.5 rounded-full border',
                              item.priority === 'essential'
                                ? 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20'
                                : 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
                            )}
                          >
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground">
                          {item.dose} · {item.timing}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`${item.moduleHref}#buyer-guide`}
                          className="focus-ring text-xs font-semibold text-accent-cyan hover:underline rounded"
                        >
                          Buyer guide
                        </Link>
                        {item.compareHref && (
                          <Link
                            href={item.compareHref}
                            className="focus-ring text-xs font-semibold text-accent-violet hover:underline rounded"
                          >
                            Compare
                          </Link>
                        )}
                      </div>
                    </div>

                    {item.buyerGuide && (
                      <ul className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        {item.buyerGuide.coaDemands.slice(0, 4).map((c) => (
                          <li key={c.id} className="flex gap-2">
                            <ClipboardCheck className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                            {c.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {item.productPick && (
                    <ProductPickCard pick={item.productPick} compact className="lg:max-w-[220px]" />
                  )}
                </div>
              </div>
            ))}

            {nrAlternative && (
              <div className="glass-deep glass-plane-mid rounded-2xl p-5 border border-accent-violet/25 bg-accent-violet/5">
                <p className="text-label text-accent-violet mb-2">Chose NR instead of NMN?</p>
                <p className="text-body-sm text-muted-foreground mb-4">
                  Your stack includes NMN. If you or your physician prefer nicotinamide riboside, use this
                  verification card — do not run both high-dose without oversight.
                </p>
                <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-5">
                  <div>
                    <h3 className="font-bold mb-1">{nrAlternative.compoundName}</h3>
                    <p className="text-xs font-mono text-muted-foreground mb-3">
                      {nrAlternative.dose} · {nrAlternative.timing}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`${nrAlternative.moduleHref}#buyer-guide`}
                        className="focus-ring text-xs font-semibold text-accent-cyan hover:underline rounded"
                      >
                        NR buyer guide
                      </Link>
                      {nrAlternative.compareHref && (
                        <Link
                          href={nrAlternative.compareHref}
                          className="focus-ring text-xs font-semibold text-accent-violet hover:underline rounded"
                        >
                          NMN vs NR
                        </Link>
                      )}
                    </div>
                  </div>
                  {nrAlternative.productPick && (
                    <ProductPickCard pick={nrAlternative.productPick} compact className="lg:max-w-[220px]" />
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={exportChecklist}
            className="focus-ring w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent-amber/20 border border-accent-amber/30 text-accent-amber px-6 py-3 rounded-xl font-semibold text-sm hover:bg-accent-amber/30 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Export verification checklist
          </button>
        </>
      )}
    </div>
    </>
  );
}

export function ProtocolShopPanel() {
  return (
    <Suspense fallback={<div className="h-40 glass rounded-2xl animate-pulse" />}>
      <ProtocolShopPanelInner />
    </Suspense>
  );
}
