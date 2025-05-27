"use client";
import React, { useEffect, useState } from "react";
import Headshot from "../../../public/headshot.png";
import { MapPinIcon, PlaneTakeoffIcon, PlaneIcon } from "lucide-react";
import Image from "next/image";
import { Balancer } from "react-wrap-balancer";
import DotGrid from "@/components/home/dot-grid";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import TextTransition from "../ui/text-transition";
import BlurredText from "../ui/blurred-text";
import GitHubBadge from "../ui/github-badge";

const WORDS = [
  "dj",
  "woodworker",
  "motorcyclist",
  "golfer",
  "producer",
  "climber",
];

interface HeroProps {
  location: string;
}

const Hero = ({ location }: HeroProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 3000);

    return () => clearTimeout(intervalId);
  }, []);

  return (
    <div className="flex flex-col pt-3 min-h-[calc(100vh-4.5rem)] sm:min-h-fit sm:flex-row space-y-12 sm:space-y-0 sm:space-x-8 relative">
      <div className="sm:w-4/5">
        <h1 className="text-5xl sm:text-4xl leading-tight font-extrabold">
          <Balancer>
            {"I'm "}
            <span className="underline decoration-double underline-offset-4 decoration-blue-400 font-sans">
              Sam
            </span>
            arth Chitgopekar
          </Balancer>
        </h1>
        <h2 className="text-lg sm:text-2xl mt-2 whitespace-nowrap">
          A
          <TextTransition
            springConfig="stiff"
            inline
            className="mx-1.5"
            text={WORDS[index % WORDS.length]! || "comedian"}
          />
          from Chicago, IL{" "}
          <MapPinIcon size={22} className="text-red-400 mb-2 inline-block" />
        </h2>
        <h3 className="">
          <Balancer className="md:max-w-[40ch] [&_span]:dark:text-blue-400 [&_span]:text-blue-400 text-base mt-4 italic text-gray-600 dark:text-slate-500">
            Lifelong builder. <span>Coding</span> to make the world{" "}
            <span>a better place</span> and building <span>awesome stuff</span>{" "}
            along the way.
            {/* <TextGenerateEffect
              className="md:max-w-[40ch] text-base mt-4 italic text-gray-700 dark:text-gray-400"
              words={
                "Full stack developer. Coding to make the world a better place and building awesome stuff along the way."
              }
            /> */}
          </Balancer>
        </h3>
        <p className="font-mono text-sm pt-4 text-gray-700 dark:text-gray-500">
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
        <div className="relative group h-fit">
          <div className="absolute rounded-full inset-4 group-hover:scale-125 transition-transform -z-10 bg-gradient-to-l from-sky-400 to-indigo-400 dark:from-sky-700 dark:to-indigo-600 blur"></div>
          <div className="w-44 h-44 p-4 rounded-full overflow-hidden relative group">
            <div className="absolute w-full h-full rounded-full -z-[1] brand-gradient-bg top-0 left-0 group-hover:scale-150 transition-all"></div>
            <Image
              className="w-44 h-44 object-contain"
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
