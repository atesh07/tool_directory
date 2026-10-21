import StaticPage from "@/components/layout/StaticPage";
import { SITE } from "@/data/tools";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Contact the ToolsTree team for help with a tool, feedback, or suggestions for new PDF tools.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <StaticPage title="Contact Us">
      <p>We read every message. Write to us for any of the following:</p>
      <ul>
        <li>Help with a tool, or a problem with a specific file</li>
        <li>Bug reports and feature requests</li>
        <li>Ideas for new tools</li>
        <li>Business and partnership enquiries</li>
      </ul>
      <p>
        Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>
      <p>When reporting a problem, please tell us the tool you used, your browser, and what you expected to happen. Do not send private documents by email.</p>
    </StaticPage>
  );
}
