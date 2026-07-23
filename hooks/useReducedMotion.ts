"use client";

import { useSyncExternalStore } from "react";

// Shared `prefers-reduced-motion` reader. Uses useSyncExternalStore so it never
// triggers the "setState inside effect" cascade, stays SSR-safe (server snapshot
// is always false), and gives the whole viz/animation family one source of truth.

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
