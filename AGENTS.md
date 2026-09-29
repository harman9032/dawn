# Shopify theme workspace

## Project memory

- Working folder: `C:/MAMP/htdocs/dawn`.
- Shopify Dawn theme; `config/settings_schema.json` declares version `16.0.0` as inspected on 2026-09-29 (the repository was upgraded from the earlier 9.0.0 local baseline). The `9.0.0-release-branch` branch keeps the old theme and shares no git history with `main`.
- The user wants ongoing theme edits using official Shopify skills and current Shopify documentation. Read this file at the start of future work and update the map when structure changes.
- This is a Shopify Liquid theme, not a PHP application despite its MAMP location. Storefront rendering requires Shopify.
- Preserve existing customizations. The mandala art theme layer (see below) is the main customization in this tree; `snippets/shoplift.liquid` existed only in the old 9.0.0 local checkout and is not present here. Inspect files before editing; do not replace the theme wholesale as part of routine changes.

## Official skills

Shopify's plugin is already installed in this environment. Use its available skills rather than installing duplicate copies or treating this file as an official skill.

- `shopify:shopify-liquid`: Liquid, sections, snippets, templates, theme settings, CSS and JavaScript work.
- `shopify:shopify-use-shopify-cli`: running theme development, checks, previews, or deployment commands.
- `shopify:shopify-custom-data`: read first for metafields or metaobjects.
- `shopify:shopify-dev`: Shopify documentation questions with no more specific skill.

At setup, the skill root was `C:/Users/Harman/.codex/plugins/cache/openai-curated-remote/shopify/4.0.1/skills`. Resolve the current location from the session's skill catalog because plugin versions and cache paths can change. Read the relevant `SKILL.md` before using it, including its documentation-search and validation requirements.

## Folder and file map

| Task | Start here |
| --- | --- |
| Global HTML, head, asset loading | `layout/theme.liquid` |
| Password layout | `layout/password.liquid` |
| Global styles and shared behavior | `assets/base.css`, `assets/global.js`, `assets/constants.js`, `assets/pubsub.js` |
| Header and navigation | `sections/header.liquid`, `sections/header-group.json`, `sections/announcement-bar.liquid` |
| Footer | `sections/footer.liquid`, `sections/footer-group.json`, `assets/section-footer.css` |
| Homepage composition | `templates/index.json`; follow its section types to `sections/<type>.liquid` |
| Product page | `templates/product.json`, `sections/main-product.liquid`, `assets/section-main-product.css`, `assets/product-info.js`, `assets/product-form.js` |
| Product options, media and buying | `snippets/product-variant-picker.liquid`, `snippets/product-variant-options.liquid`, `snippets/product-media-gallery.liquid`, `snippets/buy-buttons.liquid`, `snippets/price.liquid` |
| Product cards and quick add | `snippets/card-product.liquid`, `assets/component-card.css`, `assets/quick-add.js`, `assets/quick-add.css` |
| Collections and filters | `templates/collection.json`, `sections/main-collection-banner.liquid`, `sections/main-collection-product-grid.liquid`, `snippets/facets.liquid`, `assets/facets.js` |
| Cart page | `templates/cart.json`, `sections/main-cart-items.liquid`, `sections/main-cart-footer.liquid`, `assets/cart.js` |
| Cart drawer and notification | `sections/cart-drawer.liquid`, `snippets/cart-drawer.liquid`, `snippets/cart-notification.liquid`, `assets/cart-drawer.js`, `assets/cart-notification.js` |
| Search | `templates/search.json`, `sections/main-search.liquid`, `sections/predictive-search.liquid`, `assets/main-search.js`, `assets/predictive-search.js` |
| Standard pages and contact | `templates/page.json`, `templates/page.contact.json`, `sections/main-page.liquid`, `sections/contact-form.liquid` |
| Blogs and articles | `templates/blog.json`, `templates/article.json`, `sections/main-blog.liquid`, `sections/main-article.liquid` |
| Customer accounts | Handled by Shopify customer accounts; there is no `templates/customers/` directory in this tree |
| Global setting definitions | `config/settings_schema.json` |
| Saved merchant settings | `config/settings_data.json`; preserve merchant values |
| Storefront translations | `locales/en.default.json` and other language JSON files |
| Theme editor translations | `locales/en.default.schema.json` and other schema locale files |
| Theme validation configuration | `.theme-check.yml` |
| Contribution conventions | `.github/CONTRIBUTING.md` |

There is currently no root `blocks/` directory. Existing sections define their own blocks. Check compatibility before introducing reusable theme blocks.

## Mandala art theme layer

The store is a mandala art brand. The redesign plan and status live in `docs/MANDALA_THEME_PLAN.md`.

| Piece | Files |
| --- | --- |
| Brand overrides (colors, type, cards, header, product page helpers) | `assets/mandala-theme.css` (loaded after `base.css` in `layout/theme.liquid`), `assets/mandala-watermark.svg`, `--color-gold` in `layout/theme.liquid` |
| New sections | `sections/trust-bar.liquid`, `sections/testimonials.liquid`, `sections/instagram-gallery.liquid` with matching `assets/section-*.css` |
| Ornament divider | `snippets/ornament-divider.liquid`, `assets/component-ornament.css` |
| Sticky add-to-cart bar | `snippets/sticky-atc.liquid`, `assets/sticky-atc.js`, `assets/sticky-atc.css`, rendered at the end of `sections/main-product.liquid` |
| Extended stock sections | `image-banner` (eyebrow block, ornament, gradient overlay, watermark), `image-with-text` (gold frame, signature caption), `collection-list` (circle ratio), `multicolumn` (icon select), `newsletter` (privacy line, watermark) |
| Product card and price extras | `snippets/card-product.liquid` (Original / Limited tag badges), `snippets/price.liquid` (savings percentage) |
| Home, product and collection composition | `templates/index.json`, `templates/product.json`, `templates/collection.json`, `sections/header-group.json`, `sections/footer-group.json` |

## Current documentation workflow

Official references checked on 2026-09-29:

- Architecture: https://shopify.dev/docs/storefronts/themes/architecture
- Sections: https://shopify.dev/docs/storefronts/themes/architecture/sections
- Liquid reference: https://shopify.dev/docs/api/liquid
- Theme Check: https://shopify.dev/docs/storefronts/themes/tools/theme-check
- Theme CLI commands: https://shopify.dev/docs/api/shopify-cli/theme

Search the current official documentation for the actual feature before implementing it. These links are starting points, not a frozen documentation copy or a guarantee of future currency. Distinguish current Shopify capabilities from features already implemented by this local Dawn version. A Dawn upgrade is separate work requiring a review of customizations and upstream differences.

## Editing and validation

- Trace template section types, snippet render calls, asset references, settings, and translations before changing a feature.
- Keep changes focused; preserve section/block IDs, saved settings and existing integration hooks unless the task requires changing them.
- Follow the applicable Shopify skill, semantic HTML, accessible controls, responsive styling, and progressive enhancement.
- Check the working tree before editing and review the diff afterwards. Use `rg` to verify references when renaming or adding files.
- For theme code changes, run the skill validator and/or Shopify Theme Check as instructed by the applicable skill, then preview relevant storefront and theme-editor behavior when access is available. Report actual results and blockers; do not claim validation passed without evidence.
- Documentation-only changes need file/link review rather than storefront tests.

## Tooling observations at setup

- Node.js is available (observed v22.16.0); `shopify` was not found on PATH.
- The official Liquid skill's documentation search succeeded. Its validator could not start because `@shopify/theme-check-common` was missing from the plugin's dependency resolution. No theme validation passed during setup. Resolve tooling before validating future code changes.
- The sandbox blocked Node access to the installed skill path; the successful documentation search required an approved execution outside the sandbox.
- Git reported an ownership mismatch. Read-only inspection succeeded with `git -c safe.directory=C:/MAMP/htdocs/dawn status --short`; no global Git configuration was changed.
