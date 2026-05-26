@AGENTS.md

# Schoola — Claude Code Instructions

## Project Overview

Schoola is a Next.js 16 (App Router) e-commerce app for school uniforms and supplies in Egypt. It is a **mobile-first** app with full Arabic/English RTL support.

## Architecture

- **Framework**: Next.js 16.2.6 with Turbopack, React 19
- **Styling**: Tailwind CSS v4 — use utility classes; inline `style={{}}` for dynamic values
- **State**: Zustand v5 with `persist` middleware (localStorage) for auth, cart, UI, product/school cache
- **Data**: TanStack React Query v5 — all API calls go through hooks in `lib/hooks/queries.ts`
- **i18n**: `next-intl` v4 + `useUiStore` locale (`"ar"` | `"en"`) — always support both
- **RTL**: Use Tailwind logical properties: `start`/`end` instead of `left`/`right`, `ps`/`pe` instead of `pl`/`pr`

## Key Files

| File | Purpose |
|---|---|
| `app/(app)/layout.tsx` | App shell — hides header/nav for unauthenticated home page |
| `app/(app)/page.tsx` | Home: renders `<LandingPage>` for guests, feed for auth users |
| `components/auth/AuthLayout.tsx` | Shared dark animated layout for all `/auth/*` pages |
| `components/landing/LandingPage.tsx` | Full-screen guest landing page |
| `components/layout/Header.tsx` | Sticky header with SVG logos (light: `schoola-logo-egypt.svg`, dark: `schoola-logo-egypt-dark-transparent.svg`) |
| `lib/store/ui.ts` | `locale`, `darkMode` — default `darkMode: false`, version 2 with migrate |
| `lib/store/auth.ts` | `token`, `user`, `isAuthenticated`, `pendingPhone` |
| `lib/store/cart.ts` | Cart items, persisted |
| `lib/store/productCache.ts` | Product data persisted to localStorage |
| `lib/store/schoolCache.ts` | School data persisted to localStorage |
| `lib/hooks/queries.ts` | All TanStack Query hooks |

## CSS Classes (defined in AuthLayout.tsx)

Auth pages use these global CSS classes injected via `<style>` in `AuthLayout`:
- `.auth-input` — dark glassmorphism input field
- `.auth-label` — muted white label
- `.auth-btn-gold` — gold gradient submit button
- `.auth-error` — red error message box
- `.auth-link` — gold colored anchor link

## Design System

**Colors:**
- Primary teal: `#318B9B`
- Gold accent: `#C9A84C`
- Dark background: `#06101c` → `#0b1f33` (gradient)
- Purple accent: `#7C3AED`

**Landing / Auth pages**: Always dark mode (`colorScheme: "dark"`), animated navy gradient background, floating school icons.

**App pages**: Light/dark mode aware via `darkMode` from `useUiStore()`.

## Logo Usage

- Source files live in `assets/images/` — always copy to `public/assets/images/` after changes
- Light mode: `/assets/images/schoola-logo-egypt.svg`
- Dark mode: `/assets/images/schoola-logo-egypt-dark-transparent.svg`
- Always set `style={{ height: "auto" }}` when constraining width via className, or `style={{ width: "auto" }}` when constraining height

## API Constraints

- **Catalog**: requires `school_id` or `student_id` — cannot list all products without a filter
- **Schools**: max `per_page: 50` — requesting 100 returns 422
- **Auth flow**: login → OTP → complete-profile

## Zustand Store Rules

- All stores use `persist` middleware with a unique `name` key
- `ui.ts` has `version: 2` with `migrate` to reset `darkMode: false`
- Access stores with selector pattern: `useCartStore((s) => s.itemCount())`

## Routing

- `/` — Home (LandingPage for guests, feed for auth)
- `/auth/login`, `/auth/register`, `/auth/otp`, `/auth/complete-profile`
- `/schools`, `/uniforms`, `/product/[id]`, `/school/[id]`
- `/cart`, `/checkout`, `/orders`, `/order/[id]`
- `/account`, `/students/[id]`
- `/stores`, `/supplies` — Coming soon pages (click outside → navigate to `/`)

## i18n Pattern

Always support both locales inline:
```tsx
const { locale } = useUiStore();
// ...
{locale === "ar" ? "النص العربي" : "English text"}
```

## Component Conventions

- All interactive components are `"use client"`
- Page components in `app/` check `useAuthStore().isAuthenticated` for auth-gating
- Coming soon pages use `<ComingSoon>` from `components/ui/ComingSoon.tsx`
- `BottomNav` active state: `/product/*` → uniforms active, `/school/*` → schools active
