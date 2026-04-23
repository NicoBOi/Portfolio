import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

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

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Back */}
      <div className="px-6 md:px-10 pt-20 pb-0">
        <Link
          href="/"
          className="label text-white hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
          style={{ opacity: 0.3 }}
        >
          <span aria-hidden="true">←</span>
          Accueil
        </Link>
      </div>

      {/* Main — two columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 px-6 md:px-10 pt-14 pb-24 gap-16 md:gap-24">

        {/* Left — identity */}
        <div className="flex flex-col justify-between gap-12">
          <div>
            <h1
              className="text-white title"
              style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 1 }}
            >
              Contact
            </h1>
            <p
              className="text-white font-light mt-8 leading-relaxed max-w-sm"
              style={{ fontSize: "0.95rem", opacity: 0.65, lineHeight: 1.9 }}
            >
              Parle-moi du projet. Insta, mail, ou le formulaire —
              comme tu préfères. Je réponds dans les 24 heures.
            </p>
            <p
              className="text-white font-light mt-2 leading-relaxed max-w-sm"
              style={{ fontSize: "0.9rem", opacity: 0.38, lineHeight: 1.9 }}
            >
              Idéalement, tu me donnes un budget, une date, et une
              référence visuelle. Dans les faits, l&apos;idée seule
              suffit à commencer.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="label text-white mb-2" style={{ opacity: 0.22 }}>Email</p>
              <a
                href="mailto:nicosmp.pro@gmail.com"
                className="text-white font-light hover:opacity-100 transition-opacity duration-300"
                style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.35rem)", opacity: 0.8, letterSpacing: "0.02em" }}
              >
                nicosmp.pro@gmail.com
              </a>
            </div>
            <div>
              <p className="label text-white mb-2" style={{ opacity: 0.22 }}>Instagram</p>
              <a
                href="https://instagram.com/nicolas_Sempere"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-light hover:opacity-100 transition-opacity duration-300"
                style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.35rem)", opacity: 0.8, letterSpacing: "0.02em" }}
              >
                @nicolas_Sempere
              </a>
            </div>
            <div>
              <p className="label text-white mb-2" style={{ opacity: 0.22 }}>Basé à</p>
              <p
                className="text-white font-light"
                style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.35rem)", opacity: 0.4, letterSpacing: "0.02em" }}
              >
                Bordeaux — Paris
              </p>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex flex-col justify-center">
          <p className="label text-white mb-10" style={{ opacity: 0.22 }}>Brief</p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
