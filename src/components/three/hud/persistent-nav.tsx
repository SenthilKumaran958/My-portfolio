"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Compass, Gamepad2 } from "lucide-react";
import { useExperience } from "@/store/experience";
import { cn } from "@/lib/utils";

/**
 * Persistent navigation — usable in BOTH 3D and 2D modes.
 * In 3D mode it lives as a compact pill; opening the Journal/About/Contact
 * items jumps to 2D mode where those sections live. The three destinations
 * can be teleported to directly in 3D.
 */
const ITEMS_3D = [
  { id: "game-development", label: "Game Development", kind: "destination" as const },
  { id: "environment-art", label: "Environment Art", kind: "destination" as const },
  { id: "level-design", label: "Level Design", kind: "destination" as const },
  { id: "journal", label: "Journal", kind: "jump" as const },
  { id: "about", label: "About", kind: "jump" as const },
  { id: "contact", label: "Contact", kind: "jump" as const },
];

const ITEMS_2D = [
  { id: "shadow-blade", label: "Projects" },
  { id: "environment-art", label: "Environment Art" },
  { id: "level-design", label: "Level Design" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "journal", label: "Journal" },
  { id: "contact", label: "Contact" },
];

export function PersistentNav() {
  const mode = useExperience((s) => s.mode);
  const setMode = useExperience((s) => s.setMode);
  const openPanel = useExperience((s) => s.openPanel);
  const [open, setOpen] = useState(false);

  const handleItem = (item: { id: string; kind?: "destination" | "jump" }) => {
    if (mode === "3d") {
      if (item.kind === "destination") {
        openPanel(item.id as any);
      } else {
        // Jump sections live in 2D portfolio — switch modes and scroll
        setMode("2d");
        // Defer scroll until 2D mounts
        setTimeout(() => {
          const el = document.getElementById(item.id);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 250);
      }
    } else {
      // 2D mode — smooth scroll to section
      const el = document.getElementById(item.id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  return (
    <div className="pointer-events-auto fixed left-1/2 top-4 z-50 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0">
      <div className="flex items-center gap-2">
        {/* Quick mode toggle */}
        <button
          onClick={() => setMode(mode === "3d" ? "2d" : "3d")}
          className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-foreground backdrop-blur-md transition-colors hover:border-moonlight/50 hover:text-moonlight sm:flex"
          title={mode === "3d" ? "Switch to 2D portfolio" : "Switch to 3D world"}
        >
          {mode === "3d" ? <Gamepad2 className="size-3" /> : <Compass className="size-3" />}
          {mode === "3d" ? "2D Portfolio" : "3D World"}
        </button>

        {/* Menu trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-foreground backdrop-blur-md transition-colors hover:border-moonlight/50 hover:text-moonlight"
          aria-expanded={open}
          aria-label="Open navigation menu"
        >
          {open ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-border/70 bg-background/95 p-2 shadow-2xl backdrop-blur-xl"
          >
            <p className="px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {mode === "3d" ? "The Moonlit World" : "Portfolio"}
            </p>
            <ul className="flex flex-col gap-0.5">
              {(mode === "3d" ? ITEMS_3D : ITEMS_2D).map((item: any) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleItem(item)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      "text-muted-foreground hover:bg-moonlight/10 hover:text-moonlight",
                    )}
                  >
                    <span className="font-serif-body">{item.label}</span>
                    {item.kind === "destination" ? (
                      <span className="text-[9px] uppercase tracking-[0.2em] text-moonlight/60">
                        Enter
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-1 border-t border-border/60 pt-1">
              <button
                onClick={() => {
                  setMode(mode === "3d" ? "2d" : "3d");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-moonlight/10 hover:text-moonlight"
              >
                <span>{mode === "3d" ? "Browse 2D Portfolio" : "Enter 3D World"}</span>
                {mode === "3d" ? <Gamepad2 className="size-3.5" /> : <Compass className="size-3.5" />}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
