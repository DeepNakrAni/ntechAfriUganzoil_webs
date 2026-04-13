import { useEffect, useRef } from 'react';

/**
 * ParticleField — Subtle floating particles on light background
 * Barely visible organic dots for texture
 */
export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let dpr = 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 25000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1 - 0.03,
          opacity: Math.random() * 0.15 + 0.03,
          isGreen: Math.random() > 0.35,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: Math.random() * 0.008 + 0.003,
        });
      }
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.phase) * 0.08;
        p.y += p.vy;
        p.phase += p.phaseSpeed;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const flicker = p.opacity * (0.6 + 0.4 * Math.sin(p.phase * 2));
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isGreen 
          ? `rgba(61, 122, 74, ${flicker})`
          : `rgba(212, 168, 67, ${flicker})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    const onResize = () => { resize(); initParticles(); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}
