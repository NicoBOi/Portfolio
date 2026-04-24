"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { projects, type Project, type ProjectType } from "@/data/projects";

const ALL_FEATURED = projects.filter((p) => p.featured);
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Filter = "all" | ProjectType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "photo", label: "Photo" },
  { value: "video", label: "Film" },
  { value: "3d", label: "3D" },
];

function getVimeoId(url?: string): string | null {
  return url ? url.match(/vimeo\.com\/(\d+)/)?.[1] ?? null : null;
}

function hasVideo(p: Project): boolean {
  return Boolean(p.youtubeId || getVimeoId(p.videoUrl));
}

function thumbFor(p: Project): { src: string | null; bg: string } {
  if (p.imageFiles && p.imageFiles[0]) {
    return { src: `/projects/${p.slug}/${p.imageFiles[0]}`, bg: p.coverPlaceholder };
  }
  if (p.youtubeId) {
    return { src: `https://img.youtube.com/vi/${p.youtubeId}/maxresdefault.jpg`, bg: p.coverPlaceholder };
  }
  const vId = getVimeoId(p.videoUrl);
  if (vId) return { src: `https://vumbnail.com/${vId}_large.jpg`, bg: p.coverPlaceholder };
  return { src: null, bg: p.coverPlaceholder };
}

function discipline(type: ProjectType): string {
  if (type === "photo") return "Photo";
  if (type === "video") return "Film";
  return "3D";
}

// Fills the card with a muted, looping, auto-playing video sized to cover.
function VideoCover({ project }: { project: Project }) {
  const yt = project.youtubeId;
  const vId = !yt ? getVimeoId(project.videoUrl) : null;

  if (yt) {
    const ratio = 16 / 9;
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&playsinline=1&vq=hd1080`}
        className="absolute top-1/2 left-1/2 border-0 pointer-events-none"
        style={{
          width: `max(100vw, calc(100vh * ${ratio}))`,
          height: `max(calc(100vw / ${ratio}), 100vh)`,
          transform: "translate(-50%, -50%)",
          backgroundColor: "#000",
        }}
        allow="autoplay; encrypted-media; picture-in-picture"
        title={project.title}
      />
    );
  }
  if (vId) {
    const [aw, ah] = (project.videoAspect ?? "16/9").split("/").map(Number);
    const ratio = aw / ah;
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vId}?background=1&autoplay=1&loop=1&muted=1&dnt=1&quality=1080p&playsinline=1`}
        className="absolute top-1/2 left-1/2 border-0 pointer-events-none"
        style={{
          width: `max(100vw, calc(100vh * ${ratio}))`,
          height: `max(calc(100vw / ${ratio}), 100vh)`,
          transform: "translate(-50%, -50%)",
          backgroundColor: "#000",
        }}
        allow="autoplay; picture-in-picture"
        title={project.title}
      />
    );
  }
  return null;
}

export default function HeroMobile() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? ALL_FEATURED : ALL_FEATURED.filter((p) => p.type === filter);

  // Track which card is currently in view so we only mount ONE video iframe at a time.
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, visible.length);
    setActiveIndex(-1);
  }, [visible.length, filter]);

  useEffect(() => {
    if (visible.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLButtonElement);
            if (idx >= 0) setActiveIndex(idx);
          }
        }
      },
      { threshold: [0, 0.55, 1] }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [visible]);

  return (
    <>
      {/* Hero identity — shorter than viewport so the first card peeks underneath. */}
      <section className="bg-black flex flex-col items-center px-6 text-center" style={{ minHeight: "82vh" }}>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 pt-16">
          <motion.h1
            className="text-white title"
            style={{ fontSize: "clamp(2.8rem, 12vw, 5rem)", lineHeight: 1 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: SOFT }}
          >
            Nicolas Sempere
          </motion.h1>
          <motion.p
            className="label text-white"
            style={{ opacity: 0.5, letterSpacing: "0.28em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Bordeaux — Paris
          </motion.p>
        </div>
        <motion.p
          className="label text-white pb-8"
          style={{ opacity: 0.5 }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0.5, y: [0, 4, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.7 },
            y: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.3 },
          }}
        >
          ↓ Projets
        </motion.p>
      </section>

      {/* Vertical feed — one card per viewport, scroll-snaps */}
      <section className="bg-black" style={{ scrollSnapType: "y mandatory" }}>
        {visible.map((p, i) => {
          const thumb = thumbFor(p);
          const isActive = i === activeIndex;
          const video = hasVideo(p);
          return (
            <button
              key={p.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              type="button"
              onClick={() => router.push(`/work/${p.slug}`)}
              className="relative block w-full text-left overflow-hidden"
              style={{
                height: "100vh",
                scrollSnapAlign: "start",
                backgroundColor: thumb.bg,
              }}
              aria-label={`Ouvrir ${p.title}`}
            >
              {/* Thumbnail — always present. Works as a poster while the iframe loads. */}
              {thumb.src && (
                <img
                  src={thumb.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              )}

              {/* Video iframe — only mounted for the active card so we never have
                  more than one playing at a time. Autoplays muted + playsinline. */}
              {video && isActive && <VideoCover project={p} />}

              {/* Bottom gradient for legibility */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%)",
                }}
              />
              {/* Content overlay — above the bottom filter bar */}
              <div className="absolute inset-x-6 text-white" style={{ bottom: "7rem" }}>
                <p className="label" style={{ opacity: 0.6 }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2
                  className="title mt-2"
                  style={{ fontSize: "clamp(1.8rem, 7vw, 2.6rem)", lineHeight: 1.05 }}
                >
                  {p.title}
                </h2>
                <p className="label mt-3" style={{ opacity: 0.75 }}>
                  {discipline(p.type)} · {p.year}
                </p>
              </div>
            </button>
          );
        })}

        {/* End CTA — full viewport, calm close */}
        <div
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6"
          style={{ scrollSnapAlign: "start", paddingBottom: "7rem" }}
        >
          <p className="label text-white" style={{ opacity: 0.45, letterSpacing: "0.28em" }}>
            Un projet ?
          </p>
          <Link
            href="/contact"
            className="text-white title hover:opacity-100 transition-opacity duration-300"
            style={{
              fontSize: "clamp(2.5rem, 11vw, 4rem)",
              lineHeight: 1,
              opacity: 0.9,
            }}
          >
            Écrivez-moi →
          </Link>
          <p className="label text-white mt-4" style={{ opacity: 0.4 }}>
            Réponse sous 24h
          </p>
        </div>
      </section>

      {/* Fixed bottom filter bar — thumb-reachable, always visible */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10"
        style={{
          backgroundColor: "rgba(0,0,0,0.75)",
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
                    layoutId="hero-mobile-filter-underline"
                    className="absolute left-4 right-4 bottom-1 h-px bg-white"
                    transition={{ duration: 0.3, ease: SOFT }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
