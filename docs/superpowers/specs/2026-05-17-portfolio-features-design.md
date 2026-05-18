# Portfolio Features Design
**Date:** 2026-05-17
**Status:** Approved

## Overview

Three independent features to be built for the portfolio site:

1. **Command Palette** — `⌘K` / `Ctrl+K` modal for navigation and actions
2. **Page Transitions** — wipe/reveal curtain animation between routes
3. **Spotify Auto-Update** — client-side polling to keep the Spotify widget fresh

---

## 1. Command Palette

### Dependencies
- `cmdk` (headless command menu, ~5KB)

### Architecture
A single client component `app/components/command-palette.tsx`, mounted once in `app/layout.tsx` so it is globally available on every page.

### Keyboard Shortcut
`⌘K` on Mac, `Ctrl+K` on Windows/Linux. Registered via a `useEffect` `keydown` listener on `document`. Dismissed with `Escape` or clicking outside the modal.

### Items

| Group | Items | Behavior |
|---|---|---|
| Navigate | Home `/`, About `/about`, Blog `/blog`, Projects `/projects`, Contact `/contact` | `router.push(href)` |
| Content | All blog posts (from `content/blog.tsx`), all projects (from `content/projects.ts`) | `router.push(href)` |
| Actions | Copy email | `navigator.clipboard.writeText` |
| Actions | Download resume | Open `/resume.pdf` in new tab |
| Actions | Open GitHub | Open GitHub URL in new tab |
| Actions | Open LinkedIn | Open LinkedIn URL in new tab |

Content items (blog posts, projects) are sourced statically from the existing content files — no additional API calls needed. `cmdk` handles fuzzy filtering of all items against the search input automatically.

### UI
- Fixed full-screen backdrop with `backdrop-blur` and a semi-transparent overlay
- Centered modal panel, max-width ~560px
- Search input at top, placeholder: `"Search…"`
- Grouped result list below with group labels
- Styled using existing CSS variables: `--color-surface`, `--color-border`, `--color-fg`, `--color-primary-700`
- Typography: `font-mono` for group labels and action items, `font-display` for nav/content item titles

### Keyboard UX
- `↑` / `↓` — move selection
- `Enter` — execute selected item
- `Escape` — close
- Click outside — close

---

## 2. Page Transitions

### Dependencies
None — pure CSS + React.

### Effect
A full-screen fixed "curtain" div at `z-50` colored `--color-primary-700` sweeps in from the left edge (covering the screen), then sweeps out to the right (revealing the new page). Each sweep takes ~300ms via a CSS `transform: translateX` transition.

### Architecture — Two Components

#### `TransitionProvider` (`app/components/transition-provider.tsx`)
- React context exposing `triggerTransition(href: string): Promise<void>`
- Renders the curtain overlay div
- Curtain state machine: `idle → entering → visible → exiting → idle`
- Watches `usePathname()` — when the path changes (new page rendered), moves from `visible` to `exiting`, then back to `idle` after the exit animation completes
- Mounted once in `app/layout.tsx`, wrapping children

#### `TransitionLink` (`app/components/transition-link.tsx`)
- Drop-in client wrapper around Next.js `<Link>`
- On click: prevents default navigation → calls `triggerTransition(href)` → awaits the entering phase (~300ms) → calls `router.push(href)`
- Accepts all props that Next.js `<Link>` accepts, passes them through

### Navigation Flow
```
User clicks TransitionLink
  → curtain sweeps IN from left (300ms, covers screen)
  → router.push(href) fires
  → Next.js renders new page behind curtain
  → usePathname() detects path change
  → curtain sweeps OUT to right (300ms, reveals new page)
```

### Migration
All `<Link>` components in navigation-bearing components (primarily `MenuBar`) are replaced with `<TransitionLink>`. Internal `<Link>` usages that are not navigation links (e.g. project cards, blog cards) are also replaced so transitions feel consistent.

### Accessibility
- Respects `prefers-reduced-motion`: if enabled, the curtain skips CSS transitions entirely (instant cut with no animation)
- The curtain div is `aria-hidden="true"`

---

## 3. Spotify Auto-Update

### Dependencies
- `swr`

### Strategy
Server initial data + client polling. The server renders the widget immediately (no loading flash), then SWR takes over on the client and revalidates every 60 seconds.

### Data Flow

**On server render:**
```
ActivityData (server component)
  → calls getSpotifyData()
  → passes result as prop to SpotifyWidget
  → widget renders immediately with server data
```

**On client, every 60 seconds:**
```
SpotifyWidget (SWR)
  → GET /api/spotify
  → updates state in place
  → re-renders widget with fresh data
```

### Component Changes

**`app/components/activity/spotify-widget.tsx`**
- Add `"use client"` directive
- Prop signature changes: accepts `initialData: SpotifyData` instead of `data: SpotifyData`
- Internally uses `useSWR('/api/spotify', fetcher, { fallbackData: initialData, refreshInterval: 60_000 })`
- All existing UI remains unchanged — only the data source changes

**`app/components/activity/activity-strip.tsx`**
- No changes needed — continues passing the server-fetched spotify data down as `initialData`

**`app/blog/page.tsx`**
- No changes needed — `ActivityData` server component continues fetching and passing data

### Edge Cases
SWR handles automatically:
- Tab refocus revalidation (revalidates when user returns to tab)
- Error retries with exponential backoff
- Request deduplication

### API Route
`/api/spotify/route.ts` already exists and returns the correct shape. No changes needed.

---

## File Manifest

| File | Status |
|---|---|
| `app/components/command-palette.tsx` | New |
| `app/components/transition-provider.tsx` | New |
| `app/components/transition-link.tsx` | New |
| `app/components/activity/spotify-widget.tsx` | Modify |
| `app/layout.tsx` | Modify (mount CommandPalette, TransitionProvider) |
| `app/components/menu-bar.tsx` | Modify (Link → TransitionLink) |
| `app/components/blog-card.tsx` | Modify (Link → TransitionLink) |
| `app/components/project-card.tsx` | Modify (Link → TransitionLink, if applicable) |
