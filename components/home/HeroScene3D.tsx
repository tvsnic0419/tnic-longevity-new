'use client';

import { useMemo, useRef, type PointerEvent } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import {
  HERO_NETWORK_EDGES,
  HERO_NETWORK_NODES_3D,
  HERO_NETWORK_TIER_COLOR,
} from '@/lib/hero-network';

interface DragState {
  active: boolean;
  lastX: number;
  lastY: number;
  offsetX: number;
  offsetY: number;
}

/**
 * The rotating node/edge network. Idle rotation (useFrame) is composed with
 * a user drag offset — both accumulate onto the same group's rotation, so
 * dragging nudges the view without stopping the idle motion.
 */
function Scene({ drag }: { drag: React.MutableRefObject<DragState> }) {
  const groupRef = useRef<Group>(null);
  const idle = useRef(0);

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
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" transparent opacity={0.3} />
      </lineSegments>
      {HERO_NETWORK_NODES_3D.map((n) => (
        <mesh key={n.id} position={n.position}>
          <sphereGeometry args={[0.14 + Math.min(n.degree, 6) * 0.02, 16, 16]} />
          <meshStandardMaterial
            color={HERO_NETWORK_TIER_COLOR[n.tier]}
            emissive={HERO_NETWORK_TIER_COLOR[n.tier]}
            emissiveIntensity={0.65}
            roughness={0.35}
          />
        </mesh>
      ))}
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
 */
export function HeroScene3D() {
  const drag = useRef<DragState>({ active: false, lastX: 0, lastY: 0, offsetX: 0, offsetY: 0 });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
  };
  const onPointerUp = () => {
    drag.current.active = false;
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
      className="h-full w-full touch-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={60} />
        <pointLight position={[-5, -3, -5]} intensity={20} color="#22d3ee" />
        <fog attach="fog" args={['#020811', 4, 9]} />
        <Scene drag={drag} />
      </Canvas>
    </div>
  );
}
