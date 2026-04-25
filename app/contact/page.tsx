import type { Metadata } from "next";
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
      {/* Main — two columns. The back-to-home affordance lives in the top
          nav (replaces the NS slot on inner pages), no need to duplicate. */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 px-6 md:px-10 pt-32 md:pt-28 pb-24 gap-16 md:gap-24">

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
              style={{ fontSize: "0.95rem", opacity: 0.85, lineHeight: 1.9 }}
            >
              Parlez-moi du projet. Insta, mail, ou le formulaire —
              comme vous préférez. Je réponds dans les 24 heures.
            </p>
            <p
              className="text-white font-light mt-2 leading-relaxed max-w-sm"
              style={{ fontSize: "0.9rem", opacity: 0.6, lineHeight: 1.9 }}
            >
              Idéalement, vous me donnez un budget, une date, et une
              référence visuelle. Dans les faits, l&apos;idée seule
              suffit à commencer.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="label text-white mb-2" style={{ opacity: 0.5 }}>Email</p>
              <a
                href="mailto:nicosmp.pro@gmail.com"
                className="text-white font-light hover:opacity-100 transition-opacity duration-300"
                style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.35rem)", opacity: 0.8, letterSpacing: "0.02em" }}
              >
                nicosmp.pro@gmail.com
              </a>
            </div>
            <div>
              <p className="label text-white mb-2" style={{ opacity: 0.5 }}>Instagram</p>
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
              <p className="label text-white mb-2" style={{ opacity: 0.5 }}>Basé à</p>
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
          <p className="label text-white mb-10" style={{ opacity: 0.5 }}>Brief</p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
