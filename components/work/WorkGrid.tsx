"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

      {/* Symmetric 2-col grid */}
      <div className="px-6 md:px-10 pt-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <p className="label text-white opacity-20 py-32 text-center">No projects</p>
        )}
      </div>
    </div>
  );
}
