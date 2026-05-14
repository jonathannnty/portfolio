import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import CopyLinkButton from "@/app/components/copy-link-button";
import { projects } from "@/content/projects";
import { toSlugId, type Heading } from "@/lib/toc";
import { ProjectTOCDesktop, ProjectTOCMobile } from "@/app/components/project-toc";

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
    openGraph: {
      title: project.title,
      description: project.tagline,
      url: `/projects/${slug}`,
      ...(project.heroImage
        ? {
            images: [
              {
                url: project.heroImage,
                alt: project.title,
              },
            ],
          }
        : {}),
    },
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

  const headings: Heading[] = [
    ...(project.sections ?? []).map((sec) => ({
      label: sec.heading,
      id: toSlugId(sec.heading),
    })),
    ...(project.images?.length ? [{ label: "Gallery", id: "gallery" }] : []),
  ];
  const hasTOC = headings.length >= 2;

  return (
    <div className="relative">
      {/* Hero background — spans from top of page through the header */}
      <div
        aria-hidden="true"
        className="project-hero-bg pointer-events-none absolute inset-x-0 top-0 h-[28rem] overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.28] blur-sm">
          {project.heroImage ? (
            <Image
              src={project.heroImage}
              alt=""
              fill
              className="object-cover object-top"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="project-hero-placeholder absolute inset-0" />
          )}
        </div>
        <svg
          className="project-hero-grain absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <filter id="hero-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#hero-noise)"
            opacity="0.12"
          />
        </svg>
      </div>

      <article className="container-page relative pt-20 pb-24 md:pt-28">
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary-700)]"
        >
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>
        <CopyLinkButton />
      </div>

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

      <div className={`mt-12${hasTOC ? " xl:grid xl:grid-cols-[minmax(0,1fr)_192px] xl:gap-x-12" : ""}`}>
        <div>
          {hasTOC && <ProjectTOCMobile headings={headings} />}
          {project.sections && project.sections.length > 0 ? (
            <div className="max-w-3xl">
              {project.sections.map((sec, si) => (
                <section key={si} className={si > 0 ? "mt-16" : ""}>
                  <div className="flex items-center gap-3 mb-8">
                    <span
                      className="h-7 w-[3px] flex-shrink-0 rounded-full bg-[color:var(--color-accent)]"
                      aria-hidden="true"
                    />
                    <h2
                      id={toSlugId(sec.heading)}
                      className="font-display text-2xl font-bold tracking-tight text-[color:var(--color-fg)]"
                    >
                      {sec.heading}
                    </h2>
                  </div>

                  {sec.subsections.map((subsec, ssi) => (
                    <div key={ssi} className={ssi > 0 ? "mt-10" : ""}>
                      {subsec.heading && (
                        <span className="eyebrow block mb-3">{subsec.heading}</span>
                      )}
                      <div className="space-y-4">
                        {subsec.content.map((block, bIdx) => {
                          if (block.type === "paragraph") {
                            return (
                              <p
                                key={bIdx}
                                className="text-base leading-7 text-[color:var(--color-fg)]"
                              >
                                {block.text}
                              </p>
                            );
                          }
                          if (block.type === "pullQuote") {
                            return (
                              <blockquote
                                key={bIdx}
                                className="my-6 brushed-l pl-6 py-1"
                              >
                                <p className="font-display text-xl font-medium italic leading-relaxed tracking-tight text-[color:var(--color-fg)]">
                                  {block.text}
                                </p>
                              </blockquote>
                            );
                          }
                          if (block.type === "list") {
                            return (
                              <ul key={bIdx} className="my-1 ml-1 space-y-3">
                                {block.items.map((item, iIdx) => (
                                  <li
                                    key={iIdx}
                                    className="flex gap-3 text-base leading-7 text-[color:var(--color-fg)]"
                                  >
                                    <span
                                      className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[color:var(--color-accent)]"
                                      aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                          if (block.type === "image") {
                            return (
                              <div key={bIdx} className="brushed my-6 rounded-[var(--radius-lg)]">
                                <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-[color:var(--color-primary-50)]">
                                  <Image
                                    src={block.src}
                                    alt={block.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 768px) 48rem, 100vw"
                                  />
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl space-y-5">
              {project.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-7 text-[color:var(--color-fg)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {project.images && project.images.length > 0 && (
            <div className="mt-14 max-w-4xl">
              <h2
                id="gallery"
                className="font-display text-xl font-semibold tracking-tight text-[color:var(--color-fg)] mb-5"
              >
                Gallery
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.images.map((src, i) => (
                  <div key={i} className="brushed rounded-[var(--radius-lg)]">
                    <div className="relative aspect-video overflow-hidden rounded-[var(--radius-lg)] bg-[color:var(--color-primary-50)]">
                      <Image
                        src={src}
                        alt={`${project.title} screenshot ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {hasTOC && (
          <aside className="hidden xl:block sticky top-24 self-start min-h-screen">
            <ProjectTOCDesktop headings={headings} />
          </aside>
        )}
      </div>
      </article>
    </div>
  );
}
