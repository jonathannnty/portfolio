/**
 * Projects rendered on /projects and /projects/[slug].
 *
 * To add a project: append to the `projects` array with a unique `slug`.
 * `body` is an array of paragraph strings so you can write longer writeups
 * without needing MDX.
 */

export type Project = {
  slug: string;
  title: string;
  /** One-sentence hook shown on cards. */
  tagline: string;
  /** Year or date range shown as metadata. */
  period: string;
  /** Sort key — ISO yyyy-mm so newest projects surface first. */
  sortKey: string;
  /** Short tags shown on the card (languages, frameworks). */
  stack: string[];
  /** Optional links — repo, live demo, writeup. */
  links?: { label: string; href: string }[];
  /** Lucide icon name shown as a visual marker on the card. */
  glyph?: string;
  /** Full writeup, one paragraph per array entry. */
  body: string[];
  /** Whether to show this on the home page "featured work" strip. */
  featured?: boolean;
  /** Thumbnail image path shown on project cards (relative to /public). */
  thumbnail?: string;
  /** Gallery images shown on the detail page (relative to /public). */
  images?: string[];
  /** When true the card shows an "In Progress" overlay and blocks navigation. */
  inProgress?: boolean;
};

export const projects: Project[] = [
  {
    slug: "idle-sidebar-source-control",
    title: "IDLE Sidebar with Source Control Integration",
    tagline:
      "Split-view diff visualization for Python's IDLE editor with git integration and line-by-line highlighting.",
    period: "Jan–Mar 2026",
    sortKey: "2026-03",
    stack: ["Python", "Git", "Tkinter", "Testing", "UI/UX", "GitHub Copilot"],
    glyph: "GitBranch",
    body: [
      "For a team project in computational linguistics, we built a source-control sidebar feature for Python's IDLE integrated development environment. The goal was to give Python developers native diff visibility and version control context without leaving the editor.",
      "I specialized in the diff visualization layer, implementing line-by-line syntax highlighting for added/removed/modified code, plus a gutter UI with contextual markers (±). This required tight integration with IDLE's split-view architecture and careful handling of viewport synchronization to keep line numbers aligned across panes.",
      "I also owned test coverage for the split-view diff behavior, ensuring marker accuracy, synchronization correctness, and edge cases around empty diffs and large files. My commits concentrated on user-facing clarity — making it obvious what changed and why — while the core git engine and sidebar scaffolding were handled by teammates.",
      "The project followed a branch-heavy workflow with parallel feature streams that converged in the final integration phase. The work shipped as a functional prototype ready for demo.",
    ],
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/jontan3/group-project-team-super-cool-heh",
      },
    ],
    thumbnail: "/images/IDLE.png",
  },
  {
    slug: "cogs127-case-study",
    title: "COGS 127 Case Study",
    tagline:
      "Currently creating a UX/product design case study for your portfolio; team project with user research, data science, prototyping, and user testing.",
    period: "2026",
    sortKey: "2026-04",
    stack: ["Figma", "Claude"],
    glyph: "Palette",
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/jonathannnty/portfolio.git",
      },
    ],
    body: [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    ],
    inProgress: true,
    thumbnail: "/images/in-progress.png",
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    tagline: "Next.js + anime.js portfolio built using Claude plugins.",
    period: "2026",
    sortKey: "2026-04",
    stack: ["Next.js", "React", "Tailwind", "anime.js", "Claude"],
    glyph: "Code2",
    featured: true,
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/jonathannnty/portfolio.git",
      },
    ],
    body: [
      "I wanted a portfolio that felt built rather than assembled — no templates, no off-the-shelf component library. The whole design is driven by a green-centered token system in globals.css, and every accent on the site pulls from that palette.",
      "The experience timeline, hero headline, and scroll reveals are powered by anime.js v4, keeping the JavaScript footprint small while still allowing staggered, spring-y motion that would be clumsy to express in raw CSS.",
      "The contact form uses a Next.js server action that hands off to Resend — no API route, no third-party form service, no client-side secrets.",
    ],
    thumbnail: "/images/portfolio.png",
  },
  {
    slug: "audio-har-data-collection",
    title: "Audio-Based Human Activity Recognition",
    tagline:
      "Rethinking how activity data is collected: faster, more scalable, and less tedious!",
    period: "2024–2025",
    sortKey: "2025-05",
    stack: ["Python", "NumPy", "Pandas", "PyTorch", "LSTM", "GitHub Copilot"],
    glyph: "Microscope",
    body: [
      "This research project came about from my group's participation in the UCSD CSE Department's Early Research Scholars Program. In a team of 4, we learned how traditional human activity recognition (HAR) datasets rely heavily on video recording and manual annotation, which is time-consuming and difficult to scale. Our project explored whether synchronized audio instructions could replace these methods, making data collection faster and more accessible for both researchers and participants.",
      "We designed a pipeline that aligned audio cues with time-series sensor data from 9-axis IMU devices, allowing activities to be labeled in real time without post-processing. I focused on building data preprocessing scripts and structuring the dataset for LSTM-based models, which ultimately achieved higher validation accuracy compared to button-based and standard baseline methods.",
      "Looking back, I think we could’ve explored more robust generalization across different environments and users. Still, this project shifted how I think about data collection, not just optimizing models, but questioning the assumptions behind how data is gathered in the first place.",
    ],
    thumbnail: "/images/pannuto-group-poster.jpg",
    links: [
      {
        label: "Pannuto Group Poster",
        href: "https://docs.google.com/presentation/d/1MulUlO82lKFoAQDq7fSwZwJZZ0lp178LVbZovcwtWq4/edit?usp=sharing",
      },
      {
        label: "LinkedIn Post",
        href: "https://www.linkedin.com/posts/jonathan-ty_i-just-wrapped-up-an-incredible-year-with-activity-7335523246672330753-ucFq?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEeoZfoB3ThC295AU2C-EtteoS6JLAkSOy0",
      },
    ],
  },
  {
    slug: "pathfinder-ai-career-guidance",
    title: "Pathfinder AI: Multi-Agent Career Guidance",
    tagline:
      "4-agent career coach that turns user intake into ranked paths and actionable plans.",
    period: "2026",
    sortKey: "2026-03",
    stack: [
      "TypeScript",
      "React",
      "Fastify",
      "Python",
      "FastAPI",
      "uAgents",
      "Playwright",
      "Claude",
      "GitHub Copilot",
    ],
    glyph: "Binary",
    body: [
      "For DiamondHacks 2026, in a team of 2, we built Pathfinder AI intended to be a full-stack career guidance platform using React, Fastify API, and a Python agent service.",
      "My teammate worked on a four-agent pipeline: Research, Profile Analysis, Recommendations, and Report Generation. It runs a structured intake-to-analysis flow, validates recommendation quality, and produces clear outputs for users and demo judges.",
      "I focused on reliability as much as features by adding test coverage, operator playbooks, observability endpoints, and demo contingency workflows so the product could run confidently in live hackathon settings!",
    ],
    thumbnail: "/images/pathfinder.png",
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/jonathannnty/DH-2026.git",
      },
      {
        label: "DevPost",
        href: "https://devpost.com/software/pathfinder-ai-7e3r5o",
      },
      {
        label: "Website",
        href: "https://dh-2026.vercel.app/",
      },
    ],
  },
];
