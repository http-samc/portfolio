import React, { Suspense } from "react";
import GithubContributions, { GitHubContributionsProps } from "./component";
import GitHubContributionsSkeleton from "./skeleton";

const Index = (props: GitHubContributionsProps) => {
  return (
    <Suspense fallback={<GitHubContributionsSkeleton />}>
      <GithubContributions {...props} />
    </Suspense>
  );
};

export default Index;
