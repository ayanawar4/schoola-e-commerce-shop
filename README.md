# Schoola — School Uniforms & Supplies E-Commerce

Egypt's #1 platform for official school uniforms and supplies. A full-stack mobile-first e-commerce app built with Next.js 16, React 19, and Tailwind CSS v4.

---

## Features

- **Landing page** — Animated dark navy + gold luxury landing for guests with floating school icons, shimmer effects, and animated gradient background
- **Authentication** — Phone + OTP flow (register → OTP verify → complete profile), login with phone + password, shared `AuthLayout` with landing page theme
- **Home feed** — Personalized hero with search, category grid, promo banner, best sellers, top schools
- **Schools** — Browse all schools with search and filtering
- **Uniforms / Catalog** — Browse products by school with size and category filters; persisted across page reloads via localStorage cache
- **Product detail** — Full product page with size selection, quantity, add to cart
- **Cart** — Item management with quantity controls, dark mode support
- **Checkout** — Order summary, delivery address, notes, place order
- **Orders** — Order history list and order detail view
- **Account** — Profile view, student management (add / edit / delete)
- **AI Chat** — Floating AI assistant button available on all authenticated pages
- **Coming soon pages** — Stores and Supplies pages with click-outside-to-dismiss overlay
- **RTL / i18n** — Full Arabic and English support via `next-intl`, locale toggle in header and auth pages
- **Dark mode** — System-aware with manual toggle, defaults to light mode

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| State | Zustand v5 (with `persist` middleware for cart, auth, product/school cache, UI) |
| Data fetching | TanStack React Query v5 |
| HTTP | Axios |
| Icons | Lucide React |
| Components | Radix UI primitives |
| i18n | next-intl v4 |
| Language | TypeScript 5 |

---

## Project Structure

```
schoola/
├── app/
│   ├── (app)/                  # Authenticated + guest app shell
│   │   ├── layout.tsx          # Header/BottomNav/FloatingAI (hidden on guest home)
│   │   ├── page.tsx            # Home: LandingPage (guest) or feed (auth)
│   │   ├── schools/            # Schools browser
│   │   ├── uniforms/           # Catalog with school/size filters
│   │   ├── product/[id]/       # Product detail
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout + delivery address
│   │   ├── orders/             # Order history
│   │   ├── order/[id]/         # Order detail
│   │   ├── account/            # User profile
│   │   ├── students/           # Student list + add/edit
│   │   ├── ai-chat/            # AI assistant chat
│   │   ├── stores/             # Coming soon
│   │   └── supplies/           # Coming soon
│   ├── auth/
│   │   ├── login/              # Login form
│   │   ├── register/           # Register (phone → OTP)
│   │   ├── otp/                # OTP verification
│   │   └── complete-profile/   # Profile setup after OTP
│   └── [locale]/               # i18n locale routing
├── components/
│   ├── auth/
│   │   └── AuthLayout.tsx      # Shared dark animated layout for all auth pages
│   ├── home/
│   │   ├── HomeHero.tsx        # Search hero with quick links
│   │   ├── CategoryGrid.tsx    # 4-column category nav
│   │   ├── PromoBanner.tsx     # Promo CTA banner
│   │   ├── BestSellers.tsx     # Horizontal product scroll
│   │   ├── TopSchools.tsx      # Horizontal school scroll
│   │   └── StatsStrip.tsx      # Schools / Products / Quality stats
│   ├── landing/
│   │   └── LandingPage.tsx     # Full-screen guest landing page
│   ├── layout/
│   │   ├── Header.tsx          # Sticky top nav with SVG logo (light/dark)
│   │   ├── BottomNav.tsx       # Mobile bottom navigation
│   │   └── FloatingAiButton.tsx # Persistent AI chat button
│   └── ui/
│       ├── ComingSoon.tsx      # Click-outside-to-home coming soon overlay
│       └── Toaster.tsx         # Toast notifications
├── lib/
│   ├── api/                    # Axios client + API functions
│   ├── hooks/
│   │   └── queries.ts          # All TanStack Query hooks
│   └── store/
│       ├── auth.ts             # Auth state (token, user, pendingPhone)
│       ├── cart.ts             # Cart items (persisted)
│       ├── ui.ts               # locale, darkMode (persisted, default light)
│       ├── productCache.ts     # Product data cache (persisted)
│       └── schoolCache.ts      # School data cache (persisted)
├── public/
│   └── assets/images/
│       ├── schoola-logo-egypt.svg              # Light mode logo
│       └── schoola-logo-egypt-dark-transparent.svg  # Dark mode logo
├── assets/images/              # Source logo files (sync to public/ before deploy)
├── messages/
│   ├── ar.json                 # Arabic translations
│   └── en.json                 # English translations
└── types/                      # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-api-base-url/api/v1
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

---

## API

The app connects to a REST API at `NEXT_PUBLIC_API_URL`. Key endpoints:

| Endpoint | Description |
|---|---|
| `POST /customer/auth/login` | Login with phone + password |
| `POST /customer/auth/request-otp` | Request OTP for phone |
| `POST /customer/auth/verify-otp` | Verify OTP code |
| `GET /customer/schools` | List schools (max `per_page: 50`) |
| `GET /customer/catalog` | Products (requires `school_id` or `student_id`) |
| `GET /customer/products/:id` | Product detail |
| `GET /customer/cart` | Get cart |
| `POST /customer/orders` | Place order |
| `GET /customer/orders` | Order history |
| `GET /customer/students` | List students |

---

## Known Constraints

- Catalog API requires `school_id` or `student_id` — cannot browse all products without a filter
- Schools API max `per_page` is 50
- Product/school data is persisted to localStorage to survive page reloads

---

## Deployment

Designed for deployment on [Vercel](https://vercel.com). Set `NEXT_PUBLIC_API_URL` in Vercel environment variables.

After updating logo SVGs in `assets/images/`, copy them to `public/assets/images/` before deploying:

```bash
cp assets/images/*.svg public/assets/images/
```
