// Fonts are fetched from GitHub raw instead of Google Fonts CSS:
// Google's CSS response varies by User-Agent and isn't stable at the edge.
// The TTF URLs below are permanent and return the raw font bytes directly.

const SERIF_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Regular.ttf";
const MONO_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/fragmentmono/FragmentMono-Regular.ttf";

const FETCH_TIMEOUT_MS = 5000;

async function fetchFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Font fetch ${url} → ${res.status}`);
  return res.arrayBuffer();
}

export async function loadOgFonts(): Promise<{
  serif: ArrayBuffer;
  mono: ArrayBuffer;
}> {
  const [serif, mono] = await Promise.all([fetchFont(SERIF_URL), fetchFont(MONO_URL)]);
  return { serif, mono };
}
