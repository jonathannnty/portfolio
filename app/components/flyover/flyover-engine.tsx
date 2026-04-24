"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Experience } from "@/content/experiences";
import type { RouteManifest } from "@/lib/flyover/types";
import {
  resolveCheckpoints,
  activeCheckpointIndex,
} from "@/lib/flyover/checkpoints";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import {
  DESKTOP_CAMERA,
  MOBILE_CAMERA,
  PHASE as P,
} from "@/lib/flyover/profiles";
import { isWaterLayerId, type MapTheme } from "@/lib/flyover/themes";
import ExperienceModal from "./experience-modal";

const STYLE = "https://tiles.openfreemap.org/styles/liberty";

// Wider lookahead = steadier heading. 30m was sensitive to GPS jitter on
// switchbacks; 80m smooths through them while staying responsive.
const FLY_BEARING_LOOKAHEAD_M = 80;

type Props = { experiences: Experience[] };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}
function toFiniteOpacity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(1, value));
}
function bearing(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δλ = toRad(b.lng - a.lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
/**
 * Apply theme-driven paint overrides to the loaded base style. Water layers
 * are explicitly skipped — preserving the blue water read is a hard rule.
 * Land desaturation is achieved via paint-property nudges on fill layers;
 * it's a soft override that survives style updates better than rewriting
 * every land color.
 */
function applyThemeToBaseStyle(map: maplibregl.Map, theme: MapTheme) {
  const desat = theme.landDesaturation;
  if (typeof desat !== "number" || !Number.isFinite(desat)) return;
  const sat = -Math.max(0, Math.min(1, desat));
  const layers = map.getStyle()?.layers ?? [];
  for (const layer of layers) {
    if (isWaterLayerId(layer.id)) continue;
    if (layer.type !== "fill" && layer.type !== "background") continue;
    try {
      // `fill-saturation` / `background-saturation` aren't standard MapLibre
      // properties; the supported lever is `*-color` rewriting. We do the
      // cheap thing: dial down opacity slightly so the brand route reads
      // dominant without us having to rewrite every land color.
      const opacityProp =
        layer.type === "fill" ? "fill-opacity" : "background-opacity";
      const current = toFiniteOpacity(
        map.getPaintProperty(layer.id, opacityProp),
      );
      // Many base-style layers expose expression-based opacity values.
      // For this hotfix we only mutate concrete numeric values.
      if (current === null) continue;
      const next = toFiniteOpacity(current * (1 + sat * 0.4));
      if (next === null) continue;
      map.setPaintProperty(layer.id, opacityProp, next);
    } catch {
      /* layer doesn't accept this property — skip */
    }
  }
}

function indexAtDistance(points: { d: number }[], target: number) {
  let lo = 0;
  let hi = points.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid].d < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function getZonePalette(theme: MapTheme | undefined): string[] {
  switch (theme?.id) {
    case "natural":
      return ["#ffd8bb", "#ffc39d", "#ffad81", "#f69264", "#e1764a", "#c85d33"];
    case "brand-high-contrast":
      return ["#f4debb", "#edcc98", "#dfb377", "#c99050", "#a86e2a", "#6e4218"];
    case "brand-soft":
    default:
      return ["#f5e6d0", "#efd8b7", "#e8c9a0", "#d8ae7c", "#c69359", "#8b5820"];
  }
}

/**
 * Preserved water classes. Every other class on the water layer
 * (swimming_pool, dock, pond, reservoir, …) is filtered out — removes the
 * small inland puddles that clutter the landscape read.
 */
const KEEP_WATER_CLASSES = ["ocean", "lake", "river"] as const;
const WATER_CLASS_FILTER: maplibregl.FilterSpecification = [
  "match",
  ["get", "class"],
  [...KEEP_WATER_CLASSES],
  true,
  false,
];

function applyGrassFirstCoastalStyle(map: maplibregl.Map) {
  const layers = map.getStyle()?.layers ?? [];
  const beachHaloTargets: Array<{
    aboveLayerId: string;
    source: string;
    sourceLayer: string | undefined;
  }> = [];

  for (const layer of layers) {
    const id = layer.id.toLowerCase();

    // Kill every label layer — removes all place names, road names,
    // POI labels, water names, etc. in one pass.
    if (layer.type === "symbol") {
      try {
        map.setLayoutProperty(layer.id, "visibility", "none");
      } catch {
        /* optional layer */
      }
      continue;
    }

    // Remove high-detail urban clutter.
    if (
      id.includes("road") ||
      id.includes("street") ||
      id.includes("highway") ||
      id.includes("building") ||
      id.includes("bridge") ||
      id.includes("tunnel") ||
      id.includes("rail") ||
      id.includes("aeroway") ||
      id.includes("poi") ||
      id.includes("transit")
    ) {
      try {
        map.setLayoutProperty(layer.id, "visibility", "none");
      } catch {
        /* optional layer */
      }
      continue;
    }

    // Water: preserve ocean/lake/river, hide smaller inland water classes.
    if (id.includes("water")) {
      try {
        // Merge with any existing filter the base style uses (zoom gates,
        // intermittent flags, etc.) so we don't accidentally un-gate them.
        const existing = (layer as unknown as { filter?: unknown }).filter;
        // Mixing a legacy base-style filter with our modern expression filter
        // isn't representable in the narrow FilterSpecification union. We
        // cast through unknown because MapLibre happily evaluates the
        // compound shape at runtime.
        const merged = (
          existing ? ["all", existing, WATER_CLASS_FILTER] : WATER_CLASS_FILTER
        ) as unknown as maplibregl.FilterSpecification;
        map.setFilter(layer.id, merged);
      } catch {
        /* filter may not apply to this layer */
      }

      try {
        if (layer.type === "fill") {
          map.setPaintProperty(layer.id, "fill-color", "#76b6df");
          map.setPaintProperty(layer.id, "fill-opacity", 0.95);
          // Remember this water fill so we can inject a beach halo beneath it.
          const src = (layer as unknown as { source: string }).source;
          const srcLayer = (layer as unknown as { "source-layer"?: string })[
            "source-layer"
          ];
          if (src) {
            beachHaloTargets.push({
              aboveLayerId: layer.id,
              source: src,
              sourceLayer: srcLayer,
            });
          }
        }
        if (layer.type === "line") {
          map.setPaintProperty(layer.id, "line-color", "#66a7d3");
          map.setPaintProperty(layer.id, "line-opacity", 0.9);
        }
      } catch {
        /* optional property */
      }
      continue;
    }

    // Promote any explicit beach/sand land features already in the style.
    if (id.includes("beach") || id.includes("sand")) {
      try {
        if (layer.type === "fill") {
          map.setPaintProperty(layer.id, "fill-color", "#ecd39f");
          map.setPaintProperty(layer.id, "fill-opacity", 0.95);
        }
      } catch {
        /* optional property */
      }
      continue;
    }

    // Default land treatment becomes grass-first.
    try {
      if (layer.type === "background") {
        map.setPaintProperty(layer.id, "background-color", "#dbe8cf");
      }
      if (layer.type === "fill") {
        map.setPaintProperty(layer.id, "fill-color", "#cfe3b7");
      }
    } catch {
      /* optional property */
    }
  }

  // Synthetic beach halo: a wide sand-colored line drawn at every water
  // polygon boundary, placed just BELOW the water fill. The excess width
  // bleeds onto adjacent land, giving every coastline (and major lake /
  // river edge) a sandy border without needing OSM beach polygons.
  for (const t of beachHaloTargets) {
    const haloId = `flyover-beach-halo-${t.aboveLayerId}`;
    if (map.getLayer(haloId)) continue;
    try {
      map.addLayer(
        {
          id: haloId,
          type: "line",
          source: t.source,
          ...(t.sourceLayer ? { "source-layer": t.sourceLayer } : {}),
          filter: WATER_CLASS_FILTER,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": "#ecd39f",
            "line-opacity": 0.85,
            "line-blur": 3,
            // Zoom-interpolated so the halo reads as a thin strand at
            // fit-bounds and a wide beach during the pitched fly phase.
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              9, 2,
              12, 5,
              14, 10,
              16, 20,
              18, 36,
            ],
          },
        } as maplibregl.LayerSpecification,
        t.aboveLayerId,
      );
    } catch {
      /* source may not be accessible — skip */
    }
  }
}

export default function FlyoverEngine({ experiences }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const manifestRef = useRef<RouteManifest | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const cardAnchorRef = useRef<HTMLButtonElement>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const error = runtimeError;
  const [retryNonce, setRetryNonce] = useState(0);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapTimedOut, setMapTimedOut] = useState(false);
  const [resolvedCps, setResolvedCps] = useState<
    ReturnType<typeof resolveCheckpoints>
  >([]);
  const [isMobile, setIsMobile] = useState(false);
  const [inFlyPhase, setInFlyPhase] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplayRef = useRef<gsap.core.Timeline | null>(null);
  const autoplayDisposeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Auto-play "video" mode: animates window.scrollY through the section
  // with dwells at each checkpoint. Any user wheel/touch/keyboard input
  // cancels playback so the user always wins.
  const stopAutoplay = useCallback(() => {
    autoplayRef.current?.kill();
    autoplayRef.current = null;
    autoplayDisposeRef.current?.();
    autoplayDisposeRef.current = null;
    setIsPlaying(false);
  }, []);

  const startAutoplay = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec || resolvedCps.length === 0) return;
    autoplayRef.current?.kill();
    autoplayDisposeRef.current?.();

    const rect = sec.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const sectionHeight = sec.offsetHeight;
    const offset = window.innerHeight * 0.05;
    const yFor = (p: number) => sectionTop + sectionHeight * p - offset;

    const startY = window.scrollY;
    const startProgress = Math.max(
      0,
      Math.min(
        1,
        (startY - (sectionTop - offset)) / sectionHeight,
      ),
    );

    type KF = { progress: number; dwellSec: number };
    const kfs: KF[] = [{ progress: startProgress, dwellSec: 0 }];
    if (startProgress < P.tiltEnd) kfs.push({ progress: P.tiltEnd, dwellSec: 0 });
    for (const cp of resolvedCps) {
      const cpProg = P.tiltEnd + cp.checkpoint.progress * (P.flyEnd - P.tiltEnd);
      if (cpProg > startProgress + 0.001) {
        kfs.push({ progress: cpProg, dwellSec: 2.5 });
      }
    }
    if (startProgress < 1) kfs.push({ progress: 1, dwellSec: 0 });

    setIsPlaying(true);
    const proxy = { y: startY };
    const tl = gsap.timeline({
      onComplete: () => {
        autoplayRef.current = null;
        autoplayDisposeRef.current?.();
        autoplayDisposeRef.current = null;
        setIsPlaying(false);
      },
    });

    // Progress per second — slow enough to feel like a guided tour, fast
    // enough that the full route under 30s of motion + dwell time.
    const PROGRESS_PER_SEC = 0.05;
    for (let i = 1; i < kfs.length; i++) {
      const distance = Math.abs(kfs[i].progress - kfs[i - 1].progress);
      const dur = Math.max(0.6, distance / PROGRESS_PER_SEC);
      const targetY = yFor(kfs[i].progress);
      tl.to(proxy, {
        y: targetY,
        duration: dur,
        ease: "power1.inOut",
        onUpdate: () => window.scrollTo(0, proxy.y),
      });
      if (kfs[i].dwellSec > 0) tl.to({}, { duration: kfs[i].dwellSec });
    }

    autoplayRef.current = tl;

    // User input always wins — wheel, touch, or scroll-related keys cancel.
    const cancel = () => stopAutoplay();
    const onKey = (e: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(
          e.key,
        )
      ) {
        cancel();
      }
    };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchmove", cancel, { passive: true });
    window.addEventListener("keydown", onKey);
    autoplayDisposeRef.current = () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
      window.removeEventListener("keydown", onKey);
    };
  }, [resolvedCps, stopAutoplay]);

  // Stop autoplay if the engine unmounts mid-playback.
  useEffect(() => {
    return () => stopAutoplay();
  }, [stopAutoplay]);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let trigger: ScrollTrigger | undefined;
    const readyTimer = window.setTimeout(() => {
      if (cancelled) return;
      if (map.isStyleLoaded()) {
        setMapTimedOut(false);
        setMapReady(true);
        return;
      }
      // Soft-timeout only: some browsers delay rendering for off-screen
      // canvases. Keep trying instead of surfacing a permanent failure.
      setMapTimedOut(true);
      map.resize();
      map.triggerRepaint();
    }, 12000);
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const cam = isMobile ? MOBILE_CAMERA : DESKTOP_CAMERA;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      interactive: false,
      attributionControl: {},
      pitch: 0,
      bearing: 0,
      zoom: 12,
      center: [-117.19, 32.69],
    });
    mapRef.current = map;

    // Surface hard map/style bootstrap failures so users never stare at a
    // blank white panel without feedback.
    map.on("error", (ev) => {
      if (cancelled) return;
      const msg =
        (ev?.error as { message?: string } | undefined)?.message ?? "";
      if (!msg) return;
      setRuntimeError(`Map failed to render: ${msg}`);
    });

    const markReady = () => {
      if (cancelled) return;
      if (!map.isStyleLoaded()) return;
      setMapTimedOut(false);
      setMapReady(true);
    };
    const onLoad = () => {
      if (cancelled) return;
      setMapTimedOut(false);
      setMapReady(true);
    };
    map.once("load", onLoad);
    map.on("render", markReady);
    map.on("idle", markReady);

    const ro = new ResizeObserver(() => {
      if (cancelled) return;
      map.resize();
      ScrollTrigger.refresh();
    });
    ro.observe(containerRef.current);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        map.resize();
        map.triggerRepaint();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const manifestPromise = fetch("/routes/about.json").then(
      (r) => r.json() as Promise<RouteManifest>,
    );
    const stylePromise = new Promise<void>((resolve) =>
      map.on("load", () => resolve()),
    );

    Promise.all([manifestPromise, stylePromise])
      .then(([manifest]) => {
        if (cancelled) return;
        manifestRef.current = manifest;
        const { route, checkpoints } = manifest;

        const cps = resolveCheckpoints(experiences, route, checkpoints);
        setResolvedCps(cps);

        const theme = cam.terrain?.theme;
        applyGrassFirstCoastalStyle(map);
        if (theme) applyThemeToBaseStyle(map, theme);

        const coords = route.points.map((p) => [p.lng, p.lat]);
        const zonePalette = getZonePalette(theme);
        const boundaries = Array.from(
          new Set([0, ...cps.map((cp) => cp.checkpoint.pointIndex), route.points.length - 1]),
        ).sort((a, b) => a - b);
        const zoneFeatures: Array<{
          type: "Feature";
          properties: { zone: number };
          geometry: { type: "LineString"; coordinates: number[][] };
        }> = [];
        for (let i = 0; i < boundaries.length - 1; i++) {
          const start = boundaries[i];
          const end = boundaries[i + 1];
          if (end - start < 1) continue;
          zoneFeatures.push({
            type: "Feature",
            properties: { zone: i },
            geometry: {
              type: "LineString",
              coordinates: coords.slice(start, end + 1),
            },
          });
        }

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: coords },
          },
        });
        if (zoneFeatures.length > 0) {
          map.addSource("route-zones", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: zoneFeatures,
            },
          });
        }
        map.addLayer({
          id: "route-band-outer",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": theme?.route.line ?? "#a86e2a",
            "line-width": 42,
            "line-opacity": 0.1,
          },
        });
        if (zoneFeatures.length > 0) {
          for (let i = 0; i < zoneFeatures.length; i++) {
            map.addLayer({
              id: `route-zone-${i}`,
              type: "line",
              source: "route-zones",
              filter: ["==", ["get", "zone"], i],
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": zonePalette[i % zonePalette.length],
                "line-width": 34,
                "line-opacity": 0.24,
              },
            });
          }
        }
        map.addLayer({
          id: "route-band-mid",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": theme?.route.line ?? "#a86e2a",
            "line-width": 24,
            "line-opacity": 0.16,
          },
        });
        map.addLayer({
          id: "route-band-inner",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": theme?.route.line ?? "#a86e2a",
            "line-width": 14,
            "line-opacity": 0.26,
          },
        });
        map.addLayer({
          id: "route-casing",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": theme?.route.casing ?? "#0b1020",
            "line-width": theme?.route.casingWidth ?? 7,
            "line-opacity": theme?.route.casingOpacity ?? 0.55,
          },
        });
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": theme?.route.line ?? "#fc5200",
            "line-width": theme?.route.lineWidth ?? 4,
          },
        });

        if (cam.enableTerrain && cam.terrain) {
          // Intentionally left blank for the choropleth treatment: we keep
          // the route narrative flat and thematic rather than satellite-like.
        }

        // Checkpoint markers — colors driven by theme via inline CSS vars so
        // the same DOM works across all presets without duplicate stylesheets.
        for (let i = 0; i < cps.length; i++) {
          const { checkpoint } = cps[i];
          const pt = route.points[checkpoint.pointIndex];
          const el = document.createElement("div");
          const emphasis = cps[i].experience.flyover?.emphasis ?? "normal";
          el.className = `flyover-marker is-emphasis-${emphasis}`;
          el.dataset.idx = String(i);
          el.dataset.emphasis = emphasis;
          if (theme) {
            el.style.setProperty("--mk-base", theme.marker.base);
            el.style.setProperty("--mk-base-border", theme.marker.baseBorder);
            el.style.setProperty("--mk-base-text", theme.marker.baseText);
            el.style.setProperty("--mk-active", theme.marker.active);
            el.style.setProperty(
              "--mk-active-border",
              theme.marker.activeBorder,
            );
            el.style.setProperty("--mk-active-text", theme.marker.activeText);
            el.style.setProperty("--mk-completed", theme.marker.completed);
            el.style.setProperty(
              "--mk-completed-border",
              theme.marker.completedBorder,
            );
            el.style.setProperty(
              "--mk-completed-text",
              theme.marker.completedText,
            );
          }
          el.innerHTML = `<span class="flyover-marker-dot"></span><span class="flyover-marker-num">${i + 1}</span>`;
          const marker = new maplibregl.Marker({
            element: el,
            // Center anchor so the dot's centroid sits exactly on the
            // lng/lat point. Bottom-anchor reads as "floating" in the
            // pitched 3D view because the dot's radius offsets up-and-back
            // in world space.
            anchor: "center",
          })
            .setLngLat([pt.lng, pt.lat])
            .addTo(map);
          markersRef.current.push(marker);
        }

        const fitBounds = new maplibregl.LngLatBounds(
          [route.bounds.minLng, route.bounds.minLat],
          [route.bounds.maxLng, route.bounds.maxLat],
        );
        map.fitBounds(fitBounds, { padding: cam.fitPadding, duration: 0 });
        const fitCam = { center: map.getCenter(), zoom: map.getZoom() };
        map.resize();
        requestAnimationFrame(() => {
          if (cancelled) return;
          map.resize();
        });

        const targetExaggeration = cam.terrain?.exaggeration ?? 0;

        // Single source of truth for pin states. `activeIdx` and the per-pin
        // upcoming/active/completed classes are both computed here so card
        // state and pin state can never drift out of sync.
        type PinState = "upcoming" | "active" | "completed";
        let lastPinSig = "";
        function applyPinStates(states: PinState[]) {
          // Cheap diff so we don't thrash classList each frame.
          const sig = states.join(",");
          if (sig === lastPinSig) return;
          lastPinSig = sig;
          for (let i = 0; i < states.length; i++) {
            const el = markersRef.current[i]?.getElement();
            if (!el) continue;
            el.classList.toggle("is-active", states[i] === "active");
            el.classList.toggle("is-completed", states[i] === "completed");
            el.classList.toggle("is-upcoming", states[i] === "upcoming");
          }
        }
        function setExaggeration(value: number) {
          // Terrain is intentionally disabled for the grass-first choropleth
          // look, so exaggeration is a no-op.
          void value;
          void cam;
        }

        const allUpcoming: PinState[] = cps.map(() => "upcoming");
        const allCompleted: PinState[] = cps.map(() => "completed");

        // Pixel-space card positioner. Projects the active checkpoint's
        // lng/lat to container pixels, then places the card offset above
        // the pin, clamped into the viewport with a 16px safe margin.
        function positionCardNear(pointIndex: number) {
          const el = cardAnchorRef.current;
          const container = containerRef.current;
          if (!el || !container) return;
          const pt = route.points[pointIndex];
          const { x, y } = map.project([pt.lng, pt.lat]);
          const cw = container.clientWidth;
          const ch = container.clientHeight;
          const cardW = el.offsetWidth || 320;
          const cardH = el.offsetHeight || 140;
          const pad = 16;
          // Prefer above the pin; fall back to below if it would clip.
          const aboveTop = y - 24 - cardH;
          const belowTop = y + 28;
          const top =
            aboveTop >= pad
              ? aboveTop
              : Math.min(ch - cardH - pad, belowTop);
          let left = x - cardW / 2;
          left = Math.max(pad, Math.min(cw - cardW - pad, left));
          el.style.left = `${left}px`;
          el.style.top = `${Math.max(pad, top)}px`;
        }

        function applyProgress(progress: number) {
          if (progress <= P.introEnd) {
            map.jumpTo({
              center: [fitCam.center.lng, fitCam.center.lat],
              zoom: fitCam.zoom,
              pitch: 0,
              bearing: 0,
            });
            setExaggeration(0);
            setActiveIdx(null);
            setInFlyPhase(false);
            applyPinStates(allUpcoming);
            return;
          }

          if (progress <= P.tiltEnd) {
            const t = smoothstep(
              (progress - P.introEnd) / (P.tiltEnd - P.introEnd),
            );
            const startPt = route.points[0];
            const lookPt =
              route.points[
                indexAtDistance(route.points, FLY_BEARING_LOOKAHEAD_M)
              ];
            const targetBearing = bearing(startPt, lookPt);
            map.jumpTo({
              center: [
                lerp(fitCam.center.lng, startPt.lng, t),
                lerp(fitCam.center.lat, startPt.lat, t),
              ],
              zoom: lerp(fitCam.zoom, cam.zoom, t),
              pitch: lerp(0, cam.pitch, t),
              bearing: lerp(0, targetBearing, t),
            });
            setExaggeration(lerp(0, targetExaggeration, t));
            setActiveIdx(null);
            setInFlyPhase(false);
            applyPinStates(allUpcoming);
            return;
          }

          if (progress <= P.flyEnd) {
            const t = (progress - P.tiltEnd) / (P.flyEnd - P.tiltEnd);
            const targetMeters = t * route.totalDistance;
            const idx = indexAtDistance(route.points, targetMeters);
            // Sub-point lerp so the camera doesn't snap from one GPS
            // sample to the next — produces continuous motion at any
            // scroll speed instead of visible "ticks" along the route.
            const prevIdx = idx > 0 ? idx - 1 : idx;
            const prev = route.points[prevIdx];
            const cur = route.points[idx];
            const segLen = cur.d - prev.d;
            const segT =
              segLen > 0
                ? Math.max(0, Math.min(1, (targetMeters - prev.d) / segLen))
                : 0;
            const lng = lerp(prev.lng, cur.lng, segT);
            const lat = lerp(prev.lat, cur.lat, segT);

            const lookIdx = indexAtDistance(
              route.points,
              Math.min(
                targetMeters + FLY_BEARING_LOOKAHEAD_M,
                route.totalDistance,
              ),
            );
            const lookPt = route.points[lookIdx];
            map.jumpTo({
              center: [lng, lat],
              zoom: cam.zoom,
              pitch: cam.pitch,
              bearing: bearing({ lng, lat }, lookPt),
            });
            setExaggeration(targetExaggeration);
            const next = activeCheckpointIndex(cps, t);
            setActiveIdx(next);
            setInFlyPhase(true);
            // Per-checkpoint state derived from the same fly progress that
            // drives camera + card. Completed margin (0.015) prevents the
            // active checkpoint from briefly reading as completed at the
            // exact moment the camera reaches it.
            const states: PinState[] = cps.map((cp, i) => {
              if (i === next) return "active";
              if (cp.checkpoint.progress < t - 0.015) return "completed";
              return "upcoming";
            });
            applyPinStates(states);
            // Anchor the card near the active checkpoint's projected pixel
            // so it hovers close to the current location on the map instead
            // of parking in a fixed corner. The camera keeps the active
            // point roughly centered, so this reads as "card near pin."
            if (next !== null) {
              positionCardNear(cps[next].checkpoint.pointIndex);
            }
            return;
          }

          const t = smoothstep((progress - P.flyEnd) / (1 - P.flyEnd));
          const lastPt = route.points[route.points.length - 1];
          map.jumpTo({
            center: [
              lerp(lastPt.lng, fitCam.center.lng, t),
              lerp(lastPt.lat, fitCam.center.lat, t),
            ],
            zoom: lerp(cam.zoom, fitCam.zoom, t),
            pitch: lerp(cam.pitch, 0, t),
            bearing: 0,
          });
          setExaggeration(lerp(targetExaggeration, 0, t));
          setActiveIdx(null);
          setInFlyPhase(false);
          applyPinStates(allCompleted);
        }

        trigger = ScrollTrigger.create({
          trigger: sectionRef.current!,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          pin: stickyRef.current!,
          pinSpacing: false,
          onUpdate: (self) => applyProgress(self.progress),
          onRefresh: () => map.resize(),
        });
        // MapLibre needs a resize tick after the pin wraps the container.
        requestAnimationFrame(() => {
          if (cancelled) return;
          map.resize();
        });
        applyProgress(0);
      })
      .catch((e) => !cancelled && setRuntimeError(String(e)));

    return () => {
      cancelled = true;
      if (readyTimer) clearTimeout(readyTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      trigger?.kill();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [experiences, retryNonce]);

  // (Pin classes are written directly in applyProgress so card and pin
  // state always derive from the same scroll value — no separate effect.)

  // Keyboard ←/→ steps between checkpoints when the section is in view
  useEffect(() => {
    if (resolvedCps.length === 0) return;
    const section = sectionRef.current;
    if (!section) return;

    let inView = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio > 0.3;
      },
      { threshold: [0, 0.3, 0.6, 1] },
    );
    io.observe(section);

    function scrollToCheckpoint(i: number) {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = sec.offsetHeight;
      const cpProgress = resolvedCps[i].checkpoint.progress;
      // Position within fly phase, mapped back to global section progress
      const globalProgress = P.tiltEnd + cpProgress * (P.flyEnd - P.tiltEnd);
      // ScrollTrigger pin starts at "top top" — section top hits viewport top
      const target =
        sectionTop + sectionHeight * globalProgress - window.innerHeight * 0.05;
      window.scrollTo({ top: target, behavior: "smooth" });
    }

    function onKey(e: KeyboardEvent) {
      if (!inView) return;
      if (
        e.target instanceof HTMLElement &&
        e.target.matches("input,textarea,[contenteditable]")
      )
        return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const current = activeIdx ?? -1;
      const next =
        e.key === "ArrowRight"
          ? Math.min(resolvedCps.length - 1, current + 1)
          : Math.max(0, current - 1);
      scrollToCheckpoint(next);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      io.disconnect();
    };
  }, [resolvedCps, activeIdx]);

  if (error) {
    return (
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 text-sm text-[color:var(--color-fg-muted)]">
        <p>Flyover unavailable: {error}</p>
        <button
          type="button"
          onClick={() => {
            setRuntimeError(null);
            setMapTimedOut(false);
            setMapReady(false);
            setRetryNonce((n) => n + 1);
          }}
          className="mt-3 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-fg)]"
        >
          Retry map
        </button>
      </div>
    );
  }

  const active = mapReady && activeIdx !== null ? resolvedCps[activeIdx] : null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "500vh" }}
      aria-label="Scroll-driven route flyover"
    >
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Map canvas — masked so its edges dissolve into the page
            background instead of meeting it at a hard rectangle. Overlays
            (hint chip, legend, cards) are siblings and stay unmasked. */}
        <div
          ref={containerRef}
          className="flyover-mask absolute inset-0"
          style={{ background: "linear-gradient(180deg, #f8f1e7, #fdf8f3)" }}
        />
        {(!mapReady || mapTimedOut) && !error && (
          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-[color:var(--color-surface)]/90 px-3 py-1.5 text-xs font-medium text-[color:var(--color-fg-muted)] shadow-[var(--shadow-sm)] backdrop-blur">
            Loading map...
          </div>
        )}
        {/* Top-right control cluster: play/stop the auto-tour, plus the
            keyboard-skip hint. Any scroll/touch/keypress cancels playback. */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => (isPlaying ? stopAutoplay() : startAutoplay())}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={isPlaying ? "Stop auto tour" : "Play auto tour"}
          >
            <span aria-hidden="true">{isPlaying ? "■" : "▶"}</span>
            <span>{isPlaying ? "Stop tour" : "Play tour"}</span>
          </button>
          <span className="pointer-events-none hidden rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur sm:inline">
            scroll · ← → to skip
          </span>
        </div>
        {/* Legend: teaches the pin-state vocabulary. Only visible during
            the fly phase so it doesn't clutter the intro/outro. */}
        <div
          className={`pointer-events-none absolute left-4 bottom-4 hidden items-center gap-3 rounded-full bg-[color:var(--color-surface)]/90 px-3 py-1.5 text-[11px] font-medium text-[color:var(--color-fg-muted)] shadow-[var(--shadow-sm)] backdrop-blur transition-opacity duration-500 sm:flex ${inFlyPhase ? "opacity-100" : "opacity-0"}`}
          aria-hidden={!inFlyPhase}
        >
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white"
              style={{ background: "var(--color-primary-500)" }}
            />
            upcoming
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-[color:var(--color-primary-600)] bg-white" />
            active
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white opacity-85"
              style={{ background: "var(--color-primary-200)" }}
            />
            done
          </span>
        </div>
        {/* Proximity card. Anchored via pixel-projected lng/lat from the
            active checkpoint, so it hovers near the pin rather than a
            fixed corner. Clickable — opens the full experience modal. */}
        <div className="pointer-events-none absolute inset-0" aria-live="polite">
          {active && activeIdx !== null && (
            <button
              ref={cardAnchorRef}
              key={activeIdx}
              type="button"
              onClick={() => setExpandedIdx(activeIdx)}
              className="flyover-card-anim pointer-events-auto absolute w-[min(22rem,calc(100%-2rem))] cursor-pointer rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/95 p-5 text-left shadow-[var(--shadow-md)] backdrop-blur transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-500)]"
              style={{ animationName: "flyover-card-in-bl", left: 0, top: 0 }}
              aria-label={`Open details for ${active.experience.role} at ${active.experience.company}`}
            >
              <div className="text-xs uppercase tracking-wider text-[color:var(--color-fg-muted)]">
                {active.experience.period}
              </div>
              <div className="mt-1 text-base font-semibold text-[color:var(--color-fg)]">
                {active.experience.role}
              </div>
              <div className="text-sm text-[color:var(--color-fg-muted)]">
                {active.experience.company}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
                {active.experience.summary}
              </p>
              <div className="mt-3 text-xs font-medium text-[color:var(--color-primary-600)]">
                Click for details →
              </div>
            </button>
          )}
        </div>
      </div>
      {expandedIdx !== null && resolvedCps[expandedIdx] && (
        <ExperienceModal
          experience={resolvedCps[expandedIdx].experience}
          onClose={() => setExpandedIdx(null)}
        />
      )}
    </section>
  );
}
