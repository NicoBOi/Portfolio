"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import ProjectNav from "./ProjectNav";

interface Props {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export default function VideoProject({ project, prev, next }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="pt-14 bg-black min-h-screen">
      {/* Full-viewport player */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          minHeight: "calc(100vh - 3.5rem)",
          backgroundColor: project.coverPlaceholder,
        }}
      >
        <div className="placeholder-img absolute inset-0 text-white">Video</div>

        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 bg-black"
          animate={{ opacity: playing ? 0 : 0.65 }}
          transition={{ duration: 0.6 }}
        />

        {/* Play */}
        {!playing && (
          <motion.button
            onClick={() => setPlaying(true)}
            className="relative z-10 group flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            data-cursor="Play"
          >
            {/* Big circle */}
            <div className="w-20 h-20 border-2 border-white/40 rounded-full flex items-center justify-center group-hover:border-white transition-colors duration-300 group-hover:scale-110 transition-transform">
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                <path d="M1 1L15 9L1 17V1Z" fill="white" />
              </svg>
            </div>
            <span className="label text-white opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              Play
            </span>
          </motion.button>
        )}

        {/* Title overlay — bottom */}
        <motion.div
          className="absolute bottom-8 left-5 md:left-8 z-10"
          animate={{ opacity: playing ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="label text-white opacity-30 mb-2">
            [{project.year}] — {project.role}
          </p>
          <h1 className="text-title text-white leading-none">{project.title}</h1>
        </motion.div>

        {/* Category — top right */}
        <div className="absolute top-20 right-5 md:right-8 z-10">
          <span className="label text-white opacity-20">{project.category.toUpperCase()}</span>
        </div>
      </div>

      {/* Credits strip */}
      <div className="px-5 md:px-8 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-heading text-white hidden md:block">{project.title}</h2>
        <div className="flex items-center gap-4">
          <span className="label text-white opacity-30">{project.year}</span>
          <span className="label text-white opacity-15">/</span>
          <span className="label text-white opacity-30">{project.role}</span>
          <span className="label text-white opacity-15">/</span>
          <span className="label text-white opacity-30">{project.category.toUpperCase()}</span>
        </div>
      </div>

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
