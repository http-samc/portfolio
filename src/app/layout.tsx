import { red_hat_display, roboto_mono, unifraktur_cook } from "@/lib/fonts";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "smrth.dev",
  metadataBase: new URL("https://smrth.dev"),
  description:
    "I'm Samarth Chitgopekar, a full stack developer coding to make the world a better place and building awesome stuff along the way.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const revalidate = 86400; // 24 hours

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${red_hat_display.variable} ${roboto_mono.variable} ${unifraktur_cook.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
