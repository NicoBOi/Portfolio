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
    <div className="px-5 md:px-8 py-8 border-t border-white/10 grid grid-cols-3 items-center gap-4">
      <div>
        {prev && (
          <Link href={`/work/${prev.slug}`} className="group flex items-center gap-3">
            <span className="w-5 h-px bg-white opacity-40 transition-all duration-400 group-hover:w-10 group-hover:opacity-80" />
            <div>
              <p className="label text-white opacity-25 mb-1">Prev</p>
              <p className="text-heading text-white leading-none">{prev.title}</p>
            </div>
          </Link>
        )}
      </div>

      <div className="flex justify-center">
        <Link href="/work" className="label text-white opacity-25 hover:opacity-70 transition-opacity duration-300">
          All Work
        </Link>
      </div>

      <div className="flex justify-end">
        {next && (
          <Link href={`/work/${next.slug}`} className="group flex items-center gap-3 text-right">
            <div>
              <p className="label text-white opacity-25 mb-1">Next</p>
              <p className="text-heading text-white leading-none">{next.title}</p>
            </div>
            <span className="w-5 h-px bg-white opacity-40 transition-all duration-400 group-hover:w-10 group-hover:opacity-80" />
          </Link>
        )}
      </div>
    </div>
  );
}
