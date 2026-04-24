"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Honour the OS "reduce motion" setting across every Framer animation on
// the site. CSS handles the @keyframes / transition side; this owns the
// JS-driven motion (scale, opacity, morphs, repeat loops).
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
