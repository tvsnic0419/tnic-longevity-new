import Link from 'next/link';
import { ArrowRight, Link2, ShieldAlert, Sparkles } from 'lucide-react';
import type { ComparisonOutcome, HeadToHead, HeadToHeadSide } from '@/lib/head-to-head';
import { CONFIDENCE_META, scoreBand } from '@/lib/tnic-score';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { ScoreGauge } from '@/components/viz/ScoreGauge';

// ─────────────────────────────────────────────────────────────────────────────
// HeadToHeadCompare — the free-form "any two compounds" comparison surface.
//
// Server-rendered end to end: every number here is derived at request time from
// lib/head-to-head.ts (which itself only reads the TNiC Score engine and the
// canonical library), so the whole comparison ships in the initial HTML and is
// indexable. No client JS, no charting library — the duel chart is plain divs.
//
// The two sides are keyed by POSITION (cyan = left, violet = right), never by
// evidence tier — tier keeps its own canonical A/B/C palette on the EvidenceTag
// chips so the two color systems never collide.
// ─────────────────────────────────────────────────────────────────────────────

const SIDE_A = 'var(--accent-cyan)';
const SIDE_B = 'var(--accent-violet)';

function outcomeLabel(outcome: ComparisonOutcome, aName: string, bName: string): string {
  switch (outcome) {
    case 'a':
      return `${aName} leads`;
    case 'b':
      return `${bName} leads`;
    case 'tie':
      return 'Too close to call';
    default:
      return 'Not scored for both';
  }
}

/** One compound's identity block: name, tier, derived score, data confidence. */
function SideHeader({ side, color, align }: { side: HeadToHeadSide; color: string; align: 'left' | 'right' }) {
  const { compound, score } = side;
  const band = scoreBand(score.score);
  const confidence = CONFIDENCE_META[score.confidence];
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <div
        className={`flex items-center gap-2 mb-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}
      >
        <EvidenceTag tier={compound.evidence} size="sm" />
      </div>
      <h2 className="text-h3 font-bold leading-tight" style={{ color }}>
        <Link
          href={`/library/compounds/${compound.id}`}
          className="focus-ring interactive rounded-md hover:underline decoration-dotted underline-offset-4"
        >
          {compound.name}
        </Link>
      </h2>
      <p className="text-body-sm text-muted-foreground mt-1">{compound.pathway}</p>
      <div className={`mt-4 flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {score.score !== null ? (
          <ScoreGauge
            value={score.score}
            color={color}
            caption="TNiC Score"
            size={116}
            ariaLabel={`${compound.name} TNiC Score: ${score.score} out of 100`}
          />
        ) : (
          <p className="text-body-sm text-muted-foreground italic">Not scored</p>
        )}
      </div>
      <p className="text-micro font-mono uppercase tracking-wide text-muted-foreground/80 mt-3">
        {band ? `${band} · ` : ''}
        {confidence.label} data
      </p>
    </div>
  );
}

/**
 * One dimension as a diverging bar: A grows leftward from the centre line, B
 * grows rightward. A dimension either side cannot support renders as an honest
 * "not scored" band rather than a zero-length bar, which would read as a loss.
 */
function DuelRow({
  dimension,
  aName,
  bName,
}: {
  dimension: HeadToHead['dimensions'][number];
  aName: string;
  bName: string;
}) {
  const { label, note, a, b, leader, delta } = dimension;
  const unscored = leader === 'insufficient';

  return (
    <div className="py-3 border-b border-white/5 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span
          className="text-body-sm font-mono tabular-nums w-10 shrink-0"
          style={{ color: leader === 'a' ? SIDE_A : 'var(--color-muted-foreground)' }}
        >
          {a ?? '—'}
        </span>
        <span className="text-body-sm font-medium text-center flex-1" title={note}>
          {label}
        </span>
        <span
          className="text-body-sm font-mono tabular-nums w-10 shrink-0 text-right"
          style={{ color: leader === 'b' ? SIDE_B : 'var(--color-muted-foreground)' }}
        >
          {b ?? '—'}
        </span>
      </div>

      {unscored ? (
        <div className="h-3 rounded-sm border border-dashed border-white/15 flex items-center justify-center">
          <span className="text-micro text-muted-foreground/70">
            Not scored for both compounds — no comparison made
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1" aria-hidden="true">
          {/* Left half — A, filling toward the centre. */}
          <div className="flex-1 h-3 flex justify-end">
            <div
              className="h-full rounded-l-sm transition-none"
              style={{
                width: `${a}%`,
                background: SIDE_A,
                opacity: leader === 'a' ? 1 : 0.42,
                boxShadow: leader === 'a' ? `0 0 12px -3px ${SIDE_A}` : undefined,
              }}
            />
          </div>
          <div className="w-px h-4 bg-white/25 shrink-0" />
          {/* Right half — B. */}
          <div className="flex-1 h-3">
            <div
              className="h-full rounded-r-sm"
              style={{
                width: `${b}%`,
                background: SIDE_B,
                opacity: leader === 'b' ? 1 : 0.42,
                boxShadow: leader === 'b' ? `0 0 12px -3px ${SIDE_B}` : undefined,
              }}
            />
          </div>
        </div>
      )}

      {/* Screen-reader summary — the bars themselves are aria-hidden. The gap
          is only voiced when a leader was actually declared; appending it to a
          tie would read as "too close to call by 2 points". */}
      <p className="sr-only">
        {label}: {outcomeLabel(leader, aName, bName)}
        {(leader === 'a' || leader === 'b') && delta !== null ? ` by ${delta} points` : ''}.
      </p>
      {!unscored && leader !== 'tie' && delta !== null && (
        <p className="text-micro text-muted-foreground/70 mt-1 text-center">
          {outcomeLabel(leader, aName, bName)} by {delta}
        </p>
      )}
      {leader === 'tie' && (
        <p className="text-micro text-muted-foreground/70 mt-1 text-center">
          Too close to call
        </p>
      )}
    </div>
  );
}

function HallmarkChips({
  items,
  color,
}: {
  items: { id: string; slug: string; title: string }[];
  color?: string;
}) {
  if (items.length === 0) {
    return <p className="text-micro text-muted-foreground/70 italic">None unique to this side</p>;
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((h) => (
        <li key={h.id}>
          <Link
            href={`/hallmarks/${h.slug}`}
            className="focus-ring interactive inline-flex rounded-full border px-2 py-0.5 text-micro hover:bg-white/5"
            style={{ borderColor: color ? `${color}40` : 'rgba(255,255,255,0.15)', color: color ?? undefined }}
          >
            {h.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function HeadToHeadCompare({ result }: { result: HeadToHead }) {
  const { a, b, dimensions, relation, scoreLeader, comparableDimensions, curatedSlug } = result;
  const aName = a.compound.name;
  const bName = b.compound.name;

  return (
    <section className="mt-8" aria-labelledby="h2h-heading">
      <h2 id="h2h-heading" className="sr-only">
        {aName} compared with {bName}
      </h2>

      {/* ── Versus header ─────────────────────────────────────────────────── */}
      <div className="premium-card p-5 md:p-7">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 md:gap-6 items-start">
          <SideHeader side={a} color={SIDE_A} align="left" />
          <div className="flex flex-col items-center gap-2 pt-8">
            <span className="text-micro font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
              vs
            </span>
            <div className="w-px flex-1 min-h-16 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
          <SideHeader side={b} color={SIDE_B} align="right" />
        </div>

        <p className="text-body-sm text-center mt-6 pt-5 border-t border-white/10">
          {scoreLeader === 'tie' ? (
            <>
              On the derived composite these two are{' '}
              <strong className="text-foreground">too close to separate</strong> — the gap is inside
              the {`±`}3-point tie band.
            </>
          ) : scoreLeader === 'insufficient' ? (
            <>Neither compound carries enough scored data for a composite comparison.</>
          ) : (
            <>
              <strong style={{ color: scoreLeader === 'a' ? SIDE_A : SIDE_B }}>
                {scoreLeader === 'a' ? aName : bName}
              </strong>{' '}
              carries the stronger overall evidence profile across{' '}
              <strong className="text-foreground">{comparableDimensions} of 6</strong> comparable
              dimensions.
            </>
          )}
        </p>
      </div>

      {/* ── Relationship ──────────────────────────────────────────────────── */}
      <div
        className={`premium-card p-4 md:p-5 mt-4 flex items-start gap-3 ${
          relation.kind === 'synergy' ? 'border-accent-emerald/30' : ''
        }`}
      >
        {relation.kind === 'synergy' ? (
          <Sparkles className="w-5 h-5 shrink-0 text-accent-emerald mt-0.5" aria-hidden="true" />
        ) : (
          <ShieldAlert className="w-5 h-5 shrink-0 text-muted-foreground mt-0.5" aria-hidden="true" />
        )}
        <div>
          <p className="text-body-sm font-medium mb-1">
            {relation.kind === 'synergy' ? 'Documented synergy' : 'No documented pairing'}
          </p>
          <p className="text-body-sm text-muted-foreground">{relation.detail}</p>
        </div>
      </div>

      {/* ── Dimension duel ────────────────────────────────────────────────── */}
      <div className="premium-card p-5 md:p-7 mt-4">
        <div className="flex items-center justify-between gap-4 mb-1">
          <h3 className="text-h3 font-bold">Evidence dimensions</h3>
          <span className="text-micro font-mono text-muted-foreground">
            {comparableDimensions}/6 comparable
          </span>
        </div>
        <p className="text-body-sm text-muted-foreground mb-4">
          Each bar grows outward from the centre line — {aName} to the left, {bName} to the right.
          Higher is stronger. Values are normalised{' '}
          <strong className="text-foreground">0–100 ratings, not percentages</strong> — the
          bioavailability rating is the scoring model&apos;s absorption grade, which is a different
          measure from the published oral-bioavailability percentage in the table below. A dimension
          neither side can support is left uncalled rather than scored as zero.
        </p>
        <div>
          {dimensions.map((d) => (
            <DuelRow key={d.key} dimension={d} aName={aName} bName={bName} />
          ))}
        </div>
      </div>

      {/* ── Hallmark overlap ──────────────────────────────────────────────── */}
      <div className="premium-card p-5 md:p-7 mt-4">
        <h3 className="text-h3 font-bold mb-1">Hallmark coverage</h3>
        <p className="text-body-sm text-muted-foreground mb-4">
          Where these two overlap on the hallmarks of aging — and where each one reaches something
          the other doesn&apos;t.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <p className="text-micro font-mono uppercase tracking-wide mb-2" style={{ color: SIDE_A }}>
              Only {aName}
            </p>
            <HallmarkChips items={result.uniqueA} color={SIDE_A} />
          </div>
          <div className="md:border-x md:border-white/10 md:px-5">
            <p className="text-micro font-mono uppercase tracking-wide text-accent-emerald mb-2">
              Both ({result.sharedHallmarks.length})
            </p>
            <HallmarkChips items={result.sharedHallmarks} color="var(--accent-emerald)" />
          </div>
          <div>
            <p className="text-micro font-mono uppercase tracking-wide mb-2" style={{ color: SIDE_B }}>
              Only {bName}
            </p>
            <HallmarkChips items={result.uniqueB} color={SIDE_B} />
          </div>
        </div>
      </div>

      {/* ── Practical + evidence table (also the accessible fallback) ─────── */}
      <div className="premium-card p-5 md:p-7 mt-4">
        <h3 className="text-h3 font-bold mb-4">Side by side</h3>
        <div className="scroll-region overflow-x-auto" tabIndex={0} role="region" aria-label={`${aName} versus ${bName} data table`}>
          <table className="w-full text-body-sm border-collapse">
            <caption className="sr-only">
              Full derived comparison of {aName} and {bName}, including every evidence dimension
              shown in the chart above.
            </caption>
            <thead>
              <tr className="border-b border-white/15">
                <th scope="col" className="text-left py-2 pr-3 font-medium">Measure</th>
                <th scope="col" className="text-left py-2 px-3 font-medium" style={{ color: SIDE_A }}>{aName}</th>
                <th scope="col" className="text-left py-2 px-3 font-medium" style={{ color: SIDE_B }}>{bName}</th>
                <th scope="col" className="text-left py-2 pl-3 font-medium">Verdict</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-white/5">
                <th scope="row" className="text-left py-2 pr-3 font-normal text-foreground">Evidence tier</th>
                <td className="py-2 px-3">Tier {a.compound.evidence}</td>
                <td className="py-2 px-3">Tier {b.compound.evidence}</td>
                <td className="py-2 pl-3">Graded independently</td>
              </tr>
              <tr className="border-b border-white/5">
                <th scope="row" className="text-left py-2 pr-3 font-normal text-foreground">TNiC Score</th>
                <td className="py-2 px-3">{a.score.score ?? 'Not scored'}</td>
                <td className="py-2 px-3">{b.score.score ?? 'Not scored'}</td>
                <td className="py-2 pl-3">{outcomeLabel(scoreLeader, aName, bName)}</td>
              </tr>
              {dimensions.map((d) => (
                <tr key={d.key} className="border-b border-white/5">
                  <th scope="row" className="text-left py-2 pr-3 font-normal text-foreground">
                    {d.label} <span className="text-muted-foreground">(rating 0–100)</span>
                  </th>
                  <td className="py-2 px-3">{d.a ?? 'Not scored'}</td>
                  <td className="py-2 px-3">{d.b ?? 'Not scored'}</td>
                  <td className="py-2 pl-3">{outcomeLabel(d.leader, aName, bName)}</td>
                </tr>
              ))}
              <tr className="border-b border-white/5">
                <th scope="row" className="text-left py-2 pr-3 font-normal text-foreground">Studied dose</th>
                <td className="py-2 px-3">{a.compound.dose}</td>
                <td className="py-2 px-3">{b.compound.dose}</td>
                <td className="py-2 pl-3">Not comparable — different targets</td>
              </tr>
              <tr className="border-b border-white/5">
                <th scope="row" className="text-left py-2 pr-3 font-normal text-foreground">Timing</th>
                <td className="py-2 px-3">{a.compound.timing}</td>
                <td className="py-2 px-3">{b.compound.timing}</td>
                <td className="py-2 pl-3">—</td>
              </tr>
              <tr className="border-b border-white/5">
                {/* Distinct from the scored bioavailability *rating* above: this
                    is the measured oral-absorption figure recorded in the
                    canonical library, and the two are not the same number. */}
                <th scope="row" className="text-left py-2 pr-3 font-normal text-foreground">
                  Published oral bioavailability{' '}
                  <span className="text-muted-foreground">(measured %)</span>
                </th>
                <td className="py-2 px-3">
                  {a.compound.bioavailability != null ? `${a.compound.bioavailability}%` : 'Not published'}
                </td>
                <td className="py-2 px-3">
                  {b.compound.bioavailability != null ? `${b.compound.bioavailability}%` : 'Not published'}
                </td>
                <td className="py-2 pl-3">—</td>
              </tr>
              <tr>
                <th scope="row" className="text-left py-2 pr-3 font-normal text-foreground">Indexed studies</th>
                <td className="py-2 px-3">{a.compound.studies.length}</td>
                <td className="py-2 px-3">{b.compound.studies.length}</td>
                <td className="py-2 pl-3">Cited on each deep-dive</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Provenance + handoff ──────────────────────────────────────────── */}
      <div className="premium-card p-5 md:p-7 mt-4">
        <h3 className="text-body-sm font-medium mb-2">How this comparison is built</h3>
        <ul className="text-body-sm text-muted-foreground space-y-1.5 list-disc pl-4">
          <li>{a.score.methodologyNote}</li>
          {b.score.methodologyNote !== a.score.methodologyNote && <li>{b.score.methodologyNote}</li>}
          <li>
            Confidence reflects <strong className="text-foreground">data completeness</strong>, not
            clinical certainty. Differences inside {`±`}3 points are reported as ties.
          </li>
          <li>
            Nothing here is medical advice, and a higher score is not a recommendation to take a
            compound.
          </li>
        </ul>

        <div className="flex flex-wrap gap-3 mt-5">
          {curatedSlug && (
            <Link
              href={`/library/compare/${curatedSlug}`}
              className="focus-ring interactive inline-flex items-center gap-2 rounded-lg border border-accent-cyan/30 px-3 py-2 text-body-sm hover:bg-accent-cyan/10"
            >
              <Link2 className="w-4 h-4" aria-hidden="true" />
              Read the in-depth {aName} vs {bName} write-up
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
          <Link
            href={`/library/compounds/${a.compound.id}`}
            className="focus-ring interactive inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-body-sm hover:bg-white/5"
          >
            {aName} deep-dive
          </Link>
          <Link
            href={`/library/compounds/${b.compound.id}`}
            className="focus-ring interactive inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-body-sm hover:bg-white/5"
          >
            {bName} deep-dive
          </Link>
        </div>
      </div>
    </section>
  );
}
