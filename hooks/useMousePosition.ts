import { useState, useEffect } from 'react';

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = e.clientX / window.innerWidth;
      const normalizedY = e.clientY / window.innerHeight;
      setPosition({
        x: e.clientX,
        y: e.clientY,
        normalizedX,
        normalizedY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}
