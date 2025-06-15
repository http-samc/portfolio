"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { useTheme } from "next-themes";
import { LoaderIcon, MoonIcon, SunIcon } from "lucide-react";

const ThemeButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <Button
      size="icon"
      variant="outline"
      className="rounded-full h-8 w-8 mx-auto"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {mounted ? (
        !theme || theme === "dark" ? (
          <SunIcon size={16} />
        ) : (
          <MoonIcon size={16} />
        )
      ) : (
        <LoaderIcon className="animate-spin" size={16} />
      )}
    </Button>
  );
};

export default ThemeButton;
