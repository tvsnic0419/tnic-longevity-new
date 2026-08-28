import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { themes, type ThemeAccent } from '@/lib/design-system';
import styles from './FlagshipFoundation.module.css';

export interface DecisionStepItem {
  title: string;
  detail: string;
  href?: string;
  icon: LucideIcon;
}

/**
 * A consistent orientation surface for high-intent TNiC experiences. It makes
 * the first three actions clear without reducing the surrounding page to a
 * conversion funnel or implying an individualized health recommendation.
 */
export function DecisionSteps({
  eyebrow = 'A confident path',
  title,
  detail,
  steps,
  theme = 'cyan',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  detail: string;
  steps: DecisionStepItem[];
  theme?: ThemeAccent;
  className?: string;
}) {
  const accent = themes[theme].cssVar;

  return (
    <section
      className={`${styles.foundation} decision-switchboard ${className}`}
      style={{ '--decision-accent': accent } as React.CSSProperties}
      aria-label={title}
    >
      <div className="decision-switchboard__intro">
        <div>
          <p className="decision-switchboard__eyebrow">{eyebrow}</p>
          <h2 className="decision-switchboard__title">{title}</h2>
          <p className="decision-switchboard__detail">{detail}</p>
        </div>
        <p className="decision-switchboard__note">Choose a starting point</p>
      </div>

      <ol className="decision-switchboard__steps">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const content = (
            <>
              <span className="decision-switchboard__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="decision-switchboard__icon" aria-hidden="true">
                <Icon className="h-4 w-4" />
              </span>
              <span className="decision-switchboard__copy">
                <span className="decision-switchboard__step-title">{step.title}</span>
                <span className="decision-switchboard__step-detail">{step.detail}</span>
              </span>
              {step.href && <ArrowRight className="decision-switchboard__arrow" aria-hidden="true" />}
            </>
          );

          return (
            <li key={step.title}>
              {step.href ? (
                <Link href={step.href} className="decision-switchboard__step decision-switchboard__step--link focus-ring">
                  {content}
                </Link>
              ) : (
                <div className="decision-switchboard__step">{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
