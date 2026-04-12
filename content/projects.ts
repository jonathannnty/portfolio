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
  /** Emoji or single character shown as a visual marker on the card. */
  glyph?: string;
  /** Full writeup, one paragraph per array entry. */
  body: string[];
  /** Whether to show this on the home page "featured work" strip. */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    tagline:
      "Next.js + anime.js portfolio built using Claude plugins.",
    period: "2026",
    sortKey: "2026-04",
    stack: ["Next.js 16", "React 19", "Tailwind v4", "anime.js"],
    glyph: "◐",
    featured: true,
    links: [
      { label: "Source", href: "https://github.com/jonathannnty/portfolio-website" },
    ],
    body: [
      "I wanted a portfolio that felt built rather than assembled — no templates, no off-the-shelf component library. The whole design is driven by a green-centered token system in globals.css, and every accent on the site pulls from that palette.",
      "The experience timeline, hero headline, and scroll reveals are powered by anime.js v4, keeping the JavaScript footprint small while still allowing staggered, spring-y motion that would be clumsy to express in raw CSS.",
      "The contact form uses a Next.js server action that hands off to Resend — no API route, no third-party form service, no client-side secrets.",
    ],
  },
  {
    slug: "audio-har-data-collection",
    title: "Audio-Based Human Activity Recognition",
    tagline: "Rethinking how activity data is collected — faster, more scalable, and less tedious.",
    period: "2024–2025",
    sortKey: "2025-05",
    stack: ["Python", "NumPy", "Pandas", "PyTorch", "LSTM"],
    glyph: "◆",
    body: [
      "Traditional human activity recognition (HAR) datasets rely heavily on video recording and manual annotation, which is time-consuming and difficult to scale. Our project explored whether synchronized audio instructions could replace these methods, making data collection faster and more accessible for both researchers and participants.",
      "We designed a pipeline that aligned audio cues with time-series sensor data from 9-axis IMU devices, allowing activities to be labeled in real time without post-processing. I focused on building data preprocessing scripts and structuring the dataset for LSTM-based models, which ultimately achieved higher validation accuracy compared to button-based and standard baseline methods.",
      "Looking back, I think we could’ve explored more robust generalization across different environments and users. Still, this project shifted how I think about data collection — not just optimizing models, but questioning the assumptions behind how data is gathered in the first place."
    ],
  },
  {
    slug: "pathfinder-ai-career-guidance",
    title: "Pathfinder AI: Multi-Agent Career Guidance",
    tagline: "4-agent career coach that turns user intake into ranked paths and actionable plans.",
    period: "2026",
    sortKey: "2026-03",
    stack: ["TypeScript", "React", "Fastify", "Python", "FastAPI", "uAgents", "Playwright"],
    glyph: "◆",
    body: [
      "For DiamondHacks 2026, in a team of 2, we built Pathfinder AI intended to be a full-stack career guidance platform using React, Fastify API, and a Python agent service.",
      "My teammate worked on a four-agent pipeline: Research, Profile Analysis, Recommendations, and Report Generation. It runs a structured intake-to-analysis flow, validates recommendation quality, and produces clear outputs for users and demo judges.",
      "I focused on reliability as much as features by adding test coverage, operator playbooks, observability endpoints, and demo contingency workflows so the product could run confidently in live hackathon settings!"
    ],
  },
];
