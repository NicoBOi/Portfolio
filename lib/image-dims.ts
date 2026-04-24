import dims from "@/data/image-dims.json";

type Dims = { width: number; height: number };
const manifest = dims as Record<string, Dims>;

// Fallback for files that haven't been picked up by the prebuild script
// yet (fresh upload not re-built). 3:2 landscape is the safest bet for
// the bulk of the catalogue; keeps CLS minimal even when we miss.
const FALLBACK: Dims = { width: 2400, height: 1600 };

export function getImageDims(slug: string, file: string): Dims {
  return manifest[`${slug}/${file}`] ?? FALLBACK;
}
