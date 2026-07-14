import Link from 'next/link';
import { Suspense } from 'react';
import { ClipboardList, Library, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { StarterQuiz } from '@/components/sections/StarterQuiz';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { HeroSceneMount } from '@/components/home/HeroSceneMount';
import { compounds } from '@/lib/data';

/**
 * Server-rendered homepage hero.
 *
 * Everything the crawler needs — headline, value proposition, CTAs, and the
 * evidence stat row — is plain server-rendered markup. The only client island
 * is the interactive StarterQuiz, isolated behind a Suspense boundary so the
 * rest of the route stays static and crawlable.
 */

const heroStats = [
  { value: '12', label: 'Hallmarks of aging' },
  { value: String(compounds.length), label: 'Graded compounds' },
  { value: 'A–C', label: 'Evidence tiers' },
  { value: '100%', label: 'Free & private' },
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
        {/* Violet, not emerald — the compound-synergy network sitting in this
            corner already carries its own emerald/amber tier-color signal;
            a second emerald wash here would compete with it instead of
            grounding it. */}
        <div className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.10),transparent_60%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container-page">
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-14">
          {/* Copy column */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
              <Logo variant="lockup" size="hero" />
              <span className="badge-live">
                <span className="badge-live-dot" />
                Platform Active
              </span>
            </div>

            {/* Float plane — smallest, most elevated glass accent in the hero */}
            <GlassPanel
              depth="float"
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/80"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-cyan)]" aria-hidden="true" />
              Interventions for the 12 hallmarks of aging
            </GlassPanel>

            {/* !text-white: .headline-editorial is unlayered CSS and sets its
                own theme-aware color, which beats Tailwind's `text-white`
                utility by cascade-layer rules regardless of source order.
                This hero is intentionally always-dark (bg-[#020811] above),
                so force white with Tailwind's `!` important-modifier. */}
            <h1 id="home-hero-heading" className="headline-editorial mb-5 !text-white">
              Understand how you age.
              <br />
              <span className="gradient-sweep-text">Then act on the evidence.</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl lg:mx-0">
              TNiC turns longevity science into one clear protocol — the 12 hallmarks of
              aging, evidence-graded compounds, and simulators that project the impact
              before you commit. Independent, private, and free.
            </p>

            <div className="mb-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/quiz"
                className="tnic-button-primary focus-ring group inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-base"
              >
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
                Take the 3-min quiz
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/library"
                className="tnic-button-secondary focus-ring inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-base"
              >
                <Library className="h-5 w-5" aria-hidden="true" />
                Explore the library
              </Link>
            </div>

            <div className="mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/60 lg:justify-start">
              <span>Free forever</span>
              <Dot />
              <span>Data stays on your device</span>
              <Dot />
              <span>No account needed</span>
            </div>

            {/* Mid plane — evidence stat row sits just above the backdrop.
                gap-px against the panel's own fill, with a faint per-cell
                overlay, reproduces the hairline grid without a hard-coded bg. */}
            <GlassPanel depth="mid" className="overflow-hidden rounded-2xl">
              <dl className="grid grid-cols-2 gap-px sm:grid-cols-4">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="bg-white/[0.03] px-4 py-4 text-center lg:text-left">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="tnic-tabular block text-2xl font-bold tracking-tight text-white">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-[11px] leading-tight text-white/50">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </GlassPanel>
          </div>

          {/* Content plane — the hero's one primary glass moment, with pointer tilt */}
          <div className="mt-12 lg:col-span-5 lg:mt-0">
            <div className="relative">
              {/* Ambient 3D compound-synergy network — real product data, not
                  decoration for its own sake. Furthest-back layer (-z-10);
                  the gradient glow and glass card paint above it in DOM order. */}
              <div className="absolute -inset-20 -z-10 opacity-80" aria-hidden="true">
                <HeroSceneMount />
              </div>
              <div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--accent-cyan)]/12 via-transparent to-[var(--accent-emerald)]/12 blur-2xl"
                aria-hidden="true"
              />
              <GlassPanel depth="content" tilt className="relative rounded-3xl">
                <Suspense
                  fallback={<div className="h-[380px] animate-pulse rounded-3xl bg-white/5" />}
                >
                  <StarterQuiz />
                </Suspense>
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
