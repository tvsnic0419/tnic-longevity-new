import Link from 'next/link';
import { LayoutDashboard, Sparkles, FlaskConical, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RevealItem } from '@/components/ui/RevealItem';

/**
 * Longevity OS — coming-soon teaser.
 *
 * RESERVED, NOT MOUNTED. Per owner direction (2026-07): the Longevity OS name
 * is reserved for future brand expansion and should NOT be marketed yet. This
 * full teaser band is intentionally not rendered on the homepage — the only
 * live mention is a quiet line in the footer. Keep this component ready to drop
 * back into app/page.tsx when it's time to promote the OS; do not add hype
 * copy or fabricated launch dates/capabilities in the meantime.
 */

const osFeatures = [
  {
    icon: FlaskConical,
    title: 'Matched to your biology',
    body: 'Surface the nutrients and compounds whose human evidence lines up with your biomarkers and the hallmarks you care about.',
  },
  {
    icon: Sparkles,
    title: 'Simulate before you commit',
    body: 'Model a stack for synergy and known interaction flags — so you can see the shape of a plan before spending on it.',
  },
  {
    icon: Activity,
    title: 'Track change privately',
    body: 'Log labs over time and watch the trend, entirely in your browser. No account, no server-side health record.',
  },
];

export function HomeOSComingSoon() {
  return (
    <section
      aria-labelledby="home-os-heading"
      className="relative overflow-hidden border-t border-border/50 py-24 md:py-32"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute right-1/2 top-1/4 h-[24rem] w-[38rem] translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-emerald)_12%,transparent),transparent_65%)] blur-2xl" />
      </div>

      <div className="container-page">
        <div className="items-center gap-12 lg:grid lg:grid-cols-12">
          {/* Copy column */}
          <RevealItem className="lg:col-span-6">
            <span className="badge-live mb-5 inline-flex" aria-label="Coming soon">
              <span className="badge-live-dot" />
              Coming soon
            </span>
            <h2 id="home-os-heading" className="heading-section mb-4">
              Longevity OS — your personal cell-health workspace
            </h2>
            <p className="text-body mb-6 max-w-xl">
              The next chapter of TNiC turns the library into a plan that fits you. The Longevity OS
              matches evidence-graded nutrition to your own biomarkers and the hallmarks you want to
              act on — local-first, private, and free, like everything else here.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/brief"
                className="btn-gradient focus-ring group justify-center rounded-full text-base"
              >
                Get notified at launch
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <GlassPanel depth="float" className="glass-hover rounded-full">
                <Link
                  href="/dashboard"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-foreground"
                >
                  <LayoutDashboard className="h-5 w-5 text-accent-cyan" aria-hidden="true" />
                  Try the early preview
                </Link>
              </GlassPanel>
            </div>
            <p className="text-caption mt-4 flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-accent-emerald" aria-hidden="true" />
              Preview runs on your device today — the full OS is still in development.
            </p>
          </RevealItem>

          {/* Feature column */}
          <div className="mt-10 space-y-4 lg:col-span-6 lg:mt-0">
            {osFeatures.map((f) => (
              <RevealItem key={f.title}>
                <GlassPanel depth="mid" className="rounded-2xl p-5">
                  <div className="flex gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-cyan/10 border border-accent-cyan/20">
                      <f.icon className="h-5 w-5 text-accent-cyan" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="mb-1 font-semibold text-foreground">{f.title}</p>
                      <p className="text-body-sm text-muted-foreground">{f.body}</p>
                    </div>
                  </div>
                </GlassPanel>
              </RevealItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
