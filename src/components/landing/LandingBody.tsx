import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/landing/GlassCard";
import { KineticType } from "@/components/landing/KineticType";
import { ELITE, HALLMARKS, STEPS } from "@/lib/tnic";

export function LandingBody() {
  return (
    <>
      <section id="system" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-[0.72rem] font-medium tracking-[0.22em] text-accent uppercase">01 / System</p>
        <KineticType
          as="h2"
          text="Nothing works alone."
          className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.03em]"
        />
        <p className="mt-5 max-w-2xl text-muted">
          Every graded compound sits on a graph of boosts and clashes. Open the
          engine when you want the system view; stay in the library when you want
          one module.
        </p>
        <div className="mt-8">
          <Link
            to="/compound-engine"
            data-magnetic
            className="inline-flex min-h-11 items-center gap-1 text-sm text-fg"
          >
            Open the compound engine
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <section id="elite-interventions" className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <p className="text-[0.72rem] font-medium tracking-[0.22em] text-accent uppercase">03 / Interventions</p>
        <KineticType
          as="h2"
          text="Elite interventions, graded in public."
          className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.03em]"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ELITE.map((item) => (
            <Link key={item.id} to="/elite-8" data-magnetic className="block">
              <GlassCard className="flex min-h-48 flex-col p-5">
                <span className="text-xs tracking-[0.16em] text-accent uppercase">Tier {item.tier}</span>
                <h3 className="mt-4 font-display text-2xl tracking-tight">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.line}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      <section id="mechanisms" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-[0.72rem] font-medium tracking-[0.22em] text-accent uppercase">04 / Mechanisms</p>
        <KineticType
          as="h2"
          text="Twelve hallmarks. Graded interventions."
          className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.03em]"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HALLMARKS.map((item) => (
            <Link key={item.slug} to="/hallmarks" data-magnetic className="block">
              <GlassCard className="flex min-h-[200px] flex-col p-6">
                <span className="text-xs tracking-[0.18em] text-accent uppercase">{item.n}</span>
                <h3 className="mt-6 font-display text-2xl leading-tight tracking-tight">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.blurb}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      <section id="protocol" className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <p className="text-[0.72rem] font-medium tracking-[0.22em] text-accent uppercase">05 / Protocol</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {STEPS.map((step) => (
            <GlassCard key={step.n} className="p-6">
              <span className="text-xs tracking-[0.18em] text-accent uppercase">{step.n}</span>
              <h3 className="mt-5 font-display text-2xl tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="personalize" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <GlassCard className="flex flex-col gap-6 p-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div className="max-w-xl">
            <p className="text-[0.72rem] font-medium tracking-[0.22em] text-accent uppercase">06 / Personalize</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight tracking-tight">
              Nine questions. A starting plan you can inspect.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              NICO does not prescribe. It narrows the library to a first pass.
            </p>
          </div>
          <Link
            to="/nico"
            data-magnetic
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-bg"
          >
            Open NICO
          </Link>
        </GlassCard>
      </section>
    </>
  );
}
