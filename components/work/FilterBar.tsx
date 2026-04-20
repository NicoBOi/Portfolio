"use client";

import { motion } from "framer-motion";

export type Filter = "all" | "photo" | "video" | "experimental";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "photo", label: "PHOTO" },
  { value: "video", label: "VIDEO" },
  { value: "experimental", label: "EXPERIMENTAL" },
];

export default function FilterBar({
  active,
  onChange,
}: {
  active: Filter;
  onChange: (f: Filter) => void;
}) {
  return (
    <div className="flex items-center gap-8 md:gap-12 overflow-x-auto no-scrollbar">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className="relative label shrink-0 transition-opacity duration-300 hover:opacity-100"
          style={{ opacity: active === value ? 1 : 0.28 }}
        >
          {label}
          {active === value && (
            <motion.span
              layoutId="filter-underline"
              className="absolute -bottom-1.5 left-0 right-0 h-px bg-black"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
