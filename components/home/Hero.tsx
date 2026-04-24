"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Player from "@vimeo/player";
import { projects, type Project } from "@/data/projects";

const ALL_FEATURED = projects.filter((p) => p.featured);
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SCROLL_LOCK_MS = 850;
const TITLE = "Nicolas Sempere";
const REPEL_RADIUS = 110;
const REPEL_STRENGTH = 50;

type HeroFilter = "all" | "photo" | "video" | "3d";

const FILTERS: { value: HeroFilter; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "photo", label: "Photo" },
  { value: "video", label: "Film" },
  { value: "3d", label: "3D" },
];

function getVimeoId(url?: string): string | null {
  return url ? url.match(/vimeo\.com\/(\d+)/)?.[1] ?? null : null;
}

interface HeroProps {
  // When set, the hero enters "project mode": filters/index/prev-next fade
  // out, the central title morphs to the project's name + description, the
  // section becomes position:sticky so it pins while the project content
  // scrolls into view below. Null = the normal landing browse experience.
  activeProject?: Project | null;
  onOpenProject?: (slug: string) => void;
  onCloseProject?: () => void;
}

export default function Hero({
  activeProject = null,
  onOpenProject,
  onCloseProject,
}: HeroProps) {
  const router = useRouter();
  const isProject = !!activeProject;
  const [filter, setFilter] = useState<HeroFilter>("all");
  const [index, setIndex] = useState(() => {
    if (activeProject) {
      const i = ALL_FEATURED.findIndex((p) => p.slug === activeProject.slug);
      if (i !== -1) return i;
    }
    return 0;
  });
  const [loaded, setLoaded] = useState(false);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const FEATURED =
    filter === "all" ? ALL_FEATURED : ALL_FEATURED.filter((p) => p.type === filter);
  // In browse mode the background tracks the carousel index. In project mode
  // it always reflects the active project (even if it's not in FEATURED).
  const current = activeProject ?? FEATURED[index] ?? ALL_FEATURED[0];

  const openProject = (slug: string) => {
    if (onOpenProject) onOpenProject(slug);
    else router.push(`/work/${slug}`);
  };

  // Keep the internal carousel index in sync with an externally-driven
  // activeProject so the background continues to match when opening a project
  // via URL / prev-next.
  useEffect(() => {
    if (!activeProject) return;
    const i = ALL_FEATURED.findIndex((p) => p.slug === activeProject.slug);
    if (i !== -1 && i !== index) setIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject?.slug]);

  // Scroll indicator state for project mode — fades once the user starts
  // scrolling the project content. Reset on project change so the hint
  // reappears for each opened project.
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    if (!isProject) {
      setHasScrolled(false);
      return;
    }
    setHasScrolled(false);
    const onScroll = () => setHasScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isProject, activeProject?.slug]);

  // Reset index when filter changes so we land on the first project of the new set.
  useEffect(() => {
    setIndex(0);
  }, [filter]);

  // Fade-in
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Warm the browser cache for every featured image right after first paint
  // so wheel/swipe transitions + filter changes don't stall on a network fetch.
  // Use requestIdleCallback so this runs during browser downtime without
  // competing with the LCP paint — with a short setTimeout fallback for Safari.
  useEffect(() => {
    const warm = () => {
      ALL_FEATURED.forEach((p) => {
        const first = p.imageFiles?.[0];
        if (first) {
          const img = new window.Image();
          img.decoding = "async";
          img.src = `/projects/${p.slug}/${first}`;
        }
      });
    };
    type IC = (cb: () => void, opts?: { timeout?: number }) => number;
    const ric = (window as unknown as { requestIdleCallback?: IC }).requestIdleCallback;
    if (ric) {
      const id = ric(warm, { timeout: 800 });
      return () => (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const t = setTimeout(warm, 120);
    return () => clearTimeout(t);
  }, []);

  // Wheel — rebind when FEATURED length changes so the modulo sees the right count.
  // Skip entirely in project mode: vertical scrolling must reach the project content.
  const featuredLen = FEATURED.length;
  useEffect(() => {
    if (isProject || featuredLen <= 1) return;
    let locked = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (locked || Math.abs(e.deltaY) < 8) return;
      locked = true;
      setIndex((i) => (e.deltaY > 0 ? (i + 1) % featuredLen : (i - 1 + featuredLen) % featuredLen));
      setTimeout(() => { locked = false; }, SCROLL_LOCK_MS);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [featuredLen, isProject]);

  // Touch swipe — horizontal (carousel feel on mobile). Vertical gestures are left
  // alone so the browser's native handling stays intact and swipes up/down are ignored.
  const swipingRef = useRef(false);
  useEffect(() => {
    if (isProject || featuredLen <= 1) return;
    let sx = 0;
    let sy = 0;
    const ts = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      swipingRef.current = false;
    };
    const tm = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - sx);
      const dy = Math.abs(e.touches[0].clientY - sy);
      if (dx > 10 && dx > dy) swipingRef.current = true;
    };
    const te = (e: TouchEvent) => {
      const dx = sx - e.changedTouches[0].clientX;
      const dy = sy - e.changedTouches[0].clientY;
      // Require a horizontally-dominant swipe of at least 50px.
      if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) {
        setIndex((i) => (dx > 0 ? (i + 1) % featuredLen : (i - 1 + featuredLen) % featuredLen));
      }
      // Keep the swiping flag alive briefly so the follow-up synthetic click is ignored.
      window.setTimeout(() => { swipingRef.current = false; }, 120);
    };
    window.addEventListener("touchstart", ts, { passive: true });
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", te, { passive: true });
    return () => {
      window.removeEventListener("touchstart", ts);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", te);
    };
  }, [featuredLen, isProject]);

  // Magnetic letter repulsion — direct DOM manipulation, no re-render, throttled to rAF
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { x, y } = mouseRef.current;
      letterRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const lx = rect.left + rect.width / 2;
        const ly = rect.top + rect.height / 2;
        const dx = x - lx;
        const dy = y - ly;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = 1 - dist / REPEL_RADIUS;
          const ox = -(dx / dist) * force * REPEL_STRENGTH;
          const oy = -(dy / dist) * force * (REPEL_STRENGTH * 0.55);
          el.style.transform = `translate(${ox}px, ${oy}px)`;
        } else {
          el.style.transform = "translate(0px, 0px)";
        }
      });
    });
  };

  const handleMouseLeave = () => {
    letterRefs.current.forEach((el) => {
      if (el) el.style.transform = "translate(0px, 0px)";
    });
  };

  const goPrev = () =>
    featuredLen > 1 && setIndex((i) => (i - 1 + featuredLen) % featuredLen);
  const goNext = () => featuredLen > 1 && setIndex((i) => (i + 1) % featuredLen);

  return (
    <section
      className={`${
        isProject
          ? "sticky top-0 z-0"
          : "relative"
      } h-screen bg-black overflow-hidden flex flex-col`}
      onMouseMove={isProject ? undefined : handleMouseMove}
      onMouseLeave={isProject ? undefined : handleMouseLeave}
      // In landing browse mode the only meaningful gesture is horizontal —
      // locking touch-action to pan-x kills iOS rubber-band + any accidental
      // vertical pan, so the carousel reads unambiguously.
      style={!isProject ? { touchAction: "pan-x" } : undefined}
      data-cursor-suppress
    >

      {/* Back button used to live here, but the sticky hero creates its own
          stacking context at z-0 — once the project content (z-10) scrolled
          over the hero, the button was hidden. It's now rendered at the
          LandingExperience level so it can sit above both layers. */}

      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        onClick={() => {
          if (isProject) return;
          if (swipingRef.current) return;
          openProject(current.slug);
        }}
        data-cursor={isProject ? undefined : current.type === "video" ? "Lire" : "Voir"}
        data-cursor-silent
      >
          <AnimatePresence mode="sync">
            <motion.div
              key={index}
              className="absolute inset-0 overflow-hidden bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: SOFT }}
            >
              {(() => {
                const vId = getVimeoId(current.videoUrl);
                if (vId) {
                  const aspectStr = current.videoAspect ?? "16/9";
                  const [aw, ah] = aspectStr.split("/").map(Number);
                  return <HeroVimeo vimeoId={vId} ratio={aw / ah} />;
                }
                if (current.youtubeId) {
                  return <HeroYouTube youtubeId={current.youtubeId} />;
                }
                if (current.imageFiles && current.imageFiles.length > 0) {
                  return (
                    <img
                      src={`/projects/${current.slug}/${current.imageFiles[0]}`}
                      alt={current.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  );
                }
                return <div className="placeholder-img text-white h-full">Image</div>;
              })()}
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Foreground */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.3, ease: SOFT }}
        >
          <div className="relative flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            {/* Scroll affordance — desktop only (wheel gesture hint). Hidden in
                project mode (vertical scroll belongs to the project content). */}
            {!isProject && (<>
            <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-4 pointer-events-none">
              <span
                className="label text-white"
                style={{
                  opacity: 0.4,
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  letterSpacing: "0.28em",
                }}
              >
                Scroll
              </span>
              <div className="relative h-12 w-px bg-white/15 overflow-hidden">
                <motion.div
                  className="absolute left-0 w-full bg-white"
                  style={{ opacity: 0.7, height: 5 }}
                  animate={{ y: [-8, 40] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
                />
              </div>
            </div>

            {/* Vertical index — hover to preview, click to open. Desktop only;
                mobile gets a horizontal count below the title so the right edge
                stays clean and the swipe target can breathe. */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-end pointer-events-auto">
              {FEATURED.map((p, i) => (
                <button
                  key={p.slug}
                  onMouseEnter={() => setIndex(i)}
                  onFocus={() => setIndex(i)}
                  onClick={() => openProject(p.slug)}
                  className="label text-white tabular-nums transition-opacity duration-300 px-4 py-2"
                  style={{ opacity: i === index ? 0.95 : 0.45 }}
                  data-cursor={p.type === "photo" ? "Voir" : "Lire"}
                  aria-label={p.title}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>

            <motion.div
              className="hidden md:flex items-center gap-2 md:gap-4 pointer-events-auto"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: SOFT }}
            >
              {FILTERS.map((f, i) => (
                <span key={f.value} className="flex items-center gap-2 md:gap-4">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="label text-white"
                      style={{ opacity: 0.2, letterSpacing: "0.32em" }}
                    >
                      —
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setFilter(f.value)}
                    className="label text-white transition-opacity duration-300 relative px-2 py-2 rounded"
                    style={{
                      opacity: filter === f.value ? 1 : 0.6,
                      letterSpacing: "0.32em",
                    }}
                    aria-pressed={filter === f.value}
                  >
                    {f.label}
                    {filter === f.value && (
                      <motion.span
                        layoutId="hero-filter-underline"
                        className="absolute left-2 right-2 bottom-1 h-px bg-white"
                        style={{ opacity: 0.7 }}
                        transition={{ duration: 0.3, ease: SOFT }}
                      />
                    )}
                  </button>
                </span>
              ))}
            </motion.div>

            </>)}

            {/* Central title — morphs between the landing name and the active project.
                pointer-events-none on the wrapper so a click over the name falls
                through to the background (which opens the current featured project). */}
            <div className="relative w-full pointer-events-none">
            <AnimatePresence mode="wait">
            {isProject && activeProject ? (
              <motion.div
                key="project-title"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, ease: SOFT }}
                className="flex flex-col items-center gap-4 md:gap-6"
              >
                <h1
                  className="text-white title text-center"
                  style={{ fontSize: "clamp(2rem, 6.5vw, 6rem)", lineHeight: 1.02 }}
                >
                  {activeProject.title}
                </h1>
                {activeProject.description && (
                  <p
                    className="text-white text-center max-w-2xl px-4"
                    style={{ fontSize: "clamp(0.85rem, 1.05vw, 0.95rem)", lineHeight: 1.55, opacity: 0.7 }}
                  >
                    {activeProject.description}
                  </p>
                )}
                <p
                  className="label text-white"
                  style={{ opacity: 0.45, letterSpacing: "0.28em" }}
                >
                  {activeProject.year} — {activeProject.role}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="landing-title"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, ease: SOFT }}
                className="flex flex-col items-center gap-4"
              >
                <h1
                  className="text-white title whitespace-nowrap"
                  style={{ fontSize: "clamp(2.5rem, 9vw, 11rem)" }}
                >
              {TITLE.split("").map((char, i) => (
                <span
                  key={i}
                  ref={(el) => { letterRefs.current[i] = el; }}
                  style={{
                    display: char === " " ? "inline" : "inline-block",
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {char === " " ? " " : char}
                </span>
              ))}
                </h1>
                <p
                  className="label text-white"
                  style={{ opacity: 0.6, letterSpacing: "0.22em" }}
                >
              Bordeaux — Paris
                </p>

                {/* Mobile index — horizontal row of the same 01-08 numbers the
                    desktop carries vertically on the right edge. Each is
                    tappable (enlarged hit area via py-3 -my-3) so the index
                    doubles as jump navigation on top of the swipe gesture. */}
                <div className="md:hidden mt-8 flex items-center justify-center gap-2 pointer-events-auto">
                  {FEATURED.map((p, i) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setIndex(i)}
                      className="label text-white tabular-nums transition-opacity duration-300 px-1 py-3 -my-3"
                      style={{
                        opacity: i === index ? 0.95 : 0.35,
                        fontSize: "11px",
                        letterSpacing: "0.24em",
                      }}
                      aria-label={`Projet ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            </div>
          </div>

          {/* Bottom nav — browse mode only. In project mode the bottom belongs to
              the project's own prev/next nav rendered below the hero. */}
          {!isProject && (
          <motion.div
            className="px-6 md:px-10 pb-24 md:pb-8 grid grid-cols-3 items-end gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <button
              onClick={goPrev}
              className="flex items-center gap-3 group text-left pointer-events-auto px-3 py-3 -mx-3"
              aria-label="Projet précédent"
            >
              <span
                className="block h-px bg-white group-hover:opacity-80 transition-all duration-500"
                style={{ width: 24, opacity: 0.45 }}
              />
              <span
                className="label text-white hidden md:inline group-hover:opacity-100 transition-opacity duration-300"
                style={{ opacity: 0.7 }}
              >
                {FEATURED[(index - 1 + FEATURED.length) % FEATURED.length].title}
              </span>
            </button>

            <button
              type="button"
              onClick={() => openProject(current.slug)}
              className="flex flex-col items-center gap-2 pointer-events-auto group px-4 py-3 -mx-4 -my-3"
              data-cursor={current.type === "video" ? "Lire" : "Voir"}
              aria-label={`Ouvrir ${current.title}`}
            >
              {/* Mobile: a static "Open" affordance so the tap-to-open action
                  reads unambiguously. Desktop keeps the per-slide title +
                  animated morph — space is available and it matches the
                  editorial chrome. */}
              <span
                className="md:hidden label text-white group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-3"
                style={{ opacity: 0.85, letterSpacing: "0.38em" }}
              >
                Open
                <span aria-hidden="true" style={{ opacity: 0.6 }}>→</span>
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  className="hidden md:flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35, ease: SOFT }}
                >
                  <span
                    className="text-white title text-center group-hover:opacity-100 transition-opacity duration-300"
                    style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", opacity: 0.9 }}
                  >
                    {current.title}
                    <span
                      aria-hidden="true"
                      className="ml-2 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ opacity: 0.55 }}
                    >
                      →
                    </span>
                  </span>
                </motion.div>
              </AnimatePresence>
            </button>

            <button
              onClick={goNext}
              className="flex items-center gap-3 justify-end group text-right pointer-events-auto px-3 py-3 -mx-3"
              aria-label="Projet suivant"
            >
              <span
                className="label text-white hidden md:inline group-hover:opacity-100 transition-opacity duration-300"
                style={{ opacity: 0.7 }}
              >
                {FEATURED[(index + 1) % FEATURED.length].title}
              </span>
              <span
                className="block h-px bg-white group-hover:opacity-80 transition-all duration-500"
                style={{ width: 24, opacity: 0.45 }}
              />
            </button>
          </motion.div>
          )}
        </motion.div>

        {/* Mobile-only fixed filter bar — browse mode only. */}
        {!isProject && (
        <nav
          className="hero-mobile-filter md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/10"
          style={{
            backgroundColor: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
          aria-label="Filtrer par discipline"
        >
          <div className="flex items-center justify-around px-2 py-2">
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className="label text-white relative px-4 py-4 transition-opacity duration-300 focus:outline-none"
                  style={{
                    opacity: active ? 1 : 0.6,
                    letterSpacing: "0.24em",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  aria-pressed={active}
                >
                  {f.label}
                  {active && (
                    <motion.span
                      layoutId="hero-filter-bottom-underline"
                      className="absolute left-4 right-4 bottom-1 h-px bg-white"
                      transition={{ duration: 0.3, ease: SOFT }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
        )}

        {/* Scroll affordance in project mode — bottom-center of the pinned hero.
            Fades the moment the user starts scrolling. */}
        <AnimatePresence>
          {isProject && (
            <motion.div
              key="project-scroll-indicator"
              className="absolute bottom-16 md:bottom-12 left-0 right-0 z-20 pointer-events-none flex flex-col items-center justify-center gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: hasScrolled ? 0 : 0.7, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: SOFT }}
            >
              <span
                className="label text-white"
                style={{ letterSpacing: "0.38em", fontSize: "10px" }}
              >
                Scroll
              </span>
              <div className="relative h-12 w-px bg-white/20 overflow-hidden">
                <motion.div
                  className="absolute left-0 w-full bg-white"
                  style={{ opacity: 0.8, height: 6 }}
                  animate={{ y: [-10, 42] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </section>
  );
}

// Hero Vimeo slide: SDK-bound iframe that keeps a black mask over the player
// until the actual \`play\` event fires — no grey/white autoplay blink.
function HeroVimeo({ vimeoId, ratio }: { vimeoId: string; ratio: number }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;
    const player = new Player(iframeRef.current);
    let revealTimer: number | undefined;
    // `timeupdate` fires only once a frame has actually painted, but mobile
    // Safari still has a small gap between the event and the compositor
    // committing the frame. Wait an extra beat before revealing.
    const onFrame = () => {
      player.off("timeupdate", onFrame);
      revealTimer = window.setTimeout(() => setPlaying(true), 220);
    };
    player.on("timeupdate", onFrame);
    return () => {
      if (revealTimer) window.clearTimeout(revealTimer);
      player.off("timeupdate", onFrame);
      player.destroy().catch(() => {});
    };
  }, [vimeoId]);

  const ratioStyle = { "--video-ratio": ratio } as React.CSSProperties;

  return (
    <>
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1&dnt=1&quality=1080p`}
        className="hero-video"
        style={ratioStyle}
        allow="autoplay"
      />
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: playing ? 0 : 1 }}
        transition={{ duration: 0.25, ease: "linear" }}
      />
    </>
  );
}

// Hero YouTube slide: we don't have the YT IFrame API wired into the hero, so we
// fall back to a conservative time-based mask (generous delay to cover the init flash).
function HeroYouTube({ youtubeId }: { youtubeId: string }) {
  return (
    <>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&disablekb=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&vq=hd1080&playsinline=1&playlist=${youtubeId}`}
        className="hero-video"
        style={{ "--video-ratio": 16 / 9 } as React.CSSProperties}
        allow="autoplay; encrypted-media"
      />
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 2, ease: SOFT }}
      />
    </>
  );
}
