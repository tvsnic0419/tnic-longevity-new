import { FileText } from 'lucide-react';
import Link from 'next/link';
import { TrustPageTemplate } from '@/components/trust/TrustPageTemplate';
import { seoRoutes } from '@/lib/seo-routes';

export const metadata = seoRoutes.terms();

const LAST_UPDATED = 'July 20, 2026';

export default function TermsPage() {
  return (
    <TrustPageTemplate
      standalone
      icon={FileText}
      eyebrow="Trust · Terms"
      title="Terms of Use"
      description="The terms that govern your use of TNiC. In short: this is an independent educational platform. It is not medical advice, and it does not diagnose, treat, or prescribe."
      disclaimer="Draft terms describing intended use. Not yet reviewed by legal counsel — see the note at the end."
    >
      <div className="space-y-8 text-body">
        <p className="text-caption font-mono">Last updated: {LAST_UPDATED}</p>

        <section className="space-y-3">
          <h2 className="text-h3">1. Educational purpose only</h2>
          <p>
            TNiC provides longevity research education and private, browser-based tools to help you
            organize what you read. It is not a medical provider, does not establish a clinician–patient
            relationship, and does not offer diagnosis, treatment, or prescriptions. Always consult a
            qualified clinician before starting, stopping, or changing any supplement, medication, or
            protocol. See the{' '}
            <Link href="/trust/disclaimers" className="text-accent-cyan hover:underline">disclaimers</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">2. No warranty of outcomes</h2>
          <p>
            Content is provided &quot;as is.&quot; Evidence summaries, modeled biological-age estimates,
            and biomarker projections are educational and uncertain by nature. TNiC makes no guarantee of
            any health, performance, or longevity outcome, and does not warrant that content is complete,
            current, or error-free. To report an error, see{' '}
            <Link href="/corrections" className="text-accent-cyan hover:underline">Corrections</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">3. Your responsibilities</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>Use the platform lawfully and for your own informational purposes.</li>
            <li>Do not present TNiC content as medical advice to others.</li>
            <li>Verify any purchase, dose, or product decision with a qualified professional.</li>
            <li>Keep your own backups of anything you export from the local workspace.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">4. Third-party links and partners</h2>
          <p>
            TNiC links to retailers, lab partners, and research sources it does not control. Some links
            are affiliate links. TNiC is not responsible for third-party content, products, or data
            practices. How commercial relationships are separated from editorial is described in the{' '}
            <Link href="/trust/sponsorship" className="text-accent-cyan hover:underline">sponsorship principles</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">5. Data</h2>
          <p>
            Your use of TNiC is also governed by the{' '}
            <Link href="/privacy" className="text-accent-cyan hover:underline">Privacy Policy</Link>{' '}
            and{' '}
            <Link href="/health-data" className="text-accent-cyan hover:underline">Health Data</Link>{' '}
            pages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">6. Changes</h2>
          <p>
            These terms may change. Material changes will be noted with an updated date at the top of this
            page.
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-4">
          <h2 className="text-h3">Legal review status</h2>
          <p className="text-sm text-muted-foreground">
            This is a plain-language draft describing how TNiC intends to be used. It has not been
            reviewed by qualified legal counsel and is not a substitute for a jurisdiction-appropriate
            terms-of-service agreement (limitation of liability, governing law, dispute resolution, and
            similar clauses are intentionally not asserted here). Have counsel finalize before relying on
            it.
          </p>
        </section>
      </div>
    </TrustPageTemplate>
  );
}
