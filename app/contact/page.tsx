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

      {/* Right-edge vertical kicker — channels list, mirrors the landing index. */}
      <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 flex-col items-end pointer-events-auto">
        {[
          { label: "Email", href: "mailto:nicosmp.pro@gmail.com" },
          { label: "Instagram", href: "https://instagram.com/nicolas_Sempere" },
        ].map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="label text-white px-4 py-2 transition-opacity duration-300 hover:opacity-100"
            style={{ opacity: 0.45, letterSpacing: "0.36em" }}
          >
            {c.label}
          </a>
        ))}
      </div>

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

      {/* Bottom row — email + handle in plain mono so the chrome echoes the landing. */}
      <div className="relative z-10 px-6 md:px-10 pb-8 md:pb-10 flex items-center justify-between gap-6">
        <a
          href="mailto:nicosmp.pro@gmail.com"
          className="label text-white hover:opacity-100 transition-opacity duration-300"
          style={{ opacity: 0.55, letterSpacing: "0.32em", fontSize: "11px" }}
        >
          nicosmp.pro@gmail.com
        </a>
        <span
          className="label text-white"
          style={{ opacity: 0.4, letterSpacing: "0.32em", fontSize: "11px" }}
        >
          Bordeaux · 2024
        </span>
      </div>
    </section>
  );
}
