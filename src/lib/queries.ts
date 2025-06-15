import { Asset, File } from "sanity";
import { client } from "../../sanity/lib/client";
import { Category, Post, Location, Audio } from "../../sanity/schema";

export interface ExpandedPost extends Post {
  categories: Category[] | null;
  demo: (File & { asset: Asset }) | null;
}

export const getAllAudios = () =>
  client.fetch<Audio[]>(`*[_type=="audio"] | order(_createdAt desc) {
    ...
  }`);

export const getMostRecentLocation = () =>
  client
    .fetch<Location[]>(
      `*[_type=="location"] | order(time desc) {
    ...
  }`
    )
    .then((result) => (result.length ? result[0] : null));

export const getPageById = (id: string) =>
  client
    .fetch<ExpandedPost[]>(
      `*[_id=="${id}" && _type=="post"] {
    ...,
    demo {
      ...,
      asset->
    },
    categories[]->
  }`
    )
    .then((result) => (result.length ? result[0] : null));

export const getPagesByType = (pageType: Post["pageType"]) =>
  client.fetch<
    ExpandedPost[]
  >(`*[_type=="post" && pageType=="${pageType}"] | order(publishedAt desc) {
    ...,
    demo {
      ...,
      asset->
    },
    categories[]->
  }`);

export const getAllPosts = () =>
  client.fetch<
    { title: string; slug: { current: string }; pageType: string }[]
  >(
    `*[_type=="post"] {
    title,
    slug,
    pageType
  }`
  );

export const getFirstPageByType = (pageType: Post["pageType"]) =>
  client
    .fetch<ExpandedPost[]>(
      `*[_type=="post" && pageType=="${pageType}"] | order(publishedAt desc) {
    ...,
    demo {
      ...,
      asset->
    },
    categories[]->
  }`
    )
    .then((result) => (result.length ? result[0] : null));

export const getPageByTypeAndSlug = (
  pageType: Post["pageType"],
  slug: string
) =>
  client
    .fetch<ExpandedPost[]>(
      `*[_type=="post" && pageType=="${pageType}" && slug.current=="${slug}"] | order(publishedAt desc) {
    ...,
    demo {
      ...,
      asset->
    },
    categories[]->
  }`
    )
    .then((result) => (result.length ? result[0] : null));
