import { useEffect, useRef } from 'react';

/**
 * Full-bleed canvas of dots (adapted from tools.kasidit-wans.com). A slow wave
 * ripples through the grid; dots near the pointer light up amber and get pushed away.
 *
 * Perf: positions precomputed on resize, dots batched into alpha buckets,
 * ~30 fps cap, DPR 1.5 cap, paused off-screen / hidden tab, static under reduced motion.
 */
const GAP = 20;
const BUCKETS = 8;
const FRAME_MS = 1000 / 30;
const NEAR_R = 150;

export default function DotField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let w = 0;
    let h = 0;
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let fall = new Float32Array(0);
    let phase = new Float32Array(0);
    let raf = 0;
    let inView = true;
    let lastDraw = 0;
    const start = performance.now();
    const bucketX: number[][] = Array.from({ length: BUCKETS }, () => []);
    const bucketY: number[][] = Array.from({ length: BUCKETS }, () => []);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = w / 2;
      const cy = h * 0.42;
      const maxR = Math.hypot(w, h) * 0.55;
      const px: number[] = [];
      const py: number[] = [];
      const pf: number[] = [];
      const ph: number[] = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const f = 1 - Math.min(1, Math.hypot(x - cx, y - cy) / maxR);
          if (f <= 0.03) continue;
          px.push(x);
          py.push(y);
          pf.push(f);
          ph.push(x * 0.012 + y * 0.018);
        }
      }
      xs = Float32Array.from(px);
      ys = Float32Array.from(py);
      fall = Float32Array.from(pf);
      phase = Float32Array.from(ph);
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.25;
      pointer.y += (pointer.ty - pointer.y) * 0.25;
      ctx.clearRect(0, 0, w, h);
      for (let b = 0; b < BUCKETS; b++) {
        bucketX[b].length = 0;
        bucketY[b].length = 0;
      }

      const nearIdx: number[] = [];
      const r2 = NEAR_R * NEAR_R;
      for (let i = 0; i < xs.length; i++) {
        const dx = xs[i] - pointer.x;
        const dy = ys[i] - pointer.y;
        if (dx * dx + dy * dy < r2) {
          nearIdx.push(i);
          continue;
        }
        const wave = Math.sin(phase[i] - t * 1.1) * 0.5 + 0.5;
        const a = (0.08 + wave * 0.24) * fall[i];
        const b = Math.min(BUCKETS - 1, Math.floor((a / 0.32) * BUCKETS));
        bucketX[b].push(xs[i]);
        bucketY[b].push(ys[i]);
      }

      for (let b = 0; b < BUCKETS; b++) {
        const bx = bucketX[b];
        if (!bx.length) continue;
        const by = bucketY[b];
        ctx.fillStyle = `rgba(240,246,252,${(((b + 0.5) / BUCKETS) * 0.32).toFixed(3)})`;
        for (let k = 0; k < bx.length; k++) ctx.fillRect(bx[k] - 0.75, by[k] - 0.75, 1.5, 1.5);
      }

      // Dots near the pointer: amber, bigger, pushed outwards.
      for (const i of nearIdx) {
        const dx = xs[i] - pointer.x;
        const dy = ys[i] - pointer.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const near = 1 - d / NEAR_R;
        const x = xs[i] + (dx / d) * near * 10;
        const y = ys[i] + (dy / d) * near * 10;
        const s = 1.5 + near * 2.4;
        ctx.fillStyle = `rgba(${Math.round(240 + near * 5)},${Math.round(246 - near * 88)},${Math.round(252 - near * 241)},${(0.25 + near * 0.75).toFixed(2)})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    };

    const loop = (now: number) => {
      if (!inView || document.hidden || reduce) return;
      raf = requestAnimationFrame(loop);
      if (now - lastDraw < FRAME_MS) return;
      lastDraw = now;
      draw(now);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };
    const restart = () => {
      cancelAnimationFrame(raf);
      if (inView && !document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      restart();
    });
    const onVisibility = () => restart();
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        draw(performance.now());
      }, 120);
    };

    resize();
    draw(performance.now());
    io.observe(canvas);
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
