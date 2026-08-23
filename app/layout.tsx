import type { Metadata } from "next";
import { DisclaimerStrip } from "@/components/layout/DisclaimerStrip";
import { AppChrome } from "@/components/layout/AppChrome";
import { InterfaceTranslator } from "@/components/layout/InterfaceTranslator";
import { layoutCopy } from "@/content/layout-copy";
import "./globals.css";

export const metadata: Metadata = {
  title: `${layoutCopy.wordmark}, ${layoutCopy.tagline}`,
  description: layoutCopy.disclaimer,
};

const themeBootstrap = `
  try {
    const saved = localStorage.getItem("umang-theme");
    const theme = saved === "light" || saved === "dark"
      ? saved
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
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
        <InterfaceTranslator />
        <DisclaimerStrip />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
