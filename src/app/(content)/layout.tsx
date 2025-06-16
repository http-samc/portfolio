import React from "react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Providers from "@/components/layout/providers";
import { Metadata } from "next";
import { getAllPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: {
    default: "Hey, it's Sam!",
    template: "%s | Sam Chitgopekar",
  },
  openGraph: {
    title: "smrth.dev",
    description: "Samarth (Sam) Chitgopekar's personal site.",
    url: "https://smrth.dev",
    siteName: "smrth.dev",
    images: [
      {
        url: "https://smrth.dev/og-image.png",
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "smrth.dev",
    description: "Samarth (Sam) Chitgopekar's personal site.",
    images: {
      url: "https://smrth.dev/og-image.png",
      alt: "Computer Icon",
    },
  },
};

// Automatically revalidate every 7 days
export const revalidate = 60 * 60 * 24;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getAllPosts();

  return (
    <>
      <Providers>
        <div className="fixed top-0 h-[3rem] w-full bg-background/80 z-40 backdrop-blur-md"></div>
        <main className="min-h-screen flex flex-col justify-between max-w-[800px] mx-auto">
          <Header posts={posts} />
          <section className="h-full mt-14 p-6">{children}</section>
          <Footer />
        </main>
      </Providers>
    </>
  );
}
