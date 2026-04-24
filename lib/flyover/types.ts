export type RoutePoint = {
  lng: number;
  lat: number;
  ele: number;
  /** Cumulative distance in meters from the route start. */
  d: number;
};

export type RouteBounds = {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
};

export type RouteData = {
  name: string;
  /** ISO timestamp from GPX metadata, if present. */
  recordedAt?: string;
  /** Total route length in meters. */
  totalDistance: number;
  bounds: RouteBounds;
  points: RoutePoint[];
};

export type Checkpoint = {
  /** Matches Experience.id. */
  id: string;
  /** Index into RouteData.points where this checkpoint is anchored. */
  pointIndex: number;
  /** Normalized position along the route, 0..1. */
  progress: number;
};

export type RouteManifest = {
  route: RouteData;
  checkpoints: Checkpoint[];
};
