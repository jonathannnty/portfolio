<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SEO Conventions

- Root layout (`app/layout.tsx`) sets `metadataBase: new URL("https://www.jonathan-ty.com")` so all relative `openGraph.images` paths resolve correctly.
- Every page file **must** export `metadata` (static pages) or `generateMetadata` (dynamic `[slug]` routes). Both must include an `openGraph` block with at minimum `title`, `description`, and `url`.
- The `<Section>` component renders its `title` prop as `<h2>` by default. Pass `titleAs="h1"` on the **first** (primary) Section of a page to give it the page's `<h1>` and maintain correct `H1 → H2 → H3` heading hierarchy.
- The lightbox raw `<img>` in `app/components/image-lightbox.tsx` is intentional (full-resolution overlay). The ESLint disable comment is correct — do not replace it with `<Image />`.
- `app/sitemap.ts` auto-generates `/sitemap.xml` from `content/projects.ts` and `content/blog.tsx`. Add new routes to the `staticRoutes` array there.
- `public/robots.txt` allows all crawlers and points to the sitemap.
