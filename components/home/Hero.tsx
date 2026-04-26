"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Player from "@vimeo/player";
import { projects, type Project } from "@/data/projects";
import { getVimeoId } from "@/lib/video";

const ALL_FEATURED = projects.filter((p) => p.featured);
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
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

interface HeroProps {
  // When set, the hero enters "project mode": filters/index/prev-next fade
  // out, the central title morphs to the project's name + description, the
  // section becomes position:sticky so it pins while the project content
  // scrolls into view below. Null = the normal landing browse experience.
  activeProject?: Project | null;
  onOpenProject?: (slug: string) => void;
}

export default function Hero({
  activeProject = null,
  onOpenProject,
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
  // Track viewport width + mobile flag. The mobile-only Instagram-style
  // drag carousel needs the actual pixel width to drive its `animate.x`
  // and dragConstraints. SSR ships isMobile=false; after mount we read
  // the real value and the desktop AnimatePresence vs mobile drag track
  // resolves to the right path.
  const [vw, setVw] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVw(w);
      setIsMobile(w < 768);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // "Tout" keeps the curated featured highlight reel; a discipline filter
  // opens up to the full catalogue of that type so nothing gets hidden when
  // the viewer explicitly asks "show me photos / films / 3D".
  const FEATURED = useMemo(
    () => (filter === "all" ? ALL_FEATURED : projects.filter((p) => p.type === filter)),
    [filter],
  );
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
  // so wheel / swipe transitions + filter changes don't stall on a network
  // fetch. We also fire prefetch link tags for the videoFiles of the next
  // two featured projects so the mobile carousel's first swipe lands on
  // already-buffered media. Runs on requestIdleCallback so it never
  // competes with the LCP paint (Safari falls back to a short setTimeout).
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const warm = () => {
      ALL_FEATURED.forEach((p) => {
        const first = p.imageFiles?.[0];
        if (first) {
          const img = new window.Image();
          img.decoding = "async";
          img.src = `/projects/${p.slug}/${first}`;
        }
      });
      // Slot 0 is already preloaded by the SSR <link> in the layout.
      // Prefetch the next two video files so the swipe / wheel into them
      // is instant on a cold visit.
      ALL_FEATURED.slice(1, 3).forEach((p) => {
        if (!p.videoFile) return;
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "video";
        link.href = `/projects/${p.slug}/${p.videoFile}`;
        document.head.appendChild(link);
        links.push(link);
      });
    };
    type IC = (cb: () => void, opts?: { timeout?: number }) => number;
    const ric = (window as unknown as { requestIdleCallback?: IC }).requestIdleCallback;
    let id: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (ric) {
      id = ric(warm, { timeout: 800 });
    } else {
      timer = setTimeout(warm, 120);
    }
    return () => {
      if (id !== undefined) {
        (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
      }
      if (timer) clearTimeout(timer);
      links.forEach((l) => l.remove());
    };
  }, []);

  // Wheel — one swap per intentional gesture. A gesture is closed as soon
  // as 100ms passes between two wheel events (Mac trackpad inertia fires
  // every 16-50ms while flinging, so the 100ms gate cleanly catches the
  // end). A separate 200ms minimum between swaps protects against pure
  // spam without making the chain feel locked. Between two deliberate
  // scroll gestures with normal human pacing (>200ms apart) the user
  // gets one swap each, immediately.
  const featuredLen = FEATURED.length;
  useEffect(() => {
    if (isProject || featuredLen <= 1) return;
    const GESTURE_END_MS = 100;
    const MIN_SWAP_GAP_MS = 200;
    let lastWheel = 0;
    let lastSwap = 0;
    let inGesture = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 8) return;
      const now = performance.now();
      if (now - lastWheel > GESTURE_END_MS) inGesture = false;
      lastWheel = now;
      if (!inGesture && now - lastSwap >= MIN_SWAP_GAP_MS) {
        inGesture = true;
        lastSwap = now;
        setIndex((i) =>
          e.deltaY > 0
            ? (i + 1) % featuredLen
            : (i - 1 + featuredLen) % featuredLen,
        );
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [featuredLen, isProject]);

  // Keyboard navigation on the landing. Arrows cycle the carousel, Enter/Space
  // opens the currently-highlighted project. Ignored in project mode (that
  // view has its own ESC-to-close wired at the LandingExperience level).
  useEffect(() => {
    if (isProject || featuredLen <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((i) => (i + 1) % featuredLen);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => (i - 1 + featuredLen) % featuredLen);
      } else if (e.key === "Enter" || e.key === " ") {
        // Space scroll is irrelevant on the landing (touch-action: none) so
        // repurposing it as "open" costs nothing and matches keyboard muscle
        // memory for carousels.
        e.preventDefault();
        const target = FEATURED[index];
        if (target) openProject(target.slug);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // Depend on index so the Enter handler always opens the current slide;
    // FEATURED is derived from filter so it refreshes on filter changes too.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredLen, isProject, index, filter]);

  // Touch swipe is handled by the mobile drag track now (framer-motion
  // drag at the slide-track level). The window-level listener stays
  // disarmed so it doesn't fight with the carousel's own gesture.
  const swipingRef = useRef(false);
  // Manual tap detector for the mobile drag track — see onPointerDown /
  // onPointerUp on that motion.div.
  const pressRef = useRef<{ x: number; y: number; t: number } | null>(null);

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

  return (
    <section
      className={`${
        isProject
          ? "sticky top-0 z-0"
          : "relative"
      } h-screen h-dvh bg-black overflow-hidden flex flex-col`}
      onMouseMove={isProject ? undefined : handleMouseMove}
      onMouseLeave={isProject ? undefined : handleMouseLeave}
      // In landing browse mode every gesture is handled in JS (vertical swipe
      // drives the carousel; horizontal is ignored). touch-action: none lets
      // our listeners own the full gesture surface, kills rubber-band bounce,
      // and stops the browser from fighting us mid-swipe.
      style={!isProject ? { touchAction: "none" } : undefined}
      data-cursor-suppress
    >

      {/* Back button used to live here, but the sticky hero creates its own
          stacking context at z-0 — once the project content (z-10) scrolled
          over the hero, the button was hidden. It's now rendered at the
          LandingExperience level so it can sit above both layers. */}

      {/* Background. An outer motion.div holds the scale animation so the
          transition into / out of project mode reads as a subtle push-in on
          the media — enough to signal "you entered the project" without
          turning it into an effect. Carousel swaps are still handled by the
          inner AnimatePresence crossfade. */}
      <motion.div
        className="absolute inset-0 z-0"
        onClick={() => {
          if (isProject) return;
          // On mobile the inner drag track owns taps via its own onTap —
          // letting this fire too would call openProject twice. Desktop
          // keeps it as the click target for the centred backdrop.
          if (isMobile) return;
          if (swipingRef.current) return;
          openProject(current.slug);
        }}
        data-cursor={isProject ? undefined : current.type === "video" ? "Lire" : "Voir"}
        data-cursor-silent
        animate={{ scale: isProject ? 1.05 : 1 }}
        transition={{ duration: 0.9, ease: SOFT }}
      >
          {isMobile && !isProject ? (
            /* Mobile carousel — Instagram-style. The track holds every
               FEATURED slide side by side, follows the finger via
               framer-motion drag, and snaps to the nearest slide on
               release (or to a neighbour past the velocity threshold).
               Only the active slide ± 1 carry the full media so we never
               keep more than three videos / iframes alive at once. */
            <motion.div
              className="absolute inset-0 flex"
              style={{ width: `${featuredLen * 100}vw`, touchAction: "pan-y" }}
              drag="x"
              dragConstraints={{ left: -(featuredLen - 1) * vw, right: 0 }}
              dragElastic={0.12}
              dragMomentum={false}
              animate={{ x: -index * vw }}
              transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.6 }}
              onDragEnd={(_, info) => {
                const { offset, velocity } = info;
                const SNAP = vw * 0.18;
                const VEL = 360;
                if ((offset.x < -SNAP || velocity.x < -VEL) && index < featuredLen - 1) {
                  setIndex((i) => i + 1);
                } else if ((offset.x > SNAP || velocity.x > VEL) && index > 0) {
                  setIndex((i) => i - 1);
                }
              }}
              // Manual tap detection — framer-motion's onTap was firing
              // for any swipe that didn't quite cross its internal drag
              // threshold, which on mobile meant "I tried to swipe but
              // ended up opening the project". Track the pointer
              // ourselves and only treat it as a tap if it moved less
              // than 6 px and lifted within 400 ms.
              onPointerDown={(e) => {
                pressRef.current = {
                  x: e.clientX,
                  y: e.clientY,
                  t: performance.now(),
                };
              }}
              onPointerUp={(e) => {
                const start = pressRef.current;
                pressRef.current = null;
                if (!start) return;
                const dx = Math.abs(e.clientX - start.x);
                const dy = Math.abs(e.clientY - start.y);
                const dt = performance.now() - start.t;
                if (dx < 6 && dy < 6 && dt < 400 && !isProject) {
                  openProject(current.slug);
                }
              }}
              onPointerCancel={() => {
                pressRef.current = null;
              }}
            >
              {FEATURED.map((p, i) => {
                const dist = Math.abs(i - index);
                const live = dist <= 1;
                const cover = p.imageFiles?.[0]
                  ? `/projects/${p.slug}/${p.imageFiles[0]}`
                  : null;
                return (
                  <div
                    key={p.slug}
                    className="relative shrink-0 w-screen h-full overflow-hidden bg-black"
                  >
                    {live ? (
                      <HeroMediaSlot project={p} priority={i === index} />
                    ) : cover ? (
                      <Image
                        src={cover}
                        alt={p.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: p.coverPlaceholder }}
                      />
                    )}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            /* Plain opacity crossfade. The blur version was killing the GPU
               on full-viewport hero (filter: blur(22px) is a multi-pass
               shader operation that gets heavy on 1440p+). Opacity is a
               single composite step. */
            <AnimatePresence mode="sync">
              <motion.div
                key={index}
                className="absolute inset-0 overflow-hidden bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: SOFT }}
              >
                <HeroMediaSlot project={current} priority />
              </motion.div>
            </AnimatePresence>
          )}

          <div className="absolute inset-0 bg-black/50 pointer-events-none" />

          {/* Animated film grain — sits above the bg media + scrim, below the
              foreground chrome. Visible (opacity .22, mix-blend overlay) but
              fine-grained (180px tile, base frequency 1.1). Skipped under
              prefers-reduced-motion. */}
          <div className="hero-grain" aria-hidden="true" />
        </motion.div>

        {/* Foreground */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.3, ease: SOFT }}
        >
          {/* In project mode on mobile, anchor the title+meta to the bottom of
              the viewport so the cover image reads clean edge-to-edge. Desktop
              keeps the center composition — there's room for both. */}
          <div
            className={`relative flex-1 flex flex-col items-center px-8 text-center gap-4 ${
              isProject
                ? "justify-end pb-40 md:justify-center md:pb-0"
                : "justify-center"
            }`}
          >
            {/* Scroll / swipe affordance on the left edge. Desktop keeps its
                "Scroll" label + 48px rule (wheel cue). Mobile gets a smaller,
                unlabeled 32px rule — just the animation, to balance the
                right-edge 01-08 column without shouting. */}
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
                  animate={{ y: [48, -8] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
                />
              </div>
            </div>

            {/* Right-edge vertical index. Desktop: hover to preview, click
                to open. Mobile: tap to jump (setIndex only), "Ouvrir" opens.
                The scroll-hint rule below the numbers is mobile-only — it
                doubles as the vertical-swipe affordance. */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end pointer-events-auto">
              {FEATURED.map((p, i) => (
                <button
                  key={p.slug}
                  onMouseEnter={() => setIndex(i)}
                  onFocus={() => setIndex(i)}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                      openProject(p.slug);
                    } else {
                      setIndex(i);
                    }
                  }}
                  className="hit-h label text-white tabular-nums transition-opacity duration-300 px-4 py-2 !text-[10px] md:!text-[13px] !tracking-[0.22em] md:!tracking-[0.18em]"
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
                    className="hit-v label text-white transition-opacity duration-300 px-2 py-2 rounded"
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
                className="w-full flex flex-col items-center gap-4 text-center"
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
                {/* Mobile horizontal swipe affordance — sits right under
                    the title block, animates a dot left → right to hint
                    the carousel responds to a horizontal swipe. Desktop
                    keeps the vertical "Scroll" rule on the left edge. */}
                <div className="md:hidden flex justify-center pt-1 pointer-events-none" aria-hidden="true">
                  <div className="relative w-14 h-px bg-white/20 overflow-hidden">
                    <motion.div
                      className="absolute top-0 h-full bg-white"
                      style={{ opacity: 0.75, width: 6 }}
                      animate={{ x: [56, -8] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            </div>
          </div>

          {/* Bottom row — browse mode only. Desktop pairs the current project
              title on the left with the Ouvrir CTA on the right; mobile just
              shows Ouvrir centred. On mobile we position absolutely just
              above the fixed filter bar so the bottom row no longer eats
              into the title area's flex-1 — that lets the title block sit
              perfectly viewport-centred instead of shifted upwards by the
              bottom row's height. Desktop keeps the relative-in-flow
              behaviour with pb-8. */}
          {!isProject && (
          <motion.div
            className="px-6 md:px-10 absolute md:relative left-0 md:left-auto right-0 md:right-auto bottom-[calc(env(safe-area-inset-bottom,0px)+6rem)] md:bottom-auto md:pb-8 flex items-center justify-center md:justify-between md:items-baseline gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <div className="hidden md:block min-w-0 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.slug}
                  className="text-white title block truncate"
                  style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35, ease: SOFT }}
                >
                  {current.title}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Pill CTA — editorial. Static at rest, scales on hover while a
                hairline draws under "Ouvrir" (same underline vocabulary as the
                active filters / nav links). whileTap scales to 0.96 for press
                feedback. No halo, no breath — the DA stays in the label. */}
            <motion.button
              type="button"
              onClick={() => openProject(current.slug)}
              className="pointer-events-auto rounded-full bg-white text-black px-7 md:px-8 py-2.5 md:py-3"
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileTap="tap"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.03 },
                tap: { scale: 0.96 },
              }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              data-cursor={current.type === "video" ? "Lire" : "Voir"}
              aria-label={`Ouvrir ${current.title}`}
            >
              <span className="relative inline-block leading-none">
                <span
                  className="title italic block"
                  style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)" }}
                >
                  Ouvrir
                </span>
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 right-0 -bottom-1 h-px bg-black"
                  style={{ originX: 0 }}
                  variants={{
                    rest: { scaleX: 0, opacity: 0 },
                    hover: { scaleX: 1, opacity: 0.7 },
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
            </motion.button>
          </motion.div>
          )}
        </motion.div>

        {/* Mobile-only fixed filter bar — browse mode only. */}
        {!isProject && (
        <nav
          className="hero-mobile-filter md:hidden fixed bottom-0 left-0 right-0 z-30"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
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
                  className="hit-v label text-white px-4 py-4 transition-opacity duration-300"
                  style={{
                    opacity: active ? 0.95 : 0.5,
                    fontSize: "11px",
                    letterSpacing: "0.32em",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  aria-pressed={active}
                >
                  {f.label}
                  {active && (
                    <motion.span
                      layoutId="hero-filter-bottom-underline"
                      className="absolute left-4 right-4 bottom-2 h-px bg-white"
                      style={{ opacity: 0.75 }}
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
              className="absolute bottom-6 md:bottom-12 left-0 right-0 z-20 pointer-events-none flex flex-col items-center justify-center gap-3"
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
                  animate={{ y: [42, -10] }}
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

// Renders the right media element for a project — self-hosted webm wins,
// then Vimeo, then YouTube, then the cover image as a static fallback.
// Used by both the desktop AnimatePresence path and each slide of the
// mobile drag carousel.
function HeroMediaSlot({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (project.videoFile) {
    const poster = project.imageFiles?.[0]
      ? `/projects/${project.slug}/${project.imageFiles[0]}`
      : undefined;
    return (
      <HeroLocalVideo
        key={project.slug}
        src={`/projects/${project.slug}/${project.videoFile}`}
        poster={poster}
      />
    );
  }
  const vId = getVimeoId(project.videoUrl);
  if (vId) {
    const aspectStr = project.videoAspect ?? "16/9";
    const [aw, ah] = aspectStr.split("/").map(Number);
    return <HeroVimeo vimeoId={vId} ratio={aw / ah} />;
  }
  if (project.youtubeId) {
    return <HeroYouTube youtubeId={project.youtubeId} />;
  }
  if (project.imageFiles && project.imageFiles.length > 0) {
    return (
      <Image
        src={`/projects/${project.slug}/${project.imageFiles[0]}`}
        alt={project.title}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
    );
  }
  return <div className="placeholder-img text-white h-full">Image</div>;
}

// Self-hosted hero loop. Plain <video>, no SDK overhead.
//
// Native poster= shows the project's first image instantly (the file is
// already AVIF, no need to route it through next/image which would fetch
// a *different* optimised URL and waste a request). The WebM streams in
// behind it; browsers swap to the first decoded frame automatically with
// no black gap on screen.
function HeroLocalVideo({ src, poster }: { src: string; poster?: string }) {
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
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

  const ratioStyle = { "--video-ratio": ratio, backgroundColor: "#000" } as React.CSSProperties;

  return (
    <>
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1&dnt=1&quality=1080p&transparent=0`}
        className="hero-video"
        style={ratioStyle}
        allow="autoplay; fullscreen"
        allowFullScreen
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
        style={{ "--video-ratio": 16 / 9, backgroundColor: "#000" } as React.CSSProperties}
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
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
