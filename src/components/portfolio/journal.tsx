"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Bug,
  Gamepad2,
  Map as MapIcon,
  Mountain,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "./section-heading";
import { journal, type JournalEntry } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const TAG_META: Record<JournalEntry["tag"], { icon: LucideIcon; color: string }> = {
  Gameplay: { icon: Gamepad2, color: "text-moonlight" },
  Bug: { icon: Bug, color: "text-rose-300" },
  "Level Design": { icon: MapIcon, color: "text-moonlight" },
  Environment: { icon: Mountain, color: "text-violet" },
  Reflection: { icon: Lightbulb, color: "text-amber-200" },
};

export function Journal() {
  return (
    <section
      id="journal"
      className="relative scroll-mt-16 bg-card/20 py-24 sm:py-28 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-card/10 to-background"
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Development Journal"
          title="How I Actually Work"
          intro="Short, honest breakdowns of real work — the problem, the process, and the result. No polished retrospective narratives; just what happened and what I learned."
          align="center"
        />

        <div className="mt-12 flex flex-col gap-4">
          {journal.map((entry, i) => (
            <JournalCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function JournalCard({ entry, index }: { entry: JournalEntry; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const meta = TAG_META[entry.tag];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      className="surface overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-card/40"
        aria-expanded={open}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background/40">
          <meta.icon className={cn("size-5", meta.color)} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-border/70 text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
            >
              {entry.tag}
            </Badge>
            <time className="text-xs text-muted-foreground">{entry.date}</time>
          </div>
          <h3 className="mt-1.5 font-display text-lg tracking-wide text-foreground">
            {entry.title}
          </h3>
        </div>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180 text-moonlight",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/60 px-5 py-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <JournalPart label="Problem" body={entry.problem} accent="text-rose-300/80" />
                <JournalPart label="Process" body={entry.process} accent="text-moonlight/80" />
                <JournalPart label="Result" body={entry.result} accent="text-violet/80" />
              </div>

              {entry.code ? (
                <div className="mt-5">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Code · {entry.code.language}
                  </p>
                  <pre className="nice-scroll overflow-x-auto rounded-lg border border-border/70 bg-ink/60 p-4 text-xs leading-relaxed text-foreground/90">
                    <code>{entry.code.snippet}</code>
                  </pre>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

function JournalPart({
  label,
  body,
  accent,
}: {
  label: string;
  body: string;
  accent: string;
}) {
  return (
    <div>
      <h4 className={cn("text-[10px] uppercase tracking-[0.2em]", accent)}>
        {label}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
