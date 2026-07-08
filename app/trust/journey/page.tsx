import { Route } from 'lucide-react';
import { TrustPageTemplate } from '@/components/trust/TrustPageTemplate';
import { JourneyTimeline } from '@/components/trust/JourneyTimeline';
import { PersonalJourneyPanel } from '@/components/trust/PersonalJourneyPanel';
import { DisclaimerBanner } from '@/components/trust/DisclaimerBanner';
import { journeyMilestones } from '@/lib/journey';
import { disclaimers } from '@/lib/trust';
import { seoRoutes } from '@/lib/seo-routes';

export const metadata = seoRoutes.trustJourney();

export default function JourneyPage() {
  return (
    <TrustPageTemplate
      icon={Route}
      eyebrow="Trust · Journey"
      title="Personal Journey Timeline"
      description="Real protocol evolution with honest N=1 vs. population science labeling. Plus a template for tracking your own longevity journey."
      pageKey="journey"
    >
      <DisclaimerBanner disclaimer={disclaimers[2]} showAppliesTo />
      <section className="mt-10 mb-12">
        <h2 className="heading-section text-xl mb-6">TNiC Platform Journey</h2>
        <JourneyTimeline milestones={journeyMilestones} />
      </section>
      <section>
        <h2 className="heading-section text-xl mb-6">Your Journey</h2>
        <PersonalJourneyPanel />
      </section>
    </TrustPageTemplate>
  );
}