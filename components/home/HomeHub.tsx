"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import type { ProjectType } from "@/data/projects";

type Filter = "all" | ProjectType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "experimental", label: "Experimental" },
];

const SIZES = [
  { cols: "md:col-span-7", aspect: "aspect-[4/3]" },
  { cols: "md:col-span-5", aspect: "aspect-[3/4]" },
  { cols: "md:col-span-5", aspect: "aspect-[3/4]" },
  { cols: "md:col-span-7", aspect: "aspect-[4/3]" },
  { cols: "md:col-span-6", aspect: "aspect-[16/9]" },
  { cols: "md:col-span-6", aspect: "aspect-[3/4]" },
];

function ProjectThumb({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const s = SIZES[index % SIZES.length];
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className={`col-span-12 ${s.cols}`}>
      <Link
        href={`/work/${project.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block group"
        data-cursor={project.type === "video" ? "Play" : "View"}
      >
        {/* Image container — no bg-white overlay, use filter instead */}
        <div
          className={`relative w-full ${s.aspect}`}
          style={{ backgroundColor: project.coverPlaceholder }}
        >
          {/* Placeholder label */}
          <div
            className="absolute inset-0 flex items-center justify-center font-mono text-[9px] tracking-widest uppercase text-white/20"
            style={{
              filter: hovered ? "brightness(0.25)" : "brightness(1)",
              transition: "filter 0.2s ease",
            }}
          >
            Image
          </div>

          {/* Dark overlay on hover — no white, no artifact */}
          <div
            className="absolute inset-0 bg-black"
            style={{
              opacity: hovered ? 0.72 : 0,
              transition: "opacity 0.2s ease",
            }}
          />

          {/* Title reveals on hover */}
          <div
            className="absolute inset-0 flex flex-col justify-end p-5"
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            <p
              className="font-display font-bold text-white leading-none"
              style={{
                fontSize: "clamp(1.1rem, 2.2vw, 2rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {project.title}
            </p>
            <p className="label text-white mt-2" style={{ opacity: 0.45 }}>
              {project.role}
            </p>
          </div>

          {/* Index — top left */}
          <span
            className="absolute top-3 left-3 label text-white"
            style={{ opacity: hovered ? 0 : 0.3, transition: "opacity 0.2s ease" }}
          >
            [{num}]
          </span>

          {/* Type — top right, only for non-photo */}
          {project.type !== "photo" && (
            <span
              className="absolute top-3 right-3 label text-white"
              style={{ opacity: hovered ? 0 : 0.25, transition: "opacity 0.2s ease" }}
            >
              {project.type === "video" ? "Video" : "Exp."}
            </span>
          )}
        </div>

        {/* Meta row — catalog style */}
        <div className="flex items-center justify-between pt-2.5 pb-1">
          <span
            className="label text-white"
            style={{ opacity: 0.6 }}
          >
            {project.title}
          </span>
          <span className="label text-white" style={{ opacity: 0.35 }}>
            {project.year}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function HomeHub() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.type === (filter as ProjectType));

  return (
    <div className="bg-black min-h-screen">
      {/* ── Identity strip ──────────────────────────── */}
      <div className="px-5 md:px-8 pt-20 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <h1
          className="font-display font-bold text-white leading-none"
          style={{
            fontSize: "clamp(2rem, 5.5vw, 5.5rem)",
            letterSpacing: "-0.03em",
          }}
        >
          Nicolas Sempere
        </h1>
        <p className="label text-white pb-1" style={{ opacity: 0.45 }}>
          Photographer &mdash; Filmmaker &mdash; Bordeaux&nbsp;/&nbsp;Paris
        </p>
      </div>

      {/* ── Filter bar ──────────────────────────────── */}
      <div className="px-5 md:px-8 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="relative label text-white shrink-0 pb-1.5 hover:opacity-100 transition-opacity duration-200"
              style={{ opacity: filter === value ? 1 : 0.35 }}
            >
              {label}
              {filter === value && (
                <motion.span
                  layoutId="hub-filter"
                  className="absolute bottom-0 left-0 right-0 h-px bg-white"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </div>
        <span className="label text-white shrink-0 hidden md:block" style={{ opacity: 0.3 }}>
          {visible.length}&nbsp;projects
        </span>
      </div>

      {/* ── Grid ────────────────────────────────────── */}
      <div className="px-5 md:px-8 pt-6 pb-16">
        <div className="grid grid-cols-12 gap-x-3 md:gap-x-5 gap-y-10 md:gap-y-14">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.slug}
                className={`col-span-12 ${SIZES[i % SIZES.length].cols}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: (i % 4) * 0.05 }}
                layout
              >
                <ProjectThumb project={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────── */}
      <div className="px-5 md:px-8 py-8 border-t border-white/10 flex items-center justify-between">
        <span className="label text-white" style={{ opacity: 0.2 }}>
          &copy; 2025 Nicolas Sempere
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/nicolas_Sempere"
            target="_blank"
            rel="noopener noreferrer"
            className="label text-white transition-opacity duration-300 hover:opacity-60"
            style={{ opacity: 0.2 }}
          >
            Instagram
          </a>
          <a
            href="mailto:nicosmp.pro@gmail.com"
            className="label text-white transition-opacity duration-300 hover:opacity-60"
            style={{ opacity: 0.2 }}
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
