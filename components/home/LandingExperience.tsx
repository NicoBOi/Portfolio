"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { projects } from "@/data/projects";
import Hero from "@/components/home/Hero";
import ProjectOverlay from "@/components/project/ProjectOverlay";

interface Props {
  initialSlug: string | null;
}

function readSlugFromUrl(): string | null {
  const path = window.location.pathname;
  const m = path.match(/^\/work\/(.+?)\/?$/);
  if (m) return decodeURIComponent(m[1]);
  const q = new URLSearchParams(window.location.search).get("project");
  return q ? decodeURIComponent(q) : null;
}

// The landing always renders Hero in browse mode. Clicking a project pops up
// a fixed black-letterbox overlay with the project's media centered and the
// title / role / meta arranged around it — no scroll, no sub-page. URL is
// updated shallowly to /?project=slug so links remain shareable.
export default function LandingExperience({ initialSlug }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(initialSlug);

  const active = activeSlug
    ? projects.find((p) => p.slug === activeSlug) ?? null
    : null;

  // Hydrate from the URL on mount (so a hard refresh on /?project=slug
  // re-opens the overlay) and stay in sync with back/forward navigation.
  // We accept both URL forms:
  //   - /?project=slug  (in-app default + shareable refresh-safe link)
  //   - /work/slug      (SSR entry point, still routed to this page)
  useEffect(() => {
    const fromUrl = readSlugFromUrl();
    if (fromUrl !== activeSlug) setActiveSlug(fromUrl);
    const onPop = () => setActiveSlug(readSlugFromUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Client-side title for in-page transitions.
  useEffect(() => {
    if (active) {
      document.title = `${active.title} — Nicolas Sempere`;
    } else {
      document.title = "Nicolas Sempere — Photo, Film, 3D";
    }
  }, [active]);

  // Block pull-to-refresh + rubber-band on mobile while the overlay is up.
  useEffect(() => {
    document.documentElement.classList.toggle("project-active", !!active);
    return () => document.documentElement.classList.remove("project-active");
  }, [active]);

  const openProject = useCallback((slug: string) => {
    setActiveSlug(slug);
    window.history.pushState({}, "", `/?project=${encodeURIComponent(slug)}`);
  }, []);

  const closeProject = useCallback(() => {
    setActiveSlug(null);
    window.history.pushState({}, "", "/");
  }, []);

  // ESC + window-level close event (the site Navigation can dispatch this to
  // trigger the same close path without duplicating the pushState wiring).
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

  // We pass activeProject through to Hero so its wheel / keyboard / touch
  // carousel handlers stay disarmed while the overlay is up — without this,
  // gestures land on Hero through the overlay's body-scroll-lock and silently
  // shuffle the carousel underneath.
  // Cycle through projects in array order; prev/next always wrap so the
  // visitor never hits a dead end.
  const { prevProject, nextProject } = useMemo(() => {
    if (!active) return { prevProject: null, nextProject: null };
    const idx = projects.indexOf(active);
    const len = projects.length;
    return {
      prevProject: projects[(idx - 1 + len) % len] ?? null,
      nextProject: projects[(idx + 1) % len] ?? null,
    };
  }, [active]);

  const onOpenPrev = useCallback(
    () => prevProject && openProject(prevProject.slug),
    [prevProject, openProject],
  );
  const onOpenNext = useCallback(
    () => nextProject && openProject(nextProject.slug),
    [nextProject, openProject],
  );

  return (
    <div className="relative">
      <Hero activeProject={active} onOpenProject={openProject} />
      <ProjectOverlay
        project={active}
        prevProject={prevProject}
        nextProject={nextProject}
        onClose={closeProject}
        onOpenPrev={onOpenPrev}
        onOpenNext={onOpenNext}
      />
    </div>
  );
}
