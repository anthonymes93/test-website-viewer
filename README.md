# Website Viewer

A minimal, fullscreen website carousel. No database, server, build tools, accounts, or dependencies.

## Add your websites

Edit [sites.json](./sites.json) on GitHub. Replace the sample entry with your websites:

```json
[
  { "name": "Client One", "url": "https://client-one.com" },
  { "name": "Client Two", "url": "https://client-two.com" }
]
```

Add **1 to 10** entries. Each entry needs a name and a complete URL. Changes are picked up on the next page reload after deployment.

## Hosting

Deploy as a **static site** on Cloudflare Pages or any other static hosting service.

For Cloudflare Pages: connect this GitHub repository, select **no framework**, leave the build command blank, and set the output directory to `/` (the repository root). No environment variables are required.

## Controls

- Previous / next arrows at the bottom-right
- Keyboard left/right arrows (when the parent page has focus)
- Current website title and number
- Open-in-new-tab button
- Wraps from the last website to the first
- Direct link to a specific item using `?site=3`

## Important iframe limitation

Some third-party websites refuse to load inside another site's iframe due to the site's `X-Frame-Options` or Content Security Policy `frame-ancestors` settings. This is enforced by the browser, and **cannot be fixed by this static viewer**.

If a website appears blank or displays an embedding error, use the external-link button to open it in a new tab. For websites you control, embedding can be enabled by configuring their response headers appropriately.

## Configuration

This project uses `sites.json` as a read-only configuration file, **not** a writable backend or dashboard. To change the links, edit and commit that file on GitHub. Never place secrets inside the JSON.
