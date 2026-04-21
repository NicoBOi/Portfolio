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
  { value: "experimental", label: "Exp." },
];

// Alternating layout rhythm
const SIZES = [
  { cols: "md:col-span-7", aspect: "aspect-[4/3]" },
  { cols: "md:col-span-5", aspect: "aspect-[3/4]" },
  { cols: "md:col-span-5", aspect: "aspect-[3/4]" },
  { cols: "md:col-span-7", aspect: "aspect-[4/3]" },
  { cols: "md:col-span-6", aspect: "aspect-[16/9]" },
  { cols: "md:col-span-6", aspect: "aspect-[3/4]" },
];

function ProjectThumb({ project, index }: { project: typeof projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const s = SIZES[index % SIZES.length];

  return (
    <motion.div
      className={`col-span-12 ${s.cols}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
    >
      <Link
        href={`/work/${project.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block"
        data-cursor={project.type === "video" ? "Play" : "View"}
      >
        {/* Image */}
        <div
          className={`relative w-full ${s.aspect} overflow-hidden`}
          style={{ backgroundColor: project.coverPlaceholder }}
        >
          <div className="placeholder-img text-white h-full">Image</div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-white flex items-end p-4"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          >
            <p className="font-display font-bold text-black leading-none"
              style={{ fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              {project.title}
            </p>
          </motion.div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-2 pb-5 border-b border-white/8">
          <span className="label text-white opacity-35">{project.title}</span>
          <div className="flex items-center gap-3">
            <span className="label text-white opacity-20">{project.category}</span>
            <span className="label text-white opacity-15">/</span>
            <span className="label text-white opacity-20">{project.year}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomeHub() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = filter === "all"
    ? projects
    : projects.filter((p) => p.type === (filter as ProjectType));

  return (
    <div className="bg-black min-h-screen">
      {/* ── Identity strip ───────────────────────────── */}
      <div className="px-5 md:px-8 pt-20 pb-8 border-b border-white/8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="label text-white opacity-20 mb-3">Portfolio</p>
          <h1
            className="font-display font-bold text-white leading-none"
            style={{ fontSize: "clamp(2.2rem, 6vw, 6rem)", letterSpacing: "-0.03em" }}
          >
            Nicolas Sempere
          </h1>
        </div>
        <p className="label text-white opacity-30 pb-1">
          Photographer &mdash; Filmmaker &mdash; Bordeaux / Paris
        </p>
      </div>

      {/* ── Filter ───────────────────────────────────── */}
      <div className="px-5 md:px-8 py-5 flex items-center justify-between border-b border-white/8">
        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="relative label text-white shrink-0 pb-1.5 transition-opacity duration-200 hover:opacity-100"
              style={{ opacity: filter === value ? 1 : 0.25 }}
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
        <span className="label text-white opacity-20 shrink-0 hidden md:block">
          {visible.length} projects
        </span>
      </div>

      {/* ── Project grid ─────────────────────────────── */}
      <div className="px-5 md:px-8 pt-5">
        <motion.div layout className="grid grid-cols-12 gap-x-3 md:gap-x-5">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectThumb key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Footer strip ─────────────────────────────── */}
      <div className="px-5 md:px-8 py-12 border-t border-white/8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
        <p className="label text-white opacity-20">
          &copy; {new Date().getFullYear()} Nicolas Sempere
        </p>
        <div className="flex items-center gap-6">
          <a href="https://instagram.com/nicolas_Sempere" target="_blank" rel="noopener noreferrer"
            className="label text-white opacity-20 hover:opacity-60 transition-opacity duration-300">
            Instagram
          </a>
          <a href="mailto:nicosmp.pro@gmail.com"
            className="label text-white opacity-20 hover:opacity-60 transition-opacity duration-300">
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
