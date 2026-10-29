# Damodar Engineering Design — website

New site for **damodarengineering.com**. React 19 + Vite + Motion (`import { motion } from "motion/react"`). Plain CSS with custom properties (no Tailwind). Every section built later must follow this file.

---

## 1. Brief

### Business
- **Brand:** Damodar Engineering Design. **Tagline:** "Concept to Shop Drawing".
- **Principal:** Damodar Dasi, Senior Mechanical Design Engineer, Sharjah, UAE. 6+ years in UAE/GCC; serves UAE, GCC and India.
- **Service:** design engineering from concept → 3D model → GA / fabrication / shop drawings, plus support with fabrication queries and FAT/SAT.
- **Focus:** skid and package design, compressor packages, PSA nitrogen, storage tanks and pressure vessels, mobile fuelling stations, piping and base frames, bid/tender support, drawing checking.
- **Clients:** EPCs, fabricators, OEMs, fuel and gas operators.
- **Tone:** confident, technical, positive. Never use negative wording ("we don't manufacture", "no workshop"). Say what we do.

### Content rules
- Use only real content from the live site (https://damodarengineering.com) and this file. No lorem ipsum, fake testimonials, fake client logos, stock photos of people, or invented numbers.
- **Approved facts:** 6+ yrs UAE & GCC · 25+ tanks designed (500 L to 60 kL) · 7 fuel stations (up to 42,600 L gross) · code families ASME, API, UL, ISO, IEC, ADR · clients **Emarat** and **Maser** may be named.
- **Contact:** info@damodarengineering.com · phone/WhatsApp +971 50 963 3421 (`tel:+971509633421`, `https://wa.me/971509633421`) · LinkedIn "Damodar Dasi" → https://www.linkedin.com/in/damodar-dasi-3188b331a (opens in a new tab) · Sharjah, UAE. Show **only** info@damodarengineering.com on the site; never show dd@. All of these live in `src/content/site.js`.
- **Contact form:** builds a `mailto:` to info@damodarengineering.com (subject + body from the fields). No backend.

### Content from the live site
**Services (8)**
1. Skid and package design: 3D modelling, GA, fabrication drawings, piping isometrics, BOMs
2. Compressor and compander packages: piping integration, lube-oil consoles, seal-gas racks, acoustic enclosures
3. PSA nitrogen and compressed air: generator integration, receivers, buffer vessels, filtration skids
4. Storage tanks and pressure vessels: single- and double-wall fuel tanks, nozzles, baffles, hydrotest fixtures
5. Mobile fuelling stations: 20 ft and 40 ft containerised units, spill containment, vapour recovery, hazardous-area zoning
6. Piping and structural base frames: beam selection, anchor layouts, spools, material take-offs
7. Technical bid and tender support: compliance matrices, datasheets, preliminary GA
8. Drawing checking and design review: independent reviews, clash checks, vendor model audits, mentoring

**Selected projects (6)**
- 40 ft mobile fuelling unit, Dubai: 42,600 L gross; UL 142, UL 2085, ADR
- Marine nitrogen compander package: 4-stage; API 617, API 614, ABS
- Natural gas compressor redesign with FAT in Singapore: API 617, API 692, B31.3
- PSA nitrogen generation package for an Indian national operator: ASME VIII Div 1, IS 2825
- Portable fuelling unit integrated with fleet telemetry: ATEX Zone 1
- 6,000 L filter vessel and heavy tanks: ASME VIII Div 1

**Codes & standards:** ASME VIII Div 1, ASME B31.3, ASME B16.5, ASME B16.9, API 650, API 614, API 617, API 619, API 672, API 692, UL 142, UL 2085, IS 2825, ADR, ATEX 2014/34/EU, IEC 60079, ISO 8573-1, ABS Rules.

**Process (7 stages, a real sequence so numbering is OK):** enquiry and scope → design basis → sizing and vendors → 3D design and piping → GA and BOM → fabrication support → FAT/SAT and handover.

**Engagement models:** per deliverable · per project (turnkey) · monthly retainer.

**About:** drawings written for the people who build from them, checked for fit-up, weld access, lifting and transport. Tools: SolidWorks, AutoCAD, Inventor.

> For exact wording, re-read the live site section being rebuilt and keep its substance.

---

## 2. Design system: Direction A "Shop Drawing" (chosen 2026-10-29)

The site reads like a clean drawing set: paper, ink, blueprint grid, title blocks, dimension lines, revision tags. **The motifs are accents.** Body text, headlines and buttons stay plain, large and easy to read on a phone. Messaging is direct (from Direction B).

All tokens live in `src/index.css` `:root`. **Never hard-code hex values in components. Use the variables.**

### Colour
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F3F5F2` | page background |
| `--paper-raised` | `#FAFBF9` | sheets/cards on the grid |
| `--ink` | `#0E2A47` | headings, body text, sheet borders, dark bands |
| `--ink-muted` | `#4A5A6A` | secondary text (≈6.5:1 on paper) |
| `--grid` | `#D6DEE6` | blueprint grid, hairline dividers (decorative only, never text) |
| `--rule` | `#B8C3CE` | card borders and stronger non-text rules (hover → `--dim`) |
| `--dim` | `#1F5FAE` | links, dimension lines, code chips, focus ring (≈5.9:1 on paper) |
| `--rev` | `#B42318` | **only** main CTAs and REV tags (white text ≈6.4:1) |
| `--rev-hover` | `#8F1C13` | primary CTA hover |
| `--on-ink` | `#F3F5F2` | text on ink bands |
| `--error` | `#B42318` | form error borders/messages only (semantic state, the one exception to the revision-red rule) |

Single light theme by design (`color-scheme: light`). Don't add a dark mode unless asked.

### Typography
- **IBM Plex Sans** (400/500/600/700): headings, body, **buttons (sentence case)**, nav.
- **IBM Plex Mono** (400/500/600): **only** DWG numbers, code/standard chips, rev tags, title blocks, dimension labels, small eyebrows.
- Loaded from Google Fonts in `index.html` (`display=swap`).
- Scale (fluid, mobile first): `--text-xs` 12 · `--text-sm` 14 · `--text-base` 16 · `--text-lg` 18 · `--text-xl` 22 · `--text-2xl` 28→34 · `--text-3xl` 34→48.
- Body 16px min, line-height 1.6; headings 1.1–1.2, `text-wrap: balance`; measure ≤ 65ch. Mono labels uppercase with `letter-spacing: 0.06em`, never below 12px.

### Spacing, layout, shape
- Spacing scale (4px base): `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 24 · `-6` 32 · `-7` 48 · `-8` 64 · `-9` 96.
- Container `--container` 1200px, side gutter `--gutter` = 16px on phones, 24px at ≥768px.
- Section padding: `--space-8` on phones, `--space-9` on desktop.
- Breakpoints: 480 / 768 / 1024 / 1280 (min-width, mobile first).
- Square corners (`--radius` 2px max). Borders do the work of shadows: 1px `--grid` hairlines, 1.5px `--ink` for sheet frames. No drop shadows, gradients or glassmorphism.
- Use flex/grid + `gap` for sibling spacing.

### Drawing motifs (accents)
- **Drawing numbers:** prefix **`DED`** everywhere, format `DED-<SEC>-<NNN>`. Home `DED-000-001`. Sections: `SVC` services, `PRJ` projects, `COD` codes, `PRC` process, `ABT` about, `ENG` engagement, `CON` contact. Number items sequentially from 001 within a section.
- **Hero label:** `DWG DED-000-001 · SHARJAH, UAE` (mono, `--dim`) → small tagline "Concept to Shop Drawing" → headline "Fabrication-ready design for packaged equipment".
- **Title block** (`.title-block`): compact mono grid (TITLE / DWG NO. / REV / SCALE) at the end of a section or in the footer. On phones it collapses to 2 columns.
- **Dimension lines** (`.dim-line`): thin `--dim` line with ticks/arrowheads above key figures (6+ / 25+ / 7). Decorative, `aria-hidden`.
- **Blueprint grid** (`.blueprint`): faint background on hero/feature bands only, not behind long text on phones.
- **REV tag** (`.rev-tag`): small outlined `--rev` mono tag on project sheets.
- **Code chips** (`.chip`): mono, `--dim` outline.

### Buttons & links
- `.btn` + `.btn--primary` (rev red fill, white text) for the main CTA ("Send an enquiry"). `.btn--secondary` (ink outline) for the rest ("View projects").
- IBM Plex Sans 600, sentence case, min height 44px (tap target), 12×20 padding.
- Links `--dim`, underline on hover/focus.
- Focus: `:focus-visible` 2px `--dim` outline, 3px offset, on every interactive element. Never remove it.

### Motion rules
- Library: `motion/react`. App is wrapped in `<LazyMotion features={loadFeatures} strict>` (features in `src/lib/motion-features.js`, loaded async) and `<MotionConfig reducedMotion="user">`. Components use `import * as m from 'motion/react-m'` and `<m.div>`, never `motion.*` (strict mode throws).
- Use the shared presets in `src/lib/motion.js` (`reveal`, `revealStagger`, `viewportOnce`). Don't invent new ones per section.
- Scroll reveal: opacity 0→1 + y 12px→0, 0.4s, ease `[0.2, 0, 0, 1]`, once, `amount: 0.2`. Stagger children 0.06s.
- Hover: colour/border change 150–200ms, or translate ≤2px. No scale bounces, parallax, spinning, auto-playing carousels or typing effects.
- Dimension/sheet lines may "draw in" once (stroke-dashoffset or scaleX), ≤0.6s.
- Animate only `opacity` and `transform`. Content must be readable without JS-triggered motion.
- `prefers-reduced-motion: reduce` → no movement; CSS transitions also cut in `index.css`.

### Accessibility & mobile checklist (every section)
- Looks right at 375px first, then 768 / 1024 / 1440. No horizontal scroll.
- Text contrast ≥ 4.5:1 (use only the text tokens above for text).
- Tap targets ≥ 44×44px, 8px+ apart.
- Semantic landmarks, one `<h1>` per page, logical heading order, skip link kept.
- Decorative SVG `aria-hidden="true"`; meaningful images get alt text. SVG icons only, no emoji.
- Visible labels on form fields; errors next to the field.

---

## 3. Code conventions
- Components in `src/components/` (PascalCase `.jsx`), one section per file (e.g. `Services.jsx`), with section styles in a matching `.css` file imported by the component.
- Content lives in `src/content/` data files, not hard-coded inside markup, so copy stays in one place.
- Section `id`s match nav anchors: `services`, `projects`, `codes`, `process`, `engagement`, `about`, `contact`. Nav links (`navLinks` in `src/content/site.js`): Services, Projects, Codes, Process, About, Contact + "Request quote" (→ `#contact`). Every CTA (Send an enquiry, Request quote, Enquire →, Discuss this →) points to `#contact`.
- The navbar is `position: fixed`, transparent at the top and solid (paper + ink rule) once scrolled. The first section must pad its top by `var(--header-h)`.
- Built so far: `Navbar`, `Hero` (with `SkidDrawing` SVG, DWG DED-000-002), `StatsStrip`, `Services` (DED-SVC-001), `Projects` (DED-PRJ-001, cards DED-PRJ-011…016), `Codes` (DED-COD-001), `Process` (DED-PRC-001), `Engagement` (DED-ENG-001), `About` (DED-ABT-001), `Contact` (DED-CON-001), `SiteFooter` (full title block), `WhatsAppFab`. The page is complete in this order.
- Projects: data in `src/content/projects.js` (live-site "Project register"; the live site's own refs F-01, C-01… are not shown). Filter buttons use `aria-pressed` + a polite live region, Motion `layoutId` indicator, `layout` + `AnimatePresence mode="popLayout"` on cards. Cards are drawing sheets: DWG + REV header, `ProjectSketch` line art on `.blueprint`, scope / key specs / code chips, STATUS footer. Grid 1 → 2 (768) → 3 (1024).
- Shared pieces: `TitleBlock` (`rows` of [label, value]), `CountUp` (once in view, static under reduced motion), `.section-head` + `.dwg-no` + `.section-title` for every section heading, `DimValue` pattern in `StatsStrip` for figures between dimension lines.
- Every `.section` after another `.section` gets a 1.5px ink top rule; close each section with `<TitleBlock className="section-tb" …>` (TITLE / DWG NO. / REV / SCALE).
- Process: scroll-linked `--dim` rail (`useScroll` + `useSpring`, scaleX on desktop ≥1024, scaleY on phones; static under reduced motion); steps labelled `SEQ 01…07`.
- Contact form: visible labels, required = name, business email, location, package type, scope; errors show on blur or submit, next to the field (`aria-invalid` + `aria-describedby`), focus moves to the first invalid field. "Prepare enquiry email" builds a `mailto:` to info@ and then shows a status line; never claim the email was sent. Email copy button falls back to selecting the text.
- WhatsApp floating button: phones only (<768px), hidden while the hero, `#contact` or the footer is on screen so it never covers their buttons.
- Service cards: `ServiceIcon` line art (48px, 1.5 stroke, `currentColor`), `--rule` border turning `--dim` on hover/focus-within, "Enquire →" to `#contact`. Grid 1 → 2 (768) → 4 (1024) columns.
- SEO: title, description, canonical, Open Graph/Twitter tags and `ProfessionalService` JSON-LD live in `index.html`; `public/` holds `robots.txt`, `sitemap.xml` (update `lastmod` when content changes), `og-image.png` (1200×630) and `apple-touch-icon.png`. Keep JSON-LD contact details in sync with `src/content/site.js`.
- Element ids must be unique: section ids are reserved for nav anchors, so form fields use prefixed ids (e.g. `enquiry-codes`).
- Lint with `npm run lint` (oxlint). Build with `npm run build` before committing.
- Deploy: repo DamodarDasi-dot/damodar-engineering-site, Cloudflare Worker `damodar-engineering-site` (Workers Builds). `main` deploys to production; other branches get preview URLs. `wrangler.jsonc` serves `./dist`; keep the Worker name. Never push to `main` without the owner's go-ahead.
