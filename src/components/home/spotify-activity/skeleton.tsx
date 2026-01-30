import React from "react";
import { cn } from "@/lib/utils";

const SpotifyActivitySkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between md:space-x-4 mt-2 pl-3 pr-6">
      <div className="flex gap-2 bg-white/50 dark:bg-black/25 border p-2 rounded-sm min-w-fit">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 w-20 h-20 rounded-full" />
        <div className="w-[150px] flex flex-col justify-between py-1">
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-4 w-full rounded-sm" />
            <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-3 w-2/3 rounded-sm" />
          </div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-3 w-16 rounded-sm" />
        </div>
      </div>
      <div className="grid grid-cols-4 pl-4 md:pl-0 md:grid-cols-7 min-w-fit gap-x-2 gap-y-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse bg-gray-200 dark:bg-gray-800 w-12 aspect-square rounded-full",
              { "md:hidden": i >= 14 }
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default SpotifyActivitySkeleton;
