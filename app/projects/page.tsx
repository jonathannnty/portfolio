import type { Metadata } from "next";
import Section from "../components/section";
import ProjectCard from "../components/project-card";
import RevealProvider from "../components/reveal-provider";
import ProjectsIllustration from "../components/illustrations/projects-illustration";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of things I've designed, built, and shipped.",
};

export default function ProjectsPage() {
  const sorted = [...projects].sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  return (
    <>
      <RevealProvider />
      <Section
        eyebrow="Projects"
        title="Things I've worked on!"
        subtitle="A selection of projects either through hackathons or research. Click any card for the full details."
        illustration={<ProjectsIllustration />}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <div key={p.slug} className="reveal">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
