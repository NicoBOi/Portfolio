"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectPanel from "./ProjectPanel";

const FEATURED = projects.filter((p) => p.featured);
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SCROLL_LOCK_MS = 850;

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  born: number;
}

const RIPPLE_DURATION = 1400;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const lastMoveRef = useRef({ x: 0, y: 0, t: 0 });

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

  // Wheel navigation
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
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = startY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      setIndex((i) =>
        delta > 0 ? (i + 1) % FEATURED.length : (i - 1 + FEATURED.length) % FEATURED.length
      );
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [openSlug]);

  // Water ripple canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      if (openSlug) return;
      const now = Date.now();
      const dx = e.clientX - lastMoveRef.current.x;
      const dy = e.clientY - lastMoveRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 60 && now - lastMoveRef.current.t > 90) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          r: 0,
          maxR: 90 + Math.random() * 50,
          born: now,
        });
        lastMoveRef.current = { x: e.clientX, y: e.clientY, t: now };
        if (ripplesRef.current.length > 14) ripplesRef.current.shift();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      ripplesRef.current = ripplesRef.current.filter((r) => now - r.born < RIPPLE_DURATION);
      for (const r of ripplesRef.current) {
        const p = (now - r.born) / RIPPLE_DURATION;
        const radius = r.maxR * Math.pow(p, 0.6);
        const alpha = 0.35 * (1 - p);
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
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

        {/* Background */}
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

        {/* Water ripple canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Foreground — pointer-events-none so clicks reach background */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.3, ease: SOFT }}
        >
          {/* Center — identity */}
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

          {/* Bottom — project navigation */}
          <motion.div
            className="px-6 md:px-10 pb-8 grid grid-cols-3 items-end gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {/* Prev */}
            <button onClick={goPrev} className="flex items-center gap-3 group text-left pointer-events-auto">
              <span className="block h-px bg-white transition-all duration-500 group-hover:opacity-80" style={{ width: 24, opacity: 0.3 }} />
              <span className="label text-white hidden md:inline transition-opacity duration-300 group-hover:opacity-60" style={{ opacity: 0.3 }}>
                {FEATURED[(index - 1 + FEATURED.length) % FEATURED.length].title}
              </span>
            </button>

            {/* Center */}
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

            {/* Next */}
            <button onClick={goNext} className="flex items-center gap-3 justify-end group text-right pointer-events-auto">
              <span className="label text-white hidden md:inline transition-opacity duration-300 group-hover:opacity-60" style={{ opacity: 0.3 }}>
                {FEATURED[(index + 1) % FEATURED.length].title}
              </span>
              <span className="block h-px bg-white transition-all duration-500 group-hover:opacity-80" style={{ width: 24, opacity: 0.3 }} />
            </button>
          </motion.div>
        </motion.div>

        {/* Vertical progress indicator */}
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
