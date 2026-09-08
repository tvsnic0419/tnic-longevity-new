import type { BiohackCard as Card, BiohackTier } from '@/lib/biohack/protocol';
import { BIOHACK_TIERS } from '@/lib/biohack/protocol';
import { GlassPanel } from '@/components/ui/GlassPanel';

export function BiohackCardView({ card, compact = false }: { card: Card; compact?: boolean }) {
  const tier = BIOHACK_TIERS.find((t) => t.id === card.tier) as BiohackTier;
  return (
    <GlassPanel depth="content" className="relative overflow-hidden rounded-2xl">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: tier.color }}
      />
      <div className="flex gap-4 p-5 pl-6 md:p-6 md:pl-7">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[#05080c]"
          style={{ backgroundColor: tier.color }}
        >
          {card.num}
        </div>
        <div className="min-w-0 space-y-2">
          <h3 className="font-display text-lg tracking-tight text-foreground md:text-xl">{card.name}</h3>
          <p className="text-sm text-accent-cyan">
            <span className="font-semibold tracking-wide">DOSE</span> {card.dose}
            <span className="mx-3 text-muted-foreground/50">·</span>
            <span className="font-semibold tracking-wide">TARGETS</span> {card.targets}
          </p>
          {!compact && <p className="text-body-sm text-foreground/90">{card.body}</p>}
          <p className="text-sm italic text-accent-cyan/80">
            <span className="not-italic font-semibold">SYNERGY</span> {card.synergy}
          </p>
          <p className="text-sm text-accent-emerald">
            <span className="font-semibold">WHEN</span> {card.when}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
