import type { Metadata } from "next";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected photography and film work by Nicolas Sempere.",
};

export default function WorkPage() {
  return (
    <div className="pt-28 pb-28">
      <div className="px-6 md:px-10 mb-10 md:mb-16 flex items-end justify-between">
        <h1 className="font-display font-light italic text-display-xl leading-none">
          Work
        </h1>
        <p className="label opacity-30 hidden md:block pb-2">
          BORDEAUX · PARIS
        </p>
      </div>
      <WorkGrid />
    </div>
  );
}
