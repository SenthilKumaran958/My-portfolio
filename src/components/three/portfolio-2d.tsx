"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowUp, X } from "lucide-react";
import { Nav } from "@/components/portfolio/nav";
import { Hero } from "@/components/portfolio/hero";
import { FeaturedProject } from "@/components/portfolio/featured-project";
import { EnvironmentGallery } from "@/components/portfolio/environment-gallery";
import { UnrealEnvironments } from "@/components/portfolio/unreal-environments";
import { LevelDesign } from "@/components/portfolio/level-design";
import { Skills } from "@/components/portfolio/skills";
import { About } from "@/components/portfolio/about";
import { Journal } from "@/components/portfolio/journal";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";
import { PersistentNav } from "@/components/three/hud/persistent-nav";
import { useExperience } from "@/store/experience";

/**
 * The traditional 2D scrolling portfolio.
 * Preserves all the existing 2D components. Adds a compact "Enter 3D"
 * affordance so visitors can jump into the immersive world from here too.
 */
export function Portfolio2D() {
  const setMode = useExperience((s) => s.setMode);
  const [show3dFab, setShow3dFab] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow3dFab(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Nav />
      <PersistentNav />
      <main className="flex-1">
        <Hero />
        <FeaturedProject />
        <EnvironmentGallery />
        <UnrealEnvironments />
        <LevelDesign />
        <Skills />
        <About />
        <Journal />
        <Contact />
      </main>
      <Footer />

      {/* Floating "Enter 3D" affordance */}
      <AnimatePresence>
        {show3dFab ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMode("3d")}
            className="group fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full border border-moonlight/40 bg-background/80 px-4 py-3 text-sm shadow-2xl backdrop-blur-md transition-colors hover:border-moonlight/70 hover:bg-moonlight/10"
            aria-label="Enter the 3D world"
          >
            <span className="flex size-7 items-center justify-center rounded-full border border-moonlight/40 text-moonlight">
              <Compass className="size-4" />
            </span>
            <span className="flex flex-col text-left leading-none">
              <span className="font-display text-xs tracking-[0.2em] text-foreground">
                ENTER 3D
              </span>
              <span className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Explore the world
              </span>
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* Back to top */}
      <AnimatePresence>
        {show3dFab ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-40 flex size-11 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground backdrop-blur-md transition-colors hover:border-moonlight/50 hover:text-moonlight"
            aria-label="Back to top"
          >
            <ArrowUp className="size-4" />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
