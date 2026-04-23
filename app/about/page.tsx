import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Nicolas Sempere, 28 ans, basé à Bordeaux. Photographe depuis l'adolescence, réalisateur depuis cinq ans. Images brutes, minimales, spectaculaires.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: "À propos — Nicolas Sempere",
    description:
      "Nicolas Sempere, photographe et réalisateur basé à Bordeaux. Images brutes, minimales, spectaculaires.",
    siteName: "Nicolas Sempere",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos — Nicolas Sempere",
    description:
      "Photographe et réalisateur basé à Bordeaux. Images brutes, minimales, spectaculaires.",
  },
};

const CLIENTS = [
  "A Better Feeling",
  "Philips",
  "Sephora",
  "Showroom Privé",
  "Double Salto",
  "Felkin",
  "Made in Paris",
];

const INFLUENCES = ["Lars von Trier", "Ash Thorp", "Zdzisław Beksiński"];

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen px-6 md:px-10">
      {/* Back */}
      <div className="pt-20 pb-0">
        <Link
          href="/"
          className="label text-white hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
          style={{ opacity: 0.3 }}
        >
          <span aria-hidden="true">←</span>
          Accueil
        </Link>
      </div>

      {/* Header */}
      <div className="pt-14 pb-12 border-b border-white/10">
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 1 }}
        >
          À propos
        </h1>
      </div>

      {/* Two col */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 py-14">
        {/* Portrait */}
        <div className="md:col-span-4">
          <div
            className="w-full overflow-hidden"
            style={{ aspectRatio: "4/5", backgroundColor: "#1A1A1A", maxWidth: 400 }}
          >
            <img
              src="/about/portrait.avif"
              alt="Nicolas Sempere"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <p className="label text-white mt-3" style={{ opacity: 0.2 }}>
            Bordeaux — Paris
          </p>
        </div>

        {/* Text */}
        <div className="md:col-span-8 flex flex-col gap-10">
          <div className="flex flex-col gap-5 max-w-xl">
            <p
              className="text-white font-light leading-relaxed"
              style={{ fontSize: "0.95rem", opacity: 0.75, lineHeight: 1.9 }}
            >
              28 ans, basé à Bordeaux.
              Photo depuis mes 15 ans, vidéo depuis 5.
              Autodidacte au départ, puis diplômé du MJM Graphic Design
              en webdesign et motion.
            </p>
            <p
              className="text-white font-light leading-relaxed"
              style={{ fontSize: "0.95rem", opacity: 0.55, lineHeight: 1.9 }}
            >
              Je fais des images qui transportent.
              Brut, minimal, spectaculaire.
            </p>
            <p
              className="text-white font-light leading-relaxed"
              style={{ fontSize: "0.95rem", opacity: 0.45, lineHeight: 1.9 }}
            >
              Seul ou avec mon équipe, selon les projets.
              Art, mode, marques qui veulent sortir du rang. Pas la santé.
            </p>

            <Link
              href="/contact"
              className="label text-white hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 mt-2"
              style={{ opacity: 0.55 }}
            >
              Écris-moi
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Clients + Influences */}
          <div className="border-t border-white/10 pt-10 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="label text-white mb-6" style={{ opacity: 0.22 }}>
                Clients
              </p>
              <ul className="flex flex-col gap-2.5">
                {CLIENTS.map((c) => (
                  <li
                    key={c}
                    className="text-white font-light"
                    style={{ fontSize: "0.85rem", opacity: 0.55, letterSpacing: "0.02em" }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-white mb-6" style={{ opacity: 0.22 }}>
                Influences
              </p>
              <ul className="flex flex-col gap-2.5">
                {INFLUENCES.map((i) => (
                  <li
                    key={i}
                    className="text-white font-light"
                    style={{ fontSize: "0.85rem", opacity: 0.55, letterSpacing: "0.02em" }}
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
