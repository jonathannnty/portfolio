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

# Experience Rail

- `ExperienceRail` (exported from `app/components/timeline.tsx`) is the replacement for the old `Timeline` component. The export name changed but the **file path did not** — existing imports of `"../components/timeline"` are unaffected.
- Consumer: `app/about/page.tsx` renders `<ExperienceRail items={sortedExperiences} />`. The prop interface is identical to the old `Timeline` — `{ items: Experience[] }`.
- Desktop (`≥ md`): horizontal-scroll filmstrip with a dot-anchored rail line, collapsed cards at 144 px, expanded cards at 320 px. Clicking a card runs anime.js animations (card width, dot scale, marginRight push, content fade + bullet stagger). Only one card open at a time.
- Mobile (`< md`): vertical left-border accordion, identical layout to the old Timeline. Expanded content is handled by the `MobileExpandedBody` sub-component (same file), which includes images via `ImageLightbox`.
- All anime.js calls are gated behind `prefersReducedMotion()`. When reduced motion is set, styles are applied instantly without transitions.
- Images in expanded desktop cards are **out of scope** (follow-up task). Images still appear in the mobile expanded body.
