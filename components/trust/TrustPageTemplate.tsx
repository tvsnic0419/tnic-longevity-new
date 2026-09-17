import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ThemeAccent } from '@/lib/design-system';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { DisclaimerInline } from './DisclaimerBanner';
import { getTrustPageContext, type TrustPageKey } from '@/lib/hub-context';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom, type ClusterId } from '@/lib/page-connections';

interface TrustPageTemplateProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  theme?: ThemeAccent;
  pageKey?: TrustPageKey;
  children: React.ReactNode;
  showBackLink?: boolean;
  disclaimer?: string;
  /**
   * Trust *children* (/trust/methodology, …) render under `app/trust/layout.tsx`,
   * which already supplies the Nav + ContextBar + Footer shell. But this template
   * is also reused by top-level routes that live OUTSIDE /trust (privacy, terms,
   * health-data, editorial-policy, corrections) — those have no ancestor layout,
   * so without this they render with no site chrome at all. Pass `standalone` on
   * exactly those pages to wrap the template in the shared `SubPageLayout` (and
   * never on a /trust child, which would double the chrome).
   */
  standalone?: boolean;
  /**
   * This page's own route. Required to render the connections rail, because
   * the rail excludes the page you are already on by href.
   *
   * A route audit found every page using this template sitting at one or two
   * in-body links despite carrying real prose — /trust/methodology explained
   * the entire grading ladder across 4,860 characters and linked to nothing,
   * /trust/updates ran to 14,367 characters with two links. These are exactly
   * the pages a sceptical reader arrives on, and they were the site's biggest
   * dead ends.
   */
  path?: string;
  /**
   * Which cluster of siblings to offer. Defaults to the trust cluster; the
   * legal/data pages (privacy, health-data, terms) pass `policy`, because a
   * reader asking "what do you do with my data" wants the other policies, not
   * the grading methodology.
   */
  cluster?: ClusterId;
}

/** Reusable template for /trust sub-pages */
export function TrustPageTemplate({
  icon,
  eyebrow,
  title,
  description,
  theme = 'emerald',
  pageKey,
  children,
  showBackLink = true,
  disclaimer = 'TNiC is educational only — not medical advice. Consult your physician before starting any protocol.',
  standalone = false,
  path,
  cluster = 'trust',
}: TrustPageTemplateProps) {
  const body = (
    <PageShell measure="reading">
      {showBackLink && (
        <Link
          href="/trust"
          className="action-link focus-ring interactive gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-6 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Trust Hub
        </Link>
      )}
      <PageHeader
        icon={icon}
        eyebrow={eyebrow}
        title={title}
        description={description}
        theme={theme}
        align="left"
        context={pageKey ? getTrustPageContext(pageKey) : undefined}
      />
      <div className="prose-tnic max-w-4xl">{children}</div>
      {path && (
        <PageConnections
          cluster={clusterFrom(cluster, path)}
          accent={cluster === 'policy' ? 'amber' : 'emerald'}
          id="trust-connections"
        />
      )}
      <DisclaimerInline text={disclaimer} />
    </PageShell>
  );

  return standalone ? <SubPageLayout>{body}</SubPageLayout> : body;
}