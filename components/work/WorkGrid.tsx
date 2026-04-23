"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import type { ProjectType } from "@/data/projects";
import FilterBar, { type Filter } from "./FilterBar";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SWIPE_THRESHOLD = 40; // px

export default function WorkGrid() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState(0);
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.type === (filter as ProjectType));

  useEffect(() => { setActive(0); }, [filter]);

  const current = visible[active];

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, t: performance.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    if (!start) return;
    const end = e.changedTouches[0];
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    touchRef.current = null;
    // ignore vertical swipes — let the page scroll
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) setActive((i) => Math.min(visible.length - 1, i + 1));
    else setActive((i) => Math.max(0, i - 1));
  };

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
        <div className="flex flex-col md:flex-row border-b border-white/10 md:min-h-[78vh]">
          {/* Left — image (sticky on mobile so it stays visible while the index scrolls) */}
          <div
            className="md:w-3/5 relative bg-black overflow-hidden order-1 md:order-1 aspect-[4/3] md:aspect-auto md:h-auto sticky top-14 md:static z-10 touch-pan-y"
            style={{ minHeight: 0 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.slug}
                  className="absolute inset-0"
                  style={{ backgroundColor: current.coverPlaceholder }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: SOFT }}
                  onClick={() => router.push(`/work/${current.slug}`)}
                  data-cursor={current.type === "video" ? "Lire" : "Voir"}
                  data-cursor-silent
                >
                  {current.imageFiles && current.imageFiles.length > 0 ? (
                    <img
                      src={`/projects/${current.slug}/${current.imageFiles[0]}`}
                      alt={current.title}
                      className="w-full h-full object-cover cursor-pointer"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  ) : current.youtubeId ? (
                    <img
                      src={`https://img.youtube.com/vi/${current.youtubeId}/maxresdefault.jpg`}
                      alt={current.title}
                      className="w-full h-full object-cover cursor-pointer"
                      decoding="async"
                    />
                  ) : (
                    <div className="placeholder-img text-white h-full">
                      {current.type === "video" ? "Vidéo" : "Image"}
                    </div>
                  )}

                  {/* Bottom-left meta overlay */}
                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                    <p className="label text-white mb-2" style={{ opacity: 0.5, mixBlendMode: "difference" }}>
                      {String(active + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
                    </p>
                    <h2
                      className="text-white title"
                      style={{ fontSize: "clamp(1.6rem, 3.2vw, 3rem)", lineHeight: 1, mixBlendMode: "difference" }}
                    >
                      {current.title}
                    </h2>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — index list */}
          <div className="md:w-2/5 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-10 md:py-16 order-2 md:order-2">
            <p className="label text-white mb-8 md:mb-10" style={{ opacity: 0.25 }}>
              Index
            </p>
            <ul className="flex flex-col gap-1 md:gap-1.5">
              {visible.map((p, i) => {
                const isActive = i === active;
                return (
                  <li key={p.slug}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => router.push(`/work/${p.slug}`)}
                      className="w-full text-left flex items-baseline gap-4 md:gap-6 py-1.5 md:py-2 transition-opacity duration-300"
                      style={{ opacity: isActive ? 1 : 0.32 }}
                      data-cursor={p.type === "video" ? "Lire" : "Voir"}
                    >
                      <span
                        className="label text-white shrink-0 transition-opacity duration-300"
                        style={{ opacity: isActive ? 0.55 : 0.45 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-white title flex-1 truncate"
                        style={{
                          fontSize: "clamp(1.1rem, 2vw, 1.75rem)",
                          lineHeight: 1.1,
                        }}
                      >
                        {p.title}
                      </span>
                      <span
                        className="label text-white hidden md:inline shrink-0"
                        style={{ opacity: isActive ? 0.45 : 0.25 }}
                      >
                        {p.category}
                      </span>
                      <span
                        className="label text-white shrink-0"
                        style={{ opacity: isActive ? 0.45 : 0.25 }}
                      >
                        {p.year}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
