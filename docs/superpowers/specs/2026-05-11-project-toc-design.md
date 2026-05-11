# Project Page Table of Contents — Design Spec

**Date:** 2026-05-11  
**Status:** Approved

## Overview

Add heading navigation to project detail pages (`/projects/[slug]`). On desktop (≥1280px) a minimal sticky rail sits to the right of the content. On mobile a compact inline collapsible sits above the article body. The active heading tracks automatically as the user scrolls (scroll spy).

TOC is only rendered when there are **≥ 2 headings**. Projects with a flat `body` array and no `sections` receive no TOC.

---

## Architecture & Data Flow

Heading data is derived **server-side** in `[slug]/page.tsx` from the existing `project.sections` TypeScript array — no DOM scraping, no new fields in `content/projects.ts`.

```ts
// Derived at render time in [slug]/page.tsx
const headings: Heading[] = [
  ...(project.sections ?? []).map(sec => ({
    label: sec.heading,
    id: toSlugId(sec.heading),
  })),
  ...(project.images?.length ? [{ label: "Gallery", id: "gallery" }] : []),
];

const hasTOC = headings.length >= 2;
```

`toSlugId` is a pure utility — it lowercases the string, replaces spaces with hyphens, and strips characters outside `[a-z0-9-]`.

---

## New Files

### `lib/toc.ts`

Pure utility, no React dependency.

```ts
export function toSlugId(str: string): string
// lowercase → replace spaces with hyphens → strip non [a-z0-9-] → collapse consecutive hyphens
// "Research & Design" → "research-design"
// "Gallery" → "gallery"
```

### `app/components/project-toc.tsx`

Single file, three named exports:

```ts
export type Heading = { label: string; id: string };

// Scroll spy hook — observes heading elements, returns active ID
export function useTOCActiveId(ids: string[]): string;

// Desktop sticky rail — hidden below xl
export function ProjectTOCDesktop({ headings }: { headings: Heading[] }): JSX.Element;

// Mobile inline collapsible — hidden at xl and above
export function ProjectTOCMobile({ headings }: { headings: Heading[] }): JSX.Element;
```

Both components independently call `useTOCActiveId`. Two small `IntersectionObserver` instances watching the same heading nodes — overhead is negligible.

---

## Layout Restructure (`[slug]/page.tsx`)

The article header is unchanged. The body content (sections/body + gallery) is wrapped in a two-column grid that activates at `xl`:

```tsx
<article className="container-page relative pt-20 pb-24 md:pt-28">
  {/* nav row — unchanged */}
  <header className="mt-8 max-w-3xl">...</header>

  <div className="mt-12 xl:grid xl:grid-cols-[minmax(0,1fr)_192px] xl:gap-x-12 xl:items-start">

    <div> {/* content column */}
      {hasTOC && <ProjectTOCMobile headings={headings} />}
      {/* sections or body — max-w-3xl preserved inside */}
      {/* gallery — max-w-4xl preserved inside */}
    </div>

    {hasTOC && (
      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <ProjectTOCDesktop headings={headings} />
        </div>
      </aside>
    )}

  </div>
</article>
```

Grid columns: `minmax(0, 1fr)` (content) + `192px` (sidebar) with `gap-x-12` (3rem). At 1280px viewport the content column is ~830px wide; the existing `max-w-3xl` (768px) on inner divs keeps reading line length comfortable. `sticky top-24` keeps the rail just below the sticky navbar (height ~4rem).

Each rendered `<h2>` for a section gains `id={toSlugId(sec.heading)}`. The Gallery `<h2>` gains `id="gallery"`.

---

## Scroll Spy (`useTOCActiveId`)

```ts
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) setActiveId(visible[0].target.id);
  },
  { rootMargin: "0px 0px -70% 0px", threshold: 0 },
);
```

- `rootMargin: "0px 0px -70% 0px"` — observation window is the top 30% of the viewport. A heading becomes active when it enters this zone.
- Initial `activeId` = `ids[0]` — first heading is always highlighted on load before any scrolling.
- Effect cleanup disconnects the observer on unmount.
- Reduced-motion preference does **not** affect the observer (scroll spy is not an animation). It only affects smooth-scroll on link click.

---

## Visual Design

### Desktop Rail (`ProjectTOCDesktop`)

```
On this page          ← .eyebrow class
──────────────
│ Overview            ← active: border-primary-500, text-primary-700, font-medium
  Research            ← inactive: border-transparent, text-fg-muted
  Design
  Implementation
  Gallery
```

Tailwind classes per link:
- **Shared:** `block border-l-2 pl-3 py-0.5 text-sm leading-relaxed transition-colors duration-150`
- **Inactive:** `border-transparent text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] hover:border-[color:var(--color-border-strong)]`
- **Active:** `border-[color:var(--color-primary-500)] text-[color:var(--color-primary-700)] font-medium`

No background, no card — text and edge line only. Matches the "minimal rail" style chosen during design review.

### Mobile Collapsible (`ProjectTOCMobile`)

Collapsed (default):
```
[ On this page  ▾ ]
```

Expanded:
```
[ On this page  ▴ ]
─────────────────────
│ Overview
  Research
  Design
  Gallery
```

- Trigger: `bg-[color:var(--color-primary-50)] rounded-md px-3 py-2 text-sm font-medium text-[color:var(--color-primary-700)]` with a `ChevronDown` icon that rotates 180° when open (`transition-transform duration-200`)
- Link list: same left-border link style as desktop rail, inside a `mt-2 border-t border-[color:var(--color-border)] pt-2` container
- Clicking any link: closes the drawer + smooth-scrolls to the heading
- Hidden at `xl` and above: `xl:hidden`

### Smooth Scroll

Links use an `onClick` handler calling `scrollIntoView({ behavior: "smooth", block: "start" })` rather than native anchor navigation. This lets the mobile handler also close the drawer in the same event. Respects `prefers-reduced-motion`:

```ts
const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
```

---

## Files Changed

| File | Change |
|---|---|
| `lib/toc.ts` | New — `toSlugId` utility |
| `app/components/project-toc.tsx` | New — hook + two components |
| `app/projects/[slug]/page.tsx` | Add `id` attrs to `<h2>`s, derive `headings`, add grid wrapper, render TOC components |

No changes to `content/projects.ts`, `globals.css`, or any other file.
