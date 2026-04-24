"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";

interface Props {
  prev: Project | null;
  next: Project | null;
  // When provided, prev/next/home clicks stay on the current page and swap
  // the active project in place instead of navigating. Used by LandingExperience.
  onNavigate?: (slug: string) => void;
}

export default function ProjectNav({ prev, next, onNavigate }: Props) {
  const prevHref = prev ? `/work/${prev.slug}` : "#";
  const nextHref = next ? `/work/${next.slug}` : "#";

  const handlePrev = (e: React.MouseEvent) => {
    if (!onNavigate || !prev) return;
    e.preventDefault();
    onNavigate(prev.slug);
  };
  const handleNext = (e: React.MouseEvent) => {
    if (!onNavigate || !next) return;
    e.preventDefault();
    onNavigate(next.slug);
  };
  const handleHome = (e: React.MouseEvent) => {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate("");
  };

  return (
    <div className="px-6 md:px-10 py-8 border-t border-white/10 grid grid-cols-3 items-center gap-4">
      <div>
        {prev && (
          <Link
            href={prevHref}
            onClick={handlePrev}
            className="group flex items-center gap-3"
          >
            <span className="block w-5 h-px bg-white opacity-35 group-hover:w-10 group-hover:opacity-80 transition-all duration-400" />
            <div>
              <p className="label text-white mb-1" style={{ opacity: 0.5 }}>Précédent</p>
              <p
                className="text-white title"
                style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)" }}
              >
                {prev.title}
              </p>
            </div>
          </Link>
        )}
      </div>

      <div className="flex justify-center">
        <Link
          href="/"
          onClick={handleHome}
          className="label text-white hover:opacity-100 transition-opacity duration-300"
          style={{ opacity: 0.55 }}
        >
          ← Tous les projets
        </Link>
      </div>

      <div className="flex justify-end">
        {next && (
          <Link
            href={nextHref}
            onClick={handleNext}
            className="group flex items-center gap-3 text-right"
          >
            <div>
              <p className="label text-white mb-1" style={{ opacity: 0.5 }}>Suivant</p>
              <p
                className="text-white title"
                style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)" }}
              >
                {next.title}
              </p>
            </div>
            <span className="block w-5 h-px bg-white opacity-35 group-hover:w-10 group-hover:opacity-80 transition-all duration-400" />
          </Link>
        )}
      </div>
    </div>
  );
}
