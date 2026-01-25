import { getGitHubContributionGraph } from "@/lib/github";
import { cn } from "@/lib/utils";
import React from "react";

export interface GitHubContributionsProps {
  user: string;
}

const GitHubContributions = async ({ user }: GitHubContributionsProps) => {
  const data = (await getGitHubContributionGraph(user))!;

  const weeks = Array.from({ length: 52 }, (_, weekIdx) =>
    Array.from({ length: 7 }, (_, dayIdx) => {
      const dayIndex = weekIdx * 7 + dayIdx;
      return data.days[dayIndex];
    })
  );

  return (
    <div className="bg-white/50 mx-3 mt-3 not-prose border rounded dark:bg-black/25 space-y-1 p-2">
      <h2 className="dark:text-white text-black text-xs sm:text-base">
        {data.totalContributions} contributions in the past year
      </h2>
      <div
        className="grid gap-px sm:gap-1"
        style={{
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          gridTemplateColumns: "repeat(52, minmax(0, 1fr))",
        }}
      >
        {weeks.map((week, weekIdx) =>
          week.map((day, dayIdx) =>
            day ? (
              <div
                key={day.date}
                className={cn("h-1 w-1 sm:h-2 sm:w-2 rounded-[1px]", {
                  "bg-gray-400/30 dark:bg-gray-200/40":
                    day.contributionCount === 0,
                  "bg-green-300":
                    day.contributionCount > 0 && day.contributionCount < 3,
                  "bg-green-500":
                    day.contributionCount >= 3 && day.contributionCount < 10,
                  "bg-green-700": day.contributionCount >= 10,
                })}
              />
            ) : (
              <div
                key={`empty-${weekIdx}-${dayIdx}`}
                className="h-2 w-2 bg-transparent rounded-full"
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default GitHubContributions;
