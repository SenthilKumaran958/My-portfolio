"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Code2,
  Youtube,
  Gamepad2,
  Cpu,
  FileCode2,
  Sparkles,
  Lock,
  ArrowUpRight,
  Layers,
  Target,
  Hammer,
  MoveHorizontal,
  Cpu as CpuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  featuredProject,
  artworks,
  environmentCategories,
  levelDesign,
  type Artwork,
  type DestinationId,
} from "@/lib/portfolio-data";
import { useExperience } from "@/store/experience";
import { cn } from "@/lib/utils";

const KIND_STYLES: Record<Artwork["kind"], string> = {
  Experiment: "border-moonlight/40 bg-moonlight/10 text-moonlight/90",
  Concept: "border-violet/40 bg-violet/15 text-violet/90",
  Blockout: "border-foreground/30 bg-foreground/10 text-foreground/80",
  "Finished Environment":
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-300/90",
};

const DEST_META: Record<DestinationId, { name: string; eyebrow: string }> = {
  "game-development": {
    name: "Game Development",
    eyebrow: "Destination I",
  },
  "environment-art": {
    name: "Environment Art",
    eyebrow: "Destination II",
  },
  "level-design": {
    name: "Level Design",
    eyebrow: "Destination III",
  },
};

export function DestinationPanel() {
  const panelOpen = useExperience((s) => s.panelOpen);
  const active = useExperience((s) => s.activeDestination);
  const closePanel = useExperience((s) => s.closePanel);

  return (
    <Dialog open={panelOpen} onOpenChange={(v) => !v && closePanel()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto nice-scroll border-border/70 bg-background/95 p-0 backdrop-blur-xl sm:max-w-4xl">
        <DialogTitle className="sr-only">
          {active ? DEST_META[active].name : "Destination"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Detailed project content for this destination.
        </DialogDescription>
        {active ? (
          <div className="relative">
            {/* Close affordance */}
            <button
              onClick={closePanel}
              className="absolute right-4 top-4 z-20 inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-moonlight/50 hover:text-moonlight"
              aria-label="Close destination panel"
            >
              <X className="size-4" />
            </button>
            {active === "game-development" ? <GameDevPanel /> : null}
            {active === "environment-art" ? <EnvArtPanel /> : null}
            {active === "level-design" ? <LevelDesignPanel /> : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- Game Development -------------------- */
function GameDevPanel() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const meta = DEST_META["game-development"];
  return (
    <div>
      {/* Cover */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={featuredProject.cover}
          alt={featuredProject.screenshots[0]?.alt ?? "Shadow Blade cover"}
          fill
          sizes="(max-width: 768px) 100vw, 64vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8">
          <span className="eyebrow text-moonlight/80">{meta.eyebrow}</span>
          <h2 className="mt-2 font-display text-3xl tracking-wide text-foreground sm:text-4xl">
            {featuredProject.title}
          </h2>
          <p className="mt-1 font-serif-body text-muted-foreground">
            {featuredProject.subtitle} · {featuredProject.engine}
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="font-serif-body text-lg leading-relaxed text-muted-foreground">
          {featuredProject.overview}
        </p>

        {/* Meta + links */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <dl className="surface divide-y divide-border/60 p-4">
            <Row icon={<Cpu className="size-4" />} label="Engine" value={featuredProject.engine} />
            <Row icon={<FileCode2 className="size-4" />} label="Language" value={featuredProject.language} />
            <Row icon={<Gamepad2 className="size-4" />} label="Genre" value={featuredProject.genre} />
            <Row icon={<Sparkles className="size-4" />} label="Status" value={featuredProject.status} />
          </dl>
          <div className="flex flex-col gap-3">
            <ProjBtn icon={<Play className="size-4" />} label={featuredProject.links.play.label} href={featuredProject.links.play.href} available={featuredProject.links.play.available} primary />
            <ProjBtn icon={<Code2 className="size-4" />} label={featuredProject.links.source.label} href={featuredProject.links.source.href} available={featuredProject.links.source.available} />
            <ProjBtn icon={<Youtube className="size-4" />} label={featuredProject.links.gameplay.label} href={featuredProject.links.gameplay.href} available={featuredProject.links.gameplay.available} />
          </div>
        </div>

        {/* Screenshots */}
        <h3 className="mt-10 font-display text-xl tracking-wide text-foreground">Gameplay</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {featuredProject.screenshots.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setLightbox(i)}
              className="group relative aspect-video overflow-hidden rounded-lg border border-border/70 bg-card"
              aria-label={`Open screenshot: ${s.caption}`}
            >
              <Image src={s.src} alt={s.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <span className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground">
                <ArrowUpRight className="size-3.5" />
              </span>
              <p className="absolute inset-x-0 bottom-0 p-3 text-xs text-foreground/90">{s.caption}</p>
            </button>
          ))}
        </div>

        {/* Breakdowns */}
        <h3 className="mt-10 font-display text-xl tracking-wide text-foreground">Project Breakdown</h3>
        <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/60 sm:grid-cols-2">
          {featuredProject.breakdowns.map((b, i) => (
            <div key={b.title} className="bg-card/70 p-5">
              <div className="flex items-center gap-2">
                <span className="font-display text-xs text-moonlight/70">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="font-display text-base tracking-wide text-foreground">{b.title}</h4>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </div>

      <Lightbox open={lightbox !== null} index={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}

/* -------------------- Environment Art -------------------- */
function EnvArtPanel() {
  const [filter, setFilter] = useState<string>("all");
  const [detail, setDetail] = useState<Artwork | null>(null);
  const meta = DEST_META["environment-art"];
  const filtered = filter === "all" ? artworks : artworks.filter((a) => a.category === filter);
  return (
    <div>
      <div className="relative h-44 w-full overflow-hidden sm:h-56">
        <Image src={artworks[0].image} alt="Environment art showcase" fill sizes="(max-width: 768px) 100vw, 64vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8">
          <span className="eyebrow text-violet/90">{meta.eyebrow}</span>
          <h2 className="mt-2 font-display text-3xl tracking-wide text-foreground sm:text-4xl">Worlds in Progress</h2>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="font-serif-body text-lg leading-relaxed text-muted-foreground">
          A working gallery of environment studies and experiments. Each piece is labeled
          honestly — AI-assisted concept references are clearly marked, never presented as
          finished environments I modeled myself.
        </p>

        {/* Filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip label="All Work" active={filter === "all"} onClick={() => setFilter("all")} />
          {environmentCategories.map((c) => (
            <Chip key={c.id} label={c.label.split("&")[0].trim()} active={filter === c.id} onClick={() => setFilter(c.id)} />
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => setDetail(a)}
              className="group surface relative flex flex-col overflow-hidden bg-card/70 text-left"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image src={a.image} alt={a.description} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className={cn("absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] backdrop-blur-sm", KIND_STYLES[a.kind])}>{a.kind}</span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg tracking-wide text-foreground">{a.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.software.map((s) => (
                    <Badge key={s} variant="outline" className="border-border/70 font-normal text-muted-foreground">{s}</Badge>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 border-l-2 border-violet/40 pl-4 font-serif-body text-sm italic text-muted-foreground">
          Concept pieces are AI-assisted explorations used as reference, not finished
          environments I personally modeled. Finished environments and blockouts are my own 3D work.
        </p>
      </div>

      <EnvDetailDialog art={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function EnvDetailDialog({ art, onClose }: { art: Artwork | null; onClose: () => void }) {
  return (
    <Dialog open={!!art} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl border-border/70 bg-card p-0">
        <DialogTitle className="sr-only">{art?.title}</DialogTitle>
        <DialogDescription className="sr-only">Detailed breakdown</DialogDescription>
        {art ? (
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
              <Image src={art.image} alt={art.description} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="max-h-[60vh] overflow-y-auto nice-scroll p-6">
              <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em]", KIND_STYLES[art.kind])}>{art.kind}</span>
              <h3 className="mt-3 font-display text-2xl tracking-wide text-foreground">{art.title}</h3>
              <p className="mt-2 font-serif-body text-muted-foreground">{art.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {art.software.map((s) => (
                  <Badge key={s} variant="outline" className="border-border/70 font-normal text-muted-foreground"><Layers className="mr-1 size-3" />{s}</Badge>
                ))}
              </div>
              <div className="mt-5">
                <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-moonlight/80"><Target className="size-3.5" /> Goals</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{art.goals}</p>
              </div>
              <div className="mt-5">
                <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-moonlight/80"><Hammer className="size-3.5" /> Breakdown</h4>
                <ol className="mt-3 space-y-2">
                  {art.breakdown.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-display text-moonlight/70">{String(i + 1).padStart(2, "0")}</span>
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
  );
}

/* -------------------- Level Design -------------------- */
function LevelDesignPanel() {
  const meta = DEST_META["level-design"];
  return (
    <div>
      <div className="relative h-44 w-full overflow-hidden sm:h-56">
        <Image src={levelDesign.finishedImage} alt="Finished level environment" fill sizes="(max-width: 768px) 100vw, 64vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8">
          <span className="eyebrow text-emerald-300/80">{meta.eyebrow}</span>
          <h2 className="mt-2 font-display text-3xl tracking-wide text-foreground sm:text-4xl">Designing Playable Spaces</h2>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="font-serif-body text-lg leading-relaxed text-muted-foreground">{levelDesign.intro}</p>

        <h3 className="mt-8 flex items-center gap-2 font-display text-lg tracking-wide text-foreground">
          <MoveHorizontal className="size-4 text-moonlight" /> Before & After
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <BeforeCard src={levelDesign.blockoutImage} label="Blockout" alt="Greybox blockout layout" />
          <BeforeCard src={levelDesign.finishedImage} label="Finished Scene" alt="Finished scene with environment art" />
        </div>

        <h3 className="mt-8 font-display text-lg tracking-wide text-foreground">Design Principles</h3>
        <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/60 sm:grid-cols-2">
          {levelDesign.principles.map((p, i) => (
            <div key={p.title} className="bg-card/70 p-5">
              <span className="font-display text-xs text-moonlight/70">{String(i + 1).padStart(2, "0")}</span>
              <h4 className="mt-1 font-display text-base tracking-wide text-foreground">{p.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Shared bits -------------------- */
function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-moonlight/70">{icon}</span>
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function ProjBtn({ icon, label, href, available, primary }: { icon: React.ReactNode; label: string; href: string; available: boolean; primary?: boolean }) {
  const disabled = !available || href === "#";
  return (
    <Button asChild={!disabled} disabled={disabled} size="lg" variant={primary ? "default" : "outline"} className={cn("w-full justify-between", primary ? "bg-moonlight text-background hover:bg-moonlight/90" : "border-border/70 bg-background/40 text-foreground hover:border-moonlight/50 hover:text-moonlight", disabled && "opacity-60")}>
      <a href={disabled ? undefined : href} target="_blank" rel="noopener noreferrer">
        <span className="flex items-center gap-2">{disabled ? <Lock className="size-4" /> : icon}{label}</span>
        {!available ? <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">Coming soon</span> : <ArrowUpRight className="size-4" />}
      </a>
    </Button>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.15em] transition-all", active ? "border-moonlight/50 bg-moonlight/15 text-moonlight" : "border-border/70 bg-background/30 text-muted-foreground hover:border-border hover:text-foreground")}>{label}</button>
  );
}

function BeforeCard({ src, label, alt }: { src: string; label: string; alt: string }) {
  return (
    <figure className="surface overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image src={src} alt={alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">{label}</span>
      </div>
    </figure>
  );
}

function Lightbox({ open, index, onClose }: { open: boolean; index: number | null; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl border-border/70 bg-card p-2">
        <DialogTitle className="sr-only">Screenshot</DialogTitle>
        <DialogDescription className="sr-only">Enlarged gameplay screenshot</DialogDescription>
        {index !== null ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-background">
            <Image src={featuredProject.screenshots[index].src} alt={featuredProject.screenshots[index].alt} fill sizes="(max-width: 1024px) 100vw, 80vw" className="object-cover" />
            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 text-sm text-foreground/90">{featuredProject.screenshots[index].caption}</p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
