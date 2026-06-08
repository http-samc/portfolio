"use client";

import { cn } from "@/lib/utils";
import { geoEquirectangular, geoPath } from "d3-geo";
import { RotateCcwIcon, ZoomInIcon, ZoomOutIcon, TicketsPlane } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import world from "world-atlas/land-110m.json";

export type FlightRoute = {
  departureCode: string;
  departureCity: string;
  departureCountry: string;
  departureCountryCode: string;
  departureLatitude: number;
  departureLongitude: number;
  arrivalCode: string;
  arrivalCity: string;
  arrivalCountry: string;
  arrivalCountryCode: string;
  arrivalLatitude: number;
  arrivalLongitude: number;
  distanceMiles: number;
  durationSeconds: number;
};

type CountryVisit = {
  code: string;
  name: string;
};

type FlightsMapProps = {
  flights: FlightRoute[];
  className?: string;
};

type LandTopology = {
  objects: {
    land: Parameters<typeof feature>[1];
  };
};

const width = 1000;
const height = 430;
const defaultZoom = 1.45;
const minZoom = defaultZoom;
const maxZoom = 2.6;
const zoomStep = 1.28;
const gridStep = 50;
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

type MapTransform = {
  scale: number;
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

function clampTransform(transform: MapTransform): MapTransform {
  const scale = clamp(transform.scale, minZoom, maxZoom);

  return {
    scale,
    x: clamp(transform.x, width * (1 - scale), 0),
    y: clamp(transform.y, height * (1 - scale), 0),
  };
}

function project(longitude: number, latitude: number) {
  const point = projection([longitude, latitude]);

  return {
    x: point?.[0] ?? 0,
    y: point?.[1] ?? 0,
  };
}

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

function formatHours(seconds: number) {
  return Math.round(seconds / 3600).toLocaleString();
}

function formatMiles(miles: number) {
  if (miles >= 1000) {
    return `${Math.floor(miles / 1000).toLocaleString()}K`;
  }

  return Math.round(miles).toLocaleString();
}

function flagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

function getStats(flights: FlightRoute[]) {
  const countriesByCode = new Map<string, CountryVisit>();
  const airportsByCode = new Map<string, { code: string; city: string }>();

  for (const flight of flights) {
    countriesByCode.set(flight.departureCountryCode, {
      code: flight.departureCountryCode,
      name: flight.departureCountry,
    });
    countriesByCode.set(flight.arrivalCountryCode, {
      code: flight.arrivalCountryCode,
      name: flight.arrivalCountry,
    });
    airportsByCode.set(flight.departureCode, {
      code: flight.departureCode,
      city: flight.departureCity,
    });
    airportsByCode.set(flight.arrivalCode, {
      code: flight.arrivalCode,
      city: flight.arrivalCity,
    });
  }

  return {
    countries: Array.from(countriesByCode.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    airports: Array.from(airportsByCode.values()),
    totalDistanceMiles: flights.reduce(
      (total, flight) => total + flight.distanceMiles,
      0
    ),
    totalDurationSeconds: flights.reduce(
      (total, flight) => total + flight.durationSeconds,
      0
    ),
  };
}

export default function FlightMap({ flights, className }: FlightsMapProps) {
  const stats = useMemo(() => getStats(flights), [flights]);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragPoint = useRef<{ x: number; y: number } | null>(null);
  const [transform, setTransform] = useState<MapTransform>(defaultTransform);

  const getSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM()?.inverse();

    if (!svg || !matrix) {
      return { x: width / 2, y: height / 2 };
    }

    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    return point.matrixTransform(matrix);
  }, []);

  const zoomTo = useCallback(
    (nextScale: number, anchor = { x: width / 2, y: height / 2 }) => {
      setTransform((current) => {
        const scale = clamp(nextScale, minZoom, maxZoom);
        const contentX = (anchor.x - current.x) / current.scale;
        const contentY = (anchor.y - current.y) / current.scale;

        return clampTransform({
          scale,
          x: anchor.x - contentX * scale,
          y: anchor.y - contentY * scale,
        });
      });
    },
    []
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<SVGSVGElement>) => {
      event.preventDefault();

      const anchor = getSvgPoint(event.clientX, event.clientY);
      const zoomDelta = event.deltaY < 0 ? zoomStep : 1 / zoomStep;
      zoomTo(transform.scale * zoomDelta, anchor);
    },
    [getSvgPoint, transform.scale, zoomTo]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      dragPoint.current = getSvgPoint(event.clientX, event.clientY);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [getSvgPoint]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!dragPoint.current) return;

      const point = getSvgPoint(event.clientX, event.clientY);
      const previousPoint = dragPoint.current;
      dragPoint.current = point;

      setTransform((current) =>
        clampTransform({
          ...current,
          x: current.x + point.x - previousPoint.x,
          y: current.y + point.y - previousPoint.y,
        })
      );
    },
    [getSvgPoint, transform.scale]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      dragPoint.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    []
  );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="flex flex-col gap-4 p-4 items-start sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center text-xl sm:text-2xl space-x-1.5">
          <TicketsPlane className="inline-block" />
          <h2 className="font-serif leading-tight">
            smrth's passport
          </h2>
        </div>
        <dl className="gap-8 text-right justify-end font-mono text-xs hidden sm:flex sm:min-w-[18rem]">
          <div>
            <dt className="text-muted-foreground">Flights</dt>
            <dd className="text-lg font-semibold text-foreground">
              {flights.length.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Hours</dt>
            <dd className="text-lg font-semibold text-foreground">
              {formatHours(stats.totalDurationSeconds)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Miles</dt>
            <dd className="text-lg font-semibold text-foreground">
              {formatMiles(stats.totalDistanceMiles)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="group/map relative h-[190px] border-y border-border bg-sky-100 dark:bg-slate-950 sm:h-[300px]">
        <div className="absolute right-3 top-3 z-10 flex overflow-hidden rounded-sm border border-white/40 bg-white/80 opacity-35 shadow-sm backdrop-blur transition-opacity duration-200 group-hover/map:opacity-100 focus-within:opacity-100 dark:border-slate-700/80 dark:bg-slate-900/80">
          <button
            type="button"
            className="grid h-8 w-8 place-items-center text-slate-700 transition-colors hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800"
            title="Zoom in"
            aria-label="Zoom in"
            onClick={() => zoomTo(transform.scale * zoomStep)}
          >
            <ZoomInIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center border-x border-slate-200 text-slate-700 transition-colors hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            title="Zoom out"
            aria-label="Zoom out"
            onClick={() => zoomTo(transform.scale / zoomStep)}
          >
            <ZoomOutIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center text-slate-700 transition-colors hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800"
            title="Reset map"
            aria-label="Reset map"
            onClick={() => setTransform(defaultTransform)}
          >
            <RotateCcwIcon className="h-4 w-4" />
          </button>
        </div>
        <svg
          ref={svgRef}
          className={cn(
            "absolute inset-0 h-full w-full select-none touch-none",
            "cursor-grab active:cursor-grabbing"
          )}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Map of flown routes"
          preserveAspectRatio="xMidYMid slice"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          <rect
            width={width}
            height={height}
            className="fill-sky-100 dark:fill-slate-950"
          />
          <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}>
            {Array.from({ length: Math.floor(width / gridStep) + 1 }).map(
              (_, index) => {
                const x = index * gridStep;
                return (
                  <line
                    key={`grid-x-${x}`}
                    x1={x}
                    x2={x}
                    y1="0"
                    y2={height}
                    className="stroke-slate-500/10 dark:stroke-slate-200/10"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              }
            )}
            {Array.from({ length: Math.floor(height / gridStep) + 1 }).map(
              (_, index) => {
                const y = index * gridStep;
                return (
                  <line
                    key={`grid-y-${y}`}
                    x1="0"
                    x2={width}
                    y1={y}
                    y2={y}
                    className="stroke-slate-500/10 dark:stroke-slate-200/10"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              }
            )}
            <path d={landPath} className="fill-slate-300 dark:fill-slate-600" />
            <g fill="none" strokeLinecap="round">
              {flights.map((flight, index) => (
                <path
                  key={`${flight.departureCode}-${flight.arrivalCode}-${index}`}
                  d={routePath(flight)}
                  stroke="hsl(var(--brand-gradient-via))"
                  strokeWidth="1.45"
                  opacity="0.36"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
            <g>
              {stats.airports.map((airport) => {
                const flight = flights.find(
                  (item) =>
                    item.departureCode === airport.code ||
                    item.arrivalCode === airport.code
                );
                if (!flight) return null;
                const point =
                  flight.departureCode === airport.code
                    ? project(flight.departureLongitude, flight.departureLatitude)
                    : project(flight.arrivalLongitude, flight.arrivalLatitude);

                return (
                  <circle
                    key={airport.code}
                    cx={point.x}
                    cy={point.y}
                    r="2.4"
                    fill="hsl(var(--foreground))"
                    opacity="0.62"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </g>
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3">
        {stats.countries.map((country) => (
          <span
            key={country.code}
            className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border bg-background px-2 font-mono text-xs text-muted-foreground"
            title={country.name}
          >
            <span className="text-base leading-none" aria-hidden="true">
              {flagEmoji(country.code)}
            </span>
            <span>{country.code}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
