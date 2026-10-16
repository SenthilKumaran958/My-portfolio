"use client";

import { motion } from "framer-motion";
import { ChevronDown, Play, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/portfolio-data";

export function Hero() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-20">
        <img
          src={profile.heroImage}
          alt="Atmospheric dark fantasy landscape with distant mountains, fog, and moonlit ruins"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </div>

      {/* Atmospheric overlays */}
      <div className="absolute inset-0 -z-10 vignette" aria-hidden />
      <div className="absolute inset-0 -z-10 fog-overlay" aria-hidden />
      {/* Drifting fog band */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-background via-background/70 to-transparent"
      />
      {/* Moonlight glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 -z-10 size-[60vw] -translate-x-1/2 rounded-full bg-moonlight/10 blur-[140px]"
      />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-24 pb-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <span className="eyebrow text-moonlight/90">
            <span className="text-muted-foreground">Game Developer</span>
            <span className="h-3 w-px bg-moonlight/30" aria-hidden />
            <span className="text-muted-foreground">Environment Artist</span>
          </span>

          <h1 className="mt-7 font-display text-5xl font-700 leading-[1.05] tracking-[0.02em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {profile.heroTitle[0]}
            <br />
            <span className="glow-moonlight text-moonlight">{profile.heroTitle[1]}</span>
          </h1>

          <p className="mt-8 max-w-2xl font-serif-body text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {profile.heroSubtitle}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={() => scrollTo("#shadow-blade")}
              className="group bg-moonlight text-background hover:bg-moonlight/90"
            >
              <Play className="size-4 transition-transform group-hover:translate-x-0.5" />
              Explore My Projects
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("#environment-art")}
              className="border-moonlight/30 bg-background/40 text-foreground hover:border-moonlight/60 hover:text-moonlight"
            >
              <ImageIcon className="size-4" />
              View Environment Art
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-px w-16 bg-moonlight/30" aria-hidden />
            <p className="font-serif-body text-sm italic text-muted-foreground">
              {profile.tagline}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("#shadow-blade")}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground/70 transition-colors hover:text-moonlight md:flex"
        aria-label="Scroll to projects"
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-border">
          <span className="mt-2 h-2 w-px animate-scroll-hint bg-moonlight/80" />
        </span>
        <ChevronDown className="size-3" />
      </button>
    </section>
  );
}
