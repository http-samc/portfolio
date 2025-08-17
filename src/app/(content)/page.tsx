import Hero from "@/components/home/hero";
import CommandWindow from "@/components/home/command-window";
import { getMostRecentLocation } from "@/lib/queries";
import { Metadata } from "next";
import { cache } from "react";

export const metadata: Metadata = {
  robots: {
    noimageindex: true,
  },
};

const getCachedLocation = cache(getMostRecentLocation);

export default async function Home() {
  const location = await getCachedLocation();

  return (
    <div className="flex flex-col sm:space-y-16">
      <Hero location={location!.name} />
      <CommandWindow />
    </div>
  );
}
