import { notFound } from "next/navigation";
import GuideArticle from "@/components/seo/GuideArticle";
import { GUIDES, getGuide, guidePath } from "@/data/guides";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) return {};
  return buildMetadata({ title: guide.title, description: guide.description, path: guidePath(guide.slug), type: "article" });
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();
  return <GuideArticle guide={guide} />;
}
