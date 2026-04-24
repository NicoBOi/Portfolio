#!/usr/bin/env node
/*
 * Scan /public/projects/<slug>/ for every image file and emit a manifest
 * of { "slug/filename": { width, height } } into data/image-dims.json.
 *
 * Used by next/image + PhotoProject so gallery thumbs and the editorial
 * sequence can render with real dimensions (no CLS, proper srcset).
 *
 * Runs via `prebuild` so it's always fresh against the files on disk.
 */
import { readdir } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(process.cwd(), "public/projects");
const OUT = resolve(process.cwd(), "data/image-dims.json");
const IMG_EXT = /\.(avif|webp|jpg|jpeg|png|gif)$/i;

async function main() {
  const manifest = {};
  let entries;
  try {
    entries = await readdir(ROOT, { withFileTypes: true });
  } catch {
    console.warn(`[image-manifest] no ${ROOT} — skipping`);
    await writeFile(OUT, JSON.stringify({}, null, 2));
    return;
  }

  for (const dir of entries) {
    if (!dir.isDirectory()) continue;
    const slug = dir.name;
    const slugDir = join(ROOT, slug);
    const files = await readdir(slugDir);
    for (const file of files) {
      if (!IMG_EXT.test(file)) continue;
      const key = `${slug}/${file}`;
      try {
        const { width, height } = await sharp(join(slugDir, file)).metadata();
        if (width && height) manifest[key] = { width, height };
      } catch (err) {
        console.warn(`[image-manifest] failed ${key}:`, err.message);
      }
    }
  }

  await writeFile(OUT, JSON.stringify(manifest, null, 2));
  const count = Object.keys(manifest).length;
  console.log(`[image-manifest] wrote ${count} entries -> ${OUT}`);
}

main().catch((err) => {
  console.error("[image-manifest] fatal:", err);
  process.exit(1);
});
