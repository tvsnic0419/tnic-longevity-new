"use client";

import { useEffect, useRef, useState } from "react";

// Shared scroll-reveal primitive. Returns a ref to attach and a boolean that
// flips true when the element enters the viewport. `once` (default) disconnects
// after the first reveal so entrance animations don't re-fire on scroll-back.
// Params are primitives so the effect deps stay identity-stable.

export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.3,
  rootMargin = "0px",
  once = true,
}: { threshold?: number; rootMargin?: string; once?: boolean } = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
