// Runtime-perf helpers shared by every canvas animation on the site — the one
// MoleculeStage engine and Descent's shimmer + cursor fields. Centralizing them
// means each canvas pauses when it scrolls off-screen or the tab is hidden, and
// caps its resolution on low-end hardware, the same way, once. Idle GPU/CPU is
// the difference between a beautiful page and a beautiful page that also scores
// well on INP and battery.

/** Device pixel ratio, capped — and capped harder on low-core-count devices. */
export function cappedDpr(max = 3): number {
  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 8 : 8;
  const ceiling = cores < 4 ? Math.min(max, 1.5) : max;
  const ratio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return Math.min(ratio, ceiling);
}

/**
 * Drive `draw` on requestAnimationFrame, but only while `el` is in (or near)
 * the viewport and the tab is visible. Returns a cleanup that stops the loop
 * and detaches its observers. `draw` renders exactly one frame — it must not
 * schedule its own rAF.
 */
export function runWhenVisible(
  el: Element,
  draw: () => void,
  opts?: { rootMargin?: string; once?: boolean },
): () => void {
  let raf = 0;
  let visible = true;
  let running = false;

  // `once` renders a single frame per visibility gain instead of driving a
  // continuous loop. Decorative thumbnails (e.g. a grid of dozens of compound
  // molecules) look the same rendered once as they do animating at 60fps, but
  // cost a single frame instead of a permanent rAF loop each.
  const frame = () => {
    if (!running) return;
    draw();
    if (opts?.once) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (running || !visible || (typeof document !== "undefined" && document.hidden)) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    },
    { rootMargin: opts?.rootMargin ?? "200px" },
  );
  io.observe(el);

  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  start();

  return () => {
    stop();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
