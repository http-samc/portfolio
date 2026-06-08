import Link from "next/link";
import React from "react";
import { FaGithub } from "react-icons/fa6";

interface GitHubBadgeProps {
  owner?: string;
  repo?: string;
}

const GitHubBadge = ({ owner, repo }: GitHubBadgeProps) => {
  return (
    <Link
      href={`https://github.com/${owner}/${repo}`}
      className="inline-flex mx-1.5 px-2 py-1 no-underline items-center bg-[#1b1c1d] dark:bg-black space-x-1.5 w-fit rounded-lg !text-white"
    >
      <FaGithub size={14} className="mt-px" />
      <span className="text-sm">{repo || owner}</span>
    </Link>
  );
};

export default GitHubBadge;
