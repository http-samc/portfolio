import MarkdownPage from "@/components/ui/markdown-page";
import { getPageByTypeAndSlug } from "@/lib/queries";
import { Metadata } from "next";
import React from "react";

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageByTypeAndSlug("blog", slug);
  return {
    title: `[Blog] ${page?.title}`,
    description: page?.description,
  };
}

// make this general catch-all???

const Post = async ({ params }: PostProps) => {
  const { slug } = await params;
  return <MarkdownPage pageType="blog" slug={slug} />;
};

export default Post;
