"use client";

import { useRef, useEffect, lazy, Suspense } from "react";
import { RawThreeExperience } from "./raw-three-experience";
import { HUD } from "./hud/hud";
import { PersistentNav } from "./hud/persistent-nav";
import { LoadingScreen } from "./hud/loading-screen";
import { useExperience } from "@/store/experience";

// Lazy-load the destination panel so its heavier deps (shadcn Dialog,
// framer-motion, lucide icons) only compile when a destination is actually
// opened — not when the visitor first enters the 3D world. This keeps the
// initial 3D chunk compile small enough for memory-constrained environments.
const DestinationPanel = lazy(() =>
  import("./destinations/destination-panel").then((m) => ({
    default: m.DestinationPanel,
  })),
);

/**
 * 3D experience wrapper. The actual three.js scene is built imperatively in
 * RawThreeExperience (plain three.js loaded from a CDN at runtime) to keep
 * the bundle light. The HUD, nav, destination panels, and loading screen
 * are React overlays on top.
 */
export function Experience3D() {
  const joystickRef = useRef({ x: 0, y: 0 });
  const lookRef = useRef({ x: 0, y: 0 });
  const loaded = useExperience((s) => s.loaded);
  const setLoaded = useExperience((s) => s.setLoaded);
  const panelOpen = useExperience((s) => s.panelOpen);
  // Shared ref the raw-three experience fills with its tick function so we
  // can drive the render loop from outside (stable across re-renders).
  const tickRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      tickRef.current?.();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1600);
    return () => clearTimeout(t);
  }, [setLoaded]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <RawThreeExperience
        joystickRef={joystickRef}
        lookRef={lookRef}
        tickRef={tickRef}
      />

      {/* HUD overlay (pointer-events-none except interactive bits) */}
      <HUD joystickRef={joystickRef} lookRef={lookRef} />
      <PersistentNav />

      {/* Destination detail panel — lazy: only loads when opened */}
      {panelOpen ? (
        <Suspense fallback={null}>
          <DestinationPanel />
        </Suspense>
      ) : null}

      {/* Loading screen */}
      <LoadingScreen done={loaded} />
    </div>
  );
}
