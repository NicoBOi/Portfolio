import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import LiveStatus from "@/components/contact/LiveStatus";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écris-moi pour un projet photo, film ou 3D. Insta ou mail. Réponse en 24h.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact — Nicolas Sempere",
    description:
      "Écris-moi pour un projet photo, film ou 3D. Insta ou mail. Réponse en 24h.",
    siteName: "Nicolas Sempere",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Nicolas Sempere",
    description: "Écris-moi pour un projet photo, film ou 3D. Réponse en 24h.",
  },
};

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

function InfoLine({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <span
      className="text-white font-light block"
      style={{ fontSize: "1.1rem", opacity: 1 }}
    >
      {value}
    </span>
  );
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="label text-white"
        style={{ opacity: 0.45, letterSpacing: "0.36em", fontSize: "11px" }}
      >
        {label}
      </span>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="hover:opacity-100 transition-opacity duration-300"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <article className="bg-black min-h-screen">
      {/* Header — centered axis. */}
      <header className="px-6 md:px-10 pt-32 md:pt-32 pb-16 md:pb-20 text-center border-b border-white/10">
        <div className="mb-8 flex justify-center">
          <LiveStatus />
        </div>
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(3rem, 8vw, 8rem)", lineHeight: 1 }}
        >
          Contact
        </h1>
      </header>

      {/* Intro — centered. */}
      <section className="px-6 md:px-10 py-20 md:py-24 border-b border-white/10">
        <p
          className="text-white font-light max-w-2xl mx-auto text-center"
          style={{ fontSize: "1.05rem", lineHeight: 1.85, opacity: 1 }}
        >
          Parlez-moi du projet — campagne, éditorial, clip, ou 3D. Insta,
          mail ou le formulaire ci-dessous. Je réponds dans les 24 heures.
        </p>
      </section>

      {/* Coordonnées — centered stack. */}
      <section className="px-6 md:px-10 py-20 md:py-24 border-b border-white/10">
        <SectionTitle>Coordonnées</SectionTitle>
        <div className="flex flex-col items-center gap-10 max-w-md mx-auto">
          <InfoLine
            label="Email"
            value="nicosmp.pro@gmail.com"
            href="mailto:nicosmp.pro@gmail.com"
          />
          <InfoLine
            label="Instagram"
            value="@nicolas_Sempere"
            href="https://instagram.com/nicolas_Sempere"
            external
          />
          <InfoLine label="Basé à" value="Bordeaux — Paris" />
          <InfoLine label="Délai de réponse" value="Sous 24 heures" />
        </div>
      </section>

      {/* Brief — centered form. */}
      <section className="px-6 md:px-10 py-20 md:py-24">
        <SectionTitle>Brief — formulaire</SectionTitle>
        <div className="max-w-xl mx-auto">
          <ContactForm />
        </div>
      </section>
    </article>
  );
}
