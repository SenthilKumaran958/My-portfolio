"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Shadow Blade", href: "#shadow-blade" },
  { label: "Environment Art", href: "#environment-art" },
  { label: "Unreal Engine", href: "#unreal-environments" },
  { label: "Level Design", href: "#level-design" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["hero", ...NAV_LINKS.map((l) => l.href.slice(1))];
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(`#${id}`);
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
          : "border-b border-transparent bg-gradient-to-b from-ink/90 via-ink/70 to-transparent backdrop-blur-sm",
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <button
          onClick={() => handleNav("#hero")}
          className="group flex items-center gap-3"
          aria-label="Senthil Kumaran — home"
        >
          <span
            aria-hidden
            className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-moonlight/40 transition-shadow group-hover:ring-moonlight/70"
          >
            <Image
              src="/images/senthil-portrait.jpeg"
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </span>
          <span className="hidden font-display text-base font-semibold tracking-[0.2em] text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:inline">
            Senthil Kumaran
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className={cn(
                    "relative px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
                    isActive
                      ? "text-moonlight"
                      : "text-foreground/80 hover:text-moonlight",
                  )}
                >
                  {link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-px h-px bg-moonlight/70"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Button
            size="sm"
            onClick={() => handleNav("#contact")}
            className="border-moonlight/30 bg-moonlight/10 text-moonlight hover:bg-moonlight/20 hover:text-moonlight"
          >
            Get in touch
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-border/70 text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className={cn(
                      "w-full rounded-md px-3 py-3 text-left text-sm uppercase tracking-[0.18em] transition-colors",
                      active === link.href
                        ? "bg-moonlight/10 text-moonlight"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
