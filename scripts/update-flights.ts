import { spawnSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import os from "os";
import path from "path";

const defaultDatabasePath = path.join(
  os.homedir(),
  "Library/Containers/com.flightyapp.flighty/Data/Documents/MainFlightyDatabase.db"
);

const databasePath = process.env.FLIGHTY_DB_PATH ?? defaultDatabasePath;
const outputPath = path.join(process.cwd(), "src/data/flights.csv");

const query = `
select
  coalesce(dep.iata, dep.icao) as departure_code,
  dep.city as departure_city,
  dep.country as departure_country,
  dep.countryCode as departure_country_code,
  round(dep.latitude, 6) as departure_latitude,
  round(dep.longitude, 6) as departure_longitude,
  coalesce(arr.iata, arr.icao) as arrival_code,
  arr.city as arrival_city,
  arr.country as arrival_country,
  arr.countryCode as arrival_country_code,
  round(arr.latitude, 6) as arrival_latitude,
  round(arr.longitude, 6) as arrival_longitude,
  cast(round(f.distance * 0.621371) as integer) as distance_miles,
  (f.lastKnownArrivalDate - f.lastKnownDepartureDate) as duration_seconds
from UserFlight uf
join Flight f on f.id = uf.flightId
join Airport dep on dep.id = f.departureAirportId
join Airport arr on arr.id = f.actualArrivalAirportId
where uf.deleted is null
  and f.deleted is null
  and uf.isMyFlight = 1
  and uf.isRandom = 0
  and uf.isProUpgrade = 0
order by f.lastKnownDepartureDate asc;
`;

if (!existsSync(databasePath)) {
  throw new Error(`Flighty database was not found at ${databasePath}`);
}

const databaseUri = `file:${databasePath}?mode=ro&immutable=1`;
const result = spawnSync("sqlite3", ["-header", "-csv", databaseUri, query], {
  encoding: "utf8",
});

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  throw new Error(result.stderr || "sqlite3 failed while exporting flights");
}

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, result.stdout, "utf8");

const rows = result.stdout.trim().split(/\r?\n/).length - 1;
console.log(`Wrote ${rows} flights to ${outputPath}`);
