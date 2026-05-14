# Experience Rail — Design Spec

**Date:** 2026-05-14
**Status:** Approved

---

## Goal

Replace the current vertical accordion `Timeline` component with a horizontal scrolling filmstrip (`ExperienceRail`) where each role is a card on a rail. Cards expand **wider and taller** in-place when clicked, with anime.js spring animations shifting neighboring cards out of the way. Mobile falls back to the existing vertical layout.

---

## Context

- **Current component:** `app/components/timeline.tsx` — vertical left-border rail, one node per experience, click to expand height only.
- **Data source:** `content/experiences.ts` — `Experience[]` type, 8 entries. **No data changes needed.**
- **Consumer:** `app/about/page.tsx` renders `<Timeline items={sortedExperiences} />`. Only the component name and import path change.
- **Animations:** Uses existing `animejs` dependency (`animate`, `stagger` from `"animejs"`).
- **Fonts:** `font-display` (Ben) for role titles; Nunito Sans (default) for body/meta text.
- **Colors:** All values from existing CSS custom properties — no raw hex.

---

## Layout

### Desktop (≥ `md` / 768px)

```
  ●────────────────────────────────────────────────────────●─ ···
  ↓                                                         ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Jan 2026–Now │  │ Aug 2025–Now │  │ Sep–Oct 2025 │  ···
│ Instructional│  │ IT Technician│  │ AI Research  │
│ Assistant    │  │ UC San Diego │  │ Fellow       │
│ UCSD CSE     │  └──────────────┘  └──────────────┘
└──────────────┘
         ↕ scroll hint fades in on mount
```

- `overflow-x: auto` scroll container with `scroll-behavior: smooth`
- Rail is a 2px horizontal line (`--color-border` → `--color-primary-400` gradient) positioned at the dot centerline
- Dots sit on the rail; cards hang below
- Order: newest → oldest, left to right (matches existing `sortedExperiences` sort)
- A `←  scroll to explore  →` hint renders below the rail on mount; fades out after the first `scroll` event on the container

### Mobile (< `md`)

- Horizontal layout hidden; renders a vertical left-border rail identical in structure to the current `Timeline`
- Cards expand height-only (full container width already), same mechanic
- No scroll hint rendered

---

## Card Anatomy

### Collapsed

| Property | Value |
|----------|-------|
| Width | `144px` |
| Content | Period (monospace, `--color-primary-600`), role (`font-display`, bold), company (`--color-fg-muted`) |
| Cursor | `pointer` |
| Hover | `box-shadow` lift, border to `--color-border-strong` |

### Expanded

| Property | Value |
|----------|-------|
| Width | `320px` |
| Background | gradient `--color-primary-50 → --color-surface` |
| Border | `--color-border-strong` |
| Content | Eyebrow (period · location), role (large, `font-display`), company, divider, highlight bullets, stack chips, optional external link |

Expanded content is hidden from the accessibility tree when collapsed (`aria-hidden="true"`, `visibility: hidden`). The card button carries `aria-expanded`.

---

## Interaction Rules

- **Click to open** → card expands width and height; dot fills and scales
- **Click open card** → collapses back to resting state
- **Click a different card while one is open** → previous card collapses first (instant collapse of content, animated width return), new card expands
- **Only one card open at a time**
- **Keyboard:** `Enter` / `Space` on focused card triggers the same toggle; focus follows the card

---

## Animation Spec

All animations use `animate` / `stagger` from `"animejs"`. Skipped entirely when `prefers-reduced-motion: reduce` is set (content shown/hidden instantly).

| Target | Properties | Duration | Easing | Notes |
|--------|-----------|----------|--------|-------|
| Card shell | `width` 144→320px | 420ms | `outExpo` | Drives the spatial expansion |
| Active dot | `scale` 1→1.25, `background` fill | 250ms | `outBack` | Anchors the card to the rail |
| Expanded body | `opacity` 0→1, `translateY` −6→0 | 300ms, 80ms delay | `outQuint` | Waits for card to start opening |
| Highlight bullets | `opacity` 0→1, `translateX` −8→0 | 360ms, `stagger(40ms, {start:120ms})` | `outExpo` | Cascade entrance |
| Expanding card | `marginRight` grows to push neighbors right | 420ms | `outExpo` | See note below — avoids reflow jank |
| Collapse (width) | `width` 320→144px | 320ms | `inExpo` | Slightly faster exit |
| Collapse (dot) | `scale` 1.25→1, fill reset | 200ms | `outQuint` | |
| Scroll hint | `opacity` 1→0 | 400ms | `outQuint` | Triggered on first scroll event |

**Neighboring card shift approach:** Cards use `margin-right` as their gap. When a card expands, anime.js animates `marginRight` on the card itself (not `translateX` on neighbors) to push subsequent cards right. This avoids reflow jank since margin animation is compositor-friendly in this context and the flex container width is unconstrained (`width: max-content`).

---

## Component API

```tsx
// Same call site as Timeline — drop-in replacement
<ExperienceRail items={sortedExperiences} />
```

```tsx
type ExperienceRailProps = {
  items: Experience[];  // from @/content/experiences
};
```

Internal state: `openId: string | null` — the `id` of the currently expanded card. `null` = all collapsed.

---

## File Changes

| File | Action | Notes |
|------|--------|-------|
| `app/components/timeline.tsx` | **Rewrite** → `ExperienceRail` | Export name changes; same file path to avoid import churn |
| `app/about/page.tsx` | Update import + JSX tag | `Timeline` → `ExperienceRail` |
| `content/experiences.ts` | No change | `Experience` type and data unchanged |
| `AGENTS.md` | Append note | Document `ExperienceRail` as the replacement for `Timeline` |

---

## Out of Scope

- Filtering or searching experiences
- Year-group headers on the rail
- Photo/image display in the expanded card (images already exist in the data; a follow-up can add them)
- Any changes to `content/experiences.ts` data shape
