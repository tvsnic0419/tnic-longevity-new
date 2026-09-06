import { useEffect, useRef, useState } from "react";

export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("has-magnetic-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    let scale = 1;
    let targetScale = 1;
    let raf = 0;
    let running = true;

    const isMagnetic = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return null;
      return el.closest("a, button, [data-magnetic], [role='button']");
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const hit = isMagnetic(e.target);
      if (hit instanceof HTMLElement) {
        const r = hit.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const dist = Math.hypot(dx, dy);
        const radius = Math.max(r.width, r.height) * 0.7 + 28;
        if (dist < radius) {
          const strength = 1 - dist / radius;
          target.x += dx * strength * 0.38;
          target.y += dy * strength * 0.38;
          targetScale = 1.55 + Math.min(r.width, 220) / 280;
        } else {
          targetScale = 1;
        }
      } else {
        targetScale = 1;
      }
    };

    const tick = () => {
      if (!running) return;
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      scale += (targetScale - scale) * 0.16;
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      if (ring) {
        ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-magnetic-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block" aria-hidden="true">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 size-10 rounded-full border border-accent/70"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 size-1.5 rounded-full bg-accent"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
