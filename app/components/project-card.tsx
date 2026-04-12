"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";

/**
 * Project card — the entire card is a Link to the detail page.
 * Hover triggers a subtle anime.js lift.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const IconComponent = project.glyph
    ? (Icons[project.glyph as keyof typeof Icons] as React.ComponentType<{ className?: string }>)
    : null;
  const ref = useRef<HTMLAnchorElement>(null);

  const tilt = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    ref.current.style.transform = `perspective(700px) rotateX(${y * -7}deg) rotateY(${x * 7}deg) translateY(-4px)`;
    ref.current.style.transition = "transform 0.1s ease-out";
  };

  const resetTilt = () => {
    if (!ref.current) return;
    ref.current.style.transition = "transform 0.35s ease-out";
    ref.current.style.transform  = "perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <Link
      ref={ref}
      href={`/projects/${project.slug}`}
      onMouseMove={tilt}
      onMouseLeave={resetTilt}
      className="card group flex h-full flex-col overflow-hidden p-0"
      style={{ willChange: "transform", transformStyle: "preserve-3d" }}
    >
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

        {/* Thumbnail — only shown when a thumbnail path is provided */}
        {project.thumbnail && (
          <div className="flex w-full justify-center pb-4">
            <div className="flex rounded-md relative h-50 w-full overflow-hidden bg-[color:var(--color-primary-50)]">
              <Image
                src={project.thumbnail}
                alt={`${project.title} preview`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                preload={true}
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

        <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-primary-700)]">
          Read more
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
