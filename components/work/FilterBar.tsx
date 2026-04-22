"use client";

import { motion } from "framer-motion";

export type Filter = "all" | "photo" | "video";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "photo", label: "Photo" },
  { value: "video", label: "Vidéo" },
];

export default function FilterBar({
  active,
  onChange,
}: {
  active: Filter;
  onChange: (f: Filter) => void;
}) {
  return (
    <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className="relative label text-white shrink-0 transition-opacity duration-300 hover:opacity-100 pb-1.5"
          style={{ opacity: active === value ? 1 : 0.25 }}
        >
          {label}
          {active === value && (
            <motion.span
              layoutId="filter-line"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
