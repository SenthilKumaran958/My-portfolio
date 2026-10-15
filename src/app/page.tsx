"use client";

import { useEffect } from "react";
import { useExperience } from "@/store/experience";
import { ModeSelect } from "@/components/three/mode-select";
import { Experience3D } from "@/components/three/experience-3d";
import { Portfolio2D } from "@/components/three/portfolio-2d";

export default function Home() {
  const mode = useExperience((s) => s.mode);
  const setMode = useExperience((s) => s.setMode);
  const webglOk = useExperience((s) => s.webglOk);

  // If WebGL is unavailable, never offer 3D — auto-redirect to 2D.
  useEffect(() => {
    if (webglOk === false && mode === "select") {
      // Keep on select screen but the 3D option will be disabled + auto-advance to 2D after a moment
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

  if (mode === "3d") return <Experience3D />;
  if (mode === "2d") return <Portfolio2D />;
  return <ModeSelect />;
}
