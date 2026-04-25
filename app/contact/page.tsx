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
      className="label text-white mb-6"
      style={{ opacity: 0.5, letterSpacing: "0.36em", fontSize: "11px" }}
    >
      {children}
    </p>
  );
}

function InfoRow({
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
      className="text-white font-light"
      style={{ fontSize: "1rem", opacity: 0.9 }}
    >
      {value}
    </span>
  );
  return (
    <div className="grid grid-cols-12 items-baseline py-4 gap-4">
      <span
        className="col-span-5 sm:col-span-4 label text-white"
        style={{ opacity: 0.5, letterSpacing: "0.32em", fontSize: "11px" }}
      >
        {label}
      </span>
      <span className="col-span-7 sm:col-span-8">
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
      </span>
    </div>
  );
}

export default function ContactPage() {
  return (
    <article className="bg-black min-h-screen">
      {/* Header */}
      <header className="px-6 md:px-10 pt-32 md:pt-28 pb-12 border-b border-white/10">
        <div className="mb-6">
          <LiveStatus />
        </div>
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(3rem, 7vw, 7rem)", lineHeight: 1 }}
        >
          Contact
        </h1>
      </header>

      {/* Intro */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-b border-white/10">
        <p
          className="text-white font-light max-w-2xl"
          style={{ fontSize: "1.05rem", lineHeight: 1.85, opacity: 0.9 }}
        >
          Parlez-moi du projet — campagne, éditorial, clip, ou 3D. Insta,
          mail ou le formulaire ci-dessous. Je réponds dans les 24 heures.
        </p>
      </section>

      {/* Two columns: coordonnées | brief */}
      <div className="grid grid-cols-1 md:grid-cols-12 px-6 md:px-10 py-16 md:py-20 gap-12 md:gap-16">
        <aside className="md:col-span-5">
          <SectionTitle>Coordonnées</SectionTitle>
          <div className="flex flex-col divide-y divide-white/10 max-w-md">
            <InfoRow
              label="Email"
              value="nicosmp.pro@gmail.com"
              href="mailto:nicosmp.pro@gmail.com"
            />
            <InfoRow
              label="Instagram"
              value="@nicolas_Sempere"
              href="https://instagram.com/nicolas_Sempere"
              external
            />
            <InfoRow label="Basé à" value="Bordeaux — Paris" />
            <InfoRow label="Délai de réponse" value="Sous 24 heures" />
          </div>
        </aside>

        <div className="md:col-span-7">
          <SectionTitle>Brief — formulaire</SectionTitle>
          <ContactForm />
        </div>
      </div>
    </article>
  );
}
