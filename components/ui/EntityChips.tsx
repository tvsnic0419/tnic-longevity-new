import Link from 'next/link';
import { TIER_COLOR_VAR } from '@/lib/trust';
import type { GraphEntity, EntityKind } from '@/lib/entity-graph';

/**
 * The site's relationship rail: a labelled row of links to the entities a
 * page actually connects to, derived from `lib/entity-graph.ts`.
 *
 * Built because the pages held their edges and rendered them as prose. The
 * pathway hub printed "6 compounds · 3 hallmarks" on every card and linked to
 * none of them; the sirtuin atlas named eight compounds that each have a
 * deep-dive and linked to zero. This is the one idiom for fixing that, so the
 * relationship reads the same everywhere it appears.
 *
 * Deliberately NOT a generic link list. Each chip carries its entity's kind in
 * its accent and a leading glyph, so a reader can tell a compound from a
 * hallmark from a pathway without reading the group label — and, per
 * STYLE_GUIDE, without relying on colour alone, which is what the glyph and
 * the group label are for. A compound chip additionally carries the evidence
 * tier it is graded at, as a dot in the canonical tier colour, because a link
 * to a Tier C compound and a link to a Tier A compound are not the same
 * invitation and the rail should not flatten them.
 *
 * Server component: no state, no client bundle.
 */

const KIND_META: Record<EntityKind, { glyph: string; accent: string; border: string; bg: string }> = {
  // The glyph is a semantic tell, not decoration — see the note above about
  // never encoding the entity's kind in colour alone.
  compound: { glyph: '◆', accent: 'text-accent-cyan', border: 'border-accent-cyan/25', bg: 'hover:bg-accent-cyan/[0.09]' },
  hallmark: { glyph: '◈', accent: 'text-accent-violet', border: 'border-accent-violet/25', bg: 'hover:bg-accent-violet/[0.09]' },
  pathway: { glyph: '⟶', accent: 'text-accent-emerald', border: 'border-accent-emerald/25', bg: 'hover:bg-accent-emerald/[0.09]' },
};

export function EntityChip({ entity }: { entity: GraphEntity }) {
  const meta = KIND_META[entity.kind];
  return (
    <Link
      href={entity.href}
      // min-h-6 is the 24px control floor audit-ui.mjs gates; the chips sit in
      // a `chip-row`, whose 1rem row-gap keeps the 44px pitch between rows.
      className={`focus-ring inline-flex min-h-6 items-center gap-1.5 rounded-full border ${meta.border} bg-background/30 px-2.5 py-0.5 text-micro font-medium text-foreground/85 transition-colors ${meta.bg} hover:text-foreground`}
    >
      <span className={`${meta.accent} leading-none`} aria-hidden="true">
        {meta.glyph}
      </span>
      {entity.label}
      {entity.tier && (
        <>
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: TIER_COLOR_VAR[entity.tier] }}
            aria-hidden="true"
          />
          <span className="sr-only">Evidence tier {entity.tier}</span>
        </>
      )}
    </Link>
  );
}

export function EntityChips({
  label,
  entities,
  max,
  moreHref,
  className = '',
}: {
  /** Names the relationship, e.g. "Acts on" or "Engaged by". */
  label: string;
  entities: GraphEntity[];
  /** Cap the rail; the remainder becomes a count, linked if `moreHref` is set. */
  max?: number;
  moreHref?: string;
  className?: string;
}) {
  if (entities.length === 0) return null;
  const shown = max ? entities.slice(0, max) : entities;
  const rest = entities.length - shown.length;

  return (
    <div className={className}>
      <p className="text-label mb-2 text-[var(--color-text-faint)]">{label}</p>
      <div className="chip-row">
        {shown.map((e) => (
          <EntityChip key={`${e.kind}:${e.key}`} entity={e} />
        ))}
        {rest > 0 &&
          (moreHref ? (
            <Link
              href={moreHref}
              className="focus-ring inline-flex min-h-6 items-center rounded-full border border-border/60 px-2.5 py-0.5 text-micro font-medium text-muted-foreground transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
            >
              +{rest} more
            </Link>
          ) : (
            <span className="inline-flex min-h-6 items-center px-1 text-micro text-muted-foreground">
              +{rest} more
            </span>
          ))}
      </div>
    </div>
  );
}
