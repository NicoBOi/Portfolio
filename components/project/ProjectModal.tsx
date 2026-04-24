"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ProjectModal({ title, children }: Props) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const close = () => {
    // Prefer history back so the landing's scroll/state is restored.
    // Fallback to `/` for direct loads that never intercepted.
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  // Lock background scroll while the overlay is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ESC to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] bg-black"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: SOFT }}
    >
      {/* Big, clear, accessible back button — fixed top-left, always visible. */}
      <button
        type="button"
        onClick={close}
        aria-label="Retour aux projets"
        className="fixed top-4 left-4 md:top-6 md:left-6 z-[70] flex items-center gap-2 label text-white rounded-full px-4 py-3 min-h-[44px] hover:opacity-100 transition-opacity duration-300"
        style={{
          opacity: 0.9,
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <span aria-hidden="true" style={{ fontSize: "14px" }}>←</span>
        Retour
      </button>

      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar"
      >
        {children}
      </div>
    </motion.div>
  );
}
