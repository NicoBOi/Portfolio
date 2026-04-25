"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";

interface Props {
  // prev / next stay in the signature so PhotoProject + VideoProject keep
  // compiling; they're no longer rendered. The bottom of a project is now
  // a single "Retour aux projets" affordance.
  prev?: Project | null;
  next?: Project | null;
  onNavigate?: (slug: string) => void;
}

export default function ProjectNav({ onNavigate }: Props) {
  const handleBack = (e: React.MouseEvent) => {
    if (!onNavigate) return;
    e.preventDefault();
    // LandingExperience treats an empty slug as "close project".
    onNavigate("");
  };

  const linkClass =
    "group inline-flex items-center gap-4 py-3 -my-3 hover:opacity-100 transition-opacity";
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="block h-px bg-white transition-all duration-500 group-hover:w-16"
        style={{ width: 32, opacity: 0.7 }}
      />
      <span
        className="label text-white"
        style={{ letterSpacing: "0.4em", fontSize: "12px" }}
      >
        Retour aux projets
      </span>
    </>
  );

  return (
    <div className="px-6 md:px-10 py-14 md:py-20 flex justify-center">
      {onNavigate ? (
        <Link
          href="/"
          onClick={handleBack}
          aria-label="Retour aux projets"
          className={linkClass}
          style={{ opacity: 0.85 }}
        >
          {inner}
        </Link>
      ) : (
        <Link
          href="/"
          aria-label="Retour aux projets"
          className={linkClass}
          style={{ opacity: 0.85 }}
        >
          {inner}
        </Link>
      )}
    </div>
  );
}
