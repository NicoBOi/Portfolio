"use client";

import { motion } from "framer-motion";
import WorkGrid from "@/components/work/WorkGrid";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      {/* Identity header — compact, sets the brand without a full hero cycle */}
      <header className="px-6 md:px-10 pt-24 md:pt-32 pb-10 md:pb-14">
        <motion.div
          className="max-w-6xl mx-auto flex flex-col items-center text-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: SOFT }}
        >
          <motion.p
            className="label text-white"
            style={{ opacity: 0.55, letterSpacing: "0.32em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.8, delay: 0.3, ease: SOFT }}
          >
            Photo — Film — 3D
          </motion.p>
          <motion.h1
            className="text-white title"
            style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)", lineHeight: 1 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: SOFT }}
          >
            Nicolas Sempere
          </motion.h1>
          <motion.p
            className="label text-white"
            style={{ opacity: 0.4, letterSpacing: "0.22em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.8, delay: 0.55, ease: SOFT }}
          >
            Bordeaux — Paris
          </motion.p>
        </motion.div>
      </header>

      <WorkGrid />
    </div>
  );
}
