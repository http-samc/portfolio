"use client";

import { cn } from "@/lib/utils";
import { RotateCcwIcon, ZoomInIcon, ZoomOutIcon, TicketsPlane } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  clamp,
  clampTransform,
  gridStep,
  height,
  maxZoom,
  minZoom,
  width,
  zoomStep,
  type FlightMapData,
  type MapTransform,
} from "./constants";

type FlightsMapProps = {
  data: FlightMapData;
  className?: string;
};

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

export default function FlightMap({ data, className }: FlightsMapProps) {
  const { landPath, routePaths, airports, defaultTransform, stats } = data;
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
    [getSvgPoint]
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
    <div className="mx-4">
      <section
        className={cn(
          "not-prose overflow-hidden rounded border bg-white/50 text-card-foreground dark:bg-black/25",
          className
        )}
      >
        <div className="flex flex-col gap-3 px-3 sm:px-4 py-2 items-start sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-1.5 text-base sm:text-lg">
            <TicketsPlane className="w-4 h-4 sm:w-5 sm:h-5" />
            <h2 className="font-serif leading-tight">smrth's passport</h2>
          </div>
          <dl className="gap-6 text-right justify-end font-mono text-xs hidden sm:flex">
            <div>
              <dt className="text-muted-foreground">Flights</dt>
              <dd className="text-sm font-semibold text-foreground">
                {stats.flightCount.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Hours</dt>
              <dd className="text-sm font-semibold text-foreground">
                {formatHours(stats.totalDurationSeconds)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Miles</dt>
              <dd className="text-sm font-semibold text-foreground">
                {formatMiles(stats.totalDistanceMiles)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="group/map group relative h-[170px] border-y bg-sky-100 dark:bg-slate-950 sm:h-[240px]">
          <div className="absolute opacity-50 group/map-hover:opacity-100  right-3 top-3 z-10 flex overflow-hidden rounded-sm border border-white/40 bg-white/80 opacity-35 shadow-sm backdrop-blur transition-opacity duration-200 group-hover/map:opacity-100 focus-within:opacity-100 dark:border-slate-700/80 dark:bg-slate-900/80">
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
                {routePaths.map((path, index) => (
                  <path
                    key={`route-${index}`}
                    d={path}
                    stroke="hsl(var(--brand-gradient-via))"
                    strokeWidth="1.45"
                    opacity="0.36"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
              <g>
                {airports.map((airport) => (
                  <circle
                    key={airport.code}
                    cx={airport.x}
                    cy={airport.y}
                    r="2.4"
                    fill="hsl(var(--foreground))"
                    opacity="0.62"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            </g>
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-2">
          {stats.countries.map((country) => (
            <span
              key={country.code}
              className="inline-flex h-7 items-center gap-1.5 rounded-sm border bg-background px-2 font-mono text-xs text-muted-foreground"
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
    </div>
  );
}
