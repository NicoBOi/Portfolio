"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/data/projects";
import dynamic from "next/dynamic";
import { VimeoPlayer, YouTubePlayer } from "./VideoPlayers";
import { getVimeoId, getYoutubeId } from "@/lib/video";
import { getImageDims } from "@/lib/image-dims";

// Lightbox pulls in react-zoom-pan-pinch (~30 KB gzipped). Defer it until the
// viewer actually clicks a photo so it never blocks the initial overlay paint.
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
// Snappy ease-in-out for the carousel slide. Quick wind-up so the swap
// feels reactive on scroll/swipe, with a soft landing so the photo
// doesn't slap into place. Reads premium without dragging.
const PREMIUM: [number, number, number, number] = [0.4, 0, 0.15, 1];

interface Props {
  project: Project | null;
  prevProject: Project | null;
  nextProject: Project | null;
  onClose: () => void;
  onOpenPrev: () => void;
  onOpenNext: () => void;
}

// Editorial in-place project view. The landing stays mounted underneath; this
// renders as a black-letterbox overlay so the project's media reads as a
// punched-through window with the title / role / meta arranged around it.
// The site Navigation provides the Retour affordance at the top-left (it
// listens to the html.project-active class set by LandingExperience).
export default function ProjectOverlay({
  project,
  prevProject,
  nextProject,
  onClose,
  onOpenPrev,
  onOpenNext,
}: Props) {
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
        <Overlay
          key="project-overlay"
          project={rendered}
          prevProject={prevProject}
          nextProject={nextProject}
          onClose={onClose}
          onOpenPrev={onOpenPrev}
          onOpenNext={onOpenNext}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Overlay({
  project,
  prevProject,
  nextProject,
  onClose,
  onOpenPrev,
  onOpenNext,
}: {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
  onClose: () => void;
  onOpenPrev: () => void;
  onOpenNext: () => void;
}) {
  const isVideo =
    project.type === "video" ||
    !!project.videoUrl ||
    !!project.youtubeId ||
    !!project.videoFile;

  return (
    // No key on the overlay shell — switching projects in-place must NOT
    // remount this div, otherwise React tears down the black backdrop for a
    // frame between unmount and mount and the landing flashes through. The
    // AnimatePresence at the portal level still drives open/close.
    <motion.div
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
      {/* Mobile: header pinned at top, media + description+meta centered in
          the middle (flex-1 wrapper with justify-center), nav row pinned at
          the bottom. Desktop unwraps the middle wrapper via display:contents
          so the outer gap-y-14 still spaces header / media / footer. */}
      <div
        className="relative w-full h-full flex flex-col items-center py-12 md:py-20 md:justify-start md:gap-y-14"
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

        {/* MIDDLE GROUP — flex-1 on mobile so the media + description+meta
            sit centered in the remaining viewport space. md:contents unwraps
            on desktop so the outer flex still drives the layout there. */}
        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center gap-6 md:contents">
          {/* Key on the media wrapper resets the carousel idx + measurements
              (and forces video iframes to reload) when switching projects.
              The outer overlay shell stays mounted so the backdrop never
              blinks off. */}
          <div
            key={project.slug}
            className="w-full flex flex-col items-center md:flex-1 md:min-h-0 gap-3 md:gap-9 shrink-0"
          >
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

        {/* Mobile-only nav row — sits at the bottom because the flex-1 middle
            wrapper above absorbs the remaining vertical space. Buttons hug
            the screen edges (justify-between + px-6) so they feel like page
            margins rather than a centred chip. */}
        {(prevProject || nextProject) && (
          <div className="md:hidden w-full flex items-center justify-between px-6 pointer-events-auto shrink-0">
            {prevProject ? (
              <NavProjectButton
                side="prev"
                target={prevProject}
                onClick={onOpenPrev}
                compact
              />
            ) : <span />}
            {nextProject ? (
              <NavProjectButton
                side="next"
                target={nextProject}
                onClick={onOpenNext}
                compact
              />
            ) : <span />}
          </div>
        )}

        {/* Desktop: prev bottom-left, next bottom-right — mirrors of the
            Retour pill at top-left. */}
        {prevProject && (
          <NavProjectButton
            side="prev"
            target={prevProject}
            onClick={onOpenPrev}
            className="hidden md:inline-flex absolute bottom-10 left-10 z-20 pointer-events-auto"
          />
        )}
        {nextProject && (
          <NavProjectButton
            side="next"
            target={nextProject}
            onClick={onOpenNext}
            className="hidden md:inline-flex absolute bottom-10 right-10 z-20 pointer-events-auto"
          />
        )}
      </div>
    </motion.div>
  );
}

function NavProjectButton({
  side,
  target,
  onClick,
  className,
  compact = false,
}: {
  side: "prev" | "next";
  target: Project;
  onClick: () => void;
  className?: string;
  compact?: boolean;
}) {
  const isPrev = side === "prev";
  const chevronSize = compact ? 9 : 11;
  return (
    <motion.button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={`${isPrev ? "Projet précédent" : "Projet suivant"} : ${target.title}`}
      data-cursor={target.type === "video" || target.videoUrl ? "Lire" : "Voir"}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 0.85, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.55, delay: 0.18, ease: SOFT }}
      whileHover={{ opacity: 1 }}
      className={`group inline-flex items-center text-white ${
        compact ? "gap-2" : "gap-3"
      } ${className ?? ""}`}
    >
      {isPrev && (
        <svg
          width={chevronSize}
          height={chevronSize + 3}
          viewBox="0 0 11 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 1L1 7L9 13"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span
        className="label whitespace-nowrap"
        style={{
          letterSpacing: compact ? "0.24em" : "0.32em",
          fontSize: compact ? "9px" : "11px",
        }}
      >
        {compact
          ? (isPrev ? "Précédent" : "Suivant")
          : (isPrev ? "Projet précédent" : "Projet suivant")}
      </span>
      {!isPrev && (
        <svg
          width={chevronSize}
          height={chevronSize + 3}
          viewBox="0 0 11 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1L9 7L1 13"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.button>
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
      className="relative bg-black overflow-hidden md:rounded-[20px] w-screen md:w-[var(--media-w)] isolate max-h-[50vh] md:max-h-[58vh]"
      style={{
        aspectRatio: aspectStr,
        ["--media-w" as string]: `min(76vw, calc(58vh * ${ratio}))`,
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
  const files = useMemo(() => project.imageFiles ?? [], [project.imageFiles]);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState({ w: 0, h: 0 });
  const [viewportH, setViewportH] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setContainer({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const updateVh = () => setViewportH(window.innerHeight);
    updateVh();
    window.addEventListener("resize", updateVh);
    return () => window.removeEventListener("resize", updateVh);
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

  // Wheel / trackpad scroll → one photo per gesture. We mount the listener
  // ONCE and keep all timing state in refs / module-scope locals so a swap
  // never resets the cooldown. (Previous bug: idx was a dep, so each swap
  // re-bound the listener with lastSwap=0 and the rest of the fling's wheel
  // events instantly traversed the whole gallery.)
  const idxRef = useRef(idx);
  const filesLenRef = useRef(files.length);
  const lightboxRef = useRef(lightbox);
  useEffect(() => { idxRef.current = idx; }, [idx]);
  useEffect(() => { filesLenRef.current = files.length; }, [files.length]);
  useEffect(() => { lightboxRef.current = lightbox; }, [lightbox]);

  useEffect(() => {
    const GESTURE_END_MS = 220;
    const SWAP_COOLDOWN_MS = 600;
    let lastWheel = 0;
    let lastSwap = 0;
    let inGesture = false;
    const onWheel = (e: WheelEvent) => {
      if (lightboxRef.current !== null) return;
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 8) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheel > GESTURE_END_MS) inGesture = false;
      lastWheel = now;
      if (!inGesture && now - lastSwap >= SWAP_COOLDOWN_MS) {
        inGesture = true;
        lastSwap = now;
        const i = idxRef.current;
        const len = filesLenRef.current;
        if (delta > 0 && i < len - 1) setIdx(i + 1);
        else if (delta < 0 && i > 0) setIdx(i - 1);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

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

  // Each slide matches the photo's natural aspect ratio (no letterboxing).
  // That way the visible image fills the whole slide and the rounded corners
  // (desktop only) actually show on the photo's edges instead of on a black
  // bg that's invisible against the page.
  const aspects = useMemo(
    () => files.map((f) => {
      const d = getImageDims(project.slug, f);
      return d.width / d.height;
    }),
    [files, project.slug],
  );

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

  const isDesktop = container.w >= 768;
  // Desktop: slide height tracks the carousel's flex-1 height; width is
  // derived from the photo's aspect, capped at 62% so neighbours peek.
  // Mobile: slide width is the full viewport, height derived from aspect.
  // Capped at 60vh for very tall portraits — for those the slide ends up
  // slightly inset on the sides instead of overflowing the screen height.
  const slideDims = aspects.map((a) => {
    if (isDesktop) {
      const slideH = container.h;
      const maxW = container.w * 0.62;
      let w = slideH * a;
      let h = slideH;
      if (w > maxW) { w = maxW; h = w / a; }
      return { w, h };
    }
    const maxH = viewportH * 0.6;
    let w = container.w;
    let h = w / a;
    if (h > maxH && maxH > 0) { h = maxH; w = h * a; }
    return { w, h };
  });
  const currentSlideH = slideDims[idx]?.h ?? 0;
  // No gap on mobile (slides are full-width so neighbours stay off-screen);
  // editorial gap on desktop where neighbours peek in.
  const gap = isDesktop ? container.w * 0.05 : 0;
  // Cumulative left positions of each slide on the track.
  const positions: number[] = [];
  let runningX = 0;
  for (let i = 0; i < slideDims.length; i++) {
    positions.push(runningX);
    runningX += slideDims[i].w + gap;
  }
  const activeCenter = (positions[idx] ?? 0) + (slideDims[idx]?.w ?? 0) / 2;
  const x = container.w / 2 - activeCenter;

  return (
    <>
      <motion.div
        ref={containerRef}
        // Carousel spans the full viewport so neighbours can run all the way
        // off the screen edge. The mask-image fades the leftmost/rightmost
        // 6% so they melt into the page background instead of cutting hard.
        // Mobile sizes the carousel to the *active* slide's height (set
        // inline below) so the title sits flush on top of the photo with
        // no empty band — pagination then slots in right under the photo.
        // Desktop keeps flex-1 + 58vh cap so the media absorbs whatever
        // room the page gives it.
        className="relative w-screen md:h-auto md:flex-1 md:min-h-0 md:max-h-[58vh] overflow-hidden"
        style={{
          height: isDesktop ? undefined : (currentSlideH || "50vh"),
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
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
          transition={{ duration: 0.5, ease: PREMIUM }}
          style={{ gap }}
        >
          {files.map((f, i) => {
            const isCurrent = i === idx;
            const dim = slideDims[i] ?? { w: 1, h: 1 };
            return (
              <button
                key={f}
                type="button"
                onClick={() => (isCurrent ? setLightbox(i) : goTo(i))}
                className="shrink-0 relative block overflow-hidden md:rounded-[20px] isolate"
                style={{ width: dim.w || 1, height: dim.h || 1 }}
                data-cursor={isCurrent ? "Agrandir" : i < idx ? "Précédent" : "Suivant"}
                aria-label={isCurrent ? `Agrandir la photo ${i + 1}` : `Photo ${i + 1}`}
                aria-current={isCurrent ? "true" : undefined}
                tabIndex={isCurrent ? 0 : -1}
              >
                {/* Editorial dash in the gap before each slide except the
                    first — same vocabulary as the hero filter "—" rule.
                    Desktop only: mobile slides are full-width with no gap,
                    so a dash here would never be visible. */}
                {i > 0 && isDesktop && (
                  <span
                    aria-hidden="true"
                    className="label text-white absolute pointer-events-none select-none"
                    style={{
                      top: "50%",
                      left: -gap / 2,
                      transform: "translate(-50%, -50%)",
                      opacity: 0.4,
                      letterSpacing: "0.3em",
                    }}
                  >
                    —
                  </span>
                )}
                <Image
                  src={`/projects/${project.slug}/${f}`}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 60vw, 80vw"
                  className="object-cover transition-opacity duration-500"
                  style={{ opacity: isCurrent ? 1 : 0.55 }}
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
      className={`absolute top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center px-4 py-6 text-white transition-opacity duration-300 hover:opacity-100 ${
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
