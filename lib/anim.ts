"use client";

/**
 * Tiny anime.js v4 helper layer. Every file that uses anime.js should
 * go through here so that:
 *   - The reduced-motion check is centralized.
 *   - The same easings, durations, and stagger timings are reused.
 *   - Components don't duplicate IntersectionObserver boilerplate.
 *
 * All helpers are safe to call during effects — they no-op on the server
 * and when the user prefers reduced motion.
 */

import { animate, stagger, type TargetsParam } from "animejs";

/* ---------- Shared tokens ---------- */

export const EASE = {
  outExpo: "outExpo",
  outQuint: "outQuint",
  inOutQuint: "inOutQuint",
  outBack: "outBack(1.4)",
} as const;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Hero: staggered headline entrance ---------- */

/**
 * Animates a collection of elements into place with a staggered slide-up.
 * Pass a CSS selector scoped to a ref'd container, or an array of elements.
 */
export function revealStagger(
  targets: TargetsParam,
  options: { delay?: number; duration?: number; stagger?: number } = {},
) {
  if (prefersReducedMotion()) return;
  return animate(targets, {
    y: [36, 0],
    opacity: [0, 1],
    duration: options.duration ?? 900,
    delay: stagger(options.stagger ?? 90, { start: options.delay ?? 0 }),
    ease: EASE.outExpo,
  });
}

/* ---------- Timeline: expand/collapse a node body ---------- */

export function expandNode(target: TargetsParam) {
  if (prefersReducedMotion()) return;
  return animate(target, {
    opacity: [0, 1],
    y: [-8, 0],
    duration: 420,
    ease: EASE.outQuint,
  });
}

/* ---------- Card hover: subtle lift ---------- */

export function cardHoverIn(target: TargetsParam) {
  if (prefersReducedMotion()) return;
  return animate(target, {
    y: -4,
    duration: 280,
    ease: EASE.outExpo,
  });
}

export function cardHoverOut(target: TargetsParam) {
  if (prefersReducedMotion()) return;
  return animate(target, {
    y: 0,
    duration: 280,
    ease: EASE.outExpo,
  });
}

/* ---------- Scroll reveal ---------- */

/**
 * Sets up an IntersectionObserver that plays `revealStagger` on the
 * matching elements the first time they enter the viewport.
 *
 * Usage in a 'use client' component:
 *   useEffect(() => installScrollReveal('.reveal'), []);
 */
export function installScrollReveal(selector = ".reveal") {
  if (typeof window === "undefined") return () => {};
  if (prefersReducedMotion()) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.add("is-visible");
    });
    return () => {};
  }

  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (els.length === 0) return () => {};

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add("is-visible");
        // One-shot: stop observing once revealed
        obs.unobserve(el);
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -60px 0px" },
  );

  els.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}
