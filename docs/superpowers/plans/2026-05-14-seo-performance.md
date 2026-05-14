# SEO & Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve SEO scores and Core Web Vitals across all 7 pages by completing metadata coverage, enriching OpenGraph configs, fixing heading hierarchy, and adding structured data.

**Architecture:** The fixes layer on top of existing Next.js 16 Metadata API patterns already in use; no new routing or component architecture is introduced. The one structural change is a `titleAs` prop on the shared `<Section>` component so individual pages can elect their title to render as `h1` instead of `h2`.

**Tech Stack:** Next.js 16.2.3, React 19, TypeScript, Tailwind CSS v4, `next/font`, `@vercel/analytics`, `@vercel/speed-insights`

---

## Findings Summary (read-only audit — no edits yet)

| # | File | Issue |
|---|------|-------|
| 1 | `app/page.tsx` | **No `metadata` export** — home page has no title/description/OG |
| 2 | `app/layout.tsx` | Missing `metadataBase` (required for absolute OG URLs); OG lacks `images` field |
| 3 | `app/components/section.tsx` | `title` always renders as `<h2>` — no way to render `<h1>` |
| 4 | `app/about/page.tsx` | First section title is `<h2>` (via Section), no `<h1>` on page; metadata lacks `openGraph` |
| 5 | `app/projects/page.tsx` | No `<h1>` on page; metadata lacks `openGraph` |
| 6 | `app/blog/page.tsx` | No `<h1>` on page; metadata lacks `openGraph` |
| 7 | `app/contact/page.tsx` | No `<h1>` on page; metadata lacks `openGraph`; `<h3>` sidebar label skips a level |
| 8 | `app/blog/[slug]/page.tsx` | `generateMetadata` returns no `openGraph` |
| 9 | `app/projects/[slug]/page.tsx` | `generateMetadata` returns no `openGraph` |
| — | `app/components/image-lightbox.tsx` | Raw `<img>` tag with ESLint-disable comment — **intentional**, leave as-is |

---

## File Map

| File | Action | What changes |
|------|--------|--------------|
| `app/layout.tsx` | Modify | Add `metadataBase`, `openGraph.images`, `openGraph.url` |
| `app/page.tsx` | Modify | Add `export const metadata` |
| `app/components/section.tsx` | Modify | Add `titleAs?: "h1" \| "h2"` prop |
| `app/about/page.tsx` | Modify | Add `titleAs="h1"` to first Section; add `openGraph` to metadata |
| `app/projects/page.tsx` | Modify | Add `titleAs="h1"` to Section; add `openGraph` to metadata |
| `app/blog/page.tsx` | Modify | Add `titleAs="h1"` to Section; add `openGraph` to metadata |
| `app/contact/page.tsx` | Modify | Add `titleAs="h1"` to Section; add `openGraph`; fix `<h3>` → `<h2>` |
| `app/blog/[slug]/page.tsx` | Modify | Add `openGraph` to `generateMetadata` |
| `app/projects/[slug]/page.tsx` | Modify | Add `openGraph` to `generateMetadata` |
| `public/robots.txt` | Create | Allow all crawlers, reference sitemap |
| `app/sitemap.ts` | Create | Dynamic sitemap generation |

---

## Task 1: Add `metadataBase` and OG image to root layout

**Files:**
- Modify: `app/layout.tsx:33-44`

- [ ] **Step 1: Edit `app/layout.tsx` metadata block**

Replace lines 33-44 with:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://www.jonathan-ty.com"),
  title: {
    default: `${site.name}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    type: "website",
    url: "https://www.jonathan-ty.com",
    images: [
      {
        url: "/images/portfolio.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — Portfolio`,
      },
    ],
  },
};
```

> **Why `metadataBase`:** Next.js requires an absolute base URL to resolve relative paths in `openGraph.images`. Without it, OG image URLs are invalid and social sharing previews break.

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "seo: add metadataBase and OG image to root layout"
```

---

## Task 2: Add metadata to home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add import and metadata export to `app/page.tsx`**

Add after line 1 (after the existing imports):

```tsx
import type { Metadata } from "next";
import { site } from "@/content/site";
```

Add before `export default function Home()`:

```tsx
export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    url: "/",
  },
};
```

> **Note:** The title here overrides the root layout's template (`%s — Jonathan Ty`) by providing a full string. This is intentional — the home page title should not repeat the name twice.

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "seo: add metadata export to home page"
```

---

## Task 3: Add `titleAs` prop to Section component

**Files:**
- Modify: `app/components/section.tsx`

This is the central structural fix. All pages using `<Section>` currently get `<h2>` for their title. Adding a `titleAs` prop lets the first/primary section on each page render as `<h1>`.

- [ ] **Step 1: Edit `app/components/section.tsx`**

Replace the full file content:

```tsx
import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  id?: string;
  children: ReactNode;
  /** Remove top padding — useful when stacking two sections visually. */
  tight?: boolean;
  /**
   * Optional decorative illustration rendered to the right of the heading
   * block on large screens. Pass a client component (e.g. AboutIllustration).
   * Hidden below the `lg` breakpoint so it never crowds the title on mobile.
   */
  illustration?: ReactNode;
  /**
   * The HTML heading level used for the section title.
   * Use "h1" on the first/primary section of a page for correct heading hierarchy.
   * Defaults to "h2".
   */
  titleAs?: "h1" | "h2";
};

export default function Section({
  eyebrow,
  title,
  subtitle,
  id,
  children,
  tight,
  illustration,
  titleAs = "h2",
}: SectionProps) {
  const hasHeader = eyebrow || title || subtitle;
  const TitleTag = titleAs;

  return (
    <section
      id={id}
      className={`container-page ${tight ? "pt-8" : "pt-20 md:pt-28"} pb-20 md:pb-28`}
    >
      {hasHeader && (
        <header className={`mb-12 flex items-center gap-10 ${illustration ? "" : "max-w-2xl"}`}>
          {/* Text block — always constrained to 2xl for readability */}
          <div className="max-w-2xl flex-1 min-w-0">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && (
              <TitleTag className="mt-3 font-display text-3xl font-bold tracking-tight text-[color:var(--color-fg)] sm:text-4xl">
                {title}
              </TitleTag>
            )}
            {subtitle && (
              <p className="mt-4 text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
                {subtitle}
              </p>
            )}
          </div>

          {/* Illustration — only visible on large screens */}
          {illustration && (
            <div className="hidden lg:flex flex-none items-center select-none">
              {illustration}
            </div>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/section.tsx
git commit -m "feat: add titleAs prop to Section for H1 heading hierarchy support"
```

---

## Task 4: Fix heading hierarchy and enrich metadata on About page

**Files:**
- Modify: `app/about/page.tsx:16-19` (metadata) and `:30` (Section)

- [ ] **Step 1: Enrich metadata in `app/about/page.tsx`**

Replace lines 16-19:

```tsx
export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — experience, coursework, and awards.`,
  openGraph: {
    title: `About ${site.name}`,
    description: `About ${site.name} — experience, coursework, and awards.`,
    url: "/about",
  },
};
```

- [ ] **Step 2: Add `titleAs="h1"` to the first Section in `app/about/page.tsx`**

On line 30, change:

```tsx
      <Section
        eyebrow="Who am I?"
        title={`Hello there, I'm ${site.name.split(" ")[0]}.`}
        illustration={<AboutIllustration />}
      >
```

to:

```tsx
      <Section
        eyebrow="Who am I?"
        title={`Hello there, I'm ${site.name.split(" ")[0]}.`}
        illustration={<AboutIllustration />}
        titleAs="h1"
      >
```

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "seo: fix h1 hierarchy and add openGraph to about page"
```

---

## Task 5: Fix heading hierarchy and enrich metadata on Projects listing page

**Files:**
- Modify: `app/projects/page.tsx`

- [ ] **Step 1: Enrich metadata and add `titleAs="h1"` in `app/projects/page.tsx`**

Replace the metadata block (lines 8-11):

```tsx
export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of things I've designed, built, and shipped.",
  openGraph: {
    title: `Projects — ${site.name}`,
    description: "A selection of things I've designed, built, and shipped.",
    url: "/projects",
  },
};
```

Add `import { site } from "@/content/site";` to imports if not already present.

On the `<Section>` in the return, add `titleAs="h1"`:

```tsx
      <Section title="Things I've worked on!" titleAs="h1">
```

- [ ] **Step 2: Commit**

```bash
git add app/projects/page.tsx
git commit -m "seo: fix h1 hierarchy and add openGraph to projects page"
```

---

## Task 6: Fix heading hierarchy and enrich metadata on Blog listing page

**Files:**
- Modify: `app/blog/page.tsx`

- [ ] **Step 1: Enrich metadata and add `titleAs="h1"` in `app/blog/page.tsx`**

Replace the metadata block (lines 8-11):

```tsx
export const metadata: Metadata = {
  title: "Blog",
  description: "Occasional writing on things I'm building, reading, or thinking about.",
  openGraph: {
    title: `Blog — ${site.name}`,
    description: "Occasional writing on things I'm building, reading, or thinking about.",
    url: "/blog",
  },
};
```

Add `import { site } from "@/content/site";` to imports if not already present.

On the `<Section>` in the return, add `titleAs="h1"`:

```tsx
      <Section title="Notes & writing." titleAs="h1">
```

- [ ] **Step 2: Commit**

```bash
git add app/blog/page.tsx
git commit -m "seo: fix h1 hierarchy and add openGraph to blog page"
```

---

## Task 7: Fix heading hierarchy and enrich metadata on Contact page

**Files:**
- Modify: `app/contact/page.tsx:14-17` (metadata), `:21` (Section), `:33` (h3 → h2)

The contact page has a secondary issue: the sidebar card label "Other ways to reach me" is `<h3>` (line 33) but there's currently no `<h1>` or `<h2>` above it. After adding `titleAs="h1"` to the Section, the page will have `h1 → h3` — skipping h2. Fix by changing the `<h3>` to `<h2>`.

- [ ] **Step 1: Enrich metadata in `app/contact/page.tsx`**

Replace lines 14-17:

```tsx
export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
  openGraph: {
    title: `Contact ${site.name}`,
    description: `Get in touch with ${site.name}.`,
    url: "/contact",
  },
};
```

- [ ] **Step 2: Add `titleAs="h1"` to Section**

Change line 21:

```tsx
    <Section
      eyebrow="Contact"
      title="Let's talk."
      subtitle="Have a project, a question, or just want to say hi? Drop me a note and I'll get back to you."
      illustration={<ContactIllustration />}
      titleAs="h1"
    >
```

- [ ] **Step 3: Fix `<h3>` → `<h2>` on line 33**

Change:

```tsx
            <h3 className="font-display text-base font-semibold text-[color:var(--color-fg)]">
              Other ways to reach me
            </h3>
```

to:

```tsx
            <h2 className="font-display text-base font-semibold text-[color:var(--color-fg)]">
              Other ways to reach me
            </h2>
```

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx
git commit -m "seo: fix heading hierarchy (h1→h2) and add openGraph to contact page"
```

---

## Task 8: Add `openGraph` to blog post `generateMetadata`

**Files:**
- Modify: `app/blog/[slug]/page.tsx:14-26`

- [ ] **Step 1: Enrich `generateMetadata` in `app/blog/[slug]/page.tsx`**

Replace lines 14-26:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: post.date,
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/blog/[slug]/page.tsx"
git commit -m "seo: add openGraph to blog post generateMetadata"
```

---

## Task 9: Add `openGraph` to project detail `generateMetadata`

**Files:**
- Modify: `app/projects/[slug]/page.tsx:17-29`

- [ ] **Step 1: Enrich `generateMetadata` in `app/projects/[slug]/page.tsx`**

Replace lines 17-29:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add "app/projects/[slug]/page.tsx"
git commit -m "seo: add openGraph with hero image to project generateMetadata"
```

---

## Task 10: Add `robots.txt` and `sitemap.ts`

**Files:**
- Create: `public/robots.txt`
- Create: `app/sitemap.ts`

- [ ] **Step 1: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://www.jonathan-ty.com/sitemap.xml
```

- [ ] **Step 2: Create `app/sitemap.ts`**

```ts
import { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { posts } from "@/content/blog";

const BASE = "https://www.jonathan-ty.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
```

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt app/sitemap.ts
git commit -m "seo: add robots.txt and dynamic sitemap"
```

---

## Task 11: Update project documentation

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Append SEO conventions to `AGENTS.md`**

Add the following section at the end of `AGENTS.md`:

```markdown

# SEO Conventions

- Root layout (`app/layout.tsx`) defines `metadataBase` and default `openGraph` with a fallback image.
- Every page file **must** export `metadata` (static pages) or `generateMetadata` (dynamic routes).
- `openGraph.url` should be set to the page's relative path on every page.
- The `<Section>` component renders its `title` prop as `<h2>` by default. Use `titleAs="h1"` on the first/primary section of a page to maintain correct `H1 → H2 → H3` heading hierarchy.
- The `<img>` tag in `image-lightbox.tsx` is intentionally unoptimized; the ESLint disable comment is correct.
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add SEO conventions to AGENTS.md"
```

---

## Self-Review Checklist

- [x] **Spec coverage — Metadata API:** Tasks 1, 2, 4–9 cover all 7 pages with `metadata` or `generateMetadata` + `openGraph`.
- [x] **Spec coverage — `<img>` tags:** Lightbox raw `<img>` is intentional — documented in findings. No unintentional raw `<img>` tags exist.
- [x] **Spec coverage — Heading hierarchy:** Task 3 (Section `titleAs`), Tasks 4–7 (per-page `titleAs="h1"`), Task 7 step 3 (contact h3→h2).
- [x] **Spec coverage — Core Web Vitals:** Fonts already use `display: "swap"` and `next/font` (no fixes needed). LCP images already use `priority`/`preload`. `metadataBase` in Task 1 fixes broken OG image URLs. Sitemap in Task 10 helps indexing.
- [x] **Spec coverage — Documentation update:** Task 11.
- [x] **No placeholders:** All code blocks contain exact, copy-paste-ready content.
- [x] **Type consistency:** `TitleTag` variable in Section matches the JSX usage pattern. `MetadataRoute` from `next` used correctly in sitemap.
- [x] **`metadataBase` URL:** Uses `https://www.jonathan-ty.com` — update this to the real production domain if different.
