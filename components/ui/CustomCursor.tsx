"use client";

import { useEffect, useRef, useState } from "react";

function readCursorInfo(el: HTMLElement | null): {
  label: string | null;
  suppress: boolean;
  silent: boolean;
} {
  let node = el;
  let silent = false;
  while (node) {
    if (node.dataset?.cursorSilent !== undefined) silent = true;
    if (node.dataset?.cursor) return { label: node.dataset.cursor, suppress: false, silent };
    if (node.dataset?.cursorSuppress !== undefined)
      return { label: null, suppress: true, silent };
    node = node.parentElement as HTMLElement | null;
  }
  return { label: null, suppress: false, silent };
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

    // Gate `cursor: none` on mount so there's no "no cursor" flash before this runs
    document.documentElement.classList.add("cursor-ready");

    let visible = false;
    let moved = false;

    // The cursor follows the mouse with a direct transform on every
    // mousemove. The browser composites the GPU layer at the monitor's
    // native refresh (60 / 120 / 240 Hz), so even if mousemove fires
    // 1000x/s on a gaming mouse only the latest position per frame is
    // ever painted. Simplest possible code, zero rAF loop overhead.
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
      const { label: explicit, suppress, silent } = readCursorInfo(target);
      // Echoing the element's own text was redundant ("Écrivez-moi"
      // button → cursor whispered "Écrivez-moi" right next to it). For
      // any interactive element without an explicit data-cursor, fall
      // back to a neutral "→" — it nudges toward the click without
      // duplicating the affordance.
      const label = explicit ?? (!suppress && interactive ? "→" : null);
      // `silent` shows the label but never flips the red/blink state
      const hovered = silent ? false : !!interactive || !!label;
      setState((prev) =>
        prev.hovered === hovered && prev.label === label ? prev : { hovered, label }
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
      document.documentElement.classList.remove("cursor-ready");
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
