import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ParticleField } from "@/components/landing/ParticleField";
import { KineticType } from "@/components/landing/KineticType";
import { GlassCard } from "@/components/landing/GlassCard";

const STATS = [
  { value: "8", label: "Elite interventions", href: "/elite-8" },
  { value: "12", label: "Hallmarks mapped", href: "/hallmarks" },
  { value: "A–C", label: "Evidence grades", href: "/trust" },
];

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty("--tilt-x", `${x * 10}px`);
      stage.style.setProperty("--tilt-y", `${y * 8}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section id="arrive" className="relative isolate min-h-dvh overflow-hidden liquid-wash">
      <ParticleField />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgb(5_8_15/0.15)_55%,rgb(5_8_15/0.82)_100%)]" />

      <div
        ref={stageRef}
        className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 lg:justify-center lg:pb-24 lg:pt-32"
      >
        <p className="mb-5 text-[0.72rem] font-medium tracking-[0.22em] text-accent uppercase">
          Evidence-Graded Longevity Library
        </p>

        <div
          className="max-w-4xl will-change-transform"
          style={{ transform: "translate3d(var(--tilt-x, 0), var(--tilt-y, 0), 0)" }}
        >
          <KineticType
            text="Evidence-based longevity, without the hype."
            className="font-display text-[clamp(2.6rem,8.4vw,6.4rem)] leading-[0.92] tracking-[-0.035em] text-fg"
          />
        </div>

        <p className="mt-7 max-w-xl text-[1.05rem] leading-relaxed text-muted">
          A free, PubMed-backed library for understanding longevity supplements,
          the 12 hallmarks of aging, and the evidence behind each compound —
          before you buy or build a stack.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/library"
            data-magnetic
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 pr-4 text-[0.92rem] font-medium text-bg transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            Enter the library
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </Link>
          <Link
            to="/nico"
            data-magnetic
            className="inline-flex min-h-11 items-center rounded-full px-5 text-[0.92rem] text-fg/85 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_16%,transparent)] transition-[background-color,transform] duration-150 ease-out hover:bg-fg/5 active:scale-[0.96]"
          >
            Start with NICO
          </Link>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-3">
          {STATS.map((stat) => (
            <Link key={stat.label} to={stat.href} data-magnetic className="block">
              <GlassCard className="px-5 py-4">
                <p className="font-display text-3xl tracking-tight text-fg">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
