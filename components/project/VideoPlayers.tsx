"use client";

export { getVimeoId, getYoutubeId } from "@/lib/video";

// Both players use the platform's native chrome and try to autoplay with
// sound on — the click that opens the project counts as a user gesture in
// most browsers, so the audio track comes through. If a browser does
// block sound-on autoplay, the native controls let the viewer unmute.

// ─────────────────────────────────────────────────────────────
// YouTube
// ─────────────────────────────────────────────────────────────
export function YouTubePlayer({ youtubeId }: { youtubeId: string }) {
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&rel=0&vq=hd1080&playsinline=1`;

  return (
    <div className="absolute inset-0 bg-black">
      <iframe
        src={src}
        className="w-full h-full block"
        style={{ border: 0, backgroundColor: "#000", verticalAlign: "bottom" }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Vimeo
// ─────────────────────────────────────────────────────────────
export function VimeoPlayer({ vimeoId }: { vimeoId: string }) {
  // background=1 was forcing the player into Vimeo's silent-loop mode,
  // which can't be un-muted via the SDK. Use a normal embed with
  // autoplay + loop and let Vimeo's own player chrome handle the rest.
  const src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&dnt=1&quality=1080p&transparent=0`;

  return (
    <div className="absolute inset-0 bg-black">
      <iframe
        src={src}
        className="w-full h-full block"
        style={{ border: 0, backgroundColor: "#000", verticalAlign: "bottom" }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
