"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import ProjectNav from "./ProjectNav";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export default function VideoProject({ project, prev, next }: Props) {
  const [playing, setPlaying] = useState(false);

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

      {/* Full-viewport player */}
      <div
        className="relative w-full mt-6 flex items-center justify-center overflow-hidden"
        style={{ minHeight: "calc(100vh - 8rem)", backgroundColor: project.coverPlaceholder }}
      >
        <div className="placeholder-img absolute inset-0 text-white">Video</div>

        <motion.div
          className="absolute inset-0 bg-black"
          animate={{ opacity: playing ? 0 : 0.65 }}
          transition={{ duration: 0.6 }}
        />

        {!playing && (
          <motion.button
            onClick={() => setPlaying(true)}
            className="relative z-10 group flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            data-cursor="Play"
          >
            <div className="w-20 h-20 border-2 border-white/40 rounded-full flex items-center justify-center group-hover:border-white transition-all duration-300 group-hover:scale-110">
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                <path d="M1 1L15 9L1 17V1Z" fill="white" />
              </svg>
            </div>
            <span className="label text-white opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              Play
            </span>
          </motion.button>
        )}

        {/* Title overlay — bottom left */}
        <motion.div
          className="absolute bottom-8 left-6 md:left-10 z-10"
          animate={{ opacity: playing ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="label text-white mb-2" style={{ opacity: 0.3 }}>
            {project.year} — {project.role}
          </p>
          <h1
            className="text-white title"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}
          >
            {project.title}
          </h1>
        </motion.div>

        <div className="absolute top-6 right-6 md:right-10 z-10">
          <span className="label text-white" style={{ opacity: 0.2 }}>{project.category.toUpperCase()}</span>
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

      {/* Credits strip */}
      <div className="px-6 md:px-10 py-6 border-b border-white/10 flex items-center gap-4">
        <span className="label text-white" style={{ opacity: 0.3 }}>{project.year}</span>
        <span className="label text-white" style={{ opacity: 0.15 }}>/</span>
        <span className="label text-white" style={{ opacity: 0.3 }}>{project.role}</span>
        <span className="label text-white" style={{ opacity: 0.15 }}>/</span>
        <span className="label text-white" style={{ opacity: 0.3 }}>{project.category.toUpperCase()}</span>
      </div>

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
