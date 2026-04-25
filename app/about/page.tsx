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

// Section index — small mono prefix, same vocabulary as the landing's
// 01-08 column. Keeps every block of the page editorially numbered.
function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4">
      <span
        className="label text-white tabular-nums"
        style={{ opacity: 0.4, letterSpacing: "0.32em" }}
      >
        {index}
      </span>
      <span
        aria-hidden="true"
        className="block h-px bg-white"
        style={{ width: 22, opacity: 0.25 }}
      />
      <span
        className="label text-white"
        style={{ opacity: 0.55, letterSpacing: "0.32em" }}
      >
        {children}
      </span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="px-6 md:px-10 pt-32 md:pt-28 pb-12 border-b border-white/10">
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 1 }}
        >
          À propos
        </h1>
      </div>

      {/* 01 — Bio */}
      <section className="px-6 md:px-10 pt-14 pb-16 md:pb-20">
        <SectionLabel index="01">Biographie</SectionLabel>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
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

          <div className="md:col-span-8 flex flex-col gap-8 max-w-2xl">
            {/* Lead — Cormorant, large, full weight. Manifeste. */}
            <p
              className="title text-white"
              style={{
                fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
                lineHeight: 1.35,
                opacity: 0.95,
              }}
            >
              Photographe et réalisateur à Bordeaux, 28 ans. Je crée des
              images pour les marques et les projets qui refusent de
              ressembler aux autres — campagnes, éditoriaux, films,
              quand l&apos;image doit dire quelque chose de précis.
            </p>

            {/* Body — Fragment Mono regular, smaller. Faits secs. */}
            <p
              className="text-white font-light"
              style={{
                fontFamily: "var(--font-fragment), monospace",
                fontSize: "0.85rem",
                lineHeight: 1.8,
                opacity: 0.7,
                letterSpacing: "0.01em",
              }}
            >
              Photographe depuis mes 15 ans, réalisateur depuis 23.
              Autodidacte pendant longtemps, puis diplômé de MJM Graphic
              Design en webdesign et motion.
            </p>

            {/* Voice — Cormorant italic. Personnel. */}
            <p
              className="title italic text-white"
              style={{
                fontSize: "clamp(1.05rem, 1.5vw, 1.2rem)",
                lineHeight: 1.6,
                opacity: 0.78,
              }}
            >
              Seul ou avec une équipe, selon le projet. Trois références
              reviennent toujours : Lars von Trier pour la tension, Ash
              Thorp pour la rigueur du motion, Beksiński pour l&apos;élégance
              sombre.
            </p>

            <Link
              href="/contact"
              className="label text-white hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-4 mt-2"
              style={{ opacity: 0.85, letterSpacing: "0.34em" }}
            >
              Écrivez-moi
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial pull-quote — italic Cormorant, full-bleed band */}
      <section className="px-6 md:px-10 py-20 md:py-28 border-y border-white/10">
        <blockquote className="max-w-5xl mx-auto text-center">
          <p
            className="title italic text-white"
            style={{
              fontSize: "clamp(1.6rem, 4.5vw, 3.4rem)",
              lineHeight: 1.18,
              opacity: 0.95,
            }}
          >
            « Refuser de ressembler aux autres. »
          </p>
        </blockquote>
      </section>

      {/* 02 — Clients (full-width marquee) */}
      <section className="pt-14 pb-10 md:pb-14">
        <div className="px-6 md:px-10 mb-8">
          <SectionLabel index="02">Clients</SectionLabel>
        </div>
        <div
          className="marquee-host relative overflow-hidden"
          aria-label="Clients"
          role="list"
        >
          {/* Edge fade so names don't pop in/out abruptly. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
            style={{
              background:
                "linear-gradient(to right, #000 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
            style={{
              background:
                "linear-gradient(to left, #000 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div
            className="marquee-track flex items-center gap-12 md:gap-20 whitespace-nowrap"
            style={{ width: "max-content" }}
          >
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span
                key={`${c}-${i}`}
                role={i < CLIENTS.length ? "listitem" : undefined}
                aria-hidden={i >= CLIENTS.length}
                className="title text-white"
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
                  opacity: 0.65,
                  letterSpacing: "0.01em",
                }}
              >
                {c}
                <span
                  aria-hidden="true"
                  className="inline-block ml-12 md:ml-20 align-middle h-px bg-white"
                  style={{ width: 28, opacity: 0.3 }}
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Influences */}
      <section className="px-6 md:px-10 pt-10 pb-24 md:pb-32">
        <SectionLabel index="03">Influences</SectionLabel>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 max-w-4xl">
          {INFLUENCES.map((i, idx) => (
            <li key={i} className="flex items-baseline gap-4">
              <span
                className="label text-white tabular-nums"
                style={{ opacity: 0.3, letterSpacing: "0.28em", fontSize: "10px" }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span
                className="text-white font-light"
                style={{ fontSize: "1rem", opacity: 0.85, letterSpacing: "0.01em" }}
              >
                {i}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
