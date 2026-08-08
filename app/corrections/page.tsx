import { ClipboardList } from 'lucide-react';
import { TrustPageTemplate } from '@/components/trust/TrustPageTemplate';
import { seoRoutes } from '@/lib/seo-routes';
import { SITE } from '@/lib/site';

export const metadata = seoRoutes.corrections();

interface Correction {
  date: string;
  page: string;
  change: string;
}

// Material corrections are appended here as they are made. Do not backfill or
// invent entries — an empty log is honest; a fabricated one is not.
const corrections: Correction[] = [];

export default function CorrectionsPage() {
  return (
    <TrustPageTemplate
      standalone
      icon={ClipboardList}
      eyebrow="Trust · Corrections"
      title="Corrections"
      description="Errors happen. When TNiC gets something materially wrong, it is fixed openly and logged here with a date and reason."
      disclaimer="A short or empty log means few logged corrections — not that content is beyond error. Please report anything that looks wrong."
    >
      <div className="space-y-8 text-body">
        <section className="space-y-3">
          <h2 className="text-h3">Report an error</h2>
          <p>
            Found a claim that misreads its source, a broken evidence link, or a factual mistake? Email{' '}
            <a href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent('[TNiC correction] ')}`} className="text-accent-cyan hover:underline">
              {SITE.contactEmail}
            </a>{' '}
            with the page and, if you can, the PMID/DOI that supports the fix. Please do not include
            personal health details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">How corrections work</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>Material factual errors are corrected on the page and logged below with a date.</li>
            <li>Minor typos and formatting are fixed without a log entry.</li>
            <li>Evidence re-grading that changes a conclusion is treated as a material correction.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Correction log</h2>
          {corrections.length === 0 ? (
            <p className="rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
              No corrections logged yet. This log begins as of the launch of the corrections process.
            </p>
          ) : (
            <ul className="space-y-3">
              {corrections.map((c, i) => (
                <li key={i} className="rounded-xl border border-border bg-card/50 p-4">
                  <p className="text-caption font-mono mb-1">{c.date}</p>
                  <p className="font-semibold">{c.page}</p>
                  <p className="text-sm text-muted-foreground">{c.change}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </TrustPageTemplate>
  );
}
