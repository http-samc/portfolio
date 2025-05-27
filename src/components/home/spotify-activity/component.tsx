import { getSpotifyData } from "@/lib/spotify";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import SpotifyLogo from "@/../public/spotify-logo.png";

export const revalidate = 0;

const SpotifyActivity = async () => {
  const { currentPlayback, topArtists } = await getSpotifyData();

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between md:space-x-4 mt-2 pl-3 pr-6">
      {currentPlayback && (
        <div className="flex gap-2 bg-white/50 dark:bg-black/25 border p-2 rounded-sm min-w-fit">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-sm overflow-hidden">
            <Image
              src={currentPlayback.albumArt}
              alt="album art"
              draggable={false}
              sizes="30vw"
              fill
            />
          </div>
          <div className="w-[150px] flex flex-col items-start justify-between">
            <div className="">
              <p className="italic font-medium line-clamp-1">
                {currentPlayback.trackName}
              </p>
              <p className="line-clamp-1">{currentPlayback.artist}</p>
            </div>
            <div className="flex items-center space-x-2 pb-1">
              <p className="text-xs font-mono text-muted-foreground">
                live on{" "}
              </p>
              <Image
                src={SpotifyLogo}
                alt="Spotify Logo"
                width={12}
                height={12}
                className="pt-0.5"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-4 pl-4 md:pl-0 md:grid-cols-7 min-w-fit gap-x-2 gap-y-2">
        {topArtists.slice(0, 16).map((artist, idx) => (
          <div
            key={`top-artist-${artist.name}`}
            className={cn("cursor-pointer", { "md:hidden": idx >= 14 })}
          >
            <div className="relative grid place-content-center group/card grayscale hover:grayscale-0 w-12 aspect-square overflow-hidden rounded-full">
              <Image
                src={
                  artist.art.find((art) => art.width === art.height)?.url ??
                  artist.art[0].url
                }
                alt={`${artist.name}-art`}
                draggable={false}
                sizes="10vw"
                fill
              />
              <div className="hidden group-hover/card:grid w-16 -ml-2.5 aspect-square inset-0 bg-black/25 backdrop-blur-lg place-content-center">
                <p className="text-[8px] px-2 text-white text-center z-40">
                  {artist.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotifyActivity;
