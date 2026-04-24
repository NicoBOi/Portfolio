"use client";

import { useEffect, useState, useCallback } from "react";
import { projects } from "@/data/projects";
import Hero from "@/components/home/Hero";
import PhotoProject from "@/components/project/PhotoProject";
import VideoProject from "@/components/project/VideoProject";

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

  // Block pull-to-refresh + rubber-band bounce while a project is open on
  // mobile — otherwise swiping down from the top tears the hero image away
  // from its frame. Class-based so it cleans up on close + route change.
  useEffect(() => {
    document.documentElement.classList.toggle("project-active", !!active);
    return () => document.documentElement.classList.remove("project-active");
  }, [active]);

  // Wrap state + URL updates in document.startViewTransition when the browser
  // supports it (Chromium + latest Safari TP). Progressive enhancement — if
  // the API is missing (Firefox, older browsers) we fall through to a plain
  // setState and the site keeps its Framer-driven motion.
  const withTransition = useCallback((update: () => void) => {
    type ViewDoc = Document & { startViewTransition?: (cb: () => void) => unknown };
    const doc = document as ViewDoc;
    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(update);
    } else {
      update();
    }
  }, []);

  const openProject = useCallback((slug: string) => {
    withTransition(() => setActiveSlug(slug));
    window.history.pushState({}, "", `/work/${slug}`);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [withTransition]);

  const closeProject = useCallback(() => {
    withTransition(() => setActiveSlug(null));
    window.history.pushState({}, "", "/");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [withTransition]);

  // ESC to close, plus a window-level event so the site Navigation (which sits
  // outside this component's tree) can trigger the same smooth close without
  // duplicating the pushState + state wiring.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
    };
    const onCloseEvent = () => closeProject();
    window.addEventListener("keydown", onKey);
    window.addEventListener("portfolio:close-project", onCloseEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portfolio:close-project", onCloseEvent);
    };
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
    </div>
  );
}
