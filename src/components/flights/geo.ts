import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/land-110m.json";
import type { FlightRoute } from "@/lib/flights";
import {
  clamp,
  defaultZoom,
  height,
  width,
  type FlightMapData,
  type MapTransform,
} from "./constants";

type LandTopology = {
  objects: {
    land: Parameters<typeof feature>[1];
  };
};

const defaultCenter = {
  longitude: -37.0668,
  latitude: 41.5,
};

const projection = geoEquirectangular()
  .translate([width / 2, height / 2 + 78])
  .scale(width / (2 * Math.PI));

const landTopology = world as LandTopology;
const land = feature(
  landTopology as unknown as Parameters<typeof feature>[0],
  landTopology.objects.land
);

const landPath = geoPath(projection)(land) ?? "";

function project(longitude: number, latitude: number) {
  const point = projection([longitude, latitude]);

  return {
    x: point?.[0] ?? 0,
    y: point?.[1] ?? 0,
  };
}

function getCenteredTransform(
  longitude: number,
  latitude: number,
  scale: number
): MapTransform {
  const point = project(longitude, latitude);

  return {
    scale,
    x: clamp(width / 2 - point.x * scale, width * (1 - scale), 0),
    y: clamp(height / 2 - point.y * scale, height * (1 - scale), 0),
  };
}

const defaultTransform = getCenteredTransform(
  defaultCenter.longitude,
  defaultCenter.latitude,
  defaultZoom
);

function routePath(flight: FlightRoute) {
  const start = project(flight.departureLongitude, flight.departureLatitude);
  const end = project(flight.arrivalLongitude, flight.arrivalLatitude);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  const bow = Math.min(92, Math.max(18, distance * 0.18));
  const normalX = distance === 0 ? 0 : -dy / distance;
  const normalY = distance === 0 ? 0 : dx / distance;
  const controlX = (start.x + end.x) / 2 + normalX * bow;
  const controlY = (start.y + end.y) / 2 + normalY * bow;

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} Q ${controlX.toFixed(
    2
  )} ${controlY.toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export function getFlightMapData(flights: FlightRoute[]): FlightMapData {
  const countriesByCode = new Map<string, { code: string; name: string }>();
  const airportsByCode = new Map<string, { code: string; x: number; y: number }>();

  for (const flight of flights) {
    countriesByCode.set(flight.departureCountryCode, {
      code: flight.departureCountryCode,
      name: flight.departureCountry,
    });
    countriesByCode.set(flight.arrivalCountryCode, {
      code: flight.arrivalCountryCode,
      name: flight.arrivalCountry,
    });

    if (!airportsByCode.has(flight.departureCode)) {
      airportsByCode.set(flight.departureCode, {
        code: flight.departureCode,
        ...project(flight.departureLongitude, flight.departureLatitude),
      });
    }
    if (!airportsByCode.has(flight.arrivalCode)) {
      airportsByCode.set(flight.arrivalCode, {
        code: flight.arrivalCode,
        ...project(flight.arrivalLongitude, flight.arrivalLatitude),
      });
    }
  }

  return {
    landPath,
    routePaths: flights.map(routePath),
    airports: Array.from(airportsByCode.values()),
    defaultTransform,
    stats: {
      flightCount: flights.length,
      totalDistanceMiles: flights.reduce(
        (total, flight) => total + flight.distanceMiles,
        0
      ),
      totalDurationSeconds: flights.reduce(
        (total, flight) => total + flight.durationSeconds,
        0
      ),
      countries: Array.from(countriesByCode.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    },
  };
}
