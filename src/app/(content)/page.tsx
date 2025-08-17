import Hero from "@/components/home/hero";
import CommandWindow from "@/components/home/command-window";
import { getMostRecentLocation } from "@/lib/queries";
import { Metadata } from "next";
import { cache, Suspense } from "react";

export const metadata: Metadata = {
  robots: {
    noimageindex: true,
  },
};

const getCachedLocation = cache(getMostRecentLocation);

// Async component for location data
const LocationHero = async () => {
  const location = await getCachedLocation();
  return <Hero location={location!.name} />;
};

// Async component for command window
const AsyncCommandWindow = async () => {
  return <CommandWindow />;
};

export default function Home() {
  return (
    <div className="flex flex-col sm:space-y-16">
      {/* Hero section with location - can stream independently */}
      <Suspense
        fallback={
          <div className="flex flex-col pt-3 min-h-[calc(100vh-4.5rem)] sm:min-h-fit sm:flex-row space-y-12 sm:space-y-0 sm:space-x-8 relative">
            <div className="sm:w-4/5">
              <div className="h-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-2" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            </div>
            <div className="flex justify-center">
              <div className="w-44 h-44 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />
            </div>
          </div>
        }
      >
        <LocationHero />
      </Suspense>

      {/* Command window - can stream independently */}
      <Suspense
        fallback={
          <div className="w-full h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        }
      >
        <AsyncCommandWindow />
      </Suspense>
    </div>
  );
}
