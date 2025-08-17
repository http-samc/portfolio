"use client";
import React from "react";

const DotGrid = () => {
  return (
    <div className="absolute -z-20 w-full sm:-translate-x-8 h-[calc(100%+3rem)] overflow-hidden">
      <div className="grid grid-cols-6 grid-place-center gap-8 sm:grid-cols-12 relative">
        <div className="absolute w-full h-full bg-gradient-to-b from-background via-transparent group to-background to-95% z-10" />
        <div className="absolute hidden sm:block w-full h-full bg-gradient-to-r from-background via-transparent group to-background from-5% to-95% z-10" />
        {Array.from({ length: 144 }, (_, i) => (
          <span
            key={i}
            className="w-4 h-4 bg-gray-400/30 dark:bg-gray-600/25 group-hover:bg-white rounded-full place-self-center"
          />
        ))}
      </div>
    </div>
  );
};

export default DotGrid;
