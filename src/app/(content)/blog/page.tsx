import BlogPreview from "@/components/blog/blog-preview";
import PageTitle from "@/components/ui/page-title";
import { getPagesByType } from "@/lib/queries";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog",
};

// Async component for blog posts
const BlogPosts = async () => {
  const posts = await getPagesByType("blog");
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {posts.map((post, idx) => (
        <BlogPreview
          key={`blog-preview-${post.slug.current}`}
          {...{ ...post, featured: idx === 0 }}
        />
      ))}
    </div>
  );
};

const Blog = () => {
  return (
    <div className="flex flex-col">
      <PageTitle>Hot off the presses</PageTitle>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded"
              />
            ))}
          </div>
        }
      >
        <BlogPosts />
      </Suspense>
    </div>
  );
};

export default Blog;
