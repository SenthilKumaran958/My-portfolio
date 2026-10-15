"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Eye,
  Hand,
  ArrowDownToLine,
  Gauge,
  Compass,
  Gamepad2,
  Crosshair as CrosshairIcon,
} from "lucide-react";
import { DESTINATIONS, useExperience } from "@/store/experience";
import { cn } from "@/lib/utils";
import { HudLabels } from "./hud-labels";
import { PointerLockLayer } from "./pointer-lock-layer";

export function HUD({
  joystickRef,
  lookRef,
}: {
  joystickRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <>
      {/* Click-to-lock backdrop sits below interactive HUD so buttons still work */}
      <PointerLockLayer />
      <div className="pointer-events-none absolute inset-0 z-30 select-none">
        <HudLabels />
        <Crosshair />
        <TopBar />
        <Minimap />
        <DestinationPrompt />
        <ControlsHint />
        <MobileControls joystickRef={joystickRef} lookRef={lookRef} />
        <InstructionOverlay />
      </div>
    </>
  );
}

/* -------------------- Crosshair -------------------- */
function Crosshair() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="relative size-6">
        <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-moonlight/80" />
        <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-moonlight/40" />
        <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-moonlight/40" />
        <span className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-moonlight/40" />
        <span className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-moonlight/40" />
      </div>
    </div>
  );
}

/* -------------------- Top bar (quality + exit) -------------------- */
function TopBar() {
  const quality = useExperience((s) => s.quality);
  const setQuality = useExperience((s) => s.setQuality);
  const setMode = useExperience((s) => s.setMode);
  const [isTouch] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(pointer: coarse)").matches
      : false,
  );

  return (
    <div className="pointer-events-auto absolute left-4 right-4 top-4 flex items-center justify-between gap-3 sm:left-6 sm:right-6">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded border border-moonlight/40 font-display text-xs text-moonlight">
          SK
        </span>
        <span className="hidden font-display text-xs tracking-[0.25em] text-foreground/90 sm:inline">
          SENTHIL KUMARAN
        </span>
        <span className="ml-2 hidden text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:inline">
          · The Moonlit World
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setQuality(quality === "high" ? "reduced" : "high")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] transition-colors",
            quality === "high"
              ? "border-moonlight/40 bg-moonlight/10 text-moonlight"
              : "border-border/70 bg-background/50 text-muted-foreground",
          )}
          title="Toggle graphics quality"
        >
          <Gauge className="size-3" />
          {quality === "high" ? "High" : "Reduced"}
        </button>
        <button
          onClick={() => setMode("2d")}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-foreground transition-colors hover:border-moonlight/50 hover:text-moonlight"
        >
          <ArrowDownToLine className="size-3" />
          Exit 3D
        </button>
      </div>
      {isTouch ? <span className="sr-only">Touch device detected</span> : null}
    </div>
  );
}

/* -------------------- Minimap -------------------- */
function Minimap() {
  const nearby = useExperience((s) => s.nearbyDestination);
  const active = useExperience((s) => s.activeDestination);
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 hidden sm:block">
      <div className="relative size-28 rounded-lg border border-border/70 bg-background/60 p-2 backdrop-blur-sm">
        <div className="absolute left-2 top-2 text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
          World
        </div>
        <div className="relative h-full w-full">
          {/* Player dot at center */}
          <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-moonlight shadow-[0_0_8px_2px_rgba(155,184,214,0.6)]" />
          {/* Destination dots */}
          {DESTINATIONS.map((d) => {
            const x = 50 + (d.position[0] / 16) * 50;
            const y = 50 + (d.position[2] / 16) * 50;
            const isActive = active === d.id;
            const isNear = nearby === d.id;
            return (
              <span
                key={d.id}
                className={cn(
                  "absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all",
                  isActive || isNear ? "scale-150" : "",
                )}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: d.color,
                  boxShadow: isNear ? `0 0 8px 2px ${d.color}80` : "none",
                }}
              />
            );
          })}
          {/* Compass rose */}
          <Compass className="absolute -right-1 -top-1 size-3.5 text-muted-foreground/60" />
        </div>
      </div>
    </div>
  );
}

/* -------------------- Destination proximity prompt -------------------- */
function DestinationPrompt() {
  const nearby = useExperience((s) => s.nearbyDestination);
  const openPanel = useExperience((s) => s.openPanel);
  const dest = DESTINATIONS.find((d) => d.id === nearby);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && nearby) openPanel(nearby);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nearby, openPanel]);

  return (
    <AnimatePresence>
      {dest ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 sm:bottom-20"
        >
          <button
            onClick={() => openPanel(dest.id)}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-moonlight/40 bg-background/80 px-5 py-3 backdrop-blur-md transition-colors hover:border-moonlight/70 hover:bg-moonlight/10"
          >
            <span
              className="flex size-7 items-center justify-center rounded-full border text-[10px] font-bold"
              style={{ borderColor: dest.color, color: dest.color }}
            >
              E
            </span>
            <span className="flex flex-col text-left">
              <span className="font-display text-sm tracking-[0.2em] text-foreground">
                ENTER · {dest.name}
              </span>
              <span className="font-serif-body text-[11px] italic text-muted-foreground">
                Click or press E to explore
              </span>
            </span>
            <Hand className="size-4 text-moonlight" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------- Controls hint (desktop) -------------------- */
function ControlsHint() {
  return (
    <div className="pointer-events-none absolute bottom-4 right-4 hidden sm:block">
      <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/50 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-border/70 bg-muted px-1.5 py-0.5 font-mono text-foreground">W A S D</kbd>
          Move
        </span>
        <span className="h-3 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-border/70 bg-muted px-1.5 py-0.5 font-mono text-foreground">Mouse</kbd>
          Look
        </span>
        <span className="h-3 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-border/70 bg-muted px-1.5 py-0.5 font-mono text-foreground">E</kbd>
          Enter
        </span>
      </div>
    </div>
  );
}

/* -------------------- Mobile controls (joystick + look pad) -------------------- */
function MobileControls({
  joystickRef,
  lookRef,
}: {
  joystickRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const [isTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    // Coarse pointer (touch) OR narrow viewport without a fine pointer
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    return coarse || (narrow && !fine);
  });
  if (!isTouch) return null;

  return (
    <>
      {/* Look pad: right half of screen */}
      <LookPad lookRef={lookRef} />
      {/* Joystick: bottom-left */}
      <Joystick joystickRef={joystickRef} />
    </>
  );
}

function LookPad({ lookRef }: { lookRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      ref={ref}
      className="pointer-events-auto absolute right-0 top-0 h-2/3 w-1/2 sm:hidden"
      onTouchStart={(e) => {
        const t = e.touches[0];
        last.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchMove={(e) => {
        if (!last.current) return;
        const t = e.touches[0];
        lookRef.current.x += t.clientX - last.current.x;
        lookRef.current.y += t.clientY - last.current.y;
        last.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={() => (last.current = null)}
    />
  );
}

function Joystick({ joystickRef }: { joystickRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  const update = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const max = rect.width / 2;
    const len = Math.hypot(dx, dy);
    const clamped = len > max ? max : len;
    const nx = len ? (dx / len) * clamped : 0;
    const ny = len ? (dy / len) * clamped : 0;
    if (knobRef.current) knobRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
    joystickRef.current.x = nx / max;
    joystickRef.current.y = ny / max;
  };

  return (
    <div className="pointer-events-auto absolute bottom-8 left-8 sm:hidden">
      <div
        ref={baseRef}
        onTouchStart={(e) => {
          active.current = true;
          const t = e.touches[0];
          update(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          if (!active.current) return;
          const t = e.touches[0];
          update(t.clientX, t.clientY);
        }}
        onTouchEnd={() => {
          active.current = false;
          if (knobRef.current) knobRef.current.style.transform = "translate(0,0)";
          joystickRef.current.x = 0;
          joystickRef.current.y = 0;
        }}
        className="relative flex size-24 items-center justify-center rounded-full border border-moonlight/40 bg-background/50 backdrop-blur-sm"
      >
        <div
          ref={knobRef}
          className="size-10 rounded-full border border-moonlight/60 bg-moonlight/20 transition-transform duration-75"
        />
        <Gamepad2 className="absolute size-4 text-moonlight/40" />
      </div>
    </div>
  );
}

/* -------------------- First-visit instruction overlay -------------------- */
function InstructionOverlay() {
  const seen = useExperience((s) => s.instructionsSeen);
  const setSeen = useExperience((s) => s.setInstructionsSeen);
  const [isTouch] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(pointer: coarse)").matches
      : false,
  );

  return (
    <AnimatePresence>
      {!seen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-ink/80 backdrop-blur-sm"
          onClick={() => setSeen(true)}
        >
          <div className="mx-4 max-w-md rounded-2xl border border-border/70 bg-background/90 p-6 text-center sm:p-8">
            <span className="flex mx-auto size-12 items-center justify-center rounded-full border border-moonlight/40 text-moonlight">
              <Eye className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-xl tracking-[0.15em] text-foreground">
              ENTER THE MOONLIT WORLD
            </h2>
            <p className="mt-3 font-serif-body text-sm leading-relaxed text-muted-foreground">
              An explorable 3D environment. Walk the stone paths to discover three
              destinations: Game Development, Environment Art, and Level Design.
            </p>
            <div className="mt-5 grid gap-2 text-left text-xs text-muted-foreground">
              {isTouch ? (
                <>
                  <Hint icon={<Gamepad2 className="size-3.5" />} text="Left joystick to move, drag right side to look" />
                  <Hint icon={<Hand className="size-3.5" />} text="Approach a beacon, then tap the prompt or its crystal" />
                </>
              ) : (
                <>
                  <Hint icon={<CrosshairIcon className="size-3.5" />} text="Click to lock the mouse, then look around" />
                  <Hint icon={<span className="font-mono font-bold">W A S D</span>} text="Move through the world" />
                  <Hint icon={<Hand className="size-3.5" />} text="Approach a beacon and press E or click it" />
                </>
              )}
              <Hint icon={<ArrowDownToLine className="size-3.5" />} text="Prefer to read? Exit 3D for the 2D portfolio" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSeen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-moonlight px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-moonlight/90"
            >
              Begin
              <X className="size-3.5" />
            </button>
            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Tip: click anywhere to dismiss
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Hint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-border/50 bg-background/40 px-3 py-2">
      <span className="flex size-6 shrink-0 items-center justify-center rounded border border-moonlight/30 text-moonlight">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
