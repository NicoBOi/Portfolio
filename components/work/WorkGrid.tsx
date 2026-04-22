"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { projects } from "@/data/projects";
import type { ProjectType } from "@/data/projects";
import FilterBar, { type Filter } from "./FilterBar";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WorkGrid() {
  const router = useRouter();
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

  // Horizontal scroll (trackpad swipe, shift+wheel) advances the carousel
  // without fighting the vertical page scroll. Accumulate deltaX so a gentle
  // trackpad swipe advances exactly one card instead of several.
  useEffect(() => {
    let acc = 0;
    let resetId: number | null = null;
    const STEP = 90;
    const COOLDOWN_AFTER_ADVANCE = 550;
    let lockedUntil = 0;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();

      const now = performance.now();
      if (now < lockedUntil) return;

      acc += e.deltaX;

      if (resetId !== null) window.clearTimeout(resetId);
      resetId = window.setTimeout(() => { acc = 0; resetId = null; }, 180);

      if (Math.abs(acc) >= STEP) {
        if (acc > 0) setActive((i) => Math.min(visible.length - 1, i + 1));
        else setActive((i) => Math.max(0, i - 1));
        acc = 0;
        lockedUntil = now + COOLDOWN_AFTER_ADVANCE;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (resetId !== null) window.clearTimeout(resetId);
    };
  }, [visible.length]);

  const current = visible[active];

  return (
    <div>
      {/* Filter bar */}
      <div className="px-6 md:px-10 pb-10 border-b border-white/10 flex items-center justify-between">
        <FilterBar active={filter} onChange={setFilter} />
        <span className="label text-white hidden md:block" style={{ opacity: 0.2 }}>
          {visible.length} projets
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="label text-white opacity-20 py-32 text-center">Aucun projet</p>
      ) : (
        <>
          {/* Horizontal glide carousel */}
          <div
            className="relative overflow-hidden"
            style={{ height: "clamp(260px, 60vh, 640px)" }}
          >
            {visible.map((project, i) => {
              const offset = i - active;
              const absOffset = Math.abs(offset);
              if (absOffset > 2) return null;

              const isActive = absOffset === 0;
              const scale = isActive ? 1 : 0.85;
              const opacity = isActive ? 1 : absOffset === 1 ? 0.45 : 0.15;
              const tx = offset * 60; // vw — side cards sit fully off-frame

              return (
                <motion.div
                  key={project.slug}
                  className="absolute top-1/2 left-1/2"
                  initial={false}
                  animate={{
                    x: `calc(-50% + ${tx}vw)`,
                    y: "-50%",
                    scale,
                    opacity,
                  }}
                  transition={{ type: "spring", stiffness: 140, damping: 26, mass: 0.9 }}
                  style={{
                    width: "clamp(280px, 56vw, 880px)",
                    zIndex: 20 - absOffset,
                    cursor: "pointer",
                    willChange: "transform, opacity",
                  }}
                  onClick={() => isActive ? router.push(`/work/${project.slug}`) : setActive(i)}
                  data-cursor={
                    isActive
                      ? (project.type === "video" ? "Lire" : "Voir")
                      : offset < 0
                        ? "← Précédent"
                        : "Suivant →"
                  }
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
                    {project.imageFiles && project.imageFiles.length > 0 ? (
                      <img
                        src={`/projects/${project.slug}/${project.imageFiles[0]}`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading={absOffset <= 1 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={isActive ? "high" : "low"}
                        style={{
                          filter: !isActive ? "brightness(0.35)" : "none",
                          transition: "filter 0.75s ease",
                        }}
                      />
                    ) : project.youtubeId ? (
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
                      <span className="absolute top-4 right-4 label text-white z-10" style={{ opacity: 0.4 }}>▶</span>
                    )}
                  </div>
                </motion.div>
              );
            })}

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
                <h3 className="text-white title mb-4" style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1 }}>
                  {current.title}
                </h3>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <span className="label text-white" style={{ opacity: 0.3 }}>{current.category}</span>
                  <span className="label text-white" style={{ opacity: 0.1 }}>·</span>
                  <span className="label text-white" style={{ opacity: 0.3 }}>{current.year}</span>
                </div>
                <Link
                  href={`/work/${current.slug}`}
                  className="label text-white inline-flex items-center gap-4 hover:opacity-100 transition-opacity duration-300"
                  style={{ opacity: 0.45 }}
                  data-cursor={current.type === "video" ? "Lire" : "Voir"}
                >
                  <span className="block h-px bg-white" style={{ width: 24, opacity: 0.6 }} />
                  {current.type === "video" ? "Voir le film" : "Voir la série"}
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
                style={{ width: i === active ? 20 : 5, height: 2, opacity: i === active ? 0.55 : 0.18 }}
                aria-label={`Projet ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
