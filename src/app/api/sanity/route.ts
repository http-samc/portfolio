import { getPageById } from "@/lib/queries";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client } from "@/../sanity/lib/client";
import { SanityDocument } from "next-sanity";

export async function POST() {
  for (const [key, value] of (await headers()).entries()) {
    if (key !== "sanity-document-id") continue;

    // First try to get page since that's most common
    const page = await getPageById(value);

    if (page) {
      switch (page.pageType) {
        case "home":
          revalidatePath("/");
          break;
        case "research":
          revalidatePath("/research");
          break;
        case "project":
          revalidatePath("/projects");
          revalidatePath(`/projects/${page.slug.current}`);
          break;
        case "blog":
          revalidatePath("/blog");
          revalidatePath(`/blog/${page.slug.current}`);
          break;
        case "essay":
          revalidatePath("/essays");
          revalidatePath(`/essays/${page.slug.current}`);
          break;
      }
    } else {
      const doc = await client.fetch<SanityDocument>(`*[_id == "${value}"][0]`);

      if (doc._type === "audio") {
        console.log("Revalidating 2phone-engineering");
        revalidatePath("/2phone-engineering");
      }
    }

    console.log("Revalidated .");
  }

  return NextResponse.json({ revalidated: true });
}
