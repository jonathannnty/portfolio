"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { animate, stagger } from "animejs";
import type { Experience } from "@/content/experiences";
import ImageLightbox from "./image-lightbox";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export type ExperienceRailProps = {
  items: Experience[];
};

export default function ExperienceRail({ items }: ExperienceRailProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const prevOpenRef = useRef<string | null>(null);

  // Desktop scroll container + hint
  const scrollRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Per-item animated nodes (desktop only)
  const shellRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dotRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const entryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const bodyRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll hint: fade out on first scroll event
  useEffect(() => {
    const container = scrollRef.current;
    const hint = hintRef.current;
    if (!container || !hint) return;
    const handler = () => {
      if (prefersReducedMotion()) {
        hint.style.opacity = "0";
        hint.style.pointerEvents = "none";
      } else {
        animate(hint, { opacity: 0, duration: 400, ease: "outQuint" });
      }
    };
    container.addEventListener("scroll", handler, { once: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  // Desktop card expand / collapse animations
  useEffect(() => {
    const noAnim = prefersReducedMotion();
    const prev = prevOpenRef.current;

    // Skip on initial mount (both null)
    if (openId === null && prev === null) {
      prevOpenRef.current = openId;
      return;
    }

    /* ── Collapse previous card ── */
    if (prev && prev !== openId) {
      const shell = shellRefs.current[prev];
      const dot = dotRefs.current[prev];
      const entry = entryRefs.current[prev];
      const body = bodyRefs.current[prev];

      // Instantly hide expanded content
      if (body) {
        body.style.opacity = "0";
        const delay = noAnim ? 0 : 320;
        setTimeout(() => {
          if (!body) return;
          body.style.maxHeight = "0";
          body.style.overflow = "hidden";
          body.style.visibility = "hidden";
        }, delay);
      }

      if (noAnim) {
        if (shell) shell.style.width = "144px";
        if (entry) entry.style.marginRight = "12px";
      } else {
        if (shell) animate(shell, { width: "144px", duration: 320, ease: "inExpo" });
        if (dot) animate(dot, { scale: 1, duration: 200, ease: "outQuint" });
        if (entry) animate(entry, { marginRight: "12px", duration: 320, ease: "inExpo" });
      }
    }

    /* ── Expand new card ── */
    if (openId) {
      const shell = shellRefs.current[openId];
      const dot = dotRefs.current[openId];
      const entry = entryRefs.current[openId];
      const body = bodyRefs.current[openId];

      if (noAnim) {
        if (shell) shell.style.width = "320px";
        if (entry) entry.style.marginRight = "24px";
        if (body) {
          body.style.maxHeight = "2000px";
          body.style.overflow = "visible";
          body.style.opacity = "1";
          body.style.visibility = "visible";
          // Ensure highlight bullets are visible under reduced motion
          body.querySelectorAll<HTMLElement>(".rail-hl").forEach((el) => {
            el.style.opacity = "1";
          });
        }
      } else {
        if (shell) animate(shell, { width: "320px", duration: 420, ease: "outExpo" });
        if (dot) animate(dot, { scale: 1.25, duration: 250, ease: "outBack" });
        if (entry) animate(entry, { marginRight: "24px", duration: 420, ease: "outExpo" });
        if (body) {
          body.style.maxHeight = "2000px";
          body.style.overflow = "visible";
          body.style.visibility = "visible";
          animate(body, {
            opacity: [0, 1],
            translateY: [-6, 0],
            duration: 300,
            delay: 80,
            ease: "outQuint",
          });
          const highlights = body.querySelectorAll<HTMLElement>(".rail-hl");
          if (highlights.length > 0) {
            animate(highlights, {
              opacity: [0, 1],
              translateX: [-8, 0],
              duration: 360,
              delay: stagger(40, { start: 120 }),
              ease: "outExpo",
            });
          }
        }
      }
    }

    prevOpenRef.current = openId;
  }, [openId]);

  function toggle(id: string) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  return (
    <div>
      {/* ── Desktop: horizontal rail ── */}
      <div className="hidden md:block">
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-2"
          style={{ scrollBehavior: "smooth" }}
        >
          <div
            className="relative flex items-start px-2"
            style={{ width: "max-content" }}
          >
            {/* Rail line */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0"
              style={{
                top: "20px",
                height: "2px",
                background:
                  "linear-gradient(to right, var(--color-border), var(--color-primary-400) 40%, var(--color-border))",
              }}
            />

            {items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    entryRefs.current[item.id] = el;
                  }}
                  className="flex flex-shrink-0 flex-col items-center"
                  style={{ marginRight: "12px" }}
                >
                  {/* Dot */}
                  <span
                    ref={(el) => {
                      dotRefs.current[item.id] = el;
                    }}
                    aria-hidden
                    className={[
                      "relative z-10 flex-shrink-0 rounded-full border-2 transition-colors",
                      isOpen
                        ? "border-[color:var(--color-primary-600)] bg-[color:var(--color-primary-500)]"
                        : "border-[color:var(--color-primary-400)] bg-[color:var(--color-bg)]",
                    ].join(" ")}
                    style={{ width: "14px", height: "14px", marginTop: "13px", marginBottom: "9px" }}
                  />

                  {/* Card button */}
                  <button
                    ref={(el) => {
                      shellRefs.current[item.id] = el;
                    }}
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`exp-${item.id}`}
                    className="card cursor-pointer overflow-hidden text-left"
                    style={{
                      width: "144px",
                      padding: "12px",
                      ...(isOpen
                        ? {
                            background:
                              "linear-gradient(145deg, var(--color-primary-50) 0%, var(--color-surface) 55%)",
                          }
                        : {}),
                    }}
                  >
                    {/* Collapsed header — always visible */}
                    <p className="truncate font-mono text-[9px] font-semibold uppercase tracking-wider text-[color:var(--color-primary-600)]">
                      {item.period}
                    </p>
                    <h3 className="font-display mt-1 truncate text-xs font-bold leading-tight text-[color:var(--color-fg)]">
                      {item.role}
                    </h3>
                    <p className="mt-0.5 truncate text-[10px] text-[color:var(--color-fg-muted)]">
                      {item.company}
                    </p>

                    {/* Expanded body */}
                    <div
                      ref={(el) => {
                        bodyRefs.current[item.id] = el;
                      }}
                      id={`exp-${item.id}`}
                      aria-hidden={!isOpen}
                      style={{
                        maxHeight: 0,
                        overflow: "hidden",
                        opacity: 0,
                        visibility: "hidden",
                      }}
                    >
                      <div className="mt-3 border-t border-[color:var(--color-border)] pt-3">
                        {/* Eyebrow */}
                        <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[color:var(--color-primary-600)]">
                          {item.period}
                          {item.location ? ` · ${item.location}` : ""}
                        </p>
                        {/* Role (large) */}
                        <h4 className="font-display mt-1 text-sm font-bold leading-snug text-[color:var(--color-fg)]">
                          {item.role}
                        </h4>
                        <p className="mt-0.5 text-xs font-medium text-[color:var(--color-primary-700)]">
                          {item.company}
                        </p>

                        {/* Highlights */}
                        <ul className="mt-3 space-y-2">
                          {item.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="rail-hl flex gap-2 text-[11px] leading-snug text-[color:var(--color-fg)] opacity-0"
                            >
                              <span
                                aria-hidden
                                className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--color-primary-500)]"
                              />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Stack chips */}
                        {item.stack && item.stack.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {item.stack.map((s) => (
                              <span key={s} className="chip">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* External link */}
                        {item.link && (
                          <a
                            href={item.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-[color:var(--color-primary-700)] hover:underline"
                          >
                            {item.link.label}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          aria-hidden
          className="mt-3 text-center text-xs text-[color:var(--color-fg-subtle)]"
        >
          ←&nbsp;&nbsp;scroll to explore&nbsp;&nbsp;→
        </div>
      </div>

      {/* ── Mobile: vertical accordion ── */}
      <ol className="relative ml-3 space-y-3 border-l-2 border-[color:var(--color-border)] pl-8 md:hidden">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <li key={item.id} className="relative">
              {/* Node dot */}
              <span
                aria-hidden
                className={`absolute -left-[42px] top-6 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                  isOpen
                    ? "border-[color:var(--color-primary-600)] bg-[color:var(--color-primary-500)]"
                    : "border-[color:var(--color-primary-400)] bg-[color:var(--color-bg)]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    isOpen ? "bg-white" : "bg-[color:var(--color-primary-500)]"
                  }`}
                />
              </span>

              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`mob-exp-${item.id}`}
                className="card w-full cursor-pointer px-6 py-5 text-left"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[color:var(--color-fg)]">
                      {item.role}
                    </h3>
                    <p className="text-sm text-[color:var(--color-primary-700)]">
                      {item.company}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[color:var(--color-fg-subtle)]">
                    {item.period}
                  </span>
                </div>

                {item.location && (
                  <p className="mt-2 text-xs text-[color:var(--color-fg-subtle)]">
                    {item.location}
                  </p>
                )}

                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
                  {item.summary}
                </p>

                {isOpen && (
                  <MobileExpandedBody item={item} id={`mob-exp-${item.id}`} />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── Mobile expanded body ── */
function MobileExpandedBody({ item, id }: { item: Experience; id: string }) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !bodyRef.current) return;
    animate(bodyRef.current, {
      opacity: [0, 1],
      translateY: [-6, 0],
      duration: 420,
      ease: "outQuint",
    });
    animate(bodyRef.current.querySelectorAll(".mob-hl"), {
      opacity: [0, 1],
      translateX: [-8, 0],
      delay: stagger(45, { start: 120 }),
      duration: 400,
      ease: "outExpo",
    });
  }, []);

  return (
    <div
      ref={bodyRef}
      id={id}
      className="mt-5 border-t border-[color:var(--color-border)] pt-4"
    >
      <ul className="space-y-2 text-sm text-[color:var(--color-fg)]">
        {item.highlights.map((h, i) => (
          <li key={i} className="mob-hl flex gap-2 opacity-0">
            <span
              aria-hidden
              className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--color-primary-500)]"
            />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {item.stack && item.stack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.stack.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
      )}

      {item.images && item.images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {item.images.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-video overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-primary-50)]"
            >
              <ImageLightbox
                src={src}
                alt={`${item.role} at ${item.company} — photo ${i + 1}`}
              />
            </div>
          ))}
        </div>
      )}

      {item.link && (
        <a
          href={item.link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--color-primary-700)] hover:underline"
        >
          {item.link.label}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
