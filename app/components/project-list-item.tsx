"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";

export default function ProjectListItem({ project }: { project: Project }) {
  const IconComponent = project.glyph
    ? (Icons[project.glyph as keyof typeof Icons] as React.ComponentType<{ className?: string }>)
    : null;

  const inner = (
    <>
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]">
        {IconComponent ? <IconComponent className="h-4 w-4" /> : <span className="text-sm">◉</span>}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-[color:var(--color-fg)] truncate">
            {project.title}
          </span>
          {project.inProgress && (
            <span className="shrink-0 rounded-full bg-[color:var(--color-accent)]/15 px-2 py-0.5 text-xs font-medium text-[color:var(--color-accent)]">
              In Progress
            </span>
          )}
        </div>
        <p className="truncate text-sm text-[color:var(--color-fg-muted)]">{project.tagline}</p>
      </div>

      <div className="hidden sm:flex flex-wrap gap-1 flex-none">
        {project.stack.slice(0, 3).map((s) => (
          <span key={s} className="chip text-xs">{s}</span>
        ))}
      </div>

      <span className="font-mono text-xs text-[color:var(--color-fg-subtle)] flex-none">
        {project.period}
      </span>

      {!project.inProgress && (
        <ArrowUpRight className="h-4 w-4 flex-none text-[color:var(--color-fg-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (project.inProgress) {
    return (
      <div className="card flex items-center gap-4 px-5 py-3.5 opacity-60 cursor-not-allowed">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card group flex items-center gap-4 px-5 py-3.5 hover:border-[color:var(--color-primary-300)] transition-colors"
    >
      {inner}
    </Link>
  );
}
