'use client';

import { useState } from 'react';
import { Link2, Copy, FileText, CheckCircle2 } from 'lucide-react';
import type { QuizAnswers } from '@/lib/homepage';
import {
  buildQuizShareMarkdown,
  buildQuizShareText,
  buildQuizShareUrl,
  buildQuizStacksUrl,
  buildQuizShopUrl,
} from '@/lib/quiz-share';
import type { PresetKey } from '@/lib/presets';

interface QuizShareCardProps {
  answers: Required<QuizAnswers>;
  preset: PresetKey;
  stackLabel: string;
}

type CopyKind = 'link' | 'stacks' | 'shop' | 'text' | 'markdown' | null;

export function QuizShareCard({ answers, preset, stackLabel }: QuizShareCardProps) {
  const [copied, setCopied] = useState<CopyKind>(null);

  const copy = async (kind: CopyKind, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      /* ignore */
    }
  };

  const shareUrl = buildQuizShareUrl(answers);
  const stacksUrl = buildQuizStacksUrl(preset);
  const shopUrl = buildQuizShopUrl(preset);

  return (
    <div className="glass rounded-xl p-4 border border-accent-violet/20 mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Link2 className="w-4 h-4 text-accent-violet" aria-hidden="true" />
        <p className="text-label text-accent-violet">Share your result</p>
      </div>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
        Copy a referral-style handoff — preset deep links to Stack Architect and Shop included.
      </p>
      <code className="block text-[10px] font-mono text-muted-foreground truncate mb-3">{shareUrl}</code>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copy('link', shareUrl)}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-accent-violet/15 border border-accent-violet/25 text-accent-violet hover:bg-accent-violet/25 transition"
        >
          {copied === 'link' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
          {copied === 'link' ? 'Copied' : 'Quiz link'}
        </button>
        <button
          type="button"
          onClick={() => copy('stacks', stacksUrl)}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-cyan/30 transition"
        >
          {copied === 'stacks' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
          {copied === 'stacks' ? 'Copied' : 'Architect link'}
        </button>
        <button
          type="button"
          onClick={() => copy('shop', shopUrl)}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-emerald/30 transition"
        >
          {copied === 'shop' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
          {copied === 'shop' ? 'Copied' : `Shop (${stackLabel})`}
        </button>
        <button
          type="button"
          onClick={() => copy('text', buildQuizShareText(answers))}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-violet/30 transition"
        >
          {copied === 'text' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === 'text' ? 'Copied' : 'Social snippet'}
        </button>
        <button
          type="button"
          onClick={() => copy('markdown', buildQuizShareMarkdown(answers))}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-emerald/30 transition"
        >
          {copied === 'markdown' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
          {copied === 'markdown' ? 'Copied' : 'Markdown'}
        </button>
      </div>
    </div>
  );
}