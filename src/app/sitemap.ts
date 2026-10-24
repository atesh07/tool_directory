import type { MetadataRoute } from "next";
import { SITE, TOOLS, toolPath } from "@/data/tools";
import { GUIDES, HI_GUIDES, guidePath, hiGuidePath } from "@/data/guides";
import { EXAMS, EXAMS_UPDATED, EXAM_HUB_PATH, examPath } from "@/data/exam-specs";
import { docPagePath, docPages } from "@/lib/examContent";

const siteUrl = SITE.url.replace(/\/$/, "");

// Tools and guides carry their own `updated` date; bump these when a fixed page really changes
const HOME_UPDATED = "2026-10-23";
const LEGAL_UPDATED = "2026-10-22";

const latest = (...dates: string[]) => new Date(dates.reduce((a, b) => (a > b ? a : b)));

export default function sitemap(): MetadataRoute.Sitemap {
  const toolDates = TOOLS.map((t) => t.updated);
  const guideDates = GUIDES.map((g) => g.updated);
  const hiDates = HI_GUIDES.map((g) => g.updated);

  // A list page changes whenever something it lists changes
  const pages = [
    { path: "", lastModified: latest(HOME_UPDATED, ...toolDates, ...guideDates), priority: 1, changeFrequency: "weekly" as const },
    { path: "/tools", lastModified: latest(HOME_UPDATED, ...toolDates), priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/guides", lastModified: latest(HOME_UPDATED, ...guideDates), priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/hi", lastModified: latest(...hiDates), priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/about", lastModified: new Date(LEGAL_UPDATED), priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/contact", lastModified: new Date(LEGAL_UPDATED), priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacy", lastModified: new Date(LEGAL_UPDATED), priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/terms", lastModified: new Date(LEGAL_UPDATED), priority: 0.2, changeFrequency: "yearly" as const },
  ].map(({ path, ...rest }) => ({ url: `${siteUrl}${path}`, ...rest }));

  const tools = TOOLS.map((tool) => ({
    url: `${siteUrl}${toolPath(tool.slug)}`,
    lastModified: new Date(tool.updated),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const guides = [...GUIDES.map((g) => ({ g, path: guidePath(g.slug) })), ...HI_GUIDES.map((g) => ({ g, path: hiGuidePath(g.slug) }))].map(({ g, path }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(g.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const exams = [
    { url: `${siteUrl}${EXAM_HUB_PATH}`, lastModified: new Date(EXAMS_UPDATED()), changeFrequency: "monthly" as const, priority: 0.9 },
    ...EXAMS.map((e) => ({ url: `${siteUrl}${examPath(e.slug)}`, lastModified: new Date(e.lastVerified), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...EXAMS.flatMap((e) =>
      docPages(e).map((d) => ({ url: `${siteUrl}${docPagePath(e, d)}`, lastModified: new Date(e.lastVerified), changeFrequency: "monthly" as const, priority: 0.7 })),
    ),
  ];

  return [...pages, ...tools, ...exams, ...guides];
}
