"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/data/projects";
import type { ProjectType } from "@/data/projects";
import FilterBar, { type Filter } from "./FilterBar";
import ProjectCard from "./ProjectCard";

const PATTERN: { cols: string; aspect: string }[] = [
  { cols: "col-span-12 md:col-span-8", aspect: "aspect-[16/9]" },
  { cols: "col-span-12 md:col-span-4", aspect: "aspect-[3/4]" },
  { cols: "col-span-12 md:col-span-5", aspect: "aspect-[4/5]" },
  { cols: "col-span-12 md:col-span-7", aspect: "aspect-[16/9]" },
  { cols: "col-span-12 md:col-span-6", aspect: "aspect-[3/4]" },
  { cols: "col-span-12 md:col-span-6", aspect: "aspect-[16/9]" },
  { cols: "col-span-12 md:col-span-4", aspect: "aspect-[3/4]" },
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
      <div className="px-5 md:px-8 mb-10 md:mb-14">
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      <div className="px-5 md:px-8">
        <motion.div layout className="grid grid-cols-12 gap-x-3 md:gap-x-5">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => {
              const pat = PATTERN[i % PATTERN.length];
              return (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={i}
                  colSpan={pat.cols}
                  aspectClass={pat.aspect}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <p className="label text-white opacity-20 py-32 text-center">No projects</p>
        )}
      </div>
    </div>
  );
}
