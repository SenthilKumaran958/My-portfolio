"use client";

import { useEffect, useState } from "react";

/**
 * Shared mutable array the raw-three experience updates each frame with
 * each destination's projected screen position + visibility. The HUD label
 * layer reads from this via rAF.
 */
export type LabelScreen = {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  visible: boolean;
  x: number;
  y: number;
};

// Initialized lazily to avoid SSR issues; the raw-three experience fills it.
export const labelsState: LabelScreen[] = [];

export function HudLabels() {
  const [, force] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      force((n) => (n + 1) % 1000000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {labelsState.map((l) => {
        if (!l.visible) return null;
        const margin = 80;
        const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        const clampedX = Math.max(margin, Math.min(vw - margin, l.x));
        const clampedY = Math.max(margin + 60, Math.min(vh - margin, l.y));
        const offScreen = clampedX !== l.x || clampedY !== l.y;
        return (
          <div
            key={l.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: clampedX, top: clampedY }}
          >
            <div className="flex flex-col items-center text-center" style={{ transform: "translateY(-50%)" }}>
              {offScreen ? (
                <span className="mb-1 text-[9px] uppercase tracking-[0.2em]" style={{ color: l.color }}>
                  ↗ {l.name}
                </span>
              ) : (
                <>
                  <span
                    className="font-display text-[13px] uppercase tracking-[0.25em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]"
                    style={{ color: l.color }}
                  >
                    {l.name}
                  </span>
                  <span className="mt-0.5 max-w-[220px] font-serif-body text-[10px] italic text-slate-400 drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)]">
                    {l.subtitle}
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
