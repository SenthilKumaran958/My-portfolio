"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * AmbientBackground
 *
 * A fixed full-screen atmospheric layer rendered behind all content:
 *  - A deep gradient base that slowly shifts hue (very subtle)
 *  - Two drifting fog bands that scroll horizontally at different speeds
 *  - Floating ember/dust particles that rise slowly and fade
 *  - A soft moonlight glow that pulses gently
 *
 * Everything is pure CSS animation (no JS per-frame work) and respects
 * prefers-reduced-motion (animations become static). Designed to feel
 * like the portfolio is alive without distracting from the content.
 *
 * Particles are generated only after mount (client-only) to avoid
 * hydration mismatches from Math.random() differing between SSR + client.
 */
export function AmbientBackground() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Stable random particle positions — generated ONCE on the client only,
  // after mount, so SSR and client render the same (empty) particle set.
  const particles = useMemo(() => {
    if (!mounted || reduced) return [];
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      bottom: -10 - Math.random() * 20,
      size: 1 + Math.random() * 2.5,
      duration: 18 + Math.random() * 22,
      delay: -Math.random() * 30,
      drift: (Math.random() - 0.5) * 60,
      opacity: 0.2 + Math.random() * 0.4,
    }));
  }, [mounted, reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-background"
    >
      {/* Slowly shifting gradient base */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(40,44,60,0.45), transparent 60%), radial-gradient(80% 60% at 90% 100%, rgba(30,28,48,0.30), transparent 55%), radial-gradient(70% 50% at 10% 90%, rgba(28,36,46,0.25), transparent 55%)",
          animation: reduced ? undefined : "bgHue 32s ease-in-out infinite alternate",
        }}
      />

      {/* Drifting fog bands (two layers, different speeds/directions) */}
      {!reduced ? (
        <>
          <div
            className="absolute inset-x-0 top-0 h-[40vh] opacity-[0.35]"
            style={{
              background:
                "radial-gradient(60% 100% at 30% 50%, rgba(120,140,170,0.10), transparent 70%), radial-gradient(50% 100% at 70% 50%, rgba(140,120,170,0.08), transparent 70%)",
              animation: "fogDriftA 48s linear infinite",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[45vh] opacity-[0.30]"
            style={{
              background:
                "radial-gradient(70% 100% at 60% 100%, rgba(100,120,150,0.10), transparent 70%), radial-gradient(45% 100% at 20% 100%, rgba(130,110,160,0.07), transparent 70%)",
              animation: "fogDriftB 64s linear infinite",
            }}
          />
        </>
      ) : null}

      {/* Pulsing moonlight glow */}
      <div
        className="absolute left-1/2 top-[18%] size-[55vw] -translate-x-1/2 rounded-full bg-moonlight/[0.06] blur-[120px]"
        style={{ animation: reduced ? undefined : "moonPulse 8s ease-in-out infinite" }}
      />

      {/* Floating embers / dust */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-moonlight"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            boxShadow: "0 0 4px 1px rgba(155,184,214,0.5)",
            animation: `emberRise ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as any]: `${p.drift}px`,
          }}
        />
      ))}

      {/* Subtle starfield (top portion) */}
      {!reduced ? (
        <div
          className="absolute inset-x-0 top-0 h-[50vh] opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 12% 18%, rgba(220,228,245,0.7), transparent), radial-gradient(1px 1px at 28% 32%, rgba(200,210,235,0.5), transparent), radial-gradient(1px 1px at 47% 12%, rgba(220,228,245,0.6), transparent), radial-gradient(1px 1px at 63% 26%, rgba(190,200,225,0.5), transparent), radial-gradient(1px 1px at 78% 16%, rgba(220,228,245,0.7), transparent), radial-gradient(1px 1px at 88% 34%, rgba(200,210,235,0.45), transparent), radial-gradient(1px 1px at 8% 38%, rgba(210,220,240,0.5), transparent), radial-gradient(1px 1px at 36% 44%, rgba(200,210,235,0.4), transparent), radial-gradient(1px 1px at 72% 42%, rgba(220,228,245,0.5), transparent)",
            animation: "twinkle 6s ease-in-out infinite alternate",
          }}
        />
      ) : null}
    </div>
  );
}
