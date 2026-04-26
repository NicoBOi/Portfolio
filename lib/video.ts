// Shared video URL parsers. Kept in lib/ so the lightweight Hero modules can
// import them without dragging the @vimeo/player SDK along the way.

export function getVimeoId(url?: string): string | null {
  return url ? url.match(/vimeo\.com\/(\d+)/)?.[1] ?? null : null;
}

export function getYoutubeId(url?: string): string | null {
  return url
    ? url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] ?? null
    : null;
}
