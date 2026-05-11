# Project Page Table of Contents — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sticky heading-navigation rail (desktop) and inline collapsible (mobile) to project detail pages, with scroll-spy active-heading tracking.

**Architecture:** Heading data is derived server-side from `project.sections` in `[slug]/page.tsx` and passed as a plain prop to two client components. A `useTOCActiveId` hook runs an `IntersectionObserver` in each component to track the active heading. The page layout gains a two-column grid at `xl` breakpoint that places the rail in a sticky aside column.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS v4, TypeScript, Lucide React, no new dependencies.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/toc.ts` | Create | `toSlugId` utility + `Heading` type |
| `app/components/project-toc.tsx` | Create | `useTOCActiveId` hook, `ProjectTOCDesktop`, `ProjectTOCMobile` |
| `app/projects/[slug]/page.tsx` | Modify | Derive headings, inject IDs, grid wrapper, render TOC |

---

## Task 1: `lib/toc.ts` — slug utility + Heading type

**Files:**
- Create: `lib/toc.ts`

- [ ] **Step 1: Create the file**

```ts
// lib/toc.ts

export type Heading = { label: string; id: string };

export function toSlugId(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/toc.ts
git commit -m "feat: add toSlugId utility and Heading type"
```

---

## Task 2: `useTOCActiveId` hook

**Files:**
- Create: `app/components/project-toc.tsx`

- [ ] **Step 1: Create the file with the hook only**

```tsx
"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/toc";

export type { Heading };

export function useTOCActiveId(ids: string[]): string {
  const [activeId, setActiveId] = useState(ids[0] ?? "");
  const idsKey = ids.join(",");

  useEffect(() => {
    if (!idsKey) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );

    idsKey.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/components/project-toc.tsx
git commit -m "feat: add useTOCActiveId scroll-spy hook"
```

---

## Task 3: `ProjectTOCDesktop` component

**Files:**
- Modify: `app/components/project-toc.tsx`

- [ ] **Step 1: Add `ProjectTOCDesktop` to the end of the file**

Append after the `useTOCActiveId` function:

```tsx
export function ProjectTOCDesktop({ headings }: { headings: Heading[] }) {
  const activeId = useTOCActiveId(headings.map((h) => h.id));

  const handleClick = (id: string) => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
  };

  return (
    <nav aria-label="On this page">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="flex flex-col gap-0.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(h.id);
              }}
              className={[
                "block border-l-2 pl-3 py-0.5 text-sm leading-relaxed transition-colors duration-150",
                activeId === h.id
                  ? "border-[color:var(--color-primary-500)] text-[color:var(--color-primary-700)] font-medium"
                  : "border-transparent text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] hover:border-[color:var(--color-border-strong)]",
              ].join(" ")}
            >
              {h.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/components/project-toc.tsx
git commit -m "feat: add ProjectTOCDesktop sticky rail"
```

---

## Task 4: `ProjectTOCMobile` component

**Files:**
- Modify: `app/components/project-toc.tsx`

- [ ] **Step 1: Add `ChevronDown` to the imports at the top of the file**

Change the first import line from:
```tsx
import { useEffect, useState } from "react";
```
to:
```tsx
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
```

- [ ] **Step 2: Append `ProjectTOCMobile` to the end of the file**

```tsx
export function ProjectTOCMobile({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);
  const activeId = useTOCActiveId(headings.map((h) => h.id));

  const handleClick = (id: string) => {
    setOpen(false);
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
  };

  return (
    <div className="xl:hidden mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-md bg-[color:var(--color-primary-50)] px-3 py-2 text-sm font-medium text-[color:var(--color-primary-700)]"
      >
        <span>On this page</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="mt-2 border-t border-[color:var(--color-border)] pt-2 flex flex-col gap-0.5">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(h.id);
                }}
                className={[
                  "block border-l-2 pl-3 py-0.5 text-sm leading-relaxed transition-colors duration-150",
                  activeId === h.id
                    ? "border-[color:var(--color-primary-500)] text-[color:var(--color-primary-700)] font-medium"
                    : "border-transparent text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] hover:border-[color:var(--color-border-strong)]",
                ].join(" ")}
              >
                {h.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify the full file compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/components/project-toc.tsx
git commit -m "feat: add ProjectTOCMobile inline collapsible"
```

---

## Task 5: Inject IDs into `<h2>` elements + derive headings

**Files:**
- Modify: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Add imports at the top of the file**

After the existing imports, add:
```tsx
import { toSlugId } from "@/lib/toc";
import type { Heading } from "@/lib/toc";
import { ProjectTOCDesktop, ProjectTOCMobile } from "@/app/components/project-toc";
```

- [ ] **Step 2: Derive `headings` and `hasTOC` inside `ProjectDetailPage`, right before the `return`**

```tsx
const headings: Heading[] = [
  ...(project.sections ?? []).map((sec) => ({
    label: sec.heading,
    id: toSlugId(sec.heading),
  })),
  ...(project.images?.length ? [{ label: "Gallery", id: "gallery" }] : []),
];
const hasTOC = headings.length >= 2;
```

- [ ] **Step 3: Add `id` to each section `<h2>`**

Find this in the sections render block (around line 136):
```tsx
<h2 className="font-display text-2xl font-bold tracking-tight text-[color:var(--color-fg)]">
  {sec.heading}
</h2>
```

Replace with:
```tsx
<h2
  id={toSlugId(sec.heading)}
  className="font-display text-2xl font-bold tracking-tight text-[color:var(--color-fg)]"
>
  {sec.heading}
</h2>
```

- [ ] **Step 4: Add `id="gallery"` to the Gallery `<h2>`**

Find this (around line 227):
```tsx
<h2 className="font-display text-xl font-semibold tracking-tight text-[color:var(--color-fg)] mb-5">
  Gallery
</h2>
```

Replace with:
```tsx
<h2
  id="gallery"
  className="font-display text-xl font-semibold tracking-tight text-[color:var(--color-fg)] mb-5"
>
  Gallery
</h2>
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add app/projects/[slug]/page.tsx
git commit -m "feat: inject heading IDs and derive TOC headings"
```

---

## Task 6: Grid wrapper + render TOC components

**Files:**
- Modify: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Wrap the content + gallery blocks in a grid wrapper**

This is a structural change to two outer divs only — all inner JSX (the sections loop, body paragraphs, gallery images) stays byte-for-byte identical.

**Remove** the `mt-12` from the opening tags of the sections/body conditional divs — it moves to the new outer wrapper.

Make three edits:

**Edit A** — add the opening grid wrapper + content column `<div>` and mobile TOC, immediately before the ternary that renders sections vs body. Insert these two lines:
```tsx
      <div className={`mt-12${hasTOC ? " xl:grid xl:grid-cols-[minmax(0,1fr)_192px] xl:gap-x-12 xl:items-start" : ""}`}>
        <div>
          {hasTOC && <ProjectTOCMobile headings={headings} />}
```

**Edit B** — change the opening `<div>` of the sections branch from:
```tsx
        <div className="mt-12 max-w-3xl">
```
to:
```tsx
          <div className="max-w-3xl">
```

And change the opening `<div>` of the body (else) branch from:
```tsx
        <div className="mt-12 max-w-3xl space-y-5">
```
to:
```tsx
          <div className="max-w-3xl space-y-5">
```

**Edit C** — after the gallery block's closing `</div>`, close the content column `<div>` and add the aside. Then close the outer grid wrapper:
```tsx
        </div>

        {hasTOC && (
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <ProjectTOCDesktop headings={headings} />
            </div>
          </aside>
        )}
      </div>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Run the dev server and manually verify**

Run: `npm run dev`

Open a project with multiple sections (e.g. `http://localhost:3000/projects/cogs127-case-study` or any slug that has `sections`).

Check:
- At ≥1280px wide: sticky rail appears on the right, "On this page" eyebrow visible, active heading highlighted in brand brown as you scroll
- At <1280px: rail is hidden, "On this page" pill appears above content, tapping it expands the link list, tapping a link closes the drawer and scrolls
- On a project with only 0–1 headings (e.g. one with just a `body` array): no TOC rendered at all
- Scroll past sections slowly — active heading border updates without jank
- Click a link in either TOC — page smooth-scrolls to heading, active state updates

- [ ] **Step 4: Run a production build to verify no build errors**

Run: `npm run build`
Expected: build completes with no TypeScript or Next.js errors

- [ ] **Step 5: Commit**

```bash
git add app/projects/[slug]/page.tsx
git commit -m "feat: add project page TOC with scroll spy"
```
