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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTilting, setIsTilting] = useState(false);

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

  // Wheel: once the user has scrolled to the bottom of the page, hijack scroll to advance the carousel
  useEffect(() => {
    let locked = false;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return;
      const doc = document.documentElement;
      const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
      const atTop = window.scrollY <= 1;

      if (e.deltaY > 0 && atBottom) {
        e.preventDefault();
        if (locked) return;
        locked = true;
        setActive((i) => Math.min(visible.length - 1, i + 1));
        setTimeout(() => { locked = false; }, 700);
      } else if (e.deltaY < 0 && atTop) {
        e.preventDefault();
        if (locked) return;
        locked = true;
        setActive((i) => Math.max(0, i - 1));
        setTimeout(() => { locked = false; }, 700);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [visible.length]);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -5;
    const y = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 5;
    setTilt({ x, y });
  };

  const resetTilt = () => {
    setIsTilting(false);
    setTilt({ x: 0, y: 0 });
  };

  const current = visible[active];
  const hasPrev = active > 0;
  const hasNext = active < visible.length - 1;

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
              const tx = offset * 38; // tighter — side cards peek in

              const transform = isActive
                ? `translate(-50%, -50%) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                : `translate(-50%, -50%) translateX(${tx}vw) rotateY(${rotateY}deg) scale(${scale})`;

              const transition = isActive && isTilting
                ? "transform 0.08s linear, opacity 0.75s cubic-bezier(0.16,1,0.3,1)"
                : "transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.75s cubic-bezier(0.16,1,0.3,1)";

              return (
                <div
                  key={project.slug}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "clamp(280px, 52vw, 820px)",
                    zIndex: 20 - absOffset,
                    transform,
                    opacity,
                    transition,
                    cursor: "pointer",
                    willChange: isActive ? "transform" : "auto",
                  }}
                  onClick={() => isActive ? router.push(`/work/${project.slug}`) : setActive(i)}
                  onMouseMove={isActive ? (e) => { setIsTilting(true); handleTiltMove(e); } : undefined}
                  onMouseLeave={isActive ? resetTilt : undefined}
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
                </div>
              );
            })}

            {/* Side nav — minimal editorial arrows */}
            <button
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 group flex items-center gap-3"
              style={{ opacity: hasPrev ? 1 : 0, pointerEvents: hasPrev ? "auto" : "none", transition: "opacity 0.4s" }}
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              aria-label="Précédent"
            >
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none" className="group-hover:opacity-100 transition-opacity duration-300" style={{ opacity: 0.45 }}>
                <line x1="32" y1="6" x2="0" y2="6" stroke="white" strokeWidth="0.8" />
                <polyline points="8,1 1,6 8,11" stroke="white" strokeWidth="0.8" fill="none" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <span className="label text-white hidden md:block group-hover:opacity-60 transition-opacity duration-300" style={{ opacity: 0.3, maxWidth: "14ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {visible[active - 1]?.title}
              </span>
            </button>

            <button
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 group flex items-center gap-3"
              style={{ opacity: hasNext ? 1 : 0, pointerEvents: hasNext ? "auto" : "none", transition: "opacity 0.4s" }}
              onClick={() => setActive((i) => Math.min(visible.length - 1, i + 1))}
              aria-label="Suivant"
            >
              <span className="label text-white hidden md:block group-hover:opacity-60 transition-opacity duration-300" style={{ opacity: 0.3, maxWidth: "14ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {visible[active + 1]?.title}
              </span>
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none" className="group-hover:opacity-100 transition-opacity duration-300" style={{ opacity: 0.45 }}>
                <line x1="0" y1="6" x2="32" y2="6" stroke="white" strokeWidth="0.8" />
                <polyline points="24,1 31,6 24,11" stroke="white" strokeWidth="0.8" fill="none" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </button>
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
                  className="label text-white inline-flex items-center gap-4 hover:opacity-80 transition-opacity duration-300"
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
