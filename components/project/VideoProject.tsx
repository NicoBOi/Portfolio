"use client";

import Player from "@vimeo/player";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import ProjectNav from "./ProjectNav";
import VideoControls from "./VideoControls";
import Link from "next/link";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  setVolume(v: number): void;
  destroy(): void;
}

interface YTWindow {
  YT?: {
    Player: new (id: string, opts: object) => YTPlayer;
  };
  onYouTubeIframeAPIReady?: () => void;
}

function getVimeoId(url: string): string | null {
  return url.match(/vimeo\.com\/(\d+)/)?.[1] ?? null;
}

function getYoutubeId(url: string): string | null {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] ?? null;
}

interface Props {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export default function VideoProject({ project, prev, next }: Props) {
  const vimeoId = project.videoUrl ? getVimeoId(project.videoUrl) : null;
  const youtubeId = vimeoId
    ? null
    : project.youtubeId ?? (project.videoUrl ? getYoutubeId(project.videoUrl) : null);

  return (
    <article className="bg-black min-h-screen">
      {/* Back */}
      <div className="px-6 md:px-10 pt-20 pb-0">
        <Link
          href="/work"
          className="label text-white hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
          style={{ opacity: 0.3 }}
        >
          <span aria-hidden="true">←</span>
          Projets
        </Link>
      </div>

      {/* Player — edge to edge, native aspect */}
      <div
        className="relative w-full mt-6 overflow-hidden bg-black"
        style={{ aspectRatio: project.videoAspect ?? "16/9" }}
      >
        {youtubeId ? (
          <YouTubePlayer youtubeId={youtubeId} />
        ) : vimeoId ? (
          <VimeoPlayer vimeoId={vimeoId} />
        ) : (
          <VideoPlaceholder project={project} />
        )}
      </div>

      {/* Info + meta */}
      <div className="px-6 md:px-10 py-8 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <h1 className="text-white title" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)", lineHeight: 1 }}>
          {project.title}
        </h1>
        <div className="flex flex-col gap-2 self-center">
          <p className="label text-white" style={{ opacity: 0.55 }}>{project.meta.type}</p>
          <p className="label text-white" style={{ opacity: 0.35 }}>{project.meta.location}</p>
          <p className="label text-white" style={{ opacity: 0.35 }}>{project.meta.credits}</p>
          <p className="label text-white mt-3" style={{ opacity: 0.25 }}>{project.year}</p>
        </div>
      </div>

      {/* Real stills only — no placeholder cards for video-only projects */}
      {project.imageFiles && project.imageFiles.length > 0 && (
        <div className="px-6 md:px-10 py-10">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {project.imageFiles.slice(0, 4).map((f, i) => (
              <motion.figure
                key={f}
                className="aspect-video overflow-hidden"
                style={{ backgroundColor: project.coverPlaceholder }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-6%" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: SOFT }}
              >
                <img
                  src={`/projects/${project.slug}/${f}`}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.figure>
            ))}
          </div>
        </div>
      )}

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}

// ──────────────────────────────────────────────────────────────
// YouTube
// ──────────────────────────────────────────────────────────────

function YouTubePlayer({ youtubeId }: { youtubeId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(80);
  const [ready, setReady] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const iframeId = `yt-vp-${youtubeId}`;

  useEffect(() => {
    let player: YTPlayer | null = null;

    const createPlayer = () => {
      const yt = (window as unknown as YTWindow).YT!;
      player = new yt.Player(iframeId, {
        events: {
          onReady: () => setReady(true),
          onStateChange: (e: { data: number }) => setPlaying(e.data === 1),
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
    };
  }, [iframeId]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const handleVolume = (v: number) => {
    if (!playerRef.current) return;
    setVolume(v);
    playerRef.current.setVolume(v);
    if (v === 0) setMuted(true);
    else if (muted) {
      playerRef.current.unMute();
      setMuted(false);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen?.();
  };

  // autoplay=1 + mute=1 suppresses the initial YT play-button overlay.
  // loop=1 + playlist={id} loops a single video and avoids the "recommended
  // videos" end-screen. youtube-nocookie keeps the privacy-enhanced embed
  // (a bit less branding); modestbranding + rel=0 trim the rest.
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&vq=hd1080&playsinline=1`;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
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
      {/* Click-to-toggle overlay. Suppresses YT/Vimeo hover chrome and labels the cursor. */}
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
        visible={showControls}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolume}
        onFullscreen={handleFullscreen}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Vimeo (uses background=1 to hide all native chrome; SDK for control)
// ──────────────────────────────────────────────────────────────

function VimeoPlayer({ vimeoId }: { vimeoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(80);
  const [ready, setReady] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;
    const player = new Player(iframeRef.current);
    playerRef.current = player;

    player.ready().then(() => setReady(true));
    const onPlay = () => setPlaying(true);
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
    if (v === 0) {
      p.setMuted(true);
      setMuted(true);
    } else if (muted) {
      p.setMuted(false);
      setMuted(false);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen?.();
  };

  // background=1 hides every native Vimeo control / overlay (works on free accounts).
  // We drive playback through the Player SDK instead.
  const src = `https://player.vimeo.com/video/${vimeoId}?background=1&dnt=1`;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
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
      {/* Click-to-toggle overlay. Also blocks Vimeo hover chrome and labels the cursor. */}
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
        visible={showControls}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolume}
        onFullscreen={handleFullscreen}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Placeholder for projects without a resolved video source
// ──────────────────────────────────────────────────────────────

function VideoPlaceholder({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: project.coverPlaceholder }}>
      <motion.div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col items-center gap-5">
          <div className="w-20 h-20 border-2 border-white/40 rounded-full flex items-center justify-center">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M1 1L15 9L1 17V1Z" fill="white" />
            </svg>
          </div>
          <span className="label text-white" style={{ opacity: 0.4 }}>Bientôt disponible</span>
        </div>
      </div>
      <motion.div
        className="absolute bottom-6 left-6 md:left-10 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="label text-white mb-2" style={{ opacity: 0.3 }}>
          {project.year} — {project.role}
        </p>
        <h1 className="text-white title" style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}>
          {project.title}
        </h1>
      </motion.div>
    </div>
  );
}
