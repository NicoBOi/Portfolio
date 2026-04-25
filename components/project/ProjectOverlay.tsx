"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
      {/* Three-zone layout: header / media / footer.
          Explicit gap-y between zones (rather than relying on justify-between
          collapsing all the slack into the gaps) so the title never reads as
          glued to the image and the pagination never reads as glued to the
          description, regardless of viewport height. */}
      <div
        className="relative w-full h-full flex flex-col items-center py-16 md:py-20 gap-y-10 md:gap-y-14"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.header
          className="w-full max-w-6xl text-center pointer-events-none px-5 md:px-10 shrink-0"
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

        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center gap-7 md:gap-9">
          {isVideo ? (
            <VideoMedia project={project} />
          ) : (
            <PhotoCarousel project={project} />
          )}
        </div>

        <motion.footer
          className="w-full max-w-6xl flex flex-col items-center gap-5 md:gap-6 pointer-events-none px-5 md:px-10 text-center shrink-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.55, delay: 0.12, ease: SOFT }}
          onClick={(e) => e.stopPropagation()}
        >
          {project.description && (
            <p
              className="text-white max-w-xl"
              style={{
                fontSize: "clamp(0.85rem, 1.05vw, 0.95rem)",
                lineHeight: 1.55,
                opacity: 0.7,
              }}
            >
              {project.description}
            </p>
          )}
          <div className="flex flex-col items-center gap-1.5">
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
      className="relative bg-black overflow-hidden w-screen md:w-[var(--media-w)]"
      style={{
        aspectRatio: aspectStr,
        ["--media-w" as string]: `min(76vw, calc(58vh * ${ratio}))`,
        maxHeight: "58vh",
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
// Photo carousel — sliding track, neighbours peek on each side.
// No wrap-around: arrows disabled at the ends, plain prev / next.
// ─────────────────────────────────────────────────────────────
function PhotoCarousel({ project }: { project: Project }) {
  const files = project.imageFiles ?? [];
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerW(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = (n: number) => {
    if (n < 0 || n >= files.length || n === idx) return;
    setIdx(n);
  };
  const prev = () => goTo(idx - 1);
  const next = () => goTo(idx + 1);
  const canPrev = idx > 0;
  const canNext = idx < files.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox !== null) return;
      if (e.key === "ArrowRight" && canNext) { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" && canPrev) { e.preventDefault(); prev(); }
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
    if (Math.abs(dx) >= 40) {
      if (dx < 0 && canNext) next();
      else if (dx > 0 && canPrev) prev();
    }
    startX.current = null;
  };

  if (files.length === 0) {
    return (
      <div
        style={{
          width: "min(70vw, 90vw)",
          height: "58vh",
          backgroundColor: project.coverPlaceholder,
        }}
      />
    );
  }

  // Slide takes ~72% of the container on mobile (≈12% peek per side), ~58%
  // on desktop (≈18% peek per side). Generous peeks so the neighbours read
  // as part of the same set and pull the eye toward the next photo.
  const isDesktop = containerW >= 768;
  const slideRatio = isDesktop ? 0.58 : 0.72;
  const gapRatio = 0.025;
  const slideW = containerW * slideRatio;
  const gap = containerW * gapRatio;
  const offset = (containerW - slideW) / 2;
  const x = offset - idx * (slideW + gap);

  return (
    <>
      <motion.div
        ref={containerRef}
        className="relative w-screen md:w-[min(85vw,1280px)] flex-1 min-h-0 max-h-[58vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: SOFT }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <motion.div
          className="flex h-full items-center"
          animate={{ x }}
          transition={{ duration: 0.55, ease: SOFT }}
          style={{ gap }}
        >
          {files.map((f, i) => {
            const isCurrent = i === idx;
            return (
              <button
                key={f}
                type="button"
                onClick={() => (isCurrent ? setLightbox(i) : goTo(i))}
                className="shrink-0 h-full relative block"
                style={{ width: slideW || 1 }}
                data-cursor={isCurrent ? "Agrandir" : i < idx ? "Précédent" : "Suivant"}
                aria-label={isCurrent ? `Agrandir la photo ${i + 1}` : `Photo ${i + 1}`}
                aria-current={isCurrent ? "true" : undefined}
                tabIndex={isCurrent ? 0 : -1}
              >
                <Image
                  src={`/projects/${project.slug}/${f}`}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 58vw, 72vw"
                  className="object-contain transition-opacity duration-500"
                  style={{ opacity: isCurrent ? 1 : 0.6 }}
                />
              </button>
            );
          })}
        </motion.div>

        {canPrev && <CarouselArrow side="prev" onClick={prev} />}
        {canNext && <CarouselArrow side="next" onClick={next} />}
      </motion.div>

      {files.length > 1 && (
        <div
          className="flex items-center pointer-events-auto shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {files.map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => goTo(i)}
              onFocus={() => goTo(i)}
              onClick={() => goTo(i)}
              className="label text-white tabular-nums transition-opacity duration-300 px-3 py-2 !text-[10px] md:!text-[13px] !tracking-[0.22em] md:!tracking-[0.18em]"
              style={{ opacity: i === idx ? 0.95 : 0.45 }}
              aria-label={`Photo ${i + 1}`}
              aria-current={i === idx ? "true" : undefined}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      )}

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

// Plain chevron stroke. No background, no underline rule — just the arrow,
// in keeping with the editorial DA.
function CarouselArrow({ side, onClick }: { side: "prev" | "next"; onClick: () => void }) {
  const isPrev = side === "prev";
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={isPrev ? "Précédent" : "Suivant"}
      data-cursor={isPrev ? "Précédent" : "Suivant"}
      className={`absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center px-4 py-6 text-white transition-opacity duration-300 hover:opacity-100 ${
        isPrev ? "left-3 md:left-6" : "right-3 md:right-6"
      }`}
      style={{ opacity: 0.65 }}
    >
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
