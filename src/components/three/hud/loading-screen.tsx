"use client";

import { useEffect, useRef, useState } from "react";

export function LoadingScreen({ done }: { done: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [simProgress, setSimProgress] = useState(8);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setSimProgress((p) => Math.min(p + Math.random() * 12, 92));
    }, 220);
    return () => clearInterval(id);
  }, [done]);

  useEffect(() => {
    if (done && !hideTimer.current) {
      hideTimer.current = setTimeout(() => setHidden(true), 700);
    }
    return () => {
      if (!done && hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
        setHidden(false);
      }
    };
  }, [done]);

  const progress = done ? 100 : simProgress;

  return (
    <div
      aria-hidden={hidden}
      className="absolute inset-0 z-50 flex items-center justify-center bg-ink transition-opacity duration-500"
      style={{ opacity: hidden ? 0 : 1, pointerEvents: hidden ? "none" : "auto" }}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 30%, rgba(155,184,214,0.18), transparent 70%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <div className="size-14 animate-spin rounded-full border border-moonlight/30 border-t-moonlight" style={{ animationDuration: "6s" }} />
        <div>
          <p className="font-display text-xs uppercase tracking-[0.45em] text-moonlight/80">
            The Moonlit World
          </p>
          <h1 className="mt-2 font-display text-2xl tracking-[0.1em] text-foreground sm:text-3xl">
            AWAKENING THE WORLD
          </h1>
        </div>
        <div className="h-1 w-56 overflow-hidden rounded-full bg-border/40">
          <div
            className="h-full bg-moonlight transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {done ? "Ready" : "Loading environment"}
        </p>
      </div>
    </div>
  );
}
