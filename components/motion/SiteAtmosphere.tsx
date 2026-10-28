"use client";

import { useEffect, useRef } from "react";
import { useLowEndDevice } from "@/components/motion/useLowEndDevice";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

type Dust = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  tone: number;
};

const MAX_DUST = 55;

/** Fixed soil grain + cursor dust — pointer-events none, respects reduced motion / low-end. */
export function SiteAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const lowEnd = useLowEndDevice();
  const dustOff = reduced || lowEnd;

  useEffect(() => {
    if (dustOff) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cancelled = false;
    const particles: Dust[] = [];
    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999 };
    let lastSpawn = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, speed: number) => {
      if (particles.length >= MAX_DUST) particles.shift();
      const ang = Math.random() * Math.PI * 2;
      const burst = 0.15 + speed * 0.45;
      particles.push({
        x,
        y,
        vx: Math.cos(ang) * burst + (x - mouse.px) * 0.02,
        vy: Math.sin(ang) * burst * 0.6 - 0.12 - Math.random() * 0.25,
        life: 0,
        max: 40 + Math.random() * 50,
        size: 0.6 + Math.random() * 1.8,
        tone: Math.random(),
      });
    };

    const onMove = (e: PointerEvent) => {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const dx = mouse.x - mouse.px;
      const dy = mouse.y - mouse.py;
      const speed = Math.min(18, Math.hypot(dx, dy));
      const now = performance.now();
      if (speed < 1.2 || now - lastSpawn < 28) return;
      lastSpawn = now;
      const n = speed > 8 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        spawn(
          mouse.x + (Math.random() - 0.5) * 10,
          mouse.y + (Math.random() - 0.5) * 10,
          speed,
        );
      }
    };

    const tick = () => {
      if (cancelled) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.012;
        p.vx *= 0.985;
        if (p.life >= p.max) {
          particles.splice(i, 1);
          continue;
        }
        const t = p.life / p.max;
        const alpha = (1 - t) * 0.45;
        // Soil tones: sand → clay → dark earth
        const r = Math.floor(140 + p.tone * 50);
        const g = Math.floor(110 + p.tone * 30);
        const b = Math.floor(70 + p.tone * 20);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.35), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [dustOff]);

  return (
    <>
      <div className="site-grain" aria-hidden />
      {dustOff ? null : (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-[90]"
          aria-hidden
        />
      )}
    </>
  );
}
