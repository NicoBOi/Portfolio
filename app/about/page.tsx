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

const INFLUENCES = [
  { name: "Lars von Trier", note: "Tension" },
  { name: "Ash Thorp", note: "Rigueur du motion" },
  { name: "Zdzisław Beksiński", note: "Élégance sombre" },
];

// Decorative oversized section index — Cormorant italic, very low opacity,
// sits like a pulled-back chapter opener on a printed page. Purely visual,
// aria-hidden so screen readers skip it.
function PlateIndex({ value }: { value: string }) {
  return (
    <span
      aria-hidden="true"
      className="title italic text-white tabular-nums select-none pointer-events-none"
      style={{
        fontSize: "clamp(5rem, 10vw, 10rem)",
        lineHeight: 0.85,
        opacity: 0.07,
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Header — title only. No section label, no border noise. */}
      <header className="px-6 md:px-10 pt-32 md:pt-32 pb-24 md:pb-32">
        <p
          className="label text-white mb-8"
          style={{ opacity: 0.4, letterSpacing: "0.4em", fontSize: "11px" }}
        >
          Nicolas Sempere — Bordeaux
        </p>
        <h1
          className="text-white title"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 11rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
          }}
        >
          À propos
        </h1>
      </header>

      {/* Portrait + manifeste — asymmetric grid with hanging plate. */}
      <section className="relative px-6 md:px-10 pb-24 md:pb-40">
        <div className="absolute -top-12 right-6 md:right-10 pointer-events-none">
          <PlateIndex value="01" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5 md:col-start-1">
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4/5", backgroundColor: "#1A1A1A", maxWidth: 460 }}
            >
              <Image
                src="/about/portrait.avif"
                alt="Nicolas Sempere"
                fill
                priority
                sizes="(min-width: 768px) 460px, 100vw"
                className="object-cover"
              />
            </div>
            <p className="label text-white mt-4" style={{ opacity: 0.35, letterSpacing: "0.32em", fontSize: "11px" }}>
              Portrait — 2024
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7 flex flex-col justify-end gap-8 max-w-xl">
            <p
              className="text-white font-light"
              style={{
                fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                opacity: 0.9,
                lineHeight: 1.85,
              }}
            >
              Photographe et réalisateur à Bordeaux, 28 ans. Je crée
              des images pour les marques et les projets qui refusent
              de ressembler aux autres — campagnes, éditoriaux, films,
              quand l&apos;image doit dire quelque chose de précis.
              Photographe depuis mes 15 ans, réalisateur depuis 23.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-4 group max-w-fit"
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
          </div>
        </div>
      </section>

      {/* Pull-quote — full-bleed, large italic Cormorant. The keystone. */}
      <section className="px-6 md:px-10 py-24 md:py-32">
        <blockquote className="max-w-5xl mx-auto text-center">
          <p
            className="title italic text-white"
            style={{
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              lineHeight: 1.1,
              opacity: 0.95,
              letterSpacing: "-0.005em",
            }}
          >
            Refuser de ressembler aux autres.
          </p>
        </blockquote>
      </section>

      {/* Clients — full-bleed marquee, no chrome. */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="absolute -top-8 left-6 md:left-10 pointer-events-none">
          <PlateIndex value="02" />
        </div>
        <p
          className="label text-white px-6 md:px-10 mb-10"
          style={{ opacity: 0.45, letterSpacing: "0.4em", fontSize: "11px" }}
        >
          Clients
        </p>
        <div
          className="marquee-host relative overflow-hidden"
          aria-label="Clients"
          role="list"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10"
            style={{
              background: "linear-gradient(to right, #000 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10"
            style={{
              background: "linear-gradient(to left, #000 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div
            className="marquee-track flex items-center gap-16 md:gap-24 whitespace-nowrap"
            style={{ width: "max-content" }}
          >
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span
                key={`${c}-${i}`}
                role={i < CLIENTS.length ? "listitem" : undefined}
                aria-hidden={i >= CLIENTS.length}
                className="title italic text-white"
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                  opacity: 0.7,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Influences — annotated list, two columns: name + the note that reads
          almost as a marginalia. Each line a single editorial phrase. */}
      <section className="relative px-6 md:px-10 pt-24 md:pt-32 pb-32 md:pb-40">
        <div className="absolute -top-8 right-6 md:right-10 pointer-events-none">
          <PlateIndex value="03" />
        </div>
        <p
          className="label text-white mb-10"
          style={{ opacity: 0.45, letterSpacing: "0.4em", fontSize: "11px" }}
        >
          Influences
        </p>
        <ul className="flex flex-col divide-y divide-white/10 max-w-3xl">
          {INFLUENCES.map((inf) => (
            <li
              key={inf.name}
              className="grid grid-cols-12 items-baseline py-6 gap-6"
            >
              <span
                className="col-span-7 title text-white"
                style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", opacity: 0.95 }}
              >
                {inf.name}
              </span>
              <span
                className="col-span-5 label text-white text-right"
                style={{ opacity: 0.55, letterSpacing: "0.32em", fontSize: "11px" }}
              >
                {inf.note}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
