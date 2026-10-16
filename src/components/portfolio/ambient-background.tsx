"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * AmbientBackground
 *
 * A fixed full-screen atmospheric layer rendered behind all content, themed
 * for a cinematic dark-fantasy / moonlit-ruins aesthetic (Elden Ring /
 * Hollow Knight inspired):
 *
 *  - A large drifting moon with a soft multi-layer halo + god rays
 *  - Slowly drifting fog wisps (multiple layers, different speeds)
 *  - Floating embers (warm) + dust motes (cool) + fireflies (gentle pulse)
 *  - Distant mountain silhouettes for parallax depth
 *  - Subtle aurora-like color washes (violet / teal) that shift slowly
 *  - A twinkling starfield in the upper portion
 *
 * Everything is pure CSS animation (no per-frame JS) and respects
 * prefers-reduced-motion (animations become static). Particles are
 * generated only after mount (client-only) to avoid hydration mismatches.
 */
type Particle = {
  id: number;
  left: number;
  bottom: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  kind: "ember" | "dust" | "firefly";
  color: string;
  glow: string;
};

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

  // Generate particles only on the client after mount (SSR-safe).
  const particles = useMemo<Particle[]>(() => {
    if (!mounted || reduced) return [];
    const arr: Particle[] = [];
    // Warm embers (rising, orange-gold)
    for (let i = 0; i < 10; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        bottom: -8 - Math.random() * 15,
        size: 1.5 + Math.random() * 2,
        duration: 16 + Math.random() * 20,
        delay: -Math.random() * 28,
        drift: (Math.random() - 0.5) * 50,
        opacity: 0.3 + Math.random() * 0.35,
        kind: "ember",
        color: "rgba(255,170,90,1)",
        glow: "0 0 5px 1px rgba(255,160,80,0.7)",
      });
    }
    // Cool dust motes (rising slowly, silver-blue)
    for (let i = 0; i < 16; i++) {
      arr.push({
        id: 100 + i,
        left: Math.random() * 100,
        bottom: -10 - Math.random() * 20,
        size: 1 + Math.random() * 1.8,
        duration: 24 + Math.random() * 26,
        delay: -Math.random() * 40,
        drift: (Math.random() - 0.5) * 70,
        opacity: 0.15 + Math.random() * 0.3,
        kind: "dust",
        color: "rgba(190,210,235,1)",
        glow: "0 0 4px 1px rgba(155,184,214,0.5)",
      });
    }
    // Fireflies (drifting, gentle pulse, warm-yellow)
    for (let i = 0; i < 7; i++) {
      arr.push({
        id: 200 + i,
        left: 10 + Math.random() * 80,
        bottom: 15 + Math.random() * 55,
        size: 2 + Math.random() * 2,
        duration: 30 + Math.random() * 30,
        delay: -Math.random() * 30,
        drift: (Math.random() - 0.5) * 40,
        opacity: 0.4 + Math.random() * 0.4,
        kind: "firefly",
        color: "rgba(255,220,140,1)",
        glow: "0 0 7px 2px rgba(255,210,120,0.8)",
      });
    }
    return arr;
  }, [mounted, reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-background"
    >
      {/* ---- Slowly shifting gradient base ---- */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(40,44,60,0.45), transparent 60%), radial-gradient(80% 60% at 90% 100%, rgba(30,28,48,0.30), transparent 55%), radial-gradient(70% 50% at 10% 90%, rgba(28,36,46,0.25), transparent 55%)",
          animation: reduced ? undefined : "bgHue 32s ease-in-out infinite alternate",
        }}
      />

      {/* ---- Aurora-like color washes (violet / teal) ---- */}
      {!reduced ? (
        <>
          <div
            className="absolute inset-0 opacity-[0.12] mix-blend-screen"
            style={{
              background:
                "radial-gradient(60% 40% at 20% 20%, rgba(150,120,210,0.5), transparent 60%)",
              animation: "auroraA 26s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.10] mix-blend-screen"
            style={{
              background:
                "radial-gradient(55% 40% at 80% 30%, rgba(90,180,190,0.45), transparent 60%)",
              animation: "auroraB 34s ease-in-out infinite alternate",
            }}
          />
        </>
      ) : null}

      {/* ---- Twinkling starfield (upper portion) ---- */}
      {!reduced ? (
        <div
          className="absolute inset-x-0 top-0 h-[55vh] opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 12% 18%, rgba(220,228,245,0.7), transparent), radial-gradient(1px 1px at 28% 32%, rgba(200,210,235,0.5), transparent), radial-gradient(1.5px 1.5px at 47% 12%, rgba(220,228,245,0.65), transparent), radial-gradient(1px 1px at 63% 26%, rgba(190,200,225,0.5), transparent), radial-gradient(1.5px 1.5px at 78% 16%, rgba(220,228,245,0.7), transparent), radial-gradient(1px 1px at 88% 34%, rgba(200,210,235,0.45), transparent), radial-gradient(1px 1px at 8% 38%, rgba(210,220,240,0.5), transparent), radial-gradient(1px 1px at 36% 44%, rgba(200,210,235,0.4), transparent), radial-gradient(1.5px 1.5px at 72% 42%, rgba(220,228,245,0.55), transparent), radial-gradient(1px 1px at 52% 48%, rgba(210,220,240,0.45), transparent)",
            animation: "twinkle 6s ease-in-out infinite alternate",
          }}
        />
      ) : null}

      {/* ---- The Moon (drifting slowly with halo) ---- */}
      {!reduced ? (
        <div
          className="absolute"
          style={{
            top: "16%",
            left: "50%",
            width: "0",
            height: "0",
            animation: "moonDrift 60s ease-in-out infinite alternate",
          }}
        >
          {/* Outer halo */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "34vw",
              height: "34vw",
              background:
                "radial-gradient(circle, rgba(200,215,240,0.12) 0%, rgba(155,184,214,0.07) 35%, transparent 70%)",
              animation: "moonHalo 9s ease-in-out infinite alternate",
            }}
          />
          {/* Inner halo */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "20vw",
              height: "20vw",
              background:
                "radial-gradient(circle, rgba(220,230,250,0.20) 0%, rgba(180,200,230,0.12) 40%, transparent 75%)",
            }}
          />
          {/* Moon disc */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "10vw",
              height: "10vw",
              minWidth: "90px",
              minHeight: "90px",
              background:
                "radial-gradient(circle at 38% 35%, #f4f7fc 0%, #d8e2f2 45%, #a8b6d2 100%)",
              boxShadow: "0 0 50px 10px rgba(200,215,240,0.4), inset -8px -8px 18px rgba(120,140,170,0.45)",
            }}
          />
          {/* God rays (soft light shafts downward) */}
          <div
            className="absolute -translate-x-1/2"
            style={{
              top: "0",
              width: "30vw",
              height: "80vh",
              background:
                "linear-gradient(180deg, rgba(200,215,240,0.10) 0%, rgba(180,200,230,0.06) 30%, transparent 70%)",
              clipPath: "polygon(45% 0, 55% 0, 75% 100%, 25% 100%)",
              filter: "blur(20px)",
              animation: "godRays 12s ease-in-out infinite alternate",
            }}
          />
        </div>
      ) : null}

      {/* ---- Distant mountain silhouettes (parallax) ---- */}
      {!reduced ? (
        <div
          className="absolute inset-x-0 bottom-0 h-[35vh] opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 30% 100% at 15% 100%, rgba(20,24,32,0.7), transparent 70%), radial-gradient(ellipse 40% 100% at 45% 100%, rgba(24,28,38,0.6), transparent 70%), radial-gradient(ellipse 35% 100% at 78% 100%, rgba(20,26,36,0.65), transparent 70%)",
            animation: "mountainParallax 80s ease-in-out infinite alternate",
          }}
        />
      ) : null}

      {/* ---- Drifting fog wisps (three layers) ---- */}
      {!reduced ? (
        <>
          <div
            className="absolute inset-x-0 top-[10%] h-[35vh] opacity-[0.30]"
            style={{
              background:
                "radial-gradient(50% 80% at 25% 60%, rgba(120,140,170,0.14), transparent 70%), radial-gradient(45% 80% at 70% 50%, rgba(140,120,170,0.10), transparent 70%)",
              animation: "fogDriftA 48s linear infinite",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[40vh] opacity-[0.32]"
            style={{
              background:
                "radial-gradient(60% 90% at 60% 100%, rgba(100,120,150,0.14), transparent 70%), radial-gradient(40% 90% at 20% 100%, rgba(130,110,160,0.10), transparent 70%)",
              animation: "fogDriftB 64s linear infinite",
            }}
          />
          <div
            className="absolute inset-x-0 top-[45%] h-[25vh] opacity-[0.18]"
            style={{
              background:
                "radial-gradient(45% 70% at 50% 50%, rgba(150,160,190,0.10), transparent 70%)",
              animation: "fogDriftC 90s linear infinite",
            }}
          />
        </>
      ) : null}

      {/* ---- Pulsing moonlight glow (ambient fill) ---- */}
      <div
        className="absolute left-1/2 top-[18%] size-[55vw] -translate-x-1/2 rounded-full bg-moonlight/[0.05] blur-[120px]"
        style={{ animation: reduced ? undefined : "moonPulse 8s ease-in-out infinite" }}
      />

      {/* ---- Particles (embers, dust, fireflies) ---- */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: p.glow,
            opacity: p.opacity,
            animation:
              p.kind === "firefly"
                ? `fireflyDrift ${p.duration}s ease-in-out ${p.delay}s infinite, emberRise ${p.duration * 1.5}s linear ${p.delay}s infinite`
                : `emberRise ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as any]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
