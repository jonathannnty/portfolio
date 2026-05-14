import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nunito_Sans, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import MainMenuBar from "./components/menubar";
import SiteFooter from "./components/site-footer";
import ReadingProgress from "./components/reading-progress";
import { site } from "@/content/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
  metadataBase: new URL("https://www.jonathan-ty.com"),
  title: {
    default: `${site.name}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    type: "website",
    url: "https://www.jonathan-ty.com",
    images: [
      {
        url: "/images/portfolio.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — Portfolio`,
      },
    ],
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
      className={`js-reveal ${ben.variable} ${nunito.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh flex flex-col" suppressHydrationWarning>
        {/* No-JS fallback: browsers that never run our IntersectionObserver
            should still see the reveal content. The hiding rule in
            globals.css is gated behind `html.js-reveal`, so this override
            keeps everything visible for crawlers and no-JS users. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        {/* Global brushstroke filter — referenced by all .brushed* border pseudo-elements */}
        <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
          <defs>
            <filter id="brushstroke-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="4" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <ReadingProgress />
        <MainMenuBar />
        <main className="flex-1">{children}</main>
        <Analytics />
        <SpeedInsights />
        <SiteFooter />
      </body>
    </html>
  );
}
