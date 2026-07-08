import type { SVGProps } from 'react';

interface LogoProps {
  variant?: 'emblem' | 'lockup';
  size?: 'nav' | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  priority?: boolean;
  alt?: string;
}

/** Crisp vector lockup sizing: emblem tile + wordmark type scale, per size. */
const lockupScale: Record<
  NonNullable<LogoProps['size']>,
  { tile: string; letter: string; word: string; gap: string }
> = {
  nav:  { tile: 'w-8 h-8',   letter: 'text-base', word: 'text-xl',                    gap: 'gap-2' },
  sm:   { tile: 'w-7 h-7',   letter: 'text-sm',   word: 'text-lg',                    gap: 'gap-2' },
  md:   { tile: 'w-9 h-9',   letter: 'text-lg',   word: 'text-2xl',                   gap: 'gap-2.5' },
  lg:   { tile: 'w-11 h-11', letter: 'text-xl',   word: 'text-3xl',                   gap: 'gap-3' },
  hero: { tile: 'w-12 h-12', letter: 'text-2xl',  word: 'text-4xl md:text-5xl',       gap: 'gap-3' },
};

function EmblemSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="tnic-c" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67f3ff" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="tnic-e" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <filter id="tnic-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Disc — visibly different from nav background */}
      <circle cx="40" cy="40" r="39" fill="#0e2040" />
      {/* Bright cyan ring */}
      <circle cx="40" cy="40" r="37.5" stroke="#22d3ee" strokeWidth="3" />

      {/* Strand 1 — cyan */}
      <path
        d="M 26 13 C 58 21, 58 32, 26 40 C 58 48, 58 59, 26 67"
        stroke="url(#tnic-c)" strokeWidth="4" strokeLinecap="round" fill="none"
        filter="url(#tnic-glow)"
      />
      {/* Strand 2 — emerald (mirror) */}
      <path
        d="M 54 13 C 22 21, 22 32, 54 40 C 22 48, 22 59, 54 67"
        stroke="url(#tnic-e)" strokeWidth="4" strokeLinecap="round" fill="none"
        filter="url(#tnic-glow)"
      />

      {/* Base-pair rungs */}
      <line x1="26" y1="26.5" x2="54" y2="26.5" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="40"   x2="54" y2="40"   stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="53.5" x2="54" y2="53.5" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />

      {/* Center node */}
      <circle cx="40" cy="40" r="3.5" fill="#22d3ee" />
    </svg>
  );
}

const emblemSizeClass: Record<NonNullable<LogoProps['size']>, string> = {
  nav:  'w-12 h-12',
  sm:   'w-8 h-8',
  md:   'w-12 h-12',
  lg:   'w-16 h-16 md:w-20 md:h-20',
  hero: 'w-20 h-20',
};

export function Logo({
  variant = 'emblem',
  size = 'md',
  className = '',
  alt,
}: LogoProps) {
  const altText = alt || (variant === 'lockup' ? 'TNiC – Longevity OS' : 'TNiC emblem');

  if (variant === 'lockup') {
    const s = lockupScale[size];
    return (
      <div
        className={`inline-flex items-center ${s.gap} ${className}`}
        role="img"
        aria-label={altText}
      >
        <span
          className={`${s.tile} shrink-0 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-emerald)] flex items-center justify-center shadow-lg shadow-[color:var(--accent-cyan)]/20`}
          aria-hidden="true"
        >
          <span className={`font-bold leading-none text-[#020811] ${s.letter}`}>T</span>
        </span>
        <span
          className={`font-semibold leading-none tracking-tighter text-[var(--color-text-primary)] ${s.word}`}
          aria-hidden="true"
        >
          TN<span className="text-[var(--accent-cyan)]">i</span>C
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center logo-glow rounded-xl ${className}`}
      role="img"
      aria-label={altText}
    >
      <EmblemSvg className={emblemSizeClass[size]} />
    </div>
  );
}

export type { LogoProps };
