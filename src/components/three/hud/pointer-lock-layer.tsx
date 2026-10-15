"use client";

import { useEffect, useRef, useState } from "react";
import { useExperience } from "@/store/experience";
import { Crosshair, AlertTriangle } from "lucide-react";

/**
 * PointerLockLayer
 *
 * Responsible for the full pointer-lock lifecycle:
 *  - On a genuine user click on the world backdrop, requests pointer lock on
 *    the canvas.
 *  - Observes pointerlockchange / pointerlockerror and updates the store.
 *  - While NOT locked (and no menu/panel open), shows a translucent "click to
 *    look" hint so the visitor knows what to do.
 *  - If pointer lock is denied, shows a clear fallback message and the visitor
 *    can still look using click-and-drag (we dispatch custom events the
 *    raw-three experience listens for).
 *
 * This is the piece that was missing in the original implementation — the
 * controller listened for mousemove but nothing ever requested the lock.
 */
export function PointerLockLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const setPointerLocked = useExperience((s) => s.setPointerLocked);
  const setPointerLockDenied = useExperience((s) => s.setPointerLockDenied);
  const pointerLocked = useExperience((s) => s.pointerLocked);
  const pointerLockDenied = useExperience((s) => s.pointerLockDenied);
  const panelOpen = useExperience((s) => s.panelOpen);
  const menuOpen = useExperience((s) => s.menuOpen);
  const setInstructionsSeen = useExperience((s) => s.setInstructionsSeen);
  const [fallbackDrag, setFallbackDrag] = useState(false);

  // Find the canvas + wire lock observers. Subscribed once.
  useEffect(() => {
    const findCanvas = () => {
      const c = document.querySelector("canvas") as HTMLCanvasElement | null;
      if (c) canvasRef.current = c;
      return c;
    };
    findCanvas();
    let tries = 0;
    const id = setInterval(() => {
      if (canvasRef.current || tries > 20) clearInterval(id);
      else findCanvas();
      tries++;
    }, 100);

    const onLockChange = () => {
      const locked = !!document.pointerLockElement;
      setPointerLocked(locked);
      if (locked) {
        setPointerLockDenied(false);
        setInstructionsSeen(true);
      }
    };
    const onLockError = () => {
      setPointerLocked(false);
      setPointerLockDenied(true);
    };
    document.addEventListener("pointerlockchange", onLockChange);
    document.addEventListener("pointerlockerror", onLockError);
    return () => {
      clearInterval(id);
      document.removeEventListener("pointerlockchange", onLockChange);
      document.removeEventListener("pointerlockerror", onLockError);
    };
  }, [setPointerLocked, setPointerLockDenied, setInstructionsSeen]);

  // Click-to-lock handler attached to the whole backdrop. We only request
  // lock when no menu/panel is open and the click target isn't interactive.
  const requestLock = (e: React.MouseEvent) => {
    if (panelOpen || menuOpen) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, [role=dialog]")) return;
    const c = canvasRef.current;
    if (!c) return;
    const p = c.requestPointerLock?.();
    if (p && typeof (p as Promise<void>).catch === "function") {
      (p as Promise<void>).catch(() => setPointerLockDenied(true));
    }
  };

  // Fallback drag-look when pointer lock is denied. Dispatches synthetic
  // movement deltas the raw-three experience reads.
  const onFallbackPointerDown = (e: React.PointerEvent) => {
    if (panelOpen || menuOpen) return;
    setFallbackDrag(true);
    const start = { x: e.clientX, y: e.clientY };
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      start.x = ev.clientX;
      start.y = ev.clientY;
      window.dispatchEvent(
        new CustomEvent("experience:look", { detail: { dx, dy } }),
      );
    };
    const up = () => {
      setFallbackDrag(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const showHint = !pointerLocked && !panelOpen && !menuOpen && !fallbackDrag;

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-10"
      onClick={requestLock}
      onPointerDown={pointerLockDenied ? onFallbackPointerDown : undefined}
      aria-label="Click to enter look mode"
    >
      {showHint && !pointerLockDenied ? (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: "overlayFade 0.3s ease-out" }}
        >
          <div className="flex flex-col items-center gap-2 rounded-full border border-moonlight/30 bg-background/40 px-4 py-2 backdrop-blur-sm">
            <Crosshair className="size-4 text-moonlight" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-moonlight/90">
              Click to look
            </span>
          </div>
        </div>
      ) : null}

      {pointerLockDenied && showHint ? (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: "overlayFade 0.3s ease-out" }}
        >
          <div className="flex max-w-xs flex-col items-center gap-2 rounded-lg border border-amber-400/40 bg-background/80 px-5 py-4 text-center backdrop-blur-sm">
            <AlertTriangle className="size-5 text-amber-300" />
            <span className="text-xs font-medium text-foreground">
              Pointer lock unavailable
            </span>
            <span className="text-[11px] text-muted-foreground">
              Click and drag to look around instead.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
