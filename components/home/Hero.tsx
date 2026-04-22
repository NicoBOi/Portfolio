"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectPanel from "./ProjectPanel";

const FEATURED = projects.filter((p) => p.featured);
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SCROLL_LOCK_MS = 850;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  const openProject = openSlug ? (projects.find((p) => p.slug === openSlug) ?? null) : null;
  const current = FEATURED[index];

  // Fade-in
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Animate feTurbulence via RAF (SMIL <animate> doesn't work in React)
  useEffect(() => {
    let t = 0;
    const animate = () => {
      const el = document.getElementById("hero-turb") as SVGFETurbulenceElement | null;
      if (el) {
        t += 0.00018;
        const f1 = (0.014 + Math.sin(t) * 0.005).toFixed(4);
        const f2 = (0.009 + Math.cos(t * 1.4) * 0.006).toFixed(4);
        el.setAttribute("baseFrequency", `${f1} ${f2}`);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
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

  const goPrev = () => setIndex((i) => (i - 1 + FEATURED.length) % FEATURED.length);
  const goNext = () => setIndex((i) => (i + 1) % FEATURED.length);
  const handleNavigate = useCallback((slug: string) => setOpenSlug(slug), []);
  const handleClose = useCallback(() => setOpenSlug(null), []);

  return (
    <>
      <section className="relative h-screen bg-black overflow-hidden flex flex-col">

        {/* SVG distortion filter — animated via RAF */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
          style={{ mixBlendMode: "soft-light", opacity: 0.55 }}
        >
          <defs>
            <filter id="hero-warp" x="-8%" y="-8%" width="116%" height="116%">
              <feTurbulence
                id="hero-turb"
                type="fractalNoise"
                baseFrequency="0.014 0.009"
                numOctaves="2"
                seed="5"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="28"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <radialGradient id="hero-glow" cx="50%" cy="44%" r="62%">
              <stop offset="0%" stopColor="white" stopOpacity="0.28" />
              <stop offset="60%" stopColor="white" stopOpacity="0.08" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-glow)" filter="url(#hero-warp)" />
        </svg>

        {/* Background — click anywhere to open */}
        <div
          className="absolute inset-0 z-0"
          onClick={() => setOpenSlug(current.slug)}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={index}
              className="absolute inset-0 overflow-hidden"
              style={{ backgroundColor: current.coverPlaceholder }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: SOFT }}
            >
              {current.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&mute=1&loop=1&controls=0&disablekb=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&vq=hd1080&playlist=${current.youtubeId}`}
                  className="absolute border-0 pointer-events-none"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "100vw",
                    height: "56.25vw",
                    minHeight: "100%",
                    minWidth: "177.78vh",
                    transform: "translate(-50%, -50%)",
                  }}
                  allow="autoplay; encrypted-media"
                />
              ) : (
                <div className="placeholder-img text-white h-full">Image</div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dark overlay — just enough to read text */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

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
