"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("");

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const dotX = useSpring(rawX, { stiffness: 1200, damping: 60, mass: 0.08 });
  const dotY = useSpring(rawY, { stiffness: 1200, damping: 60, mass: 0.08 });
  const ringX = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.5 });
  const ringY = useSpring(rawY, { stiffness: 180, damping: 22, mass: 0.5 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "a, button, [data-cursor]"
      ) as HTMLElement | null;
      if (el) {
        setHovered(true);
        setLabel(el.dataset.cursor || "");
      }
    };

    const out = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        setHovered(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, [visible, rawX, rawY]);

  const ringSize = hovered ? 56 : 28;

  return (
    <>
      {/* Dot — white */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-white"
        style={{
          x: dotX, y: dotY,
          translateX: "-50%", translateY: "-50%",
          width: 4, height: 4,
          opacity: visible ? 1 : 0,
          scale: hovered ? 0 : 1,
          transition: "scale 0.2s ease, opacity 0.3s ease",
        }}
      />
      {/* Ring — white */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border border-white flex items-center justify-center overflow-hidden"
        style={{
          x: ringX, y: ringY,
          translateX: `-${ringSize / 2}px`, translateY: `-${ringSize / 2}px`,
          width: ringSize, height: ringSize,
          opacity: visible ? 1 : 0,
          transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
        }}
      >
        {label && (
          <span className="label text-white" style={{ fontSize: 8, letterSpacing: "0.12em" }}>
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}
