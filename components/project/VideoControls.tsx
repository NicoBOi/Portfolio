"use client";

interface Props {
  playing: boolean;
  muted: boolean;
  volume: number;
  ready: boolean;
  visible: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
  onFullscreen?: () => void;
}

export default function VideoControls({
  playing,
  muted,
  volume,
  ready,
  visible,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onFullscreen,
}: Props) {
  return (
    <div
      className="absolute bottom-5 right-5 z-10 flex items-center gap-2"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Volume */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      >
        <button
          onClick={onToggleMute}
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
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{ width: 64, height: 2, accentColor: "white", opacity: 0.65 }}
          aria-label="Volume"
        />
      </div>

      {/* Play / Pause */}
      <button
        onClick={onTogglePlay}
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

      {/* Fullscreen */}
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className="flex items-center justify-center rounded hover:opacity-100 transition-opacity duration-200"
          style={{
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            padding: "8px 10px",
            opacity: 0.75,
          }}
          aria-label="Plein écran"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 4V1H4M8 1H11V4M11 8V11H8M4 11H1V8" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
