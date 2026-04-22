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

function closestInteractive(el: HTMLElement | null): HTMLElement | null {
  return el ? (el.closest("a, button") as HTMLElement | null) : null;
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

    const show = (x: number, y: number) => {
      el.style.transform = `translate3d(${x - 5}px, ${y - 5}px, 0)`;
      if (!visible) {
        el.style.opacity = "1";
        visible = true;
      }
    };

    const hide = () => {
      el.style.opacity = "0";
      visible = false;
    };

    const onMove = (e: MouseEvent) => {
      if (!moved) moved = true;
      show(e.clientX, e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = closestInteractive(target);
      let label = readCursorLabel(target);
      if (!label && interactive) {
        // Default label: the element's own text, trimmed and compact
        const text = (interactive.innerText || "").trim().split("\n")[0];
        label = text && text.length <= 24 ? text : "→";
      }
      const isInteractive = !!interactive || !!label;
      setState((prev) =>
        prev.hovered === isInteractive && prev.label === label
          ? prev
          : { hovered: isInteractive, label }
      );
    };

    // Hide when pointer leaves the viewport so the custom cursor doesn't linger
    // next to the native one if macOS surfaces it near screen edges (Dock, etc.)
    const onWindowOut = (e: MouseEvent) => {
      if (e.relatedTarget === null) hide();
    };
    const onDocLeave = () => hide();

    // Fallback: if no move received in 2s, bail out of the custom cursor entirely
    const fallbackTimer = window.setTimeout(() => {
      if (!moved) document.documentElement.classList.add("cursor-fallback");
    }, 2000);

    document.addEventListener("mousemove", onMove, { passive: true, capture: true });
    document.addEventListener("mouseover", onOver, { passive: true, capture: true });
    document.addEventListener("mouseout", onWindowOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocLeave, { passive: true });

    return () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("mousemove", onMove, { capture: true } as EventListenerOptions);
      document.removeEventListener("mouseover", onOver, { capture: true } as EventListenerOptions);
      document.removeEventListener("mouseout", onWindowOut);
      document.documentElement.removeEventListener("mouseleave", onDocLeave);
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
