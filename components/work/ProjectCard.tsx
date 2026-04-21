"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Project } from "@/data/projects";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function aspectClass(p: Project): string {
  if (p.type === "video") return "aspect-[16/9]";
  if (p.aspectRatio === "portrait") return "aspect-[3/4]";
  if (p.aspectRatio === "landscape") return "aspect-[4/3]";
  return "aspect-[4/5]";
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6%" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0 }}
      layout
      transition={{ duration: 0.55, delay: (index % 2) * 0.08, ease: SOFT }}
    >
      <Link
        href={`/work/${project.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block"
        data-cursor={project.type === "video" ? "Play" : "View"}
      >
        {/* Thumbnail */}
        <div
          className={`relative w-full ${aspectClass(project)} overflow-hidden`}
          style={{
            backgroundColor: project.coverPlaceholder,
            // Subtle ring so dark-colored cards don't vanish on black bg
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <div className="placeholder-img text-white h-full">
            {project.type === "video" ? "Video" : "Image"}
          </div>

          {/* Dark hover overlay — consistent with overall aesthetic */}
          <div
            className="absolute inset-0 bg-black flex flex-col justify-end p-5"
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.22s ease",
            }}
          >
            <p
              className="text-white title leading-none"
              style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)" }}
            >
              {project.title}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="label text-white" style={{ opacity: 0.45 }}>{project.year}</span>
              <span className="label text-white" style={{ opacity: 0.2 }}>/</span>
              <span className="label text-white" style={{ opacity: 0.45 }}>{project.role}</span>
            </div>
          </div>

          {/* Index badge */}
          <span
            className="absolute top-3 left-3 label text-white z-10"
            style={{
              opacity: hovered ? 0 : 0.28,
              transition: "opacity 0.2s ease",
            }}
          >
            [{num}]
          </span>

          {/* Type badge */}
          {project.type !== "photo" && (
            <span
              className="absolute top-3 right-3 label text-white z-10"
              style={{
                opacity: hovered ? 0 : 0.28,
                transition: "opacity 0.2s ease",
              }}
            >
              {project.type === "video" ? "Video" : "Exp."}
            </span>
          )}
        </div>

        {/* Below card */}
        <div className="flex items-baseline justify-between pt-2.5 pb-6">
          <p className="label text-white" style={{ opacity: 0.38 }}>{project.title}</p>
          <p className="label text-white" style={{ opacity: 0.18 }}>{project.year}</p>
        </div>
      </Link>
    </motion.div>
  );
}
