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
    let initialised = false;
    // The mouse fires at its own sample rate (60 Hz on a basic optical
    // mouse, 1000+ Hz on a gaming one). Writing the transform straight
    // out of pointermove means the cursor only moves when the mouse
    // sends a sample — on a 60 Hz mouse against a 144 / 240 Hz display
    // the cursor visibly steps. Instead, decouple the two: pointermove
    // only updates a target, and a rAF loop interpolates the cursor
    // toward that target every paint frame. The browser ticks rAF at
    // the display's refresh rate (60 / 120 / 144 / 240 Hz) so the
    // cursor moves as fluidly as the screen can paint, regardless of
    // how often the mouse reports. The loop pauses itself once the
    // cursor settles on the target so it doesn't spin idle.
    let targetX = 0;
    let targetY = 0;
    let renderX = 0;
    let renderY = 0;
    let rafId = 0;
    // Smoothing factor — closer to 1 = snappier / less lag, closer to 0
    // = silkier / more lag. 0.35 lands at ~2 frames of latency on a 60 Hz
    // monitor, ~1 frame on 144 Hz, which reads as instant 1:1 tracking
    // while still smoothing the inter-sample gaps.
    const SMOOTHING = 0.35;

    const commit = () => {
      el.style.transform = `translate3d(${renderX - 5}px, ${renderY - 5}px, 0)`;
    };

    const tick = () => {
      const dx = targetX - renderX;
      const dy = targetY - renderY;
      // ~0.05 px is well below a CSS pixel — once we're inside that
      // tolerance, snap to target and stop the loop.
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        renderX = targetX;
        renderY = targetY;
        commit();
        rafId = 0;
        return;
      }
      renderX += dx * SMOOTHING;
      renderY += dy * SMOOTHING;
      commit();
      rafId = requestAnimationFrame(tick);
    };

    const hide = () => {
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      el.style.opacity = "0";
      visible = false;
    };

    const onMove = (e: PointerEvent | MouseEvent) => {
      if (!moved) moved = true;
      targetX = e.clientX;
      targetY = e.clientY;
      // First move: place the cursor under the pointer with no
      // ease-in animation so it doesn't fly across the screen on entry.
      if (!initialised) {
        renderX = targetX;
        renderY = targetY;
        initialised = true;
        commit();
      }
      if (!visible) {
        el.style.opacity = "1";
        visible = true;
      }
      if (rafId === 0) rafId = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = closestInteractive(target);
      const { label: explicit, suppress, silent } = readCursorInfo(target);
      let label = explicit;
      if (!label && !suppress && interactive) {
        // Default label: the element's own text, trimmed and compact
        const text = (interactive.innerText || "").trim().split("\n")[0];
        label = text && text.length <= 24 ? text : "→";
      }
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

    // pointermove rather than mousemove — pointer events expose the native
    // sample rate of the input device, which lets the rAF throttle above
    // do its job cleanly on high-Hz mice.
    document.addEventListener("pointermove", onMove, { passive: true, capture: true });
    document.addEventListener("mouseover", onOver, { passive: true, capture: true });
    document.addEventListener("mouseout", onWindowOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocLeave, { passive: true });

    return () => {
      window.clearTimeout(fallbackTimer);
      if (rafId !== 0) cancelAnimationFrame(rafId);
      document.removeEventListener("pointermove", onMove, { capture: true } as EventListenerOptions);
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
