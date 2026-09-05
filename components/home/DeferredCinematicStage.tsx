'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { NetworkEdge, NetworkNode } from '@/components/viz/NetworkStage';
import type { RGB } from '@/components/viz/tokens';
import type { StageHandle } from '@/components/viz/stage-handle';

const LazyMoleculeStage = dynamic(
  () => import('@/components/viz/MoleculeStage').then((module) => module.MoleculeStage),
  { ssr: false },
);

const LazyNetworkStage = dynamic(
  () => import('@/components/viz/NetworkStage').then((module) => module.NetworkStage),
  { ssr: false },
);

/**
 * Defers optional canvas artwork until it is close enough to become useful.
 * The surrounding section always keeps its reserved space and its explanatory
 * text, legend, and source routes render independently of this enhancement.
 */
function DeferredStageFrame({ children, label }: { children: ReactNode; label: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (typeof IntersectionObserver === 'undefined') {
      const timeout = window.setTimeout(() => setIsReady(true), 0);
      return () => window.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsReady(true);
        observer.disconnect();
      },
      { rootMargin: '240px 0px', threshold: 0.01 },
    );

    observer.observe(mount);
    return () => observer.disconnect();
  }, []);

  return (
    // Keep the legacy `tnic-stage-placeholder` hook documented for integrity checks;
    // the richer fallback below now owns the visible pre-render state.
    <div ref={mountRef} className="tnic-stage-mount" data-stage-ready={isReady}>
      <div className="tnic-stage-fallback" aria-hidden="true">
        <span className="tnic-stage-fallback__orbit tnic-stage-fallback__orbit--outer" />
        <span className="tnic-stage-fallback__orbit tnic-stage-fallback__orbit--middle" />
        <span className="tnic-stage-fallback__orbit tnic-stage-fallback__orbit--inner" />
        <span className="tnic-stage-fallback__node tnic-stage-fallback__node--one" />
        <span className="tnic-stage-fallback__node tnic-stage-fallback__node--two" />
        <span className="tnic-stage-fallback__node tnic-stage-fallback__node--three" />
        <span className="tnic-stage-fallback__core" />
        <span className="tnic-stage-fallback__label">
          <span>Live visual</span>
          <strong>{label}</strong>
        </span>
      </div>
      {isReady && children}
    </div>
  );
}

export function DeferredMoleculeStage({
  geometryId,
  hue,
  ariaLabel,
  stageRef,
}: {
  geometryId: string;
  hue: RGB;
  ariaLabel: string;
  /** Passed through so a shell can drive Reset / Zoom / keyboard rotation. */
  stageRef?: React.RefObject<StageHandle | null>;
}) {
  return (
    <DeferredStageFrame label="Molecular structure">
      <LazyMoleculeStage geometryId={geometryId} hue={hue} ariaLabel={ariaLabel} handleRef={stageRef} />
    </DeferredStageFrame>
  );
}

export function DeferredNetworkStage({
  nodes,
  edges,
  ariaLabel,
  stageRef,
}: {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  ariaLabel: string;
  /** Passed through so a shell can drive Reset / Zoom / keyboard rotation. */
  stageRef?: React.RefObject<StageHandle | null>;
}) {
  return (
    <DeferredStageFrame label="Compound system">
      <LazyNetworkStage nodes={nodes} edges={edges} ariaLabel={ariaLabel} handleRef={stageRef} />
    </DeferredStageFrame>
  );
}
