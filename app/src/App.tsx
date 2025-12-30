import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Torus from '../components/Torus';
import Mobius from '../components/Mobius';
import Klein from '../components/Klein';
import Projective from '../components/Projective';
import type { CirclePos } from '../components/parametrics';

type FundamentalSquareProps = { onPositionChange: (pos: CirclePos) => void };

function FundamentalSquare({ onPositionChange }: FundamentalSquareProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [circlePos, setCirclePos] = useState({ x: 75, y: 75 });
  const squareSize = 150;
  const circleRadius = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, squareSize, squareSize);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, squareSize, squareSize);

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(circlePos.x, circlePos.y, circleRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    onPositionChange({ u: circlePos.x / squareSize, v: circlePos.y / squareSize });
  }, [circlePos, onPositionChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.hypot(x - circlePos.x, y - circlePos.y);
    if (dist <= circleRadius) setIsDragging(true);
  }, [circlePos]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (x < 0) x = (squareSize + x) % squareSize;
    else if (x > squareSize) x %= squareSize;

    if (y < 0) y = (20 * squareSize + y) % squareSize;
    else if (y > squareSize) y = y % squareSize;

    setCirclePos({ x, y });
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    const onUp = () => setIsDragging(false);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 10, background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <p style={{ margin: 0, marginBottom: 12, fontWeight: 600, fontSize: 14, fontFamily: 'sans-serif' }}>Fundamental square</p>
      <canvas
        ref={canvasRef}
        width={squareSize}
        height={squareSize}
        onMouseDown={handleMouseDown}
        style={{ border: '2px solid black', borderRadius: 4, cursor: isDragging ? 'grabbing' : 'grab', display: 'block' }}
      />
    </div>
  );
}

export default function App() {
  const [circlePos, setCirclePos] = useState<CirclePos>({ u: 0.5, v: 0.5 });
  const [activeSurface, setActiveSurface] = useState<'torus' | 'mobius' | 'klein' | 'projective'>('torus');
  const [highlighterStyle, setHighlighterStyle] = useState<Record<string, string | number>>({});
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const surfaces = [
    { id: 'torus', label: 'Torus' },
    { id: 'mobius', label: 'Möbius Strip' },
    { id: 'klein', label: 'Klein Bottle' },
    { id: 'projective', label: 'Projective Plane' },
  ] as const;

  useEffect(() => {
    const btn = buttonRefs.current[activeSurface];
    const container = menuRef.current;
    if (!btn || !container) return;
    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setHighlighterStyle({ width: `${btnRect.width}px`, left: `${btnRect.left - containerRect.left}px` });
  }, [activeSurface]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', background: 'black' }}>
      <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: 'rgba(255,255,255,0.16)', padding: '8px 12px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
        <div ref={menuRef} style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
          <div style={{ position: 'absolute', background: 'white', borderRadius: 50, transition: 'all 0.3s ease', zIndex: 1, height: 'calc(100% - 8px)', top: 4, ...highlighterStyle }} />
          {surfaces.map((surface) => (
            <button
              key={surface.id}
              ref={(el) => (buttonRefs.current[surface.id] = el)}
              onClick={() => setActiveSurface(surface.id)}
              style={{ background: 'transparent', border: 'none', color: activeSurface === surface.id ? 'black' : 'rgba(255,255,255,0.6)', padding: '8px 20px', borderRadius: 50, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'color 0.3s ease', position: 'relative', zIndex: 2 }}
              onMouseEnter={(e) => { if (activeSurface !== surface.id) (e.currentTarget.style.color = 'rgba(255,255,255,0.9)'); }}
              onMouseLeave={(e) => { if (activeSurface !== surface.id) (e.currentTarget.style.color = 'rgba(255,255,255,0.6)'); }}
            >
              {surface.label}
            </button>
          ))}
        </div>
      </div>

      <FundamentalSquare onPositionChange={setCirclePos} />

      <Canvas camera={{ position: [5, 5, 5], fov: 75 }} gl={{ antialias: true }}>
        {activeSurface === 'torus' && <Torus circlePos={circlePos} />}
        {activeSurface === 'mobius' && <Mobius circlePos={circlePos} />}
        {activeSurface === 'klein' && <Klein circlePos={circlePos} />}
        {activeSurface === 'projective' && <Projective circlePos={circlePos} />}
      </Canvas>
    </div>
  );
}