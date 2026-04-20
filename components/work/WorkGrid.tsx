"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/data/projects";
import type { ProjectType } from "@/data/projects";
import FilterBar, { type Filter } from "./FilterBar";
import ProjectCard from "./ProjectCard";

// Editorial grid: col-span + aspect class rotate through a pattern
// 12-column grid with intentional rhythm: wide, portrait, portrait, wide, portrait, wide…
const GRID_PATTERN: { cols: string; aspect: string }[] = [
  { cols: "col-span-12 md:col-span-8", aspect: "aspect-[16/9]" },
  { cols: "col-span-12 md:col-span-4", aspect: "aspect-[3/4]" },
  { cols: "col-span-12 md:col-span-5", aspect: "aspect-[4/5]" },
  { cols: "col-span-12 md:col-span-7", aspect: "aspect-[4/3]" },
  { cols: "col-span-12 md:col-span-6", aspect: "aspect-[3/4]" },
  { cols: "col-span-12 md:col-span-6", aspect: "aspect-[4/3]" },
  { cols: "col-span-12 md:col-span-4", aspect: "aspect-[4/5]" },
  { cols: "col-span-12 md:col-span-8", aspect: "aspect-[16/9]" },
];

export default function WorkGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.type === (filter as ProjectType));

  return (
    <div>
      {/* Filter */}
      <div className="px-6 md:px-10 mb-10 md:mb-14">
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      {/* Grid */}
      <div className="px-6 md:px-10">
        <motion.div layout className="grid grid-cols-12 gap-x-4 md:gap-x-6">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => {
              const pattern = GRID_PATTERN[i % GRID_PATTERN.length];
              return (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={i}
                  colSpan={pattern.cols}
                  aspectClass={pattern.aspect}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {visible.length === 0 && (
          <div className="py-32 text-center">
            <p className="label opacity-25">NO PROJECTS</p>
          </div>
        )}
      </div>
    </div>
  );
}
