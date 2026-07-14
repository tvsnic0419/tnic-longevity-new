import type { ReactNode } from 'react';
import Link from 'next/link';
import { getCompoundIdToSlugMap } from '@/lib/library-graph';

/**
 * The 12 editorial /hallmarks/[slug] pages hand-author intervention names as
 * plain strings (e.g. "NMN / NR (NAD+ precursors)"). This recognizes known
 * compound names inside that string and turns just those substrings into
 * links to their /library/compounds/[slug] module — without requiring every
 * page to restructure its INTERVENTIONS data.
 */
const COMPOUND_NAME_PATTERNS: { re: RegExp; id: string }[] = [
  { re: /Urolithin A/g, id: 'urolithina' },
  { re: /R-Alpha Lipoic Acid|Alpha-Lipoic Acid|R-ALA/g, id: 'rala' },
  { re: /Calcium Alpha-Ketoglutarate|Ca-AKG/g, id: 'cakg' },
  { re: /Grape Seed Extract|Grape Seed/g, id: 'grapeseed' },
  { re: /GlyNAC/g, id: 'glynac' },
  { re: /Sulforaphane|SFN\b/g, id: 'sulforaphane' },
  { re: /Resveratrol/g, id: 'resveratrol' },
  { re: /Rapamycin/g, id: 'rapamycin' },
  { re: /Fisetin/g, id: 'fisetin' },
  { re: /Spermidine/g, id: 'spermidine' },
  { re: /Pterostilbene/g, id: 'pterostilbene' },
  { re: /Berberine/g, id: 'berberine' },
  { re: /TUDCA/g, id: 'tudca' },
  { re: /CoQ10/g, id: 'coq10' },
  { re: /Omega-3/g, id: 'omega3' },
  { re: /\bNMN\b/g, id: 'nmn' },
  { re: /\bNR\b/g, id: 'nr' },
];

export function HallmarkInterventionName({ name }: { name: string }): ReactNode {
  const slugMap = getCompoundIdToSlugMap();

  const matches: { start: number; end: number; id: string }[] = [];
  for (const { re, id } of COMPOUND_NAME_PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(name))) {
      matches.push({ start: m.index, end: m.index + m[0].length, id });
    }
  }
  matches.sort((a, b) => a.start - b.start);

  const filtered: typeof matches = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  if (filtered.length === 0) return name;

  const parts: ReactNode[] = [];
  let cursor = 0;
  filtered.forEach((m, i) => {
    if (m.start > cursor) parts.push(name.slice(cursor, m.start));
    const slug = slugMap[m.id];
    const label = name.slice(m.start, m.end);
    parts.push(
      slug ? (
        <Link
          key={i}
          href={`/library/compounds/${slug}`}
          className="underline decoration-dotted underline-offset-4 decoration-current/40 hover:decoration-solid"
        >
          {label}
        </Link>
      ) : (
        label
      ),
    );
    cursor = m.end;
  });
  if (cursor < name.length) parts.push(name.slice(cursor));

  return parts;
}
