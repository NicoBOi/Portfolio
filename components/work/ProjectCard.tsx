"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Project } from "@/data/projects";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  project: Project;
  index: number;
  size?: "full" | "half";
}

export default function ProjectCard({ project, index, size = "half" }: Props) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6%" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      layout
      transition={{ duration: 0.55, delay: (index % 3) * 0.06, ease: SOFT }}
    >
      <Link
        href={`/work/${project.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block"
        data-cursor={project.type === "video" ? "Lire" : "Voir"}
      >
        {/* Thumbnail — always 16:9 */}
        <div
          className="relative w-full aspect-video overflow-hidden"
          style={{
            backgroundColor: project.coverPlaceholder,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Scalable content layer */}
          <div
            className="absolute inset-0"
            style={{
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {project.imageFiles && project.imageFiles.length > 0 ? (
              <img
                src={`/projects/${project.slug}/${project.imageFiles[0]}`}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : project.youtubeId ? (
              <img
                src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="placeholder-img text-white h-full">
                {project.type === "video" ? "Vidéo" : "Image"}
              </div>
            )}
          </div>

          {/* Hover dim */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "rgba(0,0,0,0.28)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.35s ease",
            }}
          />

          {/* Index badge */}
          <span
            className="absolute top-3 left-3 label text-white z-10"
            style={{ opacity: 0.3 }}
          >
            [{num}]
          </span>

          {/* Type badge */}
          {project.type === "video" && (
            <span
              className="absolute top-3 right-3 label text-white z-10"
              style={{ opacity: 0.3 }}
            >
              ▶
            </span>
          )}
        </div>

        {/* Below card — editorial metadata */}
        <div
          className="flex items-baseline justify-between pt-3 pb-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-baseline gap-4 min-w-0">
            <span className="label text-white shrink-0" style={{ opacity: 0.2 }}>{num}</span>
            <h3
              className="text-white title leading-none truncate"
              style={{
                fontSize: size === "full"
                  ? "clamp(1.3rem, 2.6vw, 2.4rem)"
                  : "clamp(0.95rem, 1.5vw, 1.35rem)",
              }}
            >
              {project.title}
            </h3>
          </div>
          <div className="flex items-baseline gap-3 ml-4 shrink-0">
            <span className="label text-white" style={{ opacity: 0.18 }}>{project.category}</span>
            <span className="label text-white" style={{ opacity: 0.14 }}>·</span>
            <span className="label text-white" style={{ opacity: 0.18 }}>{project.year}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
