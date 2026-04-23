"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import ProjectNav from "./ProjectNav";

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
  // Prefer Vimeo URL when present (youtubeId may only be a thumbnail placeholder)
  const vimeoId = project.videoUrl ? getVimeoId(project.videoUrl) : null;
  const youtubeId = vimeoId ? null : (project.youtubeId ?? (project.videoUrl ? getYoutubeId(project.videoUrl) : null));

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

      {/* Player */}
      {youtubeId ? (
        <YouTubePlayer youtubeId={youtubeId} project={project} />
      ) : vimeoId ? (
        <div className="w-full mt-8" style={{ aspectRatio: "16/9", maxHeight: "82vh", backgroundColor: project.coverPlaceholder }}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?color=ffffff&title=0&byline=0&portrait=0&dnt=1`}
            className="w-full h-full"
            style={{ border: 0 }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="relative w-full mt-8" style={{ aspectRatio: "16/9", maxHeight: "82vh", backgroundColor: project.coverPlaceholder }}>
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
            <p className="label text-white mb-2" style={{ opacity: 0.3 }}>{project.year} — {project.role}</p>
            <h1 className="text-white title" style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}>
              {project.title}
            </h1>
          </motion.div>
        </div>
      )}

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

      {/* Stills */}
      <div className="px-6 md:px-10 py-10">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="aspect-video"
              style={{ backgroundColor: project.coverPlaceholder + (i % 2 === 0 ? "88" : "55") }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: SOFT }}
            >
              <div className="placeholder-img text-white h-full">Still {i + 1}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}

function YouTubePlayer({ youtubeId, project }: { youtubeId: string; project: Project }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
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

  return (
    <div
      className="relative w-full mt-8"
      style={{ aspectRatio: "16/9", maxHeight: "82vh", backgroundColor: project.coverPlaceholder }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <iframe
        ref={iframeRef}
        id={iframeId}
        src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&modestbranding=1&vq=hd1080&controls=0&disablekb=1&fs=0&iv_load_policy=3`}
        className="w-full h-full"
        style={{ border: 0 }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />

      {/* Custom controls — bottom right, visible on hover */}
      <div
        className="absolute bottom-5 right-5 z-10 flex items-center gap-2"
        style={{
          opacity: showControls ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: showControls ? "auto" : "none",
        }}
      >
        {/* Volume */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
        >
          <button
            onClick={toggleMute}
            className="flex items-center justify-center hover:opacity-100 transition-opacity duration-200"
            style={{ opacity: 0.65 }}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? (
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                <path d="M1 4H3L6 1V11L3 8H1V4Z" fill="white" />
                <line x1="9" y1="3" x2="13" y2="9" stroke="white" strokeWidth="1.2" />
                <line x1="13" y1="3" x2="9" y2="9" stroke="white" strokeWidth="1.2" />
              </svg>
            ) : (
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                <path d="M1 4H3L6 1V11L3 8H1V4Z" fill="white" />
                <path d="M9 3.5C10.2 4.5 11 5.7 11 6C11 6.3 10.2 7.5 9 8.5" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                {volume > 50 && <path d="M11.5 1.5C13.2 3 14 4.5 14 6C14 7.5 13.2 9 11.5 10.5" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />}
              </svg>
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={(e) => handleVolume(Number(e.target.value))}
            className="cursor-pointer"
            style={{ width: 64, height: 2, accentColor: "white", opacity: 0.65 }}
          />
        </div>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={!ready}
          className="flex items-center justify-center rounded hover:opacity-100 transition-opacity duration-200"
          style={{
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            padding: "8px 10px",
            opacity: ready ? 0.75 : 0.3,
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="white">
              <rect x="0" y="0" width="3.5" height="12" rx="1" />
              <rect x="6.5" y="0" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="white">
              <path d="M1 0.5L9.5 6L1 11.5V0.5Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
