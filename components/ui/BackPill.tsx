"use client";

import Link from "next/link";

interface Props {
  href: string;
  label: string;
}

export default function BackPill({ href, label }: Props) {
  return (
    <Link
      href={href}
      className="fixed top-20 left-6 md:left-10 z-40 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 label text-white hover:bg-black/60 hover:border-white/30 transition-colors duration-300"
      style={{ opacity: 0.85 }}
      data-cursor="Retour"
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  );
}
