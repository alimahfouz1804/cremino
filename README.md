# CREMINO website

A responsive two-page website built with HTML5, CSS3 and vanilla JavaScript. No framework, build step, backend, package installation or external font service is required.

## Run

Open `dist/index.html` directly in a modern browser, or serve the `dist` directory with any static web server. The downloadable ZIP places these files directly in its `cremino` folder. Cart storage is browser-local; browsers may restrict storage on file URLs or in private browsing. If storage is blocked, the current selection still works and the site explains that it cannot persist.

## Files

```text
index.html
menu.html
css/style.css
js/main.js
js/products.js
js/cart.js
assets/{brand,ice-cream,cakes,chocolates,desserts,moments,pastries}/
```

## Content and contacts

- The logo and every photograph come from the supplied `cremino.zip`.
- Exact dominant logo color: `#A9E7E9`.
- Official Instagram supplied by the owner: https://www.instagram.com/creminolb/
- Supplied WhatsApp number: `+96103392425`. The WhatsApp URL uses international formatting `9613392425`, omitting Lebanon's local trunk zero after country code +961.
- Instagram could not be retrieved during development. No follower counts, popularity claims, unverified menu names or price claims were inferred from it.
- Menu titles are descriptive photo labels, explicitly identified on the menu. They are not an approved official menu. Every price is `null` and shown as **Price on request**. Unknown totals are **To be confirmed**, never zero.
- Catalog categories reflect the supplied photographs. Similar campaign images are retained as organized source assets; the menu uses 13 representative selections.
- Source image filenames, descriptive observations, dimensions and hashes are in `ASSET-INVENTORY.md` and `asset-inventory.json`.

## Update the menu

Edit `js/products.js`: each entry has a stable `id`, `name`, `category`, `image`, `alt`, `description` and `price`. Use a numeric price only after it is officially confirmed. `CREMINO_CONFIG.currency` controls currency formatting (USD is configured for future prices, but no dollar prices currently appear). Update the menu notice when official product names are approved. Keep IDs stable to preserve existing selections.

WhatsApp ordering prepares a message with product names, quantities, known prices, and a calculable total or a quote request. It opens WhatsApp; the customer reviews and sends the message. It does not place an order automatically. Availability and final charges are confirmed by CREMINO.

## Behavior and accessibility

The site supports responsive navigation, five category filters, URL-linked categories, quantity changes, removals, localStorage persistence, storage validation, cross-tab cart synchronization, a keyboard-accessible modal drawer, focus restoration, live announcements, reduced-motion preferences, scroll reveals and restrained floating photography.

All 22 source images were inspected and organized. Optimized WebP assets total approximately 2.55 MB, including full and small variants. Below-fold images load lazily.

## Verification

Browser checks cover mobile navigation, every category filter, add/increase/decrease/remove, reload persistence, the generated WhatsApp URL, empty cart, layout width and loaded images. Static checks cover local links, image paths and JavaScript syntax. Isolated logic checks cover exact-cent arithmetic for future verified prices, mixed known/unknown prices, invalid stored rows and quantity caps. No WhatsApp message was sent.

Physical iPhone/Android devices were not used; responsive behavior was checked in a Chromium browser at representative phone, tablet and desktop widths.
