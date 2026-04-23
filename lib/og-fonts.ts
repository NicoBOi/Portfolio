// OG fonts fetched at render time.
// We resolve the actual font URL by reading the font service's CSS first —
// Google Fonts and Fontshare both vary their file URLs per User-Agent / release
// so hardcoding a raw URL would silently break over time.

const FETCH_TIMEOUT_MS = 5000;

// A desktop Chrome UA gets us woff2 from Google Fonts
const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const SERIF_CSS =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600&display=swap";
const MONO_CSS =
  "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400&display=swap";

async function fetchFontFromCss(cssUrl: string): Promise<ArrayBuffer> {
  const cssRes = await fetch(cssUrl, {
    headers: { "User-Agent": CHROME_UA },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!cssRes.ok) throw new Error(`CSS ${cssUrl} → ${cssRes.status}`);
  const css = await cssRes.text();
  const match = css.match(/url\((https?:\/\/[^)]+\.woff2?)\)/);
  if (!match) throw new Error(`No font url found in CSS: ${cssUrl}`);
  const fontRes = await fetch(match[1], {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!fontRes.ok) throw new Error(`Font ${match[1]} → ${fontRes.status}`);
  return fontRes.arrayBuffer();
}

export async function loadOgFonts(): Promise<{
  serif: ArrayBuffer;
  mono: ArrayBuffer;
}> {
  const [serif, mono] = await Promise.all([
    fetchFontFromCss(SERIF_CSS),
    fetchFontFromCss(MONO_CSS),
  ]);
  return { serif, mono };
}
