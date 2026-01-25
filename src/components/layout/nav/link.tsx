import Link from "next/link";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NavLinkProps {
  text: string;
  icon: ReactNode;
  href: string;
  type: "desktop" | "mobile";
  active?: boolean;
}

const NavLink = ({ text, icon, href, type, active }: NavLinkProps) => {
  return (
    <Link
      className={cn("flex items-center relative h-8 px-2")}
      href={href}
    >
      {icon}
      {(active || type === "mobile") && (
        <>
          <span className={cn("z-20 font-serif text-sm", {
            "ml-1": type === "desktop",
            "ml-2": type === "mobile",
          })}>{text}</span>
          {type === "desktop" && (
            <motion.span
              layoutId="active-nav-indicator"
              className="absolute w-full inset-0 -z-10 bg-secondary hover:bg-gradient-to-br from-brand-gradient-from via-brand-gradient-via to-brand-gradient-to"
              style={{
                borderRadius: 9999,
              }}
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.5,
                layout: { duration: 0 },
              }}
              // initial={false}
            />
          )}
        </>
      )}
    </Link>
  );
};

export default NavLink;
