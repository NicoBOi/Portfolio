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

    // Smooth-trailing cursor. We track the "target" mouse position on every
    // mousemove and lerp the rendered cursor towards it on each rAF tick.
    // The interpolation is delta-time aware so the settle time feels the
    // same on a 60Hz monitor as on a 120Hz ProMotion display — the cursor
    // is just rendered more often on the latter.
    //
    //   x_new = x + (target - x) * (1 - e^(-dt / TAU_MS))
    //
    // TAU controls the perceived weight: lower = snappier, higher = more
    // trailing. 28ms feels premium without ever feeling laggy.
    const TAU_MS = 28;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let last = 0;
    let rafId: number | null = null;

    const paint = () => {
      el.style.transform = `translate3d(${currentX - 5}px, ${currentY - 5}px, 0)`;
    };

    const tick = (now: number) => {
      const dt = last === 0 ? 16 : Math.min(64, now - last);
      last = now;
      const factor = 1 - Math.exp(-dt / TAU_MS);
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;
      paint();
      if (
        Math.abs(targetX - currentX) > 0.4 ||
        Math.abs(targetY - currentY) > 0.4
      ) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Snap to exact target so the next gesture starts from the truth.
        currentX = targetX;
        currentY = targetY;
        paint();
        rafId = null;
        last = 0;
      }
    };

    const show = (x: number, y: number) => {
      targetX = x;
      targetY = y;
      // First show: snap into place so the cursor doesn't sweep in from
      // 0,0 the very first time the mouse enters the page.
      if (!visible) {
        currentX = x;
        currentY = y;
        paint();
        el.style.opacity = "1";
        visible = true;
      }
      if (rafId === null) {
        last = 0;
        rafId = requestAnimationFrame(tick);
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

    document.addEventListener("mousemove", onMove, { passive: true, capture: true });
    document.addEventListener("mouseover", onOver, { passive: true, capture: true });
    document.addEventListener("mouseout", onWindowOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocLeave, { passive: true });

    return () => {
      window.clearTimeout(fallbackTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
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
