import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

export const runtime = "edge";
export const alt = "Nicolas Sempere — Photographe & Réalisateur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const { serif, mono } = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          color: "#fff",
          padding: 80,
        }}
      >
        <div
          style={{
            fontFamily: "Geist Mono",
            fontSize: 18,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            opacity: 0.5,
            marginBottom: 40,
          }}
        >
          Photographe — Réalisateur
        </div>

        <div
          style={{
            fontFamily: "Space Grotesk",
            fontSize: 164,
            lineHeight: 1,
            letterSpacing: "0.01em",
            textAlign: "center",
          }}
        >
          Nicolas Sempere
        </div>

        <div
          style={{
            fontFamily: "Geist Mono",
            fontSize: 16,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            opacity: 0.35,
            marginTop: 40,
          }}
        >
          Bordeaux — Paris
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 64,
            fontFamily: "Geist Mono",
            fontSize: 14,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            opacity: 0.3,
          }}
        >
          sempere.studio
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: serif, style: "normal", weight: 400 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    }
  );
}
