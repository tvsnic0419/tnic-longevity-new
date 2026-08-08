'use client';

import { useMemo, useRef, useState, type PointerEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, Color, Group, Mesh, Sprite as SpriteObject, SpriteMaterial, Vector3 } from 'three';
import {
  HERO_NETWORK_EDGES,
  HERO_NETWORK_NODES_3D,
  HERO_NETWORK_TIER_COLOR,
  HERO_NETWORK_TIER_LABEL,
  getPartnerIds,
  type HeroNetworkNode3D,
} from '@/lib/hero-network';
import { HeroInfoPanel } from './HeroInfoPanel';

interface DragState {
  active: boolean;
  /** True once movement passed DRAG_THRESHOLD_PX and the pointer was captured. */
  captured: boolean;
  lastX: number;
  lastY: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Pointer capture can't be taken on pointerdown: capturing retargets the
 * following pointerup/click to the capturing element, which would swallow
 * every click before it reached the canvas (R3F node selection) or the
 * visually-hidden node buttons. So capture is deferred until the pointer has
 * actually moved this far — past that, it's a drag, not a click.
 */
const DRAG_THRESHOLD_PX = 4;

const NEUTRAL_EDGE_COLOR = new Color('#64748b');
const DIM_EDGE_COLOR = new Color('#1e293b');
const IDLE_ROTATION_SPEED = 0.08;
const FOCUSED_ROTATION_SPEED = 0.02;

/** One shared radial-gradient texture for every node's glow sprite — built once, not per-node. */
function useGlowTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return canvas;
  }, []);
}

interface NodeMotionState {
  emissive: number;
  glowOpacity: number;
  glowScale: number;
  /** Node body opacity — emissive alone can't visibly dim a lit material. */
  opacity: number;
}

/**
 * The rotating node/edge network. Idle rotation (useFrame) is composed with
 * a user drag offset — both accumulate onto the same group's rotation, so
 * dragging nudges the view without stopping the idle motion. Selecting a
 * node slows (not stops) the idle spin so its highlighted context doesn't
 * spin away mid-read.
 *
 * Each node also carries an invisible, slightly larger hit-target sphere:
 * the visible spheres are intentionally small (data density over 50+ nodes),
 * too small to reliably hover/click with a mouse, so raycasting hits a
 * separate transparent mesh instead of enlarging the node's rendered size.
 */
function Scene({
  drag,
  hoveredId,
  onHover,
  selectedId,
  onSelect,
  tooltipRef,
}: {
  drag: React.MutableRefObject<DragState>;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
}) {
  const groupRef = useRef<Group>(null);
  /** Hit-target meshes — also the anchor for tooltip projection. */
  const meshRefs = useRef(new Map<string, Mesh>());
  /** Visible node bodies — the meshes whose material actually gets styled. */
  const bodyRefs = useRef(new Map<string, Mesh>());
  const glowRefs = useRef(new Map<string, SpriteObject>());
  const motion = useRef(new Map<string, NodeMotionState>());
  const idle = useRef(0);
  const { camera, size } = useThree();
  const projected = useMemo(() => new Vector3(), []);
  const glowTexture = useGlowTexture();

  const nodeMap = useMemo(() => new Map(HERO_NETWORK_NODES_3D.map((n) => [n.id, n])), []);
  const partnerIds = useMemo(() => new Set(selectedId ? getPartnerIds(selectedId) : []), [selectedId]);

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

  // Recomputed (new array reference) on every selection change, which R3F
  // picks up by reinstantiating the bufferAttribute via its `args` prop —
  // simpler and paint-safe (no post-mount black-line flash) than mutating a
  // shared array in a useEffect that only runs after first paint.
  const edgeColors = useMemo(() => {
    const colors = new Float32Array(edgePositions.length);
    let i = 0;
    for (const e of HERO_NETWORK_EDGES) {
      if (!nodeMap.has(e.a) || !nodeMap.has(e.b)) continue;
      const isActive = selectedId !== null && (e.a === selectedId || e.b === selectedId);
      const otherId = e.a === selectedId ? e.b : e.a;
      const otherNode = isActive ? nodeMap.get(otherId) : undefined;
      let c = NEUTRAL_EDGE_COLOR;
      if (isActive && otherNode) c = new Color(HERO_NETWORK_TIER_COLOR[otherNode.tier]);
      else if (selectedId !== null) c = DIM_EDGE_COLOR;
      colors[i++] = c.r;
      colors[i++] = c.g;
      colors[i++] = c.b;
      colors[i++] = c.r;
      colors[i++] = c.g;
      colors[i++] = c.b;
    }
    return colors;
  }, [selectedId, nodeMap, edgePositions]);

  useFrame((_, delta) => {
    idle.current += delta * (selectedId ? FOCUSED_ROTATION_SPEED : IDLE_ROTATION_SPEED);
    if (!groupRef.current) return;
    groupRef.current.rotation.y = idle.current + drag.current.offsetX;
    groupRef.current.rotation.x = drag.current.offsetY;

    // Focus "dolly": ease the whole network slightly larger while a node is
    // selected, instead of tracking one node's exact (constantly rotating)
    // world position — a stable "lean in" cue that can't clip through a
    // moving target. Scales the group (a plain ref) rather than mutating the
    // camera object useThree() returns.
    const targetScale = selectedId ? 1.12 : 1;
    const scaleLerp = Math.min(delta * 3, 1);
    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * scaleLerp,
    );

    for (const n of HERO_NETWORK_NODES_3D) {
      const state = motion.current.get(n.id) ?? {
        emissive: 0.65,
        glowOpacity: 0.16,
        glowScale: 1,
        opacity: 1,
      };
      const isSelected = n.id === selectedId;
      const isPartner = partnerIds.has(n.id);
      const isDimmed = selectedId !== null && !isSelected && !isPartner;
      const isHovered = n.id === hoveredId;

      const emissiveTarget = isSelected ? 1.6 : isHovered ? 1.15 : isDimmed ? 0.2 : 0.65;
      const glowOpacityTarget = isSelected ? 0.75 : isHovered || isPartner ? 0.45 : isDimmed ? 0.05 : 0.16;
      const glowScaleTarget = isSelected ? 1.5 : 1;
      const opacityTarget = isDimmed ? 0.22 : 1;

      const lerpFactor = Math.min(delta * 8, 1);
      state.emissive += (emissiveTarget - state.emissive) * lerpFactor;
      state.glowOpacity += (glowOpacityTarget - state.glowOpacity) * lerpFactor;
      state.glowScale += (glowScaleTarget - state.glowScale) * lerpFactor;
      state.opacity += (opacityTarget - state.opacity) * lerpFactor;
      motion.current.set(n.id, state);

      const body = bodyRefs.current.get(n.id);
      const mat = body?.material;
      if (mat && !Array.isArray(mat) && 'emissiveIntensity' in mat) {
        const m = mat as unknown as { emissiveIntensity: number; opacity: number };
        m.emissiveIntensity = state.emissive;
        m.opacity = state.opacity;
      }
      const glow = glowRefs.current.get(n.id);
      if (glow) {
        const glowMat = glow.material as SpriteMaterial;
        glowMat.opacity = state.glowOpacity;
        const baseScale = 0.14 + Math.min(n.degree, 6) * 0.02;
        // ~2.4x the node radius: a tight rim of light that reads as bloom.
        // Larger multiples smear into a muddy haze across the whole cluster.
        glow.scale.setScalar(baseScale * state.glowScale * 2.4);
      }
    }

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
        // container.
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
          <bufferAttribute attach="attributes-color" args={[edgeColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.55} />
      </lineSegments>
      {HERO_NETWORK_NODES_3D.map((n) => {
        const visibleRadius = 0.14 + Math.min(n.degree, 6) * 0.02;
        return (
          <group key={n.id} position={n.position}>
            <mesh
              ref={(m) => {
                if (m) bodyRefs.current.set(n.id, m);
                else bodyRefs.current.delete(n.id);
              }}
            >
              <sphereGeometry args={[visibleRadius, 16, 16]} />
              <meshStandardMaterial
                color={HERO_NETWORK_TIER_COLOR[n.tier]}
                emissive={HERO_NETWORK_TIER_COLOR[n.tier]}
                emissiveIntensity={0.65}
                roughness={0.35}
                transparent
              />
            </mesh>
            {glowTexture && (
              <sprite
                ref={(s) => {
                  if (s) glowRefs.current.set(n.id, s);
                  else glowRefs.current.delete(n.id);
                }}
                scale={[visibleRadius * 2.4, visibleRadius * 2.4, 1]}
              >
                <spriteMaterial
                  color={HERO_NETWORK_TIER_COLOR[n.tier]}
                  transparent
                  opacity={0.25}
                  depthWrite={false}
                  blending={AdditiveBlending}
                >
                  <canvasTexture attach="map" args={[glowTexture]} />
                </spriteMaterial>
              </sprite>
            )}
            {/* Invisible, larger hit target — hover/click precision on a small
                node shouldn't require enlarging what the node visually reads as. */}
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
              onClick={(e) => {
                e.stopPropagation();
                onSelect(n.id === selectedId ? null : n.id);
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
 * Interactive, data-driven 3D rendition of the compound-synergy network —
 * only ever mounted client-side via HeroSceneMount's dynamic(ssr:false)
 * import once WebGL/motion/viewport eligibility is confirmed. Drag-to-look
 * is hand-rolled with plain DOM pointer events on the wrapping div (not
 * drei's OrbitControls, and not R3F's mesh-raycasting event system, which
 * wouldn't reliably fire over the mostly-empty space between nodes).
 *
 * Hovering a node uses R3F's mesh raycasting (that part fires reliably —
 * you're pointing directly at a mesh, not empty space) and surfaces a quick
 * name + evidence-tier chip. Clicking a node selects it: partner nodes/edges
 * light up, everything else dims, and a persistent HeroInfoPanel opens with
 * the real synergy "why" for each connection and a link to the compound
 * page. A visually-hidden button per node mirrors the click handler so
 * keyboard/screen-reader users reach the same panel — an R3F mesh's onClick
 * is not otherwise reachable via Tab.
 */
export function HeroScene3D() {
  const drag = useRef<DragState>({
    active: false,
    captured: false,
    lastX: 0,
    lastY: 0,
    offsetX: 0,
    offsetY: 0,
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const hoveredNode: HeroNetworkNode3D | null = hoveredId
    ? (HERO_NETWORK_NODES_3D.find((n) => n.id === hoveredId) ?? null)
    : null;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current.active = true;
    drag.current.captured = false;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    drag.current.captured = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    if (!drag.current.captured) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX && Math.abs(dy) < DRAG_THRESHOLD_PX) return;
      drag.current.captured = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    drag.current.offsetX += dx * 0.005;
    drag.current.offsetY += dy * 0.005;
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
      {/* Camera is pulled back far enough that the whole 2.3-radius network
          fits inside the hero's fixed-height stage with margin. The older
          z=6 framing was tuned for the scene's previous life as a full-bleed
          background bleed, where overflowing the viewport was the point. */}
      <Canvas
        camera={{ position: [0, 0, 9], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={90} />
        <pointLight position={[-5, -3, -5]} intensity={30} color="#22d3ee" />
        {/* Fog range follows the camera distance: nodes sit between ~6.7 and
            ~11.3 units out, so depth cueing has to start past the nearest. */}
        <fog attach="fog" args={['#020811', 8, 15]} />
        <Scene
          drag={drag}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          selectedId={selectedId}
          onSelect={setSelectedId}
          tooltipRef={tooltipRef}
        />
      </Canvas>
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute left-0 top-0 z-10 transition-opacity duration-150"
        style={{ opacity: hoveredNode && !selectedId ? 1 : 0 }}
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
              {HERO_NETWORK_TIER_LABEL[hoveredNode.tier]}
            </span>
          </div>
        )}
      </div>

      <HeroInfoPanel
        selectedId={selectedId}
        onSelectPartner={setSelectedId}
        onClose={() => setSelectedId(null)}
      />

      {/* Keyboard/screen-reader path: an R3F mesh's onClick isn't reachable
          via Tab, so every node also gets a real, visually-hidden button
          driving the exact same selection state. */}
      <div className="sr-only">
        {HERO_NETWORK_NODES_3D.map((n) => (
          <button key={n.id} type="button" onClick={() => setSelectedId(n.id === selectedId ? null : n.id)}>
            {n.name} — {HERO_NETWORK_TIER_LABEL[n.tier]}
          </button>
        ))}
      </div>
    </div>
  );
}
