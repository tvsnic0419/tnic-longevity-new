import { Activity } from 'lucide-react';
import Link from 'next/link';
import { TrustPageTemplate } from '@/components/trust/TrustPageTemplate';
import { seoRoutes } from '@/lib/seo-routes';

export const metadata = seoRoutes.healthData();

export default function HealthDataPage() {
  return (
    <TrustPageTemplate
      icon={Activity}
      eyebrow="Trust · Health Data"
      title="Your Health Data"
      description="Where your labs, profile, stack, and notes actually live — what stays in your browser, what moves only when you choose an optional feature, and how to erase it."
      disclaimer="Describes current product behavior. Not legal advice — TNiC is not a HIPAA-covered entity."
    >
      <div className="space-y-8 text-body">
        <section className="space-y-3">
          <h2 className="text-h3">Stored in your browser</h2>
          <p>
            Your profile, lab values, saved stack, checklist, hallmark notes, milestones, and Nico Questionnaire result
            are held in your browser&apos;s local (or session) storage. They are not uploaded to a TNiC
            server, and TNiC keeps no account or database of them.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">When data leaves your browser</h2>
          <p>Only through features you explicitly start:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong className="text-foreground">Lab-partner import:</strong> connecting a partner (e.g.
              Longevity Direct) via OAuth exchanges order/biomarker data with that partner.
            </li>
            <li>
              <strong className="text-foreground">Protocol Brief:</strong> subscribing sends your email
              address to the email-delivery provider.
            </li>
            <li>
              <strong className="text-foreground">Contact:</strong> the form opens your own email client;
              anything you type is sent by you, to TNiC&apos;s inbox.
            </li>
            <li>
              <strong className="text-foreground">Export/share:</strong> files you export or links you
              share leave your device by your action. Shared stack links contain compound IDs only — never
              lab values.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Retention &amp; deletion</h2>
          <p>
            Local data persists in your browser until you clear it. You can switch to session-only
            storage (cleared when the tab closes) or purge all health-adjacent data from the privacy
            controls in the app. Clearing your browser storage also removes it. Data you have already sent
            to a lab partner or email provider is governed by that provider&apos;s retention policy, not
            TNiC&apos;s.
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-4">
          <h2 className="text-h3">This may be health information — but TNiC is not HIPAA-covered</h2>
          <p className="text-sm text-muted-foreground">
            Lab values and biomarker notes can be sensitive health information. TNiC is an educational
            platform, not a healthcare provider, insurer, or clearinghouse, so it is not a HIPAA-covered
            entity and this data is not protected health information in the HIPAA sense. Treat exports and
            emails accordingly, and do not send sensitive results through ordinary email. Questions about
            data handling: see{' '}
            <Link href="/privacy" className="text-accent-cyan hover:underline">Privacy</Link>.
          </p>
        </section>
      </div>
    </TrustPageTemplate>
  );
}
