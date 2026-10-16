"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Layers,
  Target,
  Hammer,
  Box,
  Lightbulb,
  Mountain,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { ueProjects, ueSpaces, type UEProject } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const KIND_STYLES: Record<UEProject["kind"], string> = {
  Experiment: "border-moonlight/40 bg-moonlight/10 text-moonlight/90",
  "Work in Progress": "border-amber-400/40 bg-amber-400/10 text-amber-300/90",
  Completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300/90",
};

const SPACE_ICONS: Record<string, typeof Compass> = {
  "ancient-india": Compass,
  "dark-fantasy": Mountain,
  lighting: Lightbulb,
  terrain: Mountain,
  "blockout-to-final": Box,
};

/**
 * Unreal Engine Environments — a dedicated gallery showcasing UE5 + Blender
 * environment-art direction, separate from the general Environment Art
 * gallery. Each project is labeled honestly as an experiment, WIP, or
 * completed, and notes when real renders/assets have not yet been supplied.
 */
export function UnrealEnvironments() {
  const [filter, setFilter] = useState<string>("all");
  const [detail, setDetail] = useState<UEProject | null>(null);
  const filtered =
    filter === "all" ? ueProjects : ueProjects.filter((p) => p.space === filter);

  return (
    <section id="unreal-environments" className="relative scroll-mt-16 py-24 sm:py-28 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-card/10 to-background"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Unreal Engine Environments"
          title="Real-Time World Building"
          intro="A dedicated showcase for my Unreal Engine 5 and Blender environment-art direction. Each project is labeled honestly — experiments, works in progress, and completed environments. Placeholder renders are used until I supply my own; AI-assisted references are never presented as finished UE5 work I personally built."
        />

        {/* Space filters */}
        <div className="mt-10 flex flex-wrap gap-2">
          <FilterChip label="All Projects" active={filter === "all"} onClick={() => setFilter("all")} />
          {ueSpaces.map((s) => (
            <FilterChip
              key={s.id}
              label={s.label.split("&")[0].trim()}
              active={filter === s.id}
              onClick={() => setFilter(s.id)}
            />
          ))}
        </div>

        {/* Active space description */}
        <p className="mt-4 max-w-3xl font-serif-body text-muted-foreground">
          {filter === "all"
            ? "Showing all UE5 environment projects. Filter by space to focus on a specific area."
            : ueSpaces.find((s) => s.id === filter)?.description}
        </p>

        {/* Project grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const Icon = SPACE_ICONS[p.space] ?? Box;
            return (
              <button
                key={p.id}
                onClick={() => setDetail(p)}
                className="group surface relative flex flex-col overflow-hidden bg-card/70 text-left"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.shortDescription}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <span
                    className={cn(
                      "absolute left-3 top-3 inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] backdrop-blur-sm",
                      KIND_STYLES[p.kind],
                    )}
                  >
                    {p.kind}
                  </span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-foreground backdrop-blur-sm">
                    <Icon className="size-3" />
                    UE5
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg tracking-wide text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {p.shortDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.software.map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="border-border/70 font-normal text-muted-foreground"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                  {p.hasRealAssets ? null : (
                    <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-amber-300/60">
                      Placeholder render — my work in progress
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 self-start text-xs uppercase tracking-[0.18em] text-moonlight/80 transition-colors group-hover:text-moonlight">
                    View Breakdown
                    <ArrowUpRight className="size-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Honesty note */}
        <p className="mt-10 max-w-3xl border-l-2 border-violet/40 pl-4 font-serif-body text-sm italic text-muted-foreground">
          Unreal Engine 5 is a core part of my environment-art direction. The
          browser-based 3D portfolio above uses Three.js (not UE5) for the
          real-time explorable world; this section showcases my UE5 + Blender
          environment work as renders, screenshots, and breakdowns. Projects
          marked “Placeholder render” use reference imagery until I supply my
          own final renders.
        </p>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-3xl border-border/70 bg-card p-0">
          <DialogTitle className="sr-only">{detail?.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed breakdown of this Unreal Engine 5 environment project.
          </DialogDescription>
          {detail ? (
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
                <Image
                  src={detail.image}
                  alt={detail.shortDescription}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="max-h-[60vh] overflow-y-auto nice-scroll p-6">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em]",
                    KIND_STYLES[detail.kind],
                  )}
                >
                  {detail.kind}
                </span>
                <h3 className="mt-3 font-display text-2xl tracking-wide text-foreground">
                  {detail.title}
                </h3>
                <p className="mt-2 font-serif-body text-muted-foreground">
                  {detail.longDescription}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {detail.software.map((s) => (
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
                    <Hammer className="size-3.5" /> Workflow
                  </h4>
                  <ol className="mt-3 space-y-2">
                    {detail.workflow.map((step, i) => (
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
                {detail.hasRealAssets ? null : (
                  <div className="mt-5 flex items-start gap-2 rounded-md border border-amber-400/30 bg-amber-400/5 p-3 text-xs text-amber-200/80">
                    <Target className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      Placeholder render shown — this project is in progress.
                      Final screenshots, renders, and a short video will replace
                      this image when the environment is complete.
                    </span>
                  </div>
                )}
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
        "rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.15em] transition-all",
        active
          ? "border-moonlight/50 bg-moonlight/15 text-moonlight"
          : "border-border/70 bg-background/30 text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
