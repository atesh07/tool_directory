import type { Metadata } from "next";
import { SITE, type Tool, type Faq, toolPath } from "@/data/tools";

export const absoluteUrl = (path = "/") => `${SITE.url.replace(/\/$/, "")}${path}`;

const ogImage = (title: string) => `/og?title=${encodeURIComponent(title)}`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
};

/** Metadata shared by every page: canonical URL, Open Graph and Twitter card */
export function buildMetadata({ title, description, path, keywords, noindex }: PageMeta): Metadata {
  const image = ogImage(title);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: `${title} | ${SITE.name}`,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [image],
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export const toolMetadata = (tool: Tool): Metadata =>
  buildMetadata({
    title: tool.title,
    description: tool.description,
    path: toolPath(tool.slug),
    keywords: tool.keywords,
  });

/* ---------- JSON-LD builders ---------- */

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  logo: absoluteUrl("/icon"),
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
});

export const softwareJsonLd = (tool: Tool) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `${tool.name} - ${SITE.name}`,
  url: absoluteUrl(toolPath(tool.slug)),
  description: tool.description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (web browser)",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});

export const faqJsonLd = (faq: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const howToJsonLd = (tool: Tool) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: `How to use ${tool.name}`,
  step: tool.steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.text,
  })),
});
