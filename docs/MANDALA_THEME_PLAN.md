# Mandala Art Store — Dawn Theme Redesign Plan

Base: Dawn 16.0.0 (this repo). Goal: a warm, artisanal look for a mandala art
brand, a home page ordered for sales conversion, and a product page that
removes friction and builds trust before the buy button.

This is the plan only. Implementation happens in the phases at the end.

---

## 1. Brand direction

Mandala art sells on **calm, craft and meaning**. The theme should feel
hand-made and premium, not "template". Rules:

- Warm off-white canvas, deep indigo text, one hot accent (terracotta/saffron),
  one cool accent (peacock teal), gold only for ornaments and hover states.
- Ornament, not clutter: thin gold rules, a small mandala motif as a section
  divider, subtle radial-gradient backgrounds. No busy patterns behind text.
- Photography does the heavy lifting: large product images on ivory, lifestyle
  shots of art on walls, close-ups of pen/brush detail.

## 2. Color system (maps to `config/settings_data.json` → `color_schemes`)

| Token           | Hex       | Use |
|-----------------|-----------|-----|
| Ivory           | `#FAF6EF` | Page background (scheme-1) |
| Sand            | `#F1E8DA` | Cards, alternating sections (scheme-2) |
| Indigo          | `#2B2340` | Body text, dark sections (scheme-3 bg) |
| Terracotta      | `#C9772F` | Primary buttons, sale badge (scheme-4 bg) |
| Peacock         | `#1F6F78` | Secondary accent, sold-out badge (scheme-5 bg) |
| Gold            | `#C8A24A` | Ornaments, dividers, hover, star ratings |
| Plum (shadow)   | `#1C1630` | Shadows |

Scheme mapping (5 schemes exist in Dawn, keep count unchanged):

| Scheme   | background | text      | button    | button_label | secondary_button_label | shadow    | Where it is used |
|----------|-----------|-----------|-----------|--------------|------------------------|-----------|------------------|
| scheme-1 | `#FAF6EF` | `#2B2340` | `#C9772F` | `#FAF6EF`    | `#2B2340`              | `#1C1630` | Default page, header, product page |
| scheme-2 | `#F1E8DA` | `#2B2340` | `#2B2340` | `#FAF6EF`    | `#2B2340`              | `#1C1630` | Product cards, trust bar, FAQ, newsletter |
| scheme-3 | `#2B2340` | `#FAF6EF` | `#C8A24A` | `#2B2340`    | `#FAF6EF`              | `#1C1630` | Hero overlay text box, footer, story section |
| scheme-4 | `#C9772F` | `#FAF6EF` | `#FAF6EF` | `#C9772F`    | `#FAF6EF`              | `#1C1630` | Sale badge, announcement bar, promo strip |
| scheme-5 | `#1F6F78` | `#FFFFFF` | `#FFFFFF` | `#1F6F78`    | `#FFFFFF`              | `#1C1630` | Sold-out badge, testimonials band |

Gradient (optional) for scheme-1 hero/story backgrounds:
`radial-gradient(circle at 50% 0%, #FFFDF8 0%, #FAF6EF 60%)`.

Global CSS variables to add in `assets/base.css` (not exposed in settings):
`--color-gold: 200,162,74;` used by the ornament snippet, star ratings and
card hover borders.

## 3. Typography (Shopify font library handles)

| Role     | Font                      | Handle (settings_data)      | Notes |
|----------|---------------------------|-----------------------------|-------|
| Headings | Cormorant Garamond        | `cormorant_garamond_n6`     | Elegant serif, semibold. `heading_scale: 115`. |
| Body     | Jost                      | `jost_n4`                   | Geometric sans, very legible. `body_scale: 100`. |
| Fallback | Playfair Display / Nunito Sans | `playfair_display_n6` / `nunito_sans_n4` | If the store owner prefers heavier headings. |

Type details (in `assets/base.css`):
- Headings letter-spacing `0.02em`, h1 uppercase off, h0 hero at 5.2rem desktop / 3.4rem mobile.
- Section headings get a centered gold ornament underneath (new snippet
  `snippets/ornament-divider.liquid`, an inline SVG mandala dot-and-rule).
- Buttons: uppercase, `letter-spacing: 0.1em`, 1.3rem.
- Prices: body font, weight 500, sale price in terracotta.

## 4. Global shape settings (`config/settings_data.json`)

| Setting | Value | Why |
|---------|-------|-----|
| `buttons_radius` | 4 | Softer than Dawn's 0, still premium |
| `buttons_border_thickness` | 1 | |
| `card_style` | `card` | Card with background so art pops on sand |
| `card_color_scheme` | scheme-2 | |
| `card_corner_radius` | 8 | |
| `card_image_padding` | 8 | Breathing room like a mat board |
| `card_border_thickness` | 1, opacity 12 | Gold-ish hairline via CSS override |
| `card_text_alignment` | center | Art store convention |
| `media_radius` | 8 | Product gallery + banner images |
| `media_border_thickness` | 0 | |
| `inputs_radius` | 4 | |
| `variant_pills_radius` | 40 | Keep pill shape |
| `badge_corner_radius` | 4 | Rectangular tags look more "gallery label" |
| `sale_badge_color_scheme` | scheme-4 | Terracotta |
| `sold_out_badge_color_scheme` | scheme-5 | Peacock |
| `animations_hover_elements` | `vertical-lift` | Card lift on hover |
| `animations_reveal_on_scroll` | true | |
| `cart_type` | `drawer` | Keeps shopper on page, raises AOV |
| `show_cart_note` | true | Gift messages |
| `cart_drawer_collection` | bestsellers | Upsell inside cart drawer |
| `predictive_search_show_price` | true | |
| `page_width` | 1400 | Large art images |
| `spacing_sections` | 24 | |
| `logo_width` | 140 | |

## 5. Home page — new section order (`templates/index.json`)

Ordered by the funnel: hook → trust → product → category → story → proof →
objections → capture. Every screen above the fold has one clear CTA.

| # | Section (type) | Purpose / conversion reason | Key settings |
|---|----------------|-----------------------------|--------------|
| 0 | `announcement-bar` (header group) | Offer in the first 2 seconds: "Free shipping over $X · Ships in 2–3 days" rotating with "Made by hand in [city]". | scheme-4, `auto_rotate: true`, 2–3 announcement blocks |
| 0 | `header` (header group) | Centered logo, sticky on scroll up, cart drawer icon with count. | `logo_position: top-center`, `menu_type_desktop: mega`, scheme-1 |
| 1 | `image-banner` → **hero** | One striking mandala on a wall, H0 headline, subline, single primary button "Shop bestsellers". | height large, overlay 20, text box on scheme-3 at 85% opacity, `desktop_content_position: middle-left` |
| 2 | **`trust-bar`** (new section, built from `multicolumn`) | 4 icons: Hand-drawn originals · Free shipping · Secure checkout · 30-day returns. Answers "can I trust this shop" before the shopper sees a price. | scheme-2, 4 cols, icon size small, no padding |
| 3 | `featured-collection` → **Bestsellers** | The money section. 8 products, ratings, quick add, secondary image hover. | `collection: bestsellers`, `products_to_show: 8`, `columns_desktop: 4`, `show_rating: true`, `quick_add: standard`, `image_ratio: square`, `show_view_all: true` |
| 4 | `collection-list` → **Shop by category** | Wall art · Prints · Canvas · Digital downloads · Custom commissions · Stickers/cards. Lets browsers self-select. | 3 cols desktop, `image_ratio: square` with rounded/circular image CSS, scheme-1 |
| 5 | `image-with-text` → **Meet the artist** | Story sells art. Portrait + 3-line story + "Read my story" secondary button. | image first, `height: medium`, scheme-1 with gradient, caption block "Hand-drawn since 20XX" |
| 6 | `video` → **How each piece is made** | 30–60s time-lapse. Proof of "handmade", raises perceived value. | full width, poster image, scheme-3 background |
| 7 | **`testimonials`** (new section) | 3 reviews with stars, name, product bought, optional photo. Placed right after craft proof and before the second product push. | scheme-5 band, slider on mobile |
| 8 | `featured-product` → **Signature / limited piece** | Single high-ticket original or "Commission your own mandala" with buy button in-line. Second conversion point for high intent. | scheme-2, media left, `show_dynamic_checkout: true` |
| 9 | `featured-collection` → **New arrivals** | Second grid for returning visitors. | 4 products, 1 row, slider on desktop |
| 10 | **`instagram-gallery`** (new section, 6 images + handle link) | Social proof and UGC of art in homes. | 6 cols desktop / 3 mobile, square |
| 11 | `collapsible-content` → **FAQ** | Kill last objections: sizes, framing, shipping time, damage policy, custom orders, digital download delivery. | scheme-2, 6 rows, `open_first_collapsible_row: true` |
| 12 | `newsletter` | "Get 10% off your first piece" + Instagram follow. | scheme-3, full width |
| — | `footer` (footer group) | Payment icons, policies, contact, social. | scheme-3 |

Removed from current template: nothing structurally, but the current
`featured_collection` on `all` becomes the Bestsellers collection.

Mobile order is the same. Sections 6 and 10 are the first candidates to drop if
page speed suffers.

## 6. Section redesign details (files to touch)

| Section file | Change |
|--------------|--------|
| `sections/image-banner.liquid` + `assets/section-image-banner.css` | Add `subheading` block, ornament divider under heading, optional mandala SVG watermark (top-right, 8% opacity), gradient overlay option instead of flat opacity. |
| `sections/announcement-bar.liquid` | Add small icon per announcement, tighten height, gold hairline bottom border. |
| `sections/header.liquid` + `assets/component-*header*.css` | Centered logo layout polish, uppercase nav with gold underline on hover, cart bubble in terracotta. |
| `sections/featured-collection.liquid` + `snippets/card-product.liquid` + `assets/component-card.css` | Card on sand, 8px mat padding, gold hairline border on hover, star rating row, "Original" / "Limited" badge support via product tag, quick-add button full width on mobile. |
| `sections/collection-list.liquid` + `snippets/card-collection.liquid` | Circular image option (mandala shape), centered title, product count. |
| `sections/image-with-text.liquid` | Add decorative frame option around image (thin double gold line), caption style "signature". |
| `sections/multicolumn.liquid` | Add `icon` select (shipping, handmade, lock, return, star) so it can power the trust bar without custom images. |
| `sections/newsletter.liquid` | Add incentive text + privacy line, scheme-3 full-bleed with mandala watermark. |
| `sections/collapsible-content.liquid` | Gold plus/minus icon, thinner rows. |
| `sections/footer.liquid` | Payment icons row, "Handmade in …" line, social icons in gold. |
| `sections/rich-text.liquid` | Use ornament divider between heading and text. |
| **New** `sections/trust-bar.liquid` | Thin 4-icon strip, reusable under hero and on product page. |
| **New** `sections/testimonials.liquid` | Blocks: quote, author, product, stars, photo. Slider on mobile using Dawn's `slider-component`. |
| **New** `sections/instagram-gallery.liquid` | 6 image blocks + handle URL, hover overlay. |
| **New** `snippets/ornament-divider.liquid` | Inline SVG, color via `--color-gold`. |
| **New** `snippets/icon-*.liquid` | handmade, shipping, lock, returns, leaf (for multicolumn/trust bar icon select). |
| `assets/base.css` | Fonts, heading scale, gold variable, button letter-spacing, card hover, radial gradient utility. |
| `locales/en.default.schema.json` | Labels for new sections/settings. |

## 7. Product page — redesign (`templates/product.json`, `sections/main-product.liquid`)

Layout settings:

| Setting | Value | Why |
|---------|-------|-----|
| `gallery_layout` | `thumbnail_slider` | Big single image + thumbs; art buyers zoom detail |
| `media_size` | `large` | |
| `media_fit` | `contain` on ivory | Shows full artwork, no crop |
| `image_zoom` | `hover` (desktop) / lightbox | |
| `mobile_thumbnails` | `show` | |
| `enable_sticky_info` | true | |
| `hide_variants` | true | |
| `constrain_to_viewport` | true | |

Block order in `main-product` (top to bottom):

1. `text` — collection/category eyebrow (uppercase, small, gold), replaces vendor.
2. `title`
3. `rating` — stars right under the title (needs a reviews app writing `reviews.rating` metafields).
4. `price` — show compare-at + "Save X%" via price snippet tweak; sale in terracotta.
5. `text` — 3 short benefit bullets (rich text): "Hand-drawn original · Museum-grade paper · Ships in 2–3 days".
6. `variant_picker` — `picker_type: button`, size pills; add a "Size guide" `popup` block right below it (page: size guide).
7. `quantity_selector`
8. `buy_buttons` — `show_dynamic_checkout: true`, gift recipient on.
9. `inventory` — `inventory_threshold: 5`, show count → scarcity for originals.
10. `icon-with-text` — 3 icons: Secure checkout · Free shipping over $X · 30-day returns.
11. `description` — kept short; long detail goes in tabs.
12. `collapsible_tab` × 4 — "Size & materials", "Framing options", "Shipping & returns", "Care instructions".
13. `complementary` — "Pairs well with" (needs Search & Discovery app).
14. `share`

New pieces:
- **Sticky add-to-cart bar** (`snippets/sticky-atc.liquid` + small JS in `assets/sticky-atc.js`): appears on scroll once the buy button leaves the viewport; shows thumb, title, price, variant, ATC. Mobile-first.
- **Trust badges under ATC** via `icon-with-text` (existing block, restyle in gold).
- **Custom commission CTA**: `custom_liquid` block shown only when product has tag `commission` → "Want it in another size or palette? Request a custom piece" link.

Section order below the main product (`templates/product.json` → `order`):

1. `main` (main-product)
2. `trust-bar` (new, scheme-2)
3. `image-with-text` — "How it's made" short story with the artist photo.
4. `testimonials` — 3 reviews.
5. `related-products` — "You may also like", 4 products, ratings on.
6. `collapsible-content` — FAQ (shipping, framing, digital delivery).
7. `disclosures` (keep, at bottom)

Copy rules for the product page: title ≤ 60 chars, first description line
states size and medium, always one lifestyle image (art on a wall with a chair
or plant for scale) as media #2.

## 8. Collection page (light touch, supports the above)

- `main-collection-banner`: show collection description, ornament divider.
- `main-collection-product-grid`: 4 cols, filters on (size, price, type),
  sort default "best-selling", `quick_add: standard`, ratings on.

## 9. Conversion checklist (what the redesign has to hit)

- One primary CTA per screen; secondary CTAs are outline style.
- Trust signals appear before the first price (trust bar under hero) and again
  at the buy button (icon-with-text).
- Social proof twice on home (testimonials, Instagram) and once on product.
- Cart drawer with upsell collection and free-shipping progress note in the
  announcement bar.
- Newsletter incentive (10% first order) at page bottom, not a popup on load.
- Lighthouse mobile ≥ 80: lazy media, video only on click, gallery images
  ≤ 2000px, no extra font families beyond the two above.

## 10. Implementation phases

| Phase | Work | Files |
|-------|------|-------|
| 1 — Foundation | Colors, fonts, shape settings, base.css tokens, ornament snippet, icon snippets | `config/settings_data.json`, `assets/base.css`, `snippets/ornament-divider.liquid`, `snippets/icon-*.liquid` |
| 2 — Home sections | New `trust-bar`, `testimonials`, `instagram-gallery`; edits to banner, featured-collection/card, collection-list, image-with-text, multicolumn, newsletter, FAQ | `sections/*`, `snippets/card-product.liquid`, `assets/component-card.css`, `locales/en.default.schema.json` |
| 3 — Home template | Rebuild `templates/index.json` in the order above with placeholder copy; header/footer group settings | `templates/index.json`, `sections/header-group.json`, `sections/footer-group.json` |
| 4 — Product page | Block order, tabs, inventory, icon-with-text, size-guide popup, sticky ATC, product template section order | `templates/product.json`, `sections/main-product.liquid`, `snippets/sticky-atc.liquid`, `assets/sticky-atc.js`, `snippets/price.liquid` |
| 5 — Collection + cart | Collection grid settings, cart drawer upsell, badges | `templates/collection.json`, `sections/cart-drawer.liquid`, `snippets/card-product.liquid` |
| 6 — QA | Theme Check, mobile pass, Lighthouse, placeholder content swap list for the store owner | — |

Inputs needed from the store owner before Phase 3: logo (SVG), hero image,
artist portrait, process video, 3 reviews, Instagram handle, shipping/return
policy figures, collection names.
