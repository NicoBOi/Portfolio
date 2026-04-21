"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/data/projects";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  project: Project | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

export default function ProjectPanel({ project, onClose, onNavigate }: Props) {
  const idx = project ? projects.findIndex((p) => p.slug === project.slug) : -1;
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && next) onNavigate(next.slug);
      if (e.key === "ArrowLeft" && prev) onNavigate(prev.slug);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [project, prev, next, onClose, onNavigate]);

  useEffect(() => {
    document.body.style.overflow = project ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex flex-col"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 md:px-10 h-14 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-5">
              <span className="label text-white" style={{ opacity: 0.22 }}>
                {String(idx + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(projects.length).padStart(2, "0")}
              </span>
              <h2
                className="text-white title"
                style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
              >
                {project.title}
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <span className="label text-white hidden md:block" style={{ opacity: 0.28 }}>
                {project.role}&nbsp;—&nbsp;{project.year}
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => prev && onNavigate(prev.slug)}
                  className="label text-white hover:opacity-80 transition-opacity duration-300"
                  style={{ opacity: prev ? 0.4 : 0.1 }}
                  disabled={!prev}
                  aria-label="Previous project"
                >
                  ←
                </button>
                <button
                  onClick={() => next && onNavigate(next.slug)}
                  className="label text-white hover:opacity-80 transition-opacity duration-300"
                  style={{ opacity: next ? 0.4 : 0.1 }}
                  disabled={!next}
                  aria-label="Next project"
                >
                  →
                </button>
              </div>

              <button
                onClick={onClose}
                className="label text-white hover:opacity-100 transition-opacity duration-300"
                style={{ opacity: 0.45 }}
                aria-label="Close panel"
              >
                Close
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={project.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: SOFT }}
                className="px-6 md:px-10 py-10"
              >
                {project.type === "video" || project.videoUrl ? (
                  <VideoContent project={project} />
                ) : (
                  <PhotoContent project={project} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <div className="px-6 md:px-10 h-12 border-t border-white/10 flex items-center justify-between shrink-0">
            <button
              onClick={() => prev && onNavigate(prev.slug)}
              className="group"
              style={{ opacity: prev ? 1 : 0, pointerEvents: prev ? "auto" : "none" }}
            >
              <span className="label text-white opacity-35 group-hover:opacity-80 transition-opacity duration-300">
                ← {prev?.title}
              </span>
            </button>
            <button
              onClick={() => next && onNavigate(next.slug)}
              className="group"
              style={{ opacity: next ? 1 : 0, pointerEvents: next ? "auto" : "none" }}
            >
              <span className="label text-white opacity-35 group-hover:opacity-80 transition-opacity duration-300">
                {next?.title} →
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhotoContent({ project }: { project: Project }) {
  const count = project.images ?? 4;
  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="w-full mb-6"
        style={{
          aspectRatio: project.aspectRatio === "portrait" ? "2/3" : "16/10",
          backgroundColor: project.coverPlaceholder,
        }}
      >
        <div className="placeholder-img text-white h-full">Cover</div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: count - 1 }).map((_, i) => {
          const colClass = i % 3 === 0 ? "col-span-12" : i % 3 === 1 ? "col-span-7" : "col-span-5";
          const ratio = i % 2 === 0 ? "3/2" : "2/3";
          return (
            <div
              key={i}
              className={colClass}
              style={{ aspectRatio: ratio, backgroundColor: project.coverPlaceholder + "99" }}
            >
              <div className="placeholder-img text-white h-full">Image {i + 2}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 pt-8 border-t border-white/10 flex items-center justify-between">
        <span className="label text-white" style={{ opacity: 0.28 }}>{project.category}</span>
        <span className="label text-white" style={{ opacity: 0.28 }}>{project.role} — {project.year}</span>
      </div>
    </div>
  );
}

function VideoContent({ project }: { project: Project }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="w-full aspect-video flex items-center justify-center mb-6"
        style={{ backgroundColor: project.coverPlaceholder }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          >
            <span className="text-white text-xl" style={{ marginLeft: 4 }}>▶</span>
          </div>
          <span className="label text-white" style={{ opacity: 0.25 }}>Play</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="aspect-video"
            style={{ backgroundColor: project.coverPlaceholder + "55" }}
          >
            <div className="placeholder-img text-white h-full">Still {i + 1}</div>
          </div>
        ))}
      </div>

      <div className="mt-14 pt-8 border-t border-white/10 flex items-center justify-between">
        <span className="label text-white" style={{ opacity: 0.28 }}>{project.category}</span>
        <span className="label text-white" style={{ opacity: 0.28 }}>{project.role} — {project.year}</span>
      </div>
    </div>
  );
}
