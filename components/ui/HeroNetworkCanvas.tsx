'use client';

import { useEffect, useRef } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
}

const NODE_COUNT = 48;
const CONNECTION_DIST = 140;
const COLORS = [187, 160, 270, 350];

/** Interactive particle network — longevity pathway visualization for hero backdrop */
export function HeroNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useMousePosition();
  const mouseRef = useRef(mouse);
  // Keep the latest mouse position in a ref for the animation loop to read,
  // without re-running the canvas effect. Writing in an effect (not during
  // render) satisfies React 19's "no ref mutation during render" rule.
  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let nodes: Node[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initNodes = () => {
      const rect = canvas.getBoundingClientRect();
      nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1.5 + Math.random() * 2,
        hue: COLORS[i % COLORS.length],
      }));
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { normalizedX, normalizedY } = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      const parallaxX = normalizedX * 18;
      const parallaxY = normalizedY * 12;

      if (!prefersReduced) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > w) node.vx *= -1;
          if (node.y < 0 || node.y > h) node.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x + parallaxX, a.y + parallaxY);
            ctx.lineTo(b.x + parallaxX, b.y + parallaxY);
            ctx.strokeStyle = `hsla(187, 85%, 53%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        const px = node.x + parallaxX;
        const py = node.y + parallaxY;
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, node.radius * 4);
        gradient.addColorStop(0, `hsla(${node.hue}, 80%, 60%, 0.9)`);
        gradient.addColorStop(1, `hsla(${node.hue}, 80%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, node.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.hue}, 90%, 65%, 0.85)`;
        ctx.fill();
      }

      if (!prefersReduced) {
        animationId = requestAnimationFrame(draw);
      }
    };

    resize();
    initNodes();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      initNodes();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-network-canvas"
      aria-hidden="true"
    />
  );
}
