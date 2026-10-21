import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./layout/Header/Header";
import Footer from "./layout/Footer.tsx/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { SITE } from "@/data/tools";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - Free Online PDF Tools: Edit, Merge, Split & Convert`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["pdf tools", "edit pdf", "merge pdf", "split pdf", "rotate pdf", "image to pdf", "pdf to jpg", "word to pdf", "free pdf tools online"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE.name,
    title: `${SITE.name} - Free Online PDF Tools`,
    description: SITE.description,
    url: "/",
    images: [{ url: "/og?title=Free%20Online%20PDF%20Tools", width: 1200, height: 630, alt: `${SITE.name} - Free Online PDF Tools` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - Free Online PDF Tools`,
    description: SITE.description,
    images: ["/og?title=Free%20Online%20PDF%20Tools"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // Paste the code from Google Search Console / Bing Webmaster into the environment variables
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0066cc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Header />
        {children}
        <Footer />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
