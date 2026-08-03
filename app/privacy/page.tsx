import { Shield } from 'lucide-react';
import Link from 'next/link';
import { TrustPageTemplate } from '@/components/trust/TrustPageTemplate';
import { seoRoutes } from '@/lib/seo-routes';
import { PRIVACY_PRINCIPLES } from '@/lib/privacy';

export const metadata = seoRoutes.privacy();

const LAST_UPDATED = 'July 20, 2026';

export default function PrivacyPage() {
  return (
    <TrustPageTemplate
      icon={Shield}
      eyebrow="Trust · Privacy"
      title="Privacy Policy"
      description="TNiC is local-first: your labs, profile, stack, and notes stay in your browser by default. This page maps, feature by feature, what stays on your device and what is transmitted only when you choose an optional integration."
      disclaimer="This is a plain-language summary of current data behavior. It is not yet reviewed by legal counsel — see the note at the end."
    >
      <div className="space-y-8 text-body">
        <p className="text-caption font-mono">Last updated: {LAST_UPDATED}</p>

        <section className="space-y-3">
          <h2 className="text-h3">The short version</h2>
          <ul className="space-y-2 list-disc pl-5">
            {PRIVACY_PRINCIPLES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">What stays on your device</h2>
          <p>
            The core TNiC workspace runs entirely in your browser. The following are stored in your
            browser&apos;s local (or session) storage and are never sent to a TNiC server:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Your profile inputs (age and lifestyle sliders)</li>
            <li>Lab and biomarker values you enter or import</li>
            <li>Your saved stack, checklist progress, hallmark notes, and milestones</li>
            <li>NICO Starter Questionnaire results and tool state</li>
            <li>Your privacy mode (local vs. session-only) and consent choice</li>
          </ul>
          <p>
            You can switch to session-only storage or erase everything at any time from the
            {' '}<Link href="/health-data" className="text-accent-cyan hover:underline">Health Data</Link>{' '}
            controls.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">What is transmitted — only when you choose it</h2>
          <p>
            A few optional features do involve sending data off your device. Each is opt-in and clearly
            initiated by you:
          </p>
          <div className="space-y-4">
            <DataRow
              title="Protocol Brief (email)"
              what="The email address you submit."
              who="Resend (email delivery) and, if configured, a subscribe webhook."
              why="To send the research digest you signed up for and let you unsubscribe."
            />
            <DataRow
              title="Lab-partner import"
              what="Order and biomarker data exchanged with a lab partner you connect (currently Longevity Direct) via OAuth."
              who="The lab partner you authorize. TNiC proxies the request; it does not maintain a health database of your results."
              why="To pull results into your local workspace. You initiate the connection and can decline."
            />
            <DataRow
              title="Contact form"
              what="Whatever you type into your own email client. The form opens a pre-filled mailto: — it does not POST to TNiC."
              who="Your email provider and TNiC's inbox. A local draft is also saved in your browser."
              why="To answer content, evidence, privacy, or partnership questions. Do not send sensitive health details by email."
            />
            <DataRow
              title="Product / affiliate links"
              what="A standard outbound click; some links carry affiliate tags."
              who="The destination retailer."
              why="To let you buy from third parties. See the sponsorship principles for how this is separated from editorial."
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Analytics</h2>
          <p>
            TNiC uses Vercel Analytics and Vercel Speed Insights to measure aggregate traffic and page
            performance. These do not receive your lab values, profile inputs, selected conditions,
            medications, or any free-text you enter. No wellbeing or health-topic content is included in
            analytics payloads.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">What TNiC does not do</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>No sale of user health data — there is no such business model.</li>
            <li>No accounts or server-side database of your labs, stack, or notes.</li>
            <li>No cookies used to store health data.</li>
            <li>No health information placed in URLs (shared stack links carry compound IDs only).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Your controls</h2>
          <p>
            Because your data lives in your browser, you hold it directly: switch to session-only mode,
            export it, or purge all health-adjacent data. See{' '}
            <Link href="/health-data" className="text-accent-cyan hover:underline">Your Health Data</Link>.
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-4">
          <h2 className="text-h3">Legal review status</h2>
          <p className="text-sm text-muted-foreground">
            This policy describes current, verifiable data behavior in the product. It has not yet been
            reviewed by qualified legal counsel and does not assert compliance with any specific statute
            or framework (for example GDPR, CCPA, or HIPAA). If you operate TNiC and need a
            jurisdiction-specific policy, have counsel review and finalize this text before relying on it.
          </p>
        </section>
      </div>
    </TrustPageTemplate>
  );
}

function DataRow({ title, what, who, why }: { title: string; what: string; who: string; why: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <p className="font-semibold mb-2">{title}</p>
      <dl className="grid sm:grid-cols-[7rem_1fr] gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <dt className="font-medium text-foreground">What leaves</dt>
        <dd>{what}</dd>
        <dt className="font-medium text-foreground">Who receives it</dt>
        <dd>{who}</dd>
        <dt className="font-medium text-foreground">Why</dt>
        <dd>{why}</dd>
      </dl>
    </div>
  );
}
