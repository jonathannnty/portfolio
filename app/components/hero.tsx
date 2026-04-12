"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { animate, stagger } from "animejs";
import { site } from "@/content/site";

/**
 * Hero — the first thing visitors see on the home page.
 *
 * - Ambient drifting green gradient backdrop via .hero-gradient (globals.css).
 * - Headline split into per-line elements so anime.js can stagger them in.
 * - Two floating "orb" decorations that loop subtly to add life.
 * - Everything short-circuits when prefers-reduced-motion is set.
 */
export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !rootRef.current) return;

    // Stagger the headline lines + eyebrow + subhead + CTAs
    animate(".hero-stagger", {
      y: [40, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: stagger(110, { start: 120 }),
      ease: "outExpo",
    });

    // Ambient orbs — loop with alternating direction
    animate(".hero-orb-a", {
      x: [0, 28, 0],
      y: [0, -14, 0],
      scale: [1, 1.05, 1],
      duration: 9000,
      loop: true,
      ease: "inOutQuad",
    });
    animate(".hero-orb-b", {
      x: [0, -22, 0],
      y: [0, 18, 0],
      scale: [1, 0.95, 1],
      duration: 11000,
      loop: true,
      ease: "inOutQuad",
    });
  }, []);

  return (
    <div
      ref={rootRef}
      className="hero-gradient relative overflow-hidden"
    >
      {/* Decorative orbs — purely visual, aria-hidden */}
      <div
        aria-hidden
        className="hero-orb-a pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[color:var(--color-primary-300)]/40 blur-3xl"
      />
      <div
        aria-hidden
        className="hero-orb-b pointer-events-none absolute -bottom-24 -right-10 h-96 w-96 rounded-full bg-[color:var(--color-accent)]/20 blur-3xl"
      />

      <div className="container-page relative flex min-h-[72vh] flex-col justify-center py-24 md:py-32">
        <span className="hero-stagger eyebrow opacity-0">
          Hello — I&apos;m {site.name.split(" ")[0]}
        </span>

        <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--color-fg)] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
          <span className="hero-stagger block opacity-0">{site.role}</span>
          <span className="hero-stagger block opacity-0 text-[color:var(--color-primary-700)]">
            with an eye for details.
          </span>
        </h1>

        <p className="hero-stagger mt-7 max-w-2xl text-lg leading-relaxed text-[color:var(--color-fg-muted)] opacity-0">
          {site.tagline}
        </p>

        <div className="hero-stagger mt-10 flex flex-wrap items-center gap-4 opacity-0">
          <Link href="/projects" className="btn-primary">
            See my work
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact" className="btn-ghost">
            <Mail className="h-4 w-4" />
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
