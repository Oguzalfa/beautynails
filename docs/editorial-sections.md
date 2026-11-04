# Şazi Beauty gallery and journal

Based on the deployed mobile repair, `a536629ea341cb09899766cfe3675f2e5d24d883`.
Target: `www.sazibeauty.com`, Vercel project `prj_K3hmMUnDgMafq2J9oPIdeSEeNOXJ`.
This continues the Pembe Atölye page; the other homepage on master is separate.

## Delivered

- One shared gallery for desktop and mobile: six existing Library images,
  category filters, a native modal viewer, previous/next controls and keyboard
  navigation. The gallery is labelled as an inspiration selection.
- Three original editorial articles about nail style, lash expression and pink
  colour harmony. No treatment promises or invented customer work are added.
- Matching homepage cards, a journal index, and complete standalone articles at
  `/bakim-rehberi/`. The pages contain their text in HTML and need no client app
  or server function to render.
- Per-page canonical URLs, social metadata, BlogPosting/Breadcrumb structured
  data, sitemap and robots file.

## Sources and build

`src/content/editorial-images.json` records the exact Library IDs, original
filenames, source hashes and optimized variants. Existing source PNGs are
resized and encoded as 480/768/1200-target WebP; no image was newly generated or
recoloured. Portrait sources smaller than 1200px retain their original width.

`src/content/journal.json` owns article text and card metadata. `npm run build`
builds the homepage and runs `scripts/build-journal.mjs` to create the static
index/article pages and a hashed copy of the shared editorial stylesheet.

The hero, service panels, contacts and booking form remain as deployed. The old
desktop gallery anchor inside the lash panel now belongs to the actual gallery.

## Verification

```sh
npm run build
npm run test:editorial
npm run test:mobile
QA_ENGINE=webkit QA_WIDTHS=320,390,430 npm run test:editorial
npm run lint -- src scripts
```

Use `$env:QA_ENGINE='webkit'` etc. on PowerShell. Tests start a local static
server; `QA_URL` optionally targets a deployed site. Browser reports/screenshots
are kept outside the repository. Tests do not send WhatsApp messages.

Chromium: 320/390/430/768/1024/1440px for new content; the existing mobile suite
also covers 360 and 767px. WebKit: 320/390/430px. These are emulations, not
physical iPhone tests. The first viewport remains pixel-identical to the mobile
repair at 390 and 1440px.

The two existing lint warnings and the unused premium atlas fallback build
warning predate this change. No new warnings were introduced.
