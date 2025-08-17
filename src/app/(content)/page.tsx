import Hero from "@/components/home/hero";
import CommandWindow from "@/components/home/command-window";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    noimageindex: true,
  },
};

export default async function Home() {
  return (
    <div className="flex flex-col sm:space-y-16">
      <Hero />
      <CommandWindow />
    </div>
  );
}
