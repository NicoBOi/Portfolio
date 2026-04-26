import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Nicolas Sempere — photographie, film, motion 3D. 28 ans, basé à Bordeaux.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: "À propos — Nicolas Sempere",
    description:
      "Photographe, réalisateur et motion designer 3D basé à Bordeaux.",
    siteName: "Nicolas Sempere",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos — Nicolas Sempere",
    description: "Photo, film, motion 3D. Basé à Bordeaux.",
  },
};

const CLIENTS = [
  "Sephora",
  "Philips",
  "A Better Feeling",
  "Showroomprivé",
  "Sink Deeper",
  "MadeInParis",
];

export default function AboutPage() {
  return (
    <section className="relative h-screen h-dvh bg-black overflow-hidden flex flex-col">
      {/* Background — portrait dimmed, then grain over the whole thing,
          same chrome stack as the landing hero. */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/about/portrait.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/72" />
      </div>
      <div className="hero-grain z-[1]" aria-hidden="true" />

      {/* Foreground — centered axis. */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-10 text-center gap-8">
        <p
          className="label text-white"
          style={{ opacity: 0.55, letterSpacing: "0.4em", fontSize: "11px" }}
        >
          Bordeaux — Photographe · Réalisateur
        </p>

        <h1
          className="text-white title whitespace-nowrap"
          style={{ fontSize: "clamp(3rem, 9vw, 9rem)", lineHeight: 0.95 }}
        >
          À propos
        </h1>

        <p
          className="title italic text-white max-w-2xl"
          style={{
            fontSize: "clamp(1.15rem, 1.9vw, 1.5rem)",
            lineHeight: 1.4,
            opacity: 0.95,
          }}
        >
          Photographe et réalisateur à Bordeaux, 28 ans. Je crée des images
          pour les marques et les projets qui refusent de ressembler aux autres.
        </p>

        <span
          aria-hidden="true"
          className="block h-px bg-white"
          style={{ width: 44, opacity: 0.35 }}
        />

        <div className="flex flex-col items-center gap-3">
          <span
            className="label text-white"
            style={{ opacity: 0.4, letterSpacing: "0.4em", fontSize: "10px" }}
          >
            Clients
          </span>
          <p
            className="label text-white inline-flex items-center gap-3 flex-wrap justify-center"
            style={{ opacity: 0.6, letterSpacing: "0.32em", fontSize: "11px" }}
          >
            {CLIENTS.map((n, i) => (
              <span key={n} className="inline-flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" style={{ opacity: 0.4 }}>·</span>
                )}
                {n}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Bottom row — name kicker (left), disciplines list (center), pill CTA (right). */}
      <div className="relative z-10 px-6 md:px-10 pb-8 md:pb-10 grid grid-cols-3 items-center gap-4">
        <span
          className="label text-white"
          style={{ opacity: 0.45, letterSpacing: "0.32em", fontSize: "11px" }}
        >
          Nicolas Sempere · 2024
        </span>

        <span
          className="label text-white inline-flex items-center justify-center gap-3 flex-wrap"
          style={{ opacity: 0.6, letterSpacing: "0.36em", fontSize: "11px" }}
        >
          {["Photo", "Film", "3D"].map((d, i) => (
            <span key={d} className="inline-flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" style={{ opacity: 0.4 }}>·</span>
              )}
              {d}
            </span>
          ))}
        </span>

        <Link
          href="/contact"
          className="inline-flex items-center rounded-full bg-white text-black px-7 md:px-8 py-2.5 md:py-3 transition-colors duration-300 hover:bg-white/90 justify-self-end"
        >
          <span
            className="title italic block leading-none"
            style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)" }}
          >
            Écrivez-moi
          </span>
        </Link>
      </div>
    </section>
  );
}
