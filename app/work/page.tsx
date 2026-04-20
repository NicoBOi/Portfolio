import type { Metadata } from "next";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <div className="pt-28 pb-28 bg-black min-h-screen">
      <div className="px-5 md:px-8 mb-10 md:mb-14">
        <p className="label text-white opacity-25 mb-4">[02] Work</p>
        <h1 className="text-display text-white">Selected Work</h1>
      </div>
      <WorkGrid />
    </div>
  );
}
