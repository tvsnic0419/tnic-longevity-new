import { pathways } from '@/lib/pathways';
import type { PathwayCategory } from '@/lib/pathways';

// ─────────────────────────────────────────────────────────────────────────────
// PathwayFamilies — a compact orientation strip for the pathways hub. The hub
// leads with a dense synergy network; this names the mechanism families that
// network is built from and how many pathways sit in each, giving the reader a
// legend/entry point before the graph. Derived from `pathways` (category
// field). Server-safe.
// ─────────────────────────────────────────────────────────────────────────────

const FAMILY: Record<PathwayCategory, { label: string; color: string }> = {
  sirtuins: { label: 'Sirtuin axis', color: 'var(--accent-violet)' },
  sensing: { label: 'Nutrient sensing', color: 'var(--accent-cyan)' },
  mitophagy: { label: 'Mitophagy & mitochondria', color: 'var(--accent-emerald)' },
  defense: { label: 'Cellular defense', color: 'var(--accent-amber)' },
  signaling: { label: 'Intercellular signaling', color: 'var(--accent-rose)' },
};

const ORDER: PathwayCategory[] = ['sirtuins', 'sensing', 'mitophagy', 'defense', 'signaling'];

export function PathwayFamilies({ className = '' }: { className?: string }) {
  const total = pathways.length;
  if (total === 0) return null;

  const families = ORDER.map((category) => ({
    category,
    count: pathways.filter((p) => p.category === category).length,
    ...FAMILY[category],
  })).filter((f) => f.count > 0);

  const peak = Math.max(...families.map((f) => f.count), 1);

  return (
    <section
      className={`premium-card p-5 sm:p-7 ${className}`}
      style={{ ['--card-accent' as string]: 'var(--accent-violet)' }}
      aria-label={`Pathway families: ${total} pathways across ${families.length} mechanism families — ${families
        .map((f) => `${f.count} ${f.label}`)
        .join(', ')}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-label text-[var(--color-text-faint)]">Mechanism families</p>
          <h2 className="heading-card mt-1 text-foreground">
            {total} pathways across {families.length} families
          </h2>
        </div>
        <p className="font-mono text-micro text-[var(--color-text-faint)]">The verbs behind the network below</p>
      </div>

      <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {families.map((f) => (
          <li key={f.category}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="flex items-center gap-2 text-body-sm text-[var(--color-text-secondary)]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
                {f.label}
              </span>
              <span className="font-mono text-body-sm font-semibold tabular-nums" style={{ color: f.color }}>
                {f.count}
              </span>
            </div>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]" aria-hidden="true">
              <span
                className="block h-full rounded-full"
                style={{ width: `${(f.count / peak) * 100}%`, background: f.color, boxShadow: `0 0 8px -1px ${f.color}` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
