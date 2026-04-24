"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";

interface Props {
  prev: Project | null;
  next: Project | null;
  // When provided, prev/next clicks stay on the current page and swap the
  // active project in place instead of navigating. Used by LandingExperience.
  onNavigate?: (slug: string) => void;
}

export default function ProjectNav({ prev, next, onNavigate }: Props) {
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

  return (
    <div className="px-6 md:px-10 py-12 md:py-16 grid grid-cols-2 items-center gap-6">
      <div>
        {prev && (
          <Link
            href={`/work/${prev.slug}`}
            onClick={handlePrev}
            className="group inline-flex items-center gap-3 hover:opacity-100 transition-opacity"
            style={{ opacity: 0.85 }}
          >
            <span
              aria-hidden="true"
              className="block h-px bg-white transition-all duration-500 group-hover:w-12"
              style={{ width: 24, opacity: 0.7 }}
            />
            <span
              className="text-white title"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.3rem)" }}
            >
              {prev.title}
            </span>
          </Link>
        )}
      </div>

      <div className="flex justify-end">
        {next && (
          <Link
            href={`/work/${next.slug}`}
            onClick={handleNext}
            className="group inline-flex items-center gap-3 text-right hover:opacity-100 transition-opacity"
            style={{ opacity: 0.85 }}
          >
            <span
              className="text-white title"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.3rem)" }}
            >
              {next.title}
            </span>
            <span
              aria-hidden="true"
              className="block h-px bg-white transition-all duration-500 group-hover:w-12"
              style={{ width: 24, opacity: 0.7 }}
            />
          </Link>
        )}
      </div>
    </div>
  );
}
