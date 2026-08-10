import { Color, MeshPhysicalMaterial, type WebGLProgramParametersWithUniforms } from 'three';

/**
 * Material factories for the hero network's 3D scene.
 *
 * Kept out of the component so each node/edge material is constructed once
 * per tier rather than per React render, and so the shader injection below
 * has a single home instead of living inline in JSX.
 */

/**
 * A node body: physically-shaded so the scene's environment map produces real
 * specular response, plus an injected fresnel term that lifts the silhouette
 * edge. The fresnel is what stops a sphere reading as a flat disc once bloom
 * blows out its centre — the rim stays defined while the core blooms.
 */
export function createNodeMaterial(color: string): MeshPhysicalMaterial {
  const material = new MeshPhysicalMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.18,
    roughness: 0.22,
    metalness: 0.15,
    clearcoat: 0.85,
    clearcoatRoughness: 0.18,
    envMapIntensity: 0.7,
    transparent: true,
  });

  const rim = new Color(color);

  material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uRimColor = { value: rim };
    shader.uniforms.uRimStrength = { value: 1.0 };
    // Keep a handle so the scene can animate rim strength alongside the
    // node's other per-frame state.
    (material as MeshPhysicalMaterial & { userData: Record<string, unknown> }).userData.shader = shader;

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform vec3 uRimColor;
         uniform float uRimStrength;`,
      )
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
         // Fresnel: brightest where the surface turns away from the viewer.
         float rimFacing = 1.0 - saturate(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
         float rim = pow(rimFacing, 2.4) * uRimStrength;
         gl_FragColor.rgb += uRimColor * rim * 0.85;`,
      );
  };

  return material;
}

