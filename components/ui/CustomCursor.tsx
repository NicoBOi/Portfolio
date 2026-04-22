"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        cursorRef.current.style.opacity = "1";
      }
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        setHovered(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      style={{
        width: 20,
        height: 20,
        opacity: 0,
        backgroundColor: hovered ? "#aa0000" : "white",
        mixBlendMode: hovered ? "normal" : "difference",
        willChange: "transform",
        animation: hovered ? "rec-blink 0.28s ease-in-out infinite alternate" : "none",
      }}
    />
  );
}
