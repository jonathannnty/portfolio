import type { ReactNode } from "react";

/**
 * Blog posts rendered on /blog and /blog/[slug].
 *
 * Each post's body is a React node so you get full JSX support without
 * needing an MDX pipeline. Use the provided <P>, <H2>, <Code>, and <Quote>
 * helpers to stay on-style — or drop in any component you like.
 */

export type BlogPost = {
  slug: string;
  title: string;
  /** ISO date string — used for sorting and display. */
  date: string;
  /** 1-2 sentence preview shown on the blog index. */
  excerpt: string;
  /** Estimated reading time, e.g. "4 min read". */
  readingTime: string;
  /** Optional category shown as a chip on the index. */
  tag?: string;
  body: ReactNode;
};

/* ---------- Styled content primitives — keeps posts on brand ---------- */

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 text-base leading-7 text-[color:var(--color-fg)]">
      {children}
    </p>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-[color:var(--color-fg)]">
      {children}
    </h2>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-[color:var(--color-surface-muted)] px-1.5 py-0.5 font-mono text-[0.92em] text-[color:var(--color-primary-800)]">
      {children}
    </code>
  );
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-6 border-l-4 border-[color:var(--color-primary-500)] bg-[color:var(--color-surface-muted)] py-3 pr-4 pl-5 italic text-[color:var(--color-fg-muted)]">
      {children}
    </blockquote>
  );
}

/* ---------- Posts ---------- */

export const posts: BlogPost[] = [
  // {
  //   slug: "building-this-site",
  //   title: "Building this site",
  //   date: "2026-04-11",
  //   readingTime: "4 min read",
  //   tag: "meta",
  //   excerpt:
  //     "Notes on the design system, the animation approach, and the tiny decisions that added up.",
  //   body: (
  //     <>
  //       <P>
  //         This is the first post on the new site. I wrote it mostly to have
  //         something real in the blog section while I iterate on the design,
  //         but also to capture a few of the decisions I'm glad I made.
  //       </P>

  //       <H2>Why a strict token system</H2>
  //       <P>
  //         Every color, radius, shadow, and type size lives in{" "}
  //         <Code>globals.css</Code> under a single <Code>@theme</Code> block.
  //         Components reference the tokens by name — never a hex literal — so
  //         when I decide the hero should lean more forest than mint, it's a
  //         single-line change.
  //       </P>

  //       <H2>Why anime.js, lightly</H2>
  //       <P>
  //         I wanted motion to feel intentional rather than omnipresent.
  //         anime.js v4 ships a tiny <Code>animate()</Code> API that plays
  //         well with React refs, so I can stagger the hero headline on mount,
  //         spring-expand timeline nodes on click, and reveal sections on
  //         scroll without pulling in a full animation framework.
  //       </P>

  //       <Quote>
  //         The best motion is the kind you don't consciously notice — you just
  //         feel that the site is alive.
  //       </Quote>

  //       <H2>What's next</H2>
  //       <P>
  //         Real project writeups, a second post about the contact form and
  //         Resend integration, and eventually some notes on things I'm reading
  //         that aren't about code.
  //       </P>
  //     </>
  //   ),
  // },
  // {
  //   slug: "placeholder-post",
  //   title: "Placeholder post — replace me",
  //   date: "2026-03-20",
  //   readingTime: "2 min read",
  //   excerpt:
  //     "This entry exists so the blog index has more than one card. Swap it out with real writing.",
  //   body: (
  //     <>
  //       <P>
  //         When you write your second post, duplicate this entry in{" "}
  //         <Code>src/content/blog.tsx</Code> and edit the metadata and body.
  //       </P>
  //       <P>
  //         You can use any of the provided primitives (<Code>P</Code>,{" "}
  //         <Code>H2</Code>, <Code>Code</Code>, <Code>Quote</Code>) or drop
  //         straight JSX in — whatever the post needs.
  //       </P>
  //     </>
  //   ),
  // },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
