import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Check, ShieldAlert, ShieldX, ListOrdered, ArrowRight, Activity } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ResultActions } from '@/components/questionnaire/ResultActions';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { parseResultsSearchParams } from '@/lib/quiz-share';
import { resolveQuestionnaireResult, QUESTIONNAIRE_NAME, quizSteps } from '@/lib/questionnaire';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { getModulePath, compoundModules } from '@/lib/library-modules';
import type { PresetKey } from '@/lib/presets';

/**
 * `/results` — the durable, shareable outcome of the NICO Starter Questionnaire.
 *
 * Every answer lives in the query string and the resolver is pure, so the whole
 * result is computed on the server. That's what makes it survive a refresh, a
 * bookmark, or a shared link — the previous inline-only result panel lost
 * everything the moment the page reloaded.
 *
 * Deliberately `noindex, follow`: the answer space is combinatorial, so these
 * URLs shouldn't compete for crawl budget, but the outbound links should still
 * pass equity.
 */

export const metadata: Metadata = {
  title: `Your Result — ${QUESTIONNAIRE_NAME}`,
  description:
    'Your evidence-graded longevity stack, the reasoning behind each compound, and any items removed or flagged by the safety screen.',
  robots: { index: false, follow: true },
};

/** Deep-link a recommended compound to its library page when one exists. */
function libraryHrefFor(id: string): string | null {
  const entry = compoundModules.find((m) => m.compoundId === id || m.slug === id);
  return entry ? getModulePath(entry) : null;
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const answers = parseResultsSearchParams(params);

  // Nothing usable in the URL — send them to the questionnaire rather than
  // rendering an empty or invented result.
  if (!answers) redirect('/');

  const result = resolveQuestionnaireResult(answers);
  const { recommended, excluded, flagged, burden, stack, preset } = result;

  return (
    <div className="min-h-screen overflow-x-hidden canvas-scrim text-foreground">
      <Nav />
      {/* Nav is fixed — clear its height so the completion badge isn't tucked underneath. */}
      <main id="main-content" tabIndex={-1} className="container-page mt-14 py-10 md:mt-16 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent-emerald">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              All {quizSteps.length} answered
            </p>
            <h1 className="heading-page mb-2">{stack.label}</h1>
            <p className="text-body mb-6 text-muted-foreground">{result.insight}</p>

            {/* Lifestyle burden — makes it visible that questions 5–8 did something */}
            {burden.score > 0 && (
              <div className="glass mb-6 rounded-xl p-4">
                <p className="mb-2 flex items-center gap-2 text-body-sm font-semibold">
                  <Activity className="h-4 w-4 text-accent-amber" aria-hidden="true" />
                  {burden.score} of 4 lifestyle signals flagged
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {burden.drivers.map((d) => (
                    <li
                      key={d.id}
                      className="rounded bg-accent-amber/10 px-2 py-0.5 text-caption font-medium text-accent-amber"
                    >
                      {d.label}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-caption text-muted-foreground">
                  These shaped both the breadth of this stack and the order below.
                </p>
              </div>
            )}

            {/* The recommendation */}
            <h2 className="heading-section mb-3">
              Your {recommended.length} compound{recommended.length === 1 ? '' : 's'}
            </h2>
            <ul className="mb-8 space-y-2">
              {recommended.map((c, i) => {
                const href = libraryHrefFor(c.id);
                const flag = flagged.find((f) => f.id === c.id);
                return (
                  <li key={c.id} className="glass rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-body-sm font-semibold">
                          <span className="font-mono text-caption text-muted-foreground">{i + 1}</span>
                          {href ? (
                            <Link href={href} className="focus-ring rounded hover:text-accent-cyan">
                              {c.name}
                            </Link>
                          ) : (
                            c.name
                          )}
                          <EvidenceTag tier={c.tier as 'A' | 'B' | 'C'} />
                        </p>
                        <p className="mt-1 text-caption text-muted-foreground">{c.why}</p>
                      </div>
                      <p className="shrink-0 text-right text-caption text-muted-foreground">
                        <span className="block font-medium text-foreground">{c.dose}</span>
                        {c.timing}
                      </p>
                    </div>
                    {flag && (
                      <p className="mt-3 flex items-start gap-2 rounded-lg bg-accent-amber/10 p-2.5 text-caption text-accent-amber">
                        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>
                          <strong>Discuss with your physician:</strong> {flag.reason}
                        </span>
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Safety exclusions — the screen's most important output */}
            {excluded.length > 0 && (
              <section aria-labelledby="excluded-heading" className="mb-8">
                <h2 id="excluded-heading" className="heading-section mb-3 flex items-center gap-2">
                  <ShieldX className="h-5 w-5 text-accent-rose" aria-hidden="true" />
                  Removed for your safety
                </h2>
                <p className="text-body-sm mb-3 text-muted-foreground">
                  Based on what you told us, {excluded.length} compound{excluded.length === 1 ? ' was' : 's were'}{' '}
                  taken out of the {stack.label} preset.
                </p>
                <ul className="space-y-2">
                  {excluded.map((c) => (
                    <li key={c.id} className="rounded-xl border border-accent-rose/25 bg-accent-rose/5 p-4">
                      <p className="text-body-sm font-semibold">{c.name}</p>
                      <p className="mt-1 text-caption text-muted-foreground">{c.reason}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Phase-in plan */}
            {result.phasing.length > 0 && (
              <section aria-labelledby="phasing-heading" className="mb-8">
                <h2 id="phasing-heading" className="heading-section mb-3 flex items-center gap-2">
                  <ListOrdered className="h-5 w-5 text-accent-cyan" aria-hidden="true" />
                  How to start
                </h2>
                <ol className="space-y-2">
                  {result.phasing.map((line, i) => (
                    <li key={line} className="glass flex gap-3 rounded-xl p-4">
                      <span className="font-mono text-caption text-accent-cyan">{i + 1}</span>
                      <span className="text-body-sm text-muted-foreground">{line}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <p className="text-caption text-muted-foreground">
              This is educational decision support generated from published evidence and TNiC&rsquo;s per-compound
              safety data — not medical advice, and not a substitute for your doctor or pharmacist. Review any
              protocol with a clinician before starting, especially alongside prescription medication. See{' '}
              <Link href="/trust/disclaimers" className="focus-ring rounded underline hover:text-foreground">
                our disclaimers
              </Link>{' '}
              and{' '}
              <Link href="/trust/methodology" className="focus-ring rounded underline hover:text-foreground">
                how we grade evidence
              </Link>
              .
            </p>
          </div>

          {/* Actions + onward navigation */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <ResultActions
                answers={answers}
                preset={preset as PresetKey}
                stackLabel={stack.label}
                compoundCount={recommended.length}
                primary={result.primary}
              />

              <nav aria-label="Continue exploring" className="mt-6">
                <h2 className="heading-card mb-3">Go anywhere from here</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {[
                    { href: '/library', label: 'Library', desc: `${COMPOUND_COUNT} deep-dives` },
                    { href: '/hallmarks', label: 'Hallmarks', desc: '12 mechanisms' },
                    { href: '/explore', label: 'Explore', desc: 'Platform overview' },
                    { href: '/tools', label: 'Tools', desc: 'Calculators' },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="focus-ring glass glass-hover group flex items-center justify-between gap-2 rounded-xl px-3 py-3"
                      >
                        <span>
                          <span className="block text-body-sm font-semibold">{l.label}</span>
                          <span className="block text-caption text-muted-foreground">{l.desc}</span>
                        </span>
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
