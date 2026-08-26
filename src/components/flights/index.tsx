import { getFlights } from "@/lib/flights";
import { getFlightMapData } from "./geo";
import FlightMapComponent from "./flight-map";

export default function FlightMap() {
  return (
    <FlightMapComponent
      data={getFlightMapData(getFlights())}
      className="not-prose my-6 w-full"
    />
  );
}
