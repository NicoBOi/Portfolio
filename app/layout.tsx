import type { Metadata } from "next";
import { Poppins, Abril_Fatface } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});

const abril = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-abril",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nicolas Sempere — Photographer & Filmmaker",
    template: "%s — Nicolas Sempere",
  },
  description:
    "Nicolas Sempere is a photographer and filmmaker based between Bordeaux and Paris.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${poppins.variable} ${abril.variable}`}>
      <body>
        <CustomCursor />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
