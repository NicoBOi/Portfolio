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

// Editorial line item for the contact list — small mono index, hairline,
// label, then the value below. Same vocabulary as the About page sections.
function Field({
  index,
  label,
  href,
  external,
  children,
}: {
  index: string;
  label: string;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const value = (
    <span
      className="text-white font-light"
      style={{
        fontSize: "clamp(0.95rem, 1.8vw, 1.35rem)",
        opacity: 0.85,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </span>
  );
  return (
    <div>
      <div className="flex items-baseline gap-4 mb-2">
        <span
          className="label text-white tabular-nums"
          style={{ opacity: 0.4, letterSpacing: "0.32em" }}
        >
          {index}
        </span>
        <span
          aria-hidden="true"
          className="block h-px bg-white"
          style={{ width: 22, opacity: 0.25 }}
        />
        <span
          className="label text-white"
          style={{ opacity: 0.55, letterSpacing: "0.32em" }}
        >
          {label}
        </span>
      </div>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="hover:opacity-100 transition-opacity duration-300"
        >
          {value}
        </a>
      ) : (
        value
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Header — title + live status badge so the page feels alive even
          before the viewer interacts. */}
      <div className="px-6 md:px-10 pt-32 md:pt-28 pb-10 md:pb-12 border-b border-white/10">
        <div className="flex flex-col gap-6">
          <LiveStatus />
          <h1
            className="text-white title"
            style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 1 }}
          >
            Contact
          </h1>
        </div>
      </div>

      {/* Two columns: numbered fiche on the left, italic pull-quote +
          form on the right. */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 px-6 md:px-10 pt-14 pb-24 gap-16 md:gap-24">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-md">
            <p
              className="text-white font-light"
              style={{ fontSize: "0.95rem", opacity: 0.85, lineHeight: 1.9 }}
            >
              Parlez-moi du projet. Insta, mail, ou le formulaire — comme
              vous préférez. Je réponds dans les 24 heures.
            </p>
          </div>

          <div className="flex flex-col gap-7">
            <Field index="01" label="Email" href="mailto:nicosmp.pro@gmail.com">
              nicosmp.pro@gmail.com
            </Field>
            <Field
              index="02"
              label="Instagram"
              href="https://instagram.com/nicolas_Sempere"
              external
            >
              @nicolas_Sempere
            </Field>
            <Field index="03" label="Basé à">
              Bordeaux — Paris
            </Field>
            <Field index="04" label="Délai de réponse">
              Sous 24 heures
            </Field>
          </div>
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          <blockquote className="max-w-md">
            <p
              className="title italic text-white"
              style={{
                fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
                lineHeight: 1.25,
                opacity: 0.95,
              }}
            >
              « Une idée suffit à commencer. »
            </p>
            <footer
              className="label text-white mt-4"
              style={{ opacity: 0.45, letterSpacing: "0.32em" }}
            >
              Brief — formulaire
            </footer>
          </blockquote>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
