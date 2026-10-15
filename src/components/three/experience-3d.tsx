"use client";

import { useRef, useEffect } from "react";
import { RawThreeExperience } from "./raw-three-experience";
import { HUD } from "./hud/hud";
import { PersistentNav } from "./hud/persistent-nav";
import { LoadingScreen } from "./hud/loading-screen";
import { DestinationPanel } from "./destinations/destination-panel";
import { useExperience } from "@/store/experience";

/**
 * 3D experience wrapper. The actual three.js scene is built imperatively in
 * RawThreeExperience (plain three.js, no React Three Fiber) to keep the
 * bundle light enough for memory-constrained environments. The HUD, nav,
 * destination panels, and loading screen are React overlays on top.
 */
export function Experience3D() {
  const joystickRef = useRef({ x: 0, y: 0 });
  const lookRef = useRef({ x: 0, y: 0 });
  const loaded = useExperience((s) => s.loaded);
  const setLoaded = useExperience((s) => s.setLoaded);
  const quality = useExperience((s) => s.quality);
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

  // Reduced-quality hint (read by raw-three via the store)
  void quality;

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

      {/* Destination detail panel */}
      <DestinationPanel />

      {/* Loading screen */}
      <LoadingScreen done={loaded} />
    </div>
  );
}
