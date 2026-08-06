import Link from 'next/link';
import type { Metadata } from 'next';
import { Library, Dna, Syringe, Home, ArrowRight, Compass } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Page not found — TNiC',
  description: 'That page isn’t in the library. Head back to the evidence-graded longevity library, the 12 hallmarks, or the peptide guide.',
  robots: { index: false, follow: true },
};

const destinations = [
  {
    href: '/library',
    icon: Library,
    accent: 'var(--accent-cyan)',
    title: 'The Library',
    desc: 'Every compound, evidence-graded with PubMed citations.',
  },
  {
    href: '/hallmarks',
    icon: Dna,
    accent: 'var(--accent-emerald)',
    title: 'The 12 Hallmarks',
    desc: 'The molecular mechanisms that drive aging.',
  },
  {
    href: '/peptides',
    icon: Syringe,
    accent: 'var(--accent-rose)',
    title: 'Peptides',
    desc: 'Longevity peptides, graded — with legal status stated plainly.',
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen canvas-scrim text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1} className="relative overflow-hidden">
        {/* Ambient backdrop — dot grid + cyan/gold radial washes, matching the hero */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(#12203c_0.8px,transparent_1px)] [background-size:22px_22px] opacity-40" />
          <div className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(0,224,255,0.12),transparent_60%)] blur-2xl" />
          <div className="absolute -right-32 top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(240,196,106,0.08),transparent_60%)] blur-2xl" />
        </div>

        <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
          <p className="text-label mb-5 inline-flex items-center gap-2 text-accent-cyan">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            Error 404
          </p>

          {/* Oversized editorial numeral */}
          <p className="gradient-sweep-text font-display text-[clamp(5rem,18vw,11rem)] font-semibold leading-none tracking-tight">
            404
          </p>

          <h1 className="heading-section mt-4 max-w-2xl">
            This molecule isn’t in the library.
          </h1>
          <p className="text-body mt-4 max-w-xl text-muted-foreground">
            The page you’re after has moved, been renamed, or never existed. Nothing is broken —
            your local data is untouched. Pick a path back in below.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="tnic-button-primary focus-ring group inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-base"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              Back to home
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Destination cards — premium-card idiom, one accent each */}
          <div className="mt-14 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
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
                  <span
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold [color:var(--card-accent)]"
                  >
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
