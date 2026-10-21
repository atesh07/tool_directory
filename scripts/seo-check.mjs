#!/usr/bin/env node
// Technical SEO check for a running site. No packages needed (Node 18+).
//   npm run seo:check -- https://your-domain.com
// Run it after every deploy and after you connect a custom domain.

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const GOOGLEBOT = "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

let problems = 0;
const bad = (m) => {
  problems++;
  console.log(`  PROBLEM: ${m}`);
};
const get = (url) => fetch(url, { redirect: "manual", headers: { "user-agent": GOOGLEBOT } });
const meta = (html, attr, name) => {
  const m = html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, "i")) || html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`, "i"));
  return m ? m[1].replace(/&amp;/g, "&").replace(/&#x27;/g, "'") : "";
};
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

const root = await get(base + "/");
if (root.status >= 300 && root.status < 400) {
  console.log(`The site redirects to ${root.headers.get("location")}. Run the check against that address.`);
  process.exit(1);
}
if (root.status !== 200) {
  console.log(`${base}/ answered ${root.status}. If this is a Vercel address, check Settings > Deployment Protection.`);
  process.exit(1);
}
const rootHtml = await root.text();
const canonicalRoot = (rootHtml.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || "";
const site = canonicalRoot ? new URL(canonicalRoot).origin : base;
console.log(`Checking ${base}\nSite URL used in tags: ${site}`);
if (site !== base) bad(`tags point to ${site} but you are checking ${base}. Set NEXT_PUBLIC_SITE_URL to the real address (or add the custom domain in Vercel).`);
if (/localhost|example\.(com|test)/.test(site)) bad("tags use a placeholder address");

console.log("\nrobots.txt");
const robots = await (await get(base + "/robots.txt")).text();
const disallows = [...robots.matchAll(/^Disallow:\s*(.*)$/gim)].map((m) => m[1].trim()).filter(Boolean);
console.log(disallows.length ? `  blocked paths: ${disallows.join(", ")}` : "  nothing is blocked");
if (!new RegExp(`Sitemap:\\s*${site.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap.xml`, "i").test(robots)) bad("robots.txt has no Sitemap line for the site URL");

console.log("\nsitemap.xml");
const sm = await get(base + "/sitemap.xml");
const smText = await sm.text();
if (sm.status !== 200) bad(`sitemap answered ${sm.status}`);
const urls = [...smText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`  ${urls.length} URLs`);
if (!urls.length) bad("sitemap is empty");

const titles = new Map();
const descriptions = new Map();
for (const u of urls) {
  const path = u.startsWith(site) ? u.slice(site.length) || "/" : null;
  console.log(`\n${path ?? u}`);
  if (path === null) {
    bad(`sitemap URL is not on ${site}`);
    continue;
  }
  const res = await get(base + path);
  const html = await res.text();
  if (res.status !== 200) bad(`status ${res.status}`);
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
  const desc = meta(html, "name", "description");
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || "";
  console.log(`  ${title} (${title.length})`);
  if (!title) bad("no title");
  else {
    if (title.length > 65) bad(`title is ${title.length} characters; Google shows about 60`);
    if (titles.has(title)) bad(`same title as ${titles.get(title)}`);
    titles.set(title, path);
  }
  if (!desc) bad("no meta description");
  else {
    if (desc.length > 165 || desc.length < 70) bad(`description is ${desc.length} characters (aim for 70 to 160)`);
    if (descriptions.has(desc)) bad(`same description as ${descriptions.get(desc)}`);
    descriptions.set(desc, path);
  }
  if (canonical !== site + (path === "/" ? "" : path)) bad(`canonical is "${canonical}"`);
  if (/<meta[^>]*name="robots"[^>]*noindex/i.test(html)) bad("page has noindex");
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${h1s} h1 headings (should be exactly 1)`);
  for (const k of ["title", "description", "url", "image"]) if (!meta(html, "property", `og:${k}`)) bad(`og:${k} missing`);
  if (meta(html, "name", "twitter:card") !== "summary_large_image") bad("twitter:card missing");
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let types = [];
  for (const [, body] of ld) {
    try {
      const data = JSON.parse(body);
      for (const x of Array.isArray(data) ? data : [data]) {
        types.push(x["@type"]);
        if (x["@context"] !== "https://schema.org") bad(`${x["@type"]}: wrong @context`);
        if (x["@type"] === "FAQPage" && !x.mainEntity?.length) bad("FAQPage has no questions");
      }
    } catch (e) {
      bad(`structured data does not parse: ${e.message}`);
    }
  }
  console.log(`  structured data: ${types.join(", ") || "none"}`);
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " ").replace(/\s+/g, " ");
  if (text.split(" ").length < 120 && !/privacy|terms|contact/.test(path)) bad("very little text without running JavaScript");
}

console.log("\n404 and redirects");
const missing = await get(base + "/this-page-does-not-exist");
console.log(`  missing page -> ${missing.status}`);
if (missing.status !== 404) bad("a missing page must answer 404 (a 200 here is a soft 404)");
const slash = await get(base + "/tools/");
console.log(`  /tools/ -> ${slash.status} ${slash.headers.get("location") || ""}`);

console.log("\nshare image");
const og = await get(base + "/og?title=Test");
const buf = Buffer.from(await og.arrayBuffer());
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
console.log(`  /og -> ${og.status} ${og.headers.get("content-type")} ${w}x${h}`);
if (og.status !== 200 || w !== 1200 || h !== 630) bad("share image should be a 1200x630 PNG");

console.log(problems ? `\n${problems} problem${problems === 1 ? "" : "s"} found` : "\nAll checks passed");
process.exit(problems ? 1 : 0);
