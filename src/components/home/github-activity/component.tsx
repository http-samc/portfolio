import { EVENT, getGitHubActivity } from "@/lib/github";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface GitHubActivityProps {
  user: string;
}

export const revalidate = 0;

const GitHubActivity = async ({ user }: GitHubActivityProps) => {
  let data = await getGitHubActivity(user);

  if (!data) {
    data = {
      event: {
        action: "Committed" as unknown as EVENT,
        message: "Private organization",
        color: "skyblue",
        datetimestr: new Date().toISOString(),
      },
      user: {
        avatarUrl: "https://avatars.githubusercontent.com/u/67826352?v=4",
        username: "http-samc",
      },
      repo: {
        name: "<redacted>",
        url: "https://github.com/http-samc",
      },
    };
  }

  return (
    <div className="flex not-prose font-mono mt-2 text-xs sm:text-sm items-center justify-between p-2 mx-3 rounded border bg-white/50 dark:bg-black/25">
      <div className="flex space-x-2 items-center">
        <Image
          src={data.user.avatarUrl}
          alt={`${user}'s GitHub Profile Picture`}
          className="rounded-full"
          width={32}
          height={32}
          draggable={false}
        />
        <span
          className={cn({
            "text-cyan-700 dark:text-cyan-400": data.event.color === "cyan",
            "text-green-700 dark:text-green-400": data.event.color === "green",
            "text-red-700 dark:text-red-400": data.event.color === "red",
            "text-pink-700 dark:text-pink-400": data.event.color === "pink",
            "text-yellow-700 dark:text-yellow-400":
              data.event.color === "yellow",
            "text-blue-700 dark:text-blue-400": data.event.color === "skyblue",
          })}
        >
          {data.event.action}
        </span>
        <Link href={data.repo.url} target="_blank" className="underline">
          @{data.repo.name}
        </Link>
        {data.event.message && (
          <span className="hidden md:block italic">
            &lsquo;{data.event.message}&rsquo;
          </span>
        )}
      </div>
      <span className="hidden md:block">{data.event.datetimestr}</span>
    </div>
  );
};

export default GitHubActivity;
