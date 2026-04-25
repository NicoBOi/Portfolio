"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { VimeoPlayer, YouTubePlayer, getVimeoId, getYoutubeId } from "./VideoPlayers";
import Lightbox from "./Lightbox";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  project: Project | null;
  onClose: () => void;
}

// Editorial in-place project view. The landing stays mounted underneath; this
// renders as a black-letterbox overlay so the project's media reads as a
// punched-through window with the title / role / meta arranged around it.
// The site Navigation provides the Retour affordance at the top-left (it
// listens to the html.project-active class set by LandingExperience).
export default function ProjectOverlay({ project, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  // Hold onto the last project while exit-animating so the overlay can render
  // the closing project's content on its way out (project is null during exit).
  const [rendered, setRendered] = useState<Project | null>(project);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (project) setRendered(project);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [project]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {project && rendered && (
        <Overlay key="project-overlay" project={rendered} onClose={onClose} />
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Overlay({ project, onClose }: { project: Project; onClose: () => void }) {
  const isVideo =
    project.type === "video" ||
    !!project.videoUrl ||
    !!project.youtubeId ||
    !!project.videoFile;

  return (
    <motion.div
      key={project.slug}
      className="fixed inset-0 z-[150] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: SOFT }}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-between py-20 md:py-24"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.header
          className="w-full max-w-6xl text-center pointer-events-none px-5 md:px-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.55, delay: 0.08, ease: SOFT }}
          onClick={(e) => e.stopPropagation()}
        >
          <p
            className="label text-white mb-3 md:mb-4"
            style={{ opacity: 0.55, letterSpacing: "0.32em" }}
          >
            {project.year} — {project.role}
          </p>
          <h1
            className="text-white title leading-none"
            style={{ fontSize: "clamp(1.8rem, 5.2vw, 4.5rem)" }}
          >
            {project.title}
          </h1>
        </motion.header>

        {isVideo ? (
          <VideoMedia project={project} />
        ) : (
          <PhotoCarousel project={project} />
        )}

        <motion.footer
          className="w-full max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-10 pointer-events-none px-5 md:px-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.55, delay: 0.12, ease: SOFT }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="md:max-w-md text-left">
            {project.description && (
              <p
                className="text-white"
                style={{
                  fontSize: "clamp(0.85rem, 1.05vw, 0.95rem)",
                  lineHeight: 1.55,
                  opacity: 0.7,
                }}
              >
                {project.description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 md:items-end md:text-right">
            <p className="label text-white" style={{ opacity: 0.85 }}>{project.meta.type}</p>
            <p className="label text-white" style={{ opacity: 0.65 }}>{project.meta.location}</p>
            <p className="label text-white" style={{ opacity: 0.65 }}>{project.meta.credits}</p>
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Video media — centered, letterboxed, controls always visible.
// ─────────────────────────────────────────────────────────────
function VideoMedia({ project }: { project: Project }) {
  const vimeoId = project.videoUrl ? getVimeoId(project.videoUrl) : null;
  const youtubeId = project.youtubeId ?? (vimeoId ? null : getYoutubeId(project.videoUrl));
  const aspectStr = project.videoAspect ?? "16/9";
  const [aw, ah] = aspectStr.split("/").map(Number);
  const ratio = aw && ah ? aw / ah : 16 / 9;
  const cover = project.imageFiles?.[0];

  return (
    <motion.div
      // Mobile: edge-to-edge (w-screen). Desktop: capped width via the
      // --media-w variable so the letterbox keeps breathing room around it.
      className="relative bg-black overflow-hidden w-screen md:w-[var(--media-w)]"
      style={{
        aspectRatio: aspectStr,
        ["--media-w" as string]: `min(76vw, calc(62vh * ${ratio}))`,
        maxHeight: "62vh",
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.55, delay: 0.05, ease: SOFT }}
      onClick={(e) => e.stopPropagation()}
    >
      {youtubeId ? (
        <YouTubePlayer youtubeId={youtubeId} />
      ) : vimeoId ? (
        <VimeoPlayer vimeoId={vimeoId} />
      ) : project.videoFile ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={`/projects/${project.slug}/${project.videoFile}`}
          poster={cover ? `/projects/${project.slug}/${cover}` : undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: project.coverPlaceholder }}
        />
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Photo carousel — fixed height, prev/next + arrow keys + swipe.
// Click an image to open the zoomable Lightbox.
// ─────────────────────────────────────────────────────────────
function PhotoCarousel({ project }: { project: Project }) {
  const files = project.imageFiles ?? [];
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  const goTo = (next: number) => {
    if (next === idx || files.length === 0) return;
    setDirection(next > idx ? 1 : -1);
    setIdx((next + files.length) % files.length);
  };
  const prev = () => goTo((idx - 1 + files.length) % files.length);
  const next = () => goTo((idx + 1) % files.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox !== null) return; // lightbox handles its own keys
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, files.length, lightbox]);

  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) >= 40) (dx < 0 ? next : prev)();
    startX.current = null;
  };

  if (files.length === 0) {
    return (
      <div
        className="bg-black"
        style={{ width: "min(70vw, 90vw)", height: "62vh", backgroundColor: project.coverPlaceholder }}
      />
    );
  }

  const current = files[idx];

  return (
    <>
      <motion.div
        // Mobile: edge-to-edge (w-screen). Desktop: capped at 1100px.
        className="relative flex items-center justify-center w-screen md:w-[min(80vw,1100px)]"
        style={{ height: "62vh" }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.55, delay: 0.05, ease: SOFT }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.button
            key={current}
            type="button"
            onClick={() => setLightbox(idx)}
            className="absolute inset-0 flex items-center justify-center"
            data-cursor="Agrandir"
            aria-label={`Agrandir la photo ${idx + 1}`}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.4, ease: SOFT }}
          >
            <div className="relative w-full h-full">
              <Image
                src={`/projects/${project.slug}/${current}`}
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 80vw, 100vw"
                className="object-contain"
              />
            </div>
          </motion.button>
        </AnimatePresence>

        {files.length > 1 && (
          <>
            <CarouselArrow side="prev" onClick={prev} />
            <CarouselArrow side="next" onClick={next} />

            <span
              className="label text-white tabular-nums absolute -bottom-7 left-1/2 -translate-x-1/2"
              style={{ opacity: 0.55, letterSpacing: "0.3em" }}
            >
              {String(idx + 1).padStart(2, "0")} / {String(files.length).padStart(2, "0")}
            </span>
          </>
        )}
      </motion.div>

      <Lightbox
        slug={project.slug}
        files={files}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    </>
  );
}

// Editorial chevron — same vocabulary as the Navigation Retour: a hairline
// rule that grows on hover, paired with a thin chevron stroke. No fill,
// no pill button. Mobile sits flush to the edge; desktop floats outside
// the carousel frame.
function CarouselArrow({ side, onClick }: { side: "prev" | "next"; onClick: () => void }) {
  const isPrev = side === "prev";
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={isPrev ? "Précédent" : "Suivant"}
      data-cursor={isPrev ? "Précédent" : "Suivant"}
      className={`group absolute top-1/2 -translate-y-1/2 z-10 flex items-center gap-3 px-4 py-6 text-white transition-opacity duration-300 ${
        isPrev
          ? "left-3 md:-left-16 flex-row"
          : "right-3 md:-right-16 flex-row-reverse"
      }`}
      style={{ opacity: 0.65 }}
    >
      <span
        aria-hidden="true"
        className="block h-px bg-white transition-all duration-500 group-hover:w-10"
        style={{ width: 18, opacity: 0.85 }}
      />
      <svg
        width="11"
        height="14"
        viewBox="0 0 11 14"
        fill="none"
        aria-hidden="true"
        style={{ transform: isPrev ? "rotate(180deg)" : undefined }}
      >
        <path
          d="M1 1L9 7L1 13"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
