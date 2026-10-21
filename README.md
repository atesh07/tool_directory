# ToolsTree

Free online PDF tools that run entirely in the visitor's browser: edit PDF text, merge, split, rotate, remove pages, image to PDF, PDF to image, and Word to PDF. Built with Next.js 14 (App Router), TypeScript and Tailwind CSS.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # the same step Vercel runs
npm run seo:check -- https://your-domain.com   # technical SEO check of a live site
```

## Environment variables

All are optional. Copy `.env.example` to `.env.local` for local work, or add them in Vercel under Settings > Environment Variables.

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The public address used in canonical links, the sitemap and share cards. Leave empty on Vercel: it uses the project's production domain automatically, and switches to your custom domain as soon as you add one. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | The email shown on the Contact, Privacy and Terms pages. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console verification code (the content of the `google-site-verification` tag). |
| `NEXT_PUBLIC_BING_VERIFICATION` | Bing Webmaster Tools verification code. |

Do not set `NODE_ENV` in Vercel. The build command is pinned in `vercel.json`.

## Where things live

```
src/data/tools.ts          every tool: name, text, FAQ (menus, sitemap and page tags are built from this)
src/lib/seo.ts             metadata and structured data builders
src/components/seo/        shared tool page template (ToolPage) and JsonLd
src/components/tools/      UploadZone and ErrorNotice used by every tool
src/lib/pdfFiles.ts        file checks and friendly error text
src/app/tools/<tool>/      page.tsx (server, SEO) and ToolClient.tsx (runs in the browser)
scripts/seo-check.mjs      the SEO checker behind `npm run seo:check`
```

To add a tool: add an entry to `src/data/tools.ts`, create `src/app/tools/<slug>/` with the same two files as another tool, and it gets its menu link, sitemap entry, title, description, share card and structured data automatically.

## Content

- Tool pages: all text lives in `src/data/tools.ts` (what it does, limits, troubleshooting, FAQ, links to other tools and guides). Write only what the tool really does, and keep the limits honest.
- Guides: `src/data/guides.ts`. English guides are under `/guides`, Hindi guides under `/hi`. The Hindi guides are written in Hindi, not translated; add a Hindi guide only if you can write it naturally.
- Keyword notes and the weekly Search Console routine: `docs/keyword-research.md`.

## Launch checklist for search engines

1. Deploy and open the public address (Vercel > Project > Domains shows it). It must open without a Vercel login: if it asks you to sign in, turn off Settings > Deployment Protection > Vercel Authentication for production.
2. Run `npm run seo:check -- https://your-address` and fix anything it reports.
3. Google Search Console > Add property:
   - URL prefix property with your address, choose the "HTML tag" method, copy only the code from `content="..."`, put it in `NEXT_PUBLIC_GSC_VERIFICATION` in Vercel, redeploy, then click Verify.
   - Sitemaps > add `sitemap.xml` and submit.
   - URL Inspection > paste the home page and a tool page > Request indexing. Use "Test live URL" > View tested page to see what Googlebot renders.
4. Do the same in Bing Webmaster Tools (you can import the site from Search Console).
5. After connecting a custom domain: add it in Vercel (Settings > Domains), make it the primary one, redeploy, add the new address as a property in Search Console, and run `seo:check` again. In Search Console use Change of Address only if you had already been indexed on the old address.
6. Test a share card at https://www.opengraph.xyz or by pasting the page link into a chat app.

Structured data note: Google no longer shows FAQ or HowTo rich results for most sites, and software rich results need real user ratings, so none are faked here. The markup is still valid and helps other search engines and AI assistants understand the pages.
