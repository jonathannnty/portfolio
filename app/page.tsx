import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "./components/hero";
import Section from "./components/section";
import RevealProvider from "./components/reveal-provider";
import ProjectCard from "./components/project-card";
import BlogCard from "./components/blog-card";
import { projects } from "@/content/projects";
import { posts } from "@/content/blog";

export default function Home() {
  const featured = projects
    .filter((p) => p.featured)
    .concat(projects.filter((p) => !p.featured))
    .slice(0, 3);

  const recentPosts = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);

  return (
    <>
      <RevealProvider />

      <Hero />

      <Section
        eyebrow="Selected work"
        title="Things I've built recently."
        subtitle="A small selection of the projects I'm proudest of. The full list lives on the projects page."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <div key={p.slug} className="reveal">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-primary-700)] hover:underline"
          >
            See all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="From the blog"
        title="Notes and writing."
        subtitle="Occasional posts on things I'm building, reading, or thinking about."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {recentPosts.map((p) => (
            <div key={p.slug} className="reveal">
              <BlogCard post={p} />
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-primary-700)] hover:underline"
          >
            Read the blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
