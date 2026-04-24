"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  const isActive = (href: string) => (href === "/" ? isHome : pathname.startsWith(href));

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    // Surface the menu state so other fixed elements (landing back button)
    // can get out of the way via CSS.
    document.documentElement.classList.toggle("nav-open", open);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("nav-open");
    };
  }, [open]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14"
        data-cursor-suppress
      >
        {/* Left */}
        <Link
          href="/"
          className="title text-white transition-opacity duration-300 hover:opacity-100"
          style={{
            opacity: isHome ? 0.75 : 0.9,
            fontSize: "1.1rem",
          }}
        >
          NS
        </Link>

        {/* Right — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/about", label: "À propos" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="label text-white transition-opacity duration-300 hover:opacity-100"
              style={{ opacity: isActive(href) ? 1 : 0.55 }}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right — mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden label text-white"
          style={{ opacity: 0.6 }}
          aria-label="Menu"
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black md:hidden flex flex-col"
          >
            {/* Top band — identity */}
            <motion.div
              className="px-6 pt-24 pb-8"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="label text-white" style={{ opacity: 0.4, letterSpacing: "0.3em" }}>
                Photo — Film — 3D
              </p>
              <p className="label text-white mt-3" style={{ opacity: 0.35, letterSpacing: "0.24em" }}>
                Bordeaux — Paris
              </p>
            </motion.div>

            {/* Main links */}
            <nav className="flex-1 flex flex-col justify-center px-6 gap-8">
              {[
                { href: "/", label: "Projets" },
                { href: "/about", label: "À propos" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }, i) => {
                const current = isActive(href);
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={current ? "page" : undefined}
                      className="text-white title inline-flex items-baseline gap-4 hover:opacity-100 transition-opacity"
                      style={{
                        fontSize: "clamp(2.2rem, 9vw, 3.5rem)",
                        lineHeight: 1,
                        opacity: current ? 1 : 0.55,
                      }}
                    >
                      {current && (
                        <span
                          aria-hidden="true"
                          className="block h-px bg-white self-center"
                          style={{ width: 44, opacity: 0.8 }}
                        />
                      )}
                      {label}
                      <span
                        aria-hidden="true"
                        className="label opacity-30"
                        style={{ fontSize: "10px" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom band — contact */}
            <motion.div
              className="px-6 pb-10 flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <a
                href="mailto:nicosmp.pro@gmail.com"
                className="label text-white hover:opacity-100 transition-opacity"
                style={{ opacity: 0.55 }}
              >
                nicosmp.pro@gmail.com
              </a>
              <a
                href="https://instagram.com/nicolas_Sempere"
                target="_blank"
                rel="noopener noreferrer"
                className="label text-white hover:opacity-100 transition-opacity"
                style={{ opacity: 0.55 }}
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
