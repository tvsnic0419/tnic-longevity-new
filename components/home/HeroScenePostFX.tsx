'use client';

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PMREMGenerator, Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Real bloom + image-based lighting for the hero network.
 *
 * Both ship inside `three` itself (examples/jsm) — no @react-three/drei and
 * no @react-three/postprocessing, keeping the dependency surface exactly
 * where the team already had it.
 *
 * Bloom is what separates "emissive spheres" from "light sources": the glow
 * sprites underneath fake a halo at a fixed size, while bloom actually
 * bleeds a node's own brightness into the pixels around it, so a selected
 * node reads as genuinely luminous rather than as a ball with a decal.
 *
 * The environment map does the same job for the non-emissive half of the
 * material — without it, MeshPhysicalMaterial's clearcoat and low roughness
 * have nothing to reflect and the nodes read as flat plastic.
 */

// Tuned by eye against the live scene. The first pass (strength .62,
// threshold .22) blew every node to a white core inside one shared yellow
// haze — below the threshold nothing is excluded, so the bloom accumulated
// across the whole cluster and took the tier colours with it. A high
// threshold keeps bloom for the emissive cores only, and modest strength
// leaves the node's own hue dominant instead of washing it to white.
const BLOOM_STRENGTH = 0.26;
const BLOOM_RADIUS = 0.34;
const BLOOM_THRESHOLD = 0.85;

export function HeroScenePostFX() {
  const { gl, scene, camera, size } = useThree();

  // Image-based lighting from three's procedural room — no HDR asset to
  // download, generated once into a single cubemap.
  //
  // Attached declaratively below rather than assigned to `scene.environment`
  // here: `scene` comes from useThree, and the React Compiler lint correctly
  // refuses direct mutation of a hook's return value. `attach="environment"`
  // lets R3F own both the assignment and the detach on unmount.
  const envRT = useMemo(() => {
    const pmrem = new PMREMGenerator(gl);
    const target = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    return target;
  }, [gl]);

  useEffect(() => () => envRT.dispose(), [envRT]);

  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    // clearAlpha 0: the canvas is alpha:true and the hero's dotted backdrop
    // shows through behind the network. Compositing through a composer
    // otherwise clears to opaque black and turns the stage into a dark box.
    c.addPass(new RenderPass(scene, camera, null, undefined, 0));
    c.addPass(
      new UnrealBloomPass(
        new Vector2(size.width, size.height),
        BLOOM_STRENGTH,
        BLOOM_RADIUS,
        BLOOM_THRESHOLD,
      ),
    );
    // OutputPass applies the renderer's tone mapping and the sRGB conversion
    // that RenderPass skipped by drawing into a linear float target.
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera, size.width, size.height]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(gl.getPixelRatio());
  }, [composer, size.width, size.height, gl]);

  // Render targets are GPU memory; a homepage the user can navigate back to
  // would otherwise accumulate one composer's worth per mount.
  useEffect(() => () => composer.dispose(), [composer]);

  // priority >= 1 takes over the render loop from R3F's own automatic
  // render, so the scene is drawn exactly once — through the composer.
  useFrame(() => composer.render(), 1);

  // Deliberately only `environment`, never `background` — the canvas stays
  // transparent so the hero's own backdrop shows through behind the network.
  return <primitive attach="environment" object={envRT.texture} />;
}
