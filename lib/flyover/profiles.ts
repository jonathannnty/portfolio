/**
 * Typed configuration surface for the About-page flyover. All visual /
 * behavioral knobs live here so the engine reads pure data, never magic
 * numbers, and so future presets/themes can be swapped without touching the
 * engine code.
 */

import { type MapTheme, DEFAULT_THEME_ID, THEMES } from "./themes";

export type TerrainProfile = {
  /** Source vertical exaggeration when fully engaged in the fly phase. */
  exaggeration: number;
  /** Cartographic styling: route, markers, fog, water-locked. */
  theme: MapTheme;
  /** Mapbox-specific atmosphere extras not covered by MapTheme.fog. */
  atmosphere: {
    spaceColor: string;
    starIntensity: number;
  };
};

export type CameraProfile = {
  pitch: number;
  zoom: number;
  fitPadding: number;
  /** Whether to enable terrain DEM + fog at all. */
  enableTerrain: boolean;
  terrain: TerrainProfile | null;
};

const ACTIVE_THEME = THEMES[DEFAULT_THEME_ID];

export const DESKTOP_CAMERA: CameraProfile = {
  pitch: 44,
  zoom: 16.4,
  fitPadding: 60,
  enableTerrain: false,
  terrain: {
    exaggeration: 1.6,
    theme: ACTIVE_THEME,
    atmosphere: {
      spaceColor: "rgb(20, 14, 10)",
      starIntensity: 0.05,
    },
  },
};

export const MOBILE_CAMERA: CameraProfile = {
  pitch: 38,
  zoom: 15.8,
  fitPadding: 30,
  enableTerrain: false,
  terrain: {
    exaggeration: 1.2,
    theme: ACTIVE_THEME,
    atmosphere: {
      spaceColor: "rgb(20, 14, 10)",
      starIntensity: 0,
    },
  },
};

/**
 * Phase boundaries, normalized scroll progress 0..1.
 * intro:   2D fit-to-bounds
 * tilt:    2D → 3D camera + terrain ramp-up
 * fly:     scrub camera along route, terrain at full exaggeration
 * outro:   3D → 2D + terrain ramp-down
 */
export const PHASE = { introEnd: 0.08, tiltEnd: 0.2, flyEnd: 0.86 } as const;
