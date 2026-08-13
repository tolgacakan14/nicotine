# NICOTINE

İstanbul street fashion label. One drop every two months, seven to eight pieces,
never restocked.

Next.js 15 (App Router) · React 19 · Tailwind · GSAP + Lenis · TypeScript.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

---

## Where things live

```
src/
  app/                 routes: /, /drop, /product/[slug], /archive, /cart, /club
  components/
    brand/             Logo (vector mark), Wordmark, OrbitRings
    film/              Figure + ScrollFilm — the dressroom
    product/           cards, gallery, hover gallery, add-to-cart
    club/              membership
    layout/            nav, footer, smooth scroll, theme, currency
  data/                drops.ts · film.ts · club.ts · types.ts
  lib/                 cart · currency · club · scroll
public/products/       product photography
```

## The three files you will actually edit

| File | Holds |
| --- | --- |
| `src/data/drops.ts` | every drop and every product |
| `src/data/film.ts` | the dressroom storyboard, act by act |
| `src/data/club.ts` | tiers, discounts, events, FAQ |

### Publishing a new drop

Copy the newest block in `drops.ts`, bump `code` and `season`, give it a
`releasedAt` date. **The drop with the newest past date automatically becomes
the live one everywhere** — home page, nav menu, archive. Older drops fall into
the archive on their own. Nothing else needs changing.

### Adding a product

Add an object to that drop's `products` array. Prices are whole EUR integers —
`<Price>` converts and formats them, so never hard-code a currency. Drop the
photography in `public/products/` and point `image` / `images` at it;
`imageLabels` captions each view, and any product with more than one image gets
the hover gallery on its card for free.

### Putting a product on the character

1. Draw the garment in `components/film/Figure.tsx` as a `<g data-layer="…">`,
   with a matching `<clipPath>` rect.
2. Add its wipe range to `WIPE` in `ScrollFilm.tsx`.
3. Add an act to `film.ts` referencing the product slug and the layer.

## Conventions worth knowing before you change things

- **Colours are role-named** (`ground`, `mark`, `line`, `ash`, `haze`) and
  resolve through CSS variables, so `/club` flips to dark with one class. Never
  hard-code a hex in a component.
- **Garments are single closed silhouettes.** Body and both sleeves live in one
  path, so a garment cannot come apart from itself. Layers are revealed by
  animating clip rects — never by moving the garment.
- **GSAP entrance animations use `fromTo`, not `from`.** React StrictMode mounts
  effects twice in dev and `from` infers its end state from the live DOM, which
  leaves elements stuck invisible.
- **Lenis owns scrolling.** Call `scrollToTop()` from `lib/scroll.ts` rather
  than `window.scrollTo`.

## Prototype boundaries

Cart, membership and checkout are client-side only (`localStorage`). There is no
payment provider, no backend and no order is ever placed. The EUR→TRY rate in
`lib/currency.tsx` is hard-coded — wire it to a rates API before going live.
