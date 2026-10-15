"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { levelDesign } from "@/lib/portfolio-data";

export function LevelDesign() {
  return (
    <section id="level-design" className="relative scroll-mt-16 py-24 sm:py-28 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background to-card/10"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Level Design"
          title="Designing Playable Spaces"
          intro={levelDesign.intro}
        />

        {/* Before / After comparison */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <BeforeAfterSlider
              beforeSrc={levelDesign.blockoutImage}
              afterSrc={levelDesign.finishedImage}
              beforeAlt="Greybox blockout of a level showing plain geometric layout of platforms, stairs and paths"
              afterAlt="Finished version of the same level with detailed ancient stone environment, lighting and atmosphere"
            />
          </motion.div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <p className="surface p-4 text-sm text-muted-foreground">
              <span className="font-display text-xs uppercase tracking-[0.2em] text-foreground">
                Before — Blockout
              </span>
              <br />
              Plain geometry testing the player path, scale, and framing before any art is made.
            </p>
            <p className="surface p-4 text-sm text-muted-foreground">
              <span className="font-display text-xs uppercase tracking-[0.2em] text-foreground">
                After — Finished Scene
              </span>
              <br />
              Art, lighting, and atmosphere layered on without changing the underlying gameplay geometry.
            </p>
          </div>
        </div>

        {/* Principles grid */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {levelDesign.principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06 }}
              className="bg-card/70 p-6 transition-colors hover:bg-card"
            >
              <span className="font-display text-xs text-moonlight/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg tracking-wide text-foreground">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] w-full select-none overflow-hidden rounded-xl border border-border/70 bg-card"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      {/* After (full) */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(max-width: 1280px) 100vw, 1152px"
        className="object-cover"
      />
      {/* Before (clipped via clip-path so it keeps full container width) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="(max-width: 1280px) 100vw, 1152px"
          className="object-cover"
        />
      </div>

      {/* Labels */}
      <span className="absolute left-4 top-4 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">
        Blockout
      </span>
      <span className="absolute right-4 top-4 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">
        Finished
      </span>

      {/* Divider handle */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-moonlight/80"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-moonlight/60 bg-background/80 text-moonlight backdrop-blur-sm">
          <MoveHorizontal className="size-4" />
        </div>
      </div>
    </div>
  );
}
