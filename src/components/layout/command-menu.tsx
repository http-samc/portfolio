import React, { Dispatch, SetStateAction } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { NavLinkProps } from "./nav/link";
import { getAllPosts } from "@/lib/queries";

interface CommandMenuProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  pages: Omit<NavLinkProps, "type">[];
  posts: Awaited<ReturnType<typeof getAllPosts>>;
}

export function CommandMenu({ open, setOpen, pages, posts }: CommandMenuProps) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const getRoute = (pageType: string) => {
    if (["project", "essay"].includes(pageType)) {
      return `${pageType}s`;
    }
    return pageType;
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find anything..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {pages.map((page) => (
            <CommandItem
              className="cursor-pointer"
              key={`command-item-${page.href}`}
              onSelect={() => {
                router.push(page.href);
                setOpen(false);
              }}
            >
              {page.text.charAt(0).toUpperCase() + page.text.slice(1)}
            </CommandItem>
          ))}
          {posts
            .filter((post) => !["home", "research"].includes(post.pageType))
            .map((post) => (
              <CommandItem
                className="cursor-pointer"
                key={`command-item-${post.pageType}-${post.slug.current}`}
                onSelect={() => {
                  router.push(
                    `/${getRoute(post.pageType)}/${post.slug.current}`
                  );
                  setOpen(false);
                }}
              >
                [
                {post.pageType.charAt(0).toUpperCase() + post.pageType.slice(1)}
                ] {post.title}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default CommandMenu;
