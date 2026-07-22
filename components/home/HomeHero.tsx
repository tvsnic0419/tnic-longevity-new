import Link from 'next/link';
import { Suspense } from 'react';
import { ClipboardList, Library, ArrowRight, Sparkles, Dna, FlaskConical, ShieldCheck, Lock } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { StarterQuiz } from '@/components/sections/StarterQuiz';
import { MolecularMotif } from '@/components/illustrations/MolecularMotif';

/**
 * Server-rendered homepage hero.
 *
 * Everything the crawler needs — headline, value proposition, CTAs, and the
 * evidence stat row — is plain server-rendered markup. The only client island
 * is the interactive StarterQuiz, isolated behind a Suspense boundary so the
 * rest of the route stays static and crawlable.
 */

const heroStats = [
  { value: '12', label: 'Hallmarks of aging', icon: Dna },
  { value: '49', label: 'Graded compounds', icon: FlaskConical },
  { value: 'A–C', label: 'Evidence tiers', icon: ShieldCheck },
  { value: '100%', label: 'Free & private', icon: Lock },
];

const trustMarkers = ['Free forever', 'Data stays on your device', 'No account needed'];

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative isolate overflow-hidden bg-[var(--color-bg-base)] pt-28 pb-16 md:pt-32 md:pb-24"
    >
      {/* Backdrop — dot grid + twin blur orbs carry the navy/cyan atmosphere;
          the molecular motif is bled full-bleed behind the whole hero at real
          visual weight so it reads as a genuine graphic centerpiece rather
          than a faint corner texture. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#12203c_0.8px,transparent_1px)] [background-size:22px_22px] opacity-50" />
        <div
          className="absolute -left-32 -top-40 h-[38rem] w-[38rem] rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-cyan) 16%, transparent), transparent 60%)' }}
        />
        <div
          className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-emerald) 12%, transparent), transparent 60%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        <MolecularMotif
          theme="cyan"
          size="hero"
          className="absolute -right-16 top-0 hidden opacity-60 md:block lg:-right-8 [mask-image:linear-gradient(to_right,transparent,black_14%)]"
        />
      </div>

      <div className="container-page">
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-14">
          {/* Copy column */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="mb-7 flex items-center justify-center gap-3 lg:justify-start">
              <Logo variant="lockup" size="hero" />
              <span className="badge-live">
                <span className="badge-live-dot" />
                Platform Active
              </span>
            </div>

            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 text-xs font-medium text-foreground/80">
              <Sparkles className="h-3.5 w-3.5 text-accent-cyan" aria-hidden="true" />
              The anti-aging operating system
            </span>

            <h1 id="home-hero-heading" className="headline-editorial mb-2">
              Understand how you age.
              <br />
              <span className="relative inline-block">
                <span className="gradient-sweep-text">Then act on the evidence.</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 460 20"
                  className="pointer-events-none absolute -bottom-2 left-0 h-4 w-full max-w-[460px] opacity-70"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 12 C 90 4, 180 18, 270 9 S 420 3, 456 11"
                    fill="none"
                    stroke="url(#hero-underline-fade)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="blur(3px)"
                  />
                  <path
                    d="M4 12 C 90 4, 180 18, 270 9 S 420 3, 456 11"
                    fill="none"
                    stroke="url(#hero-underline-fade)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="hero-underline-fade" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
                      <stop offset="55%" stopColor="#34d399" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="mx-auto mb-8 mt-6 max-w-xl text-lg leading-relaxed text-foreground/70 md:text-xl lg:mx-0">
              TNiC turns longevity science into one clear protocol — the 12 hallmarks of
              aging, evidence-graded compounds, and simulators that project the impact
              before you commit. Independent, private, and free.
            </p>

            <div className="mb-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
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

            <div className="mb-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium tracking-wide text-foreground/50 lg:justify-start">
              {trustMarkers.map((marker, i) => (
                <span key={marker} className="flex items-center gap-4">
                  {i > 0 && <span className="h-3 w-px bg-foreground/15" aria-hidden="true" />}
                  <span>{marker}</span>
                </span>
              ))}
            </div>

            {/* Evidence stat rail — premium HUD treatment with per-stat icons;
                each cell carries its own elevation and lifts on hover. */}
            <dl className="platform-hud">
              {heroStats.map((stat) => (
                <div key={stat.label} className="platform-hud-cell text-center lg:text-left">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <stat.icon
                      className="mx-auto mb-1.5 h-4 w-4 text-accent-cyan opacity-80 lg:mx-0"
                      aria-hidden="true"
                    />
                    <span className="platform-hud-value">{stat.value}</span>
                    <span className="platform-hud-label">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Interactive quiz — the single client island in the hero */}
          <div className="mt-12 lg:col-span-5 lg:mt-6">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-accent-cyan/14 via-transparent to-accent-emerald/14 blur-2xl"
                aria-hidden="true"
              />
              <div className="card-depth relative rounded-3xl">
                <div className="tnic-glass rounded-3xl">
                  <Suspense
                    fallback={<div className="h-[380px] animate-pulse rounded-3xl bg-foreground/5" />}
                  >
                    <StarterQuiz />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
