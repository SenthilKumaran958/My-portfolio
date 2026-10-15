"use client";

import { useEffect, useState } from "react";
import { labelsState } from "@/components/three/world/destination-markers";
import { useExperience } from "@/store/experience";

/**
 * DOM-rendered floating labels for destinations.
 * Reads positions updated each frame by the beacons (labelsState) and
 * re-renders via rAF. This avoids drei <Html> nested-React-root issues.
 */
export function HudLabels() {
  const nearby = useExperience((s) => s.nearbyDestination);
  const openPanel = useExperience((s) => s.openPanel);
  const active = useExperience((s) => s.activeDestination);
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
        const isNear = nearby === l.id;
        const isActive = active === l.id;
        // Clamp label to screen edges (keep a margin) so off-axis beacons
        // remain discoverable instead of disappearing.
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
            <button
              onClick={() => openPanel(l.id as any)}
              className="pointer-events-auto flex flex-col items-center text-center transition-transform"
              style={{ transform: "translateY(-50%)" }}
            >
              {offScreen ? (
                <span
                  className="mb-1 text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: l.color }}
                >
                  ↗ {l.name}
                </span>
              ) : null}
              <span
                className="font-display text-[13px] uppercase tracking-[0.25em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]"
                style={{
                  color: isNear || isActive ? "#e8edf5" : l.color,
                  opacity: isNear ? 1 : 0.85,
                }}
              >
                {l.name}
              </span>
              {!offScreen ? (
                <span className="mt-0.5 max-w-[220px] font-serif-body text-[10px] italic text-slate-400 drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)]">
                  {l.subtitle}
                </span>
              ) : null}
              {isNear ? (
                <span
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] backdrop-blur-sm"
                  style={{ borderColor: l.color, color: l.color }}
                >
                  Press E
                </span>
              ) : null}
            </button>
          </div>
        );
      })}
    </div>
  );
}
