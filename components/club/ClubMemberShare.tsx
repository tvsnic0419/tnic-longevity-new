'use client';

import { useState } from 'react';
import { Share2, Copy, CheckCircle2 } from 'lucide-react';

export function ClubMemberShare({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== 'undefined' ? `${window.location.origin}/club/${code}` : `https://tnic.help/club/${code}`;
  const text = `I just joined the 150-Year Club — Charter Class of 2026. Committing to the evidence-based pursuit of maximum healthspan. Join me:`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: '150-Year Club', text, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    copy();
  };

  const xIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button
        type="button"
        onClick={nativeShare}
        className="focus-ring press inline-flex items-center justify-center gap-2 btn-gradient rounded-full text-sm !px-6"
      >
        <Share2 className="w-4 h-4" aria-hidden="true" />
        Share my card
      </button>
      <button
        type="button"
        onClick={copy}
        className="focus-ring press inline-flex items-center justify-center gap-2 glass glass-hover rounded-full px-5 py-3 text-sm font-semibold"
      >
        {copied ? <CheckCircle2 className="w-4 h-4 text-accent-emerald" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <a
        href={xIntent}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring press inline-flex items-center justify-center glass glass-hover rounded-full px-5 py-3 text-sm font-bold"
        aria-label="Share on X"
      >
        𝕏
      </a>
    </div>
  );
}
