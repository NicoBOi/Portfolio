import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: {
    default: "Nicolas Sempere — Photographe & Réalisateur",
    template: "%s — Nicolas Sempere",
  },
  description:
    "Nicolas Sempere, photographe et réalisateur basé entre Bordeaux et Paris.",
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
      </body>
    </html>
  );
}
