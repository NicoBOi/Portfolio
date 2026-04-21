"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectPanel from "./ProjectPanel";

const FEATURED = projects.filter((p) => p.featured);
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const openProject = openSlug ? (projects.find((p) => p.slug === openSlug) ?? null) : null;

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-cycle pauses while panel is open
  useEffect(() => {
    if (openSlug) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % FEATURED.length), 5000);
    return () => clearInterval(t);
  }, [openSlug]);

  const goPrev = () => setIndex((i) => (i - 1 + FEATURED.length) % FEATURED.length);
  const goNext = () => setIndex((i) => (i + 1) % FEATURED.length);
  const current = FEATURED[index];

  const handleNavigate = useCallback((slug: string) => {
    setOpenSlug(slug);
  }, []);

  const handleClose = useCallback(() => {
    setOpenSlug(null);
  }, []);

  return (
    <>
      <section className="relative min-h-screen bg-black overflow-hidden flex flex-col">

        {/* Background — featured project color/image */}
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
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Foreground */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.3, ease: SOFT }}
        >
          {/* Center — identity */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
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
            {/* Prev featured */}
            <button
              onClick={goPrev}
              className="flex items-center gap-3 group text-left"
            >
              <span
                className="block h-px bg-white transition-all duration-500 group-hover:opacity-80"
                style={{ width: 24, opacity: 0.3 }}
              />
              <span
                className="label text-white hidden md:inline transition-opacity duration-300 group-hover:opacity-60"
                style={{ opacity: 0.3 }}
              >
                {FEATURED[(index - 1 + FEATURED.length) % FEATURED.length].title}
              </span>
            </button>

            {/* Center — current project, click to open panel */}
            <div className="flex flex-col items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.button
                  key={current.slug}
                  onClick={() => setOpenSlug(current.slug)}
                  className="flex flex-col items-center gap-1 group"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35, ease: SOFT }}
                  data-cursor="View"
                >
                  <span
                    className="text-white title group-hover:opacity-50 transition-opacity duration-300"
                    style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)", opacity: 0.65 }}
                  >
                    {current.title}
                  </span>
                  <span className="label text-white opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                    View ↑
                  </span>
                </motion.button>
              </AnimatePresence>

              <Link
                href="/work"
                className="label text-white hover:opacity-50 transition-opacity duration-300"
                style={{ opacity: 0.18, marginTop: 4 }}
              >
                All Works
              </Link>
            </div>

            {/* Next featured */}
            <button
              onClick={goNext}
              className="flex items-center gap-3 justify-end group text-right"
            >
              <span
                className="label text-white hidden md:inline transition-opacity duration-300 group-hover:opacity-60"
                style={{ opacity: 0.3 }}
              >
                {FEATURED[(index + 1) % FEATURED.length].title}
              </span>
              <span
                className="block h-px bg-white transition-all duration-500 group-hover:opacity-80"
                style={{ width: 24, opacity: 0.3 }}
              />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Project Panel — slides up over hero, no route change */}
      <ProjectPanel
        project={openProject}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    </>
  );
}
