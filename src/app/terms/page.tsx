import StaticPage from "@/components/layout/StaticPage";
import { SITE } from "@/data/tools";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms for using ToolsTree's free online PDF tools, including acceptable use.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service" updated="October 21, 2026">
      <p>By using {SITE.name} you agree to these terms. If you do not agree, please do not use the service.</p>
      <h2>The service</h2>
      <p>
        {SITE.name} provides free online tools for working with PDF files and images. The tools are provided &quot;as is&quot;
        and may change, be interrupted, or be removed at any time.
      </p>
      <h2>Acceptable use</h2>
      <p>You agree not to use the service to:</p>
      <ul>
        <li>forge, falsify or alter identity documents, certificates, mark sheets, insurance papers, financial records or any other official document in order to deceive another person or organisation;</li>
        <li>infringe anyone&apos;s copyright or other rights;</li>
        <li>break the law, or try to disrupt or attack the service.</li>
      </ul>
      <p>You are solely responsible for the documents you edit and what you do with them.</p>
      <h2>Your content</h2>
      <p>Your files stay on your device and remain yours. We do not claim any rights over them.</p>
      <h2>No warranty</h2>
      <p>
        We try to make the tools accurate, but we do not guarantee that the output will be error-free or suitable for a
        particular purpose. Always check the result before relying on it, and keep a copy of your original file.
      </p>
      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of the service.</p>
      <h2>Changes</h2>
      <p>We may update these terms. Continuing to use the service after a change means you accept the new terms.</p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>
    </StaticPage>
  );
}
