import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Sparkles, Library, ArrowRight, FlaskConical, ShieldCheck } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { TiltGlassPanel } from '@/components/ui/TiltGlassPanel';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { eliteInterventions } from '@/lib/elite-interventions';
import { HeroSceneMount } from '@/components/home/HeroSceneMount';

/**
 * Server-rendered homepage hero.
 *
 * Everything the crawler needs — headline, value proposition, CTAs, and the
 * evidence stat row — is plain server-rendered markup. The personalized entry
 * point is the NICO Starter Questionnaire, promoted as the hero's primary CTA
 * and content card, both fully static and crawlable.
 */

const heroStats = [
  { value: String(eliteInterventions.length), label: 'Elite interventions', accent: 'var(--accent-cyan)' },
  { value: String(COMPOUND_COUNT), label: 'Graded compounds', accent: 'var(--accent-emerald)' },
  { value: '12', label: 'Hallmarks of aging', accent: 'var(--accent-violet)' },
  { value: 'A–C', label: 'Evidence tiers', accent: 'var(--accent-amber)' },
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
        {/* Violet, not emerald — the compound-synergy network below already
            carries its own emerald/amber tier-color signal in its own band;
            a second emerald wash up here would compete with it instead of
            grounding this half of the hero. */}
        <div className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.10),transparent_60%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container-page">
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-14">
          {/* Copy column */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* Float plane — smallest, most elevated glass accent in the hero.
                Doubles as the section eyebrow: the brand already lives in the
                fixed nav, so the hero leads with what TNiC *does*, not a second
                logo lockup. */}
            <GlassPanel
              depth="float"
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-cyan)]" aria-hidden="true" />
              The evidence-graded longevity library — and where to buy well
            </GlassPanel>

            {/* !text-white: .headline-editorial is unlayered CSS and sets its
                own theme-aware color, which beats Tailwind's `text-white`
                utility by cascade-layer rules regardless of source order.
                This hero is intentionally always-dark (bg-[#020811] above),
                so force white with Tailwind's `!` important-modifier. */}
            <h2 id="home-hero-heading" className="headline-editorial mb-5 !text-white">
              Transformative nutrition{' '}
              <br />
              <span className="gradient-sweep-text">for cell-health.</span>
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-white md:text-xl lg:mx-0">
              TNiC — Transformative Nutrition in Cell-Health — is a PubMed-backed
              library of the nutrients shown to act on the 12 hallmarks of aging,
              graded by the strength of human evidence. Start with the elite
              interventions and the verified products to act on them. Free, private,
              no account.
            </p>

            <div className="mb-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/nico"
                className="tnic-button-primary focus-ring group inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-base"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Start the NICO Starter Questionnaire
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
                Explore the evidence
              </Link>
            </div>

            <div className="mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/70 lg:justify-start">
              <span>Free forever</span>
              <Dot />
              <span>Data stays on your device</span>
              <Dot />
              <span>No account needed</span>
            </div>

            {/* Mid plane — evidence stat row sits just above the backdrop.
                gap-px against the panel's own fill, with a faint per-cell
                overlay, reproduces the hairline grid without a hard-coded bg.
                scan-overlay's hairline texture + monospace tabular figures
                read as an instrument readout rather than a marketing stat
                block — bracket-corner ornaments are reserved for larger
                section-level containers (see SectionShell.tsx), too coarse
                for this compact single row. */}
            <GlassPanel depth="mid" className="scan-overlay relative overflow-hidden rounded-2xl">
              <dl className="grid grid-cols-2 gap-px sm:grid-cols-4">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="stat-instrument px-4 py-4 text-center lg:text-left"
                    style={{ '--flair-accent': stat.accent } as CSSProperties}
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="number-glow tnic-tabular block font-mono text-2xl font-bold tracking-tight text-white">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-micro leading-tight text-white/70">
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
                  Personalized
                </p>
                <h3 className="text-xl font-bold text-white mb-2">NICO Starter Questionnaire</h3>
                <p className="text-sm text-white/80 mb-5">
                  Answer a few questions — the NICO Starter Questionnaire builds your personalized, evidence-graded stack, loads it
                  into Stack Builder, and tracks it in your OS dashboard.
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

        {/* Synergy network — a real interactive widget, not ambient
            decoration (see HeroScene3D.tsx). Its own full-width band below
            the headline/CTA + NICO card grid so its info panel and links
            have room to breathe without crowding the NICO CTA, which stays
            the hero's primary conversion path. Non-glass instrument-viewport
            treatment: the hero already spends its glass budget on the stat
            row above and the NICO card. */}
        <div className="mt-14 md:mt-20">
          <div className="mb-5 text-center lg:text-left">
            <h3 className="text-lg font-bold text-white md:text-xl">Explore the synergy network</h3>
            <p className="mt-1 text-sm text-white/80">
              Click a compound to see what it pairs with — and why.
            </p>
          </div>
          {/* Wide and tall: the network centers itself, which leaves the left
              third genuinely empty — exactly where the selection panel docks,
              so the panel never occludes the graph it's describing. */}
          <div className="h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] md:h-[540px]">
            <HeroSceneMount />
          </div>
        </div>
      </div>

    </section>
  );
}
