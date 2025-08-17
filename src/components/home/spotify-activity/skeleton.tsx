import React from "react";

const SpotifyActivitySkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 mt-2 md:space-y-0 md:flex-row justify-between md:space-x-4 pl-3 pr-6">
      <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-32 lg:w-48 rounded-sm" />
      <div className="grid grid-cols-4 pl-4 md:pl-0 md:grid-cols-7 min-w-fit gap-x-2 gap-y-2">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-gray-800 w-12 aspect-square rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default SpotifyActivitySkeleton;
