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
    let moved = false;

    const flush = () => {
      rafId = null;
      el.style.transform = `translate3d(${pendingX - 5}px, ${pendingY - 5}px, 0)`;
      if (!visible) {
        el.style.opacity = "1";
        visible = true;
      }
    };

    const onMove = (e: PointerEvent | MouseEvent) => {
      if (!moved) moved = true;
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (rafId === null) rafId = requestAnimationFrame(flush);
    };

    const onOver = (e: PointerEvent | MouseEvent) => {
      const target = e.target as HTMLElement;
      const label = readCursorLabel(target);
      const isInteractive = !!target.closest("a, button") || !!label;
      setState((prev) =>
        prev.hovered === isInteractive && prev.label === label
          ? prev
          : { hovered: isInteractive, label }
      );
    };

    const onLeave = () => {
      el.style.opacity = "0";
      visible = false;
    };

    // Fallback: if pointer events aren't firing (some Mac configs), give up on the custom cursor
    const fallbackTimer = window.setTimeout(() => {
      if (!moved) document.documentElement.classList.add("cursor-fallback");
    }, 2000);

    // Prefer PointerEvent (broader device + browser coverage), fall back to mouse
    const hasPointer = typeof window !== "undefined" && "PointerEvent" in window;
    const moveEvent = hasPointer ? "pointermove" : "mousemove";
    const overEvent = hasPointer ? "pointerover" : "mouseover";
    const leaveEvent = hasPointer ? "pointerleave" : "mouseleave";

    window.addEventListener(moveEvent, onMove as EventListener, { passive: true });
    document.addEventListener(overEvent, onOver as EventListener, { passive: true });
    window.addEventListener(leaveEvent, onLeave, { passive: true });
    window.addEventListener("blur", onLeave, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener(moveEvent, onMove as EventListener);
      document.removeEventListener(overEvent, onOver as EventListener);
      window.removeEventListener(leaveEvent, onLeave);
      window.removeEventListener("blur", onLeave);
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
