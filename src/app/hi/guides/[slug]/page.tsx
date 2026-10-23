import { notFound } from "next/navigation";
import GuideArticle from "@/components/seo/GuideArticle";
import { HI_GUIDES, getHiGuide, guidePath, hiGuidePath } from "@/data/guides";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return HI_GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = getHiGuide(params.slug);
  if (!guide) return {};
  return buildMetadata({
    title: guide.title,
    description: guide.description,
    path: hiGuidePath(guide.slug),
    ogTitle: `${guide.tool.replace(/-/g, " ")} guide in Hindi`,
    locale: "hi_IN",
    type: "article",
    languages: guide.alternate ? { en: guidePath(guide.alternate), hi: hiGuidePath(guide.slug) } : undefined,
  });
}

export default function HindiGuidePage({ params }: { params: { slug: string } }) {
  const guide = getHiGuide(params.slug);
  if (!guide) notFound();
  return <GuideArticle guide={guide} />;
}
