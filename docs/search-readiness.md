# Şazi Beauty search readiness

Production canonical origin: https://www.sazibeauty.com

## Site implementation

- The homepage is rendered to HTML at build time and hydrated with the same React tree. Visitors and crawlers receive the same content. Existing desktop and mobile designs, appointment interactions and gallery filters are retained.
- Four service guides have permanent URLs under `/hizmetler/`. The homepage and service dialogs link to them. Contact information is available at `/iletisim/`.
- The homepage, four services, contact page, journal index and three articles have unique titles and descriptions, self-referencing canonical URLs, social metadata and consistent structured data. The sitemap contains these 10 URLs.
- Organization, WebSite, WebPage, Service, BreadcrumbList and BlogPosting data refer to the same business identity. Only the existing phone and Instagram account are included. No address, coordinates, opening hours, ratings, prices or certifications have been invented.
- Unknown URLs return a real 404. The branded 404 page is marked noindex. Public pages remain crawlable in robots.txt.
- The build supports an actual Google verification token through `GOOGLE_SITE_VERIFICATION` or `src/config/seo.json` → `googleSiteVerification`. Leave this blank until Google provides the token. Never commit a placeholder verification value.

## Complete Search Console verification

Recommended: create a **Domain property** for `sazibeauty.com` at https://search.google.com/search-console . Copy Google's exact `google-site-verification=...` TXT value into a new Squarespace DNS TXT record with host `@`. Preserve the website A/CNAME records and all mail records. Return to Google and select Verify. The existing domain connection alone does not verify Search Console ownership.

Alternative: create a **URL-prefix property** for `https://www.sazibeauty.com/`. Choose HTML tag verification and use only the `content` token from Google's tag as the build variable or config value above. Rebuild and publish, then select Verify. Keep the token present after verification.

After verified ownership:

1. Submit `https://www.sazibeauty.com/sitemap.xml` in Sitemaps.
2. Inspect the homepage and important service URLs. Run the live URL test, then request indexing if available.
3. Review Pages, Core Web Vitals and Performance reports as Google collects data. Sitemap submission and successful live tests do not guarantee indexing or position.

This repository does **not** claim that verification, sitemap submission, indexing or Google account changes have already happened. A salon website is not eligible to use the restricted Google Indexing API for ordinary pages.

## Local discovery and AI search

Obtain the confirmed business address, service area, public hours and Google Business Profile URL from the owner before adding LocalBusiness/BeautySalon location fields. Keep those details identical across the site and business profile. Do not infer a district from an unverified directory.

Search-readable HTML, original service and editorial content, descriptive headings, crawlable links and consistent entity data support both ordinary and AI-assisted discovery. There is no special GEO score, `llms.txt` requirement, structured-data type or technical change that guarantees an AI citation or a high ranking. Publish genuinely useful, verified content and monitor actual results.

## Verification

- `npm run build`: TypeScript, client build, server-render bundle and static SEO output.
- `npm run lint`: repository lint; record any pre-existing warnings separately.
- `npm run test:seo`: raw HTML, 10 canonical routes, sitemap/robots/404, structured entities, JavaScript-disabled content, hydration, booking, service modal, gallery filters, image loading and responsive overflow.
- `npm run test:mobile` and `npm run test:editorial`: existing interaction and reading-page regressions.

SEO QA supports `QA_URL`, `QA_WIDTHS`, `QA_ENGINE` and `QA_LABEL`. Local reports and screenshots are written outside the repository to `../.sazi-seo-qa/`. Preview deployments must retain production canonical URLs.

References: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [AI features](https://developers.google.com/search/docs/appearance/ai-features), [ownership verification](https://support.google.com/webmasters/answer/9008080), [sitemaps](https://support.google.com/webmasters/answer/7451001).
