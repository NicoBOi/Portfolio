import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nicolas Sempere — photographer and filmmaker based between Bordeaux and Paris.",
};

const CLIENTS = [
  "Vogue France",
  "Maison Margiela",
  "Dior Beauty",
  "Saint Laurent",
  "LVMH",
  "Le Monde",
  "Wallpaper*",
  "Hypebeast",
  "Acne Studios",
  "Kering",
];

const PRESS = [
  { pub: "Vogue France", detail: "2024" },
  { pub: "Wallpaper*", detail: "2023" },
  { pub: "AnOther Magazine", detail: "2023" },
  { pub: "Le Monde Culture", detail: "2023" },
  { pub: "Hypebeast", detail: "2022" },
  { pub: "i-D France", detail: "2022" },
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-28 px-6 md:px-10">
      {/* ── Page header ─────────────────────────────── */}
      <div className="mb-16 md:mb-20">
        <p className="label opacity-30 mb-4">02 / ABOUT</p>
        <h1 className="font-display font-light italic text-display-xl leading-none">
          About
        </h1>
      </div>

      {/* ── Two-column layout ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        {/* Portrait */}
        <div className="md:col-span-5 lg:col-span-4">
          <div
            className="w-full aspect-[4/5] bg-[#EBEBEB] overflow-hidden"
            style={{ maxWidth: 480 }}
          >
            <div className="placeholder-img h-full">PORTRAIT</div>
          </div>
          <p className="label opacity-25 mt-3">
            BORDEAUX · PARIS
          </p>
        </div>

        {/* Content */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between">
          {/* Bio */}
          <div>
            <p
              className="font-sans font-light leading-relaxed text-black/70 mb-5"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.125rem)" }}
            >
              Photographer and filmmaker. I work at the intersection of silence
              and tension — constructing images that refuse to be passive. Based
              between Bordeaux and Paris, available everywhere.
            </p>
            <p
              className="font-sans font-light leading-relaxed text-black/50"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.125rem)" }}
            >
              Each frame is an argument. Each edit, a position. I don&apos;t
              document situations — I build them from the ground up, working
              closely with subjects until the image becomes inevitable.
            </p>
            <p
              className="font-sans font-light leading-relaxed text-black/50 mt-4"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.125rem)" }}
            >
              Available for editorial, commercial, and long-form personal
              projects. Collaborations are selective. Quality is not negotiable.
            </p>

            {/* Contact CTA inline */}
            <div className="mt-8">
              <a
                href="mailto:nicosmp.pro@gmail.com"
                className="label inline-flex items-center gap-4 hover:opacity-50 transition-opacity duration-300"
              >
                GET IN TOUCH
                <span className="w-8 h-px bg-black" />
              </a>
            </div>
          </div>

          {/* Clients + Press */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16 border-t border-[#E8E8E8] pt-10">
            {/* Clients */}
            <div>
              <p className="label opacity-30 mb-5">SELECTED CLIENTS</p>
              <ul className="flex flex-col gap-2">
                {CLIENTS.map((c) => (
                  <li
                    key={c}
                    className="font-sans text-sm font-light text-black/60 leading-snug"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Press */}
            <div>
              <p className="label opacity-30 mb-5">PRESS</p>
              <ul className="flex flex-col gap-3">
                {PRESS.map(({ pub, detail }) => (
                  <li key={pub} className="flex items-baseline justify-between gap-4">
                    <span className="font-sans text-sm font-light text-black/60">
                      {pub}
                    </span>
                    <span className="label opacity-25 shrink-0">{detail}</span>
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
