import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import LiveStatus from "@/components/contact/LiveStatus";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écris-moi pour un projet photo, film ou 3D. Réponse en 24 heures.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact — Nicolas Sempere",
    description:
      "Écris-moi pour un projet photo, film ou 3D. Réponse en 24 heures.",
    siteName: "Nicolas Sempere",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Nicolas Sempere",
    description: "Écris-moi pour un projet photo, film ou 3D.",
  },
};

export default function ContactPage() {
  return (
    <section className="relative h-screen h-dvh bg-black overflow-hidden flex flex-col">
      {/* Same chrome stack as the landing — black field with the animated grain. */}
      <div className="hero-grain z-[1]" aria-hidden="true" />

      {/* Foreground — centered axis: status, title, italic intro, compact form. */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-10 py-10 md:py-14 text-center gap-6 md:gap-7 overflow-y-auto">
        <LiveStatus />

        <h1
          className="text-white title whitespace-nowrap"
          style={{ fontSize: "clamp(3rem, 9vw, 9rem)", lineHeight: 0.95 }}
        >
          Contact
        </h1>

        <p
          className="title italic text-white max-w-2xl"
          style={{
            fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)",
            lineHeight: 1.4,
            opacity: 0.9,
          }}
        >
          Une idée suffit à commencer. Je réponds sous 24 heures.
        </p>

        <div className="w-full max-w-md text-left mt-2">
          <ContactForm />
        </div>
      </div>

      {/* Bottom row — mobile keeps channels (left, the actually-clickable
          row) + location (right); the decorative name kicker only shows
          from md+ where the 3-column editorial footer has room to breathe. */}
      <div className="relative z-10 px-6 md:px-10 pb-8 md:pb-10 flex items-center justify-between gap-4 md:grid md:grid-cols-3">
        <span
          className="hidden md:inline-flex label text-white"
          style={{ opacity: 0.45, letterSpacing: "0.32em", fontSize: "11px" }}
        >
          Nicolas Sempere · 2024
        </span>

        <span
          className="label text-white inline-flex items-center gap-3 flex-wrap pointer-events-auto md:justify-center"
          style={{ opacity: 0.6, letterSpacing: "0.32em", fontSize: "10px" }}
        >
          <a
            href="mailto:nicosmp.pro@gmail.com"
            className="hover:opacity-100 transition-opacity duration-300"
          >
            Email
          </a>
          <span aria-hidden="true" style={{ opacity: 0.4 }}>·</span>
          <a
            href="https://instagram.com/nicolas_Sempere"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity duration-300"
          >
            Instagram
          </a>
        </span>

        <span
          className="label text-white whitespace-nowrap md:justify-self-end"
          style={{ opacity: 0.4, letterSpacing: "0.28em", fontSize: "10px" }}
        >
          Bordeaux — Paris
        </span>
      </div>
    </section>
  );
}
