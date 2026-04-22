"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  slug: string;
  files: string[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}

export default function Lightbox({ slug, files, index, onClose, onChange }: Props) {
  const open = index !== null;
  const [rendered, setRendered] = useState(index);

  useEffect(() => {
    if (index !== null) setRendered(index);
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && rendered !== null && rendered < files.length - 1)
        onChange(rendered + 1);
      if (e.key === "ArrowLeft" && rendered !== null && rendered > 0)
        onChange(rendered - 1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, rendered, files.length, onClose, onChange]);

  const current = rendered !== null ? files[rendered] : null;
  const hasPrev = rendered !== null && rendered > 0;
  const hasNext = rendered !== null && rendered < files.length - 1;

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          data-cursor="Fermer"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={`/projects/${slug}/${current}`}
              alt=""
              className="max-w-[94vw] max-h-[92vh] object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-5 right-6 label text-white hover:opacity-100 transition-opacity duration-300"
            style={{ opacity: 0.6 }}
          >
            Fermer
          </button>

          {/* Counter */}
          <span className="absolute top-5 left-6 label text-white" style={{ opacity: 0.35 }}>
            {rendered !== null ? String(rendered + 1).padStart(2, "0") : "00"} / {String(files.length).padStart(2, "0")}
          </span>

          {/* Prev */}
          {hasPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); onChange(rendered! - 1); }}
              className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 label text-white hover:opacity-100 transition-opacity duration-300"
              style={{ opacity: 0.5 }}
              data-cursor="Précédent"
              aria-label="Précédent"
            >
              ←
            </button>
          )}

          {/* Next */}
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onChange(rendered! + 1); }}
              className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 label text-white hover:opacity-100 transition-opacity duration-300"
              style={{ opacity: 0.5 }}
              data-cursor="Suivant"
              aria-label="Suivant"
            >
              →
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
