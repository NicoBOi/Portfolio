import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";
import { loadOgFonts } from "@/lib/og-fonts";

export const runtime = "edge";
export const alt = "Projet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProjectOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const { serif, mono } = await loadOgFonts();

  const title = project?.title ?? "Projet";
  const category = project?.category ?? "";
  const year = project?.year ?? "";
  const bg = project?.coverPlaceholder ?? "#0a0a0a";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: bg,
          color: "#fff",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: "Geist Mono",
            fontSize: 15,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          <span>Nicolas Sempere</span>
          <span>{year}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              fontFamily: "Host Grotesk",
              fontSize: 140,
              lineHeight: 1,
              letterSpacing: "0.01em",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {category && (
            <div
              style={{
                fontFamily: "Geist Mono",
                fontSize: 16,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                opacity: 0.4,
              }}
            >
              {category}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: "Geist Mono",
            fontSize: 13,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            opacity: 0.35,
          }}
        >
          <span>Photographie</span>
          <span>sempere.studio</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Host Grotesk", data: serif, style: "normal", weight: 600 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    }
  );
}
