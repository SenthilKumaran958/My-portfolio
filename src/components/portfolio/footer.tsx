"use client";

import { Github, Gamepad2, Linkedin, Mail, ArrowUp } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

const NAV = [
  { label: "Shadow Blade", href: "#shadow-blade" },
  { label: "Environment Art", href: "#environment-art" },
  { label: "Level Design", href: "#level-design" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL = [
  { label: "GitHub", href: profile.links.github, icon: Github },
  { label: "Itch.io", href: profile.links.itch, icon: Gamepad2 },
  { label: "LinkedIn", href: profile.links.linkedin, icon: Linkedin },
  { label: "Email", href: `mailto:${profile.links.email}`, icon: Mail },
];

export function Footer() {
  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-auto border-t border-border/60 bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-moonlight/30 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <button
              onClick={scrollTop}
              className="group flex items-center gap-3"
              aria-label="Back to top"
            >
              <span
                aria-hidden
                className="flex size-10 items-center justify-center rounded border border-moonlight/40 text-moonlight transition-colors group-hover:bg-moonlight/10"
              >
                <span className="font-display text-sm">SK</span>
              </span>
              <span className="flex flex-col leading-none text-left">
                <span className="font-display text-base tracking-[0.2em] text-foreground">
                  Senthil Kumaran
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {profile.role}
                </span>
              </span>
            </button>
            <p className="mt-5 max-w-sm font-serif-body text-sm leading-relaxed text-muted-foreground">
              {profile.tagline} Building atmospheric game worlds, gameplay
              systems, and immersive environments — one finished project at a
              time.
            </p>
          </div>

          {/* Nav */}
          <nav className="md:col-span-4" aria-label="Footer">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-moonlight"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="md:col-span-3">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Connect
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.label === "Email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-moonlight"
                  >
                    <s.icon className="size-4 transition-colors group-hover:text-moonlight" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Senthil Kumaran. Built with Godot
            spirit and a lot of iteration.
          </p>
          <button
            onClick={scrollTop}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-moonlight"
          >
            <span className="flex size-7 items-center justify-center rounded-full border border-border/70">
              <ArrowUp className="size-3.5" />
            </span>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
