import type { Metadata } from "next";
import Section from "../components/section";
import ProjectsGrid from "../components/projects-grid";
import RevealProvider from "../components/reveal-provider";
import ProjectsIllustration from "../components/illustrations/projects-illustration";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of things I've designed, built, and shipped.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ persona?: string }>;
}) {
  const { persona } = await searchParams;

  return (
    <>
      <RevealProvider />
      <Section
        eyebrow="Projects"
        title="Things I've worked on!"
        subtitle="A selection of projects either through hackathons or research. Filter, search, or browse by view."
        illustration={<ProjectsIllustration />}
      >
        <ProjectsGrid projects={projects} initialPersona={persona ?? null} />
      </Section>
    </>
  );
}
