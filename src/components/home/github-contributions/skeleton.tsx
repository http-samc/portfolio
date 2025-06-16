import React from "react";

const GitHubActivitySkeleton = () => {
  return (
    <div className="not-prose space-y-1 mx-3 mt-3 font-mono text-xs sm:text-sm p-2 rounded border bg-white/50 dark:bg-black/25">
      <div className="w-2/3 sm:w-64 h-6 bg-gray-200/40 rounded animate-pulse" />
      <div className="w-full h-10 sm:h-20 bg-gray-200/40 rounded delay-75 animate-pulse"></div>
    </div>
  );
};

export default GitHubActivitySkeleton;
