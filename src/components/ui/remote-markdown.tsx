import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import CommandBlock from "@/components/home/command-block";
import { cn } from "@/lib/utils";
import GitHubActivity from "@/components/home/github-activity";
import BlurredText from "./blurred-text";
import ImagePreview from "./image-preview";
import GitHubBadge from "./github-badge";
import Experience from "../home/experience";
import ExperienceGrid from "../home/experience-grid";
import SpotifyActivity from "../home/spotify-activity";
import Socials from "./socials";
import GitHubContributions from "../home/github-contributions";

interface RemoteMarkdownProps {
  markdown: string;
  prose?: boolean;
  className?: string;
}

const RemoteMarkdown = async ({
  markdown,
  prose = true,
  className,
}: RemoteMarkdownProps) => {
  return (
    <div
      className={cn(
        {
          "prose dark:prose-invert prose-a:dark:text-purple-400 prose-a:text-purple-800 prose-a:decoration-underline prose-a:underline-offset-2":
            prose,
        },
        className
      )}
    >
      <MDXRemote
        source={markdown}
        components={{
          CommandBlock,
          GitHubActivity,
          GitHubContributions,
          BlurredText,
          ImagePreview,
          GitHubBadge,
          Experience,
          ExperienceGrid,
          SpotifyActivity,
          Socials,
        }}
      />
    </div>
  );
};

export default RemoteMarkdown;
