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
    <article className="pt-14">
      {/* ── Full-viewport player ──────────────────────── */}
      <div className="relative w-full min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: project.coverPlaceholder }}
        />
        <div className="placeholder-img absolute inset-0">VIDEO</div>

        {/* Overlay (fades on play) */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          animate={{ opacity: playing ? 0 : 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Play button */}
        {!playing && (
          <motion.button
            onClick={() => setPlaying(true)}
            className="relative z-10 group flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            data-cursor="PLAY"
          >
            {/* Circle */}
            <div className="w-16 h-16 border border-white/40 rounded-full flex items-center justify-center transition-all duration-400 group-hover:border-white/80 group-hover:scale-110">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                className="ml-1 text-white"
              >
                <path d="M1 1L13 8L1 15V1Z" fill="currentColor" />
              </svg>
            </div>
            <span className="label text-white/50 group-hover:text-white/80 transition-colors duration-300">
              PLAY
            </span>
          </motion.button>
        )}

        {/* Metadata — bottom left */}
        <motion.div
          className="absolute bottom-8 left-6 md:left-10 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: playing ? 0 : 1, transition: "opacity 0.5s ease" }}
        >
          <h1 className="font-display italic font-light text-white text-display-md leading-none mb-3">
            {project.title}
          </h1>
          <div className="flex items-center gap-4">
            <span className="label text-white/40">{project.year}</span>
            <span className="label text-white/20">—</span>
            <span className="label text-white/40">{project.role}</span>
          </div>
        </motion.div>

        {/* Category — top right */}
        <div className="absolute top-20 right-6 md:right-10 z-10">
          <span className="label text-white/25">{project.category.toUpperCase()}</span>
        </div>
      </div>

      {/* ── Credits strip ─────────────────────────────── */}
      <div className="px-6 md:px-10 py-8 border-b border-[#E8E8E8] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="font-display italic font-light text-display-md leading-none hidden md:block">
          {project.title}
        </p>
        <div className="flex items-center gap-5">
          <span className="label opacity-35">{project.year}</span>
          <span className="label opacity-15">—</span>
          <span className="label opacity-35">{project.role}</span>
          <span className="label opacity-15">—</span>
          <span className="label opacity-35">{project.category.toUpperCase()}</span>
        </div>
      </div>

      {/* ── Nav ───────────────────────────────────────── */}
      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
