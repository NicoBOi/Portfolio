import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About" };

const CLIENTS = [
  "Vogue France", "Maison Margiela", "Dior Beauty", "Saint Laurent",
  "LVMH", "Le Monde", "Wallpaper*", "Hypebeast", "Acne Studios", "Kering",
];

const PRESS = [
  { pub: "Vogue France", year: "2024" },
  { pub: "Wallpaper*", year: "2023" },
  { pub: "AnOther Magazine", year: "2023" },
  { pub: "Le Monde Culture", year: "2023" },
  { pub: "Hypebeast", year: "2022" },
  { pub: "i-D France", year: "2022" },
];

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen px-6 md:px-10">
      {/* Back */}
      <div className="pt-20 pb-0">
        <Link
          href="/"
          className="label text-white hover:opacity-60 transition-opacity duration-300 flex items-center gap-3"
          style={{ opacity: 0.3 }}
        >
          <span className="block w-5 h-px bg-white" />
          Home
        </Link>
      </div>

      {/* Header */}
      <div className="pt-14 pb-12 border-b border-white/10">
        <p className="label text-white mb-5" style={{ opacity: 0.22 }}>About</p>
        <h1
          className="text-white title"
          style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 1 }}
        >
          Nicolas Sempere
        </h1>
      </div>

      {/* Two col */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 py-14">
        {/* Portrait */}
        <div className="md:col-span-4">
          <div
            className="w-full overflow-hidden"
            style={{ aspectRatio: "4/5", backgroundColor: "#1A1A1A", maxWidth: 400 }}
          >
            <div className="placeholder-img text-white h-full">Portrait</div>
          </div>
          <p className="label text-white mt-3" style={{ opacity: 0.2 }}>Bordeaux — Paris</p>
        </div>

        {/* Text */}
        <div className="md:col-span-8 flex flex-col gap-10">
          <div className="flex flex-col gap-5 max-w-xl">
            <p className="text-white font-light leading-relaxed" style={{ fontSize: "0.9rem", opacity: 0.6, lineHeight: 1.9 }}>
              Photographe et réalisateur. Je travaille à l&apos;intersection du silence et de la tension —
              construisant des images qui refusent d&apos;être passives.
              Basé entre Bordeaux et Paris, disponible partout.
            </p>
            <p className="text-white font-light leading-relaxed" style={{ fontSize: "0.9rem", opacity: 0.38, lineHeight: 1.9 }}>
              Chaque cadre est un argument. Chaque montage, une position. Je ne documente pas les situations —
              je les construis de toutes pièces, en travaillant avec les sujets jusqu&apos;à ce que l&apos;image devienne inévitable.
            </p>
            <p className="text-white font-light leading-relaxed" style={{ fontSize: "0.9rem", opacity: 0.38, lineHeight: 1.9 }}>
              Disponible pour des projets éditoriaux, commerciaux et longs-métrages personnels.
              Les collaborations sont sélectives. La qualité n&apos;est pas négociable.
            </p>

            <Link
              href="/contact"
              className="label text-white hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 mt-2"
              style={{ opacity: 0.45 }}
            >
              Contact
              <span className="block w-6 h-px bg-white" style={{ opacity: 0.5 }} />
            </Link>
          </div>

          {/* Clients + Press */}
          <div className="border-t border-white/10 pt-10 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="label text-white mb-6" style={{ opacity: 0.22 }}>Clients</p>
              <ul className="flex flex-col gap-2.5">
                {CLIENTS.map((c) => (
                  <li key={c} className="text-white font-light" style={{ fontSize: "0.8rem", opacity: 0.45, letterSpacing: "0.03em" }}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-white mb-6" style={{ opacity: 0.22 }}>Press</p>
              <ul className="flex flex-col gap-3">
                {PRESS.map(({ pub, year }) => (
                  <li key={pub} className="flex items-baseline justify-between gap-4">
                    <span className="text-white font-light" style={{ fontSize: "0.8rem", opacity: 0.45, letterSpacing: "0.03em" }}>{pub}</span>
                    <span className="label text-white" style={{ opacity: 0.2 }}>{year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
