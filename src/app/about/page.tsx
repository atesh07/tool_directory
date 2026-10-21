import Link from "next/link";
import StaticPage from "@/components/layout/StaticPage";
import { SITE, TOOLS, toolPath } from "@/data/tools";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About ToolsTree",
  description: "ToolsTree offers free, private PDF tools that run in your browser. Learn why we built it and how your files stay on your device.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <StaticPage title="About ToolsTree">
      <p>
        {SITE.name} is a set of free online tools for working with PDF files. We built it so that everyday jobs such as
        merging, splitting, rotating or editing a PDF do not need expensive software, an account, or uploading private
        documents to a stranger&apos;s server.
      </p>
      <h2>Private by design</h2>
      <p>
        Our tools run inside your web browser. When you open a file, it is processed on your own device and is not sent
        to our servers. Read the details in our <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <h2>What you can do</h2>
      <ul>
        {TOOLS.map((tool) => (
          <li key={tool.slug}>
            <Link href={toolPath(tool.slug)}>{tool.name}</Link>: {tool.intro}
          </li>
        ))}
      </ul>
      <p>We are adding more tools regularly, such as compress, protect and sign.</p>
      <h2>Get in touch</h2>
      <p>
        Questions, suggestions or a tool you would like to see? Write to us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
        or visit the <Link href="/contact">contact page</Link>.
      </p>
    </StaticPage>
  );
}
