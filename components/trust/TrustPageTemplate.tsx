import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ThemeAccent } from '@/lib/design-system';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { DisclaimerInline } from './DisclaimerBanner';
import { getTrustPageContext, type TrustPageKey } from '@/lib/hub-context';

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
}: TrustPageTemplateProps) {
  return (
    <PageShell>
      {showBackLink && (
        <Link
          href="/trust"
          className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-6 rounded-md"
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
      <div className="max-w-4xl">{children}</div>
      <DisclaimerInline text={disclaimer} />
    </PageShell>
  );
}