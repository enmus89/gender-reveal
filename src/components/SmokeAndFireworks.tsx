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

export const SmokeAndFireworks: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Confetti fireworks cannon effect
  useEffect(() => {
    if (!active) return;

    // Fire initial massive burst
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#2563EB', '#38BDF8', '#60A5FA', '#93C5FD', '#1D4ED8', '#F59E0B', '#FDE047'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      shapes: ['circle'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // Repeating fireworks fountains for sustained excitement
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
    }, 1400);

    return () => clearInterval(interval);
  }, [active]);

  // Smoke Canvas Simulation
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: SmokeParticle[] = [];
    const blueColors = [
      'rgba(37, 99, 235,',   // Royal Blue
      'rgba(14, 165, 233,',  // Sky Cyan
      'rgba(59, 130, 246,',  // Bright Blue
      'rgba(96, 165, 250,',  // Light Blue
      'rgba(29, 78, 216,',   // Deep Cobalt
      'rgba(186, 230, 253,', // Baby Blue mist
    ];

    function createParticle(x?: number, y?: number): SmokeParticle {
      const startX = x !== undefined ? x : Math.random() * width;
      const startY = y !== undefined ? y : height + Math.random() * 40;
      const maxLife = 120 + Math.random() * 100;
      const color = blueColors[Math.floor(Math.random() * blueColors.length)];

      return {
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -(1.8 + Math.random() * 2.5),
        radius: 20 + Math.random() * 30,
        maxRadius: 100 + Math.random() * 120,
        alpha: 0.05,
        maxAlpha: 0.45 + Math.random() * 0.35,
        life: 0,
        maxLife,
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
      };
    }

    // Seed initial smoke
    for (let i = 0; i < 40; i++) {
      particles.push(createParticle(Math.random() * width, height - Math.random() * 300));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn new particles from bottom plumes
      if (particles.length < 120) {
        // Spawn from left, center, right smoke canisters
        const origins = [width * 0.15, width * 0.5, width * 0.85, Math.random() * width];
        origins.forEach((ox) => {
          if (Math.random() > 0.3) {
            particles.push(createParticle(ox + (Math.random() - 0.5) * 80, height + 10));
          }
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx += (Math.random() - 0.5) * 0.1; // Gentle wind flutter

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

        // Soft radial gradient for natural billowy smoke puff
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
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
