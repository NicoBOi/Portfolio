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
    <div className="px-6 md:px-10 py-10 border-t border-[#E8E8E8] grid grid-cols-3 items-center">
      {/* Prev */}
      <div>
        {prev && (
          <Link
            href={`/work/${prev.slug}`}
            className="group flex items-center gap-4"
          >
            <span className="w-6 h-px bg-black transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:w-12" />
            <div>
              <p className="label opacity-30 mb-1">PREVIOUS</p>
              <p className="font-display italic font-light text-lg leading-tight">
                {prev.title}
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Center */}
      <div className="flex justify-center">
        <Link
          href="/work"
          className="label opacity-30 hover:opacity-100 transition-opacity duration-300"
        >
          ALL WORK
        </Link>
      </div>

      {/* Next */}
      <div className="flex justify-end">
        {next && (
          <Link
            href={`/work/${next.slug}`}
            className="group flex items-center gap-4 text-right"
          >
            <div>
              <p className="label opacity-30 mb-1">NEXT</p>
              <p className="font-display italic font-light text-lg leading-tight">
                {next.title}
              </p>
            </div>
            <span className="w-6 h-px bg-black transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:w-12" />
          </Link>
        )}
      </div>
    </div>
  );
}
