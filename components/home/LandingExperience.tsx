"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import Hero from "@/components/home/Hero";
import PhotoProject from "@/components/project/PhotoProject";
import VideoProject from "@/components/project/VideoProject";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  initialSlug: string | null;
}

// The landing *is* the project view. When a project is active we keep the same
// page mounted, update the URL with pushState (no navigation), pin the Hero,
// and render the project content below it. This avoids the jarring "new page"
// feel — the landing just transforms.
export default function LandingExperience({ initialSlug }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(initialSlug);

  const active = activeSlug
    ? projects.find((p) => p.slug === activeSlug) ?? null
    : null;

  // Sync state with back/forward navigation so the browser buttons work too.
  useEffect(() => {
    const onPop = () => {
      const match = window.location.pathname.match(/^\/work\/(.+?)\/?$/);
      setActiveSlug(match ? decodeURIComponent(match[1]) : null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Client-side title for bookmarked in-page transitions.
  useEffect(() => {
    if (active) {
      document.title = `${active.title} — Nicolas Sempere`;
    } else {
      document.title = "Nicolas Sempere — Photo, Film, 3D";
    }
  }, [active]);

  const openProject = useCallback((slug: string) => {
    setActiveSlug(slug);
    window.history.pushState({}, "", `/work/${slug}`);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const closeProject = useCallback(() => {
    setActiveSlug(null);
    window.history.pushState({}, "", "/");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // ESC to close.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, closeProject]);

  const handleNavigate = useCallback(
    (slug: string) => {
      if (slug === "") closeProject();
      else openProject(slug);
    },
    [openProject, closeProject],
  );

  const idx = active ? projects.indexOf(active) : -1;
  const prev = active && idx > 0 ? projects[idx - 1] : null;
  const next = active && idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <div className="relative">
      <Hero
        activeProject={active}
        onOpenProject={openProject}
        onCloseProject={closeProject}
      />
      {active && (
        <div className="relative z-10 bg-black">
          {active.type === "video" || active.videoUrl ? (
            <VideoProject
              project={active}
              prev={prev}
              next={next}
              mode="embedded"
              onNavigate={handleNavigate}
            />
          ) : (
            <PhotoProject
              project={active}
              prev={prev}
              next={next}
              mode="embedded"
              onNavigate={handleNavigate}
            />
          )}
        </div>
      )}

      {/* Back button — rendered at the top level (outside Hero's sticky stacking
          context) so it stays above the project content no matter how far you've
          scrolled. mix-blend-mode: difference keeps it readable on any frame. */}
      <AnimatePresence>
        {active && (
          <motion.button
            key="landing-back"
            type="button"
            onClick={closeProject}
            aria-label="Retour aux projets"
            className="hero-back-button fixed top-20 left-6 md:top-24 md:left-10 z-[90] group flex items-center gap-4 py-2 hover:opacity-100 transition-opacity duration-300"
            style={{
              mixBlendMode: "difference",
              color: "#fff",
              opacity: 0.95,
            }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 0.95, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: SOFT }}
          >
            <span
              aria-hidden="true"
              className="block h-px bg-white transition-all duration-500 group-hover:w-16"
              style={{ width: 40, opacity: 0.85 }}
            />
            <span
              className="label text-white"
              style={{ fontSize: "13px", letterSpacing: "0.38em" }}
            >
              Retour
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
