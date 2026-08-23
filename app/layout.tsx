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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <InterfaceTranslator />
        <DisclaimerStrip />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
