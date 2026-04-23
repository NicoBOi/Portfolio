import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectNav({
  prev,
  next,
}: {
  prev: Project | null;
  next: Project | null;
}) {
  return (
    <div className="px-6 md:px-10 py-8 border-t border-white/10 grid grid-cols-3 items-center gap-4">
      <div>
        {prev && (
          <Link href={`/work/${prev.slug}`} className="group flex items-center gap-3">
            <span className="block w-5 h-px bg-white opacity-35 group-hover:w-10 group-hover:opacity-80 transition-all duration-400" />
            <div>
              <p className="label text-white mb-1" style={{ opacity: 0.5 }}>Précédent</p>
              <p
                className="text-white title"
                style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)" }}
              >
                {prev.title}
              </p>
            </div>
          </Link>
        )}
      </div>

      <div className="flex justify-center">
        <Link
          href="/"
          className="label text-white hover:opacity-100 transition-opacity duration-300"
          style={{ opacity: 0.55 }}
        >
          ← Tous les projets
        </Link>
      </div>

      <div className="flex justify-end">
        {next && (
          <Link href={`/work/${next.slug}`} className="group flex items-center gap-3 text-right">
            <div>
              <p className="label text-white mb-1" style={{ opacity: 0.5 }}>Suivant</p>
              <p
                className="text-white title"
                style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)" }}
              >
                {next.title}
              </p>
            </div>
            <span className="block w-5 h-px bg-white opacity-35 group-hover:w-10 group-hover:opacity-80 transition-all duration-400" />
          </Link>
        )}
      </div>
    </div>
  );
}
