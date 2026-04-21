"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import ProjectNav from "./ProjectNav";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export default function PhotoProject({ project, prev, next }: Props) {
  const count = project.images ?? 5;
  const isPortrait = project.aspectRatio === "portrait";

  return (
    <article className="bg-black min-h-screen">
      {/* Back */}
      <div className="px-6 md:px-10 pt-20 pb-0">
        <Link
          href="/work"
          className="label text-white hover:opacity-60 transition-opacity duration-300 flex items-center gap-3"
          style={{ opacity: 0.3 }}
        >
          <span className="block w-5 h-px bg-white" />
          Work
        </Link>
      </div>

      {/* Cover — full width banner */}
      <motion.div
        className="w-full mt-8"
        style={{
          aspectRatio: isPortrait ? "3/4" : "21/9",
          backgroundColor: project.coverPlaceholder,
          maxHeight: "80vh",
          overflow: "hidden",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: SOFT }}
      >
        <div className="placeholder-img text-white h-full">Cover</div>
      </motion.div>

      {/* Metadata */}
      <div className="px-6 md:px-10 py-8 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <h1 className="text-white title" style={{ fontSize: "clamp(2rem, 5vw, 5rem)", lineHeight: 1 }}>
          {project.title}
        </h1>
        <div className="flex flex-col gap-2 md:justify-end">
          <div className="flex items-center gap-3">
            <span className="label text-white" style={{ opacity: 0.28 }}>{project.year}</span>
            <span className="label text-white" style={{ opacity: 0.12 }}>/</span>
            <span className="label text-white" style={{ opacity: 0.28 }}>{project.role}</span>
            <span className="label text-white" style={{ opacity: 0.12 }}>/</span>
            <span className="label text-white" style={{ opacity: 0.28 }}>{project.category}</span>
          </div>
          {project.description && (
            <p className="text-white font-light leading-relaxed mt-2" style={{ fontSize: "0.875rem", opacity: 0.45, lineHeight: 1.9, maxWidth: "48ch" }}>
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Image grid — symmetric 2-col */}
      <div className="px-6 md:px-10 py-10">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                aspectRatio: isPortrait ? "3/4" : "4/3",
                backgroundColor: project.coverPlaceholder,
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: SOFT }}
            >
              <div className="placeholder-img text-white h-full">
                [{String(i + 1).padStart(2, "0")}]
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
