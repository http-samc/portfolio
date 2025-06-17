import {
  XIcon,
  MinusIcon,
  Maximize2Icon,
  OptionIcon,
  CommandIcon,
} from "lucide-react";
import React, { cache } from "react";
import { getFirstPageByType } from "@/lib/queries";
import RemoteMarkdown from "@components/ui/remote-markdown";

const getCachedHomePage = cache(getFirstPageByType);

const CommandWindow = async () => {
  const home = (await getCachedHomePage("home"))!;

  return (
    <div className="w-full relative group overflow-hidden rounded-lg">
      <div className="absolute flex justify-center items-center w-full h-full">
        <div className="absolute -z-10 bg-card opacity-80 backdrop-blur-2xl rounded-lg h-[calc(100%-2px)] w-[calc(100%-2px)]" />
        <div className="absolute -z-20 bg-gradient-to-r from-brand-gradient-from/75 dark:from-brand-gradient-from/50 via-brand-gradient-via/70 dark:via-brand-gradient-via/30 to-brand-gradient-to/80 dark:to-brand-gradient-to/50 rounded-lg h-[calc(100%-4px)] w-[calc(100%-4px)] scale-105 md:scale-100 md:group-hover:scale-105 md:transition-all md:duration-700 md:ease-in-out" />
      </div>
      <div className="absolute flex justify-center items-center w-full h-full"></div>
      <div className="flex flex-col space-x-2 space-y-2 px-2 pt-2 pb-4 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400 w-full flex justify-between">
          <div className="flex space-x-1.5 group pl-1 w-20 mt-1">
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
          <p className="font-mono select-none">{"smrth's mac"}</p>
          <div className="flex items-center space-x-0.5 justify-end mr-1 w-20">
            <OptionIcon size={12} />
            <CommandIcon size={12} />
            <p className="select-none">1</p>
          </div>
        </div>
        <RemoteMarkdown
          markdown={home.body}
          className="prose-p:my-0 pr-2 prose-p:ml-3 prose-headings:m-1 max-w-none prose-img:m-0 z-10"
          prose
        />
      </div>
    </div>
  );
};

export default CommandWindow;
