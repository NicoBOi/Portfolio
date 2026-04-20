"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const STAGGER = 0.12;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function RevealLine({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
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
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-between px-6 md:px-10 pt-14 pb-8 overflow-hidden"
    >
      {/* ── Main name block ─────────────────────────────── */}
      <motion.div
        className="flex-1 flex flex-col justify-center"
        style={{ y: nameY, opacity: nameOpacity }}
      >
        {/* Tag line above */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
          className="label opacity-35 mb-6 md:mb-8"
        >
          PHOTOGRAPHER · FILMMAKER
        </motion.p>

        {/* Name — each line mask-reveals upward */}
        <div>
          <RevealLine delay={0.15}>
            <h1
              className="font-display font-light italic text-black leading-none select-none text-display-hero"
            >
              Nicolas
            </h1>
          </RevealLine>

          <div className="flex items-end flex-wrap gap-x-6">
            <RevealLine delay={0.15 + STAGGER}>
              <h1
                className="font-display font-light italic text-black leading-none select-none text-display-hero"
              >
                Sempere
              </h1>
            </RevealLine>

            {/* Discipline block — appears after name */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
              className="pb-2 md:pb-3 hidden sm:block"
            >
              <div
                className="w-px bg-black/20 mx-auto mb-1"
                style={{ height: "2.5rem" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Statement */}
        <div className="overflow-hidden mt-8 md:mt-12">
          <motion.p
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="font-display font-light italic text-black/25 text-display-md max-w-xl"
          >
            I don&apos;t capture moments. I build them.
          </motion.p>
        </div>
      </motion.div>

      {/* ── Bottom bar ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
        className="flex items-center justify-between"
      >
        <span className="label opacity-30">BORDEAUX · PARIS</span>

        <Link
          href="/work"
          className="label group flex items-center gap-4 hover:opacity-50 transition-opacity duration-400"
        >
          VIEW WORK
          <span className="block h-px bg-black w-8 transition-all duration-600 ease-[var(--ease-out-expo)] group-hover:w-16" />
        </Link>
      </motion.div>

      {/* ── Scroll indicator ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0"
        aria-hidden
      >
        <span className="label opacity-20 mb-3" style={{ fontSize: 8 }}>
          SCROLL
        </span>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
          className="w-px h-10 bg-black/20 origin-top"
        />
      </motion.div>

      {/* ── Corner index ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute top-20 right-6 md:right-10"
      >
        <span className="label opacity-20">01 / HOME</span>
      </motion.div>
    </section>
  );
}
