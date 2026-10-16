"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Play,
  Code2,
  Youtube,
  Gamepad2,
  Cpu,
  FileCode2,
  Sparkles,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SectionHeading } from "./section-heading";
import { featuredProject } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

export function FeaturedProject() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="shadow-blade" className="relative scroll-mt-16 py-24 sm:py-28 md:py-32">
      {/* Atmospheric backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-card/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-moonlight/30 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Project"
          title="Shadow Blade"
          intro={featuredProject.overview}
        />

        {/* Cover + meta */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <div className="group relative overflow-hidden rounded-xl border border-border/70">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-card">
                <Image
                  src={featuredProject.cover}
                  alt={featuredProject.screenshots[0]?.alt ?? "Shadow Blade cover art"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center gap-3 p-5">
                  <Badge className="border-violet/40 bg-violet/15 text-violet/90">
                    <Sparkles className="mr-1 size-3" />
                    {featuredProject.status}
                  </Badge>
                  <span className="font-display text-2xl text-foreground drop-shadow-lg sm:text-3xl">
                    {featuredProject.title}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-5 lg:col-span-4"
          >
            <dl className="surface divide-y divide-border/60 p-5">
              <MetaRow icon={<Cpu className="size-4" />} label="Engine" value={featuredProject.engine} />
              <MetaRow icon={<FileCode2 className="size-4" />} label="Language" value={featuredProject.language} />
              <MetaRow icon={<Gamepad2 className="size-4" />} label="Genre" value={featuredProject.genre} />
              <MetaRow icon={<Sparkles className="size-4" />} label="Status" value={featuredProject.status} />
            </dl>

            <div className="flex flex-col gap-3">
              <ProjectButton
                icon={<Play className="size-4" />}
                label={featuredProject.links.play.label}
                href={featuredProject.links.play.href}
                available={featuredProject.links.play.available}
                primary
              />
              <ProjectButton
                icon={<Code2 className="size-4" />}
                label={featuredProject.links.source.label}
                href={featuredProject.links.source.href}
                available={featuredProject.links.source.available}
              />
              <ProjectButton
                icon={<Youtube className="size-4" />}
                label={featuredProject.links.gameplay.label}
                href={featuredProject.links.gameplay.href}
                available={featuredProject.links.gameplay.available}
              />
            </div>
          </motion.div>
        </div>

        {/* Screenshots */}
        <div className="mt-16">
          <h3 className="font-display text-xl tracking-wide text-foreground">
            Gameplay
          </h3>
          <p className="mt-2 max-w-2xl font-serif-body text-muted-foreground">
            In-engine captures from the current development build.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featuredProject.screenshots.map((shot, i) => (
              <motion.button
                key={shot.src}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                onClick={() => setLightbox(i)}
                className="group relative aspect-video overflow-hidden rounded-lg border border-border/70 bg-card text-left"
                aria-label={`Open screenshot: ${shot.caption}`}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-sm text-foreground/90">{shot.caption}</p>
                </div>
                <span className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground backdrop-blur-sm transition-colors group-hover:text-moonlight">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Breakdowns */}
        <div className="mt-16">
          <h3 className="font-display text-xl tracking-wide text-foreground">
            Project Breakdown
          </h3>
          <p className="mt-2 max-w-2xl font-serif-body text-muted-foreground">
            How the game is built — system by system.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/60 sm:grid-cols-2">
            {featuredProject.breakdowns.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.06 }}
                className="surface group bg-card/70 p-6 transition-colors hover:bg-card"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs text-moonlight/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-display text-lg tracking-wide text-foreground">
                    {b.title}
                  </h4>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightbox !== null} onOpenChange={(v) => !v && setLightbox(null)}>
        <DialogContent className="max-w-5xl border-border/70 bg-card p-2 sm:p-3">
          <DialogTitle className="sr-only">Shadow Blade screenshot</DialogTitle>
          <DialogDescription className="sr-only">
            An enlarged gameplay screenshot from Shadow Blade.
          </DialogDescription>
          {lightbox !== null ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-background">
              <Image
                src={featuredProject.screenshots[lightbox].src}
                alt={featuredProject.screenshots[lightbox].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4">
                <p className="text-sm text-foreground/90">
                  {featuredProject.screenshots[lightbox].caption}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-moonlight/70">{icon}</span>
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function ProjectButton({
  icon,
  label,
  href,
  available,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  available: boolean;
  primary?: boolean;
}) {
  const disabled = !available || href === "#";
  return (
    <Button
      asChild={!disabled}
      disabled={disabled}
      size="lg"
      variant={primary ? "default" : "outline"}
      className={cn(
        "w-full justify-between",
        primary
          ? "bg-moonlight text-background hover:bg-moonlight/90"
          : "border-border/70 bg-background/40 text-foreground hover:border-moonlight/50 hover:text-moonlight",
        disabled && "opacity-60",
      )}
    >
      <a href={disabled ? undefined : href} target="_blank" rel="noopener noreferrer">
        <span className="flex items-center gap-2">
          {disabled ? <Lock className="size-4" /> : icon}
          {label}
        </span>
        {!available ? (
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">
            Coming soon
          </span>
        ) : (
          <ArrowUpRight className="size-4" />
        )}
      </a>
    </Button>
  );
}
