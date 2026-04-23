"use client";

import { motion } from "framer-motion";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: SOFT }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative h-12 w-px bg-white/15 overflow-hidden">
          <motion.div
            className="absolute left-0 w-full bg-white"
            style={{ opacity: 0.8, height: 8 }}
            animate={{ y: [-10, 48] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          />
        </div>
        <motion.span
          className="label text-white"
          style={{ opacity: 0.35, letterSpacing: "0.32em" }}
          animate={{ opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          Chargement
        </motion.span>
      </motion.div>
    </div>
  );
}
