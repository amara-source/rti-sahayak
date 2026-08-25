import type { Metadata } from "next";
import { DisclaimerStrip } from "@/components/layout/DisclaimerStrip";
import { AppChrome } from "@/components/layout/AppChrome";
import { layoutCopy } from "@/content/layout-copy";
import "./globals.css";
import "./consistency.css";

export const metadata: Metadata = {
  title: `${layoutCopy.wordmark}, ${layoutCopy.tagline}`,
  description: layoutCopy.disclaimer,
};

const themeBootstrap = `
  try {
    const saved = localStorage.getItem("rti-theme");
    const theme = saved === "light" || saved === "dark"
      ? saved
      : "light";
    document.documentElement.dataset.theme = theme;
    const accent = localStorage.getItem("rti-accent");
    document.documentElement.dataset.accent = ["blue", "teal", "orange", "violet"].includes(accent)
      ? accent
      : "blue";
  } catch (_) {
    document.documentElement.dataset.theme = "light";
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <DisclaimerStrip />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
