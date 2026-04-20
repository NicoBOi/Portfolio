"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import ProjectNav from "./ProjectNav";

// Alternating photo layout pattern for a series
const PHOTO_PATTERN: { cols: string; aspect: string }[] = [
  { cols: "col-span-12", aspect: "aspect-[21/9]" },
  { cols: "col-span-12 md:col-span-7", aspect: "aspect-[4/3]" },
  { cols: "col-span-12 md:col-span-5", aspect: "aspect-[3/4]" },
  { cols: "col-span-12 md:col-span-5", aspect: "aspect-[3/4]" },
  { cols: "col-span-12 md:col-span-7", aspect: "aspect-[4/3]" },
];

interface Props {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export default function PhotoProject({ project, prev, next }: Props) {
  const count = project.images ?? 5;

  return (
    <article className="pt-14">
      {/* ── Hero ──────────────────────────────────────── */}
      <motion.div
        className="w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden"
        style={{ backgroundColor: project.coverPlaceholder }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="placeholder-img h-full">IMAGE</div>
      </motion.div>

      {/* ── Metadata ──────────────────────────────────── */}
      <motion.div
        className="px-6 md:px-10 py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#E8E8E8]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display font-light italic text-display-lg leading-none">
          {project.title}
        </h1>
        <div className="flex items-center gap-5 shrink-0">
          <span className="label opacity-35">{project.year}</span>
          <span className="label opacity-15">—</span>
          <span className="label opacity-35">{project.role}</span>
          <span className="label opacity-15">—</span>
          <span className="label opacity-35">{project.category.toUpperCase()}</span>
        </div>
      </motion.div>

      {/* ── Photo series ──────────────────────────────── */}
      <div className="px-6 md:px-10 py-6">
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-6">
          {Array.from({ length: count }).map((_, i) => {
            const pat = PHOTO_PATTERN[i % PHOTO_PATTERN.length];
            return (
              <motion.div
                key={i}
                className={`${pat.cols} ${pat.aspect} overflow-hidden`}
                style={{ backgroundColor: project.coverPlaceholder }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6%" }}
                transition={{
                  duration: 0.75,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="placeholder-img h-full">
                  IMAGE {String(i + 1).padStart(2, "0")}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Nav ───────────────────────────────────────── */}
      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
