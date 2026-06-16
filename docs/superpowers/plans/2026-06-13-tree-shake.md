# Tree Shake on Click — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clicking the hero tree triggers a gentle ±2° shimmy animation and spawns 3 leaves that drift off the canopy.

**Architecture:** Two file changes only — new CSS classes in `globals.css` for the shimmy keyframe and one-shot leaf override, and a click handler + imperative leaf-spawning function added to `hero.tsx` via `useEffect`. No new files, no new dependencies.

**Tech Stack:** React (useRef, useEffect), CSS keyframes, vanilla DOM APIs (`createElement`, `appendChild`, `animationend`)

---

### Task 1: Add CSS — shimmy keyframe, spawned-leaf override, pointer-events

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add `transform-origin` to `.hero-tree`**

In `globals.css`, find the `.hero-tree` rule (around line 233) and add `transform-origin: bottom center;` so the tree pivots at its roots when rotated:

```css
.hero-tree {
  position: absolute;
  right: 0;
  bottom: 4rem;
  z-index: 3;
  width: clamp(24rem, 38vw, 46rem);
  height: auto;
  filter: drop-shadow(0 1.25rem 1.75rem rgba(58, 30, 8, 0.18));
  user-select: none;
  transform-origin: bottom center; /* ← ADD */
}
```

- [ ] **Step 2: Add `treeShimmy` keyframe and `.hero-tree-shaking` class**

Directly after the `.hero-tree` rule, add:

```css
@keyframes treeShimmy {
  0%, 100% { transform: rotate(0deg); }
  30%       { transform: rotate(-2deg); }
  70%       { transform: rotate(2deg); }
}

@media (prefers-reduced-motion: no-preference) {
  .hero-tree-shaking {
    animation: treeShimmy 0.5s ease-in-out;
  }
}
```

The `prefers-reduced-motion: no-preference` wrapper means the class has no effect for users who have opted out — no JS check needed.

- [ ] **Step 3: Add `.hero-leaf-spawned` one-shot override**

The existing `.hero-leaf` class runs `animation: heroLeafFall ... infinite`. Spawned leaves must play once and remove themselves. Add this immediately after the `.hero-leaf` rule block (around line 265):

```css
.hero-leaf-spawned {
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
```

- [ ] **Step 4: Enable pointer-events on the tree stage**

The parent `.hero-scene` has `pointer-events: none`. A child can opt back in with `pointer-events: auto`. Find `.hero-tree-stage` (around line 223) and add:

```css
.hero-tree-stage {
  position: absolute;
  right: clamp(-7rem, -7vw, -2rem);
  bottom: clamp(-0.75rem, -1vw, 0rem);
  z-index: 3;
  aspect-ratio: 940 / 998;
  transform-origin: bottom right;
  pointer-events: auto; /* ← ADD: opt back in through pointer-events:none parent */
  cursor: pointer;      /* ← ADD: show hand cursor over the tree area */
}
```

- [ ] **Step 5: Verify CSS compiles — run the dev server**

```bash
npm run dev
```

Expected: no build errors. Open `http://localhost:3000` — the hero should look exactly as before (no visual change yet).

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "style: add tree shimmy keyframe and spawned-leaf override"
```

---

### Task 2: Add click handler and leaf spawning to `hero.tsx`

**Files:**
- Modify: `app/components/hero.tsx`

- [ ] **Step 1: Add refs for the tree stage and leaf field**

At the top of the `Hero` function body, add two new refs alongside the existing `rootRef`:

```tsx
const rootRef = useRef<HTMLDivElement>(null);
const treeStageRef = useRef<HTMLDivElement>(null);   // ← ADD
const leafFieldRef = useRef<HTMLDivElement>(null);   // ← ADD
const shakingRef = useRef(false);                    // ← ADD: cooldown guard
```

- [ ] **Step 2: Attach the refs to the JSX elements**

Find `.hero-tree-stage` and `.hero-leaf-field` in the JSX and add the refs:

```tsx
<div className="hero-tree-stage" ref={treeStageRef}>   {/* ← ADD ref */}
  <div className="hero-leaf-field" ref={leafFieldRef}> {/* ← ADD ref */}
```

- [ ] **Step 3: Add the `spawnLeaf` helper above the component**

Add this function above the `export default function Hero()` line. It creates one leaf element with randomised CSS custom properties, appends it to the leaf field, and removes it when the animation ends:

```tsx
function spawnLeaf(container: HTMLElement): void {
  const rand = (min: number, max: number) =>
    Math.random() * (max - min) + min;
  const sign = () => (Math.random() < 0.5 ? -1 : 1);

  const img = document.createElement("img");
  img.src = "/images/assets/Leaf.svg";
  img.className = "hero-leaf hero-leaf-spawned";
  img.setAttribute("aria-hidden", "true");
  img.setAttribute("alt", "");
  img.width = 97;
  img.height = 127;

  img.style.setProperty("--leaf-top", `${rand(15, 35).toFixed(1)}%`);
  img.style.setProperty("--leaf-left", `${rand(38, 62).toFixed(1)}%`);
  img.style.setProperty("--leaf-scale", `${rand(0.18, 0.30).toFixed(2)}`);
  img.style.setProperty("--leaf-drift", `${(sign() * rand(8, 18)).toFixed(1)}rem`);
  img.style.setProperty("--leaf-drop", `${rand(20, 32).toFixed(1)}rem`);
  img.style.setProperty("--leaf-spin", `${(sign() * rand(180, 360)).toFixed(0)}deg`);
  img.style.setProperty("--leaf-duration", `${rand(8, 12).toFixed(1)}s`);
  img.style.setProperty("--leaf-delay", "0s");

  container.appendChild(img);
  img.addEventListener("animationend", () => img.remove(), { once: true });
}
```

- [ ] **Step 4: Add a second `useEffect` for the click handler**

Add this `useEffect` block after the existing stagger `useEffect` (do not modify the existing one):

```tsx
useEffect(() => {
  const stage = treeStageRef.current;
  const leafField = leafFieldRef.current;
  if (!stage || !leafField) return;

  function handleShake() {
    if (shakingRef.current) return;
    shakingRef.current = true;

    // Animate the tree image
    const treeImg = stage.querySelector<HTMLElement>(".hero-tree");
    if (treeImg) {
      treeImg.classList.add("hero-tree-shaking");
      treeImg.addEventListener(
        "animationend",
        () => {
          treeImg.classList.remove("hero-tree-shaking");
          shakingRef.current = false;
        },
        { once: true }
      );
    }

    // Spawn 3 leaves with a small stagger
    [0, 80, 160].forEach((delay) => {
      setTimeout(() => spawnLeaf(leafField), delay);
    });
  }

  stage.addEventListener("click", handleShake);
  stage.addEventListener("touchstart", handleShake, { passive: true });
  return () => {
    stage.removeEventListener("click", handleShake);
    stage.removeEventListener("touchstart", handleShake);
  };
}, []);
```

- [ ] **Step 5: Verify manually in the browser**

With `npm run dev` running, open `http://localhost:3000`.

Check each of these:
1. The cursor changes to a pointer when hovering over the right side of the hero (the tree area).
2. Clicking the tree area triggers a short left-right sway of the tree.
3. Three leaf SVGs appear near the canopy and drift downward/sideways before disappearing.
4. Clicking again during the shimmy does nothing (cooldown active). After the shimmy ends, clicking works again.
5. In browser DevTools, open the Rendering tab → enable "Emulate CSS media feature `prefers-reduced-motion`: reduce" → confirm no shake or leaves appear on click.

- [ ] **Step 6: Commit**

```bash
git add app/components/hero.tsx
git commit -m "feat: click tree to shimmy and spawn falling leaves"
```
