import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * HeroOilCanvas — Renders a beautiful avocado-to-oil animation on scroll
 * Shows an avocado being "squeezed" with golden oil dripping down
 */
export default function HeroOilCanvas({ progress }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const dripsRef = useRef([]);

  // Initialize particles (small floating dots representing oil molecules)
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.5 ? 45 : 95, // gold or green
      });
    }
    particlesRef.current = particles;

    // Initialize oil drips
    const drips = [];
    for (let i = 0; i < 12; i++) {
      drips.push({
        x: 0.35 + Math.random() * 0.3,
        y: -Math.random() * 0.3,
        width: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.3,
        length: Math.random() * 60 + 30,
        delay: Math.random() * 0.4,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    dripsRef.current = drips;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const p = progress; // 0 to 1

    // === STAGE 1: Avocado shape (0-0.3) ===
    if (p < 0.6) {
      const avocadoProgress = Math.min(p / 0.3, 1);
      const centerX = w / 2;
      const centerY = h * 0.4;
      const scale = 0.8 + avocadoProgress * 0.2;

      // Avocado outer shape
      const squeezeX = 1 + Math.max(0, (p - 0.15) / 0.15) * 0.15;
      const squeezeY = 1 - Math.max(0, (p - 0.15) / 0.15) * 0.1;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale * squeezeX, scale * squeezeY);

      // Avocado body (pear shape)
      const avSize = Math.min(w, h) * 0.18;
      
      // Outer skin gradient
      const skinGrad = ctx.createRadialGradient(0, 0, avSize * 0.1, 0, 0, avSize);
      skinGrad.addColorStop(0, 'rgba(86, 125, 70, 0.9)');
      skinGrad.addColorStop(0.5, 'rgba(59, 92, 46, 0.85)');
      skinGrad.addColorStop(0.8, 'rgba(42, 74, 31, 0.8)');
      skinGrad.addColorStop(1, 'rgba(29, 53, 20, 0.6)');

      ctx.beginPath();
      ctx.moveTo(0, -avSize * 1.3);
      ctx.bezierCurveTo(avSize * 0.4, -avSize * 1.3, avSize * 0.8, -avSize * 0.8, avSize * 0.9, -avSize * 0.2);
      ctx.bezierCurveTo(avSize * 1.0, avSize * 0.4, avSize * 0.8, avSize * 1.0, 0, avSize * 1.1);
      ctx.bezierCurveTo(-avSize * 0.8, avSize * 1.0, -avSize * 1.0, avSize * 0.4, -avSize * 0.9, -avSize * 0.2);
      ctx.bezierCurveTo(-avSize * 0.8, -avSize * 0.8, -avSize * 0.4, -avSize * 1.3, 0, -avSize * 1.3);
      ctx.closePath();
      ctx.fillStyle = skinGrad;
      ctx.fill();

      // Inner flesh (lighter green/yellow)
      const fleshSize = avSize * 0.75;
      const fleshGrad = ctx.createRadialGradient(0, avSize * 0.05, fleshSize * 0.1, 0, avSize * 0.05, fleshSize);
      fleshGrad.addColorStop(0, 'rgba(200, 210, 80, 0.7)');
      fleshGrad.addColorStop(0.5, 'rgba(160, 190, 60, 0.6)');
      fleshGrad.addColorStop(1, 'rgba(120, 160, 50, 0.4)');

      ctx.beginPath();
      ctx.moveTo(0, -fleshSize * 1.1);
      ctx.bezierCurveTo(fleshSize * 0.35, -fleshSize * 1.1, fleshSize * 0.7, -fleshSize * 0.6, fleshSize * 0.75, -fleshSize * 0.1);
      ctx.bezierCurveTo(fleshSize * 0.8, fleshSize * 0.35, fleshSize * 0.65, fleshSize * 0.85, 0, fleshSize * 0.9);
      ctx.bezierCurveTo(-fleshSize * 0.65, fleshSize * 0.85, -fleshSize * 0.8, fleshSize * 0.35, -fleshSize * 0.75, -fleshSize * 0.1);
      ctx.bezierCurveTo(-fleshSize * 0.7, -fleshSize * 0.6, -fleshSize * 0.35, -fleshSize * 1.1, 0, -fleshSize * 1.1);
      ctx.closePath();
      ctx.fillStyle = fleshGrad;
      ctx.fill();

      // Seed
      const seedSize = avSize * 0.3;
      const seedGrad = ctx.createRadialGradient(0, avSize * 0.05, 2, 0, avSize * 0.05, seedSize);
      seedGrad.addColorStop(0, 'rgba(140, 90, 50, 0.8)');
      seedGrad.addColorStop(0.7, 'rgba(107, 66, 38, 0.7)');
      seedGrad.addColorStop(1, 'rgba(80, 50, 25, 0.5)');

      ctx.beginPath();
      ctx.ellipse(0, avSize * 0.05, seedSize * 0.8, seedSize, 0, 0, Math.PI * 2);
      ctx.fillStyle = seedGrad;
      ctx.fill();

      // Seed highlight
      ctx.beginPath();
      ctx.ellipse(-seedSize * 0.2, -seedSize * 0.1, seedSize * 0.25, seedSize * 0.15, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180, 130, 70, 0.3)';
      ctx.fill();

      // Glow around avocado
      ctx.shadowColor = 'rgba(86, 125, 70, 0.3)';
      ctx.shadowBlur = 40;

      ctx.restore();
    }

    // === STAGE 2: Oil drips (0.2-0.8) ===
    if (p > 0.15) {
      const dripProgress = Math.min((p - 0.15) / 0.5, 1);
      const centerX = w / 2;
      const startY = h * 0.55;

      dripsRef.current.forEach((drip) => {
        const dp = Math.max(0, Math.min(1, (dripProgress - drip.delay) / (1 - drip.delay)));
        if (dp <= 0) return;

        const eased = dp * dp * (3 - 2 * dp); // smoothstep
        const x = centerX + (drip.x - 0.5) * w * 0.3;
        const y = startY + eased * h * 0.45;
        const len = drip.length * eased;

        // Oil drip trail
        const grad = ctx.createLinearGradient(x, y - len, x, y);
        grad.addColorStop(0, 'rgba(212, 168, 67, 0)');
        grad.addColorStop(0.3, `rgba(212, 168, 67, ${drip.opacity * 0.5 * dp})`);
        grad.addColorStop(1, `rgba(232, 200, 122, ${drip.opacity * dp})`);

        ctx.beginPath();
        ctx.moveTo(x - drip.width / 2, y - len);
        ctx.lineTo(x + drip.width / 2, y - len);
        ctx.lineTo(x + drip.width * 0.6, y);
        ctx.quadraticCurveTo(x, y + drip.width * 1.5, x - drip.width * 0.6, y);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Droplet at bottom
        if (dp > 0.3) {
          const dropSize = drip.width * 1.5 * Math.min(1, (dp - 0.3) / 0.3);
          ctx.beginPath();
          ctx.arc(x, y + dropSize * 0.5, dropSize, 0, Math.PI * 2);
          const dropGrad = ctx.createRadialGradient(x - dropSize * 0.3, y + dropSize * 0.2, 0, x, y + dropSize * 0.5, dropSize);
          dropGrad.addColorStop(0, `rgba(232, 200, 122, ${drip.opacity * dp})`);
          dropGrad.addColorStop(1, `rgba(212, 168, 67, ${drip.opacity * dp * 0.5})`);
          ctx.fillStyle = dropGrad;
          ctx.fill();
        }
      });
    }

    // === STAGE 3: Oil pool at bottom (0.5-1.0) ===
    if (p > 0.4) {
      const poolProgress = Math.min((p - 0.4) / 0.4, 1);
      const eased = poolProgress * poolProgress * (3 - 2 * poolProgress);
      const centerX = w / 2;
      const poolY = h * 0.88;
      const poolWidth = w * 0.35 * eased;
      const poolHeight = 15 * eased;

      // Pool glow
      const poolGlow = ctx.createRadialGradient(centerX, poolY, 0, centerX, poolY, poolWidth);
      poolGlow.addColorStop(0, `rgba(212, 168, 67, ${0.25 * eased})`);
      poolGlow.addColorStop(0.5, `rgba(201, 160, 48, ${0.15 * eased})`);
      poolGlow.addColorStop(1, 'rgba(201, 160, 48, 0)');
      ctx.fillStyle = poolGlow;
      ctx.fillRect(0, poolY - poolWidth * 0.5, w, poolWidth);

      // Pool shape
      const poolGrad = ctx.createRadialGradient(centerX, poolY, 0, centerX, poolY, poolWidth);
      poolGrad.addColorStop(0, `rgba(232, 200, 122, ${0.6 * eased})`);
      poolGrad.addColorStop(0.4, `rgba(212, 168, 67, ${0.4 * eased})`);
      poolGrad.addColorStop(1, 'rgba(201, 160, 48, 0)');

      ctx.beginPath();
      ctx.ellipse(centerX, poolY, poolWidth, poolHeight, 0, 0, Math.PI * 2);
      ctx.fillStyle = poolGrad;
      ctx.fill();

      // Highlight on pool
      const hlGrad = ctx.createRadialGradient(centerX - poolWidth * 0.2, poolY - poolHeight * 0.3, 0, centerX, poolY, poolWidth * 0.5);
      hlGrad.addColorStop(0, `rgba(255, 230, 150, ${0.3 * eased})`);
      hlGrad.addColorStop(1, 'rgba(255, 230, 150, 0)');
      ctx.beginPath();
      ctx.ellipse(centerX, poolY, poolWidth * 0.5, poolHeight * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = hlGrad;
      ctx.fill();
    }

    // === Floating particles (always) ===
    particlesRef.current.forEach((particle) => {
      const px = particle.x * w;
      const py = ((particle.y + p * particle.speedY) % 1.2) * h;
      const alpha = particle.opacity * (0.3 + p * 0.7);
      
      if (particle.hue === 45) {
        // Gold particle
        ctx.fillStyle = `rgba(212, 168, 67, ${alpha})`;
      } else {
        // Green particle
        ctx.fillStyle = `rgba(122, 182, 142, ${alpha * 0.6})`;
      }
      ctx.beginPath();
      ctx.arc(px, py, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }, [progress]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Render loop
  useEffect(() => {
    const render = () => {
      draw();
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 1,
        pointerEvents: 'none' 
      }} 
    />
  );
}
