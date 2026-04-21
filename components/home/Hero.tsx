"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";

const FEATURED = projects.filter((p) => p.featured);
const CIN: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Auto-cycle featured projects
  useEffect(() => {
    if (!revealed) return;
    const t = setInterval(() => setActive((i) => (i + 1) % FEATURED.length), 4000);
    return () => clearInterval(t);
  }, [revealed]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* ── FEATURED PROJECT — full-bleed background ─── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={active}
            className="absolute inset-0"
            style={{ backgroundColor: FEATURED[active].coverPlaceholder }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: SOFT }}
          >
            {/* Dark gradient so text stays legible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── LETTERBOX PANELS ─────────────────────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 z-40 pointer-events-none"
        style={{ top: "50%", height: 1, background: "#fff" }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 0.55, delay: 0.05, ease: CIN, times: [0, 0.6, 1] }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 bg-black z-30 pointer-events-none"
        style={{ height: "52%" }}
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1, delay: 0.45, ease: CIN, onComplete: () => setRevealed(true) }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 bg-black z-30 pointer-events-none"
        style={{ height: "52%" }}
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ duration: 1, delay: 0.45, ease: CIN }}
      />

      {/* ── CONTENT ──────────────────────────────────── */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col justify-between px-5 md:px-8 pt-14 pb-7"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Top — active project title */}
        <motion.div
          className="flex items-start justify-between pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              className="label text-white opacity-40"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.4, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4, ease: SOFT }}
            >
              {FEATURED[active].title} — {FEATURED[active].year}
            </motion.p>
          </AnimatePresence>

          <span className="label text-white opacity-20">
            {String(active + 1).padStart(2, "0")} / {String(FEATURED.length).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Center — dot navigation */}
        <div className="flex-1 flex items-center justify-end pr-1">
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {FEATURED.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="w-px transition-all duration-500"
                style={{
                  height: i === active ? 24 : 10,
                  background: i === active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
                }}
                aria-label={`Project ${i + 1}`}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom — identity + CTA */}
        <motion.div
          className="flex items-end justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          {/* Signature */}
          <div>
            <p className="font-display font-bold text-white leading-none"
              style={{ fontSize: "clamp(2rem, 5vw, 5rem)", letterSpacing: "-0.025em" }}>
              Nicolas Sempere
            </p>
            <p className="label text-white opacity-30 mt-2">
              Photographer &mdash; Filmmaker &mdash; Bordeaux / Paris
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/work"
            className="shrink-0 group flex items-center gap-3 label text-white opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            Explore Work
            <span
              className="block h-px bg-white w-6 transition-all duration-500 group-hover:w-14"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
