import type { MetadataRoute } from "next";

// Web manifest — picked up at /manifest.webmanifest by the framework. Lets
// Android browsers offer "Install app" with proper name + theme, and stops
// Chrome from complaining about a missing manifest in Lighthouse audits.
// Icons reuse the dynamically-generated /icon and /apple-icon routes.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nicolas Sempere — Photo, Film, 3D",
    short_name: "Nicolas Sempere",
    description:
      "Photographe et réalisateur basé entre Bordeaux et Paris.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
