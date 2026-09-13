# Mixamo Batcher — 2026 Community Fork

This fork updates the original Mixamo Batcher for current Chromium extension rules and the current Mixamo single-page application.

## Build

```bash
pnpm install --ignore-scripts
pnpm build
```

The distributable is written to `dist/mixamo-batcher-2.0.0.zip`.

## Install locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select the `dist` directory.
4. Sign in to Mixamo, open the **Animations** or **Characters** application view, and reload the page.

The extension stores projects locally in the browser. Use its export function before clearing extension data or removing the extension.

## 2026 compatibility changes

- Migrated from Manifest V2 background scripts to a Manifest V3 service worker.
- Replaced the obsolete global extension CSP and unrestricted web-accessible resources with MV3-compatible declarations.
- Removed the deprecated external Google Analytics script from the extension UI.
- Hardened injection for current document timing and CSP behavior.
- Added guarded interception for both `XMLHttpRequest` and `fetch`, since current Mixamo uses both paths across application flows.
- Preserved the original request signatures and added response/status guards to avoid breaking unrelated Mixamo traffic.
- Made the panel mount resilient to current SPA navigation and changed the iframe sizing from a brittle `.sidebar-list` dependency to a fixed, bounded panel.
- Added a headless Chromium smoke test at `smoke-test.sh`.

## Limitations

Mixamo requires an authenticated account for character/animation operations. The extension continues to depend on private Mixamo API response shapes, so a future Mixamo API redesign may require another compatibility update. Downloads remain subject to Mixamo's own authentication, rate limits, and maximum archive size.
