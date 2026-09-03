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
 * Size a canvas's backing store to *exact* device pixels and scale its context
 * so one drawing unit stays one CSS pixel. Rounding the backing store to whole
 * integers — rather than letting `clientWidth * dpr` land on a fraction the
 * browser silently truncates — is what keeps the render pixel-crisp on
 * non-integer layout widths (a flex/grid cell at 390.5px, an aspect-ratio box).
 * The transform is scaled by the *actual* integer ratio, so an integer width
 * (the common case) is byte-for-byte identical to `setTransform(dpr,…)` and a
 * fractional width simply gets sharper. Returns the CSS w/h the caller draws in.
 */
export function fitCanvas(
  cv: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  dpr: number,
): { w: number; h: number } {
  const w = cv.clientWidth;
  const h = cv.clientHeight;
  if (w <= 0 || h <= 0) return { w, h };
  const bw = Math.round(w * dpr);
  const bh = Math.round(h * dpr);
  if (cv.width !== bw) cv.width = bw;
  if (cv.height !== bh) cv.height = bh;
  ctx.setTransform(bw / w, 0, 0, bh / h, 0, 0);
  return { w, h };
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
