import type { ReactNode } from 'react';
import Link from 'next/link';
import { COMPOUND_TERMS_BY_LENGTH, HALLMARK_TERMS_BY_LENGTH, termPattern } from '@/lib/interlinking';

/**
 * Auto-links the first mention of any compound or hallmark name in a plain
 * text string to its library deep-dive — the hand-written-page equivalent of
 * the auto-linking MdxRenderer already does for MDX content (same term
 * tables, same first-mention-only rule, imported from lib/interlinking so
 * the two can never drift apart). Use this instead of rendering `{text}`
 * directly anywhere prose mentions compounds/hallmarks outside the MDX
 * pipeline — e.g. the standalone *-supplement-guide pages' FAQ answers.
 *
 * Excludes `excludeIds` (this page's own compound/hallmark, so it never
 * self-links) — pass the relevant `compoundId`/hallmark `id` values.
 */
export function LinkedText({
  text,
  excludeNames = [],
}: {
  text: string;
  /** Canonical names to skip linking (e.g. this page's own compound name). */
  excludeNames?: string[];
}): ReactNode {
  const linked = new Set(excludeNames);
  const terms = [...COMPOUND_TERMS_BY_LENGTH, ...HALLMARK_TERMS_BY_LENGTH].sort(
    (a, b) => b.name.length - a.name.length,
  );

  type Segment = { text: string; href?: string; key: string };
  let segments: Segment[] = [{ text, key: 's0' }];

  for (const { name, href } of terms) {
    if (linked.has(name)) continue;
    const isHallmark = HALLMARK_TERMS_BY_LENGTH.some((h) => h.name === name);
    const pattern = termPattern(name, isHallmark);
    let matchedOnce = false;
    segments = segments.flatMap((seg, i) => {
      if (seg.href || matchedOnce) return [seg];
      const match = pattern.exec(seg.text);
      if (!match) return [seg];
      matchedOnce = true;
      linked.add(name);
      const [matched] = match;
      const start = match.index;
      const end = start + matched.length;
      const before = seg.text.slice(0, start);
      const after = seg.text.slice(end);
      const out: Segment[] = [];
      if (before) out.push({ text: before, key: `${seg.key}-a` });
      out.push({ text: matched, href, key: `${seg.key}-${i}-link` });
      if (after) out.push({ text: after, key: `${seg.key}-b` });
      return out;
    });
  }

  return (
    <>
      {segments.map((seg) =>
        seg.href ? (
          <Link
            key={seg.key}
            href={seg.href}
            className="text-accent-cyan hover:text-accent-emerald underline decoration-accent-cyan/40 hover:decoration-accent-emerald underline-offset-2 transition-colors"
          >
            {seg.text}
          </Link>
        ) : (
          <span key={seg.key}>{seg.text}</span>
        ),
      )}
    </>
  );
}
