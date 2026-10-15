"use client";

import { useEffect, useRef, useState } from "react";
import { useExperience } from "@/store/experience";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, AlertTriangle, Hand } from "lucide-react";

/**
 * PointerLockLayer
 *
 * Responsible for the full pointer-lock lifecycle:
 *  - On a genuine user click on the world backdrop, requests pointer lock on
 *    the canvas.
 *  - Observes pointerlockchange / pointerlockerror and updates the store
 *    (pointerLocked / pointerLockDenied).
 *  - While locked, shows nothing (cursor hidden by the browser).
 *  - While NOT locked (and no menu/panel open), shows a translucent "click to
 *    look" hint so the visitor knows what to do.
 *  - If pointer lock is denied or unavailable, shows a clear fallback message
 *    and the visitor can still look using the on-screen drag (we wire a drag
 *    fallback here too).
 *
 * This is the piece that was missing before — the controller listened for
 * mousemove but nothing ever requested the lock.
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
  const fallbackLook = useRef({ x: 0, y: 0 });

  // Find the R3F canvas + wire lock observers. Subscribed once.
  useEffect(() => {
    const findCanvas = () => {
      const c = document.querySelector("canvas") as HTMLCanvasElement | null;
      if (c) canvasRef.current = c;
      return c;
    };
    findCanvas();
    // Canvas mounts shortly after this layer; poll briefly if needed.
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

  // Click-to-lock handler attached to the whole backdrop (so it works even
  // before the canvas captures clicks). We only request lock when no
  // menu/panel is open and the click target isn't an interactive UI element.
  const requestLock = (e: React.MouseEvent) => {
    if (panelOpen || menuOpen) return;
    const target = e.target as HTMLElement;
    // Don't steal clicks on buttons/links/inputs
    if (target.closest("button, a, input, [role=dialog]")) return;
    const c = canvasRef.current;
    if (!c) return;
    // Pointer lock may throw if not triggered by a user gesture — but this
    // IS a click handler, so it's fine.
    const p = c.requestPointerLock?.();
    // Some browsers return a Promise; surface rejections as "denied".
    if (p && typeof (p as Promise<void>).catch === "function") {
      (p as Promise<void>).catch(() => setPointerLockDenied(true));
    }
  };

  // Fallback drag-look for when pointer lock is denied (some browsers /
  // iframe sandboxes block it). Updates the same yaw/pitch via a custom
  // event the camera controller can read. We piggy-back on `lookRef` by
  // dispatching synthetic movement via a window event.
  const onFallbackPointerDown = (e: React.PointerEvent) => {
    if (panelOpen || menuOpen) return;
    setFallbackDrag(true);
    const start = { x: e.clientX, y: e.clientY };
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      start.x = ev.clientX;
      start.y = ev.clientY;
      // Reuse the touch-look channel by dispatching a custom event
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
      <AnimatePresence>
        {showHint && !pointerLockDenied ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex flex-col items-center gap-2 rounded-full border border-moonlight/30 bg-background/40 px-4 py-2 backdrop-blur-sm">
              <Crosshair className="size-4 text-moonlight" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-moonlight/90">
                Click to look
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {pointerLockDenied && showHint ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
