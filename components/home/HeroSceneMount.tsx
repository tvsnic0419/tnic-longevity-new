'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   WebGL/motion/viewport eligibility can only be determined client-side
   (matchMedia, canvas.getContext, window.innerWidth are all unavailable
   during SSR), so this setState is intentional and not derivable during
   render — same justification as BiomarkerInput.tsx's mount-driven state. */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { HeroScenePoster } from './HeroScenePoster';

const HeroScene3D = dynamic(() => import('./HeroScene3D').then((m) => m.HeroScene3D), {
  ssr: false,
  loading: () => <HeroScenePoster />,
});

// Matches the Deep Glass System's own mobile-degradation breakpoint
// (app/globals.css, backdrop-filter blur halving) for one consistent
// "below this width, cut visual cost" threshold sitewide.
const MOBILE_BREAKPOINT = 767;

// Software rasterizer fallbacks (SwiftShader on Chrome/ANGLE, llvmpipe/softpipe
// on Mesa) report a real WebGL context but emulate the GPU pipeline on the CPU
// — measured locally at ~30s of main-thread work for this scene, several
// orders of magnitude slower than hardware acceleration. Some real users hit
// this (older/blocklisted GPUs cause a silent driver fallback), so detection
// needs to rule out software rendering, not just "a context exists."
const SOFTWARE_RENDERER_PATTERN = /swiftshader|software|llvmpipe|softpipe/i;

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      if (SOFTWARE_RENDERER_PATTERN.test(renderer)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Decides between the live WebGL scene and its static SVG poster, and owns
 * the client-only dynamic import so HomeHero.tsx can stay a server
 * component. Always renders the poster on the server and on first client
 * render (capability checks are impossible during SSR) — eligibility is
 * only ever upgraded post-mount, never downgraded after, so there's no
 * hydration mismatch: the first paint is deterministic on both sides.
 */
export function HeroSceneMount() {
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    if (prefersReduced || isMobile || !detectWebGL()) return;
    setEligible(true);
  }, []);

  return <div className="h-full w-full">{eligible ? <HeroScene3D /> : <HeroScenePoster />}</div>;
}
