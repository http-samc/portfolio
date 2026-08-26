export const width = 1000;
export const height = 430;
export const defaultZoom = 1.45;
export const minZoom = defaultZoom;
export const maxZoom = 2.6;
export const zoomStep = 1.28;
export const gridStep = 50;

export type MapTransform = {
  scale: number;
  x: number;
  y: number;
};

export type FlightMapData = {
  landPath: string;
  routePaths: string[];
  airports: { code: string; x: number; y: number }[];
  defaultTransform: MapTransform;
  stats: {
    flightCount: number;
    totalDistanceMiles: number;
    totalDurationSeconds: number;
    countries: { code: string; name: string }[];
  };
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function clampTransform(transform: MapTransform): MapTransform {
  const scale = clamp(transform.scale, minZoom, maxZoom);

  return {
    scale,
    x: clamp(transform.x, width * (1 - scale), 0),
    y: clamp(transform.y, height * (1 - scale), 0),
  };
}
