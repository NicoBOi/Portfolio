import type { Metadata } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nicolas Sempere — Photographer & Filmmaker",
    template: "%s — Nicolas Sempere",
  },
  description:
    "Nicolas Sempere is a photographer and filmmaker based between Bordeaux and Paris.",
  openGraph: {
    title: "Nicolas Sempere",
    description: "Photographer & Filmmaker — Bordeaux / Paris",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${syne.variable} ${spaceMono.variable}`}>
      <body>
        <CustomCursor />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
