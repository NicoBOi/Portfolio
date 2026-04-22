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
  const isPortrait = project.aspectRatio === "portrait";
  const bg = project.coverPlaceholder;
  const files = project.imageFiles;
  const src = (i: number) =>
    files && files[i] ? `/projects/${project.slug}/${files[i]}` : null;

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

      {/* Cover — full bleed */}
      <motion.div
        className="w-full mt-8 overflow-hidden"
        style={{
          aspectRatio: isPortrait ? "2/3" : "21/9",
          backgroundColor: bg,
          maxHeight: "85vh",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: SOFT }}
      >
        {src(0) ? (
          <img src={src(0)!} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="placeholder-img text-white h-full">[01]</div>
        )}
      </motion.div>

      {/* Metadata */}
      <div className="px-6 md:px-10 py-10 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <h1 className="text-white title" style={{ fontSize: "clamp(2.5rem, 5vw, 5.5rem)", lineHeight: 1 }}>
          {project.title}
        </h1>
        <div className="flex flex-col gap-3 md:justify-end">
          <div className="flex items-center gap-3">
            <span className="label text-white" style={{ opacity: 0.28 }}>{project.year}</span>
            <span className="label text-white" style={{ opacity: 0.12 }}>/</span>
            <span className="label text-white" style={{ opacity: 0.28 }}>{project.role}</span>
            <span className="label text-white" style={{ opacity: 0.12 }}>/</span>
            <span className="label text-white" style={{ opacity: 0.28 }}>{project.category}</span>
          </div>
          {project.description && (
            <p className="text-white font-light leading-relaxed" style={{ fontSize: "0.875rem", opacity: 0.45, lineHeight: 1.9, maxWidth: "48ch" }}>
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Editorial image sequence */}
      <div className="flex flex-col gap-px mt-px">

        {/* Row 1: tight pair */}
        <div className="grid grid-cols-2 gap-px">
          {[1, 2].map((idx, i) => (
            <motion.div
              key={idx}
              style={{ aspectRatio: isPortrait ? "3/4" : "4/3", backgroundColor: bg + "cc" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-4%" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: SOFT }}
            >
              {src(idx) ? (
                <img src={src(idx)!} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="placeholder-img text-white h-full">[{String(idx + 1).padStart(2, "0")}]</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Row 2: full-bleed wide — cinematic break */}
        <motion.div
          style={{
            aspectRatio: isPortrait ? "21/9" : "3/1",
            backgroundColor: bg + "88",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-4%" }}
          transition={{ duration: 0.8, ease: SOFT }}
        >
          {src(3) ? (
            <img src={src(3)!} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="placeholder-img text-white h-full">[04]</div>
          )}
        </motion.div>

        {/* Row 3: offset — left-heavy or right-heavy alternating */}
        <div className={`grid gap-px ${isPortrait ? "grid-cols-3" : "grid-cols-2"}`}>
          <motion.div
            className={isPortrait ? "col-span-2" : "col-span-1"}
            style={{ aspectRatio: isPortrait ? "3/4" : "4/3", backgroundColor: bg + "aa" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-4%" }}
            transition={{ duration: 0.7, ease: SOFT }}
          >
            {src(4) ? (
              <img src={src(4)!} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="placeholder-img text-white h-full">[05]</div>
            )}
          </motion.div>
          {/* empty cell — intentional negative space */}
          <div style={{ backgroundColor: "#000" }} />
        </div>

        {/* Extra images — flow in pairs */}
        {files && files.length > 5 && (
          <div className="grid grid-cols-2 gap-px">
            {files.slice(5).map((f, i) => (
              <motion.div
                key={f}
                style={{ aspectRatio: isPortrait ? "3/4" : "4/3", backgroundColor: bg + "cc" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-4%" }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.06, ease: SOFT }}
              >
                <img
                  src={`/projects/${project.slug}/${f}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

      </div>

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
