"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 h-14 transition-colors duration-300 ${
          open ? "bg-black" : scrolled ? "bg-black border-b border-white/10" : "bg-transparent"
        }`}
      >
        <Link href="/" className="label text-white opacity-60 hover:opacity-100 transition-opacity duration-300">
          NS
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`label transition-opacity duration-300 hover:opacity-100 ${
                pathname.startsWith(href) ? "text-white opacity-100" : "text-white opacity-35"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden label text-white opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black flex flex-col justify-center px-5 md:hidden"
          >
            {NAV.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={href} className="text-display text-white block py-1">
                  {label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-8 left-5"
            >
              <p className="label text-white">Bordeaux &mdash; Paris</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
