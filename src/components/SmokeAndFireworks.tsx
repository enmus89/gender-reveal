import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

// iOS Safari chokes on a full-screen canvas full of large radial-gradient
// puffs combined with CSS blend modes and backdrop blur, so we scale the
// effect down hard on small screens and honour reduced-motion.
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isSmallScreen =
  typeof window !== 'undefined' &&
  (window.matchMedia('(max-width: 820px)').matches || 'ontouchstart' in window);

export const SmokeAndFireworks: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Confetti fireworks
  useEffect(() => {
    if (!active) return;

    const defaults = {
      origin: { y: 0.7 },
      colors: ['#2563EB', '#38BDF8', '#60A5FA', '#93C5FD', '#1D4ED8', '#F59E0B', '#FDE047'],
    };

    // Phones (esp. iOS Safari) crash/blank on sustained heavy confetti, so
    // they get one modest, safe volley and nothing more.
    if (prefersReducedMotion || isSmallScreen) {
      try {
        confetti({ ...defaults, particleCount: 70, spread: 70, startVelocity: 45 });
        confetti({ ...defaults, particleCount: 40, spread: 100, decay: 0.92, scalar: 0.9 });
      } catch {
        /* confetti is decorative — never let it break the reveal */
      }
      return;
    }

    const count = 200;
    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, shapes: ['circle'] });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // Sustained fountains, but bounded so the tab never bogs down over time.
    let bursts = 0;
    const interval = setInterval(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.75 },
        colors: ['#3B82F6', '#0284C7', '#60A5FA', '#38BDF8', '#E0F2FE'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.75 },
        colors: ['#1D4ED8', '#2563EB', '#93C5FD', '#7DD3FC', '#FBBF24'],
      });
      bursts += 1;
      if (bursts >= 7) clearInterval(interval);
    }, 1400);

    return () => clearInterval(interval);
  }, [active]);

  // Smoke canvas — desktop only. The full-screen canvas is what freezes phones.
  useEffect(() => {
    if (!active || prefersReducedMotion || isSmallScreen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cap the backing store so retina phones don't render 3x the pixels.
    const dpr = Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1 : 1.5);
    let animationFrameId: number;
    let cssWidth = window.innerWidth;
    let cssHeight = window.innerHeight;

    const applySize = () => {
      cssWidth = window.innerWidth;
      cssHeight = window.innerHeight;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    applySize();
    window.addEventListener('resize', applySize);

    const width = () => cssWidth;
    const height = () => cssHeight;

    const MAX_PARTICLES = isSmallScreen ? 34 : 110;
    const SEED = isSmallScreen ? 12 : 40;

    const particles: SmokeParticle[] = [];
    const blueColors = [
      'rgba(37, 99, 235,',
      'rgba(14, 165, 233,',
      'rgba(59, 130, 246,',
      'rgba(96, 165, 250,',
      'rgba(29, 78, 216,',
      'rgba(186, 230, 253,',
    ];

    function createParticle(x?: number, y?: number): SmokeParticle {
      const startX = x !== undefined ? x : Math.random() * width();
      const startY = y !== undefined ? y : height() + Math.random() * 40;
      const maxLife = 120 + Math.random() * 100;
      const color = blueColors[Math.floor(Math.random() * blueColors.length)];
      return {
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -(1.8 + Math.random() * 2.5),
        radius: 20 + Math.random() * 30,
        maxRadius: (isSmallScreen ? 70 : 100) + Math.random() * (isSmallScreen ? 70 : 120),
        alpha: 0.05,
        maxAlpha: 0.4 + Math.random() * 0.3,
        life: 0,
        maxLife,
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
      };
    }

    for (let i = 0; i < SEED; i++) {
      particles.push(createParticle(Math.random() * width(), height() - Math.random() * 300));
    }

    // Additive blending done inside the canvas is far cheaper on iOS than a
    // CSS mix-blend-mode on the element sitting above backdrop-blur layers.
    ctx.globalCompositeOperation = 'lighter';

    const render = () => {
      ctx.clearRect(0, 0, width(), height());

      if (particles.length < MAX_PARTICLES) {
        const origins = [width() * 0.15, width() * 0.5, width() * 0.85];
        origins.forEach((ox) => {
          if (Math.random() > 0.45) {
            particles.push(createParticle(ox + (Math.random() - 0.5) * 80, height() + 10));
          }
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx += (Math.random() - 0.5) * 0.1;

        const progress = p.life / p.maxLife;
        p.radius = p.radius + (p.maxRadius - p.radius) * 0.015;

        let currentAlpha = p.maxAlpha;
        if (progress < 0.2) {
          currentAlpha = (progress / 0.2) * p.maxAlpha;
        } else if (progress > 0.6) {
          currentAlpha = (1 - (progress - 0.6) / 0.4) * p.maxAlpha;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const gradient = ctx.createRadialGradient(0, 0, p.radius * 0.1, 0, 0, p.radius);
        gradient.addColorStop(0, `${p.color} ${currentAlpha})`);
        gradient.addColorStop(0.5, `${p.color} ${currentAlpha * 0.6})`);
        gradient.addColorStop(1, `${p.color} 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife || p.y < -p.radius * 2) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', applySize);
    };
  }, [active]);

  if (!active || prefersReducedMotion || isSmallScreen) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
