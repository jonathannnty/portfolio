# Tree Shake on Click — Design Spec

**Date:** 2026-06-13  
**Status:** Approved for implementation

## Summary

Clicking anywhere on the hero's tree/canopy area triggers a gentle shimmy animation — the tree sways ±2° from its roots and 3 leaves drift off softly. A small delightful secret for curious visitors.

## Behavior

- **Trigger:** Click (or `touchstart`) anywhere within the `.hero-tree-stage` div
- **Tree animation:** Single CSS keyframe, ±2°, pivoting from `transform-origin: bottom center`, ~500ms, ease-in-out
- **Leaves:** 3 leaves spawned at randomised positions near the canopy, using the existing `--leaf-*` CSS custom property pattern. Each leaf is an `<img>` pointing at `/images/assets/Leaf.svg`. Removed from DOM on `animationend`.
- **Cooldown:** 800ms debounce — clicking again mid-animation is ignored so animations don't stack.
- **Accessibility:** `motion-safe` guard — no animation fires if the user prefers reduced motion (`prefers-reduced-motion: reduce`).

## Technical approach

### Tree shake

The `.hero-tree` `<img>` element receives a CSS class `tree-shaking` when clicked. That class applies a keyframe animation:

```css
@keyframes tree-shimmy {
  0%, 100% { transform: rotate(0deg); }
  30%       { transform: rotate(-2deg); }
  70%       { transform: rotate(2deg); }
}

.hero-tree.tree-shaking {
  transform-origin: bottom center;
  animation: tree-shimmy 0.5s ease-in-out;
}
```

The class is removed once `animationend` fires (via a one-shot event listener), clearing the way for the next click.

### Leaf spawning

On click, a `spawnLeaf()` helper is called 3 times with a small stagger (0ms / 80ms / 160ms). Each call:

1. Creates an `<img src="/images/assets/Leaf.svg">` element
2. Assigns `.hero-leaf` class (reuses existing animation from `globals.css`)
3. Sets randomised CSS custom properties:
   - `--leaf-top`: random in `15%–35%` (near canopy)
   - `--leaf-left`: random in `38%–62%` (centred on tree)
   - `--leaf-scale`: random in `0.18–0.30`
   - `--leaf-drift`: random in `±8rem – ±18rem`
   - `--leaf-drop`: random in `20rem – 32rem`
   - `--leaf-spin`: random in `±180deg – ±360deg`
   - `--leaf-duration`: random in `8s – 12s`
   - `--leaf-delay`: `0s` (spawned leaves start immediately)
4. Appends to `.hero-leaf-field`
5. Removes itself from DOM on `animationend`

### Component changes

All logic lives in `app/components/hero.tsx` — no new files needed.

- Add a `treeRef` pointing at the `.hero-tree` `<Image>` wrapper div
- Add a `leafFieldRef` pointing at `.hero-leaf-field`
- Add a `shakingRef: useRef(false)` for the cooldown guard
- Wire a click handler to `.hero-tree-stage` via `useEffect`

## Scope

- **In:** click handler, tree shimmy CSS, leaf spawning, cooldown, reduced-motion guard
- **Out:** escalating levels, sound, any other hero changes, mobile-specific layout changes
