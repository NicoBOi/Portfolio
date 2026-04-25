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

// Small mono label that anchors each section. One consistent treatment
// across the whole page so the eye knows where it is at a glance.
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="label text-white mb-8"
      style={{ opacity: 0.5, letterSpacing: "0.36em", fontSize: "11px" }}
    >
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <article className="bg-black min-h-screen">
      {/* Header */}
      <header className="px-6 md:px-10 pt-32 md:pt-28 pb-12 border-b border-white/10">
        <p
          className="label text-white mb-6"
          style={{ opacity: 0.4, letterSpacing: "0.36em", fontSize: "11px" }}
        >
          Bordeaux · Photo · Film · 3D
        </p>
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(3rem, 7vw, 7rem)", lineHeight: 1 }}
        >
          À propos
        </h1>
      </header>

      {/* Bio */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-b border-white/10">
        <SectionTitle>Biographie</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4/5", backgroundColor: "#1A1A1A", maxWidth: 380 }}
            >
              <Image
                src="/about/portrait.avif"
                alt="Nicolas Sempere"
                fill
                priority
                sizes="(min-width: 768px) 380px, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-5 max-w-2xl">
            <p
              className="text-white font-light"
              style={{ fontSize: "1rem", lineHeight: 1.85, opacity: 0.9 }}
            >
              Photographe et réalisateur à Bordeaux, 28 ans. Je crée des
              images pour les marques et les projets qui refusent de
              ressembler aux autres — campagnes, éditoriaux, films, quand
              l&apos;image doit dire quelque chose de précis.
            </p>
            <p
              className="text-white font-light"
              style={{ fontSize: "1rem", lineHeight: 1.85, opacity: 0.75 }}
            >
              Photographe depuis mes 15 ans, réalisateur depuis 23.
              Autodidacte pendant longtemps, puis diplômé de MJM Graphic
              Design en webdesign et motion.
            </p>
            <p
              className="text-white font-light"
              style={{ fontSize: "1rem", lineHeight: 1.85, opacity: 0.6 }}
            >
              Seul ou avec une équipe, selon le projet.
            </p>
          </div>
        </div>
      </section>

      {/* Clients — clean two-column list, alphabetical. */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-b border-white/10">
        <SectionTitle>Clients</SectionTitle>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 max-w-3xl">
          {CLIENTS.map((c) => (
            <li
              key={c}
              className="text-white font-light flex items-baseline gap-3"
              style={{ fontSize: "1rem", opacity: 0.85, lineHeight: 1.6 }}
            >
              <span
                aria-hidden="true"
                className="block h-px bg-white"
                style={{ width: 12, opacity: 0.3 }}
              />
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Influences — name + role, table-like rhythm. */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-b border-white/10">
        <SectionTitle>Influences</SectionTitle>
        <ul className="flex flex-col divide-y divide-white/10 max-w-3xl">
          {INFLUENCES.map((inf) => (
            <li
              key={inf.name}
              className="grid grid-cols-12 items-baseline py-4 gap-4"
            >
              <span
                className="col-span-12 sm:col-span-6 text-white font-light"
                style={{ fontSize: "1rem", opacity: 0.9 }}
              >
                {inf.name}
              </span>
              <span
                className="col-span-12 sm:col-span-6 text-white font-light sm:text-right"
                style={{ fontSize: "0.9rem", opacity: 0.55 }}
              >
                {inf.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-16 md:py-20">
        <Link
          href="/contact"
          className="inline-flex items-center gap-4 group"
          style={{ opacity: 0.85 }}
        >
          <span
            aria-hidden="true"
            className="block h-px bg-white transition-all duration-500 group-hover:w-16"
            style={{ width: 32, opacity: 0.6 }}
          />
          <span
            className="label text-white group-hover:opacity-100 transition-opacity duration-300"
            style={{ letterSpacing: "0.36em" }}
          >
            Écrivez-moi
          </span>
        </Link>
      </section>
    </article>
  );
}
