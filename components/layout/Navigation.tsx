"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/work", label: "WORK" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14 transition-colors duration-300 ${
          open
            ? "bg-black"
            : scrolled
            ? "bg-white border-b border-[#E8E8E8]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`label transition-colors duration-300 ${
            open ? "text-white" : "text-black"
          }`}
        >
          NICOLAS SEMPERE
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`label transition-opacity duration-300 hover:opacity-100 ${
                pathname.startsWith(href) ? "opacity-100" : "opacity-35"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`md:hidden label transition-colors duration-300 ${
            open ? "text-white" : "text-black"
          }`}
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-start justify-center px-8 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {NAV_LINKS.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={href}
                    className="font-display text-white italic font-light"
                    style={{ fontSize: "clamp(2.5rem, 12vw, 5rem)" }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="absolute bottom-10 left-8 flex flex-col gap-1"
            >
              <span className="label text-white/30">BORDEAUX · PARIS</span>
              <a
                href="https://instagram.com/nicolas_Sempere"
                target="_blank"
                rel="noopener noreferrer"
                className="label text-white/30"
              >
                @nicolas_Sempere
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
