import { Eye } from 'lucide-react';
import { TrustPageTemplate } from '@/components/trust/TrustPageTemplate';
import { DisclaimerBanner } from '@/components/trust/DisclaimerBanner';
import { disclaimers } from '@/lib/trust';
import { seoRoutes } from '@/lib/seo-routes';

export const metadata = seoRoutes.trustDisclaimers();

export default function DisclaimersPage() {
  return (
    <TrustPageTemplate
      icon={Eye}
      eyebrow="Trust · Disclaimers"
      title="Disclaimers & Notices"
      description="Every limitation of the TNiC platform, clearly stated. Read before building stacks, logging labs, or acting on recommendations."
      disclaimer="These disclaimers apply site-wide. When in doubt, consult a qualified physician."
      pageKey="disclaimers"
    >
      <div className="space-y-4">
        {disclaimers.map((d) => (
          <DisclaimerBanner key={d.id} disclaimer={d} showAppliesTo />
        ))}
      </div>

      <section className="mt-8 space-y-3 rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-4">
        <h2 className="text-h3">Legal review status</h2>
        <p className="text-sm text-muted-foreground">
          The FDA / DSHEA supplement notice above was drafted to match the standard
          structure/function-claim disclaimer language (21 CFR 101.93). It has not yet been
          reviewed by qualified legal counsel for this jurisdiction and business model. Have
          counsel confirm the exact wording and where it must appear relative to specific claims
          before relying on it.
        </p>
      </section>
    </TrustPageTemplate>
  );
}