"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Player from "@vimeo/player";
import { projects } from "@/data/projects";

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

export default function Hero() {
  const router = useRouter();
  const [filter, setFilter] = useState<HeroFilter>("all");
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const FEATURED =
    filter === "all" ? ALL_FEATURED : ALL_FEATURED.filter((p) => p.type === filter);
  const current = FEATURED[index] ?? ALL_FEATURED[0];

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
  useEffect(() => {
    const t = setTimeout(() => {
      ALL_FEATURED.forEach((p) => {
        const first = p.imageFiles?.[0];
        if (first) {
          const img = new window.Image();
          img.decoding = "async";
          img.src = `/projects/${p.slug}/${first}`;
        }
      });
    }, 400);
    return () => clearTimeout(t);
  }, []);

  // Wheel — rebind when FEATURED length changes so the modulo sees the right count.
  const featuredLen = FEATURED.length;
  useEffect(() => {
    if (featuredLen <= 1) return;
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
  }, [featuredLen]);

  // Touch swipe — horizontal (carousel feel on mobile). Vertical gestures are left
  // alone so the browser's native handling stays intact and swipes up/down are ignored.
  const swipingRef = useRef(false);
  useEffect(() => {
    if (featuredLen <= 1) return;
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
  }, [featuredLen]);

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
      className="relative h-screen bg-black overflow-hidden flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-suppress
    >

      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        onClick={() => {
          if (swipingRef.current) return;
          router.push(`/work/${current.slug}`);
        }}
        data-cursor={current.type === "video" ? "Lire" : "Voir"}
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
            {/* Scroll affordance — desktop only (wheel gesture hint).
                Mobile users discover horizontal swipe naturally, no label needed. */}
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

            {/* Vertical index — hover to preview, click to open. Same vertical center as the title. */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end pointer-events-auto">
              {FEATURED.map((p, i) => (
                <button
                  key={p.slug}
                  onMouseEnter={() => setIndex(i)}
                  onFocus={() => setIndex(i)}
                  onClick={() => router.push(`/work/${p.slug}`)}
                  className="label text-white tabular-nums transition-opacity duration-300 px-4 py-2"
                  style={{ opacity: i === index ? 0.7 : 0.18 }}
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
                      opacity: filter === f.value ? 0.9 : 0.4,
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

            {/* Magnetic title */}
            <motion.h1
              className="text-white title"
              style={{ fontSize: "clamp(2.5rem, 9vw, 11rem)" }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.62, ease: SOFT }}
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
            </motion.h1>

            <motion.p
              className="label text-white"
              style={{ opacity: 0.28, letterSpacing: "0.22em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.28 }}
              transition={{ duration: 0.8, delay: 0.92 }}
            >
              Bordeaux — Paris
            </motion.p>
          </div>

          {/* Bottom nav — on mobile, leave room for the fixed filter bar below. */}
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
                style={{ opacity: 0.5 }}
              >
                {FEATURED[(index - 1 + FEATURED.length) % FEATURED.length].title}
              </span>
            </button>

            <div className="flex flex-col items-center gap-2 pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  className="flex flex-col items-center gap-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35, ease: SOFT }}
                >
                  <span
                    className="text-white title text-center"
                    style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)", opacity: 0.75 }}
                  >
                    {current.title}
                  </span>
                  <span className="label text-white" style={{ opacity: 0.45 }}>
                    {String(index + 1).padStart(2, "0")} / {String(FEATURED.length).padStart(2, "0")}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={goNext}
              className="flex items-center gap-3 justify-end group text-right pointer-events-auto px-3 py-3 -mx-3"
              aria-label="Projet suivant"
            >
              <span
                className="label text-white hidden md:inline group-hover:opacity-100 transition-opacity duration-300"
                style={{ opacity: 0.5 }}
              >
                {FEATURED[(index + 1) % FEATURED.length].title}
              </span>
              <span
                className="block h-px bg-white group-hover:opacity-80 transition-all duration-500"
                style={{ width: 24, opacity: 0.45 }}
              />
            </button>
          </motion.div>
        </motion.div>

        {/* Mobile-only fixed filter bar — thumb-reachable, overrides the in-hero filter. */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/10"
          style={{
            backgroundColor: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          aria-label="Filtrer par discipline"
        >
          <div className="flex items-center justify-around px-2 py-3">
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className="label text-white relative px-4 py-2 transition-opacity duration-300 focus:outline-none"
                  style={{
                    opacity: active ? 0.95 : 0.4,
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
