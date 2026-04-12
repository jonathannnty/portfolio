"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import * as Icons from "lucide-react";
import { animate } from "animejs";
import type { Project } from "@/content/projects";

/**
 * In-progress variant of the project card.
 * Same visual layout as ProjectCard but non-navigable — clicking shakes
 * the card and flashes the overlay to signal it isn't ready yet.
 */
export default function InProgressProjectCard({ project }: { project: Project }) {
  const IconComponent = project.glyph
    ? (Icons[project.glyph as keyof typeof Icons] as React.ComponentType<{ className?: string }>)
    : null;

  const cardRef  = useRef<HTMLDivElement>(null);
  const [shaking, setShaking] = useState(false);

  const handleClick = () => {
    if (shaking || !cardRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    setShaking(true);
    animate(cardRef.current, {
      translateX: [0, -7, 7, -5, 5, -3, 3, 0],
      duration:   460,
      ease:       "linear",
      onComplete: () => setShaking(false),
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="card group relative flex h-full flex-col overflow-hidden p-0 cursor-not-allowed select-none"
    >
      {/* Card body — same layout as ProjectCard */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 flex items-start justify-between">
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-md bg-[color:var(--color-primary-50)] font-mono text-xl text-[color:var(--color-primary-700)]"
          >
            {IconComponent ? (
              <IconComponent className="h-5 w-5" />
            ) : (
              <span className="text-base">◉</span>
            )}
          </span>
          <span className="font-mono text-xs text-[color:var(--color-fg-subtle)]">
            {project.period}
          </span>
        </div>

        {project.thumbnail && (
          <div className="flex w-full justify-center pb-4">
            <div className="relative h-50 w-full overflow-hidden rounded-md bg-[color:var(--color-primary-50)]">
              <Image
                src={project.thumbnail}
                alt={`${project.title} preview`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
          </div>
        )}

        <h3 className="font-display text-xl font-semibold tracking-tight text-[color:var(--color-fg)]">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
          {project.tagline}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>

        <div className="flex-1" />
      </div>

      {/* In-progress overlay */}
      <div
        className={`
          absolute inset-0 flex flex-col items-center justify-center gap-2
          bg-[color:var(--color-bg)]/75 backdrop-blur-[2px]
          transition-opacity duration-200
          ${shaking ? "opacity-90" : "opacity-100"}
        `}
      >
        {/* Pulsing dot */}
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-accent)] opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[color:var(--color-accent)]" />
        </span>

        <span className="font-mono text-sm font-semibold tracking-widest text-[color:var(--color-fg-muted)] uppercase">
          In Progress
        </span>
      </div>
    </div>
  );
}
