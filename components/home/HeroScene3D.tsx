'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  Quaternion,
  Vector3,
} from 'three';
import { createNodeMaterial } from '@/lib/hero-scene-materials';
import { HeroScenePostFX } from './HeroScenePostFX';
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

/**
 * Unit-height cylinder shared by every edge — built once at module scope, so
 * the ~50 edge meshes cost one geometry between them and scaling Y by the
 * edge's length gives its exact span. Six radial segments is plenty at this
 * thickness and keeps the vertex count trivial.
 */
const edgeGeometry = new CylinderGeometry(0.011, 0.011, 1, 6, 1, true);

interface NodeMotionState {
  emissive: number;
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
  const motion = useRef(new Map<string, NodeMotionState>());
  const idle = useRef(0);
  const { camera, size } = useThree();
  const projected = useMemo(() => new Vector3(), []);

  const nodeMap = useMemo(() => new Map(HERO_NETWORK_NODES_3D.map((n) => [n.id, n])), []);

  /**
   * One material per node, not per tier — emissive intensity and opacity are
   * animated per node for the select/dim pass, so tier-shared materials would
   * make every node of a tier light up together.
   */
  const nodeMaterials = useMemo(
    () =>
      new Map(
        HERO_NETWORK_NODES_3D.map((n) => [n.id, createNodeMaterial(HERO_NETWORK_TIER_COLOR[n.tier])]),
      ),
    [],
  );

  useEffect(() => {
    const materials = [...nodeMaterials.values()];
    return () => materials.forEach((m) => m.dispose());
  }, [nodeMaterials]);

  const partnerIds = useMemo(() => new Set(selectedId ? getPartnerIds(selectedId) : []), [selectedId]);

  /**
   * Edges as real instanced geometry rather than `lineSegments`.
   *
   * WebGL ignores `linewidth` on virtually every platform, so line-based
   * edges are locked to one hairline pixel — they alias badly, thin out at
   * distance, and have no volume for bloom to catch. Thin cylinders are
   * actual geometry: they hold their weight at any DPR, and they glow.
   * Precomputed here because the layout is static — only the colors change
   * with selection, so the transforms never need recomputing.
   */
  const edgeInstances = useMemo(() => {
    const valid = HERO_NETWORK_EDGES.filter((e) => nodeMap.has(e.a) && nodeMap.has(e.b));
    const up = new Vector3(0, 1, 0);
    const from = new Vector3();
    const to = new Vector3();
    const dir = new Vector3();
    const quat = new Quaternion();

    return valid.map((e) => {
      const a = nodeMap.get(e.a)!;
      const b = nodeMap.get(e.b)!;
      from.set(...a.position);
      to.set(...b.position);
      dir.subVectors(to, from);
      const length = dir.length();
      quat.setFromUnitVectors(up, dir.clone().normalize());
      return {
        edge: e,
        position: from.clone().add(to).multiplyScalar(0.5).toArray() as [number, number, number],
        quaternion: quat.clone(),
        length,
      };
    });
  }, [nodeMap]);

  const edgeColors = useMemo(
    () =>
      edgeInstances.map(({ edge }) => {
        const isActive = selectedId !== null && (edge.a === selectedId || edge.b === selectedId);
        if (isActive) {
          const otherId = edge.a === selectedId ? edge.b : edge.a;
          const otherNode = nodeMap.get(otherId);
          if (otherNode) return new Color(HERO_NETWORK_TIER_COLOR[otherNode.tier]);
        }
        return selectedId !== null ? DIM_EDGE_COLOR : NEUTRAL_EDGE_COLOR;
      }),
    [edgeInstances, selectedId, nodeMap],
  );

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
        emissive: 0.18,
        opacity: 1,
      };
      const isSelected = n.id === selectedId;
      const isPartner = partnerIds.has(n.id);
      const isDimmed = selectedId !== null && !isSelected && !isPartner;
      const isHovered = n.id === hoveredId;

      // Lower across the board than the pre-bloom version: bloom multiplies
      // apparent brightness, so the old 0.65 idle drove every node past the
      // threshold and flattened them all to white.
      const emissiveTarget = isSelected ? 0.7 : isHovered ? 0.4 : isDimmed ? 0.04 : 0.18;
      const opacityTarget = isDimmed ? 0.22 : 1;

      const lerpFactor = Math.min(delta * 8, 1);
      state.emissive += (emissiveTarget - state.emissive) * lerpFactor;
      state.opacity += (opacityTarget - state.opacity) * lerpFactor;
      motion.current.set(n.id, state);

      const mat = nodeMaterials.get(n.id);
      if (mat) {
        mat.emissiveIntensity = state.emissive;
        mat.opacity = state.opacity;
        // Rim tracks the same curve, so a dimmed node loses its silhouette
        // highlight instead of staying crisply outlined while its body fades.
        const shader = (mat.userData as { shader?: { uniforms: Record<string, { value: unknown }> } })
          .shader;
        if (shader) shader.uniforms.uRimStrength.value = state.opacity * (isSelected ? 1.5 : 1);
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
      {edgeInstances.map((inst, i) => (
        <mesh
          key={`${inst.edge.a}::${inst.edge.b}`}
          position={inst.position}
          quaternion={inst.quaternion}
          geometry={edgeGeometry}
          scale={[1, inst.length, 1]}
          raycast={() => null}
        >
          <meshBasicMaterial
            color={edgeColors[i]}
            transparent
            opacity={0.42}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
      {HERO_NETWORK_NODES_3D.map((n) => {
        const visibleRadius = 0.14 + Math.min(n.degree, 6) * 0.02;
        return (
          <group key={n.id} position={n.position}>
            <mesh>
              {/* 32 segments, not 16: at this size a 16-segment sphere shows
                  a faceted silhouette once bloom lifts the rim. */}
              <sphereGeometry args={[visibleRadius, 32, 32]} />
              <primitive object={nodeMaterials.get(n.id)!} attach="material" />
            </mesh>
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
        // Capped at 1.5 rather than 2 now that bloom is in the pipeline:
        // UnrealBloomPass is a multi-pass blur over the full framebuffer, so
        // its cost scales with pixel count. 1.5 is ~44% fewer pixels than 2
        // and the difference is not visible on a scene this soft-edged.
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        // ACES filmic instead of linear: bright emissive cores roll off into
        // colour instead of clipping to flat white, which is what lets the
        // bloom read as light rather than as blown-out pixels.
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <HeroScenePostFX />
        {/* Dimmer than before: the environment map now carries most of the
            fill, and these only shape the highlights. */}
        <ambientLight intensity={0.25} />
        <pointLight position={[5, 5, 5]} intensity={45} />
        <pointLight position={[-5, -3, -5]} intensity={22} color="#22d3ee" />
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
