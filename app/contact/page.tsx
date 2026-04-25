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

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Header — title huge, status badge as a kicker, no border. */}
      <header className="px-6 md:px-10 pt-32 md:pt-32 pb-20 md:pb-32">
        <div className="mb-8">
          <LiveStatus />
        </div>
        <h1
          className="text-white title"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 11rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
          }}
        >
          Contact
        </h1>
        <p
          className="title italic text-white mt-10 max-w-3xl"
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
            lineHeight: 1.25,
            opacity: 0.9,
          }}
        >
          Une idée suffit à commencer.
        </p>
      </header>

      {/* Two columns: contacts (left, narrow) | brief form (right, wide). */}
      <div className="grid grid-cols-1 md:grid-cols-12 px-6 md:px-10 pb-32 gap-16 md:gap-20">
        <aside className="md:col-span-4 flex flex-col gap-12">
          <div className="flex flex-col gap-7">
            <a
              href="mailto:nicosmp.pro@gmail.com"
              className="flex flex-col gap-1 group"
            >
              <span
                className="label text-white"
                style={{ opacity: 0.45, letterSpacing: "0.4em", fontSize: "11px" }}
              >
                Email
              </span>
              <span
                className="title text-white group-hover:opacity-100 transition-opacity duration-300"
                style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", opacity: 0.9 }}
              >
                nicosmp.pro@gmail.com
              </span>
            </a>

            <a
              href="https://instagram.com/nicolas_Sempere"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 group"
            >
              <span
                className="label text-white"
                style={{ opacity: 0.45, letterSpacing: "0.4em", fontSize: "11px" }}
              >
                Instagram
              </span>
              <span
                className="title text-white group-hover:opacity-100 transition-opacity duration-300"
                style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", opacity: 0.9 }}
              >
                @nicolas_Sempere
              </span>
            </a>
          </div>

          <div className="flex flex-col gap-2 pt-8 border-t border-white/10">
            <span
              className="label text-white"
              style={{ opacity: 0.45, letterSpacing: "0.4em", fontSize: "11px" }}
            >
              Basé à
            </span>
            <span
              className="title text-white"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)", opacity: 0.7 }}
            >
              Bordeaux — Paris
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span
              className="label text-white"
              style={{ opacity: 0.45, letterSpacing: "0.4em", fontSize: "11px" }}
            >
              Délai de réponse
            </span>
            <span
              className="title italic text-white"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)", opacity: 0.7 }}
            >
              Sous 24 heures
            </span>
          </div>
        </aside>

        <div className="md:col-span-7 md:col-start-6 flex flex-col gap-10">
          <p
            className="label text-white"
            style={{ opacity: 0.45, letterSpacing: "0.4em", fontSize: "11px" }}
          >
            Brief — formulaire
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
