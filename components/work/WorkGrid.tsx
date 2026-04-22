"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import type { ProjectType } from "@/data/projects";
import FilterBar, { type Filter } from "./FilterBar";
import ProjectCard from "./ProjectCard";

export default function WorkGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.type === (filter as ProjectType));

  return (
    <div>
      {/* Filter bar */}
      <div className="px-6 md:px-10 pb-10 border-b border-white/10 flex items-center justify-between">
        <FilterBar active={filter} onChange={setFilter} />
        <span className="label text-white hidden md:block" style={{ opacity: 0.2 }}>
          {visible.length} projects
        </span>
      </div>

      {/* Grid — alternating full / half+half rows, all 16:9 */}
      <div className="px-6 md:px-10 pt-8 pb-24">
        <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-0">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => {
              const isOrphan = i % 3 === 1 && i === visible.length - 1;
              const isFull = i % 3 === 0 || isOrphan;
              return (
                <div
                  key={project.slug}
                  className={isFull ? "col-span-2" : "col-span-1"}
                >
                  <ProjectCard project={project} index={i} size={isFull ? "full" : "half"} />
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <p className="label text-white opacity-20 py-32 text-center">No projects</p>
        )}
      </div>
    </div>
  );
}
