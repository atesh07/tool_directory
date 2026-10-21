import type { MetadataRoute } from "next";
import { SITE, TOOLS, toolPath } from "@/data/tools";

const siteUrl = SITE.url.replace(/\/$/, "");

// Bump this date when a page's content really changes
const lastModified = new Date("2026-10-21");

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = TOOLS.map((tool) => ({
    url: `${siteUrl}${toolPath(tool.slug)}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/tools", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/contact", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  ].map((p) => ({ url: `${siteUrl}${p.path}`, lastModified, changeFrequency: p.changeFrequency, priority: p.priority }));

  return [...pages, ...tools];
}
