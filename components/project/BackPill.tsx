"use client";

import Link from "next/link";

// Solid white pill, italic Cormorant — same vocabulary as the landing's
// "Ouvrir" CTA. Sits inside the project's metadata column to read as the
// outbound action of the page. When LandingExperience drives the project
// in-page, onNavigate("") triggers the smooth close; otherwise we Link
// straight to "/".
interface Props {
  onNavigate?: (slug: string) => void;
}

const BASE =
  "self-end inline-flex items-center rounded-full bg-white text-black px-7 md:px-8 py-2.5 md:py-3 transition-colors duration-300 hover:bg-white/90";
const TEXT_STYLE = { fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)" } as const;

export default function BackPill({ onNavigate }: Props) {
  if (onNavigate) {
    return (
      <button
        type="button"
        onClick={() => onNavigate("")}
        aria-label="Retour aux projets"
        className={BASE}
      >
        <span className="title italic block leading-none" style={TEXT_STYLE}>
          Retour
        </span>
      </button>
    );
  }
  return (
    <Link href="/" aria-label="Retour aux projets" className={BASE}>
      <span className="title italic block leading-none" style={TEXT_STYLE}>
        Retour
      </span>
    </Link>
  );
}
