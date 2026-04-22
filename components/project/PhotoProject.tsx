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

// Editorial rhythm — each image gets a position + width
// Keeps a breathable, varied pagination instead of full-bleed slabs
const LAYOUTS = [
  "w-full md:w-4/5 mx-auto",            // centered hero
  "w-full md:w-3/5 md:mr-auto md:ml-0", // left, slim
  "w-full md:w-3/5 md:ml-auto md:mr-0", // right, slim
  "w-full md:w-11/12 mx-auto",          // near full
  "w-full md:w-2/3 mx-auto",            // centered narrow
  "w-full md:w-3/4 md:ml-auto md:mr-0", // right, wide
  "w-full md:w-3/4 md:mr-auto md:ml-0", // left, wide
  "w-full md:w-1/2 mx-auto",            // centered tight
];

export default function PhotoProject({ project, prev, next }: Props) {
  const isPortrait = project.aspectRatio === "portrait";
  const files = project.imageFiles ?? [];
  const bg = project.coverPlaceholder;
  const cover = files[0];
  const rest = files.slice(1);

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
          Travaux
        </Link>
      </div>

      {/* Cover — framed, not full-bleed */}
      <div className="px-6 md:px-10 lg:px-16 mt-10 md:mt-16">
        <motion.div
          className="w-full max-w-6xl mx-auto overflow-hidden"
          style={{
            aspectRatio: isPortrait ? "4/5" : "16/10",
            backgroundColor: bg,
            maxHeight: "78vh",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: SOFT }}
        >
          {cover ? (
            <img
              src={`/projects/${project.slug}/${cover}`}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="placeholder-img text-white h-full">[01]</div>
          )}
        </motion.div>
      </div>

      {/* Metadata */}
      <div className="px-6 md:px-10 lg:px-16 py-16 md:py-24 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(2rem, 4.5vw, 4.5rem)", lineHeight: 1 }}
        >
          {project.title}
        </h1>
        <div className="flex flex-col gap-4 md:justify-end">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="label text-white" style={{ opacity: 0.35 }}>{project.year}</span>
            <span className="label text-white" style={{ opacity: 0.14 }}>/</span>
            <span className="label text-white" style={{ opacity: 0.35 }}>{project.role}</span>
            <span className="label text-white" style={{ opacity: 0.14 }}>/</span>
            <span className="label text-white" style={{ opacity: 0.35 }}>{project.category}</span>
          </div>
          {project.description && (
            <p
              className="text-white font-light"
              style={{
                fontSize: "0.9rem",
                opacity: 0.55,
                lineHeight: 1.9,
                maxWidth: "54ch",
              }}
            >
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Editorial image sequence — generous, varied, breathing */}
      <div className="px-6 md:px-10 lg:px-16 pb-24 md:pb-40">
        <div className="max-w-6xl mx-auto flex flex-col gap-16 md:gap-28">
          {rest.map((f, i) => {
            const className = LAYOUTS[i % LAYOUTS.length];
            return (
              <motion.figure
                key={f}
                className={className}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.9, ease: SOFT }}
              >
                <div style={{ backgroundColor: bg + "66" }}>
                  <img
                    src={`/projects/${project.slug}/${f}`}
                    alt=""
                    className="w-full h-auto object-cover block"
                  />
                </div>
              </motion.figure>
            );
          })}
        </div>
      </div>

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
