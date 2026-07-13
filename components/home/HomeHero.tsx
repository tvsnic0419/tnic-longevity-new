import Link from 'next/link';
import { Suspense } from 'react';
import { ClipboardList, Library, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { StarterQuiz } from '@/components/sections/StarterQuiz';
import { GlassPanel, HeroTilt } from '@/components/ds/glass';

/**
 * Server-rendered homepage hero, composed as four deep-glass depth planes:
 *   0 · background refraction field   (pure CSS, no backdrop-blur — cheap)
 *   1 · crisp foreground content      (headline, CTAs, evidence stats)
 *   2 · the raised glass moment       (pointer-tilt quiz card)
 *   3 · floating accent chips         (small glass, slow drift)
 *
 * Everything a crawler needs is plain server markup; the only client islands
 * are the tilt wrapper and the StarterQuiz behind a Suspense boundary.
 */

const heroStats = [
  { value: '12', label: 'Hallmarks of aging' },
  { value: '49', label: 'Graded compounds' },
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
      {/* Plane 0 — background refraction field. Solid-shape blurs only, so no
          expensive backdrop-filter over a large scrolling region. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#12203c_0.8px,transparent_1px)] [background-size:22px_22px] opacity-40" />
        <div
          className="absolute -left-40 -top-48 h-[42rem] w-[42rem] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(0,224,255,0.16), transparent 62%)' }}
        />
        <div
          className="absolute -right-48 top-1/4 h-[40rem] w-[40rem] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(160,130,255,0.13), transparent 62%)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[24rem] w-[36rem] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.08), transparent 65%)' }}
        />
        {/* faint diagonal light streak — refraction through the field */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.035) 50%, transparent 58%)' }}
        />
        {/* vignette + fade into the page */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(2,8,17,0.55) 100%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container-page">
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-14">
          {/* Plane 1 — crisp content */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
              <Logo variant="lockup" size="hero" />
              <span className="badge-live">
                <span className="badge-live-dot" />
                Platform Active
              </span>
            </div>

            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-cyan)]" aria-hidden="true" />
              The anti-aging operating system
            </span>

            <h1 id="home-hero-heading" className="headline-editorial mb-5 text-white">
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

            {/* Evidence stat row — a restrained secondary glass surface (plane 2) */}
            <GlassPanel depth={2} className="dg-r-lg overflow-hidden">
              <dl className="grid grid-cols-2 sm:grid-cols-4">
                {heroStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`px-4 py-4 text-center lg:text-left ${i > 0 ? 'border-l border-white/[0.06]' : ''} ${
                      i === 2 ? 'border-l-0 sm:border-l' : ''
                    }`}
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="tnic-tabular block text-2xl font-bold tracking-tight text-white">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-[11px] leading-tight text-white/55">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </GlassPanel>
          </div>

          {/* Planes 2 + 3 — the raised glass moment and floating accents */}
          <div className="mt-12 lg:col-span-5 lg:mt-0">
            {/* Inner wrapper sized to the card, so floating chips anchor to the
                card's own corners rather than the tall grid cell. */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* ambient chromatic glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[var(--accent-cyan)]/12 via-transparent to-[var(--accent-violet)]/12 blur-2xl"
              />

              {/* Plane 2 — the hero glass moment, pointer-tilt */}
              <HeroTilt className="relative z-10">
                <GlassPanel depth={3} className="dg-r-xl">
                  <Suspense fallback={<div className="h-[380px] animate-pulse rounded-3xl bg-white/5" />}>
                    <StarterQuiz />
                  </Suspense>
                </GlassPanel>
              </HeroTilt>

              {/* Plane 3 — floating accent chips, hugging opposite corners
                  (desktop only, gentle drift). w-fit keeps them chip-sized. */}
              <GlassPanel
                chip
                depth={3}
                className="dg-float absolute -left-4 -top-5 z-20 hidden w-fit items-center gap-2 whitespace-nowrap px-3 py-2 lg:flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-emerald)]" aria-hidden="true" />
                <span className="text-[11px] font-medium text-white/85">Evidence-graded</span>
              </GlassPanel>
              <GlassPanel
                chip
                depth={3}
                className="dg-float-slow absolute -bottom-6 -right-4 z-20 hidden w-fit whitespace-nowrap px-3 py-2 lg:block"
              >
                <p className="text-[10px] uppercase tracking-wider text-white/50">Hallmarks</p>
                <p className="tnic-tabular text-sm font-bold text-white">12 / 12 mapped</p>
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
