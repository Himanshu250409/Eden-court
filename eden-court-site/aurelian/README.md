# Eden Court by Silverbill — scroll-driven luxury real-estate site

Next.js (App Router) · TypeScript · Tailwind · three / R3F / drei / postprocessing · GSAP + ScrollTrigger · Lenis · Framer Motion · Zustand.

> **Status:** written without access to the npm registry, so it has **not been built or run**. Syntax was checked (no parse errors), but expect to fix a small type or runtime issue or two on first `npm run dev`. See "Known gaps" below.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```
Deploys to Vercel as-is (no env vars needed).

## Where to change things (re-skin in minutes)

| What | Where |
|---|---|
| Name, city, address, phone, WhatsApp, RERA no., tagline, copy, stats, amenities, neighbourhood pins, currencies, image paths | `config/site.ts` |
| Floors, unit types, plan images, room sizes, **prices**, per-floor availability | `data/floors.ts` |
| Colours | `config/site.ts` **and** `:root` in `app/globals.css` (hex + RGB channels) |
| Fonts | `app/layout.tsx` (`Cormorant_Garamond`, `Inter`) |
| UI translations (EN, AR, ZH, RU, FR) | `lib/i18n.ts` (Arabic switches the page to RTL) |
| Currency rates | `config/site.ts` → `currencies` (replace with a live source) |
| Enquiry submit (currently opens WhatsApp with a prefilled message) | `lib/submitEnquiry.ts` |
| Time-of-day lighting presets | `components/tower/constants.ts` |

Search the code for `REPLACE` and `PLACEHOLDER` to find every spot that needs real content.

## Swapping assets

- **3D model:** drop a Draco-compressed `tower.glb` at `public/models/tower.glb`. Floors must be top-level meshes named `Floor_00 … Floor_14`. If the file exists it is used automatically (hover/click/exploded lift work); otherwise the procedural tower is generated.
- **Plans & renders:** `public/images/*` (cropped from the brochure PDF). Replace files, keep names, or edit paths in `data/floors.ts` / `config/site.ts`.
- **Lifestyle photos:** not in the brochure. Add `interior-a.jpg`, `interior-b.jpg`, `wellness.jpg`, `lifestyle.jpg`, `collage-1..3.jpg`, `why-city.jpg` to `public/images/`. Until then sections show elegant gradient placeholders.
- **Video:** `public/media/walkthrough.mp4` (poster set in config).
- **Brochure:** `public/brochure.pdf` (the layouts PDF you supplied).

## Building structure used

Ground = stilt parking, Level 01 = podium parking, Levels 02–13 = residences, **Level 14 = amenities (top floor)**. That is 13 floors above the podium; change `site.building` in `config/site.ts` if your count differs.

## Known gaps (please read)

1. **Prices, carpet areas and per-floor availability are placeholders.** The brochure has room sizes and layouts only, so the UI shows "On request". Which units appear on which floor is invented — replace with the real inventory.
2. **Bathroom counts and the gold highlight regions on the plans are approximations** read from the brochure drawings.
3. The **procedural tower is a stylised block tower**, not the real curved Eden Court design. Supply a GLB for accuracy.
4. **The Gate and Arrival stages are DOM/CSS-3D + GSAP**, not WebGL (smoother on all devices). The floor-by-floor build-up, window lighting and orbit happen in the interactive tower section. Depth-of-field and volumetric light shafts are not included (bloom, vignette, grain, fog and shadows are).
5. Neighbourhood drive times, stats and amenity copy are placeholders to verify.
6. On touch devices the tower auto-orbits and drag-rotate is disabled so vertical swipes keep scrolling the page; use the floor chips to select.
7. Only core UI strings are translated; story copy is English.
8. Lighthouse 90+ is not measured.

## Structure

```
app/            layout, globals.css, page.tsx
config/         site.ts          ← brand + content
data/           floors.ts        ← floors/units/plans/prices
store/          useStore.ts      ← hoveredFloor, selectedFloor, selectedUnit, isPanelOpen, isPanelMinimised, timeOfDay, soundOn…
lib/            gsap, audio (generated ambient pad), i18n, format, submitEnquiry
components/     Preloader, GateScene, ArrivalSection, TowerSection, FloorSlider, FloorTooltip,
                PlanPanel, PlanPill, UnitSelector, CustomCursor, SoundToggle, LanguageSwitcher,
                PrivateMenu (+curtain), EnquiryForm/Modal, WhatsAppButton, Magnetic, WordReveal, Counter…
components/tower/   TowerCanvas, Floor, Life (trees, cars, clouds, birds), CameraRig, constants
components/sections/ WhyCity, Everyday, Amenities, Wellness, Nothing, HomeComing,
                     Neighbourhood, Walkthrough, Wordmark, Enquiry
```

## Panel behaviour

Click a floor → camera glides, floors above lift away, glass panel opens. Click/tap anywhere outside the panel, press **Esc**, swipe the mobile sheet down, or scroll away → it minimises to a pill ("Floor 12 · 2 BHK"). Tap the pill to re-open, ✕ to dismiss. Clicking another floor swaps the panel content. Clicks inside the panel never close it.

## Accessibility & performance

`prefers-reduced-motion` disables pinned fly-throughs and smooth scroll. The canvas drops pixel ratio and postprocessing automatically via `PerformanceMonitor`. Sound is off by default.

Brochure disclaimer applies: images, plans and furnishings are indicative. MahaRERA No. PR3000002600273.
