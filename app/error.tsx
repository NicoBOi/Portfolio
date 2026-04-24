"use client";

import { useEffect } from "react";
import Link from "next/link";

// App Router catches render/runtime errors anywhere below <html>/<body>
// and routes them here. Kept minimal + editorial so a crashed project
// page doesn't fall back to the raw Next error shell.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[portfolio] render error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center gap-8">
      <p
        className="label text-white"
        style={{ opacity: 0.45, letterSpacing: "0.38em" }}
      >
        Erreur
      </p>
      <h1
        className="title text-white"
        style={{ fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 1.05 }}
      >
        Quelque chose s&apos;est cassé
      </h1>
      <p className="text-white/70 max-w-md" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
        L&apos;incident a été capté. Tu peux réessayer ou rentrer à l&apos;accueil.
      </p>
      <div className="flex items-center gap-6 mt-4">
        <button
          type="button"
          onClick={() => reset()}
          className="label text-white border-b border-white/40 hover:border-white transition-colors duration-300 px-3 py-2 -mx-3 -my-2"
          style={{ letterSpacing: "0.34em" }}
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="label text-white border-b border-white/40 hover:border-white transition-colors duration-300 px-3 py-2 -mx-3 -my-2"
          style={{ letterSpacing: "0.34em" }}
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}
