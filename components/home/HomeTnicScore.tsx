import Link from 'next/link';
import { ArrowRight, FlaskConical, Network, UserCog, Eye, type LucideIcon } from 'lucide-react';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { TnicScoreCard } from '@/components/scorecard/TnicScoreCard';
import { computeTnicScore } from '@/lib/tnic-score';

/**
 * Section 3 — introduce the proprietary TNiC Score. Server-rendered: the score
 * for the representative compound is computed here so the scoring libraries
 * stay off the client bundle and the scorecard is crawlable HTML. Doubles as
 * the "why TNiC" trust layer via the four evidence pillars beside the card.
 */

// GlyNAC — TNiC's flagship Tier-A intervention, scored on the full LQ model, so
// the showcase card renders every dimension at high confidence.
const showcaseScore = computeTnicScore('glynac');

const pillars: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: FlaskConical, title: 'Evidence', body: 'Every compound graded A–C on the strength of human data, traced to PubMed.' },
  { icon: Network, title: 'Systems biology', body: 'Mechanisms mapped across the 12 hallmarks of aging — not isolated claims.' },
  { icon: UserCog, title: 'Personalization', body: 'Evidence turned into an individualized protocol you can actually act on.' },
  { icon: Eye, title: 'Transparency', body: 'The methodology is shown in the open — no pay-for-placement, ever.' },
];

export function HomeTnicScore() {
  return (
    <section
      aria-labelledby="home-score-heading"
      className="relative border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider hue="var(--accent-emerald)" index="01" label="The TNiC Score" />
      <div className="container-page">
        <RevealItem className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-label mb-3 text-accent-emerald">One score, fully sourced</p>
          <h2 id="home-score-heading" className="heading-section mb-3">
            The TNiC Score — evidence, distilled.
          </h2>
          <div className="heading-accent-rule is-center mb-4" aria-hidden="true" />
          <p className="text-body mx-auto max-w-xl">
            A single, transparent index that reads across human evidence, clinical
            depth, mechanism, safety, bioavailability, and longevity relevance — so
            you can compare compounds in seconds, then open the studies behind every
            number.
          </p>
        </RevealItem>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Pillars — the "why trust this" layer */}
          <RevealItem className="order-2 lg:order-1">
            <ul className="grid gap-4 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, title, body }) => (
                <li key={title} className="premium-card p-5">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl icon-badge-emerald">
                    <Icon className="h-5 w-5 text-accent-emerald" aria-hidden="true" />
                  </span>
                  <h3 className="heading-card mb-1.5">{title}</h3>
                  <p className="text-body-sm leading-relaxed text-muted-foreground">{body}</p>
                </li>
              ))}
            </ul>
            <Link
              href="/elite-8"
              className="focus-ring group mt-6 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-accent-emerald"
            >
              Explore compound scores
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </RevealItem>

          {/* Representative scorecard */}
          <RevealItem index={1} className="order-1 lg:order-2">
            <p className="mb-3 text-center text-micro font-mono uppercase tracking-widest text-muted-foreground lg:text-left">
              Representative scorecard · {showcaseScore.compoundName}
            </p>
            <TnicScoreCard score={showcaseScore} href="/library/compare" />
          </RevealItem>
        </div>
      </div>
    </section>
  );
}
