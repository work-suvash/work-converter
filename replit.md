# VERT.sh

VERT is a file conversion utility built with SvelteKit and TypeScript. It uses WebAssembly to convert files (images, audio, documents, video) directly on the user's device. See the [official site](https://vert.sh).

## Tech Stack

- **Framework**: SvelteKit 2 (Svelte 5) with `@sveltejs/adapter-static` (static SPA output)
- **Language**: TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS + Sass
- **i18n**: Inlang Paraglide JS
- **Package manager**: Bun (lockfile is `bun.lock`)
- **Runtimes used**: WebAssembly (`@imagemagick/magick-wasm`, `@ffmpeg/ffmpeg`, `vert-wasm`)

## Replit Setup

- The dev workflow `Start application` runs `bun run dev --host 0.0.0.0 --port 5000`.
- `vite.config.ts` is configured with `host: 0.0.0.0`, `port: 5000`, and `allowedHosts: true` so the Replit preview proxy (which presents the app under a different host) is trusted.
- A `.env` file was created from `.env.example` so all `PUB_*` environment variables are populated. Update these as needed (e.g. `PUB_HOSTNAME`, `PUB_VERTD_URL`, `PUB_DISABLE_ALL_EXTERNAL_REQUESTS`).
- Deployment is configured as **Static**: `bun run build` produces output in `build/`, which is served as a static site.

## Common Commands

- `bun run dev` — start dev server
- `bun run build` — build static site to `build/`
- `bun run preview` — preview production build
- `bun run check` — type-check

## Design System (Premium Redesign)

A full UI/UX overhaul was applied with a high-end SaaS aesthetic:

- **Primary color**: Indigo `hsl(239, 84%, 67%)` (replaces the original pink; CSS var `--accent-pink` kept for backward compat)
- **Backgrounds**: Cool-toned neutral `hsl(220, 33%, 97%)` light / deep navy dark
- **Panels**: White solid (`var(--bg-panel)`) with `border border-separator` and `rounded-2xl`
- **Navbar (desktop)**: Sticky `<header>` with `backdrop-blur` glass effect (`--bg-header`), logo left, nav center, theme toggle right — defined in `src/lib/components/layout/Navbar/Desktop.svelte`
- **Navbar (mobile)**: Pill-shaped bottom nav in `Base.svelte` with animated selection indicator
- **Footer**: Glass `backdrop-blur` effect matching the header
- **Uploader**: Dashed-border drag zone with indigo icon chip and glow on hover
- **Feature cards**: Per-category color chips (blue/purple/green/red), hover lift + shadow elevation
- **Tailwind tokens added**: `shadow-elevated`, `bg-panel-highlight`, `accent-*-alt` semantic colors
- **Key files**: `src/lib/css/app.scss` (all tokens), `src/routes/+page.svelte` (hero + cards), `src/lib/components/functional/Uploader.svelte`, `tailwind.config.ts`

## Notes

- Video conversion uses the external `vertd` daemon by default (`PUB_VERTD_URL`). For self-hosting, see the docs in `docs/`.
- Stripe and Plausible analytics are optional and configured via env vars. They can all be turned off with `PUB_DISABLE_ALL_EXTERNAL_REQUESTS=true`.
