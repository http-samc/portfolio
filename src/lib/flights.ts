import { readFileSync } from "fs";
import path from "path";
import type { FlightRoute } from "@/components/flights/flight-map";

const flightsCsvPath = path.join(process.cwd(), "src/data/flights.csv");

const csvColumns = [
  "departure_code",
  "departure_city",
  "departure_country",
  "departure_country_code",
  "departure_latitude",
  "departure_longitude",
  "arrival_code",
  "arrival_city",
  "arrival_country",
  "arrival_country_code",
  "arrival_latitude",
  "arrival_longitude",
  "distance_miles",
  "duration_seconds",
] as const;

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(cell);
      cell = "";
      continue;
    }

    cell += char;
  }

  cells.push(cell);
  return cells;
}

function assertCsvShape(headers: string[]) {
  const missingColumns = csvColumns.filter((column) => !headers.includes(column));

  if (missingColumns.length > 0) {
    throw new Error(`Missing flight CSV columns: ${missingColumns.join(", ")}`);
  }
}

export function getFlights(): FlightRoute[] {
  const csv = readFileSync(flightsCsvPath, "utf8").trim();

  if (!csv) return [];

  const [headerLine, ...rows] = csv.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  assertCsvShape(headers);

  return rows.map((row) => {
    const cells = parseCsvLine(row);
    const record = Object.fromEntries(
      headers.map((header, index) => [header, cells[index] ?? ""])
    );

    return {
      departureCode: record.departure_code,
      departureCity: record.departure_city,
      departureCountry: record.departure_country,
      departureCountryCode: record.departure_country_code,
      departureLatitude: Number(record.departure_latitude),
      departureLongitude: Number(record.departure_longitude),
      arrivalCode: record.arrival_code,
      arrivalCity: record.arrival_city,
      arrivalCountry: record.arrival_country,
      arrivalCountryCode: record.arrival_country_code,
      arrivalLatitude: Number(record.arrival_latitude),
      arrivalLongitude: Number(record.arrival_longitude),
      distanceMiles: Number(record.distance_miles),
      durationSeconds: Number(record.duration_seconds),
    };
  });
}
