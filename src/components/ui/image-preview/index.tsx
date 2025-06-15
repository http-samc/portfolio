import { XIcon, MinusIcon, Maximize2Icon, LockIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import ClickMenu from "./click-menu";

interface ImagePreviewProps {
  source: string;
  as: "iframe" | "image";
  caption?: string;
  browserUrl?: boolean | string;
  clickRedirect?: boolean | string;
  noScroll?: boolean;
  width?: number;
  height?: number;
}

const ImagePreview = ({
  source,
  as,
  caption,
  browserUrl,
  clickRedirect,
  noScroll,
  width,
  height,
}: ImagePreviewProps) => {
  return (
    <div className="w-full flex flex-col space-y-2 py-3">
      <div className="border w-fit bg-black mx-auto rounded-lg overflow-hidden shadow-black/40 dark:shadow-white/5 shadow-lg">
        {browserUrl !== false && (
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 w-full p-2">
            <div className="flex space-x-1.5 group w-20 pl-1">
              <div className="w-3 h-3 bg-red-400 active:bg-red-300 cursor-pointer rounded-full flex justify-center items-center">
                <XIcon
                  size={10}
                  className="text-red-950 md:sm:text-transparent rotate-180 md:hover:text-red-950 md:transition-all"
                />
              </div>
              <div className="w-3 h-3 bg-yellow-500 active:bg-yellow-300 cursor-pointer rounded-full flex justify-center items-center">
                <MinusIcon
                  size={10}
                  className="text-yellow-950 md:text-transparent rotate-180 md:hover:text-yellow-950 md:transition-all"
                />
              </div>
              <div className="w-3 h-3 bg-green-500 active:bg-green-400 cursor-pointer rounded-full flex justify-center items-center">
                <Maximize2Icon
                  size={7}
                  fontWeight={900}
                  className="text-green-950 md:text-transparent rotate-90 md:hover:text-green-950 md:transition-all"
                />
              </div>
            </div>
            <div className="dark:bg-gray-700 bg-gray-200/80 rounded h-full flex p-1 items-center space-x-1.5 text-xs w-3/5 text-gray-500 dark:text-gray-300">
              <LockIcon size={10} className="ml-1" />
              <span>
                {browserUrl ||
                  source
                    .replace("http://", "")
                    .replace("https://", "")
                    .split("/")[0]}
              </span>
            </div>
            <div className="w-16 pl-4 flex justify-center space-x-2 items-center text-gray-500">
              {clickRedirect !== false && (
                <ClickMenu
                  url={
                    typeof clickRedirect === "string" ? clickRedirect : source
                  }
                />
              )}
            </div>
          </div>
        )}
        {as === "image" ? (
          <Image
            src={source}
            alt={caption || ""}
            width={width || 700}
            height={height || 500}
            draggable={false}
            className="bg-black"
          />
        ) : (
          <iframe
            src={source}
            frameBorder="0"
            width="100%"
            height="500px"
            {...(noScroll && {
              className: "overflow-hidden",
              scrolling: "no",
            })}
          ></iframe>
        )}
      </div>
      {caption && (
        <caption className="text-sm text-gray-600 dark:text-gray-400">
          {caption}
        </caption>
      )}
    </div>
  );
};

export default ImagePreview;
