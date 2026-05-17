# Activity Strip — Design Spec

**Date:** 2026-05-17  
**Branch:** to be implemented on `master` (or a feature branch)  
**Feature:** Collapsible Activity strip on `/blog` showing Spotify "Listening To" widget and GitHub Contribution Heatmap

---

## Overview

A collapsible strip sits on the Blog page between the page `<h1>` and the article list. It defaults to **collapsed**, showing a slim preview bar with real data chips. The blog articles are always fully visible beneath it. Clicking "show" expands the strip to reveal a Spotify widget and a GitHub contribution heatmap side by side.

---

## File Structure

```
app/
  blog/
    page.tsx                        ← RSC; calls lib functions directly
  components/
    activity/
      activity-strip.tsx            ← Client Component (toggle state only)
      spotify-widget.tsx            ← presentational
      github-heatmap.tsx            ← presentational
  api/
    spotify/
      route.ts                      ← calls getSpotifyData(); revalidate: 60
    github/
      route.ts                      ← calls getGitHubData(); revalidate: 3600
lib/
  activity/
    spotify.ts                      ← getSpotifyData() — shared fetch function
    github.ts                       ← getGitHubData() — shared fetch function
```

---

## Data Flow

Shared fetch functions live in `lib/activity/`. Both `page.tsx` and the API route handlers import from these — no HTTP round-trip from the server component to its own routes.

`app/blog/page.tsx` (Server Component):

```ts
import { getSpotifyData } from "@/lib/activity/spotify";
import { getGitHubData } from "@/lib/activity/github";

const [spotify, github] = await Promise.all([
  getSpotifyData(),
  getGitHubData(),
]);
```

Both results are passed as props to `<ActivityStrip>`. Because the fetch happens server-side, the collapsed preview bar is populated in HTML — no loading flash, no client-side waterfall.

The API route handlers (`/api/spotify`, `/api/github`) call the same lib functions and set `revalidate` — they exist for future client-side revalidation needs but are not used by `page.tsx` directly.

`<ActivityStrip>` is the **only** Client Component in this feature. It holds one piece of state (`open: boolean`) and handles the toggle animation. All widget markup is purely presentational and receives its data via props.

---

## API Routes

### `/api/spotify` — `revalidate: 60`

**Env vars required:** `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`

**Logic:**
1. POST to `https://accounts.spotify.com/api/token` with the stored refresh token to obtain a short-lived access token.
2. GET `/v1/me/player/currently-playing`.
3. If the response is 204 (nothing playing) or the track is a podcast, fall back to GET `/v1/me/player/recently-played?limit=1`.
4. If both return nothing, return `null`.

**Response shape:**
```ts
type SpotifyData = {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;   // absolute URL for next/image
  songUrl: string;
} | null
```

**One-time Spotify OAuth setup (to be documented in spec, done manually before deploy):**
1. Create an app at [developer.spotify.com](https://developer.spotify.com/dashboard). Set redirect URI to `http://localhost:3000/callback`.
2. Visit the authorization URL to get an authorization code.
3. Exchange the code for an initial access + refresh token via a one-off `curl` or script.
4. Store `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` in Vercel environment variables (all environments).

---

### `/api/github` — `revalidate: 3600`

**Env vars required:** `GH_TOKEN` (PAT with `read:user` scope only)

**Logic:**
Calls the GitHub GraphQL API endpoint `https://api.github.com/graphql` with a `contributionsCollection` query covering the past 52 weeks.

**Response shape:**
```ts
type GitHubData = {
  totalThisWeek: number;          // for the preview chip
  weeks: { days: number[] }[];    // 52-element array; each day is a contribution count
} | null
```

---

## UI Design

### Collapsed bar (default)

A single-row strip. Layout:

```
[ Activity ]  [ Good Days — SZA ]  [ 147 contributions this week ]    [ show ▼ ]
  mono label        chip                      chip                     ghost btn
```

- "Activity" label: `font-mono text-xs uppercase tracking-widest opacity-50` (matches existing section eyebrow style)
- Preview chips: same `.chip` class used elsewhere in the site
- If Spotify data is `null`, its chip is omitted. If GitHub data is `null`, its chip is omitted. Strip still renders.
- "show ▼" button: `.btn-ghost` with a `▼` chevron icon (Lucide `ChevronDown`)

### Expanded state

A 2-column grid on `sm+`, single column on mobile. Contained inside a CSS grid height-transition wrapper.

**Spotify widget (left column):**
- 48×48 album art via `next/image` (rounded-sm)
- Track name: `font-display font-semibold text-[color:var(--color-fg)]`
- Artist: `font-mono text-xs text-[color:var(--color-fg-muted)]`
- Status label: "Now playing" (if `isPlaying`) or "Last played" (if not) in `font-mono text-xs opacity-50`
- Entire widget links to `songUrl` via `<a target="_blank">`

**GitHub heatmap (right column):**
- 52-column × 7-row grid of small squares (10×10px with 2px gap)
- Four contribution tiers mapped to brand palette:
  - 0 contributions → `var(--color-surface-2)` (empty)
  - 1–3 → `var(--color-primary-200)`
  - 4–9 → `var(--color-primary-400)`
  - 10+ → `var(--color-primary-700)`
- Tooltip on hover showing exact count (via `title` attribute — no JS tooltip library needed)
- Week columns run left (oldest) → right (most recent)

### Toggle animation

CSS `grid-template-rows` transition from `0fr` to `1fr` — no JS height measurement, no layout thrashing.

```css
.activity-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 250ms ease-out;
}
.activity-body.open {
  grid-template-rows: 1fr;
}
.activity-body > div {
  overflow: hidden;
}
```

The chevron icon rotates 180° (`rotate-180`) on open, 250ms ease-out.

Respects `prefers-reduced-motion`: when set, the section appears/disappears instantly (transition duration set to 0ms via the `motion-reduce:` Tailwind variant).

### Placement on the Blog page

```
<h1>Blog</h1>
<ActivityStrip ... />
<hr />
<article list>
```

The strip sits directly below the page heading, separated from the article list by a thin `<hr>`. Blog articles are always fully rendered beneath — the strip is additive, not a gate.

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Spotify env vars missing | Route returns `null`; chip + widget omitted silently |
| Spotify API down / 5xx | Caught, returns `null`; graceful degradation |
| GitHub env var missing | Route returns `null`; chip + widget omitted silently |
| GitHub API down / rate-limited | Caught, returns `null`; graceful degradation |
| Both null | Strip still renders collapsed bar with just the "Activity" label and "show" button (shows nothing on expand — acceptable edge case) |

---

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `SPOTIFY_CLIENT_ID` | Vercel (all envs) | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Vercel (all envs) | Spotify app client secret |
| `SPOTIFY_REFRESH_TOKEN` | Vercel (all envs) | Long-lived refresh token from one-time OAuth |
| `GH_TOKEN` | Vercel (all envs) | GitHub PAT, `read:user` scope only |

**GitHub username** (`jonathannnty`) is hardcoded in `lib/activity/github.ts` — it's a personal portfolio, no need for an env var.

**Spotify image domain** — Spotify album art is served from `i.scdn.co`. Add to `next.config.ts` `images.remotePatterns` so `next/image` can optimize it:
```ts
{ protocol: "https", hostname: "i.scdn.co" }
```

---

## Out of Scope

- Dark mode variants (site is light-only currently)
- Spotify "Add to queue" or playback controls
- GitHub streak counts or language breakdowns
- Animated contribution squares on scroll
- Caching layer beyond Next.js `revalidate`
