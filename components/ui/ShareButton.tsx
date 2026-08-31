'use client';

import { useState, useCallback } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  /** Canonical URL to share. */
  url: string;
  /** Native-share sheet title. */
  title: string;
  /** Share text (prepended to the URL on the clipboard fallback). */
  text: string;
  label?: string;
  /** 'solid' = the site's gradient CTA; 'ghost' = a glass chip. */
  variant?: 'solid' | 'ghost';
  /** Also render an X (Twitter) intent link beside the button. */
  showX?: boolean;
  className?: string;
}

/**
 * ShareButton — the canonical share control.
 *
 * The site had ~10 bespoke copies of the same "native share → clipboard
 * fallback → confirmation" dance (ShareScorecard, StackExport, CompareShareCard,
 * ClubMemberShare, …). This consolidates that proven pattern into one reusable,
 * accessible primitive so every surface shares the same way and new surfaces get
 * it for free.
 *
 * Uses the Web Share API where available (the good mobile path — opens the OS
 * sheet); otherwise copies "<text> <url>" to the clipboard and morphs the label
 * to a "Copied" confirmation. Every path is wrapped in try/catch (a cancelled
 * share or a blocked clipboard must never throw).
 */
export function ShareButton({
  url,
  title,
  text,
  label = 'Share',
  variant = 'ghost',
  showX = false,
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  }, [text, url]);

  const onShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        /* user cancelled, or share failed — fall through to copy */
      }
    }
    await copy();
  }, [title, text, url, copy]);

  const base =
    'focus-ring press inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold min-h-11 px-5';
  const skin =
    variant === 'solid'
      ? 'tnic-button-primary'
      : 'glass glass-hover';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={onShare}
        className={`${base} ${skin}`}
        aria-label={copied ? 'Link copied to clipboard' : label}
      >
        {copied ? (
          <Check className="h-4 w-4 text-accent-emerald" aria-hidden="true" />
        ) : (
          <Share2 className="h-4 w-4" aria-hidden="true" />
        )}
        <span aria-live="polite">{copied ? 'Copied' : label}</span>
      </button>
      {showX && (
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring press glass glass-hover grid h-11 w-11 place-items-center rounded-full text-sm font-bold"
          aria-label="Share on X"
        >
          𝕏
        </a>
      )}
    </span>
  );
}
