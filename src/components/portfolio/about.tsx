"use client";

import { motion } from "framer-motion";
import { Compass, Hammer, Map } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { about, profile } from "@/lib/portfolio-data";

const PILLARS = [
  {
    icon: Hammer,
    title: "Learn by building",
    body: "I learn by shipping real projects, not by collecting tutorials. Every finished mechanic teaches more than a dozen half-read articles.",
  },
  {
    icon: Compass,
    title: "Solve technical problems",
    body: "Collision bugs, input timing, fog density — I dig into the actual problem, document what I tried, and keep the fix that holds up.",
  },
  {
    icon: Map,
    title: "Iterate on direction",
    body: "I experiment with visual storytelling and rebuild what doesn't land. My long-term direction sharpens with each project I finish.",
  },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-16 py-24 sm:py-28 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background to-card/10"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="About Me" title="The Maker Behind The Work" />

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {/* Portrait + identity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="surface relative overflow-hidden">
              <div className="relative aspect-[4/5] w-full bg-card">
                {/* Atmospheric portrait placeholder */}
                <div className="absolute inset-0 bg-gradient-to-b from-moonlight/10 via-card to-ink/60" />
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/3 size-48 -translate-x-1/2 rounded-full bg-moonlight/10 blur-3xl"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <span
                    aria-hidden
                    className="flex size-24 items-center justify-center rounded-full border border-moonlight/40 font-display text-3xl text-moonlight"
                  >
                    SK
                  </span>
                  <span className="font-display text-xl tracking-[0.15em] text-foreground">
                    {profile.name}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {profile.role}
                  </span>
                  <p className="mt-2 max-w-xs font-serif-body text-sm italic text-muted-foreground">
                    {profile.tagline}
                  </p>
                </div>
              </div>
              <div className="border-t border-border/70 bg-background/40 p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Portrait placeholder — replace with your photo in
                  <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-foreground/80">
                    /public/images/
                  </code>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6 lg:col-span-7"
          >
            <div className="space-y-5 font-serif-body text-lg leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:leading-[0.8] first-letter:text-moonlight">
                {about.intro}
              </p>
              <p>{about.middle}</p>
              <p className="text-foreground/90">{about.direction}</p>
            </div>

            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="surface flex flex-col gap-3 p-5"
                >
                  <span className="flex size-9 items-center justify-center rounded-md border border-moonlight/30 bg-moonlight/10 text-moonlight">
                    <p.icon className="size-4" />
                  </span>
                  <h3 className="font-display text-sm tracking-wide text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
