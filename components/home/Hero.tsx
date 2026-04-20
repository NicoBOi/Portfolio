"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Line({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-between px-5 md:px-8 pt-14 pb-7 bg-black overflow-hidden"
    >
      {/* ── Background index number ─── */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="pointer-events-none select-none absolute right-0 bottom-0 text-white font-display leading-none"
        style={{ fontSize: "clamp(18rem, 50vw, 60rem)", lineHeight: 0.75 }}
        aria-hidden
      >
        01
      </motion.span>

      {/* ── Name block ──────────────── */}
      <motion.div
        className="flex-1 flex flex-col justify-center relative z-10"
        style={{ y, opacity }}
      >
        <Line delay={0.1}>
          <h1 className="text-hero text-white leading-none">Nicolas</h1>
        </Line>
        <Line delay={0.18}>
          <h1 className="text-hero text-white leading-none">Sempere</h1>
        </Line>

        {/* ── Rule ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="origin-left h-0.5 bg-white mt-6 md:mt-8 mb-5 md:mb-6 w-full"
          style={{ opacity: 0.18 }}
        />

        {/* ── Discipline ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="label text-white"
        >
          Photographer &mdash; Filmmaker
        </motion.p>
      </motion.div>

      {/* ── Bottom bar ──────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="relative z-10 flex items-end justify-between"
      >
        <span className="label text-white opacity-30">
          Bordeaux &mdash; Paris
        </span>

        <Link
          href="/work"
          className="label text-white opacity-60 hover:opacity-100 transition-opacity duration-300 flex items-center gap-4"
        >
          View Work
          <motion.span
            className="block h-px bg-white"
            initial={{ width: 24 }}
            whileHover={{ width: 56 }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </Link>
      </motion.div>

      {/* ── Scroll indicator ────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
          className="w-px h-10 bg-white origin-top"
        />
      </motion.div>
    </section>
  );
}
