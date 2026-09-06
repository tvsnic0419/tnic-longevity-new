import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type KineticTypeProps = {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
};

export function KineticType({ text, as: Tag = "h1", className, delay = 0 }: KineticTypeProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".kinetic-word");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      words.forEach((w) => w.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          words.forEach((word, i) => {
            word.style.animationDelay = `${delay + i * 70}ms`;
            word.classList.add("is-in");
          });
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, text]);

  const words = text.split(" ");

  return (
    <Tag
      ref={ref as never}
      className={cn("perspective-[800px]", className)}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="kinetic-word mr-[0.28em] last:mr-0">
          {word}
        </span>
      ))}
    </Tag>
  );
}
