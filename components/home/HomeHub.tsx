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
        className="block"
        data-cursor={project.type === "video" ? "Play" : "View"}
      >
        {/* Image */}
        <div
          className={`relative w-full ${s.aspect}`}
          style={{ backgroundColor: project.coverPlaceholder }}
        >
          <div className="placeholder-img text-white h-full">Image</div>

          {/* Hover overlay — pure CSS, no motion div = no artifact */}
          <div
            className="absolute inset-0 bg-black flex flex-col justify-end p-5"
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            <p
              className="text-white font-light leading-tight"
              style={{ fontSize: "clamp(1rem, 2vw, 1.75rem)", letterSpacing: "0.05em" }}
            >
              {project.title}
            </p>
            <p className="label text-white mt-2" style={{ opacity: 0.4 }}>
              {project.role}
            </p>
          </div>

          {/* Index badge */}
          <span
            className="absolute top-3 left-3 label text-white"
            style={{
              opacity: hovered ? 0 : 0.35,
              transition: "opacity 0.2s ease",
            }}
          >
            [{num}]
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between pt-2.5 pb-1">
          <span className="label text-white" style={{ opacity: 0.55 }}>
            {project.title}
          </span>
          <span className="label text-white" style={{ opacity: 0.3 }}>
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
    <div className="bg-black min-h-screen pb-24">
      {/* Identity */}
      <div className="px-6 md:px-10 pt-20 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <h1
          className="text-white font-light uppercase tracking-widest"
          style={{ fontSize: "clamp(1.5rem, 4vw, 4rem)", letterSpacing: "0.2em" }}
        >
          Nicolas Sempere
        </h1>
        <p className="label text-white pb-1" style={{ opacity: 0.4 }}>
          Photographer — Filmmaker — Bordeaux&nbsp;/&nbsp;Paris
        </p>
      </div>

      {/* Filters */}
      <div className="px-6 md:px-10 py-4 border-b border-white/10 flex items-center justify-between">
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
                  layoutId="filter-line"
                  className="absolute bottom-0 left-0 right-0 h-px bg-white"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </div>
        <span className="label text-white shrink-0 hidden md:block" style={{ opacity: 0.25 }}>
          {visible.length} projects
        </span>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-10 pt-6">
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
    </div>
  );
}
