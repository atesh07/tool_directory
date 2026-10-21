import StaticPage from "@/components/layout/StaticPage";
import { SITE } from "@/data/tools";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How ToolsTree handles your files and data. Files are processed in your browser and are not uploaded to our servers.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" updated="October 21, 2026">
      <p>
        This policy explains what {SITE.name} (&quot;we&quot;, &quot;us&quot;) does and does not do with information when you use{" "}
        {SITE.url.replace(/^https?:\/\//, "")}.
      </p>
      <h2>Your files</h2>
      <p>
        Our PDF and image tools run in your web browser. The files you open are processed on your own device. They are not
        uploaded to, stored on, or viewed by our servers. When you close the page, the working copy in your browser is gone.
      </p>
      <h2>Resources loaded from other services</h2>
      <ul>
        <li>
          The Edit PDF tool downloads open-source font files from the jsDelivr content delivery network so that new text
          can match your document&apos;s font. Only the font name and style are requested; no part of your document is sent.
        </li>
        <li>Page fonts and scripts may be loaded from content delivery networks. Those services receive your IP address like any website you visit.</li>
      </ul>
      <h2>Information we collect</h2>
      <p>
        We may collect basic, anonymous usage information such as pages visited, browser type, device type and approximate
        location, using analytics tools, to understand how the site is used and to improve it. This does not include the
        contents of your files.
      </p>
      <h2>Cookies and advertising</h2>
      <p>
        We and our partners may use cookies or similar technologies for analytics and, if we show advertising, to serve
        and measure ads. Third-party vendors, including Google, may use cookies to serve ads based on your visits to this
        and other websites. You can opt out of personalised advertising in Google&apos;s Ads Settings, and you can control
        cookies in your browser settings.
      </p>
      <h2>Children</h2>
      <p>The service is not directed to children under 13 and we do not knowingly collect their personal information.</p>
      <h2>Changes</h2>
      <p>We may update this policy. The date above shows when it was last changed.</p>
      <h2>Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </StaticPage>
  );
}
