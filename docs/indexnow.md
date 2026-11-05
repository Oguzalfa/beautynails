# Şazi Beauty: IndexNow

This is an additional discovery channel for Bing and other participating IndexNow engines. It does not submit Google URL Inspection requests or change Google's quota. Google can continue discovering the already submitted sitemap independently of manual URL-request quota.

## Ownership file

Set a randomly generated `INDEXNOW_KEY` (8–128 letters/digits/hyphens) as a Production Secret in this Vercel project. The build writes `dist/{key}.txt` with only the UTF-8 key. Keep the actual value out of source control, frontend bundles, sitemap, robots and documentation. The root verification URL must be publicly fetchable for search engines, without redirect or authentication.

For local operations, supply `INDEXNOW_KEY` or a gitignored `.env.indexnow.local` containing only `INDEXNOW_KEY=...`. To build the local ownership file: `node --env-file=.env.indexnow.local scripts/build-indexnow.mjs` after `npm run build`.

## Notify after publishing

- `npm run indexnow`: dry run only; no network requests or submission.
- `npm run indexnow -- --submit`: validates the live ownership file, live sitemap, HTTP200 canonical pages and indexability before making **one** batch POST to `https://api.indexnow.org/indexnow`.
- Only `https://www.sazibeauty.com` sitemap URLs are allowed. Preview hosts, queries, fragments, credentials and duplicates are rejected.
- `npm run test:indexnow`: negative preflight cases, dry-run behavior, batch payload and status handling.

The submission is deliberately separate from the build; preview deployments and routine builds send nothing. Notify only for meaningful additions/updates/removals, not repeatedly for unchanged content. No automatic retry runs. Participating engines share notifications, so do not send the same batch to every engine separately.

The script records a receipt without the key at `../.sazi-indexnow-qa/receipt.json`. HTTP200 means the notification was received. HTTP202 means it was received while key validation remains pending. Neither means a URL is indexed or ranked. HTTP403/422 is a failure; HTTP429 requires waiting for Retry-After. Inspect actual indexing in Bing Webmaster Tools when account access is available.

## Account-side next step

At https://www.bing.com/webmasters/ add this exact canonical site (or import the verified Google Search Console property), complete Microsoft's actual ownership challenge if required, and submit https://www.sazibeauty.com/sitemap.xml . IndexNow itself does not require opening a Bing Webmaster account. No account-side verification, sitemap submission, Google Business Profile change or Google indexing request is implied by this repository change.

References: [IndexNow protocol](https://www.indexnow.org/documentation), [FAQ](https://www.indexnow.org/faq), [Bing setup](https://www.bing.com/indexnow/getstarted), [Google recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
