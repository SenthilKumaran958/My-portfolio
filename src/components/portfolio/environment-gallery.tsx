"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Layers, Target, Hammer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SectionHeading } from "./section-heading";
import {
  artworks,
  environmentCategories,
  type Artwork,
} from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const KIND_STYLES: Record<Artwork["kind"], string> = {
  Experiment: "border-moonlight/40 bg-moonlight/10 text-moonlight/90",
  Concept: "border-violet/40 bg-violet/15 text-violet/90",
  Blockout: "border-foreground/30 bg-foreground/10 text-foreground/80",
  "Finished Environment": "border-emerald-400/30 bg-emerald-400/10 text-emerald-300/90",
};

export function EnvironmentGallery() {
  const [active, setActive] = useState<string>("all");
  const [selected, setSelected] = useState<Artwork | null>(null);

  const filtered = useMemo(() => {
    if (active === "all") return artworks;
    return artworks.filter((a) => a.category === active);
  }, [active]);

  return (
    <section
      id="environment-art"
      className="relative scroll-mt-16 bg-card/20 py-24 sm:py-28 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-card/10 to-background"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Environment Art"
          title="Worlds in Progress"
          intro="A working gallery of environment studies and experiments. Each piece is labeled honestly — concept studies and AI-assisted references are clearly marked as such, never presented as finished environments I modeled myself. These are works in progress as I build my environment art skills."
        />

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap gap-2">
          <FilterChip
            label="All Work"
            active={active === "all"}
            onClick={() => setActive("all")}
          />
          {environmentCategories.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label.split("&")[0].trim()}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>

        {/* Active category description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-4 max-w-3xl font-serif-body text-muted-foreground"
          >
            {active === "all"
              ? "Showing all environment work. Filter by category to focus on a specific area."
              : environmentCategories.find((c) => c.id === active)?.description}
          </motion.p>
        </AnimatePresence>

        {/* Gallery grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((art, i) => (
              <motion.article
                key={art.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                className="group surface relative flex flex-col overflow-hidden bg-card/70"
              >
                <button
                  onClick={() => setSelected(art)}
                  className="relative block aspect-[4/3] w-full overflow-hidden text-left"
                  aria-label={`View details for ${art.title}`}
                >
                  <Image
                    src={art.image}
                    alt={art.description}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground backdrop-blur-sm transition-colors group-hover:text-moonlight">
                    <ArrowUpRight className="size-4" />
                  </span>
                  <span
                    className={cn(
                      "absolute left-3 top-3 inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] backdrop-blur-sm",
                      KIND_STYLES[art.kind],
                    )}
                  >
                    {art.kind}
                  </span>
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg tracking-wide text-foreground">
                    {art.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {art.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {art.software.map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="border-border/70 font-normal text-muted-foreground"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelected(art)}
                    className="mt-5 inline-flex items-center gap-1.5 self-start text-xs uppercase tracking-[0.18em] text-moonlight/80 transition-colors hover:text-moonlight"
                  >
                    View Breakdown
                    <ArrowUpRight className="size-3" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Honesty note */}
        <p className="mt-10 max-w-3xl border-l-2 border-violet/40 pl-4 font-serif-body text-sm italic text-muted-foreground">
          Note: Concept pieces are AI-assisted explorations used as reference and mood
          studies, not finished environments I personally modeled. Finished environments
          and blockouts are my own 3D work. Labels on each piece reflect this honestly.
        </p>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-4xl border-border/70 bg-card p-0">
          <DialogTitle className="sr-only">{selected?.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed breakdown of {selected?.title}.
          </DialogDescription>
          {selected ? (
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
                <Image
                  src={selected.image}
                  alt={selected.description}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="max-h-[60vh] overflow-y-auto nice-scroll p-6">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em]",
                    KIND_STYLES[selected.kind],
                  )}
                >
                  {selected.kind}
                </span>
                <h3 className="mt-3 font-display text-2xl tracking-wide text-foreground">
                  {selected.title}
                </h3>
                <p className="mt-3 font-serif-body text-muted-foreground">
                  {selected.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {selected.software.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="border-border/70 font-normal text-muted-foreground"
                    >
                      <Layers className="mr-1 size-3" />
                      {s}
                    </Badge>
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-moonlight/80">
                    <Target className="size-3.5" /> Artistic Goals
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {selected.goals}
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-moonlight/80">
                    <Hammer className="size-3.5" /> Development Breakdown
                  </h4>
                  <ol className="mt-3 space-y-2">
                    {selected.breakdown.map((step, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="font-display text-moonlight/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-all",
        active
          ? "border-moonlight/50 bg-moonlight/15 text-moonlight"
          : "border-border/70 bg-background/30 text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
