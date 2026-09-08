# ispsjginjs

A React + Tailwind redesign of [OpenSchoolSucks](https://github.com/maxkunc/openschoolsucks) —
a dashboard for [is.psjg.cz](https://is.psjg.cz) grades, portfolio and exams —
styled as a bento-grid "widget collage", CZ/EN switchable, set in a dotted
pixel font.

This is a frontend only. All the actual is.psjg.cz login/scraping happens in
the [openschoolsucks](https://github.com/maxkunc/openschoolsucks) Flask
backend, which this app talks to over its JSON `/api/*` endpoints - the
session cookie set by that backend is what keeps you logged in, this app
never sees your password beyond the initial login request.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- react-router-dom for the login/dashboard split
- [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) for UI
  text, "LED Counter-7" (carried over from the original app, see
  `public/fonts/led_counter-7-LICENSE.txt`) for the dot-matrix numbers
- No UI kit - the bento composition is hand-built (`src/components/BentoCard.jsx`
  and friends) to match the reference layout

## Running locally

You need the [openschoolsucks](https://github.com/maxkunc/openschoolsucks)
Flask API running too (`python app.py`, defaults to `http://127.0.0.1:5000`).

```bash
npm install
npm run dev
```

`vite.config.js` proxies `/api/*` to `http://127.0.0.1:5000` in dev, so no
CORS setup is needed locally. Override the proxy target with
`VITE_DEV_API_PROXY` if your backend runs elsewhere.

## Deploying

**The recommended path is not to deploy this repo directly.** The backend's
`Dockerfile` builds this repo and serves it itself (see openschoolsucks'
README > Deployment), so the whole app is one service on one origin, with
no `VITE_API_URL`/CORS to configure - just deploy the backend and this
repo comes along automatically at build time.

Deploying this repo on its own (e.g. to iterate on the UI without
rebuilding the backend image each time) still works: build with
`npm run build` (outputs to `dist/`) and serve as a static site. Set
`VITE_API_URL` (see `.env.example`) to the deployed backend's full `/api`
URL, and see the backend README for the `FRONTEND_ORIGIN` /
`SESSION_COOKIE_SAMESITE` / `SESSION_COOKIE_SECURE` settings that
cross-origin deployment needs on its side.

## Structure

```
src/
  api/client.js          fetch wrapper for the Flask JSON API
  context/                auth + language (CZ/EN) React contexts
  i18n/                    cs.js / en.js dictionaries
  hooks/                   useHomeData, usePortfolio
  components/              BentoCard, HeroCard, DotNumber, ...
  pages/                   LoginPage, Dashboard
```

## Language switching

Toggle CZ/EN with the pill in the top-right corner; the choice is
remembered in `localStorage`. All UI copy lives in `src/i18n/{cs,en}.js` -
add a key there (both files) to add new copy.
