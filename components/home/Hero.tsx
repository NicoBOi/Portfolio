"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";

const FEATURED = projects.filter((p) => p.featured);
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % FEATURED.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + FEATURED.length) % FEATURED.length);
  const next = () => setIndex((i) => (i + 1) % FEATURED.length);
  const current = FEATURED[index];

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex flex-col">

      {/* ── Background — featured project ───────────── */}
      <div className="absolute inset-0 z-0">
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3, ease: SOFT }}
      >
        {/* Center block */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
          <motion.p
            className="label text-white"
            style={{ opacity: 0.5, letterSpacing: "0.35em" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: SOFT }}
          >
            Photographer — Filmmaker
          </motion.p>

          <motion.h1
            className="text-white font-light text-center leading-tight"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 6rem)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              marginRight: "-0.35em", // compensate last letter tracking
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: SOFT }}
          >
            Nicolas Sempere
          </motion.h1>

          <motion.p
            className="label text-white"
            style={{ opacity: 0.35, letterSpacing: "0.25em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Bordeaux — Paris
          </motion.p>
        </div>

        {/* ── Bottom — project navigation (Tao Tajima style) ── */}
        <motion.div
          className="px-6 md:px-10 pb-8 grid grid-cols-3 items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {/* Prev */}
          <button
            onClick={prev}
            className="flex items-center gap-3 group text-left"
          >
            <span className="label text-white opacity-40 group-hover:opacity-80 transition-opacity duration-300 flex items-center gap-3">
              <span className="block w-8 h-px bg-white opacity-40 group-hover:w-12 transition-all duration-500" />
              #{String(((index - 1 + FEATURED.length) % FEATURED.length) + 1).padStart(3, "0")}
            </span>
            <span className="hidden md:block label text-white opacity-30 group-hover:opacity-60 transition-opacity duration-300 italic font-light normal-case" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
              {FEATURED[(index - 1 + FEATURED.length) % FEATURED.length].title}
            </span>
          </button>

          {/* Center — current project info */}
          <div className="flex flex-col items-center gap-1">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.slug}
                className="label text-white text-center italic font-light normal-case"
                style={{ fontSize: 11, letterSpacing: "0.1em", opacity: 0.55 }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.55, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4, ease: SOFT }}
              >
                {current.title}
              </motion.p>
            </AnimatePresence>
            <Link
              href="/work"
              className="label text-white hover:opacity-80 transition-opacity duration-300"
              style={{ opacity: 0.35 }}
            >
              View All
            </Link>
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="flex items-center gap-3 justify-end group text-right"
          >
            <span className="hidden md:block label text-white opacity-30 group-hover:opacity-60 transition-opacity duration-300 italic font-light normal-case" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
              {FEATURED[(index + 1) % FEATURED.length].title}
            </span>
            <span className="label text-white opacity-40 group-hover:opacity-80 transition-opacity duration-300 flex items-center gap-3">
              #{String(((index + 1) % FEATURED.length) + 1).padStart(3, "0")}
              <span className="block w-8 h-px bg-white opacity-40 group-hover:w-12 transition-all duration-500" />
            </span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
