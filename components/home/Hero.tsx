"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectPanel from "./ProjectPanel";

const FEATURED = projects.filter((p) => p.featured);
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SCROLL_LOCK_MS = 850;

// ── Water simulation constants ──────────────────────────────────
const W = 320;
const H = 180;
const DAMP = 0.987;
// Light direction (upper-left) — normalised once
const _lx = -0.25, _ly = -0.6, _lz = 2.8;
const _ll = Math.sqrt(_lx * _lx + _ly * _ly + _lz * _lz);
const LXN = _lx / _ll, LYN = _ly / _ll, LZN = _lz / _ll;
const NZ = 4.0; // controls how "flat" the water surface appears

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Stable refs for the water sim (survive re-renders, keep wave state on panel close)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waterRef = useRef({
    buf1: new Float32Array(W * H),
    buf2: new Float32Array(W * H),
  });
  const rafRef = useRef(0);

  const openProject = openSlug ? (projects.find((p) => p.slug === openSlug) ?? null) : null;
  const current = FEATURED[index];

  // Fade-in
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-cycle
  useEffect(() => {
    if (openSlug) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % FEATURED.length), 5000);
    return () => clearInterval(t);
  }, [openSlug]);

  // Wheel
  useEffect(() => {
    if (openSlug) return;
    let locked = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (locked || Math.abs(e.deltaY) < 8) return;
      locked = true;
      setIndex((i) =>
        e.deltaY > 0 ? (i + 1) % FEATURED.length : (i - 1 + FEATURED.length) % FEATURED.length
      );
      setTimeout(() => { locked = false; }, SCROLL_LOCK_MS);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [openSlug]);

  // Touch swipe
  useEffect(() => {
    if (openSlug) return;
    let sy = 0;
    const ts = (e: TouchEvent) => { sy = e.touches[0].clientY; };
    const te = (e: TouchEvent) => {
      const d = sy - e.changedTouches[0].clientY;
      if (Math.abs(d) < 50) return;
      setIndex((i) => d > 0 ? (i + 1) % FEATURED.length : (i - 1 + FEATURED.length) % FEATURED.length);
    };
    window.addEventListener("touchstart", ts, { passive: true });
    window.addEventListener("touchend", te, { passive: true });
    return () => { window.removeEventListener("touchstart", ts); window.removeEventListener("touchend", te); };
  }, [openSlug]);

  // ── Water height-field simulation ────────────────────────────
  useEffect(() => {
    if (openSlug) return; // pause sim while panel is open

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const water = waterRef.current;
    const imgData = ctx.createImageData(W, H);
    const px = imgData.data;

    const disturb = (screenX: number, screenY: number) => {
      const sx = Math.floor((screenX / window.innerWidth) * W);
      const sy = Math.floor((screenY / window.innerHeight) * H);
      const r = 7, r2 = r * r;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          const px2 = sx + dx, py = sy + dy;
          if (px2 < 1 || px2 >= W - 1 || py < 1 || py >= H - 1) continue;
          water.buf1[py * W + px2] += -280 * (1 - d2 / r2);
        }
      }
    };

    let prevX = 0, prevY = 0, prevT = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dx = e.clientX - prevX, dy = e.clientY - prevY;
      if (dx * dx + dy * dy > 600 && now - prevT > 40) {
        disturb(e.clientX, e.clientY);
        prevX = e.clientX; prevY = e.clientY; prevT = now;
      }
    };

    const tick = () => {
      const { buf1, buf2 } = water;

      // Wave propagation
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const i = y * W + x;
          buf2[i] = (buf1[i - 1] + buf1[i + 1] + buf1[i - W] + buf1[i + W]) * 0.5 - buf2[i];
          buf2[i] *= DAMP;
        }
      }
      water.buf1 = buf2;
      water.buf2 = buf1;

      // Specular caustic rendering
      const b = water.buf1;
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const i = y * W + x;
          // Surface normal from finite differences
          const nx = b[i + 1] - b[i - 1];
          const ny = b[i + W] - b[i - W];
          const len = Math.sqrt(nx * nx + ny * ny + NZ * NZ);
          // Phong specular: N·L
          const ndotl = (nx * LXN + ny * LYN + NZ * LZN) / len;
          const spec = Math.max(0, ndotl);
          // Power 5 = sharp caustic highlights
          const bright = spec * spec * spec * spec * spec * 255 * 2.2;
          const v = bright > 255 ? 255 : bright | 0;
          const base = i * 4;
          px[base] = v;
          px[base + 1] = v;
          px[base + 2] = v;
          px[base + 3] = v;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [openSlug]);

  const goPrev = () => setIndex((i) => (i - 1 + FEATURED.length) % FEATURED.length);
  const goNext = () => setIndex((i) => (i + 1) % FEATURED.length);
  const handleNavigate = useCallback((slug: string) => setOpenSlug(slug), []);
  const handleClose = useCallback(() => setOpenSlug(null), []);

  return (
    <>
      <section className="relative h-screen bg-black overflow-hidden flex flex-col">

        {/* Background — click anywhere to open */}
        <div
          className="absolute inset-0 z-0"
          onClick={() => setOpenSlug(current.slug)}
          data-cursor="View"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={index}
              className="absolute inset-0"
              style={{ backgroundColor: current.coverPlaceholder }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: SOFT }}
            >
              <div className="placeholder-img text-white h-full">Image</div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Water caustic canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            width: "100%",
            height: "100%",
            mixBlendMode: "screen",
            opacity: 0.55,
            filter: "blur(2px)",
          }}
        />

        {/* Foreground */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.3, ease: SOFT }}
        >
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            <motion.p
              className="label text-white"
              style={{ opacity: 0.4, letterSpacing: "0.32em" }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: SOFT }}
            >
              Photographer — Filmmaker
            </motion.p>

            <motion.h1
              className="text-white title"
              style={{ fontSize: "clamp(2.5rem, 9vw, 11rem)" }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.62, ease: SOFT }}
            >
              Nicolas Sempere
            </motion.h1>

            <motion.p
              className="label text-white"
              style={{ opacity: 0.28, letterSpacing: "0.22em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.28 }}
              transition={{ duration: 0.8, delay: 0.92 }}
            >
              Bordeaux — Paris
            </motion.p>
          </div>

          {/* Bottom nav */}
          <motion.div
            className="px-6 md:px-10 pb-8 grid grid-cols-3 items-end gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <button onClick={goPrev} className="flex items-center gap-3 group text-left pointer-events-auto">
              <span className="block h-px bg-white group-hover:opacity-80 transition-all duration-500" style={{ width: 24, opacity: 0.3 }} />
              <span className="label text-white hidden md:inline group-hover:opacity-60 transition-opacity duration-300" style={{ opacity: 0.3 }}>
                {FEATURED[(index - 1 + FEATURED.length) % FEATURED.length].title}
              </span>
            </button>

            <div className="flex flex-col items-center gap-2 pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  className="flex flex-col items-center gap-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35, ease: SOFT }}
                >
                  <span className="text-white title" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)", opacity: 0.55 }}>
                    {current.title}
                  </span>
                  <span className="label text-white" style={{ opacity: 0.25 }}>
                    {String(index + 1).padStart(2, "0")} / {String(FEATURED.length).padStart(2, "0")}
                  </span>
                </motion.div>
              </AnimatePresence>
              <Link href="/work" className="label text-white hover:opacity-50 transition-opacity duration-300" style={{ opacity: 0.18, marginTop: 4 }}>
                All Works
              </Link>
            </div>

            <button onClick={goNext} className="flex items-center gap-3 justify-end group text-right pointer-events-auto">
              <span className="label text-white hidden md:inline group-hover:opacity-60 transition-opacity duration-300" style={{ opacity: 0.3 }}>
                {FEATURED[(index + 1) % FEATURED.length].title}
              </span>
              <span className="block h-px bg-white group-hover:opacity-80 transition-all duration-500" style={{ width: 24, opacity: 0.3 }} />
            </button>
          </motion.div>
        </motion.div>

        {/* Vertical progress */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 items-center pointer-events-none">
          {FEATURED.map((_, i) => (
            <div
              key={i}
              className="w-px rounded-full bg-white transition-all duration-500"
              style={{ height: i === index ? 24 : 8, opacity: i === index ? 0.65 : 0.2 }}
            />
          ))}
        </div>
      </section>

      <ProjectPanel project={openProject} onClose={handleClose} onNavigate={handleNavigate} />
    </>
  );
}
