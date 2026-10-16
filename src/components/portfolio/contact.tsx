"use client";

import { motion } from "framer-motion";
import {
  Github,
  Gamepad2,
  Linkedin,
  Mail,
  FileDown,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { profile } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

export function Contact() {
  const links = [
    {
      label: "GitHub",
      handle: "SenthilKumaran958",
      href: profile.links.github,
      icon: Github,
      available: true,
    },
    {
      label: "Itch.io",
      handle: "god-arts",
      href: profile.links.itch,
      icon: Gamepad2,
      available: true,
    },
    {
      label: "LinkedIn",
      handle: "senthil-kumaran",
      href: profile.links.linkedin,
      icon: Linkedin,
      available: true,
    },
    {
      label: "Email",
      handle: profile.links.email,
      href: `mailto:${profile.links.email}`,
      icon: Mail,
      available: true,
    },
  ];

  return (
    <section id="contact" className="relative scroll-mt-16 py-24 sm:py-28 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background to-card/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[50vw] -translate-x-1/2 rounded-full bg-moonlight/5 blur-[120px]"
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's Build Something"
          intro="I'm open to collaboration, feedback, and opportunities in gameplay programming, level design, and environment creation. The links below are placeholders — replace them with your real handles and contact details."
          align="center"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group surface flex items-center justify-between gap-4 p-5 transition-colors hover:border-moonlight/40 hover:bg-card"
            >
              <span className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-lg border border-border/70 bg-background/40 text-muted-foreground transition-colors group-hover:border-moonlight/40 group-hover:text-moonlight">
                  <link.icon className="size-5" />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-base tracking-wide text-foreground">
                    {link.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {link.handle}
                  </span>
                </span>
              </span>
              <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-moonlight" />
            </motion.a>
          ))}
        </div>

        {/* Resume */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className={cn(
            "mt-4 surface flex items-center justify-between gap-4 p-5",
            !profile.links.resumeAvailable && "opacity-70",
          )}
        >
          <span className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-lg border border-border/70 bg-background/40 text-muted-foreground">
              {profile.links.resumeAvailable ? (
                <FileDown className="size-5" />
              ) : (
                <Lock className="size-5" />
              )}
            </span>
            <span className="flex flex-col">
              <span className="font-display text-base tracking-wide text-foreground">
                Download Resume
              </span>
              <span className="text-xs text-muted-foreground">
                {profile.links.resumeAvailable
                  ? "PDF · available"
                  : "Coming soon — add /public/resume.pdf to enable"}
              </span>
            </span>
          </span>
          {profile.links.resumeAvailable ? (
            <a
              href={profile.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border/70 text-moonlight transition-colors hover:border-moonlight/40"
              aria-label="Download resume"
            >
              <FileDown className="size-5" />
            </a>
          ) : (
            <span className="inline-flex items-center rounded-full border border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Not available
            </span>
          )}
        </motion.div>

        <p className="mt-10 text-center font-serif-body text-sm italic text-muted-foreground">
          Replace the placeholder links above with your real GitHub, Itch.io,
          LinkedIn, email, and resume.
        </p>
      </div>
    </section>
  );
}
