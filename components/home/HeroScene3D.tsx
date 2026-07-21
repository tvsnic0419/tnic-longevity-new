'use client';

import { useMemo, useRef, useState, type PointerEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Group, Mesh, Vector3 } from 'three';
import type { EvidenceTier } from '@/lib/types';
import {
  HERO_NETWORK_EDGES,
  HERO_NETWORK_NODES_3D,
  HERO_NETWORK_TIER_COLOR,
  type HeroNetworkNode3D,
} from '@/lib/hero-network';

interface DragState {
  active: boolean;
  lastX: number;
  lastY: number;
  offsetX: number;
  offsetY: number;
}

const TIER_LABEL: Record<EvidenceTier, string> = {
  A: 'Tier A — strong evidence',
  B: 'Tier B — moderate evidence',
  C: 'Tier C — early evidence',
};

/**
 * The rotating node/edge network. Idle rotation (useFrame) is composed with
 * a user drag offset — both accumulate onto the same group's rotation, so
 * dragging nudges the view without stopping the idle motion.
 *
 * Each node also carries an invisible, slightly larger hit-target sphere:
 * the visible spheres are intentionally small (data density over 12+ nodes),
 * too small to reliably hover with a mouse, so raycasting hits a separate
 * transparent mesh instead of enlarging the node's rendered size.
 */
function Scene({
  drag,
  hoveredId,
  onHover,
  tooltipRef,
}: {
  drag: React.MutableRefObject<DragState>;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
}) {
  const groupRef = useRef<Group>(null);
  const meshRefs = useRef(new Map<string, Mesh>());
  const idle = useRef(0);
  const { camera, size } = useThree();
  const projected = useMemo(() => new Vector3(), []);

  const nodeMap = useMemo(() => new Map(HERO_NETWORK_NODES_3D.map((n) => [n.id, n])), []);

  const edgePositions = useMemo(() => {
    const positions: number[] = [];
    for (const e of HERO_NETWORK_EDGES) {
      const a = nodeMap.get(e.a);
      const b = nodeMap.get(e.b);
      if (!a || !b) continue;
      positions.push(...a.position, ...b.position);
    }
    return new Float32Array(positions);
  }, [nodeMap]);

  useFrame((_, delta) => {
    idle.current += delta * 0.08;
    if (!groupRef.current) return;
    groupRef.current.rotation.y = idle.current + drag.current.offsetX;
    groupRef.current.rotation.x = drag.current.offsetY;

    if (hoveredId && tooltipRef.current) {
      const mesh = meshRefs.current.get(hoveredId);
      if (mesh) {
        // Force an out-of-cycle matrix update: rotation was just set above,
        // and R3F's own auto-update pass runs after useFrame, so the world
        // matrix would otherwise be one frame stale for this projection.
        groupRef.current.updateMatrixWorld(true);
        mesh.getWorldPosition(projected);
        projected.project(camera);
        // Clamped so the tooltip never runs off the edge of the scene's own
        // container — nodes near the container boundary are common since
        // HomeHero mounts this scene with a `-inset-20` bleed past the quiz
        // card it surrounds.
        const marginX = 110;
        const marginY = 40;
        const x = Math.min(Math.max((projected.x * 0.5 + 0.5) * size.width, marginX), size.width - marginX);
        const y = Math.min(Math.max((-projected.y * 0.5 + 0.5) * size.height, marginY), size.height - marginY);
        // Set directly on the DOM node (no React state) — this runs every
        // frame while a node is hovered, and re-rendering React for a pixel
        // offset each frame would be wasted work the tooltip doesn't need.
        tooltipRef.current.style.transform = `translate(-50%, calc(-100% - 14px)) translate(${x}px, ${y}px)`;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" transparent opacity={0.3} />
      </lineSegments>
      {HERO_NETWORK_NODES_3D.map((n) => {
        const visibleRadius = 0.14 + Math.min(n.degree, 6) * 0.02;
        return (
          <group key={n.id} position={n.position}>
            <mesh>
              <sphereGeometry args={[visibleRadius, 16, 16]} />
              <meshStandardMaterial
                color={HERO_NETWORK_TIER_COLOR[n.tier]}
                emissive={HERO_NETWORK_TIER_COLOR[n.tier]}
                emissiveIntensity={n.id === hoveredId ? 1.15 : 0.65}
                roughness={0.35}
              />
            </mesh>
            {/* Invisible, larger hit target — hover precision on a small node
                shouldn't require enlarging what the node visually reads as. */}
            <mesh
              ref={(m) => {
                if (m) meshRefs.current.set(n.id, m);
                else meshRefs.current.delete(n.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(n.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                onHover(null);
              }}
            >
              <sphereGeometry args={[visibleRadius + 0.16, 12, 12]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Decorative, data-driven 3D rendition of the compound-synergy network —
 * only ever mounted client-side via HeroSceneMount's dynamic(ssr:false)
 * import once WebGL/motion/viewport eligibility is confirmed. Drag-to-look
 * is hand-rolled with plain DOM pointer events on the wrapping div (not
 * drei's OrbitControls, and not R3F's mesh-raycasting event system, which
 * wouldn't reliably fire over the mostly-empty space between nodes).
 *
 * Hovering an individual node *does* use R3F's mesh raycasting (that part
 * fires reliably — you're pointing directly at a mesh, not empty space) and
 * surfaces the compound name + evidence tier in a floating HUD tooltip, so
 * the network reads as live data rather than pure ambient decoration.
 */
export function HeroScene3D() {
  const drag = useRef<DragState>({ active: false, lastX: 0, lastY: 0, offsetX: 0, offsetY: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const hoveredNode: HeroNetworkNode3D | null = hoveredId
    ? (HERO_NETWORK_NODES_3D.find((n) => n.id === hoveredId) ?? null)
    : null;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.offsetX += (e.clientX - drag.current.lastX) * 0.005;
    drag.current.offsetY += (e.clientY - drag.current.lastY) * 0.005;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
  };

  return (
    <div
      className="relative h-full w-full touch-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={60} />
        <pointLight position={[-5, -3, -5]} intensity={20} color="#22d3ee" />
        <fog attach="fog" args={['#020811', 4, 9]} />
        <Scene drag={drag} hoveredId={hoveredId} onHover={setHoveredId} tooltipRef={tooltipRef} />
      </Canvas>
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute left-0 top-0 z-10 transition-opacity duration-150"
        style={{ opacity: hoveredNode ? 1 : 0 }}
        aria-hidden="true"
      >
        {hoveredNode && (
          <div className="hero-data-panel flex items-center gap-2 whitespace-nowrap !px-3 !py-2">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                background: HERO_NETWORK_TIER_COLOR[hoveredNode.tier],
                boxShadow: `0 0 8px ${HERO_NETWORK_TIER_COLOR[hoveredNode.tier]}`,
              }}
            />
            <span className="text-xs font-semibold text-white">{hoveredNode.name}</span>
            <span
              className="text-label !text-[10px]"
              style={{ color: HERO_NETWORK_TIER_COLOR[hoveredNode.tier] }}
            >
              {TIER_LABEL[hoveredNode.tier]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
