<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SEO Conventions

- **Font system:** `--font-display` → Ben (custom TTF, headings/display only). `--font-sans` → Nunito Sans (body, UI text). `--font-mono` → JetBrains Mono (code, eyebrows, timestamps). All three are injected as CSS variables from `app/layout.tsx` and consumed via Tailwind utility classes (`font-display`, `font-sans`, `font-mono`). Do not use Ben for body or small text — it is hard to read at small sizes.
- Root layout (`app/layout.tsx`) sets `metadataBase: new URL("https://www.jonathan-ty.com")` so all relative `openGraph.images` paths resolve correctly.
- Every page file **must** export `metadata` (static pages) or `generateMetadata` (dynamic `[slug]` routes). Both must include an `openGraph` block with at minimum `title`, `description`, and `url`.
- The `<Section>` component renders its `title` prop as `<h2>` by default. Pass `titleAs="h1"` on the **first** (primary) Section of a page to give it the page's `<h1>` and maintain correct `H1 → H2 → H3` heading hierarchy.
- The lightbox raw `<img>` in `app/components/image-lightbox.tsx` is intentional (full-resolution overlay). The ESLint disable comment is correct — do not replace it with `<Image />`.
- `app/sitemap.ts` auto-generates `/sitemap.xml` from `content/projects.ts` and `content/blog.tsx`. Add new routes to the `staticRoutes` array there.
- `public/robots.txt` allows all crawlers and points to the sitemap.

# Project Content Conventions

- **`period` field must use a specific month and year** (e.g. `"May 2026"`, `"June 2025"`) — never a season, quarter, or vague range like "Spring 2026" or "Q1 2025". For ongoing projects use `"Ongoing"`. The `sortKey` field uses ISO `yyyy-mm` format and must match the month in `period`.
