# Damodar Engineering Design — website

Single-page site for [damodarengineering.com](https://damodarengineering.com/): "Concept to Shop Drawing".
Built with React 19, Vite and Motion (`motion/react`), styled with plain CSS custom properties.

## Run and build

Requires Node.js 20.19+ or 22.12+ (Vite 8).

```bash
npm install        # install dependencies
npm run dev        # local dev server at http://localhost:5173
npm run lint       # oxlint
npm run build      # production build into dist/
npm run preview    # serve dist/ at http://localhost:4173 to check the build
```

The contact form opens a pre-filled email (`mailto:`), so there is no backend to run.

## Deploy

The site is served by the Cloudflare Worker `damodar-engineering-site` (static assets from `./dist`, see `wrangler.jsonc`) on damodarengineering.com. Workers Builds deploys automatically:

- **Push to `main`** → `npm run build` then `npx wrangler deploy` → live on damodarengineering.com.
- **Push to any other branch** → preview build with its own preview URL (Worker → Deployments / Previews in the Cloudflare dashboard). Production is untouched.

Node.js 24 is pinned for builds in `.node-version`. To roll back to the previous plain-HTML site, deploy the `legacy-html-site` tag/branch.

## Where things live

| Path | What it holds |
|---|---|
| `CLAUDE.md` | Brief, content rules and the "Shop Drawing" design system (colours, type, spacing, motion). Read before changing anything. |
| `src/content/` | All site copy: services, projects, codes, process, engagement, contact details. Edit text here, not in components. |
| `src/components/` | One component (+ CSS file) per section. |
| `src/index.css` | Design tokens and shared styles (buttons, title blocks, chips, grid). |
| `src/lib/motion.js` | Shared animation presets. Motion features load lazily via `LazyMotion`. |
| `wrangler.jsonc` | Cloudflare Worker config: serves `./dist` as static assets. |
| `public/` | Favicon, apple-touch icon, Open Graph image, `robots.txt`, `sitemap.xml`. |

SEO tags, Open Graph/Twitter tags and the `ProfessionalService` JSON-LD are in `index.html`.
