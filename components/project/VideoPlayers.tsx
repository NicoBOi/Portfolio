"use client";

import Player from "@vimeo/player";
import { useEffect, useRef, useState } from "react";
import VideoControls from "./VideoControls";

export { getVimeoId, getYoutubeId } from "@/lib/video";

// ─────────────────────────────────────────────────────────────
// YouTube — native player UI (no custom overlay).
// ─────────────────────────────────────────────────────────────
export function YouTubePlayer({ youtubeId }: { youtubeId: string }) {
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&rel=0&vq=hd1080&playsinline=1`;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(80);
  const [ready, setReady] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setHoverCapable(window.matchMedia("(hover: hover)").matches);
  }, []);

  useEffect(() => {
    if (!iframeRef.current) return;
    const player = new Player(iframeRef.current);
    playerRef.current = player;

    player.ready().then(() => {
      setReady(true);
      player.setQuality("1080p").catch(() => {});
    });
    const onPlay = () => {
      setPlaying(true);
      setHasPlayed(true);
      player.setQuality("1080p").catch(() => {});
    };
    const onPause = () => setPlaying(false);
    player.on("play", onPlay);
    player.on("pause", onPause);

    return () => {
      player.off("play", onPlay);
      player.off("pause", onPause);
      player.destroy().catch(() => {});
      playerRef.current = null;
    };
  }, [vimeoId]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pause();
    else p.play();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.setMuted(false);
      p.setVolume(volume / 100);
      setMuted(false);
    } else {
      p.setMuted(true);
      setMuted(true);
    }
  };

  const handleVolume = (v: number) => {
    const p = playerRef.current;
    if (!p) return;
    setVolume(v);
    p.setVolume(v / 100);
    if (v === 0) { p.setMuted(true); setMuted(true); }
    else if (muted) { p.setMuted(false); setMuted(false); }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen?.();
  };

  const src = `https://player.vimeo.com/video/${vimeoId}?background=1&dnt=1&quality=1080p&transparent=0`;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <iframe
        ref={iframeRef}
        src={src}
        className="w-full h-full block"
        style={{
          border: 0,
          backgroundColor: "#000",
          verticalAlign: "bottom",
          transform: "scale(1.02)",
          transformOrigin: "center",
        }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
      <div
        className="absolute inset-0 z-[5]"
        onClick={togglePlay}
        data-cursor={playing ? "Pause" : "Play"}
        aria-hidden="true"
      />
      <VideoControls
        playing={playing}
        muted={muted}
        volume={volume}
        ready={ready}
        visible={!hoverCapable || hovered || !playing}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolume}
        onFullscreen={handleFullscreen}
      />
      {!hasPlayed && (
        <div className="absolute inset-0 z-20 bg-black flex items-center justify-center pointer-events-none">
          <div
            className="w-8 h-8 rounded-full border border-white/20 animate-spin"
            style={{ borderTopColor: "rgba(255,255,255,0.55)" }}
          />
        </div>
      )}
    </div>
  );
}
