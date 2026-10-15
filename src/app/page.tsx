"use client";

import { useEffect, lazy, Suspense } from "react";
import { useExperience } from "@/store/experience";
import { ModeSelect } from "@/components/three/mode-select";

// Dynamically import BOTH the 3D experience and the 2D portfolio so the
// heavy bundles (three.js / recharts / react-syntax-highlighter) only load
// when actually needed. This keeps the initial mode-select compile light.
const Experience3D = lazy(() =>
  import("@/components/three/experience-3d").then((m) => ({ default: m.Experience3D })),
);
const Portfolio2D = lazy(() =>
  import("@/components/three/portfolio-2d").then((m) => ({ default: m.Portfolio2D })),
);

export default function Home() {
  const mode = useExperience((s) => s.mode);
  const setMode = useExperience((s) => s.setMode);
  const webglOk = useExperience((s) => s.webglOk);

  // If WebGL is unavailable, never offer 3D — auto-redirect to 2D.
  useEffect(() => {
    if (webglOk === false && mode === "select") {
      const t = setTimeout(() => setMode("2d"), 2200);
      return () => clearTimeout(t);
    }
  }, [webglOk, mode, setMode]);

  // Lock body scroll while in 3D (the world is fixed full-screen)
  useEffect(() => {
    if (mode === "3d") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mode]);

  if (mode === "3d") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Experience3D />
      </Suspense>
    );
  }
  if (mode === "2d") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Portfolio2D />
      </Suspense>
    );
  }
  return <ModeSelect />;
}
