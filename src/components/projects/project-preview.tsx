import { ExpandedPost } from "@/lib/queries";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { urlForImage } from "../../../sanity/lib/image";
import { cn } from "@/lib/utils";

const ProjectPreview = (project: ExpandedPost) => {
  return (
    <Link
      href={{
        pathname: `/projects/${project.slug.current}`,
      }}
      className={cn(
        "border group rounded w-full flex justify-between relative h-32 lg:h-72 overflow-hidden transition-transform lg:hover:scale-105 lg:active:scale-95",
        {
          "lg:col-span-2": project.featured,
          "lg:flex-col": !project.featured,
        }
      )}
    >
      <div
        className={cn("w-1/3 h-full m-auto lg:h-2/3 relative rounded", {
          "lg:w-full": !project.featured,
        })}
      >
        {project.mainImage && (
          <Image
            src={urlForImage(project.mainImage).width(300).url()}
            fill
            style={{ objectFit: "contain" }}
            alt={project.title}
            className="p-5"
            draggable={false}
          />
        )}
        <div className="absolute m-2 w-32 h-32 rounded-full -left-3 -top-3 lg:group-hover:bg-brand-gradient-from/40 dark:lg:group-hover:bg-brand-gradient-from mix-blend-lighten filter blur-xl -z-30 transition-all"></div>
        <div className="absolute m-3 w-32 h-32 rounded-full -right-3 -top-3 lg:group-hover:bg-brand-gradient-via/40 dark:lg:group-hover:bg-brand-gradient-via mix-blend-lighten filter blur-xl -z-10 transition-all"></div>
        <div className="absolute w-32 h-32 rounded-full left-0 bottom-0 lg:group-hover:bg-brand-gradient-to/40 dark:lg:group-hover:bg-brand-gradient-to mix-blend-lighten filter blur-xl -z-20 transition-all"></div>
        <div className="absolute w-32 h-32 rounded-full right-0 bottom-0 lg:group-hover:bg-brand-gradient-from/40 dark:lg:group-hover:bg-brand-gradient-from mix-blend-lighten filter blur-xl -z-20 transition-all"></div>
      </div>
      <div
        className={cn(
          "w-2/3 lg:group-hover:border-0 border-l h-full flex flex-col space-y-1 px-4 py-1",
          {
            "lg:w-full lg:border-l-0 lg:border-t lg:h-1/3": !project.featured,
            "lg:p-4": project.featured,
          }
        )}
      >
        <p
          className={cn("font-semibold mt-2 lg:mt-0 text-xl", {
            "lg:text-4xl": project.featured,
          })}
        >
          {project.title}
        </p>
        <p
          className={cn("text-gray-700 dark:text-gray-400", {
            "lg:line-clamp-2": !project.featured,
          })}
        >
          {project.description}
        </p>
        <p
          className={cn(
            "overflow-hidden text-sm text-blue-400 whitespace-nowrap overflow-ellipsis font-mono",
            {
              "lg:overflow-auto lg:whitespace-normal": project.featured,
              "lg:hidden": !project.featured,
            }
          )}
        >
          {project.categories &&
            project.categories.map((category) => category.title).join(" • ")}
        </p>
      </div>
    </Link>
  );
};

export default ProjectPreview;
