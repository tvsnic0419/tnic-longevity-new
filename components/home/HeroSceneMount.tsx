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
const DESKTOP_QUERY = `(min-width: ${MOBILE_BREAKPOINT + 1}px)`;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Software rasterizer fallbacks (SwiftShader on Chrome/ANGLE, llvmpipe/softpipe
// on Mesa, WARP/"Microsoft Basic Render Driver" on Windows, common VM display
// adapters) report a real WebGL context but emulate the GPU pipeline on the
// CPU — measured locally at ~30s of main-thread work for this scene, several
// orders of magnitude slower than hardware acceleration. Some real users hit
// this (older/blocklisted GPUs cause a silent driver fallback, or a VM/RDP
// session). Renderer strings aren't standardized, so this list is best-effort,
// not exhaustive — acceptable here because the gate is for a decorative
// visual, and the poster fallback below is always a correct, complete result.
const SOFTWARE_RENDERER_PATTERN =
  /swiftshader|software|llvmpipe|softpipe|microsoft basic render|warp|vmware|virtualbox|parallels/i;

function detectWebGL(): boolean {
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  try {
    const canvas = document.createElement('canvas');
    gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      if (SOFTWARE_RENDERER_PATTERN.test(renderer)) return false;
    }
    return true;
  } catch {
    return false;
  } finally {
    // This probe context is never attached to the page — release it
    // immediately so repeated mounts (e.g. client-side nav back to "/")
    // don't accumulate contexts toward the browser's concurrent-context cap.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

/**
 * Decides between the live WebGL scene and its static SVG poster, and owns
 * the client-only dynamic import so HomeHero.tsx can stay a server
 * component. Always renders the poster on the server and on first client
 * render (capability checks are impossible during SSR), so the first paint
 * is deterministic on both sides — no hydration mismatch.
 *
 * The WebGL capability check runs once (hardware/software rendering can't
 * change mid-session), but viewport width and reduced-motion preference are
 * tracked live via matchMedia, in both directions — matching the CSS
 * breakpoint and RevealItem's own live useReducedMotion() elsewhere on the
 * site, so resizing the window or toggling the OS motion setting mid-session
 * degrades (or upgrades) this visual the same way the rest of the page does.
 */
export function HeroSceneMount() {
  const [webglOk, setWebglOk] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setWebglOk(detectWebGL());

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    setDesktop(desktopQuery.matches);
    setReducedMotion(motionQuery.matches);

    const onDesktopChange = (e: MediaQueryListEvent) => setDesktop(e.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    desktopQuery.addEventListener('change', onDesktopChange);
    motionQuery.addEventListener('change', onMotionChange);
    return () => {
      desktopQuery.removeEventListener('change', onDesktopChange);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  const eligible = webglOk && desktop && !reducedMotion;

  return <div className="h-full w-full">{eligible ? <HeroScene3D /> : <HeroScenePoster />}</div>;
}
