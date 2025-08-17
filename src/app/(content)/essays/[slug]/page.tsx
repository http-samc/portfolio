import MarkdownPage from "@/components/ui/markdown-page";
import { getPageByTypeAndSlug } from "@/lib/queries";
import { Metadata } from "next";
import React from "react";

interface EssayProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: EssayProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageByTypeAndSlug("essay", slug);
  return {
    title: `[Essay] ${page?.title}`,
    description: page?.description,
  };
}

// make this general catch-all???

const Essay = async ({ params }: EssayProps) => {
  const { slug } = await params;
  return <MarkdownPage pageType="essay" slug={slug} className="font-serif" />;
};

export default Essay;
