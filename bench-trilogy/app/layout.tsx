import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Self-hosted by next/font at build time (no runtime CDN, Pattern 32).
const displayFont = Cormorant_Garamond({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const bodyFont = Inter({
  variable: "--ff-body",
  subsets: ["latin"],
  display: "swap",
});
const monoFont = JetBrains_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bench-trilogy.techbridge.edu.gh"),
  title: {
    default: "THE BENCH TRILOGY — One Bench. Three Worlds. Made in Ghana.",
    template: "%s · THE BENCH TRILOGY",
  },
  description:
    "A Ghanaian film trilogy that travels from a single Labadi bench to Times Square: SISTAH ONYX (Times Square Dreams), PUZZLE GAME LOVE, and FROM BENCH TO BRAND. Director's-cut bibles, the VFX kit, and the trilogy method.",
  keywords: [
    "Ghana film",
    "The Bench Trilogy",
    "Sistah Onyx",
    "Times Square Dreams",
    "Puzzle Game Love",
    "From Bench to Brand",
    "Made in Ghana",
    "director's cut bible",
  ],
  openGraph: {
    title: "THE BENCH TRILOGY",
    description: "One Bench. Three Worlds. Made in Ghana.",
    type: "website",
    locale: "en_GH",
    siteName: "THE BENCH TRILOGY",
  },
  twitter: {
    card: "summary_large_image",
    title: "THE BENCH TRILOGY",
    description: "One Bench. Three Worlds. Made in Ghana.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper font-body">
        {children}
      </body>
    </html>
  );
}
