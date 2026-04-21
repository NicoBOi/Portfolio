"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Cinematic ease — sharp entry, soft landing
const CIN: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-black overflow-hidden flex flex-col"
    >
      {/* ── LETTERBOX PANELS ──────────────────────────────────
          Two black bars open like a film aperture.
          They sit above all content, z-30.                   */}

      {/* Splice flash — the single white line that appears
          before the bars open, like a film leader splice     */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 z-40 pointer-events-none"
        style={{ top: "50%", height: 1, background: "#fff" }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 0.55, delay: 0.05, ease: CIN, times: [0, 0.6, 1] }}
      />

      {/* Top bar */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 bg-black z-30 pointer-events-none"
        style={{ height: "52%" }}
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1, delay: 0.45, ease: CIN }}
      />

      {/* Bottom bar */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 bg-black z-30 pointer-events-none"
        style={{ height: "52%" }}
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ duration: 1, delay: 0.45, ease: CIN }}
      />

      {/* ── CONTENT — already present, revealed by bars ───── */}
      <motion.div
        className="flex-1 flex flex-col justify-between px-5 md:px-8 pt-14 pb-7 relative z-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Corner index */}
        <motion.div
          className="flex justify-end pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          transition={{ duration: 0.4, delay: 1.6 }}
        >
          <span className="label text-white">— 01 —</span>
        </motion.div>

        {/* Name block */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Ghost number behind */}
          <span
            aria-hidden
            className="pointer-events-none select-none absolute right-0 bottom-0 font-display font-bold text-white"
            style={{
              fontSize: "clamp(14rem, 45vw, 52rem)",
              lineHeight: 0.78,
              opacity: 0.035,
              letterSpacing: "-0.04em",
            }}
          >
            NS
          </span>

          <motion.h1
            className="font-display font-bold text-white relative z-10"
            style={{
              fontSize: "clamp(3.5rem, 13vw, 13rem)",
              lineHeight: 0.87,
              letterSpacing: "-0.03em",
            }}
            initial={{ opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.35, ease: SOFT }}
          >
            Nicolas<br />Sempere
          </motion.h1>

          {/* Rule */}
          <motion.div
            className="h-px bg-white mt-7 md:mt-9"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ originX: 0, opacity: 0.18 }}
            transition={{ duration: 0.7, delay: 1.6, ease: CIN }}
          />

          {/* Discipline */}
          <motion.p
            className="label text-white mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ duration: 0.5, delay: 1.85 }}
          >
            Photographer &mdash; Filmmaker
          </motion.p>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="flex items-end justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.05 }}
        >
          <span className="label text-white opacity-25">
            Bordeaux &mdash; Paris
          </span>

          <Link
            href="/work"
            className="label text-white opacity-50 hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 group"
          >
            View Work
            <span className="block h-px bg-white w-6 group-hover:w-12 transition-all duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
