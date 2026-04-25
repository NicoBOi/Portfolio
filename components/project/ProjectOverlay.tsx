"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { VimeoPlayer, YouTubePlayer, getVimeoId, getYoutubeId } from "./VideoPlayers";
import Lightbox from "./Lightbox";
import { getImageDims } from "@/lib/image-dims";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  project: Project | null;
  onClose: () => void;
}

// Editorial in-place project view. The landing stays mounted underneath; this
// renders as a black-letterbox overlay so the project's media reads as a
// punched-through window with the title / role / meta arranged around it.
// Click on the media → real fullscreen on the player container.
export default function ProjectOverlay({ project, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  // Hold onto the last project while exit-animating so the overlay can render
  // the closing project's content on its way out (project is null during exit).
  const [rendered, setRendered] = useState<Project | null>(project);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (project) setRendered(project);
  }, [project]);

  // Lock the page scroll under the overlay so wheel/swipe gestures don't move
  // the landing behind it.
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
  const mediaWrapRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Resolve the media kind once. Photo projects with no video fall through to
  // the cover-image variant; everything else (videoUrl / youtubeId / videoFile)
  // reads as video.
  const isVideo =
    project.type === "video" ||
    !!project.videoUrl ||
    !!project.youtubeId ||
    !!project.videoFile;
  const vimeoId = isVideo && project.videoUrl ? getVimeoId(project.videoUrl) : null;
  const youtubeId = isVideo
    ? project.youtubeId ?? (vimeoId ? null : getYoutubeId(project.videoUrl))
    : null;
  const aspectStr = project.videoAspect ?? "16/9";
  const [aw, ah] = aspectStr.split("/").map(Number);
  const ratio = aw && ah ? aw / ah : 16 / 9;

  const cover = project.imageFiles?.[0];
  const photoDims = !isVideo && cover ? getImageDims(project.slug, cover) : null;
  const photoRatio = photoDims ? photoDims.width / photoDims.height : 4 / 5;

  // Click on media → real fullscreen. We elevate the player's wrapper to
  // requestFullscreen so the iframe inherits the full viewport.
  const enterFullscreen = () => {
    const el = mediaWrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  // Click on the backdrop (anything that's not the media or text content)
  // closes the overlay. Children stop propagation so taps land where you'd
  // expect.
  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

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
      onClick={onBackdropClick}
    >
      {/* Close × — top-right. */}
      <motion.button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Fermer"
        className="absolute top-4 right-4 md:top-6 md:right-8 z-30 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full text-white"
        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: SOFT }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </motion.button>

      {/* Layout grid:
          - Mobile: stack — title / media / meta
          - Desktop: title row at top, media centered, meta row at bottom.
            Sides flank the media when the aspect ratio leaves room. */}
      <div
        className="relative w-full h-full flex flex-col items-center justify-between px-5 md:px-10 py-12 md:py-16"
        onClick={onBackdropClick}
      >
        {/* Top — title block */}
        <motion.header
          className="w-full max-w-6xl text-center pointer-events-none"
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

        {/* Center — media. Click → fullscreen. The wrapper caps width and
            height so the media stays centered with breathing room around it
            (the "letterbox" the brief asks for). */}
        <motion.div
          ref={mediaWrapRef}
          className="relative bg-black overflow-hidden"
          style={{
            aspectRatio: isVideo ? aspectStr : `${photoRatio}`,
            // Cap by both axes so portrait + landscape both fit comfortably.
            width: `min(${isVideo ? 76 : 70}vw, calc(${
              isVideo ? 62 : 58
            }vh * ${isVideo ? ratio : photoRatio}))`,
            maxHeight: isVideo ? "62vh" : "58vh",
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.55, delay: 0.05, ease: SOFT }}
          onClick={(e) => e.stopPropagation()}
        >
          {isVideo ? (
            <>
              {youtubeId ? (
                <YouTubePlayer youtubeId={youtubeId} fullscreenTarget={mediaWrapRef.current} />
              ) : vimeoId ? (
                <VimeoPlayer vimeoId={vimeoId} fullscreenTarget={mediaWrapRef.current} />
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
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: project.coverPlaceholder }}
                />
              )}
              {/* Click-anywhere-on-media → fullscreen, sits above the player's
                  own play/pause overlay (z-[5]) so a single click does the
                  bigger gesture. The player's controls (z-10) still win. */}
              <button
                type="button"
                onDoubleClick={enterFullscreen}
                onClick={enterFullscreen}
                className="absolute inset-0 z-[8]"
                aria-label="Plein écran"
                data-cursor="Plein écran"
                style={{ background: "transparent" }}
              />
            </>
          ) : cover ? (
            <button
              type="button"
              onClick={() => setLightbox(0)}
              className="absolute inset-0 w-full h-full"
              aria-label="Agrandir"
              data-cursor="Agrandir"
            >
              <Image
                src={`/projects/${project.slug}/${cover}`}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 768px) 70vw, 100vw"
                className="object-cover"
              />
            </button>
          ) : (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: project.coverPlaceholder }}
            />
          )}
        </motion.div>

        {/* Bottom — meta block. Description on the left, type/location/credits
            on the right. Stacks on mobile. */}
        <motion.footer
          className="w-full max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-10 pointer-events-none"
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
            <p className="label text-white" style={{ opacity: 0.85 }}>
              {project.meta.type}
            </p>
            <p className="label text-white" style={{ opacity: 0.65 }}>
              {project.meta.location}
            </p>
            <p className="label text-white" style={{ opacity: 0.65 }}>
              {project.meta.credits}
            </p>
          </div>
        </motion.footer>
      </div>

      {/* Photo gallery lightbox — kept available for photo projects so the
          rest of the images are still reachable from the overlay. */}
      {!isVideo && project.imageFiles && project.imageFiles.length > 0 && (
        <Lightbox
          slug={project.slug}
          files={project.imageFiles}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onChange={setLightbox}
        />
      )}
    </motion.div>
  );
}
