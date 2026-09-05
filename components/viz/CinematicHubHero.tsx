import Link from 'next/link';
import { MoleculeStage } from './MoleculeStage';
import { HUES, type RGB } from './tokens';
import styles from '@/components/ui/FlagshipFoundation.module.css';

// ─────────────────────────────────────────────────────────────────────────────
// CinematicHubHero — shared research-instrument arrival surface for major hubs.
// The component retains its evidence-derived content contract while delegating its
// visual language to `app/globals.css`. This keeps every hub on one theme-aware,
// accessible, and intentionally restrained foundation instead of duplicating an
// embedded dark-only style island per route.
// ─────────────────────────────────────────────────────────────────────────────

export type HubStat = {
  value: string;
  label: string;
  /** When set, the stat becomes a deep-link to the exact set it counts. */
  href?: string;
};

// Canvas artwork still consumes RGB tuples, but CSS must consume the semantic
// theme variables so the same route accent is darker and contrast-safe in light
// mode rather than freezing to its dark-theme display value.
const HUE_CSS: Record<string, string> = {
  cyan: 'var(--accent-cyan)',
  indigo: 'var(--accent-violet)',
  violet: 'var(--accent-violet)',
  gold: 'var(--accent-amber)',
  amber: 'var(--accent-amber)',
  rose: 'var(--accent-rose)',
  teal: 'var(--accent-emerald)',
  emerald: 'var(--accent-emerald)',
};

export function CinematicHubHero({
  hue = 'violet',
  kicker,
  title,
  lead,
  stats,
  primary,
  secondary,
  titleAsHeading = false,
}: {
  hue?: keyof typeof HUES;
  kicker: string;
  /** Headline; wrap the accent fragment in <em> for the hue-colored italic. */
  title: React.ReactNode;
  /**
   * Render the cover headline as the page's real `<h1>` instead of a
   * decorative `<p>`. Default false, because most hubs put their semantic
   * `<h1>` in a PageHeader below this and two would collide. Hubs with no
   * PageHeader opt in via `titleAsHeading` so the page still has one.
   */
  titleAsHeading?: boolean;
  /** Supporting line; a string, or rich content with inline CountLinks. */
  lead: React.ReactNode;
  stats: HubStat[];
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  const rgb: RGB = HUES[hue] ?? HUES.violet;
  const hueCss = HUE_CSS[hue] ?? 'var(--accent-violet)';

  return (
    <section
      className={`${styles.foundation} research-hero`}
      style={{ '--research-hero-accent': hueCss } as React.CSSProperties}
    >
      {/* Decorative molecular field; all content remains readable without it. */}
      <div className="research-hero__field" aria-hidden="true">
        <MoleculeStage hue={rgb} interactive={false} />
      </div>
      <div className="research-hero__veil" aria-hidden="true" />

      <div className="container-page research-hero__inner">
        <p className="research-hero__eyebrow">{kicker}</p>
        {titleAsHeading ? (
          <h1 className="research-hero__title">{title}</h1>
        ) : (
          <p className="research-hero__title">{title}</p>
        )}
        <p className="research-hero__lead">{lead}</p>

        {stats.length > 0 && (
          <div className="research-hero__stats" aria-label={`${kicker} evidence summary`}>
            {stats.map((stat, index) => {
              const content = (
                <>
                  <span className="research-hero__stat-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="research-hero__stat-value">{stat.value}</span>
                  <span className="research-hero__stat-label">{stat.label}</span>
                  {stat.href && <span className="research-hero__stat-arrow" aria-hidden="true">→</span>}
                </>
              );

              return stat.href ? (
                <Link
                  href={stat.href}
                  key={stat.label}
                  className="research-hero__stat research-hero__stat--link focus-ring"
                  aria-label={`${stat.value} ${stat.label} — view all`}
                >
                  {content}
                </Link>
              ) : (
                <div className="research-hero__stat" key={stat.label}>
                  {content}
                </div>
              );
            })}
          </div>
        )}

        {(primary || secondary) && (
          <div className="research-hero__actions">
            {primary && (
              <Link href={primary.href} className="research-hero__action research-hero__action--primary focus-ring">
                <span>{primary.label}</span>
                <span className="research-hero__action-arrow" aria-hidden="true">→</span>
              </Link>
            )}
            {secondary && (
              <Link href={secondary.href} className="research-hero__action research-hero__action--secondary focus-ring">
                {secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
