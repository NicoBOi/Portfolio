"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import ProjectNav from "./ProjectNav";

const PATTERN: { cols: string; aspect: string }[] = [
  { cols: "col-span-12", aspect: "aspect-[21/9]" },
  { cols: "col-span-12 md:col-span-7", aspect: "aspect-[4/3]" },
  { cols: "col-span-12 md:col-span-5", aspect: "aspect-[3/4]" },
  { cols: "col-span-12 md:col-span-5", aspect: "aspect-[3/4]" },
  { cols: "col-span-12 md:col-span-7", aspect: "aspect-[4/3]" },
];

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export default function PhotoProject({ project, prev, next }: Props) {
  const count = project.images ?? 5;

  return (
    <article className="pt-14 bg-black min-h-screen">
      {/* Back */}
      <div className="px-6 md:px-10 pt-6 pb-0">
        <Link
          href="/work"
          className="label text-white hover:opacity-60 transition-opacity duration-300 flex items-center gap-3"
          style={{ opacity: 0.3 }}
        >
          <span className="block w-5 h-px bg-white" />
          Work
        </Link>
      </div>

      {/* Hero */}
      <motion.div
        className="w-full mt-6 overflow-hidden"
        style={{ aspectRatio: "21/9", backgroundColor: project.coverPlaceholder }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: SOFT }}
      >
        <div className="placeholder-img text-white h-full">Image</div>
      </motion.div>

      {/* Metadata */}
      <div className="px-6 md:px-10 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
        >
          {project.title}
        </h1>
        <div className="flex items-center gap-4 shrink-0">
          <span className="label text-white" style={{ opacity: 0.3 }}>{project.year}</span>
          <span className="label text-white" style={{ opacity: 0.15 }}>/</span>
          <span className="label text-white" style={{ opacity: 0.3 }}>{project.role}</span>
          <span className="label text-white" style={{ opacity: 0.15 }}>/</span>
          <span className="label text-white" style={{ opacity: 0.3 }}>{project.category.toUpperCase()}</span>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <div className="px-6 md:px-10 py-10 border-b border-white/10 max-w-2xl">
          <p className="text-white font-light leading-relaxed" style={{ fontSize: "0.9rem", opacity: 0.5, lineHeight: 1.9 }}>
            {project.description}
          </p>
        </div>
      )}

      {/* Series */}
      <div className="px-6 md:px-10 py-6">
        <div className="grid grid-cols-12 gap-3 md:gap-5">
          {Array.from({ length: count }).map((_, i) => {
            const pat = PATTERN[i % PATTERN.length];
            return (
              <motion.div
                key={i}
                className={`${pat.cols} ${pat.aspect} overflow-hidden`}
                style={{ backgroundColor: project.coverPlaceholder }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: SOFT }}
              >
                <div className="placeholder-img text-white h-full">
                  [{String(i + 1).padStart(2, "0")}]
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
