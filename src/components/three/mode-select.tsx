"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  ScrollText,
  Gamepad2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useExperience } from "@/store/experience";
import { profile } from "@/lib/portfolio-data";

/**
 * The entry screen. Visitors choose how to experience the portfolio:
 *  - Enter the 3D world (immersive)
 *  - Browse the 2D portfolio (fast, accessible)
 * The 3D option only enables after a quick WebGL availability check.
 */
export function ModeSelect() {
  const setMode = useExperience((s) => s.setMode);
  const setWebglOk = useExperience((s) => s.setWebglOk);
  const webglOk = useExperience((s) => s.webglOk);
  const [entering3d, setEntering3d] = useState(false);

  useEffect(() => {
    // Detect WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      setWebglOk(!!gl);
    } catch {
      setWebglOk(false);
    }
  }, [setWebglOk]);

  const enter3d = () => {
    if (!webglOk) return;
    setEntering3d(true);
    setTimeout(() => setMode("3d"), 150);
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-ink">
      {/* Cinematic backdrop */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={profile.heroImage}
          alt="Moonlit ancient landscape"
          fill
          sizes="100vw"
          className="object-cover opacity-60"
          priority
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 -z-10 size-[60vw] -translate-x-1/2 rounded-full bg-moonlight/10 blur-[140px]"
      />

      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="eyebrow justify-center text-moonlight/80"
        >
          Senthil Kumaran · Game Developer · Environment Artist
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-6 font-display text-5xl leading-[1.05] tracking-[0.04em] text-foreground sm:text-6xl md:text-7xl"
        >
          ENTER THE
          <br />
          <span className="glow-moonlight text-moonlight">MOONLIT WORLD</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-7 max-w-2xl font-serif-body text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          An interactive 3D portfolio of {profile.tagline} Walk stone paths
          through an ancient world and discover my work — or browse the
          traditional portfolio.
        </motion.p>

        {/* Choice cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-2"
        >
          {/* 3D — primary */}
          <button
            onClick={enter3d}
            disabled={!webglOk || entering3d}
            className="group relative overflow-hidden rounded-2xl border border-moonlight/40 bg-moonlight/5 p-6 text-left transition-all hover:border-moonlight/70 hover:bg-moonlight/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-xl border border-moonlight/40 bg-moonlight/10 text-moonlight">
                <Compass className="size-6" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-moonlight/60">
                Recommended
              </span>
            </div>
            <h2 className="mt-5 font-display text-2xl tracking-wide text-foreground">
              Enter the 3D World
            </h2>
            <p className="mt-2 font-serif-body text-sm leading-relaxed text-muted-foreground">
              Explore a moonlit ancient environment. Walk to three destinations
              and discover my projects interactively.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-moonlight">
              {entering3d ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Entering
                </>
              ) : (
                <>
                  Begin
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
            {!webglOk ? (
              <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-amber-300/70">
                WebGL unavailable — use 2D mode
              </p>
            ) : null}
          </button>

          {/* 2D — alternative */}
          <button
            onClick={() => setMode("2d")}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/30 p-6 text-left transition-all hover:border-foreground/30 hover:bg-card/60"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background/40 text-muted-foreground transition-colors group-hover:text-foreground">
                <ScrollText className="size-6" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Accessible
              </span>
            </div>
            <h2 className="mt-5 font-display text-2xl tracking-wide text-foreground">
              Browse 2D Portfolio
            </h2>
            <p className="mt-2 font-serif-body text-sm leading-relaxed text-muted-foreground">
              A fast, scrollable portfolio with all the same projects, art,
              and breakdowns — no controls required.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
              Read now
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <Gamepad2 className="size-3.5" />
          Switch between modes anytime from the menu
        </motion.p>
      </div>
    </div>
  );
}
