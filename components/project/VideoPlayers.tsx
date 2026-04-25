"use client";

import Player from "@vimeo/player";
import { useEffect, useRef, useState } from "react";
import VideoControls from "./VideoControls";

export function getVimeoId(url?: string): string | null {
  return url ? url.match(/vimeo\.com\/(\d+)/)?.[1] ?? null : null;
}

export function getYoutubeId(url?: string): string | null {
  return url ? url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] ?? null : null;
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  mute(): void;
  unMute(): void;
  setVolume(v: number): void;
  setPlaybackQuality(quality: string): void;
  getAvailableQualityLevels(): string[];
  getPlaybackQuality(): string;
  destroy(): void;
}

interface YTWindow {
  YT?: { Player: new (id: string, opts: object) => YTPlayer };
  onYouTubeIframeAPIReady?: () => void;
}

// ─────────────────────────────────────────────────────────────
// YouTube
// ─────────────────────────────────────────────────────────────
export function YouTubePlayer({ youtubeId }: { youtubeId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(80);
  const [ready, setReady] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const iframeId = `yt-vp-${youtubeId}`;

  useEffect(() => {
    let player: YTPlayer | null = null;

    const createPlayer = () => {
      const yt = (window as unknown as YTWindow).YT!;
      player = new yt.Player(iframeId, {
        events: {
          onReady: () => {
            setReady(true);
            try { player?.setPlaybackQuality("hd1080"); } catch {}
          },
          onStateChange: (e: { data: number }) => {
            const isPlaying = e.data === 1;
            setPlaying(isPlaying);
            if (isPlaying) {
              setHasPlayed(true);
              try { player?.setPlaybackQuality("hd1080"); } catch {}
            }
          },
          onPlaybackQualityChange: () => {
            try {
              const q = player?.getPlaybackQuality();
              if (q && !["hd1080", "hd1440", "hd2160", "highres"].includes(q)) {
                player?.setPlaybackQuality("hd1080");
              }
            } catch {}
          },
        },
      });
      playerRef.current = player;
    };

    if ((window as unknown as YTWindow).YT?.Player) {
      createPlayer();
    } else {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      const prevCb = (window as unknown as YTWindow).onYouTubeIframeAPIReady;
      (window as unknown as YTWindow).onYouTubeIframeAPIReady = () => {
        if (prevCb) prevCb();
        createPlayer();
      };
    }

    return () => {
      player?.destroy();
      playerRef.current = null;
      setReady(false);
      setPlaying(false);
      setHasPlayed(false);
    };
  }, [iframeId]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) { playerRef.current.unMute(); setMuted(false); }
    else { playerRef.current.mute(); setMuted(true); }
  };

  const handleVolume = (v: number) => {
    if (!playerRef.current) return;
    setVolume(v);
    playerRef.current.setVolume(v);
    if (v === 0) setMuted(true);
    else if (muted) { playerRef.current.unMute(); setMuted(false); }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen?.();
  };

  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&vq=hd1080&playsinline=1`;

  return (
    <div ref={containerRef} className="absolute inset-0 bg-black">
      <iframe
        id={iframeId}
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
        visible
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
    <div ref={containerRef} className="absolute inset-0 bg-black">
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
        visible
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
