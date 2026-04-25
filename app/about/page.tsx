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
  "Double Salto",
  "Felkin",
  "Made in Paris",
  "Philips",
  "Sephora",
  "Showroom Privé",
];

const INFLUENCES = [
  { name: "Lars von Trier", note: "Tension narrative" },
  { name: "Ash Thorp", note: "Rigueur du motion" },
  { name: "Zdzisław Beksiński", note: "Élégance sombre" },
];

// Section kicker — same treatment everywhere on the page so the rhythm
// reads instantly. Centered, mono uppercase, opacity 0.45.
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="label text-white text-center mb-10"
      style={{ opacity: 0.45, letterSpacing: "0.4em", fontSize: "11px" }}
    >
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <article className="bg-black min-h-screen">
      {/* Header — centered axis, same as the landing's title composition. */}
      <header className="px-6 md:px-10 pt-32 md:pt-32 pb-16 md:pb-20 text-center border-b border-white/10">
        <p
          className="label text-white mb-8"
          style={{ opacity: 0.4, letterSpacing: "0.4em", fontSize: "11px" }}
        >
          Bordeaux · Photo · Film · 3D
        </p>
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(3rem, 8vw, 8rem)", lineHeight: 1 }}
        >
          À propos
        </h1>
      </header>

      {/* Bio — portrait centered above, text centered below, all on the axis. */}
      <section className="px-6 md:px-10 py-20 md:py-24 border-b border-white/10">
        <SectionTitle>Biographie</SectionTitle>
        <div className="flex flex-col items-center gap-10 md:gap-12">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "4/5", backgroundColor: "#1A1A1A", maxWidth: 360 }}
          >
            <Image
              src="/about/portrait.avif"
              alt="Nicolas Sempere"
              fill
              priority
              sizes="(min-width: 768px) 360px, 80vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-5 max-w-2xl text-center">
            <p
              className="text-white font-light"
              style={{ fontSize: "1.05rem", lineHeight: 1.85, opacity: 1 }}
            >
              Photographe et réalisateur à Bordeaux, 28 ans. Je crée des
              images pour les marques et les projets qui refusent de
              ressembler aux autres — campagnes, éditoriaux, films, quand
              l&apos;image doit dire quelque chose de précis.
            </p>
            <p
              className="text-white font-light"
              style={{ fontSize: "1rem", lineHeight: 1.8, opacity: 0.55 }}
            >
              Photographe depuis mes 15 ans, réalisateur depuis 23.
              Autodidacte pendant longtemps, puis diplômé de MJM Graphic
              Design en webdesign et motion. Seul ou avec une équipe,
              selon le projet.
            </p>
          </div>
        </div>
      </section>

      {/* Clients — centered grid, alphabetical. */}
      <section className="px-6 md:px-10 py-20 md:py-24 border-b border-white/10">
        <SectionTitle>Clients</SectionTitle>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 max-w-xl mx-auto text-center">
          {CLIENTS.map((c) => (
            <li
              key={c}
              className="text-white font-light"
              style={{ fontSize: "1rem", opacity: 0.95, lineHeight: 1.8 }}
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Influences — centered, name + note stacked. */}
      <section className="px-6 md:px-10 py-20 md:py-24 border-b border-white/10">
        <SectionTitle>Influences</SectionTitle>
        <ul className="flex flex-col gap-8 max-w-md mx-auto text-center">
          {INFLUENCES.map((inf) => (
            <li key={inf.name} className="flex flex-col gap-1">
              <span
                className="text-white font-light"
                style={{ fontSize: "1.05rem", opacity: 1 }}
              >
                {inf.name}
              </span>
              <span
                className="label text-white"
                style={{ opacity: 0.45, letterSpacing: "0.32em", fontSize: "11px" }}
              >
                {inf.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA — centered. */}
      <section className="px-6 md:px-10 py-20 md:py-24 flex justify-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-4 group"
          style={{ opacity: 0.95 }}
        >
          <span
            aria-hidden="true"
            className="block h-px bg-white transition-all duration-500 group-hover:w-16"
            style={{ width: 32, opacity: 0.65 }}
          />
          <span
            className="label text-white group-hover:opacity-100 transition-opacity duration-300"
            style={{ letterSpacing: "0.4em", fontSize: "12px" }}
          >
            Écrivez-moi
          </span>
        </Link>
      </section>
    </article>
  );
}
