import BlogPreview from "@/components/blog/blog-preview";
import PageTitle from "@/components/ui/page-title";
import { getPagesByType } from "@/lib/queries";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Blog",
};

const Blog = async () => {
  const posts = await getPagesByType("blog");
  return (
    <div className="flex flex-col">
      <PageTitle>Hot off the presses</PageTitle>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {posts.map((post, idx) => (
          <BlogPreview
            key={`blog-preview-${post.slug.current}`}
            {...{ ...post, featured: idx === 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Blog;
