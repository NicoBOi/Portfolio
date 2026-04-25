import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Nicolas Sempere — photographie, film, motion 3D. 28 ans, basé à Bordeaux. Images brutes, minimales, spectaculaires.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: "À propos — Nicolas Sempere",
    description:
      "Photographe, réalisateur et motion designer 3D basé à Bordeaux. Images brutes, minimales, spectaculaires.",
    siteName: "Nicolas Sempere",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos — Nicolas Sempere",
    description:
      "Photo, film, motion 3D. Basé à Bordeaux. Images brutes, minimales, spectaculaires.",
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
      {/* Header. Back-to-home lives in the top nav (NS slot is replaced by
          a Retour affordance on every inner page) — no duplicate in the page. */}
      <div className="pt-32 md:pt-28 pb-12 border-b border-white/10">
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
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "4/5", backgroundColor: "#1A1A1A", maxWidth: 400 }}
          >
            <Image
              src="/about/portrait.avif"
              alt="Nicolas Sempere"
              fill
              priority
              sizes="(min-width: 768px) 400px, 100vw"
              className="object-cover"
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
              style={{ fontSize: "0.95rem", opacity: 0.9, lineHeight: 1.9 }}
            >
              Photographe et réalisateur à Bordeaux, 28 ans. Je crée
              des images pour les marques et les projets qui refusent
              de ressembler aux autres — campagnes, éditoriaux, films,
              quand l&apos;image doit dire quelque chose de précis.
            </p>
            <p
              className="text-white font-light leading-relaxed"
              style={{ fontSize: "0.95rem", opacity: 0.75, lineHeight: 1.9 }}
            >
              Photographe depuis mes 15 ans, réalisateur depuis 23.
              Autodidacte pendant longtemps, puis diplômé de MJM
              Graphic Design en webdesign et motion.
            </p>
            <p
              className="text-white font-light leading-relaxed"
              style={{ fontSize: "0.95rem", opacity: 0.65, lineHeight: 1.9 }}
            >
              Seul ou avec une équipe, selon le projet. Trois
              références reviennent toujours : Lars von Trier pour
              la tension, Ash Thorp pour la rigueur du motion,
              Beksiński pour l&apos;élégance sombre.
            </p>

            <Link
              href="/contact"
              className="label text-white hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 mt-2"
              style={{ opacity: 0.8 }}
            >
              Écrivez-moi
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Clients + Influences */}
          <div className="border-t border-white/10 pt-10 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="label text-white mb-6" style={{ opacity: 0.5 }}>
                Clients
              </p>
              <ul className="flex flex-col gap-2.5">
                {CLIENTS.map((c) => (
                  <li
                    key={c}
                    className="text-white font-light"
                    style={{ fontSize: "0.85rem", opacity: 0.75, letterSpacing: "0.02em" }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-white mb-6" style={{ opacity: 0.5 }}>
                Influences
              </p>
              <ul className="flex flex-col gap-2.5">
                {INFLUENCES.map((i) => (
                  <li
                    key={i}
                    className="text-white font-light"
                    style={{ fontSize: "0.85rem", opacity: 0.75, letterSpacing: "0.02em" }}
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
