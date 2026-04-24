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
    </div>
  );
}
