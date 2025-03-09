import { type PropsWithChildren } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { RootProvider } from "#/components/providers/root";
import { cn } from "#/lib/utils";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elwood",
  description: "",
};

export default function RootLayout(props: PropsWithChildren) {
  const bodyClassname = cn(
    geistSans.variable,
    geistMono.variable,
    "antialiased",
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bodyClassname}>
        <RootProvider>{props.children}</RootProvider>
      </body>
    </html>
  );
}
