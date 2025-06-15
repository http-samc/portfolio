import createImageUrlBuilder from "@sanity/image-url";

import type { Asset, Image } from "sanity";

import { dataset, projectId } from "../env";
import { buildFileUrl } from "@sanity/asset-utils";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForFile = (asset: Asset) =>
  buildFileUrl(asset, {
    projectId: projectId || "",
    dataset: dataset || "",
  });

export const urlForImage = (source: Image) => {
  return imageBuilder?.image(source).auto("format").fit("max");
};
