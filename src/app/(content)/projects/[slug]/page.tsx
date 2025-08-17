import MarkdownPage from "@/components/ui/markdown-page";
import { getPageByTypeAndSlug } from "@/lib/queries";
import { Metadata } from "next";
import React from "react";

interface ProjectProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageByTypeAndSlug("project", slug);
  return {
    title: `[Project] ${page?.title}`,
    description: page?.description,
  };
}

// make this general catch-all???

const Project = async ({ params }: ProjectProps) => {
  const { slug } = await params;
  return (
    <MarkdownPage pageType="project" slug={slug} showPublishDate={false} />
  );
};

export default Project;
