"use client";

import { useEffect, useRef } from "react";

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

// Imperative cursor — zero React state, zero rAF, zero interpolation. The
// previous react-state version re-rendered on every mouseover (which fires
// every time the pointer crosses an element boundary), and the lerp version
// added 1–3 frames of latency that read as input-lag. The fastest cursor
// is the one that does nothing extra: write style.transform straight out
// of pointermove (the browser already coalesces those to the display's
// vsync) and toggle a class for the hover state.
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const labelEl = labelRef.current;
    if (!cursor || !labelEl) return;

    document.documentElement.classList.add("cursor-ready");

    let visible = false;
    let moved = false;
    let currentHover = false;
    let currentLabel: string | null = null;

    const onMove = (e: PointerEvent) => {
      if (!moved) moved = true;
      // Direct write — browsers coalesce pointermove to one event per
      // painted frame, so this commits exactly once per vsync.
      cursor.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0)`;
      if (!visible) {
        cursor.style.opacity = "1";
        visible = true;
      }
    };

    const hide = () => {
      cursor.style.opacity = "0";
      visible = false;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = closestInteractive(target);
      const info = readCursorInfo(target);
      let next = info.label;
      if (!next && !info.suppress && interactive) {
        const text = (interactive.innerText || "").trim().split("\n")[0];
        next = text && text.length <= 24 ? text : "→";
      }
      const hovered = info.silent ? false : !!interactive || !!next;

      // Imperative class + textContent — no React re-render means the
      // cursor's motion thread never gets preempted by reconciliation.
      if (hovered !== currentHover) {
        currentHover = hovered;
        cursor.classList.toggle("is-hovered", hovered);
      }
      if (next !== currentLabel) {
        currentLabel = next;
        if (next) {
          labelEl.textContent = next;
          labelEl.style.display = "block";
        } else {
          labelEl.style.display = "none";
        }
      }
    };

    const onWindowOut = (e: MouseEvent) => {
      if (e.relatedTarget === null) hide();
    };
    const onDocLeave = () => hide();

    const fallbackTimer = window.setTimeout(() => {
      if (!moved) document.documentElement.classList.add("cursor-fallback");
    }, 2000);

    document.addEventListener("pointermove", onMove, { passive: true, capture: true });
    document.addEventListener("mouseover", onOver, { passive: true, capture: true });
    document.addEventListener("mouseout", onWindowOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocLeave, { passive: true });

    return () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("pointermove", onMove, { capture: true } as EventListenerOptions);
      document.removeEventListener("mouseover", onOver, { capture: true } as EventListenerOptions);
      document.removeEventListener("mouseout", onWindowOut);
      document.documentElement.removeEventListener("mouseleave", onDocLeave);
      document.documentElement.classList.remove("cursor-ready");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] custom-cursor"
      style={{ opacity: 0 }}
    >
      <div className="custom-cursor-dot" />
      <div ref={labelRef} className="custom-cursor-label" style={{ display: "none" }} />
    </div>
  );
}
