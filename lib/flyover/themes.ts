/**
 * Map theme presets for the About-page flyover. A theme controls every
 * pixel of non-terrain color on top of the Mapbox base style: the route
 * line + casing, the three marker states (base/active/completed), the
 * atmosphere/fog, and optional style-layer desaturation for the land base.
 *
 * Water is deliberately not theme-controlled — it always stays blue so
 * the geographic read (coast, bay, inlet) is never lost.
 */

export type MapTheme = {
  id: "natural" | "brand-soft" | "brand-high-contrast";
  label: string;
  route: {
    line: string;
    casing: string;
    lineWidth: number;
    casingWidth: number;
    casingOpacity: number;
  };
  marker: {
    base: string;
    baseBorder: string;
    baseText: string;
    active: string;
    activeBorder: string;
    activeText: string;
    completed: string;
    completedBorder: string;
    completedText: string;
  };
  fog: {
    color: string;
    highColor: string;
    horizonBlend: number;
  };
  /**
   * If set, non-water land layers are desaturated by this amount (0..1)
   * via style-layer paint overrides after the base style loads. Keeps the
   * brand route/markers visually dominant.
   */
  landDesaturation?: number;
};

// All colors pulled from app/globals.css tokens so the theme can never
// drift from the rest of the site.
const TOKEN = {
  primary500: "#a86e2a",
  primary600: "#8b5820",
  primary700: "#6e4218",
  primary200: "#e8c9a0",
  primary100: "#f5e6d0",
  primary50: "#fdf8f3",
  accent: "#d97706",
  bg: "#faf7f4",
  surface: "#ffffff",
  fg: "#1c1108",
  fgMuted: "#5c4a38",
  success: "#15803d",
} as const;

export const NATURAL: MapTheme = {
  id: "natural",
  label: "Natural",
  route: {
    line: "#fc5200", // strava orange — reads as "this is a run"
    casing: "#0b1020",
    lineWidth: 4,
    casingWidth: 7,
    casingOpacity: 0.55,
  },
  marker: {
    base: "#fc5200",
    baseBorder: "#ffffff",
    baseText: "#ffffff",
    active: "#ffffff",
    activeBorder: "#fc5200",
    activeText: "#fc5200",
    completed: TOKEN.fgMuted,
    completedBorder: "#ffffff",
    completedText: "#ffffff",
  },
  fog: {
    color: "rgba(245, 230, 208, 0.85)",
    highColor: "rgb(180, 200, 220)",
    horizonBlend: 0.18,
  },
};

export const BRAND_SOFT: MapTheme = {
  id: "brand-soft",
  label: "Brand Soft",
  route: {
    line: TOKEN.primary600,
    casing: TOKEN.primary100,
    lineWidth: 4,
    casingWidth: 8,
    casingOpacity: 0.85,
  },
  marker: {
    base: TOKEN.primary500,
    baseBorder: TOKEN.surface,
    baseText: TOKEN.surface,
    active: TOKEN.surface,
    activeBorder: TOKEN.primary600,
    activeText: TOKEN.primary700,
    completed: TOKEN.primary200,
    completedBorder: TOKEN.surface,
    completedText: TOKEN.primary700,
  },
  fog: {
    color: "rgba(245, 230, 208, 0.9)",
    highColor: "rgb(200, 210, 220)",
    horizonBlend: 0.2,
  },
  landDesaturation: 0.25,
};

export const BRAND_HIGH_CONTRAST: MapTheme = {
  id: "brand-high-contrast",
  label: "Brand High Contrast",
  route: {
    line: TOKEN.accent,
    casing: TOKEN.fg,
    lineWidth: 5,
    casingWidth: 10,
    casingOpacity: 0.7,
  },
  marker: {
    base: TOKEN.accent,
    baseBorder: TOKEN.surface,
    baseText: TOKEN.fg,
    active: TOKEN.surface,
    activeBorder: TOKEN.accent,
    activeText: TOKEN.accent,
    completed: TOKEN.fgMuted,
    completedBorder: TOKEN.surface,
    completedText: TOKEN.surface,
  },
  fog: {
    color: "rgba(28, 17, 8, 0.5)",
    highColor: "rgb(80, 90, 110)",
    horizonBlend: 0.25,
  },
  landDesaturation: 0.55,
};

export const THEMES: Record<MapTheme["id"], MapTheme> = {
  natural: NATURAL,
  "brand-soft": BRAND_SOFT,
  "brand-high-contrast": BRAND_HIGH_CONTRAST,
};

export const DEFAULT_THEME_ID: MapTheme["id"] = "brand-soft";

/**
 * Return true if the given Mapbox layer id represents water. We never
 * recolor or desaturate these, so the coast/bay/ocean read is preserved.
 */
export function isWaterLayerId(id: string): boolean {
  const n = id.toLowerCase();
  return (
    n.includes("water") ||
    n.includes("ocean") ||
    n.includes("sea") ||
    n === "waterway" ||
    n.startsWith("waterway")
  );
}
