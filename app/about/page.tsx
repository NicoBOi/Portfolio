import type { Metadata } from "next";

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
    <div className="bg-black min-h-screen pt-28 pb-28 px-5 md:px-8">
      {/* Header */}
      <div className="mb-14 md:mb-20">
        <p className="label text-white opacity-25 mb-4">[03] About</p>
        <h1 className="text-display text-white">Nicolas Sempere</h1>
      </div>

      {/* Two col */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        {/* Portrait */}
        <div className="md:col-span-5">
          <div
            className="w-full aspect-[4/5] overflow-hidden"
            style={{ backgroundColor: "#1A1A1A", maxWidth: 480 }}
          >
            <div className="placeholder-img text-white h-full">Portrait</div>
          </div>
          <p className="label text-white opacity-20 mt-3">Bordeaux &mdash; Paris</p>
        </div>

        {/* Text */}
        <div className="md:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-sm text-white/60 leading-relaxed">
              Photographer and filmmaker. I work at the intersection of silence
              and tension &mdash; constructing images that refuse to be passive.
              Based between Bordeaux and Paris, available everywhere.
            </p>
            <p className="font-mono text-sm text-white/40 leading-relaxed">
              Each frame is an argument. Each edit, a position. I don&apos;t
              document situations &mdash; I build them from scratch, working with
              subjects until the image becomes inevitable.
            </p>
            <p className="font-mono text-sm text-white/40 leading-relaxed">
              Available for editorial, commercial, and long-form personal
              projects. Collaborations are selective. Quality is not negotiable.
            </p>

            <a
              href="mailto:nicosmp.pro@gmail.com"
              className="label text-white opacity-50 hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 mt-2"
            >
              Contact
              <span className="w-6 h-px bg-white opacity-50" />
            </a>
          </div>

          {/* Clients + Press */}
          <div className="border-t border-white/10 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            <div>
              <p className="label text-white opacity-25 mb-5">Clients</p>
              <ul className="flex flex-col gap-2">
                {CLIENTS.map((c) => (
                  <li key={c} className="font-mono text-xs text-white/50">{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-white opacity-25 mb-5">Press</p>
              <ul className="flex flex-col gap-3">
                {PRESS.map(({ pub, year }) => (
                  <li key={pub} className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-xs text-white/50">{pub}</span>
                    <span className="label text-white opacity-20">{year}</span>
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
