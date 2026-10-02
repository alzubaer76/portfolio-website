import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.meta.url),
  title: site.meta.title,
  description: site.meta.description,
  applicationName: site.meta.siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.meta.url,
    siteName: site.meta.siteName,
    title: site.meta.title,
    description: site.meta.description,
    locale: site.meta.locale,
    images: [{ url: site.meta.ogImage, width: 1200, height: 630, alt: site.meta.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
    images: [site.meta.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0612",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <head>
        {/* Font families also set on :root directly, so they survive even if the
            <html> element's classes are lost (e.g. when embedded by another host). */}
        <style
          // innerHTML, not a text child: the quoted family names must not be re-escaped (hydration mismatch).
          dangerouslySetInnerHTML={{
            __html: `:root{--font-outfit:${outfit.style.fontFamily};--font-jakarta:${jakarta.style.fontFamily}}`,
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
