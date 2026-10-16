"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
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

/**
 * The 2D scrolling portfolio. All content lives in the single source of
 * truth in src/lib/portfolio-data.ts.
 */
export function Portfolio2D() {
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Nav />
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

      {/* Back to top */}
      <AnimatePresence>
        {showFab ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground backdrop-blur-md transition-colors hover:border-moonlight/50 hover:text-moonlight"
            aria-label="Back to top"
          >
            <ArrowUp className="size-4" />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
