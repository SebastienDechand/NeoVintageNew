# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NeoVintageNew is a monorepo with two separate apps:
- `Back/` — Node.js/Express REST API (MongoDB via Mongoose)
- `Front/` — Angular 19 app with SSR (Angular Universal), deployed on Railway.app

## Commands

### Backend (`Back/`)
```bash
npm start        # production
npm run dev      # development (same as start, runs node server.js)
```

### Frontend (`Front/`)
```bash
npm start                        # dev server (localhost:4200)
npm run build                    # production build (SSR)
npm run serve:ssr:front          # run SSR build locally
npm test                         # run all tests (Karma)
ng test --include=**/foo.spec.ts # run a single spec file
ng lint                          # lint
```

## Architecture

### Backend

`server.js` connects to MongoDB first, then registers routes — all route handlers are only available after the DB connection succeeds. Routes follow the pattern `/<resource>` (e.g., `/photos`, `/creators`, `/auth`, `/feedbacks`).

**Auth model**: admin-only. `middleware/auth.middleware.js` validates a JWT Bearer token against the `Admin` model. Only admin routes are protected; public routes (photo/creator listings, feedbacks) are open.

### Frontend

Single-page Angular app (one route: `LandingPageComponent`). The landing page is composed of standalone components assembled in sequence. There is no lazy loading.

**Environment config**: `src/app/environments/environment.ts` holds `apiUrl` (points to Railway production URL). There is no `environment.development.ts` — all environments hit the production API.

**SSR**: The app uses `@angular/ssr` with hydration + event replay (`withEventReplay()`). Components that use browser APIs (localStorage, etc.) must guard with `isPlatformBrowser` — see `AuthService` which uses `localStorage` directly and will fail on SSR if called server-side.

**HTTP**: All API calls go through Angular's `HttpClient` (configured with `withFetch()` for SSR compatibility). Services read from `environment.apiUrl` — never hardcode API URLs in components.

**Admin content editing**: `edit-content` component and `AuthService` handle the admin flow (JWT stored in localStorage). The `legal-modal` component uses a dedicated `LegalModalService` (BehaviorSubject pattern) to coordinate modal state across components.

## Deployment

Railway.app hosts both apps. Backend `Dockerfile` is in `Back/`. Config at root `railway.json`.
