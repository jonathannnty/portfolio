/**
 * Card slot system. Each checkpoint card lands in one of these slots so
 * the experience cards visibly move around the map instead of stacking
 * in one corner. Rotation is deterministic by checkpoint index.
 */

export type CardSlot =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

/**
 * Desktop rotation. Order is chosen so adjacent checkpoints land in
 * diagonal corners — maximum perceived motion between transitions.
 */
const DESKTOP_SLOT_CYCLE: CardSlot[] = [
  "bottom-left",
  "top-right",
  "bottom-right",
  "top-left",
];

/** Mobile collapses everything to bottom — narrow viewports can't share space. */
const MOBILE_SLOT_CYCLE: CardSlot[] = ["bottom-left"];

export type SlotResolver = {
  /** All slots that may be assigned in the current viewport. */
  available: readonly CardSlot[];
  /** Resolve the slot for a checkpoint, optionally honoring an authoring hint. */
  resolve(index: number, hint?: CardSlot): CardSlot;
};

export function createSlotResolver(isMobile: boolean): SlotResolver {
  const cycle = isMobile ? MOBILE_SLOT_CYCLE : DESKTOP_SLOT_CYCLE;
  return {
    available: cycle,
    resolve(index, hint) {
      if (hint && cycle.includes(hint)) return hint;
      return cycle[((index % cycle.length) + cycle.length) % cycle.length];
    },
  };
}

/** Tailwind position classes per slot. Safe-zone padding accounts for
 *  the in-map hint chip (top-right) and Mapbox attribution (bottom-right). */
export const SLOT_POSITION: Record<CardSlot, string> = {
  // BL bottom offset clears the in-map legend pill.
  "bottom-left": "left-4 bottom-14 sm:left-6 sm:bottom-16",
  // BR bottom offset clears Mapbox attribution.
  "bottom-right": "right-4 bottom-12 sm:right-6 sm:bottom-14",
  "top-left": "left-4 top-4 sm:left-6 sm:top-6",
  // TR top offset clears the "Scroll to fly" hint chip.
  "top-right": "right-4 top-14 sm:right-6 sm:top-16",
};

/** Per-slot CSS animation name for card entry. Defined in globals.css. */
export const SLOT_ENTRY_ANIM: Record<CardSlot, string> = {
  "bottom-left": "flyover-card-in-bl",
  "bottom-right": "flyover-card-in-br",
  "top-left": "flyover-card-in-tl",
  "top-right": "flyover-card-in-tr",
};
