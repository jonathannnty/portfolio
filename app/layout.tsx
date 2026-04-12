import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import MainMenuBar from "./components/menubar";
import SiteFooter from "./components/site-footer";
import { site } from "@/content/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const ben = localFont({
  src: "../ben.ttf",
  variable: "--font-ben",
  display: "swap",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`js-reveal ${ben.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh flex flex-col" suppressHydrationWarning>
        {/* No-JS fallback: browsers that never run our IntersectionObserver
            should still see the reveal content. The hiding rule in
            globals.css is gated behind `html.js-reveal`, so this override
            keeps everything visible for crawlers and no-JS users. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        <MainMenuBar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
