"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card group flex h-full flex-col p-0"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 flex items-start justify-end">
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
                className="object-cover transition-transform duration-300 group-hover:scale-105"
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
