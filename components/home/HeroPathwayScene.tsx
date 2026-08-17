'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ACESFilmicToneMapping,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Mesh,
  type Points,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
} from 'three';
import {
  createNodeMaterial,
  createParticleMaterial,
  createRibbonMaterial,
} from '@/lib/hero-scene-materials';
import {
  FLOW_EDGES,
  FLOW_NODES,
  FLOW_NODE_BY_ID,
  getHighlight,
} from '@/lib/hero-pathways';
import { HeroScenePostFX } from './HeroScenePostFX';
import { HeroPathwayPanel } from './HeroPathwayPanel';

const PARTICLES_PER_EDGE = 6;

/** A quadratic curve bowed toward the camera, so a route arcs through depth. */
function edgeCurve(from: Vector3, to: Vector3): QuadraticBezierCurve3 {
  const mid = from.clone().add(to).multiplyScalar(0.5);
  mid.z += 0.9; // gentle bow toward camera — enough for depth, no overshoot
  return new QuadraticBezierCurve3(from, mid, to);
}

interface ParticleBinding {
  edgeIndex: number;
  t: number;
  speed: number;
}

/**
 * The flow content. Nothing rotates — a directed flow has a reading
 * direction, so motion is the particles streaming along the routes plus a
 * bounded parallax tilt (±~7°) that reads as depth, never as a spin.
 */
function Flow({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  pointerTarget,
  labelRefs,
}: {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  /** Read-only pointer position in [-1,1], written by the parent's handler. */
  pointerTarget: React.MutableRefObject<{ x: number; y: number }>;
  labelRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}) {
  const groupRef = useRef<Group>(null);
  const meshRefs = useRef(new Map<string, Mesh>());
  const pointsRef = useRef<Points | null>(null);
  const { camera, size } = useThree();
  const projected = useMemo(() => new Vector3(), []);
  const clock = useRef(0);
  // Local, mutable eased parallax — kept out of the prop ref so the compiler
  // immutability rule (no mutating props) is satisfied.
  const ease = useRef({ x: 0, y: 0 });

  const nodeMaterials = useMemo(
    () => new Map(FLOW_NODES.map((n) => [n.id, createNodeMaterial(n.color)])),
    [],
  );

  // Curves, ribbon geometries + materials, one per edge.
  const edges = useMemo(() => {
    return FLOW_EDGES.map((e) => {
      const a = FLOW_NODE_BY_ID.get(e.from)!;
      const b = FLOW_NODE_BY_ID.get(e.to)!;
      const curve = edgeCurve(new Vector3(...a.position), new Vector3(...b.position));
      const geometry = new TubeGeometry(curve, 26, 0.018, 7, false);
      const material = createRibbonMaterial(e.color);
      return { def: e, curve, geometry, material, color: new Color(e.color) };
    });
  }, []);

  // Particle system: a flat buffer, each particle bound to an edge.
  const { particleGeometry, particleMaterial, bindings } = useMemo(() => {
    const bindings: ParticleBinding[] = [];
    edges.forEach((_, edgeIndex) => {
      for (let k = 0; k < PARTICLES_PER_EDGE; k++) {
        // Deterministic jitter (a cheap hash of the two indices) rather than
        // Math.random — keeps this useMemo pure for the React compiler while
        // still varying particle speed so the streams don't march in lockstep.
        const h = Math.sin((edgeIndex + 1) * 12.9898 + (k + 1) * 78.233) * 43758.5453;
        const jitter = h - Math.floor(h);
        bindings.push({ edgeIndex, t: k / PARTICLES_PER_EDGE, speed: 0.12 + jitter * 0.05 });
      }
    });
    const positions = new Float32Array(bindings.length * 3);
    const colors = new Float32Array(bindings.length * 3);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    return { particleGeometry: geometry, particleMaterial: createParticleMaterial(), bindings };
  }, [edges]);

  // Per-edge lerped highlight amount (0 dim … 1 lit).
  const edgeAmt = useRef<Float32Array>(new Float32Array(edges.length).fill(1));

  useEffect(() => {
    return () => {
      nodeMaterials.forEach((m) => m.dispose());
      edges.forEach((e) => {
        e.geometry.dispose();
        e.material.dispose();
      });
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [nodeMaterials, edges, particleGeometry, particleMaterial]);

  useFrame((_, delta) => {
    clock.current += delta;
    const dt = Math.min(delta, 0.05);

    // Bounded parallax tilt — eases toward the pointer target, plus a slow
    // autonomous breath so it's alive even when the pointer is still.
    if (groupRef.current) {
      ease.current.x += (pointerTarget.current.x - ease.current.x) * Math.min(dt * 3, 1);
      ease.current.y += (pointerTarget.current.y - ease.current.y) * Math.min(dt * 3, 1);
      const breath = Math.sin(clock.current * 0.4) * 0.02;
      groupRef.current.rotation.y = ease.current.x * 0.12 + breath;
      groupRef.current.rotation.x = ease.current.y * 0.08;
    }

    const highlight = getHighlight(selectedId);
    const hasSelection = selectedId !== null;

    // Edge highlight + ribbon opacity + particle flow.
    const colorAttr = particleGeometry.getAttribute('color') as Float32BufferAttribute;
    const posAttr = particleGeometry.getAttribute('position') as Float32BufferAttribute;
    edges.forEach((e, i) => {
      const active = !hasSelection || highlight.edgeIds.has(e.def.id);
      const target = active ? 1 : 0.1;
      edgeAmt.current[i] += (target - edgeAmt.current[i]) * Math.min(dt * 6, 1);
      const amt = edgeAmt.current[i];
      e.material.opacity = 0.05 + amt * (hasSelection ? 0.5 : 0.24);
    });

    bindings.forEach((p, idx) => {
      const e = edges[p.edgeIndex];
      const amt = edgeAmt.current[p.edgeIndex];
      p.t += p.speed * dt * (0.6 + amt * 0.9);
      if (p.t > 1) p.t -= 1;
      e.curve.getPoint(p.t, projected);
      posAttr.setXYZ(idx, projected.x, projected.y, projected.z);
      const b = 0.15 + amt * 0.95;
      colorAttr.setXYZ(idx, e.color.r * b, e.color.g * b, e.color.b * b);
    });
    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    // Nodes: emissive + opacity + rim toward selection state, and project
    // each one's world position onto its HTML label.
    for (const n of FLOW_NODES) {
      const mesh = meshRefs.current.get(n.id);
      const mat = nodeMaterials.get(n.id);
      if (!mesh || !mat) continue;
      const isSelected = n.id === selectedId;
      const isHovered = n.id === hoveredId;
      const active = !hasSelection || highlight.nodeIds.has(n.id);
      const base = n.kind === 'molecule' ? 0.5 : 0.12;
      const emissiveTarget = isSelected ? 1.2 : isHovered ? 0.7 : active ? base : 0.03;
      const opacityTarget = active ? 1 : 0.22;
      mat.emissiveIntensity += (emissiveTarget - mat.emissiveIntensity) * Math.min(dt * 8, 1);
      mat.opacity += (opacityTarget - mat.opacity) * Math.min(dt * 8, 1);
      const shader = (mat.userData as { shader?: { uniforms: Record<string, { value: number }> } }).shader;
      if (shader) shader.uniforms.uRimStrength.value = mat.opacity * (isSelected ? 1.6 : 1);

      const label = labelRefs.current.get(n.id);
      if (label) {
        mesh.getWorldPosition(projected);
        projected.project(camera);
        const x = (projected.x * 0.5 + 0.5) * size.width;
        const y = (-projected.y * 0.5 + 0.5) * size.height;
        // Offsets clear the node's rendered radius (plus its glow) so a label
        // never sits on top of its bead. Molecule labels ride above the hub.
        let px = 0;
        let py = 0;
        let anchor = 'translate(-50%,-50%)';
        if (n.kind === 'compound') {
          px = -26;
          anchor = 'translate(-100%,-50%)';
        } else if (n.kind === 'hallmark') {
          px = 26;
          anchor = 'translate(0,-50%)';
        } else {
          py = -30;
          anchor = 'translate(-50%,-100%)';
        }
        label.style.transform = `translate(${x + px}px, ${y + py}px) ${anchor}`;
        label.style.opacity = String(active ? (isSelected || isHovered ? 1 : 0.72) : 0.16);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {edges.map((e) => (
        <mesh key={e.def.id} geometry={e.geometry} material={e.material} raycast={() => null} />
      ))}
      <points ref={pointsRef} geometry={particleGeometry} material={particleMaterial} />
      {FLOW_NODES.map((n) => {
        const r = n.kind === 'molecule' ? 0.3 : 0.11;
        return (
          <group key={n.id} position={n.position}>
            <mesh
              ref={(m) => {
                if (m) meshRefs.current.set(n.id, m);
                else meshRefs.current.delete(n.id);
              }}
              onPointerOver={(ev) => {
                ev.stopPropagation();
                onHover(n.id);
              }}
              onPointerOut={(ev) => {
                ev.stopPropagation();
                onHover(null);
              }}
              onClick={(ev) => {
                ev.stopPropagation();
                onSelect(n.id === selectedId ? null : n.id);
              }}
            >
              <sphereGeometry args={[r, 28, 28]} />
              <primitive object={nodeMaterials.get(n.id)!} attach="material" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Homepage hero Pathway Flow — a directed mechanism map (compound → molecule
 * → hallmark of aging), rendered in real depth. Only ever mounted client-side
 * via HeroSceneMount's dynamic(ssr:false) import once WebGL/motion/viewport
 * eligibility is confirmed; everyone else sees the SVG poster fallback, which
 * carries the same flow as real links.
 */
export function HeroPathwayScene() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const labelRefs = useRef(new Map<string, HTMLDivElement>());

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerTarget.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerTarget.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  };
  const onPointerLeave = () => {
    pointerTarget.current.x = 0;
    pointerTarget.current.y = 0;
  };

  return (
    <div className="relative h-full w-full" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <Canvas
        camera={{ position: [0, 0, 9.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <HeroScenePostFX />
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 6]} intensity={40} />
        <pointLight position={[-5, -2, 2]} intensity={18} color="#22d3ee" />
        <fog attach="fog" args={['#020811', 10, 18]} />
        <Flow
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          pointerTarget={pointerTarget}
          labelRefs={labelRefs}
        />
      </Canvas>

      {/* Projected HTML labels — crisp text the canvas can't match, kept
          readable because the scene never rotates. Positioned per frame by
          Flow via labelRefs. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {FLOW_NODES.map((n) => (
          <div
            key={n.id}
            ref={(el) => {
              if (el) labelRefs.current.set(n.id, el);
              else labelRefs.current.delete(n.id);
            }}
            className={
              'absolute left-0 top-0 whitespace-nowrap text-caption font-medium ' +
              (n.kind === 'molecule' ? 'font-semibold tracking-wide' : 'text-white/80')
            }
            style={{ color: n.kind === 'molecule' ? n.color : undefined, opacity: 0 }}
          >
            {n.label}
          </div>
        ))}
      </div>

      <HeroPathwayPanel selectedId={selectedId} onSelect={setSelectedId} onClose={() => setSelectedId(null)} />

      {/* Keyboard/screen-reader path: canvas meshes aren't tabbable, so every
          selectable node gets a real, visually-hidden button driving the same
          selection state. */}
      <div className="sr-only">
        {FLOW_NODES.map((n) => (
          <button key={n.id} type="button" onClick={() => setSelectedId(n.id === selectedId ? null : n.id)}>
            {n.kind === 'compound' ? 'Compound' : n.kind === 'hallmark' ? 'Hallmark' : 'Pathway'}: {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
