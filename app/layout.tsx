import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";

const SITE_URL = "https://sempere.studio";
const SITE_NAME = "Nicolas Sempere";
const SITE_TITLE = "Nicolas Sempere — Photographe & Réalisateur";
const SITE_DESCRIPTION =
  "Nicolas Sempere, photographe et réalisateur basé entre Bordeaux et Paris. Images brutes, minimales, spectaculaires. Art, mode, éditorial.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Nicolas Sempere",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Nicolas Sempere", url: SITE_URL }],
  creator: "Nicolas Sempere",
  publisher: "Nicolas Sempere",
  keywords: [
    "Nicolas Sempere",
    "photographe",
    "réalisateur",
    "photographe Bordeaux",
    "photographe Paris",
    "direction artistique",
    "photographie de mode",
    "photographie éditoriale",
    "portrait",
    "film",
  ],
  category: "photography",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nicolas Sempere",
  url: SITE_URL,
  image: `${SITE_URL}/about/portrait.avif`,
  jobTitle: "Photographe & Réalisateur",
  worksFor: { "@type": "Organization", name: "Nicolas Sempere" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bordeaux",
    addressCountry: "FR",
  },
  email: "mailto:nicosmp.pro@gmail.com",
  sameAs: ["https://instagram.com/nicolas_Sempere"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <CustomCursor />
        <Navigation />
        <main>{children}</main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
