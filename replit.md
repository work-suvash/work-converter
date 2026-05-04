# Work-Converter

Work-Converter is a file conversion utility built with SvelteKit and TypeScript. It uses WebAssembly to convert files (images, audio, documents, video) directly on the user's device.

## Tech Stack

- **Framework**: SvelteKit 2 (Svelte 5) with `@sveltejs/adapter-static` (static SPA output)
- **Language**: TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS + Sass
- **i18n**: Inlang Paraglide JS
- **Package manager**: npm (with `--legacy-peer-deps`)
- **Runtimes used**: WebAssembly (`@imagemagick/magick-wasm`, `@ffmpeg/ffmpeg`, `vert-wasm`)

## Replit Setup

- The dev workflow `Start application` runs `npm run dev` (Vite on port 5000).
- `vite.config.ts` is configured with `host: 0.0.0.0`, `port: 5000`, and `allowedHosts: true`.
- A `.env` file was created from `.env.example` so all `PUB_*` environment variables are populated.
- Deployment is configured as **Static**: `npm run build` produces output in `build/`.

## Common Commands

- `npm run dev` — start dev server
- `npm run build` — build static site to `build/`
- `npm run preview` — preview production build
- `npm run check` — type-check

## Branding

Rebranded from "VERT" / "VERT.sh" to **Work-Converter** throughout all visible UI:
- `src/lib/util/consts.ts` — `VERT_NAME` now returns `"Work-Converter"`
- `src/lib/components/visual/svg/Logo.svelte` — SVG text wordmark "Work-Converter"
- `src/lib/paraglide/messages/en.js` — copyright and "supports…" strings updated
- About page (`src/routes/about/`) and about sections (`src/lib/sections/about/`) removed entirely
- Footer (`src/lib/components/layout/Footer.svelte`) removed entirely
- About nav item removed from Desktop and Mobile navbar components

## Design System

Premium SaaS aesthetic with deep indigo/blue palette:

- **Primary color**: Indigo `hsl(239, 84%, 67%)` — CSS var `--accent`
- **Backgrounds**: Cool-toned neutral `hsl(220, 33%, 97%)` light / deep navy `hsl(224, 32%, 7%)` dark
- **Panels**: White solid (`var(--bg-panel)`) with `border border-separator` and `rounded-2xl`
- **Navbar (desktop)**: Sticky glass header with backdrop blur, logo left, nav center, theme toggle right
- **Navbar (mobile)**: Pill-shaped bottom nav with animated sliding selection indicator
- **Key files**: `src/lib/css/app.scss` (all tokens), `src/routes/+page.svelte` (hero + cards)

## Notes

- Video conversion uses the external `vertd` daemon by default (`PUB_VERTD_URL`). The underlying server infra still uses VERT-sh endpoints — these are functional URLs, not visible branding.
- Stripe and Plausible analytics are optional, configured via env vars. Turn all off with `PUB_DISABLE_ALL_EXTERNAL_REQUESTS=true`.
