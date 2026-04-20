"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  index: number;
  colSpan: string;
  aspectClass: string;
}

export default function ProjectCard({
  project,
  index,
  colSpan,
  aspectClass,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      className={colSpan}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.75,
        delay: (index % 4) * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/work/${project.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block group relative overflow-hidden"
        data-cursor={project.type === "video" ? "PLAY" : "VIEW"}
      >
        {/* Thumbnail */}
        <div
          className={`relative w-full ${aspectClass} overflow-hidden`}
          style={{ backgroundColor: project.coverPlaceholder }}
        >
          <div className="placeholder-img">IMAGE</div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-black flex flex-col justify-end p-5 md:p-6"
            animate={{ opacity: hovered ? 0.88 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ y: hovered ? 0 : 12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display italic font-light text-white text-2xl md:text-3xl leading-tight">
                {project.title}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="label text-white/40">{project.year}</span>
                <span className="label text-white/20">—</span>
                <span className="label text-white/40">{project.role}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Type badge */}
          {project.type !== "photo" && (
            <div className="absolute top-4 left-4 z-10">
              <motion.span
                className="label text-white/50"
                animate={{ opacity: hovered ? 0 : 0.5 }}
              >
                {project.type === "video" ? "VIDEO" : "EXP."}
              </motion.span>
            </div>
          )}
        </div>

        {/* Index + title below card */}
        <div className="flex items-start justify-between pt-3 pb-6">
          <div>
            <p className="font-sans text-sm font-light text-black/80 leading-snug">
              {project.title}
            </p>
            <p className="label opacity-30 mt-1">{project.year}</p>
          </div>
          <span className="label opacity-20 shrink-0 ml-4">{num}</span>
        </div>
      </Link>
    </motion.div>
  );
}
