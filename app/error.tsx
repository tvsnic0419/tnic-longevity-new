'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw, Library, Wrench, ArrowRight } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

const destinations = [
  {
    href: '/library',
    icon: Library,
    accent: 'var(--accent-cyan)',
    title: 'The Library',
    desc: 'Every compound, evidence-graded with PubMed citations.',
  },
  {
    href: '/tools',
    icon: Wrench,
    accent: 'var(--accent-violet)',
    title: 'The Tools',
    desc: 'Stack architect, interaction checks, and healthspan models.',
  },
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[tnic.help]', error);
  }, [error]);

  return (
    <div className="min-h-screen canvas-scrim text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1} className="relative overflow-hidden">
        {/* Ambient backdrop — dot grid + rose/cyan radial washes, matching the 404 */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(#12203c_0.8px,transparent_1px)] [background-size:22px_22px] opacity-40" />
          <div className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.10),transparent_60%)] blur-2xl" />
          <div className="absolute -right-32 top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,224,255,0.09),transparent_60%)] blur-2xl" />
        </div>

        <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
          <p className="text-label mb-5 inline-flex items-center gap-2 text-accent-rose">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Unexpected error
          </p>

          {/* Oversized editorial glyph */}
          <p className="gradient-sweep-text font-display text-[clamp(4rem,15vw,9rem)] font-semibold leading-none tracking-tight">
            Hmm.
          </p>

          <h1 className="heading-section mt-4 max-w-2xl">
            Something went wrong on our end.
          </h1>
          <p className="text-body mt-4 max-w-xl text-muted-foreground">
            TNiC hit an unexpected error rendering this page. Nothing is broken on your side —
            your local data is untouched. Try again, or take one of the paths below.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="tnic-button-primary focus-ring group inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-base"
            >
              <RefreshCw className="h-5 w-5 transition-transform group-hover:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
              Try again
            </button>
            <Link
              href="/"
              className="tnic-button-outline focus-ring group inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-base"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              Back to home
            </Link>
          </div>

          {/* Destination cards — premium-card idiom, one accent each */}
          <div className="mt-14 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            {destinations.map((d) => {
              const Icon = d.icon;
              return (
                <Link
                  key={d.href}
                  href={d.href}
                  style={{ ['--card-accent' as string]: d.accent }}
                  className="premium-card focus-ring group h-full items-start p-5 text-left"
                >
                  <span
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                    style={{
                      background: `color-mix(in srgb, ${d.accent} 12%, transparent)`,
                      borderColor: `color-mix(in srgb, ${d.accent} 30%, transparent)`,
                    }}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" style={{ color: d.accent }} />
                  </span>
                  <h2 className="font-display text-lg font-medium tracking-tight text-foreground transition-colors group-hover:[color:var(--card-accent)]">
                    {d.title}
                  </h2>
                  <p className="mt-1 text-body-sm text-muted-foreground">{d.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold [color:var(--card-accent)]">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>

          {error.digest && (
            <p className="mt-10 font-mono text-micro text-[var(--color-text-faint)]">
              Reference: {error.digest}
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
