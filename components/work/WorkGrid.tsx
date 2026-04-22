"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.type === (filter as ProjectType));

  useEffect(() => {
    setActive(0);
    stripRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [filter]);

  // Detect which card is closest to viewport center while scrolling
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let raf: number | null = null;
    const update = () => {
      raf = null;
      const rect = strip.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      setActive(bestIdx);
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    strip.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      strip.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [visible.length]);

  const scrollToIndex = useCallback((i: number, behavior: ScrollBehavior = "smooth") => {
    const card = cardRefs.current[i];
    const strip = stripRef.current;
    if (!card || !strip) return;
    const cardRect = card.getBoundingClientRect();
    const stripRect = strip.getBoundingClientRect();
    const target =
      strip.scrollLeft + (cardRect.left - stripRect.left) - (stripRect.width / 2 - cardRect.width / 2);
    strip.scrollTo({ left: target, behavior });
  }, []);

  // Keyboard ←/→
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollToIndex(Math.max(0, active - 1));
      if (e.key === "ArrowRight") scrollToIndex(Math.min(visible.length - 1, active + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, visible.length, scrollToIndex]);

  // Vertical wheel → translate to horizontal scroll on the strip when hovering it
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const onWheel = (e: WheelEvent) => {
      // If the user is intentionally scrolling vertically a lot, let the page scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) * 2 && Math.abs(e.deltaX) < 5) return;
      e.preventDefault();
      strip.scrollLeft += e.deltaX || e.deltaY;
    };
    strip.addEventListener("wheel", onWheel, { passive: false });
    return () => strip.removeEventListener("wheel", onWheel);
  }, []);

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
          {/* Filmstrip */}
          <div
            ref={stripRef}
            className="no-scrollbar flex items-center overflow-x-auto overflow-y-hidden"
            style={{
              height: "clamp(260px, 56vh, 600px)",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
            }}
          >
            {/* Leading spacer to allow first card to snap to center */}
            <div className="shrink-0" style={{ width: "calc(50vw - 14vw)" }} />

            {visible.map((project, i) => {
              const isActive = i === active;
              return (
                <div
                  key={project.slug}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="shrink-0 px-3 md:px-4"
                  style={{ scrollSnapAlign: "center" }}
                  onClick={() => {
                    if (isActive) router.push(`/work/${project.slug}`);
                    else scrollToIndex(i);
                  }}
                  data-cursor={
                    isActive
                      ? (project.type === "video" ? "Lire" : "Voir")
                      : project.title
                  }
                >
                  <motion.div
                    className="relative aspect-video overflow-hidden"
                    style={{
                      width: "clamp(240px, 28vw, 460px)",
                      backgroundColor: project.coverPlaceholder,
                      cursor: "pointer",
                    }}
                    animate={{
                      opacity: isActive ? 1 : 0.45,
                      scale: isActive ? 1 : 0.92,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 30, mass: 0.7 }}
                  >
                    {project.imageFiles && project.imageFiles.length > 0 ? (
                      <img
                        src={`/projects/${project.slug}/${project.imageFiles[0]}`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        fetchPriority={isActive ? "high" : "low"}
                      />
                    ) : project.youtubeId ? (
                      <img
                        src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="placeholder-img text-white h-full">
                        {project.type === "video" ? "Vidéo" : "Image"}
                      </div>
                    )}

                    {project.type === "video" && (
                      <span className="absolute top-3 right-3 label text-white z-10" style={{ opacity: 0.4 }}>▶</span>
                    )}
                  </motion.div>
                </div>
              );
            })}

            {/* Trailing spacer */}
            <div className="shrink-0" style={{ width: "calc(50vw - 14vw)" }} />
          </div>

          {/* Active info */}
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.slug}
                className="text-center px-6 py-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: SOFT }}
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
                onClick={() => scrollToIndex(i)}
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
