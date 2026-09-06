import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  shade: number;
};

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.62, y: 0.28, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vert = `
      attribute vec2 a_pos;
      attribute float a_size;
      attribute float a_shade;
      varying float v_shade;
      void main() {
        v_shade = a_shade;
        gl_Position = vec4(a_pos, 0.0, 1.0);
        gl_PointSize = a_size;
      }
    `;
    const frag = `
      precision mediump float;
      varying float v_shade;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float d = dot(p, p);
        if (d > 1.0) discard;
        float glow = exp(-d * 3.2);
        vec3 cyan = vec3(0.18, 0.90, 0.84);
        vec3 ivory = vec3(0.91, 0.93, 0.91);
        vec3 col = mix(ivory, cyan, v_shade);
        gl_FragColor = vec4(col * glow, glow * 0.72);
      }
    `;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "a_pos");
    const sizeLoc = gl.getAttribLocation(program, "a_size");
    const shadeLoc = gl.getAttribLocation(program, "a_shade");

    const count = reduced
      ? 180
      : Math.min(3200, Math.floor((window.innerWidth * window.innerHeight) / 900));

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
      r: 1.4 + Math.random() * 3.4,
      shade: Math.random(),
    }));

    const pos = new Float32Array(count * 2);
    const size = new Float32Array(count);
    const shade = new Float32Array(count);

    const posBuf = gl.createBuffer();
    const sizeBuf = gl.createBuffer();
    const shadeBuf = gl.createBuffer();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    let w = 0;
    let h = 0;
    let running = true;
    let raf = 0;

    const resize = () => {
      const parent = canvas.parentElement ?? canvas;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onMove = (e: PointerEvent) => {
      if (!w || !h) return;
      pointer.current.x = e.clientX / w;
      pointer.current.y = e.clientY / h;
      pointer.current.active = true;
      document.documentElement.style.setProperty("--wash-x", `${pointer.current.x * 100}%`);
      document.documentElement.style.setProperty("--wash-y", `${pointer.current.y * 100}%`);
    };
    const onLeave = () => {
      pointer.current.active = false;
    };

    const tick = () => {
      if (!running) return;
      const mx = pointer.current.x * 2 - 1;
      const my = -(pointer.current.y * 2 - 1);
      const pull = pointer.current.active && !reduced ? 0.00135 : 0.00018;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.08;
        p.vx += (dx / dist) * pull;
        p.vy += (dy / dist) * pull;
        p.vx += (Math.random() - 0.5) * 0.00005;
        p.vy += (Math.random() - 0.5) * 0.00005;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -1.15) p.x = 1.12;
        if (p.x > 1.15) p.x = -1.12;
        if (p.y < -1.15) p.y = 1.12;
        if (p.y > 1.15) p.y = -1.12;
        pos[i * 2] = p.x;
        pos[i * 2 + 1] = p.y;
        size[i] = p.r * (window.devicePixelRatio > 1.4 ? 1.35 : 1);
        shade[i] = p.shade;
      }

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
      gl.bufferData(gl.ARRAY_BUFFER, size, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(sizeLoc);
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, shadeBuf);
      gl.bufferData(gl.ARRAY_BUFFER, shade, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(shadeLoc);
      gl.vertexAttribPointer(shadeLoc, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, count);
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
