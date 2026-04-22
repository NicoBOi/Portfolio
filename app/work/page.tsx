import type { Metadata } from "next";
import Link from "next/link";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = { title: "Travaux" };

export default function WorkPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Back */}
      <div className="px-6 md:px-10 pt-20">
        <Link
          href="/"
          className="label text-white hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
          style={{ opacity: 0.3 }}
        >
          <span aria-hidden="true">←</span>
          Accueil
        </Link>
      </div>

      <div className="px-6 md:px-10 pt-12 pb-6">
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 1 }}
        >
          Travaux
        </h1>
      </div>

      <WorkGrid />
    </div>
  );
}
