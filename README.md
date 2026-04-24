# Portfolio Website

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## About-page Flyover

The /about experience section can render a Strava-style scroll-driven map
flyover instead of the static `Timeline`. The original timeline remains the
fallback and is rendered automatically when:

- `prefers-reduced-motion: reduce` is set, OR
- the feature flag is off (default)

### Enabling

Set in `.env.local`:

```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-public-token
NEXT_PUBLIC_FLYOVER_ENABLED=1
```

URL override (works in any environment): `?flyover=1` or `?flyover=0` on
`/about` flips the flag for the current session.

### Updating the route

1. Export a GPX from Strava (or any GPX source).
2. Replace `data/routes/about.gpx` with the new file.
3. Run `npm run ingest:route`.
4. Commit `data/routes/about.gpx` and the regenerated `public/routes/about.json`.

### Anchoring experience checkpoints to the route

By default, experiences are distributed evenly along the route as a demo. To
pin specific experiences to real geographic locations, add a `geo` field in
`content/experiences.ts`:

```ts
{
  id: "ia-dsa",
  // …
  geo: { lat: 32.8801, lng: -117.2340 },
}
```

Then re-run `npm run ingest:route`. The script snaps each `geo` to the
nearest point on the route at build time and writes it into
`public/routes/about.json`. The runtime engine uses the manifest checkpoints
when any are present and falls back to even distribution only when none are.

### Per-experience flyover hints

You can also customize how a single experience presents in the flyover by
adding an optional `flyover` block on the experience:

```ts
{
  id: "ia-dsa",
  // …
  flyover: {
    slot: "top-right",       // pin card to a specific corner
    emphasis: "high",        // "low" | "normal" | "high"
    window: 0.08,            // override default ±0.06 active window
  },
}
```

All fields optional. `slot` overrides the default diagonal rotation;
`emphasis` scales the marker and widens (high) or tightens (low) the
active window; `window` is an absolute override that wins over emphasis.

### Map theme

The cartographic theme (route, marker, fog colors) lives in
`lib/flyover/themes.ts`. Three presets ship: `natural`, `brand-soft`
(default), `brand-high-contrast`. To switch, change `DEFAULT_THEME_ID`
in that file. Water layers are intentionally never recolored.

## Contact Form

The contact form uses Resend. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in your environment. If you want to override the sender, `CONTACT_FROM_EMAIL` must use a Resend-verified domain; otherwise the app falls back to `onboarding@resend.dev`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
