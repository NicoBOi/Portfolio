"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";

const FEATURED = projects;
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SCROLL_LOCK_MS = 1050;
const TITLE = "Nicolas Sempere";
const REPEL_RADIUS = 110;
const REPEL_STRENGTH = 50;

export default function Hero() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const current = FEATURED[index];

  // Fade-in
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Warm the browser cache for every featured image right after first paint
  // so wheel/swipe transitions don't stall on a network fetch.
  useEffect(() => {
    const t = setTimeout(() => {
      FEATURED.forEach((p) => {
        const first = p.imageFiles?.[0];
        if (first) {
          const img = new window.Image();
          img.decoding = "async";
          img.src = `/projects/${p.slug}/${first}`;
        }
      });
    }, 400);
    return () => clearTimeout(t);
  }, []);

  // Wheel
  useEffect(() => {
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
  }, []);

  // Touch swipe
  useEffect(() => {
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
  }, []);

  // Magnetic letter repulsion — direct DOM manipulation, no re-render, throttled to rAF
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { x, y } = mouseRef.current;
      letterRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const lx = rect.left + rect.width / 2;
        const ly = rect.top + rect.height / 2;
        const dx = x - lx;
        const dy = y - ly;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = 1 - dist / REPEL_RADIUS;
          const ox = -(dx / dist) * force * REPEL_STRENGTH;
          const oy = -(dy / dist) * force * (REPEL_STRENGTH * 0.55);
          el.style.transform = `translate(${ox}px, ${oy}px)`;
        } else {
          el.style.transform = "translate(0px, 0px)";
        }
      });
    });
  };

  const handleMouseLeave = () => {
    letterRefs.current.forEach((el) => {
      if (el) el.style.transform = "translate(0px, 0px)";
    });
  };

  const goPrev = () => setIndex((i) => (i - 1 + FEATURED.length) % FEATURED.length);
  const goNext = () => setIndex((i) => (i + 1) % FEATURED.length);

  return (
    <section
      className="relative h-screen bg-black overflow-hidden flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-suppress
    >

      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        onClick={() => router.push(`/work/${current.slug}`)}
        data-cursor={current.type === "video" ? "Lire" : "Voir"}
        data-cursor-silent
      >
          <AnimatePresence mode="sync">
            <motion.div
              key={index}
              className="absolute inset-0 overflow-hidden"
              style={{ backgroundColor: current.coverPlaceholder, willChange: "clip-path" }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              exit={{ clipPath: "inset(0 0 0 100%)" }}
              transition={{ duration: 1.0, ease: SOFT }}
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
              ) : current.imageFiles && current.imageFiles.length > 0 ? (
                <img
                  src={`/projects/${current.slug}/${current.imageFiles[0]}`}
                  alt={current.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <div className="placeholder-img text-white h-full">Image</div>
              )}
            </motion.div>
          </AnimatePresence>

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
              Photographe — Réalisateur
            </motion.p>

            {/* Magnetic title */}
            <motion.h1
              className="text-white title"
              style={{ fontSize: "clamp(2.5rem, 9vw, 11rem)" }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.62, ease: SOFT }}
            >
              {TITLE.split("").map((char, i) => (
                <span
                  key={i}
                  ref={(el) => { letterRefs.current[i] = el; }}
                  style={{
                    display: char === " " ? "inline" : "inline-block",
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {char === " " ? " " : char}
                </span>
              ))}
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
              <span className="label text-white hidden md:inline group-hover:opacity-100 transition-opacity duration-300" style={{ opacity: 0.3 }}>
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
            </div>

            <button onClick={goNext} className="flex items-center gap-3 justify-end group text-right pointer-events-auto">
              <span className="label text-white hidden md:inline group-hover:opacity-100 transition-opacity duration-300" style={{ opacity: 0.3 }}>
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

        {/* Scroll affordance — left middle */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none">
          <span
            className="label text-white"
            style={{
              opacity: 0.4,
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "0.32em",
            }}
          >
            Scroll
          </span>
          <div className="relative h-12 w-px bg-white/15 overflow-hidden">
            <motion.div
              className="absolute left-0 w-full bg-white"
              style={{ opacity: 0.7, height: 6 }}
              animate={{ y: [-8, 48] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
            />
          </div>
        </div>
    </section>
  );
}
