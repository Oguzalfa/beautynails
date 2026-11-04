# Şazi Beauty mobile layout repair

This repair targets the Pembe Atölye page served by **www.sazibeauty.com**.
Its starting deployment is `dpl_4E2vHeBWQFh47U3FVXndEHLUyjr4`, commit
`e64165b867d8925dc80c436d41cfcbd1ae218621`.
The repository's newer master branch contains a different Satin homepage;
this branch deliberately starts at the deployed page instead of replacing it.

## Changes

- Blend the portrait edges into the fuchsia heading and blush callout surfaces.
  Gradient positions no longer depend on the total hero height.
- Keep callout text below the portrait and scale the manicure inset with the
  screen. Keep the booking button usable at 320px.
- Align all three trust labels on two lines; keep service icons from shrinking.
- Contain child margins inside service sections to avoid stray colour bands.
- Position the phone menu below the actual header height and limit its scroll
  area to the available viewport.
- Resolve direct section hashes to visible phone sections after font layout.
- Keep gallery keyboard focus inside its dialog and respect bottom safe areas.
- Resume visible decorative motion after reduced-motion preferences or document
  visibility change; show the first screen immediately.

All layout changes are inside the existing `max-width: 767px` rules.

## Validation

```sh
npm ci
npx playwright install chromium webkit
npm run build
npm run test:mobile
QA_ENGINE=webkit QA_WIDTHS=320,390,430,767 npm run test:mobile
npm run lint -- src scripts
```

On PowerShell, set `QA_ENGINE` and `QA_WIDTHS` using `$env:NAME = 'value'`.
The test starts its own static server. `QA_URL` can select a deployment instead;
`QA_HEIGHT`, `QA_LABEL`, `QA_OUT`, and `PLAYWRIGHT_BROWSERS_PATH` are optional.

Checks cover horizontal overflow, clipped controls, image loading, copy/image
separation, menu placement, service navigation and dialogs, booking validation,
WhatsApp draft URL composition (with `window.open` intercepted; nothing sent),
gallery controls, direct hash navigation, and motion preference changes.

Chromium layouts: 320, 360, 390, 430, 767, 768, 1024, 1440px.
WebKit layouts: 320, 390, 430, 767px. These are browser emulations, not physical
iPhone Safari tests. Before/after full-page pixels match at 768 and 1440px.

Existing build warning: unused atlas fallback path in premium component CSS.
Existing lint warnings: unused label in `scripts/acceptance.mjs` and state reset
inside an effect in `BookingPanel.tsx`. No new warnings in the repair files.
