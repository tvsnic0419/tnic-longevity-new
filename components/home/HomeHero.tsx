import Link from 'next/link';
import { Sparkles, Library, ArrowRight, FlaskConical, ShieldCheck, ShoppingBag } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { TiltGlassPanel } from '@/components/ui/TiltGlassPanel';
import { HeroSceneMount } from '@/components/home/HeroSceneMount';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { citationRegistry } from '@/lib/trust';

/**
 * Server-rendered homepage hero.
 *
 * The first viewport answers the four buyer questions in order — what TNiC is,
 * why to trust it, what it does for you, and what to click next — before any
 * cinematic spectacle. The value proposition, three primary actions, and the
 * live trust rail are all plain server-rendered markup (crawlable). The
 * personalized entry point (NICO) is promoted as the dominant CTA and content
 * card; the interactive synergy network sits below the conversion layer.
 */

// Live registry counts — derived so the hero can never overstate what's
// published (mirrors lib/platform-stats.ts).
const TRUST_STATS: { value: string; label: string }[] = [
  { value: `${COMPOUND_COUNT}`, label: 'compounds graded' },
  { value: `${hallmarkLibrary.length}`, label: 'hallmarks of aging' },
  { value: `${citationRegistry.length}`, label: 'PMID citations' },
  { value: 'A–C', label: 'transparent tiers' },
];

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-white/25" aria-hidden="true" />;
}

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative isolate overflow-hidden bg-[#020811] pt-28 pb-16 md:pt-32 md:pb-24"
    >
      {/* Backdrop — pure CSS so it renders on the server and stays lightweight */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#12203c_0.8px,transparent_1px)] [background-size:22px_22px] opacity-50" />
        <div className="absolute -left-32 -top-40 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(0,224,255,0.16),transparent_60%)] blur-2xl" />
        <div className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.10),transparent_60%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container-page">
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-14">
          {/* Copy column */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* Brand lockup eyebrow — keeps the TNiC name and its expansion, so the
                headline is free to lead with the product proposition. */}
            <GlassPanel
              depth="float"
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white"
            >
              <span className="font-mono font-bold tracking-widest text-[var(--accent-cyan)]">TNiC</span>
              <span className="h-3 w-px bg-white/20" aria-hidden="true" />
              Transformative Nutrition in Cell-Health
            </GlassPanel>

            {/* The semantic page <h1> — the clear product proposition. */}
            <h1 id="home-hero-heading" className="headline-editorial mb-5 !text-white">
              Evidence-ranked{' '}
              <br />
              <span className="gradient-sweep-text">longevity intelligence.</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-white md:text-xl lg:mx-0">
              Compare compounds, understand the human evidence, build a personalized
              protocol, and discover evidence-aligned products — every claim graded
              on a transparent A–C scale and traced to PubMed. Free, private, no account.
            </p>

            {/* Three primary actions. Build My Protocol is the single dominant CTA
                (gradient); Explore and Shop are the calmer secondary routes. */}
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
              <Link
                href="/nico"
                className="tnic-button-primary focus-ring group inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-base"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Build My Protocol
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/library"
                className="tnic-button-secondary focus-ring inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 text-base"
              >
                <Library className="h-5 w-5" aria-hidden="true" />
                Explore the Evidence
              </Link>
              <Link
                href="/products"
                className="tnic-button-outline focus-ring inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 text-base"
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                Shop TNiC Verified
              </Link>
            </div>

            {/* Live trust rail — derived from the registries, never hardcoded. */}
            <dl className="flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start">
              {TRUST_STATS.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-mono text-lg font-bold text-white">{s.value}</dd>
                  <span className="text-xs text-white/60">{s.label}</span>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/70 lg:justify-start">
              <span>Free forever</span>
              <Dot />
              <span>Data stays on your device</span>
              <Dot />
              <span>No pay-for-placement</span>
            </div>
          </div>

          {/* Content plane — the hero's one primary glass moment, with pointer tilt */}
          <div className="mt-12 lg:col-span-5 lg:mt-0">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--accent-cyan)]/12 via-transparent to-[var(--accent-emerald)]/12 blur-2xl"
                aria-hidden="true"
              />
              <TiltGlassPanel depth="content" className="relative rounded-3xl p-7">
                <p className="font-mono text-micro uppercase tracking-widest text-[var(--accent-emerald)] mb-2 flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[var(--accent-emerald)] animate-pulse-glow"
                    aria-hidden="true"
                  />
                  Start here
                </p>
                <h2 className="text-xl font-bold text-white mb-2">Build My Protocol</h2>
                <p className="text-sm text-white/80 mb-5">
                  Answer a few questions — the NICO questionnaire builds your
                  personalized, evidence-graded stack, loads it into Stack Builder,
                  and tracks it in your dashboard.
                </p>
                <ul className="space-y-2.5 mb-6">
                  {[
                    { icon: Sparkles, text: 'Your goals, lifestyle & focus areas' },
                    { icon: ShieldCheck, text: 'A built-in safety screen' },
                    { icon: FlaskConical, text: 'A stack computed for you — not a fixed preset' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm text-white/80">
                      <Icon className="h-4 w-4 shrink-0 text-[var(--accent-cyan)]" aria-hidden="true" />
                      {text}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/nico"
                  className="tnic-button-primary focus-ring group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-semibold"
                >
                  Begin
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </TiltGlassPanel>
            </div>
            <p className="mt-4 hidden text-center text-micro text-white/60 lg:block lg:text-right">
              Nutrition, down to the cell — evidence you can trace
            </p>
          </div>
        </div>

        {/* Synergy network — a real interactive widget, deliberately below the
            conversion layer so the value prop and CTAs land first. */}
        <div className="mt-14 md:mt-20">
          <div className="mb-5 text-center lg:text-left">
            <h2 className="text-lg font-bold text-white md:text-xl">Explore the synergy network</h2>
            <p className="mt-1 text-sm text-white/80">
              Click a compound to see what it pairs with — and why.
            </p>
          </div>
          <div className="h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] md:h-[540px]">
            <HeroSceneMount />
          </div>
        </div>
      </div>
    </section>
  );
}
