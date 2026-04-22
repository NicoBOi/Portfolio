"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
          className="label text-white transition-opacity duration-300 hover:opacity-100"
          style={{ opacity: isHome ? 0.5 : 0.7 }}
        >
          NS
        </Link>

        {/* Right — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/work", label: "Travaux" },
            { href: "/about", label: "À propos" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="label text-white transition-opacity duration-300 hover:opacity-100"
              style={{ opacity: pathname.startsWith(href) ? 1 : 0.4 }}
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
            className="fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {[
              { href: "/work", label: "Travaux" },
              { href: "/about", label: "À propos" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              >
                <Link
                  href={href}
                  className="text-white font-light tracking-widest uppercase text-2xl hover:opacity-100 transition-opacity"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
