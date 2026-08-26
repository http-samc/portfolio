"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Provider as ReactWrapProvider } from "react-wrap-balancer";
import { TooltipProvider } from "../ui/tooltip";

let posthogInitialized = false;

const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (posthogInitialized) return;
    posthogInitialized = true;

    import("posthog-js").then(({ default: posthog }) => {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      });
    });
  }, []);

  return (
    <ThemeProvider
      defaultTheme="dark"
      attribute="class"
      enableSystem={true}
      disableTransitionOnChange
    >
      <ReactWrapProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ReactWrapProvider>
    </ThemeProvider>
  );
};

export default Providers;
