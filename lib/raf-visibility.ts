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
 * Call `cb` whenever devicePixelRatio changes — browser zoom, or dragging the
 * window between a Retina and a non-Retina display. Both change the ratio
 * without necessarily changing the canvas's CSS size, so a ResizeObserver
 * alone will not catch them and the backing store is left at the old scale
 * (a canvas sized for 1x stretched onto a 2x screen is exactly the "soft on a
 * Retina display" symptom). `matchMedia` on the current resolution fires once
 * on change; we re-arm against the new ratio each time.
 */
export function onDprChange(cb: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  let mql: MediaQueryList | null = null;
  let stopped = false;

  const arm = () => {
    if (stopped) return;
    mql?.removeEventListener("change", handler);
    mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mql.addEventListener("change", handler);
  };
  function handler() {
    if (stopped) return;
    cb();
    arm(); // re-arm against the ratio we just moved to
  }

  arm();
  return () => {
    stopped = true;
    mql?.removeEventListener("change", handler);
  };
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
  opts?: { rootMargin?: string },
): () => void {
  let raf = 0;
  let visible = true;
  let running = false;

  const frame = () => {
    if (!running) return;
    draw();
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
