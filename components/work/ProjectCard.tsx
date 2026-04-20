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

export default function ProjectCard({ project, index, colSpan, aspectClass }: Props) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      className={colSpan}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
          className={`relative w-full ${aspectClass} overflow-hidden`}
          style={{ backgroundColor: project.coverPlaceholder }}
        >
          <div className="placeholder-img text-white h-full">Image</div>

          {/* Hover: brutal white overlay with title */}
          <motion.div
            className="absolute inset-0 bg-white flex flex-col justify-end p-4 md:p-5"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-heading text-black leading-none">{project.title}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="label text-black opacity-50">{project.year}</span>
              <span className="label text-black opacity-30">/</span>
              <span className="label text-black opacity-50">{project.role}</span>
            </div>
          </motion.div>

          {/* Index — top left */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <motion.span
              className="label text-white"
              animate={{ opacity: hovered ? 0 : 0.3 }}
            >
              [{num}]
            </motion.span>
          </div>

          {/* Type — top right */}
          {project.type !== "photo" && (
            <div className="absolute top-3 right-3 z-10 pointer-events-none">
              <motion.span
                className="label text-white"
                animate={{ opacity: hovered ? 0 : 0.3 }}
              >
                {project.type === "video" ? "Video" : "Exp."}
              </motion.span>
            </div>
          )}
        </div>

        {/* Below card */}
        <div className="flex items-baseline justify-between pt-2 pb-5">
          <p className="label text-white opacity-40">{project.title}</p>
          <p className="label text-white opacity-20">{project.year}</p>
        </div>
      </Link>
    </motion.div>
  );
}
