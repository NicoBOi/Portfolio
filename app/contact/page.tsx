import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = { title: "Contact" };

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
            <p className="label text-white mb-6" style={{ opacity: 0.25 }}>Contact</p>
            <h1
              className="text-white title"
              style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 1 }}
            >
              Contact
            </h1>
            <p
              className="text-white font-light mt-8 leading-relaxed max-w-sm"
              style={{ fontSize: "0.875rem", opacity: 0.45, lineHeight: 1.9 }}
            >
              Une idée qui demande du silence et du temps ?
              Écrivez — je lis tout. Je réponds à ce qui m&apos;intrigue.
              Les meilleurs projets commencent par un mail précis.
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
          <p className="label text-white mb-10" style={{ opacity: 0.22 }}>Envoyer un message</p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
