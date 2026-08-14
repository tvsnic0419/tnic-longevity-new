import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { TnicScore, TnicScoreBand } from '@/lib/tnic-score';
import { scoreBand } from '@/lib/tnic-score';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { cn } from '@/lib/utils';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { ScoreBreakdown } from './ScoreBreakdown';
import { HallmarkCoverage } from './HallmarkCoverage';
import { ScoreReveal } from './ScoreReveal';
import { ScoreCountText } from './ScoreCountText';

/**
 * TnicScoreCard — the signature proprietary "TNiC SCORE 82 / 100" presentation.
 *
 * Purely presentational and server-safe: it renders a precomputed `TnicScore`
 * (see lib/tnic-score.ts) so the score is server-rendered into HTML (crawlable)
 * and the scoring libraries stay out of the client bundle. The score is a
 * transparent, derived index — the methodology note and confidence indicator
 * are always shown, and unsupported dimensions read "Insufficient evidence".
 */

const bandAccent: Record<TnicScoreBand, { var: string; text: string; label: string }> = {
  exceptional: { var: 'var(--accent-emerald)', text: 'text-accent-emerald', label: 'Exceptional profile' },
  strong: { var: 'var(--accent-cyan)', text: 'text-accent-cyan', label: 'Strong profile' },
  moderate: { var: 'var(--accent-amber)', text: 'text-accent-amber', label: 'Moderate profile' },
  emerging: { var: 'var(--accent-violet)', text: 'text-accent-violet', label: 'Emerging profile' },
};

const NEUTRAL_ACCENT = 'var(--accent-cyan)';

function ScoreRing({ score, accentVar }: { score: number | null; accentVar: string }) {
  const size = 168;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const pct = score == null ? 0 : Math.max(0, Math.min(100, score)) / 100;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-40 w-40 shrink-0"
      role="img"
      aria-label={score == null ? 'TNiC Score unavailable' : `TNiC Score ${score} out of 100`}
    >
      {/* Track */}
      <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={stroke} />
      {/* Progress — rotated so it starts at 12 o'clock. Final offset is baked in
          via --dash-final (SSR/no-JS shows the finished ring); ScoreReveal drives
          the draw from --dash-c (empty) to final in CSS. */}
      {score != null && (
        <circle
          className="score-ring-prog"
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={accentVar}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          transform={`rotate(-90 ${c} ${c})`}
          style={
            {
              ['--dash-c']: circumference,
              ['--dash-final']: circumference * (1 - pct),
            } as Record<string, string | number>
          }
        />
      )}
      {/* Value — optically centered as a number + "/100" stack. */}
      <text
        x={c}
        y={c - 3}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-display"
        fontSize={48}
        fontWeight={700}
        fill="currentColor"
      >
        {score == null ? '—' : <ScoreCountText value={score} />}
      </text>
      <text
        x={c}
        y={c + 30}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fill="currentColor"
        fillOpacity={0.5}
        fontFamily="monospace"
      >
        / 100
      </text>
    </svg>
  );
}

export function TnicScoreCard({
  score,
  href,
  className = '',
}: {
  score: TnicScore;
  /** Optional CTA target (e.g. the methodology page or a compare view). */
  href?: string;
  className?: string;
}) {
  const band = scoreBand(score.score);
  const accent = band ? bandAccent[band] : null;
  const accentVar = accent?.var ?? NEUTRAL_ACCENT;

  return (
    <section
      className={cn('premium-card tnic-scorecard p-6 md:p-7', className)}
      style={{ ['--card-accent' as string]: accentVar }}
      aria-label={`TNiC Score for ${score.compoundName}`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-label" style={{ color: accentVar }}>
            TNiC Score
          </span>
        </div>
        {score.tier && <EvidenceTag tier={score.tier} size="sm" />}
      </div>

      <ScoreReveal className="score-reveal grid gap-7 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
        {/* Ring + band */}
        <div className="flex flex-col items-center gap-3 text-center" style={{ color: accentVar }}>
          <ScoreRing score={score.score} accentVar={accentVar} />
          <p className={cn('text-sm font-semibold', accent?.text ?? 'text-muted-foreground')}>
            {accent ? accent.label : 'Insufficient evidence'}
          </p>
        </div>

        {/* Breakdown */}
        <ScoreBreakdown dimensions={score.dimensions} accentVar={accentVar} />
      </ScoreReveal>

      {/* Footer — confidence, hallmark coverage, methodology */}
      <div className="mt-6 border-t border-border/50 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ConfidenceIndicator confidence={score.confidence} />
          {score.hallmarkCount > 0 && <HallmarkCoverage count={score.hallmarkCount} accentVar={accentVar} />}
        </div>
        <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
          {score.methodologyNote}{' '}
          <Link href="/trust/methodology" className="text-accent-cyan underline-offset-2 hover:underline">
            How TNiC scores evidence →
          </Link>
        </p>
        {href && (
          <Link
            href={href}
            className="focus-ring mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: accentVar }}
          >
            Compare compound scores
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
