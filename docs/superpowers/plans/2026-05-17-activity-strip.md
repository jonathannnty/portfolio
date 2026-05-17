# Activity Strip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a collapsible "Activity" strip to `/blog` showing a Spotify "Listening To" widget and a GitHub Contribution Heatmap, defaulting to collapsed with real-data preview chips.

**Architecture:** Two shared lib functions (`lib/activity/github.ts`, `lib/activity/spotify.ts`) are called in parallel from a dedicated async Server Component inside the Blog page. Data is passed as props into `<ActivityStrip>` (a Client Component that owns only the toggle state). The blog posts render in the static shell independently of the strip.

**Tech Stack:** Next.js 16 App Router, React 19 Server/Client Components, TypeScript, Tailwind CSS v4, Spotify Web API, GitHub GraphQL API, `next/image`, Lucide React icons.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `next.config.ts` | Modify | Add `i.scdn.co` to `images.remotePatterns` |
| `lib/activity/github.ts` | Create | `getGitHubData()` — GitHub GraphQL fetch + data transform |
| `lib/activity/spotify.ts` | Create | `getSpotifyData()` — token refresh + currently/recently playing |
| `app/api/github/route.ts` | Create | GET handler proxying `getGitHubData()` |
| `app/api/spotify/route.ts` | Create | GET handler proxying `getSpotifyData()` |
| `app/components/activity/github-heatmap.tsx` | Create | 52×7 contribution grid (presentational) |
| `app/components/activity/spotify-widget.tsx` | Create | Album art + track info link (presentational) |
| `app/components/activity/activity-strip.tsx` | Create | Client Component — toggle state + CSS height animation |
| `app/blog/page.tsx` | Modify | Add `<ActivityData>` async component + Suspense wrapper |

---

## Task 1: Add Spotify image domain to next.config.ts

**Files:**
- Modify: `next.config.ts`

Spotify serves album art from `i.scdn.co`. Next.js blocks external images unless you allow the hostname.

- [ ] **Step 1: Add remotePatterns**

Open `next.config.ts` and replace the entire file with:

```ts
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["100.83.35.193", "localhost", "127.0.0.1"],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: allow Spotify image domain for next/image"
```

---

## Task 2: GitHub data lib function

**Files:**
- Create: `lib/activity/github.ts`

- [ ] **Step 1: Create the file**

Create `lib/activity/github.ts`:

```ts
export type GitHubData = {
  totalThisWeek: number;
  weeks: { days: number[] }[];
} | null;

const GRAPHQL_URL = "https://api.github.com/graphql";
const USERNAME = "jonathannnty";

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export async function getGitHubData(): Promise<GitHubData> {
  const token = process.env.GH_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    const weeks: { days: number[] }[] = calendar.weeks.map(
      (w: { contributionDays: { contributionCount: number }[] }) => ({
        days: w.contributionDays.map((d) => d.contributionCount),
      }),
    );

    const lastWeek = weeks[weeks.length - 1];
    const totalThisWeek = lastWeek
      ? lastWeek.days.reduce((sum, n) => sum + n, 0)
      : 0;

    return { totalThisWeek, weeks };
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/activity/github.ts
git commit -m "feat: add getGitHubData lib function"
```

---

## Task 3: Spotify data lib function

**Files:**
- Create: `lib/activity/spotify.ts`

The Spotify "currently playing" endpoint requires a short-lived access token obtained by exchanging a stored refresh token. If nothing is playing, fall back to the "recently played" endpoint.

- [ ] **Step 1: Create the file**

Create `lib/activity/spotify.ts`:

```ts
export type SpotifyData = {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;
  songUrl: string;
} | null;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const { access_token } = await res.json();
  return (access_token as string) ?? null;
}

export async function getSpotifyData(): Promise<SpotifyData> {
  const token = await getAccessToken();
  if (!token) return null;

  const authHeader = { Authorization: `Bearer ${token}` };

  try {
    const nowRes = await fetch(NOW_PLAYING_URL, {
      headers: authHeader,
      next: { revalidate: 60 },
    });

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      if (data?.item && data?.currently_playing_type === "track") {
        return {
          isPlaying: data.is_playing as boolean,
          title: data.item.name as string,
          artist: (data.item.artists as { name: string }[])
            .map((a) => a.name)
            .join(", "),
          albumArt: (data.item.album.images as { url: string }[])[0]?.url ?? "",
          songUrl: data.item.external_urls.spotify as string,
        };
      }
    }

    const recentRes = await fetch(RECENTLY_PLAYED_URL, {
      headers: authHeader,
      next: { revalidate: 60 },
    });

    if (!recentRes.ok) return null;

    const recent = await recentRes.json();
    const track = recent?.items?.[0]?.track;
    if (!track) return null;

    return {
      isPlaying: false,
      title: track.name as string,
      artist: (track.artists as { name: string }[]).map((a) => a.name).join(", "),
      albumArt: (track.album.images as { url: string }[])[0]?.url ?? "",
      songUrl: track.external_urls.spotify as string,
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/activity/spotify.ts
git commit -m "feat: add getSpotifyData lib function with refresh-token flow"
```

---

## Task 4: GitHub API route handler

**Files:**
- Create: `app/api/github/route.ts`

- [ ] **Step 1: Create the file**

Create `app/api/github/route.ts`:

```ts
import { getGitHubData } from "@/lib/activity/github";

export const revalidate = 3600;

export async function GET() {
  const data = await getGitHubData();
  if (!data) return new Response(null, { status: 204 });
  return Response.json(data);
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/github/route.ts
git commit -m "feat: add /api/github route handler"
```

---

## Task 5: Spotify API route handler

**Files:**
- Create: `app/api/spotify/route.ts`

- [ ] **Step 1: Create the file**

Create `app/api/spotify/route.ts`:

```ts
import { getSpotifyData } from "@/lib/activity/spotify";

export const revalidate = 60;

export async function GET() {
  const data = await getSpotifyData();
  if (!data) return new Response(null, { status: 204 });
  return Response.json(data);
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/spotify/route.ts
git commit -m "feat: add /api/spotify route handler"
```

---

## Task 6: GitHub heatmap component

**Files:**
- Create: `app/components/activity/github-heatmap.tsx`

The heatmap is a 52-column × 7-row grid of small squares. Columns = weeks (oldest → newest left → right). Rows = days (Sun → Sat top → bottom). Color maps contribution count to four tiers of the brand palette.

- [ ] **Step 1: Create the file**

Create `app/components/activity/github-heatmap.tsx`:

```tsx
import type { GitHubData } from "@/lib/activity/github";

type Props = { data: NonNullable<GitHubData> };

function tier(count: number): string {
  if (count === 0)
    return "bg-[color:var(--color-surface-muted)]";
  if (count <= 3)
    return "bg-[color:var(--color-primary-200)]";
  if (count <= 9)
    return "bg-[color:var(--color-primary-400)]";
  return "bg-[color:var(--color-primary-700)]";
}

export default function GitHubHeatmap({ data }: Props) {
  return (
    <div className="flex gap-[3px] overflow-x-auto" aria-label="GitHub contribution heatmap">
      {data.weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.days.map((count, di) => (
            <div
              key={di}
              title={`${count} contribution${count !== 1 ? "s" : ""}`}
              className={`h-[10px] w-[10px] rounded-[2px] ${tier(count)}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/activity/github-heatmap.tsx
git commit -m "feat: add GitHubHeatmap component"
```

---

## Task 7: Spotify widget component

**Files:**
- Create: `app/components/activity/spotify-widget.tsx`

- [ ] **Step 1: Create the file**

Create `app/components/activity/spotify-widget.tsx`:

```tsx
import Image from "next/image";
import type { SpotifyData } from "@/lib/activity/spotify";

type Props = { data: NonNullable<SpotifyData> };

export default function SpotifyWidget({ data }: Props) {
  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 group/spotify min-w-0"
    >
      {data.albumArt && (
        <Image
          src={data.albumArt}
          alt={`${data.title} album art`}
          width={48}
          height={48}
          className="rounded-sm flex-none"
        />
      )}
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-0.5">
          {data.isPlaying ? "Now playing" : "Last played"}
        </p>
        <p className="font-display font-semibold text-sm text-[color:var(--color-fg)] truncate transition-colors duration-150 group-hover/spotify:text-[color:var(--color-primary-700)]">
          {data.title}
        </p>
        <p className="font-mono text-xs text-[color:var(--color-fg-muted)] truncate">
          {data.artist}
        </p>
      </div>
    </a>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/activity/spotify-widget.tsx
git commit -m "feat: add SpotifyWidget component"
```

---

## Task 8: ActivityStrip component

**Files:**
- Create: `app/components/activity/activity-strip.tsx`

This is the only Client Component in the feature. It holds `open: boolean` and handles the CSS `grid-template-rows` height animation. Everything else is passed as props.

The animation uses `grid-template-rows: 0fr → 1fr` on a grid wrapper, with an inner div that has `overflow: hidden`. This technique requires no JS height measurement and causes no layout thrashing.

- [ ] **Step 1: Create the file**

Create `app/components/activity/activity-strip.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SpotifyWidget from "./spotify-widget";
import GitHubHeatmap from "./github-heatmap";
import type { SpotifyData } from "@/lib/activity/spotify";
import type { GitHubData } from "@/lib/activity/github";

type Props = {
  spotify: SpotifyData;
  github: GitHubData;
};

export default function ActivityStrip({ spotify, github }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 border-b border-[color:var(--color-border)] pb-2">
      {/* Collapsed bar — always visible */}
      <div className="flex items-center gap-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 flex-none">
          Activity
        </span>

        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          {spotify && (
            <span className="chip text-xs truncate max-w-[200px]">
              {spotify.title} — {spotify.artist}
            </span>
          )}
          {github && github.totalThisWeek > 0 && (
            <span className="chip text-xs flex-none whitespace-nowrap">
              {github.totalThisWeek} contributions this week
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="btn-ghost flex items-center gap-1 text-xs flex-none py-1 px-2"
          aria-expanded={open}
          aria-label={open ? "Collapse activity section" : "Expand activity section"}
        >
          {open ? "hide" : "show"}
          <ChevronDown
            className={`h-3.5 w-3.5 motion-reduce:transition-none transition-transform duration-[250ms] ease-out ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expandable body — CSS grid-template-rows trick, no JS height measurement */}
      <div
        aria-hidden={!open || undefined}
        className="grid motion-reduce:transition-none"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 250ms ease-out",
        }}
      >
        <div className="overflow-hidden">
          <div className="grid sm:grid-cols-2 gap-6 pb-4 pt-2">
            {spotify ? (
              <SpotifyWidget data={spotify} />
            ) : (
              <p className="font-mono text-xs text-[color:var(--color-fg-subtle)]">
                Not listening right now.
              </p>
            )}
            {github ? (
              <GitHubHeatmap data={github} />
            ) : (
              <p className="font-mono text-xs text-[color:var(--color-fg-subtle)]">
                GitHub data unavailable.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/activity/activity-strip.tsx
git commit -m "feat: add ActivityStrip client component with CSS height animation"
```

---

## Task 9: Wire up the blog page

**Files:**
- Modify: `app/blog/page.tsx`

The blog page gets a dedicated async Server Component (`ActivityData`) that fetches both data sources in parallel and renders the strip. It is wrapped in `<Suspense>` with a fixed-height skeleton so the blog posts below it don't shift when the strip loads in.

- [ ] **Step 1: Update the file**

Replace `app/blog/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import Section from "../components/section";
import BlogCard from "../components/blog-card";
import RevealProvider from "../components/reveal-provider";
import BlogIllustration from "../components/illustrations/blog-illustration";
import ActivityStrip from "../components/activity/activity-strip";
import { posts } from "@/content/blog";
import { site } from "@/content/site";
import { getSpotifyData } from "@/lib/activity/spotify";
import { getGitHubData } from "@/lib/activity/github";

export const metadata: Metadata = {
  title: "Blog",
  description: "Occasional writing on things I'm building, reading, or thinking about.",
  openGraph: {
    title: `Blog — ${site.name}`,
    description: "Occasional writing on things I'm building, reading, or thinking about.",
    url: "/blog",
  },
};

async function ActivityData() {
  const [spotify, github] = await Promise.all([getSpotifyData(), getGitHubData()]);
  return <ActivityStrip spotify={spotify} github={github} />;
}

function ActivitySkeleton() {
  // Fixed height matches the collapsed bar so blog posts don't shift when strip loads
  return <div className="h-10 mb-8" aria-hidden="true" />;
}

export default function BlogIndexPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <RevealProvider />
      <Section
        eyebrow="Blog"
        title="Notes & writing."
        subtitle="Occasional posts here and there. No schedule, it's just whenever I feel like writing."
        illustration={<BlogIllustration />}
        titleAs="h1"
      >
        <Suspense fallback={<ActivitySkeleton />}>
          <ActivityData />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2">
          {sorted.map((p) => (
            <div key={p.slug} className="reveal">
              <BlogCard post={p} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and open /blog**

```bash
npm run dev
```

Open `http://localhost:3000/blog`. Expected without env vars set:
- Blog page loads normally
- Activity strip shows with "Activity" label, no preview chips, "show" button
- Clicking "show" expands the strip showing "Not listening right now." and "GitHub data unavailable."
- Blog cards render below, unaffected

- [ ] **Step 4: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: integrate ActivityStrip into blog page with Suspense streaming"
```

---

## Task 10: Add env vars and verify with real data

**Steps:**

- [ ] **Step 1: Set up Spotify Developer App (one-time)**

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and create a new app.
2. Set the Redirect URI to `http://localhost:3000/callback` in the app settings.
3. Note your **Client ID** and **Client Secret**.

- [ ] **Step 2: Get a Spotify refresh token (one-time)**

Run this in your browser, substituting your client ID:

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing%20user-read-recently-played
```

After authorizing, Spotify redirects to `http://localhost:3000/callback?code=AUTH_CODE`. Copy the `AUTH_CODE`.

Then run this curl command, substituting your credentials and the auth code:

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
  -d "grant_type=authorization_code&code=AUTH_CODE&redirect_uri=http://localhost:3000/callback"
```

The response contains `refresh_token` — copy it.

- [ ] **Step 3: Get a GitHub PAT (one-time)**

Go to [github.com/settings/tokens](https://github.com/settings/tokens) → "Generate new token (classic)" → select `read:user` scope only → Generate → copy the token.

- [ ] **Step 4: Add env vars to a local .env.local file**

Create `.env.local` at the project root (it's already in `.gitignore`):

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
GH_TOKEN=your_github_pat
```

- [ ] **Step 5: Restart dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000/blog`. Expected:
- Collapsed bar shows a chip with your current/recent Spotify track
- Collapsed bar shows a chip with your GitHub contribution count for this week
- Clicking "show" reveals the Spotify widget (album art + track name + artist)
- Clicking "show" reveals the GitHub heatmap (52-week grid in warm brown tones)
- Clicking "hide" collapses back with smooth animation
- Resize to mobile (< 640px): widgets stack vertically

- [ ] **Step 6: Add env vars to Vercel**

```bash
# If Vercel CLI is installed:
vercel env add SPOTIFY_CLIENT_ID
vercel env add SPOTIFY_CLIENT_SECRET
vercel env add SPOTIFY_REFRESH_TOKEN
vercel env add GH_TOKEN
```

Or add them manually via the Vercel dashboard → Project → Settings → Environment Variables.

- [ ] **Step 7: Build check**

```bash
npm run build
```

Expected: build succeeds with no type errors or compilation failures.

- [ ] **Step 8: Commit any remaining changes**

```bash
git add .env.local  # do NOT commit this — verify it's gitignored
git status          # confirm .env.local is not staged
git commit -m "feat: activity strip complete — Spotify + GitHub heatmap on /blog"
```
