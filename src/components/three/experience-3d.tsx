"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Fog } from "three";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { CameraController } from "./camera-controller";
import {
  WorldGeometry,
  WorldLighting,
  SkyDome,
  Moon,
} from "./world/world-geometry";
import { DestinationMarkers } from "./world/destination-markers";
import { HUD } from "./hud/hud";
import { PersistentNav } from "./hud/persistent-nav";
import { LoadingScreen } from "./hud/loading-screen";
import { DestinationPanel } from "./destinations/destination-panel";
import { useExperience } from "@/store/experience";

export function Experience3D() {
  const joystickRef = useRef({ x: 0, y: 0 });
  const lookRef = useRef({ x: 0, y: 0 });
  const loaded = useExperience((s) => s.loaded);
  const setLoaded = useExperience((s) => s.setLoaded);
  const quality = useExperience((s) => s.quality);

  useEffect(() => {
    // Mark loaded after first frame settles (also acts as fallback timer)
    const t = setTimeout(() => setLoaded(true), 1600);
    return () => clearTimeout(t);
  }, [setLoaded]);

  const reduced = quality === "reduced";

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      <Canvas
        shadows={!reduced}
        dpr={reduced ? [1, 1] : [1, 1.8]}
        gl={{
          antialias: !reduced,
          powerPreference: "high-performance",
          alpha: false,
        }}
        camera={{ fov: 70, near: 0.1, far: 120, position: [0, 1.6, 2] }}
        onCreated={({ scene, gl }) => {
          scene.fog = new Fog(0x14161f, 12, 55);
          gl.setClearColor(0x0a0b12, 1);
        }}
        className="absolute inset-0"
      >
        <Suspense fallback={null}>
          <WorldLighting />
          <SkyDome />
          <Moon />
          <WorldGeometry />
          <DestinationMarkers />
          <CameraController joystickRef={joystickRef} lookRef={lookRef} />
          {!reduced ? (
            <EffectComposer>
              <Vignette eskil={false} offset={0.25} darkness={0.85} />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>

      {/* HUD overlay */}
      <HUD joystickRef={joystickRef} lookRef={lookRef} />
      <PersistentNav />

      {/* Destination detail panel */}
      <DestinationPanel />

      {/* Loading screen */}
      <LoadingScreen done={loaded} />
    </div>
  );
}
