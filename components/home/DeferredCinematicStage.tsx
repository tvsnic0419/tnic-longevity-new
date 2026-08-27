'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { NetworkEdge, NetworkNode } from '@/components/viz/NetworkStage';
import type { RGB } from '@/components/viz/tokens';

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
function DeferredStageFrame({ children }: { children: ReactNode }) {
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
    <div ref={mountRef} className="tnic-stage-mount" data-stage-ready={isReady}>
      {isReady ? children : <div className="tnic-stage-placeholder" aria-hidden="true" />}
    </div>
  );
}

export function DeferredMoleculeStage({
  geometryId,
  hue,
  ariaLabel,
}: {
  geometryId: string;
  hue: RGB;
  ariaLabel: string;
}) {
  return (
    <DeferredStageFrame>
      <LazyMoleculeStage geometryId={geometryId} hue={hue} ariaLabel={ariaLabel} />
    </DeferredStageFrame>
  );
}

export function DeferredNetworkStage({
  nodes,
  edges,
  ariaLabel,
}: {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  ariaLabel: string;
}) {
  return (
    <DeferredStageFrame>
      <LazyNetworkStage nodes={nodes} edges={edges} ariaLabel={ariaLabel} />
    </DeferredStageFrame>
  );
}
