"use server";
import React from "react";
import Headshot from "../../../public/headshot.jpg";
import { MapPinIcon, PlaneIcon } from "lucide-react";
import Image from "next/image";
import { Balancer } from "react-wrap-balancer";
import DotGrid from "@/components/home/dot-grid";

const Hero = ({ location }: { location: string }) => {
  return (
    <div className="flex flex-col items-center pt-3 min-h-[calc(100vh-4.5rem)] sm:min-h-fit sm:flex-row space-y-12 sm:space-y-0 sm:space-x-8 relative">
      <div className="sm:w-4/5">
        <h1 className="text-5xl sm:text-4xl leading-tight font-serif">
          <Balancer>
            {"I'm "}
            <span className="underline decoration-double underline-offset-4 decoration-blue-400 font-serif">
              Sam
            </span>
            arth Chitgopekar
          </Balancer>
        </h1>
        <h2 className="text-lg font-serif sm:text-xl mt-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">
          A builder from Chicago, IL{" "}
          <MapPinIcon size={22} className="text-red-400 mb-2 inline-block" />
        </h2>
        <p className="font-mono text-sm pt-4 text-gray-600 dark:text-gray-400">
          [Currently] in{" "}
          <span className="underline group cursor-pointer decoration-wavy text-blue-400">
            {location}
            <PlaneIcon
              className="inline-block group-hover:rotate-12 transition-transform ml-1.5 mb-2"
              size={14}
            />
          </span>
        </p>
      </div>
      <div className="flex justify-center">
        <div className="relative group transition-all h-fit">
          <div className="absolute rounded-full inset-4 group-hover:scale-125 transition-transform -z-10 bg-gradient-to-l from-sky-700 to-indigo-600 blur"></div>
          <div className="w-44 h-44 border hover:border-0 p-4 rounded-full overflow-hidden relative group">
            <div className="absolute w-full h-full rounded-full -z-[1] brand-gradient-bg top-0 left-0 transition-all"></div>
            <Image
              className="absolute inset-0 object-cover transition-all"
              src={Headshot}
              alt="Headshot of Samarth Chitgopekar"
              placeholder="blur"
              draggable={false}
              priority
            />
          </div>
        </div>
      </div>
      <DotGrid />
    </div>
  );
};

export default Hero;
