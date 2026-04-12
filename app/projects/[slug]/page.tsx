import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projects } from "@/content/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="container-page pt-20 pb-24 md:pt-28">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary-700)]"
      >
        <ArrowLeft className="h-4 w-4" />
        All projects
      </Link>

      <header className="mt-8 max-w-3xl">
        <span className="eyebrow">{project.period}</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[color:var(--color-fg)] sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-fg-muted)]">
          {project.tagline}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>

        {project.links && project.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                {l.label}
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}
      </header>

      <div className="mt-12 max-w-3xl space-y-5">
        {project.body.map((paragraph, i) => (
          <p
            key={i}
            className="text-base leading-7 text-[color:var(--color-fg)]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
