import { Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/landing/GlassCard";
import { KineticType } from "@/components/landing/KineticType";
import { HUBS } from "@/lib/tnic";

export function HubPage({ id }: { id: keyof typeof HUBS }) {
  const hub = HUBS[id];
  return (
    <main id="main-content" className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8">
      <p className="text-[0.72rem] font-medium tracking-[0.22em] text-accent uppercase">{hub.eyebrow}</p>
      <KineticType
        as="h1"
        text={hub.title}
        className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] tracking-[-0.03em]"
      />
      <p className="mt-5 max-w-2xl text-muted">{hub.lede}</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hub.cards.map((card) => {
          const inner = (
            <GlassCard className="flex h-full min-h-44 flex-col p-6 text-left">
              <h2 className="font-display text-2xl leading-tight tracking-tight">{card.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{card.body}</p>
            </GlassCard>
          );
          return card.href ? (
            <Link key={card.title} to={card.href} data-magnetic className="block">
              {inner}
            </Link>
          ) : (
            <div key={card.title}>{inner}</div>
          );
        })}
      </div>
    </main>
  );
}
