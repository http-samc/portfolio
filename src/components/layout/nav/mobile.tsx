import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, PencilIcon } from "lucide-react";
import ThemeButton from "../theme-button";
import NavLink from "./link";
import { NavBarProps } from "../header";

const MobileNav = ({ pages }: NavBarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button size="icon" variant="outline" className="w-6 h-6">
          <MenuIcon className="w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-48 flex flex-col justify-between">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex flex-col">
          {pages.map((page) => (
            <NavLink {...page} key={`mobile-nav-${page.href}`} type="mobile" />
          ))}
        </div>
        <div className=""></div>
        <ThemeButton />
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
