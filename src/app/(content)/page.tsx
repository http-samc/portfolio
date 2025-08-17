import Hero from "@/components/home/hero";
import CommandWindow from "@/components/home/command-window";
import { getFirstPageByType, getMostRecentLocation } from "@/lib/queries";
import { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: {
    noimageindex: true,
  },
};

export const getCachedFirstPageByType = cache(getFirstPageByType);
export const getCachedMostRecentLocation = cache(getMostRecentLocation);

export default async function Home() {
  const [home, location] = await Promise.all([
    getCachedFirstPageByType("home"),
    getCachedMostRecentLocation(),
  ]);

  if (!home || !location) {
    return notFound();
  }

  return (
    <div className="flex flex-col sm:space-y-16">
      <Hero location={location.name} />
      <CommandWindow home={home} />
    </div>
  );
}
