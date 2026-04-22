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

    let visible = false;
    let moved = false;

    const apply = (x: number, y: number) => {
      el.style.transform = `translate3d(${x - 5}px, ${y - 5}px, 0)`;
      if (!visible) {
        el.style.opacity = "1";
        visible = true;
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!moved) moved = true;
      apply(e.clientX, e.clientY);
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

    // Fallback: if the cursor never receives a move event in 2s (some macOS configs),
    // restore the native cursor and hide the custom one
    const fallbackTimer = window.setTimeout(() => {
      if (!moved) document.documentElement.classList.add("cursor-fallback");
    }, 2000);

    // Listen at document with capture so no child can stop propagation before us.
    // mousemove works on every mouse-driven setup; we keep it as the single source of truth.
    document.addEventListener("mousemove", onMove, { passive: true, capture: true });
    document.addEventListener("mouseover", onOver, { passive: true, capture: true });

    return () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("mousemove", onMove, { capture: true } as EventListenerOptions);
      document.removeEventListener("mouseover", onOver, { capture: true } as EventListenerOptions);
    };
  }, []);

  const { hovered, label } = state;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] custom-cursor"
      style={{ opacity: 0, willChange: "transform" }}
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
