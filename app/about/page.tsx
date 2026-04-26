import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Nicolas Sempere — photographie, film, motion 3D. 28 ans, basé entre Bordeaux et Paris.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: "À propos — Nicolas Sempere",
    description:
      "Photographe et réalisateur basé entre Bordeaux et Paris.",
    siteName: "Nicolas Sempere",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos — Nicolas Sempere",
    description: "Photo, film, motion 3D. Basé entre Bordeaux et Paris.",
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
          Photographe et réalisateur entre Bordeaux et Paris, 28 ans. Je crée
          des images pour les marques et les projets qui refusent de ressembler
          aux autres.
        </p>

        <span
          aria-hidden="true"
          className="block h-px bg-white"
          style={{ width: 44, opacity: 0.35 }}
        />

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

      {/* Bottom row — mobile pares it down to location (left) + pill (right);
          desktop unfolds the full 3-column editorial footer with the
          disciplines lockup centred between them. */}
      <div className="relative z-10 px-6 md:px-10 pb-8 md:pb-10 flex items-center justify-between gap-4 md:grid md:grid-cols-3">
        <span
          className="label text-white whitespace-nowrap"
          style={{ opacity: 0.45, letterSpacing: "0.28em", fontSize: "10px" }}
        >
          Bordeaux — Paris
        </span>

        <span
          className="hidden md:inline-flex label text-white items-center justify-center gap-3 flex-wrap"
          style={{ opacity: 0.6, letterSpacing: "0.36em", fontSize: "11px" }}
        >
          {["Photographe", "Réalisateur"].map((d, i) => (
            <span key={d} className="inline-flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" style={{ opacity: 0.4 }}>·</span>
              )}
              {d}
            </span>
          ))}
        </span>

        {/* Same signature as the landing's Ouvrir pill — white rounded
            pill, italic title, scale-on-hover, underline drawing under
            the label on hover, scale-down on tap. CSS-only so the page
            can stay a server component. */}
        <Link
          href="/contact"
          className="group pointer-events-auto inline-flex items-center rounded-full bg-white text-black px-7 md:px-8 py-2.5 md:py-3 transition-transform duration-[280ms] ease-out-expo hover:scale-[1.03] active:scale-[0.96] md:justify-self-end"
        >
          <span className="relative inline-block leading-none">
            <span
              className="title italic block whitespace-nowrap"
              style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)" }}
            >
              Écrivez-moi
            </span>
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 -bottom-1 h-px bg-black origin-left scale-x-0 opacity-0 transition-all duration-[450ms] ease-out-expo group-hover:scale-x-100 group-hover:opacity-70"
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
