import { getFlights } from "@/lib/flights";
import FlightMapComponent from "./flight-map";

export default function FlightMap() {
  return (
    <FlightMapComponent
      flights={getFlights()}
      className="not-prose my-6 w-full"
    />
  );
}
