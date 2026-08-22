import type { Metadata } from "next";
import { DisclaimerStrip } from "@/components/layout/DisclaimerStrip";
import { Footer } from "@/components/layout/Footer";
import { GovStrip } from "@/components/layout/GovStrip";
import { Header } from "@/components/layout/Header";
import { layoutCopy } from "@/content/layout-copy";
import "./globals.css";

export const metadata: Metadata = {
  title: `${layoutCopy.wordmark} — ${layoutCopy.tagline}`,
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
        <DisclaimerStrip />
        <GovStrip />
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
