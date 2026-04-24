import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Fragment_Mono } from "next/font/google";
import { preconnect, prefetchDNS } from "react-dom";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import MotionProvider from "@/components/providers/MotionProvider";

// Self-host Google Fonts instead of CSS @import — avoids a render-blocking
// request to fonts.googleapis.com on every page load.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});

const SITE_URL = "https://sempere.studio";
const SITE_NAME = "Nicolas Sempere";
const SITE_TITLE = "Nicolas Sempere — Photo, Film, 3D";
const SITE_DESCRIPTION =
  "Nicolas Sempere — photographie, film et motion 3D. Basé entre Bordeaux et Paris. Art, mode, éditorial, clip, pub. Des images brutes, minimales, spectaculaires.";

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
    "motion designer 3D",
    "motion 3D",
    "réalisation 3D",
    "photographe Bordeaux",
    "photographe Paris",
    "direction artistique",
    "photographie de mode",
    "photographie éditoriale",
    "portrait",
    "film",
    "clip musical",
    "pub",
    "Cinéma 4D",
    "Blender",
  ],
  category: "creative services",
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
  jobTitle: "Photographe, réalisateur & motion designer 3D",
  description:
    "Photographe, réalisateur et motion designer 3D basé entre Bordeaux et Paris. Art, mode, éditorial, clip, pub.",
  knowsAbout: [
    "Photographie",
    "Réalisation",
    "Motion design 3D",
    "Direction artistique",
    "Post-production",
  ],
  worksFor: { "@type": "Organization", name: "Nicolas Sempere" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bordeaux",
    addressCountry: "FR",
  },
  email: "mailto:nicosmp.pro@gmail.com",
  sameAs: [
    "https://instagram.com/nicolas_Sempere",
    "https://www.linkedin.com/in/nicolas-sempere-979284165/",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Warm up the sockets for the media origins so the first iframe/thumbnail
  // request doesn't pay the DNS + TCP + TLS handshake cost.
  preconnect("https://player.vimeo.com");
  preconnect("https://i.vimeocdn.com");
  preconnect("https://www.youtube-nocookie.com");
  preconnect("https://img.youtube.com");
  prefetchDNS("https://vumbnail.com");

  return (
    <html lang="fr" className={`${cormorant.variable} ${fragmentMono.variable}`}>
      <body>
        <MotionProvider>
          <CustomCursor />
          <Navigation />
          <main>{children}</main>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          />
        </MotionProvider>
      </body>
    </html>
  );
}
