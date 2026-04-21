"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let rafId: number;
    let tx = -100, ty = -100;
    let rx = -100, ry = -100;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${tx - 2}px, ${ty - 2}px)`;
        dotRef.current.style.opacity = "1";
      }
    };

    const loop = () => {
      // Ring lerps toward cursor — minimal lag, smooth
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 14}px, ${ry - 14}px)`;
        ringRef.current.style.opacity = "1";
      }
      rafId = requestAnimationFrame(loop);
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

    rafId = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      {/* Dot — instant */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-white"
        style={{
          width: 4,
          height: 4,
          opacity: 0,
          transition: "transform 0s",
          willChange: "transform",
        }}
      />
      {/* Ring — lerp follow */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-white"
        style={{
          width: hovered ? 44 : 28,
          height: hovered ? 44 : 28,
          marginLeft: hovered ? -8 : 0,
          marginTop: hovered ? -8 : 0,
          opacity: 0,
          transition: "width 0.25s ease, height 0.25s ease, margin 0.25s ease, opacity 0.3s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
