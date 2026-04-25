"use client";

import { useEffect, useState, useCallback } from "react";
import { projects } from "@/data/projects";
import Hero from "@/components/home/Hero";
import ProjectOverlay from "@/components/project/ProjectOverlay";

interface Props {
  initialSlug: string | null;
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

  // Sync state with back/forward navigation. We accept both URL forms:
  //   - /?project=slug  (in-app default)
  //   - /work/slug      (legacy SSR entry point, still routed to this page)
  useEffect(() => {
    const readSlug = () => {
      const path = window.location.pathname;
      const m = path.match(/^\/work\/(.+?)\/?$/);
      if (m) return decodeURIComponent(m[1]);
      const q = new URLSearchParams(window.location.search).get("project");
      return q ? decodeURIComponent(q) : null;
    };
    const onPop = () => setActiveSlug(readSlug());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
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
  // shuffle the carousel underneath. The Hero's visible chrome is fully
  // covered by the overlay, so the morphed-title side effect happens off
  // screen and doesn't matter.
  return (
    <div className="relative">
      <Hero activeProject={active} onOpenProject={openProject} />
      <ProjectOverlay project={active} onClose={closeProject} />
    </div>
  );
}
