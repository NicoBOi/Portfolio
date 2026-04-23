// Fonts are fetched from GitHub raw instead of Google Fonts CSS:
// Google's CSS response varies by User-Agent and isn't stable at the edge.
// The TTF URLs below are permanent and return the raw font bytes directly.

const SERIF_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Regular.ttf";
const MONO_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/fragmentmono/FragmentMono-Regular.ttf";

export async function loadOgFonts(): Promise<{
  serif: ArrayBuffer;
  mono: ArrayBuffer;
}> {
  const [serif, mono] = await Promise.all([
    fetch(SERIF_URL).then((r) => r.arrayBuffer()),
    fetch(MONO_URL).then((r) => r.arrayBuffer()),
  ]);
  return { serif, mono };
}
