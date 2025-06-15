import React from "react";
import { Post } from "../../../sanity/schema";
import { getFirstPageByType, getPageByTypeAndSlug } from "@/lib/queries";
import PageTitle from "./page-title";
import Image from "next/image";
import { urlForFile, urlForImage } from "../../../sanity/lib/image";
import RemoteMarkdown from "./remote-markdown";
import { TracingBeam } from "./tracing-beam";
import Balancer from "react-wrap-balancer";

interface MarkdownPageProps {
  pageType: Post["pageType"];
  slug?: string;
  showPublishDate?: boolean;
  className?: string;
}

const MarkdownPage = async ({
  pageType,
  slug,
  showPublishDate,
  className,
}: MarkdownPageProps) => {
  const page = await (slug !== undefined
    ? getPageByTypeAndSlug(pageType, slug)
    : getFirstPageByType(pageType));

  if (!page) {
    return null;
  }

  return (
    <TracingBeam className={className}>
      <PageTitle>{page.title}</PageTitle>
      <div className="flex flex-col w-full">
        {page.description && <p className="italic">{page.description}</p>}
        <p className="text-sm text-gray-700 dark:text-gray-400">
          <Balancer>
            {showPublishDate && page.publishedAt
              ? `Published ${new Date(page.publishedAt).toLocaleDateString()}`
              : ""}
            {showPublishDate && page.publishedAt && page.categories?.length
              ? " under "
              : ""}
            {page.categories?.length
              ? page.categories.map((category) => category.title).join(" • ")
              : ""}
          </Balancer>
        </p>
      </div>
      {page.demo ? (
        <div className="w-full aspect-video border overflow-hidden rounded-lg relative my-6">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 -z-10 animate-pulse"></div>
          <video
            autoPlay
            muted
            loop
            src={urlForFile(page.demo.asset)}
            className="object-contain"
          />
        </div>
      ) : (
        page.mainImage && (
          <div className="w-full aspect-video relative my-6">
            <Image
              src={urlForImage(page.mainImage).width(800).url()}
              alt={page.description}
              className="object-contain"
              draggable={false}
              loading="eager"
              priority
              fill
            />
          </div>
        )
      )}
      <RemoteMarkdown className="my-3" markdown={page.body} />
    </TracingBeam>
  );
};

export default MarkdownPage;
