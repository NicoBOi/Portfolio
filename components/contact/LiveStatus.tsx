"use client";

import { useEffect, useState } from "react";

// Live availability badge — small filled dot + Bordeaux local time, updated
// every minute. Uses suppressHydrationWarning + a mounted gate so the SSR
// markup matches the first client paint (timezone differences would
// otherwise log a hydration mismatch).
export default function LiveStatus() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
      });
      setTime(t);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="inline-flex items-center gap-3"
      aria-label="Disponible — Bordeaux"
    >
      <span
        className="block w-1.5 h-1.5 rounded-full bg-white"
        style={{ opacity: 0.85 }}
        aria-hidden="true"
      />
      <span
        className="label text-white"
        style={{ opacity: 0.6, letterSpacing: "0.32em", fontSize: "11px" }}
      >
        Disponible · Bordeaux
        {time && <> · <span className="tabular-nums">{time}</span></>}
      </span>
    </div>
  );
}
