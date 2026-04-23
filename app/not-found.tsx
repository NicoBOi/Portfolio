import Link from "next/link";
import BackPill from "@/components/ui/BackPill";

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen flex flex-col px-6 md:px-10">
      <BackPill href="/" label="Accueil" />

      {/* Main */}
      <div className="flex-1 flex flex-col justify-center gap-10 pb-24 pt-32">
        <div>
          <p
            className="label text-white mb-6"
            style={{ opacity: 0.22 }}
          >
            404
          </p>
          <h1
            className="text-white title"
            style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 1 }}
          >
            Page introuvable.
          </h1>
        </div>

        <p
          className="text-white font-light leading-relaxed max-w-md"
          style={{ fontSize: "0.95rem", opacity: 0.5, lineHeight: 1.9 }}
        >
          Rien à cette adresse. Un lien qui a changé, une URL tapée de travers.
          Revenons à l&apos;accueil — tout est là-bas.
        </p>

        <Link
          href="/"
          className="label text-white hover:opacity-100 transition-opacity duration-300 flex items-center gap-4"
          style={{ opacity: 0.55 }}
        >
          Retour à l&apos;accueil
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
