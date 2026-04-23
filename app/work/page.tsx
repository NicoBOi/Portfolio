import type { Metadata } from "next";
import WorkGrid from "@/components/work/WorkGrid";
import BackPill from "@/components/ui/BackPill";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Sélection de projets photographiques de Nicolas Sempere. Portrait, mode, éditorial, personnel.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: "/work",
    title: "Projets — Nicolas Sempere",
    description:
      "Sélection de projets photographiques de Nicolas Sempere. Portrait, mode, éditorial, personnel.",
    siteName: "Nicolas Sempere",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projets — Nicolas Sempere",
    description:
      "Sélection de projets photographiques. Portrait, mode, éditorial, personnel.",
  },
};

export default function WorkPage() {
  return (
    <div className="bg-black min-h-screen">
      <BackPill href="/" label="Accueil" />

      <div className="px-6 md:px-10 pt-32 pb-6">
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 1 }}
        >
          Projets
        </h1>
      </div>

      <WorkGrid />
    </div>
  );
}
