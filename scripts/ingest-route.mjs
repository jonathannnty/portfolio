#!/usr/bin/env node
/**
 * Ingest a Strava-exported GPX file into a runtime-friendly JSON manifest.
 *
 * Reads:  data/routes/about.gpx
 *         content/experiences.ts (for optional `geo` lat/lng anchors)
 * Writes: public/routes/about.json   (RouteManifest)
 *
 * Run with: node scripts/ingest-route.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GPX_PATH = resolve(ROOT, "data/routes/about.gpx");
const OUT_PATH = resolve(ROOT, "public/routes/about.json");
const EXPERIENCES_PATH = resolve(ROOT, "content/experiences.ts");

const EARTH_RADIUS_M = 6_371_008.8;

function haversine(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

function parseGpx(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const doc = parser.parse(xml);
  const trk = doc?.gpx?.trk;
  if (!trk) throw new Error("GPX: no <trk> element found");
  const segs = Array.isArray(trk.trkseg) ? trk.trkseg : [trk.trkseg];
  const rawPts = segs.flatMap((s) =>
    Array.isArray(s.trkpt) ? s.trkpt : [s.trkpt],
  );

  const points = [];
  let cum = 0;
  for (let i = 0; i < rawPts.length; i++) {
    const p = rawPts[i];
    const pt = {
      lat: Number(p.lat),
      lng: Number(p.lon),
      ele: Number(p.ele ?? 0),
    };
    if (i > 0) cum += haversine(points[i - 1], pt);
    points.push({ ...pt, d: Math.round(cum * 100) / 100 });
  }

  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const p of points) {
    if (p.lng < minLng) minLng = p.lng;
    if (p.lat < minLat) minLat = p.lat;
    if (p.lng > maxLng) maxLng = p.lng;
    if (p.lat > maxLat) maxLat = p.lat;
  }

  return {
    name: trk.name ?? "Route",
    recordedAt: doc?.gpx?.metadata?.time,
    totalDistance: cum,
    bounds: { minLng, minLat, maxLng, maxLat },
    points,
  };
}

function nearestPointIndex(route, lng, lat) {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < route.points.length; i++) {
    const p = route.points[i];
    const d = haversine({ lng, lat }, p);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return { index: bestIdx, distance: bestDist };
}

/**
 * Lightweight extractor for `geo: { lat, lng }` blocks adjacent to `id: "..."`
 * inside content/experiences.ts. Avoids importing TS at build-script time.
 */
function extractGeoAnchors(src) {
  const anchors = [];
  const re =
    /id:\s*["']([^"']+)["'][\s\S]*?geo:\s*\{\s*lat:\s*(-?\d+\.?\d*)\s*,\s*lng:\s*(-?\d+\.?\d*)\s*\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    anchors.push({ id: m[1], lat: Number(m[2]), lng: Number(m[3]) });
  }
  return anchors;
}

function main() {
  if (!existsSync(GPX_PATH)) {
    throw new Error(`GPX not found at ${GPX_PATH}`);
  }
  const gpx = readFileSync(GPX_PATH, "utf8");
  const route = parseGpx(gpx);

  const checkpoints = [];
  if (existsSync(EXPERIENCES_PATH)) {
    const src = readFileSync(EXPERIENCES_PATH, "utf8");
    const anchors = extractGeoAnchors(src);
    for (const a of anchors) {
      const { index, distance } = nearestPointIndex(route, a.lng, a.lat);
      checkpoints.push({
        id: a.id,
        pointIndex: index,
        progress: route.points[index].d / route.totalDistance,
      });
      console.log(
        `  checkpoint "${a.id}" → point[${index}] (snap ${distance.toFixed(1)}m, progress ${(checkpoints.at(-1).progress * 100).toFixed(1)}%)`,
      );
    }
    checkpoints.sort((a, b) => a.progress - b.progress);
  }

  const manifest = { route, checkpoints };
  writeFileSync(OUT_PATH, JSON.stringify(manifest));
  console.log(
    `Ingested ${route.points.length} points, ${(route.totalDistance / 1000).toFixed(2)} km, ${checkpoints.length} checkpoints → ${OUT_PATH}`,
  );
}

main();
