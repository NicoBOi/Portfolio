"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import ProjectNav from "./ProjectNav";
import Lightbox from "./Lightbox";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

function PlateNumber({ current }: { current: number; total: number }) {
  return (
    <span
      className="absolute bottom-3 right-4 md:bottom-5 md:right-6 title text-white pointer-events-none tabular-nums z-10"
      style={{
        opacity: 0.85,
        mixBlendMode: "difference",
        fontSize: "clamp(2.2rem, 3.5vw, 4rem)",
        lineHeight: 1,
      }}
    >
      {String(current).padStart(2, "0")}
    </span>
  );
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
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <article className="bg-black min-h-screen">
      {/* Back */}
      <div className="px-6 md:px-10 pt-20 pb-0">
        <Link
          href="/"
          className="label text-white hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 px-3 py-2 -mx-3 rounded-full"
          style={{ opacity: 0.7 }}
        >
          <span aria-hidden="true">←</span>
          Accueil
        </Link>
      </div>

      {/* Cover — framed, not full-bleed */}
      <div className="px-6 md:px-10 lg:px-16 mt-10 md:mt-16">
        <motion.div
          className="relative w-full max-w-6xl mx-auto overflow-hidden"
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
            <button
              type="button"
              onClick={() => setLightbox(0)}
              className="w-full h-full block"
              data-cursor="Agrandir"
              aria-label="Agrandir"
            >
              <img
                src={`/projects/${project.slug}/${cover}`}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </button>
          ) : (
            <div className="placeholder-img text-white h-full">[01]</div>
          )}
          <PlateNumber current={1} total={files.length} />
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
        <div className="flex flex-col gap-2 md:justify-end">
          <p className="label text-white" style={{ opacity: 0.8 }}>{project.meta.type}</p>
          <p className="label text-white" style={{ opacity: 0.6 }}>{project.meta.location}</p>
          <p className="label text-white" style={{ opacity: 0.6 }}>{project.meta.credits}</p>
          <p className="label text-white mt-4" style={{ opacity: 0.45 }}>{project.year}</p>
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
                className={`relative ${className}`}
                style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.9, ease: SOFT }}
              >
                <button
                  type="button"
                  onClick={() => setLightbox(i + 1)}
                  className="w-full block"
                  style={{ backgroundColor: bg + "66" }}
                  data-cursor="Agrandir"
                  aria-label="Agrandir"
                >
                  <img
                    src={`/projects/${project.slug}/${f}`}
                    alt=""
                    className="w-full h-auto object-cover block"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                <PlateNumber current={i + 2} total={files.length} />
              </motion.figure>
            );
          })}
        </div>
      </div>

      <ProjectNav prev={prev} next={next} />

      <Lightbox
        slug={project.slug}
        files={files}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    </article>
  );
}
