'use client';

import { useMemo, useState } from 'react';
import { Share2, Copy, CheckCircle2, Trophy } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import {
  encodeScorecard,
  scorecardGrade,
  gradeColors,
  gradeLabels,
  buildShareText,
  type ScorecardPayload,
} from '@/lib/scorecard';

export function ShareScorecard() {
  const { selected, score, profile, defenseProfile } = usePlatform();
  const [copied, setCopied] = useState(false);

  const payload: ScorecardPayload = useMemo(
    () => ({
      age: profile.scanned ? profile.age : 0,
      bioAge: profile.scanned ? defenseProfile.biologicalAge : 0,
      synergy: score,
      coverage: Math.min(100, (selected.length / 12) * 100),
      stackSize: selected.length,
    }),
    [selected, score, profile, defenseProfile],
  );

  const grade = scorecardGrade(payload);
  const shareUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tnic.help';
    return `${origin}/scorecard/${encodeScorecard(payload)}`;
  }, [payload]);

  if (selected.length === 0) return null;

  const shareText = buildShareText(payload);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Longevity Scorecard', text: shareText, url: shareUrl });
        return;
      } catch {
        /* user cancelled */
      }
    }
    copy();
  };

  const xIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="card-floating card-shine rounded-2xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-black text-3xl shrink-0"
            style={{ color: gradeColors[grade], background: `${gradeColors[grade]}1a`, border: `1px solid ${gradeColors[grade]}40` }}
          >
            {grade}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent-amber shrink-0" aria-hidden="true" />
              <p className="font-bold">Your Longevity Grade: {gradeLabels[grade]}</p>
            </div>
            <p className="text-body-sm mt-1">
              Share your scorecard — friends see your grade, coverage, and a custom card. They build theirs in 3 minutes.
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={nativeShare}
            className="focus-ring press flex-1 sm:flex-none inline-flex items-center justify-center gap-2 btn-gradient rounded-full text-sm !py-2.5 !px-5 !min-h-0"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            Share
          </button>
          <button
            type="button"
            onClick={copy}
            className="focus-ring press flex-1 sm:flex-none inline-flex items-center justify-center gap-2 glass glass-hover rounded-full px-4 py-2.5 text-sm font-semibold"
            aria-label="Copy scorecard link"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-accent-emerald" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <a
            href={xIntent}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring press hidden sm:inline-flex items-center justify-center glass glass-hover rounded-full px-4 py-2.5 text-sm font-bold"
            aria-label="Share on X"
          >
            𝕏
          </a>
        </div>
      </div>
    </div>
  );
}
