"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
    // Hide the site nav (NS logo + menu) while the lightbox is up — it sits in
    // its own stacking context and was painting on top of the modal, which
    // also meant taps on "Fermer" were hitting the Contact link underneath.
    document.documentElement.classList.add("lightbox-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.documentElement.classList.remove("lightbox-open");
    };
  }, [open, rendered, files.length, onClose, onChange]);

  const current = rendered !== null ? files[rendered] : null;
  const hasPrev = rendered !== null && rendered > 0;
  const hasNext = rendered !== null && rendered < files.length - 1;

  if (!mounted) return null;

  // Rendered through a portal on document.body so the modal escapes the
  // <main> stacking context (which was trapping its z-[200] beneath the
  // fixed nav at z-50).
  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-cursor="Fermer"
          onClick={(e) => {
            // Close on any backdrop click. The image itself stops propagation
            // below so taps on the photo stay reserved for zoom/pan. Chrome
            // buttons also stop propagation, so they won't reach here.
            if ((e.target as HTMLElement).tagName !== "IMG") onClose();
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="relative z-[1] w-full h-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <TransformWrapper
                doubleClick={{ mode: "toggle", step: 2.2 }}
                pinch={{ disabled: false }}
                wheel={{ step: 0.2 }}
                minScale={1}
                maxScale={5}
                centerOnInit
                limitToBounds
              >
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={`/projects/${slug}/${current}`}
                      alt=""
                      className="max-w-[94vw] max-h-[92vh] object-contain select-none"
                      draggable={false}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </motion.div>
          </AnimatePresence>

          {/* Chrome — lifted above the zoom wrapper via z-[20] and wired to
              onPointerUp so the gesture library (which claims pointer/click
              events during pan/pinch) can't swallow the tap. */}
          <button
            type="button"
            onPointerUp={(e) => { e.stopPropagation(); onClose(); }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-5 right-6 z-[20] label text-white hover:opacity-100 transition-opacity duration-300 px-3 py-2 -mx-3"
            style={{ opacity: 0.75, pointerEvents: "auto" }}
          >
            Fermer
          </button>

          <span className="absolute top-5 left-6 z-[20] label text-white pointer-events-none" style={{ opacity: 0.55 }}>
            {rendered !== null ? String(rendered + 1).padStart(2, "0") : "00"} / {String(files.length).padStart(2, "0")}
          </span>

          {hasPrev && (
            <button
              type="button"
              onPointerUp={(e) => { e.stopPropagation(); onChange(rendered! - 1); }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[20] label text-white hover:opacity-100 transition-opacity duration-300 px-3 py-3"
              style={{ opacity: 0.65, pointerEvents: "auto" }}
              data-cursor="Précédent"
              aria-label="Précédent"
            >
              ←
            </button>
          )}

          {hasNext && (
            <button
              type="button"
              onPointerUp={(e) => { e.stopPropagation(); onChange(rendered! + 1); }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[20] label text-white hover:opacity-100 transition-opacity duration-300 px-3 py-3"
              style={{ opacity: 0.65, pointerEvents: "auto" }}
              data-cursor="Suivant"
              aria-label="Suivant"
            >
              →
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
