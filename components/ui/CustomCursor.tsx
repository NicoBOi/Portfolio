"use client";

import { useEffect, useRef, useState } from "react";

function readCursorLabel(el: HTMLElement | null): string | null {
  let node = el;
  while (node) {
    if (node.dataset?.cursor) return node.dataset.cursor;
    node = node.parentElement as HTMLElement | null;
  }
  return null;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ hovered: boolean; label: string | null }>({
    hovered: false,
    label: null,
  });

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;
    let visible = false;

    const flush = () => {
      rafId = null;
      el.style.transform = `translate3d(${pendingX - 5}px, ${pendingY - 5}px, 0)`;
      if (!visible) {
        el.style.opacity = "1";
        visible = true;
      }
    };

    const onMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (rafId === null) rafId = requestAnimationFrame(flush);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const label = readCursorLabel(target);
      const isInteractive = !!target.closest("a, button") || !!label;
      setState((prev) =>
        prev.hovered === isInteractive && prev.label === label
          ? prev
          : { hovered: isInteractive, label }
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  const { hovered, label } = state;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ opacity: 0, willChange: "transform", contain: "layout style paint" }}
    >
      {/* Dot */}
      <div
        className="rounded-full"
        style={{
          width: 10,
          height: 10,
          backgroundColor: hovered ? "#aa0000" : "white",
          mixBlendMode: hovered ? "normal" : "difference",
          animation: hovered ? "rec-blink 0.28s ease-in-out infinite alternate" : "none",
        }}
      />
      {/* Label */}
      {label && (
        <div
          className="absolute label text-white"
          style={{
            top: -1,
            left: 16,
            whiteSpace: "nowrap",
            opacity: 0.65,
            mixBlendMode: "difference",
            lineHeight: "12px",
            pointerEvents: "none",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
