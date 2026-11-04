# Şazi Beauty mobile compatibility

The existing pink mobile design, desktop homepage, content and WhatsApp recipient are retained. These fixes address observed behavior:

- Restore the contact footer at 768–899px; the mobile-only footer still replaces it below 768px.
- Give the tablet menu, contact links and mobile gallery filters at least 44px touch targets.
- Keep keyboard focus in booking and service sheets, make the background inert, and restore focus to the actual opener after touch or keyboard activation. If orientation hides the opener, restore a visible header link.
- Fit mobile sheets to the visual viewport and keep the close control reachable while scrolling.
- Keep the gallery close bar visible after advancing images in landscape.
- Focus the WhatsApp fallback link when the form changes to its confirmation state. Do not interpret a `noopener` return value as proof that the browser blocked a window. Creating a draft does not send a message.
- Associate validation messages with their inputs and allow enlarged headings/card text to wrap.
- Let enlarged gallery captions increase card height, keep filter labels together, and let the wordmark wrap while retaining access to the menu. Menu height and section offsets follow the measured header height.

## Reproducible checks

`npm run build` and `npm run lint` validate the source/build. `npm run test:responsive` runs the expanded touch and layout suite against `dist` or `QA_URL`.

| Engine | Width × height (CSS pixels) |
| --- | --- |
| Chromium | 320×844, 360×844, 375×844, 390×844, 414×844, 430×844, 600×960, 767×1000, 768×1024, 820×1180, 1024×1366, 844×390, 390×600 |
| WebKit | 320×844, 390×844, 767×1000, 768×1024, 820×1180, 844×390, 390×600 |

The responsive suite checks overflow, visible images/headings/footer, menu navigation, touch target sizes, 16px input text, form validation, a stubbed WhatsApp draft, focus containment/restoration, service details, scroll restoration and the gallery close control after navigation. It uses actual Playwright tap actions. No real WhatsApp message is sent.

`npm run test:seo` also checks the homepage and nine static service/contact/article routes, including their responsive layout, real HTTP status, canonical metadata, images and hydration. The existing `test:mobile` and `test:editorial` scripts remain available.

For a representative WebKit run, set `QA_ENGINE=webkit`, `QA_CASES=320x844,390x844,767x1000,768x1024,820x1180,844x390,390x600` and `QA_LABEL=webkit`. Screenshots and JSON reports are written outside the repository to `../.sazi-mobile-complete-qa/`.

Additional exploratory checks cover a sheet resized from 390×844 to 390×360, touch/keyboard opener restoration, cleanup of inert/overflow state, and Chromium text enlarged through `text-size-adjust:200%`. That controlled text enlargement does not take effect in this WebKit test environment, so it is not counted as a WebKit text-scale measurement.

These are browser emulation tests, not physical iPhone/Android keyboard or safe-area certification. They document the tested configurations and do not establish universal compatibility with every device/browser setting.
