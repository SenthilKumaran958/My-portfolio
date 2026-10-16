"use client";

import { motion } from "framer-motion";
import { Check, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "./section-heading";
import { skillGroups } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

export function Skills() {
  return (
    <section
      id="skills"
      className="relative scroll-mt-16 bg-card/20 py-24 sm:py-28 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-card/10 to-background"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Technical Skills"
          title="Tools I Actually Use"
          intro="Listed honestly — no fake proficiency bars or invented experience levels. Each skill is something I've really used or am actively learning. Production-ready skills are in shipped work; learning skills are in progress."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, gi) => {
            const learning = group.level === "Actively learning";
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (gi % 2) * 0.08 }}
                className="surface flex flex-col p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl tracking-wide text-foreground">
                    {group.title}
                  </h3>
                  <Badge
                    className={cn(
                      "shrink-0 border",
                      learning
                        ? "border-violet/40 bg-violet/15 text-violet/90"
                        : "border-moonlight/40 bg-moonlight/10 text-moonlight/90",
                    )}
                  >
                    {learning ? (
                      <>
                        <GraduationCap className="mr-1 size-3" />
                        {group.level}
                      </>
                    ) : (
                      <>
                        <Check className="mr-1 size-3" />
                        {group.level}
                      </>
                    )}
                  </Badge>
                </div>

                <ul className="mt-5 grid grid-cols-2 gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "flex items-center gap-2 rounded-md border border-border/50 bg-background/30 px-3 py-2 text-sm",
                        learning ? "text-muted-foreground" : "text-foreground/90",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          learning ? "bg-violet/60" : "bg-moonlight/70",
                        )}
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-moonlight/70" />
            Production-ready — used in shipped work
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-violet/60" />
            Actively learning — in progress, not yet production work
          </span>
        </div>
      </div>
    </section>
  );
}
