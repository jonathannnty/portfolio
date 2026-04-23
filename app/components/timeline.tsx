"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown, ExternalLink } from "lucide-react";
import { animate, stagger } from "animejs";
import type { Experience } from "@/content/experiences";
import ImageLightbox from "./image-lightbox";

/**
 * Interactive experience timeline.
 *
 * - Renders a vertical rail with one node per experience.
 * - Clicking a node expands its details with a spring animation.
 * - One node is open by default so users see content immediately.
 * - On mount, the whole list staggers in (unless reduced motion is set).
 */
export default function Timeline({ items }: { items: Experience[] }) {
  const rootRef = useRef<HTMLOListElement>(null);
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !rootRef.current) return;

    animate(rootRef.current.querySelectorAll(".timeline-node"), {
      x: [-24, 0],
      opacity: [0, 1],
      duration: 700,
      delay: stagger(90, { start: 80 }),
      ease: "outExpo",
    });
  }, []);

  const toggle = (id: string) =>
    setOpenId((current) => (current === id ? null : id));

  return (
    <ol
      ref={rootRef}
      className="relative ml-3 space-y-3 border-l-2 border-[color:var(--color-border)] pl-8"
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <li key={item.id} className="timeline-node relative opacity-0">
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
              aria-controls={`exp-${item.id}`}
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
                <div className="flex items-center gap-3 text-xs text-[color:var(--color-fg-subtle)]">
                  <span className="font-mono">{item.period}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {item.location && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[color:var(--color-fg-subtle)]">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
                {item.summary}
              </p>

              {isOpen && <ExpandedBody item={item} id={`exp-${item.id}`} />}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Expanded node body — split out so we can animate mount ---------- */

function ExpandedBody({ item, id }: { item: Experience; id: string }) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !bodyRef.current) return;

    animate(bodyRef.current, {
      opacity: [0, 1],
      y: [-6, 0],
      duration: 420,
      ease: "outQuint",
    });
    animate(bodyRef.current.querySelectorAll(".tl-highlight"), {
      opacity: [0, 1],
      x: [-8, 0],
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
          <li key={i} className="tl-highlight flex gap-2 opacity-0">
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
