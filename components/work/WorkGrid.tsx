"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { projects } from "@/data/projects";
import type { ProjectType } from "@/data/projects";
import FilterBar, { type Filter } from "./FilterBar";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WorkGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState(0);

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.type === (filter as ProjectType));

  useEffect(() => { setActive(0); }, [filter]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActive((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setActive((i) => Math.min(visible.length - 1, i + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible.length]);

  useEffect(() => {
    let sx = 0;
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      const dx = sx - e.changedTouches[0].clientX;
      if (Math.abs(dx) < 50) return;
      if (dx > 0) setActive((i) => Math.min(visible.length - 1, i + 1));
      else setActive((i) => Math.max(0, i - 1));
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [visible.length]);

  const current = visible[active];

  return (
    <div>
      {/* Filter bar */}
      <div className="px-6 md:px-10 pb-10 border-b border-white/10 flex items-center justify-between">
        <FilterBar active={filter} onChange={setFilter} />
        <span className="label text-white hidden md:block" style={{ opacity: 0.2 }}>
          {visible.length} projects
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="label text-white opacity-20 py-32 text-center">No projects</p>
      ) : (
        <>
          {/* 3D Carousel Stage */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "clamp(260px, 60vh, 640px)",
              perspective: "1400px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {visible.map((project, i) => {
              const offset = i - active;
              const absOffset = Math.abs(offset);
              if (absOffset > 2) return null;

              const isActive = absOffset === 0;
              const scale = isActive ? 1 : absOffset === 1 ? 0.82 : 0.62;
              const opacity = isActive ? 1 : absOffset === 1 ? 0.5 : 0.18;
              const rotateY = offset * -28;
              const tx = offset * 55;

              return (
                <div
                  key={project.slug}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "clamp(280px, 58vw, 900px)",
                    zIndex: 20 - absOffset,
                    transform: `translate(-50%, -50%) translateX(${tx}vw) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    transition:
                      "transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.75s cubic-bezier(0.16,1,0.3,1)",
                    cursor: !isActive ? "pointer" : "default",
                  }}
                  onClick={() => !isActive && setActive(i)}
                >
                  <div
                    className="relative aspect-video overflow-hidden"
                    style={{
                      backgroundColor: project.coverPlaceholder,
                      boxShadow: isActive
                        ? "0 40px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)"
                        : "0 20px 60px rgba(0,0,0,0.5)",
                    }}
                  >
                    {project.youtubeId ? (
                      <img
                        src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        style={{
                          filter: !isActive ? "brightness(0.35)" : "none",
                          transition: "filter 0.75s ease",
                        }}
                      />
                    ) : (
                      <div
                        className="placeholder-img text-white h-full"
                        style={{ opacity: isActive ? 0.1 : 0.04 }}
                      >
                        {project.type === "video" ? "Video" : "Image"}
                      </div>
                    )}

                    {isActive && project.type === "video" && (
                      <span
                        className="absolute top-4 right-4 label text-white z-10"
                        style={{ opacity: 0.4 }}
                      >▶</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Arrows */}
            <button
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center label text-white hover:opacity-80 transition-opacity duration-300"
              style={{ opacity: active > 0 ? 0.35 : 0.1 }}
              disabled={active === 0}
              aria-label="Previous"
            >←</button>
            <button
              onClick={() => setActive((i) => Math.min(visible.length - 1, i + 1))}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center label text-white hover:opacity-80 transition-opacity duration-300"
              style={{ opacity: active < visible.length - 1 ? 0.35 : 0.1 }}
              disabled={active === visible.length - 1}
              aria-label="Next"
            >→</button>
          </div>

          {/* Active card info */}
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.slug}
                className="text-center px-6 py-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: SOFT }}
              >
                <p className="label text-white mb-4" style={{ opacity: 0.22 }}>
                  {String(active + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
                </p>
                <h3
                  className="text-white title mb-4"
                  style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1 }}
                >
                  {current.title}
                </h3>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <span className="label text-white" style={{ opacity: 0.3 }}>{current.category}</span>
                  <span className="label text-white" style={{ opacity: 0.1 }}>·</span>
                  <span className="label text-white" style={{ opacity: 0.3 }}>{current.year}</span>
                </div>
                <Link
                  href={`/work/${current.slug}`}
                  className="label text-white inline-flex items-center gap-4 hover:opacity-80 transition-opacity duration-300"
                  style={{ opacity: 0.45 }}
                  data-cursor={current.type === "video" ? "Play" : "View"}
                >
                  <span className="block h-px bg-white" style={{ width: 24, opacity: 0.6 }} />
                  {current.type === "video" ? "Watch Film" : "View Series"}
                  <span className="block h-px bg-white" style={{ width: 24, opacity: 0.6 }} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 pb-16">
            {visible.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full bg-white transition-all duration-500"
                style={{
                  width: i === active ? 20 : 5,
                  height: 2,
                  opacity: i === active ? 0.55 : 0.18,
                }}
                aria-label={`Project ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
