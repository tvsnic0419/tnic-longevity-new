import type { CSSProperties } from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck, Activity, ExternalLink, Ban } from 'lucide-react';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { GuideVerifiedPick } from '@/components/guides/GuideVerifiedPick';
import { GuideHeroPanel } from '@/components/guides/GuideHeroPanel';
import type { DefenseStack, StackCitation } from '@/lib/defense-stacks';

/**
 * Shared renderer for the defense-stack guides.
 *
 * One component so the two pages cannot drift apart on the things that matter:
 * the exposure risks come before the stack, the "what removing the exposure
 * achieves" benchmark is never omitted, and the avoid-list renders above the
 * protocol rather than buried under it. On these pages a reader who bounces
 * after the first screen should still have seen the warning that could hurt
 * them.
 */

function Cites({ citations }: { citations?: StackCitation[] }) {
  if (!citations?.length) return null;
  return (
    <ul className="mt-3 space-y-1.5">
      {citations.map((c) => (
        <li key={c.pmid + c.label} className="text-caption text-muted-foreground leading-relaxed">
          <a
            href={`https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded text-accent-cyan hover:underline inline-flex items-center gap-1"
          >
            {c.label} <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
          {' — '}
          {c.finding}
        </li>
      ))}
    </ul>
  );
}

export function DefenseStackGuide({ stack }: { stack: DefenseStack }) {
  const avoid = stack.warnings.filter((w) => w.severity === 'avoid');
  const caution = stack.warnings.filter((w) => w.severity === 'caution');

  return (
    <div className="pb-20">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="container-page pt-10 md:pt-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-micro font-mono uppercase tracking-[0.22em] text-accent-amber">
              Harm-reduction protocol
            </p>
            <h1 className="heading-page mt-3">{stack.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{stack.audience}</p>

            {/* The honest frame, stated once, at the top, before anything is sold. */}
            <div
              className="premium-card mt-6 p-5"
              style={{ '--card-accent': 'var(--accent-amber)' } as CSSProperties}
            >
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-accent-amber">Read this first. </span>
                Nothing on this page offsets the exposure. Every item below reduces damage at the
                margins while the exposure continues — that is the whole claim, and it is a modest
                one. {stack.cessationBenchmark.body}
              </p>
              <Cites citations={stack.cessationBenchmark.citations} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <GuideHeroPanel
              glowColor="var(--accent-amber)"
              stats={[
                { value: String(stack.core.length), label: 'Protocol items, each graded', colorClass: 'text-accent-amber' },
                { value: String(avoid.length), label: 'Supplements to actively avoid', colorClass: 'text-accent-rose' },
                { value: String(stack.monitoring.length), label: 'Markers worth tracking', colorClass: 'text-accent-cyan' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Avoid list, deliberately above the protocol ───────────────────── */}
      {avoid.length > 0 && (
        <section className="container-page mt-14">
          <div className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-accent-rose" aria-hidden="true" />
            <h2 className="text-2xl font-bold">Do not take these</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            These appear before the protocol on purpose. Getting this part wrong does more harm than
            getting the rest of the page right does good.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {avoid.map((w) => (
              <div
                key={w.title}
                className="premium-card p-6"
                style={{ '--card-accent': 'var(--accent-rose)' } as CSSProperties}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent-rose" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-accent-rose">{w.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                    <Cites citations={w.citations} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── What continuing costs ─────────────────────────────────────────── */}
      <section className="container-page mt-14">
        <h2 className="text-2xl font-bold">What continuing actually costs</h2>
        <div className="mt-6 space-y-5">
          {stack.exposureRisks.map((r) => (
            <div key={r.title} className="premium-card p-6">
              <h3 className="font-bold">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              <Cites citations={r.citations} />
            </div>
          ))}
        </div>
      </section>

      {/* ── The stack ─────────────────────────────────────────────────────── */}
      <section className="container-page mt-14">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent-emerald" aria-hidden="true" />
          <h2 className="text-2xl font-bold">The protocol</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Ordered by strength of evidence, not by cost or convenience. Each tier note says what the
          grade rests on, so you can judge it rather than take it on trust.
        </p>

        <div className="mt-6 space-y-6">
          {stack.core.map((item) => (
            <div key={item.name} className="premium-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <EvidenceTag tier={item.tier} />
              </div>

              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-micro font-mono uppercase tracking-wider text-muted-foreground">Dose</dt>
                  <dd className="mt-1 text-sm font-semibold">{item.dose}</dd>
                </div>
                <div>
                  <dt className="text-micro font-mono uppercase tracking-wider text-muted-foreground">Timing</dt>
                  <dd className="mt-1 text-sm font-semibold">{item.timing}</dd>
                </div>
              </dl>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.rationale}</p>

              <p className="mt-3 rounded-lg border border-border/60 bg-background/30 p-3 text-caption leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Why this grade: </span>
                {item.tierNote}
              </p>

              <Cites citations={item.citations} />

              {item.compoundId && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/library/compounds/${item.compoundId}`}
                    className="focus-ring rounded text-sm text-accent-cyan hover:underline"
                  >
                    Full evidence module →
                  </Link>
                </div>
              )}

              {item.compoundId && <GuideVerifiedPick compoundId={item.compoundId} className="mt-4" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── Cautions ──────────────────────────────────────────────────────── */}
      {caution.length > 0 && (
        <section className="container-page mt-14">
          <h2 className="text-2xl font-bold">Interactions and cautions</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {caution.map((w) => (
              <div
                key={w.title}
                className="premium-card p-6"
                style={{ '--card-accent': 'var(--accent-amber)' } as CSSProperties}
              >
                <h3 className="font-bold text-accent-amber">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                <Cites citations={w.citations} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Monitoring ────────────────────────────────────────────────────── */}
      <section className="container-page mt-14">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent-cyan" aria-hidden="true" />
          <h2 className="text-2xl font-bold">What to actually track</h2>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-micro font-mono uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4">Marker</th>
                <th className="py-3 pr-4">Why it matters</th>
                <th className="py-3">Cadence</th>
              </tr>
            </thead>
            <tbody>
              {stack.monitoring.map((m) => (
                <tr key={m.marker} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-semibold">{m.marker}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{m.why}</td>
                  <td className="py-3 whitespace-nowrap text-muted-foreground">{m.cadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Close ─────────────────────────────────────────────────────────── */}
      <section className="container-page mt-14">
        <div className="premium-card p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            This page is educational and is not medical advice. It does not diagnose or treat
            anything, and it is not a substitute for a clinician who knows your history — which
            matters more here than on most pages, because several items above interact with
            prescription medicines. If you want help stopping rather than mitigating, that is a
            better outcome than anything on this page can deliver, and it is worth asking for.{' '}
            <Link href="/trust/methodology" className="focus-ring rounded text-accent-cyan hover:underline">
              How TNiC grades evidence →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
