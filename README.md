# Knitting Pattern Visualizer & Yardage Calculator

> Knitters struggle to visualize how a finished pattern will look with their chosen yarn and to accurately calculate how much yarn they need, leading to wasted money and materials.

## Feedback & Ideas

> **This project is being built in public and we want to hear from you.**
> Found a bug? Have a feature idea? Something feel wrong or missing?
> **[Open an issue](../../issues)** — every piece of feedback directly shapes what gets built next.

## Status

> ✅ Live at [yarnmath.fly.dev](https://yarnmath.fly.dev) — 7/7 e2e scenarios passing

| Feature | Status | Notes |
|---------|--------|-------|
| Project scaffold & CI | ✅ Complete | Vite + React + Vitest |
| Yardage calculator logic | ✅ Complete | Unit conversion, gauge adjustment, cost estimate |
| Calculator form UI | ✅ Complete | Pattern + substitute yarn inputs, results display |
| Cross-weight warning & yarn reference | ✅ Complete | CYC weight categories, reference modal |
| Analytics | ✅ Complete | Plausible (privacy-first, no cookies) |
| Ship check & pre-launch verification | ✅ Complete | 88% mutation score, CI green |
| Deploy to Fly.io + e2e verification | ✅ Complete | nginx Docker deploy, all 7 e2e pass |

## What It Solves

Knitters struggle to visualize how a finished pattern will look with their chosen yarn and to accurately calculate how much yarn they need, leading to wasted money and materials.

## Who It's For

Hand-knitters and crocheters who follow digital patterns, especially those substituting yarns.

## Features

- **Yardage calculator** — enter your pattern's required yardage and the yardage per skein of your substitute yarn; get back how many skeins you need, total yardage, and cost estimate
- **Gauge adjustment** — compensate for gauge differences between the pattern yarn and your substitute
- **Unit conversion** — work in yards or meters
- **Cross-weight warning** — alerts you when substituting across more than one CYC weight category
- **Yarn weight reference** — built-in modal with CYC weight descriptions and typical gauge ranges

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Vitest** + Testing Library for unit and component tests
- **Playwright** for end-to-end tests
- **Plausible** for privacy-first analytics (no cookies, no GDPR banner needed)

## Usage

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run end-to-end tests (requires running dev server)
npm run e2e

# Build for production
npm run build
```

## Environment Variables

No environment variables are required. The app is fully static — all logic runs in the browser.

The Plausible analytics snippet in `index.html` is hardcoded to the production domain (`yarnmath.fly.dev`). For local development this is harmless; Plausible simply won't track localhost traffic.

## Deploy

The app builds to a static `dist/` folder and can be deployed anywhere that serves static files.

### Fly.io

The repo includes `Dockerfile`, `nginx.conf`, and `fly.toml` for Fly.io deployment. The Dockerfile does a multi-stage build (Node → nginx) and serves the static assets on port 8080.

```bash
# First-time setup (requires flyctl installed and logged in)
fly launch --no-deploy --copy-config --yes

# Deploy
fly deploy --remote-only
```

The app auto-stops machines when idle (zero minimum machines) for cost control.

### Other hosts

Any static host works: Netlify, Vercel, Cloudflare Pages, GitHub Pages. Point the host at the `dist/` directory after running `npm run build`.

---

*Built by [DaemonShip](https://github.com/daemonship) — autonomous venture studio*
