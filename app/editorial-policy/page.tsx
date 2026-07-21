import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { TrustPageTemplate } from '@/components/trust/TrustPageTemplate';
import { seoRoutes } from '@/lib/seo-routes';

export const metadata = seoRoutes.editorialPolicy();

export default function EditorialPolicyPage() {
  return (
    <TrustPageTemplate
      icon={BookOpen}
      eyebrow="Trust · Editorial"
      title="Editorial Policy"
      description="How TNiC sources, grades, authors, reviews, and corrects its longevity content — stated plainly, including where independent clinical review is not yet in place."
      disclaimer="Editorial governance is being strengthened. This page states the current, honest status — including its gaps."
    >
      <div className="space-y-8 text-body">
        <section className="space-y-3">
          <h2 className="text-h3">Sourcing</h2>
          <p>
            Claims are tied to primary literature with direct PMID/DOI links wherever possible. The
            evidence model and how tiers are defined are described in the{' '}
            <Link href="/trust/methodology" className="text-accent-cyan hover:underline">methodology</Link>.
            A citation is a pointer to a source — not, on its own, proof that a nearby claim is
            established. Where a source&apos;s population, intervention, comparator, duration, or endpoint
            does not match a claim, the claim should be downgraded or rewritten.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Grading, toward claim-level evidence</h2>
          <p>
            TNiC is moving from compound-level tier badges toward evidence graded at the level of a
            specific claim or outcome (mechanism vs. biomarker vs. clinical vs. lifespan), so a single
            &quot;Tier A · Clinical&quot; label can no longer sit on top of mechanistic or ex-vivo
            evidence. Until that migration is complete, some pages still show compound-level tiers; treat
            them as directional.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Authorship &amp; review — current status</h2>
          <p>
            TNiC content is authored by the TNiC team. Author background is described on the{' '}
            <Link href="/about" className="text-accent-cyan hover:underline">About</Link> page.
          </p>
          <p className="rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Independent clinical review is not yet in place.</strong>{' '}
            Health content on this site is not currently reviewed by a named, credentialed clinician,
            pharmacist, or biostatistician. Until it is, pages should carry a &quot;Not independently
            clinician-reviewed&quot; status, and no content should be read as a personal recommendation.
            Establishing named independent reviewers is an owner action tracked in the project handoff.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Independence &amp; disclosure</h2>
          <p>
            Commercial links are disclosed and kept separate from evidence grading, per the{' '}
            <Link href="/trust/sponsorship" className="text-accent-cyan hover:underline">sponsorship principles</Link>.
            Evidence tiers are never influenced by whether a compound is purchasable or sponsored.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Corrections</h2>
          <p>
            Errors are fixed openly. See the{' '}
            <Link href="/corrections" className="text-accent-cyan hover:underline">corrections log</Link>{' '}
            and how to report one.
          </p>
        </section>
      </div>
    </TrustPageTemplate>
  );
}
