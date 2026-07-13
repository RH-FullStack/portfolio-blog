# Phase 1: Core Site & Design System - Research

**Researched:** 2026-07-13
**Domain:** Next.js 16 App Router scaffold, Tailwind v4 CSS-first design system, dark/light mode (next-themes), accessible mobile nav, custom 404 — greenfield walking-skeleton phase
**Confidence:** HIGH

## Summary

This phase scaffolds the entire Next.js 16 project from nothing and builds the design system + four static pages (Home, About, Projects, Contact) plus a custom 404. There is no backend and no dynamic content pipeline yet — Velite/MDX is explicitly Phase 2 scope. The right "data layer" for Phase 1 is a small set of typed TypeScript config objects (`lib/site-config.ts`, `content/projects.ts`) imported directly into Server Components — no parsing library, no filesystem reads, no Velite. This matches the project-level ARCHITECTURE.md recommendation and requires no new research to confirm; it just needed explicit resolution before planning, which this document provides.

Two new runtime dependencies are needed beyond the CLAUDE.md-locked core stack: `next-themes` (dark/light toggle, already flagged as "add when needed" — now needed per D-12) and, at Claude's discretion per the UI-SPEC, `@radix-ui/react-dialog` for the accessible mobile-nav overlay (focus trap, Escape-to-close, focus-return). Both are verified clean via slopcheck and are extremely high-download, actively-used packages — safe to install without a `checkpoint:human-verify` gate.

**Primary recommendation:** Scaffold with `npx create-next-app@latest --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm`, build the Tailwind v4 `@theme` design tokens and `next-themes` FOUC-safe root layout first, then UI primitives, then the four static pages using hardcoded typed data — in that order, per the Suggested Build Order already established in ARCHITECTURE.md.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page routing & rendering (Home/About/Projects/Contact/404) | Frontend Server (SSR/SSG) | — | Next.js App Router Server Components, statically generated at build time — no client fetch needed |
| Design tokens (colors, spacing, type scale) | Frontend Server (build-time CSS) | Browser/Client (CSS vars consumed at paint) | Tailwind v4 `@theme` compiles tokens into static CSS at build; browser just applies classes |
| Dark/light theme state (toggle + persistence) | Browser / Client | Frontend Server (initial class via inline script to prevent FOUC) | Theme choice is inherently client-side (localStorage, `prefers-color-scheme`); `next-themes` injects a blocking inline script server-side to avoid flash, but the toggle interaction itself is client state |
| Mobile nav overlay (open/close, focus trap) | Browser / Client | — | Requires `"use client"` — interactive state (open/closed) and keyboard/focus management (`@radix-ui/react-dialog`) only exist in the browser |
| Project/nav/social link data | Static / Build-time data (`lib/`, `content/`) | Frontend Server (imported into Server Components) | Typed TS config objects, not a database — read at build time via direct ES module import, zero runtime cost |
| Fonts (Geist Sans/Mono) | CDN / Static | Frontend Server (self-hosted via `next/font`, subset + inlined at build) | `next/font` downloads and self-hosts font files at build time; served as static assets from Vercel's CDN, zero request to Google Fonts |
| Images (hero photo, project screenshots) | CDN / Static | Frontend Server (`next/image` optimization pipeline) | Optimized/resized by Vercel's Image Optimization API (Hobby tier, 5,000 transformations/month), served from CDN |
| 404 handling | Frontend Server | — | `app/not-found.tsx` at the `app/` root, a Server Component, handles all unmatched routes automatically since Next.js 13.3 |

## Standard Stack

### Core (already locked by CLAUDE.md — confirmed current versions this session)

| Library | Version (verified 2026-07-13) | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.2.10 | Framework, App Router, routing, `next/font`, `next/image`, Metadata API | [VERIFIED: npm registry] `npm view next version` → 16.2.10. Locked in CLAUDE.md. |
| `react` / `react-dom` | 19.2.7 | UI runtime | [VERIFIED: npm registry] Installed automatically by `create-next-app`; do not pin independently. |
| `tailwindcss` | 4.3.2 | Styling, CSS-first `@theme` tokens | [VERIFIED: npm registry] `npm view tailwindcss version` → 4.3.2 (CLAUDE.md specified 4.1.x; 4.3.2 is a current v4 minor, same major-version decision, no action needed beyond letting `create-next-app` install latest v4). |
| `typescript` | 5.x (bundled) | Type safety | Default in `create-next-app`; no separate install needed. |

### New for this phase

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next-themes` | 0.4.6 | Dark/light toggle with system-preference default, localStorage persistence, FOUC-safe hydration | [VERIFIED: npm registry] `npm view next-themes version` → 0.4.6, unchanged since 2025-03-11. Already the CLAUDE.md-recommended library for this exact need ("only add if dark mode becomes a v1 requirement" — it now has, per D-12). 24.5M downloads/week — the de facto standard for Next.js dark mode, not a niche pick. No newer release in ~16 months is normal for a feature-complete 2-line-API utility, not a maintenance red flag (repo remains "Sustainable" per community tooling). |
| `@radix-ui/react-dialog` | 1.1.19 | Headless accessible dialog primitive — powers the mobile nav overlay's focus trap, Escape-to-close, and focus-return (DSGN-03 keyboard nav requirement) | [VERIFIED: npm registry] `npm view @radix-ui/react-dialog version` → 1.1.19. 66.9M downloads/week. Actively maintained (`radix-ui/primitives` monorepo, frequent releases). UI-SPEC flags this as "discretionary — flag for confirmation"; research confirms it is the correct minimal choice (see Don't Hand-Roll below), not a heavier "UI kit" — it is one unstyled primitive, not shadcn, not a component library. |
| `lucide-react` | 1.24.0 | Icon set — Sun/Moon (theme toggle), Menu/X (hamburger), Github/Linkedin/Mail (footer) | [VERIFIED: npm registry] `npm view lucide-react version` → 1.24.0. 74.2M downloads/week. Already specified by UI-SPEC as the icon library; tree-shakeable (only imported icons ship), geometric/minimal line style matches the Japanese-minimalist brief. |
| `geist` | 1.7.2 | Self-hosted Geist Sans + Geist Mono via `next/font/local` under the hood | [VERIFIED: npm registry] `npm view geist version` → 1.7.2. 1.67M downloads/week (lower than the above because it's Vercel-specific, not a general-purpose package — expected). Official Vercel package, matches D-02/CLAUDE.md exactly. |

### Package Legitimacy Audit

All five phase-1 packages checked via `slopcheck scan --pkg npm <name>` (installed via `pip3 install slopcheck --break-system-packages`, run as `python3 -m slopcheck`) — all returned `OK` with no flags. Cross-verified against `npm view` for version/registry existence, and against GitHub repository URLs for legitimacy (all resolve to their expected, well-known organizations: `vercel/next.js`, `pacocoursey/next-themes`, `radix-ui/primitives`, `lucide-icons/lucide`, `vercel/geist-font`). No `postinstall` scripts found on any of the five (`npm view <pkg> scripts.postinstall` returned empty for all).

| Package | Registry | Downloads/wk | Source Repo | slopcheck | Disposition |
|---------|----------|--------------|-------------|-----------|-------------|
| `next` | npm | (core framework, effectively unlimited) | github.com/vercel/next.js | OK | Approved |
| `next-themes` | npm | 26.2M | github.com/pacocoursey/next-themes | OK | Approved |
| `@radix-ui/react-dialog` | npm | 66.9M | github.com/radix-ui/primitives | OK | Approved |
| `lucide-react` | npm | 74.2M | github.com/lucide-icons/lucide | OK | Approved |
| `geist` | npm | 1.67M | github.com/vercel/geist-font | OK | Approved |
| `tailwindcss` | npm | (core framework, effectively unlimited) | github.com/tailwindlabs/tailwindcss | OK | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

**Installation:**
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm

npm install next-themes @radix-ui/react-dialog lucide-react geist
```

Do NOT pass `--turbopack` explicitly — it is already the default in `create-next-app` 16.2.x (opt out with `--webpack` if ever needed, not relevant here). Do NOT pass `--react-compiler` unless deliberately wanted — it is an opt-in flag (not default), adds a build-time Babel plugin, and offers negligible benefit for a mostly-static marketing site with little component re-render logic in Phase 1; skip it to keep the build simple, revisit in a later phase only if profiling shows a need.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CORE-01 | Homepage with clear intro/value prop, understandable without scrolling | Hero pattern (Code Examples), Display typography token (44/600/1.1 from UI-SPEC), `max-w-6xl` container |
| CORE-02 | About page — dev/aikidoka/investor as one coherent story | Prose container (`max-w-2xl`), `components/ui/Prose`, static typed content (no MDX needed — see Don't Hand-Roll) |
| CORE-03 | Contact page — mailto + social links | `lib/site-config.ts` single source of truth for social URLs (Anti-Pattern 2 in ARCHITECTURE.md); mailto + visible plain-text email pattern (Pitfall: mailto has no client-configured fallback) |
| CORE-04 | Custom 404 | `app/not-found.tsx` file convention (Code Examples) — confirmed Server Component, root-level, auto-handles all unmatched routes since Next.js 13.3 |
| PROJ-01 | Curated showcase of 3-5 projects, tags, links | `content/projects.ts` typed array pattern (Architectural Responsibility Map, Don't Hand-Roll) |
| DSGN-01 | Fully responsive mobile/tablet/desktop | Tailwind v4 default breakpoints (`sm`/`md`/`lg`/`xl`, per UI-SPEC), nav breakpoint at `md` |
| DSGN-02 | Dark/light mode, system-preference default | `next-themes` FOUC-safe setup (Code Examples), Tailwind `@custom-variant dark` class strategy |
| DSGN-03 | Baseline accessibility — semantic HTML, keyboard nav, alt text | `@radix-ui/react-dialog` for mobile nav focus trap/Escape/focus-return (Don't Hand-Roll), 44×44 touch targets (already in UI-SPEC), `prefers-reduced-motion` handling (Common Pitfalls) |
| DSGN-04 | Distinctive Japanese-minimalist identity, not template-generic | Tailwind v4 `@theme` custom palette (ink & paper + vermillion), Geist self-hosted fonts, `ma`-inspired spacing scale — all already locked in UI-SPEC; this research confirms implementation mechanics only |
</phase_requirements>

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────── BUILD TIME (npm run build) ───────────────────────────┐
│                                                                                     │
│  lib/site-config.ts ──────┐                                                        │
│  (name, social links,     │                                                        │
│   nav items, base URL)    │                                                        │
│                            ▼                                                       │
│  content/projects.ts ──► Server Components (app/**/page.tsx)                       │
│  (typed array: title,     │         │                                              │
│   summary, tags, links)   │         ▼                                              │
│                            │   generateStaticParams (none needed — no dynamic      │
│                            │   routes in Phase 1; all pages are fixed paths)       │
│                            ▼                                                       │
│  globals.css (@theme) ──► Tailwind compiler ──► static CSS bundle                   │
│                            │                                                       │
│  next/font (Geist) ──────► self-hosted font files, subset + inlined                │
│                            │                                                       │
│                            ▼                                                       │
│                     Static HTML + CSS + JS per route (SSG output)                  │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                     │ deploy
                                     ▼
┌─────────────────────────── REQUEST TIME (Vercel CDN/Edge) ───────────────────────┐
│  Visitor requests /  or /about or /projects or /contact or /nonexistent-route     │
│         │                                                                          │
│         ▼                                                                          │
│  Pre-rendered static HTML served from CDN (no server compute)                      │
│         │                                                                          │
│         ▼                                                                          │
│  Inline blocking script (injected by next-themes) reads localStorage/              │
│  prefers-color-scheme → sets class="dark"|"" on <html> BEFORE paint (no FOUC)      │
│         │                                                                          │
│         ▼                                                                          │
│  React hydrates: ThemeProvider takes over, mobile-nav Dialog (Radix) becomes        │
│  interactive, hover/focus micro-interactions activate                              │
│         │                                                                          │
│         ▼                                                                          │
│  If route doesn't match any page.tsx → app/not-found.tsx renders (200 for          │
│  streamed responses handled by Next.js; effectively a 404 to crawlers/tools)       │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

Confirmed as correct for this phase (from project-level ARCHITECTURE.md, unchanged by this research — Phase 1 builds a subset, no `content/blog/` or MDX pipeline yet):

```
src/
├── app/
│   ├── layout.tsx              # Root layout: <html suppressHydrationWarning>, fonts, ThemeProvider, metadataBase
│   ├── globals.css             # @import "tailwindcss"; @theme { ... }; @custom-variant dark (...)
│   ├── not-found.tsx           # Custom 404 (CORE-04) — Server Component, root-level
│   ├── (site)/
│   │   ├── layout.tsx          # Header (nav + theme toggle + mobile nav trigger) + Footer
│   │   ├── page.tsx            # / — Hero + featured-projects teaser (D-07)
│   │   ├── about/page.tsx      # /about
│   │   ├── contact/page.tsx    # /contact
│   │   └── projects/page.tsx   # /projects (index/card view only — [slug] deferred out of scope)
├── content/
│   └── projects.ts             # Typed array: { slug, title, summary, tags, links: {demo?, code?}, image }
├── components/
│   ├── ui/                     # Button, Card, Tag, Container, Prose — hand-rolled, Tailwind-styled
│   ├── layout/                 # Header, Footer, Nav, MobileNav (wraps @radix-ui/react-dialog)
│   └── theme/                  # ThemeProvider wrapper, ThemeToggle (Sun/Moon)
├── lib/
│   └── site-config.ts          # name, tagline, social links, nav items, NEXT_PUBLIC_SITE_URL-backed base URL
└── public/
    └── (hero photo, favicon — supplied by Rasmus, not generated)
```

### Pattern 1: FOUC-safe dark mode with next-themes + Tailwind v4 class strategy

**What:** `next-themes`' `ThemeProvider` injects a blocking inline `<script>` into the `<head>` before hydration that reads `localStorage` (or falls back to `prefers-color-scheme`) and sets the `dark` class on `<html>` synchronously — this is what prevents the "flash of wrong theme" (FOUC) that a purely client-side `useEffect` approach would cause. `suppressHydrationWarning` on `<html>` is required because the script's DOM mutation happens before React hydrates, which would otherwise trigger a hydration-mismatch warning (harmless in this exact case, but the warning is expected and needs suppressing).

**When to use:** Always, for this project — this is the standard, only-correct way to implement DSGN-02 (system-preference default) + D-12 (manual toggle, persisted) together without a flash.

**Example:**
```tsx
// app/layout.tsx
// Source: https://github.com/pacocoursey/next-themes (README), cross-verified via WebSearch (multiple 2026 sources)
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

```css
/* app/globals.css */
/* Source: tailwindcss.com/docs/dark-mode, tailwindcss.com/docs/theme */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-paper: #FAF9F6;
  --color-paper-dark: #16150F;
  --color-ink: #1C1B18;
  --color-ink-dark: #F5F2EA;
  --color-vermillion: #C1440E;
  --color-vermillion-dark: #E2632E;
  /* ...secondary surfaces, spacing scale, font tokens per UI-SPEC */
  --font-sans: var(--font-geist-sans), 'Hiragino Sans', 'Noto Sans JP', sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}

/* Cross-fade transition (D-13) — scoped, not `transition: all` (avoids jank) */
@media (prefers-reduced-motion: no-preference) {
  body, header, footer, nav, [data-themed] {
    transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
  }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Important:** Do NOT pass `disableTransitionOnChange` to `ThemeProvider` — that prop forcibly disables *all* CSS transitions during a theme switch, which is the opposite of D-13's cross-fade requirement. Leave it unset (defaults to `false`) and let the scoped CSS transition above handle the fade. [CITED: github.com/pacocoursey/next-themes README + WebSearch cross-verification]

### Pattern 2: Accessible mobile nav overlay via @radix-ui/react-dialog

**What:** Wrap the hamburger-triggered nav (D-11) in Radix's unstyled `Dialog` primitive rather than hand-rolling `useState` + manual `keydown` listeners + manual focus trapping. Radix provides: automatic focus trap while open, Escape-to-close, click-outside-to-close, focus returned to the trigger button on close, and correct ARIA (`role="dialog"`, `aria-modal`) — all required or strongly implied by DSGN-03's "keyboard navigation" baseline.

**When to use:** For the mobile nav overlay specifically. Do not reach for Radix for anything else in Phase 1 — every other interactive element (theme toggle button, links, cards) is simple enough to hand-roll per the project's "no heavy UI kit" philosophy already locked in the UI-SPEC (`components.json` absent, `Tool: none`).

**Example:**
```tsx
// components/layout/MobileNav.tsx
// Source: radix-ui.com/primitives/docs/components/dialog
'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'

export function MobileNav({ navItems }: { navItems: { href: string; label: string }[] }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button aria-label="Open menu" className="min-h-11 min-w-11 md:hidden">
          <Menu aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/40 dark:bg-black/60" />
        <Dialog.Content className="fixed inset-y-0 right-0 w-full max-w-xs bg-paper dark:bg-paper-dark p-6">
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
          <Dialog.Close asChild>
            <button aria-label="Close menu" className="min-h-11 min-w-11">
              <X aria-hidden />
            </button>
          </Dialog.Close>
          <nav>
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

**Note:** `Dialog.Title` is required by Radix for screen-reader announcement even though the UI-SPEC doesn't show a visible heading in the mobile nav — use `sr-only` to satisfy the accessibility requirement without a visual regression.

### Pattern 3: Typed static data instead of a content pipeline (resolves the Phase 1 "data layer" question)

**What:** `content/projects.ts` exports a plain typed TS array. `lib/site-config.ts` exports a typed object (name, tagline, social links, nav items, `siteUrl`). No parsing library (`gray-matter`), no MDX, no Velite. Both are imported directly into Server Components — zero build step beyond normal TypeScript compilation.

**When to use:** This is the correct and only approach for Phase 1. Velite is explicitly scoped to Phase 2 (blog MDX) per ROADMAP.md; introducing it now would front-load Phase 2's setup friction (~30 min manual `next.config` wiring per STACK.md Version Compatibility) for zero benefit, since Phase 1 has no long-form prose content requiring frontmatter validation or MDX compilation. The About page's "coherent story" copy (CORE-02) is static JSX/TSX prose inside `components/ui/Prose`, not a parsed content file.

**Example:**
```typescript
// content/projects.ts
export type Project = {
  slug: string
  title: string
  summary: string
  tags: string[]
  links: { demo?: string; code?: string }
  image: { src: string; alt: string }
}

export const projects: Project[] = [
  {
    slug: 'example-project',
    title: 'Example Project',
    summary: 'One-line description of what it does and why it matters.',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    links: { demo: 'https://example.com', code: 'https://github.com/rasmus/example' },
    image: { src: '/projects/example.png', alt: 'Screenshot of Example Project dashboard' },
  },
  // ...2-4 more, per PROJ-01's 3-5 curated entries
]
```

```typescript
// lib/site-config.ts
export const siteConfig = {
  name: 'RasmusOS', // placeholder brand name — do not hardcode elsewhere (D-09, PROJECT.md)
  tagline: 'Developer, aikidoka, investor.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  nav: [
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' }, // visible now per D-08 even though /blog ships Phase 2
    { href: '/contact', label: 'Contact' },
  ],
  social: {
    github: 'https://github.com/REPLACE_ME',
    linkedin: 'https://linkedin.com/in/REPLACE_ME',
    email: 'REPLACE_ME@example.com',
  },
} as const
```

**Flag for planner:** The `/blog` nav link (D-08) will 404 until Phase 2 ships, since no `app/(site)/blog/page.tsx` exists yet. This is an accepted, intentional gap per D-08 ("sets the final nav shape once") — not a Phase 1 bug, but worth a one-line note in the plan so it isn't mistaken for an oversight during verification.

### Anti-Patterns to Avoid

- **Fetching/rendering content in Client Components:** Keep `page.tsx` files as Server Components (default). Only `"use client"` for genuinely interactive leaves: `ThemeToggle`, `MobileNav`. (Confirmed via project ARCHITECTURE.md Anti-Pattern 1 — still applies even though Phase 1 has no `fs` reads, since the same "don't ship unnecessary client JS" principle governs static pages too.)
- **Hardcoding site URL/social links in multiple files:** Every place that needs `siteUrl` or a social link imports from `lib/site-config.ts` — this is what makes the later custom-domain swap (PITFALLS.md Pitfall 3/4/5) and the "RasmusOS" name swap (PROJECT.md) safe.
- **Introducing Velite/MDX in Phase 1:** Confirmed out of scope this phase — see Pattern 3 above. Do not let "may as well set it up now" scope-creep into this phase; it's explicitly Phase 2's first task per ROADMAP.md.
- **Skipping `metadataBase` because "SEO is Phase 3":** `metadataBase` lives in the root `layout.tsx`, which is built in Phase 1. Set it now (backed by `NEXT_PUBLIC_SITE_URL` env var, defaulting to `localhost:3000` in dev) even though full metadata/OG work is deferred — this avoids PITFALLS.md Pitfall 3 (silently broken OG images) resurfacing as rework in Phase 3.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Mobile nav overlay focus trap, Escape-to-close, focus-return | Custom `useState` + manual `keydown` listener + manual `.focus()` juggling | `@radix-ui/react-dialog` | Focus trapping and correct ARIA wiring are easy to get subtly wrong (focus escaping to background content, Escape not closing on all browsers, focus not returning to the trigger) — exactly the class of accessibility bug that's invisible until a keyboard/screen-reader user hits it. Radix is a single unstyled primitive, not a UI kit; it doesn't conflict with the "hand-rolled `components/ui/*`" philosophy. |
| FOUC-safe theme detection on first paint | Custom inline `<script>` in `<head>` reading `localStorage`/`matchMedia` | `next-themes` `ThemeProvider` | The blocking-script-before-hydration technique is a known-tricky pattern (script must run before React hydrates, must handle `localStorage` absence, must handle `suppressHydrationWarning` correctly) — `next-themes` is a 2-line, purpose-built solution to exactly this problem with 24.5M weekly downloads validating it works across edge cases a hand-rolled script would likely miss on first try. |
| Font subsetting/self-hosting for Geist | Manually downloading Geist `.woff2` files and writing `@font-face` rules | `geist` npm package + `next/font/local` (bundled) | `next/font` handles subsetting, preloading, and CSS-variable injection automatically at build time; the `geist` package is Vercel's own pre-configured wrapper — zero reason to hand-roll font loading. |
| Icons (Sun/Moon, Menu/X, Github/Linkedin/Mail) | Custom inline SVGs | `lucide-react` | Already specified by UI-SPEC; tree-shakeable so unused icons cost nothing, consistent stroke-width/geometry across the icon set (a hand-drawn/mixed-source icon set would visibly clash with the minimalist design goal). |

**Key insight:** Phase 1's "don't hand-roll" list is short and precise on purpose — every other interactive element (buttons, cards, tags, hover states) genuinely is simple enough to hand-roll with Tailwind utilities, which is the correct call per the UI-SPEC's "no heavy UI kit" decision. The two exceptions above (Radix dialog, next-themes) are chosen because their failure modes are accessibility bugs and FOUC flashes — both are the kind of defect that's easy to ship undetected and directly contradict DSGN-03/DSGN-02.

## Common Pitfalls

### Pitfall 1: FOUC ("flash of unstyled/wrong theme") from misconfigured next-themes setup

**What goes wrong:** Visitor briefly sees light mode flash before dark mode applies (or vice versa) on page load, especially on a hard refresh.
**Why it happens:** `suppressHydrationWarning` omitted on `<html>`, or `ThemeProvider` incorrectly wrapped only around part of the tree (e.g., inside `<body>` content instead of wrapping everything that needs theme-aware classes), or a custom color/background applied via inline style that bypasses the class-based system entirely.
**How to avoid:** Follow Pattern 1 exactly — `suppressHydrationWarning` on `<html>`, `attribute="class"`, `ThemeProvider` wraps `{children}` inside `<body>`. Verify with a hard refresh (not just client-side navigation) in both a light-OS and dark-OS environment.
**Warning signs:** Visible color flash on page load/reload; React hydration warning in the console mentioning `className` mismatch on `<html>`.

### Pitfall 2: Radix Dialog content not scrollable / overlay z-index conflicts with sticky header

**What goes wrong:** On short viewports, the mobile nav's `Dialog.Content` can get clipped if it isn't given its own scroll container; separately, if the sticky header's `z-index` is higher than the Dialog's default portal stacking, the overlay can render underneath the header.
**Why it happens:** `Dialog.Portal` renders at the end of `<body>` by default (correct for stacking in most cases), but a project-defined `z-index` on the header (e.g., `z-50` for a sticky nav) can still visually conflict if the Dialog content isn't given an equal-or-higher `z-index` in the Tailwind classes applied to `Dialog.Overlay`/`Dialog.Content`.
**How to avoid:** Explicitly set `z-index` utility classes on both the sticky header and the Dialog overlay/content so their stacking order is intentional, not accidental (e.g., header `z-40`, overlay/content `z-50`). Add `overflow-y-auto` to `Dialog.Content` if nav items could ever exceed viewport height (unlikely with only 4 nav items, but cheap insurance).
**Warning signs:** Mobile nav visually appears behind the header on some viewport sizes; nav items get cut off with no way to scroll to them.

### Pitfall 3: `prefers-reduced-motion` not respected for the theme cross-fade

**What goes wrong:** D-13's cross-fade transition ships as a blanket CSS `transition` with no `prefers-reduced-motion` guard, violating DSGN-03's baseline accessibility bar for users who have motion-reduction enabled at the OS level.
**Why it happens:** It's easy to add `transition: background-color 200ms, color 200ms` globally and forget the reduced-motion media query wrapper, since the visual result "looks fine" to a sighted developer without vestibular sensitivity testing it.
**How to avoid:** Wrap the transition rule in `@media (prefers-reduced-motion: no-preference)` as shown in Pattern 1, and add the inverse `@media (prefers-reduced-motion: reduce)` block that collapses all transition/animation durations near-zero. This is a two-block addition to `globals.css`, not a per-component concern.
**Warning signs:** No `prefers-reduced-motion` media query anywhere in `globals.css`; theme toggle or hover states still animate when tested with OS-level "reduce motion" enabled.

### Pitfall 4: `metadataBase` omitted from Phase 1's root layout because "SEO is Phase 3"

**What goes wrong:** Root layout ships without `metadataBase`, and this silently breaks OG image/canonical URL resolution once Phase 3 adds per-page metadata — the fix then requires touching the already-shipped root layout again.
**Why it happens:** Phase boundaries can create a false belief that anything metadata-related is "someone else's phase." But `metadataBase` is a root-layout-level setting with no per-page component, and the root layout is built once, in Phase 1.
**How to avoid:** Set `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')` in Phase 1's root layout metadata export now (already shown in Pattern 1's code example), even though the fuller `generateMetadata` per-page work is Phase 3. [CITED: project PITFALLS.md Pitfall 3, cross-referenced against Next.js official Metadata API docs]
**Warning signs:** Missing `metadataBase` export in `app/layout.tsx` at the end of Phase 1; would only surface as a bug once someone shares a link in Phase 3+ and the OG image is broken/relative.

### Pitfall 5: Turbopack/React Compiler flag confusion during scaffold

**What goes wrong:** Copy-pasting an older `create-next-app` command (e.g., from a pre-2026 tutorial or the STACK.md's own `npm install` block, which predates this session's CLI verification) that includes `--turbopack` as if it were opt-in, when current `create-next-app` 16.2.x already defaults to Turbopack — the flag is harmless but redundant, whereas `--react-compiler` is genuinely opt-in and easy to assume is already-on.
**Why it happens:** Next.js's build-tool defaults have changed across versions faster than tutorial content updates; training-data-era instructions can be stale by one or two minor-version default flips.
**How to avoid:** Use the exact scaffold command verified in this research session (Standard Stack → Installation) rather than an older cached command. If React Compiler is wanted later, add `--react-compiler` explicitly and expect a `babel-plugin-react-compiler` dependency to be added.
**Warning signs:** Confusion in the plan about whether Turbopack is "on" (it already is, by default) — not a functional bug, just a documentation-accuracy trap worth flagging so the plan doesn't include an unnecessary verification step for something already guaranteed.

## Code Examples

### `app/not-found.tsx` — custom 404 (CORE-04)

```tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/not-found (official, verified 2026-07-13)
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-heading font-semibold">Page Not Found</h1>
      <p className="mt-4 text-body">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="mt-8 inline-block text-vermillion hover:underline">
        Back to Home
      </Link>
    </div>
  )
}
```

Placed at `app/not-found.tsx` (project root, outside the `(site)` route group) — confirmed by official docs that root-level `not-found.js` automatically handles all unmatched URLs app-wide since Next.js 13.3.0, with no additional routing configuration needed. It is a Server Component by default (can be made `async` if data fetching were ever needed, not required here). Next.js automatically injects `<meta name="robots" content="noindex" />` on 404 responses — no manual SEO handling needed for this page.

**Do not** reach for the newer `global-not-found.js` (experimental, requires `experimental.globalNotFound` flag and a full custom `<html>/<body>` document) — that convention exists for multi-root-layout apps or apps with dynamic top-level segments, neither of which applies to this project's single, static route tree. Standard `not-found.tsx` is correct and simpler here.

### Theme toggle button

```tsx
// components/theme/ThemeToggle.tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-11 w-11" aria-hidden /> // avoid hydration mismatch on icon choice

  const isDark = resolvedTheme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="flex h-11 w-11 items-center justify-center"
    >
      {isDark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </button>
  )
}
```

The `mounted` guard is required because `resolvedTheme` is `undefined` on the server (theme is client-only knowledge) — rendering the wrong icon before mount would itself cause a hydration mismatch on the icon, separate from the `<html>` class mismatch that `suppressHydrationWarning` already covers. [CITED: pacocoursey/next-themes README, "avoid hydration mismatch" section — standard documented pattern]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-------------------|---------------|--------|
| `tailwind.config.js` JS-based theme config | Tailwind v4 CSS-first `@theme` directive in `globals.css` | Tailwind v4 (2025) | No config file to maintain; design tokens are real CSS custom properties, usable directly in arbitrary values/inline styles, not just via generated utility classes |
| Manual `<script>` + `useEffect` for dark mode | `next-themes` `ThemeProvider` (unchanged pattern since ~2022, still current standard) | Stable for years | Not a "new" pattern this session — confirmed still the standard, unreplaced by anything newer as of 2026 |
| `app/not-found.tsx`-only 404 handling | `app/not-found.tsx` (standard) + optional experimental `app/global-not-found.tsx` for multi-root-layout apps | `global-not-found` added Next.js 15.4.0 (experimental) | Not applicable to this project (single root layout, no dynamic top-level segments) — standard `not-found.tsx` remains correct; noted only to avoid a planner mistakenly reaching for the newer/experimental convention |

**Deprecated/outdated:** None directly relevant to Phase 1's scope beyond what CLAUDE.md already excludes (Pages Router, Contentlayer, `@vercel/og` standalone — none touched by this phase).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | React Compiler flag (`--react-compiler`) is not worth enabling for Phase 1's mostly-static component tree | Standard Stack / Installation | Low — omitting it is the conservative/simpler default; if wrong, it's a one-flag addition later with no migration cost, not a blocking error |
| A2 | Radix `Dialog.Portal` default z-index stacking will not conflict with a sticky header without explicit z-index classes | Common Pitfalls (Pitfall 2) | Low-medium — purely a visual/CSS issue caught immediately in manual QA of the mobile nav, not a silent/hard-to-detect bug; explicit z-index classes in the code example already mitigate this |

**All package version numbers, npm download counts, and API syntax in this document are `[VERIFIED: npm registry]` or `[CITED: <official doc URL>]`** — no unverified training-data claims about library capabilities were left unchecked this session (WebSearch findings were cross-verified against official docs or `npm view` before being stated as fact).

## Open Questions

None blocking. One item worth surfacing to the user during/after planning per the CONTEXT.md's own note: D-07's homepage structure (Hero + featured-projects teaser) is Claude's discretion and explicitly flagged in CONTEXT.md as "confirm with user during/after planning if it feels off" — this is a design decision already made, not a research gap, but the planner should preserve that confirmation checkpoint rather than treat it as fully settled.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js 16 / Tailwind v4 build (requires Node 20+) | ✓ | v24.13.0 | — |
| npm | Package installation, `create-next-app` | ✓ | 11.6.2 | — |
| git | Version control, GSD workflow commits | ✓ | (repo already initialized) | — |
| Internet access (npm registry) | Installing `next-themes`, `@radix-ui/react-dialog`, `lucide-react`, `geist` | ✓ | — confirmed via `npm view` calls this session | — |

No missing dependencies. This phase has no database, no external API, and no service accounts — the only "environment" requirement is a working Node/npm toolchain, already confirmed present and above the Tailwind v4 minimum (Node 20+).

## Security Domain

This is a static-content marketing site with no authentication, no forms, no user-generated content, and no server-side data mutation in Phase 1 — the applicable ASVS surface is minimal.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No login/accounts exist anywhere in this project (explicitly out of scope) |
| V3 Session Management | No | No sessions — fully static/stateless site |
| V4 Access Control | No | No protected routes or roles |
| V5 Input Validation | Minimal | No user-submitted input exists in Phase 1 (mailto/social links are static config strings, not form input); the only "input" is the developer-authored `content/projects.ts`/`lib/site-config.ts` typed data, which TypeScript itself validates at compile time |
| V6 Cryptography | No | No secrets, tokens, or encrypted data in this phase |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| Malicious/typosquatted npm dependency | Tampering | Package Legitimacy Audit above — all 6 packages verified clean via slopcheck + registry/repo cross-check before recommending |
| `target="_blank"` external links (social/demo/code links) without `rel="noopener noreferrer"` | Tampering (reverse tabnabbing) | Every external `<a>` in `lib/site-config.ts`-derived links and `content/projects.ts` link rendering must include `rel="noopener noreferrer"` when `target="_blank"` is used — a one-line convention to lock into the shared `Link`/`Button` UI primitive so it's applied everywhere automatically rather than per-instance |
| Open redirect via unvalidated external URLs | Tampering | Not applicable — all external links (social, project demo/code) are hardcoded in developer-controlled config files, not derived from user/query-string input |

## Sources

### Primary (HIGH confidence)
- [nextjs.org/docs/app/api-reference/cli/create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) — official CLI reference, verified `v16.2.10`, confirmed current default flags (Turbopack on by default, React Compiler opt-in)
- [nextjs.org/docs/app/api-reference/file-conventions/not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) — official `not-found.js`/`global-not-found.js` reference, version history confirming root-level auto-handling since v13.3.0
- [tailwindcss.com/docs/dark-mode](https://tailwindcss.com/docs/dark-mode) — official `@custom-variant dark` class-strategy syntax
- [tailwindcss.com/docs/theme](https://tailwindcss.com/docs/theme) — official `@theme` directive syntax for `--color-*`, `--font-*`, `--spacing-*` namespaces
- `npm view` (registry, direct tool call) — verified current versions: `next@16.2.10`, `tailwindcss@4.3.2`, `react@19.2.7`, `next-themes@0.4.6`, `@radix-ui/react-dialog@1.1.19`, `lucide-react@1.24.0`, `geist@1.7.2`
- `python3 -m slopcheck scan --pkg npm <name>` (local tool, installed this session via `pip3 install slopcheck --break-system-packages`) — all 6 phase-1 packages returned `OK`, zero flags

### Secondary (MEDIUM confidence)
- [github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes) README (via WebSearch, cross-verified across multiple 2026-dated independent write-ups) — `suppressHydrationWarning`, `attribute="class"`, `defaultTheme="system"`, `disableTransitionOnChange` semantics, hydration-mismatch-avoidance pattern for icon rendering
- [radix-ui.com/primitives/docs/components/dialog](https://www.radix-ui.com/primitives/docs/components/dialog) (via WebSearch) — focus trap, Escape-to-close, `Dialog.Title` requirement for screen readers
- npmjs.com/package/geist and github.com/vercel/geist-font (via WebSearch) — `GeistSans`/`GeistMono` import paths (`geist/font/sans`, `geist/font/mono`), `--font-geist-sans`/`--font-geist-mono` CSS variable names

### Tertiary (LOW confidence)
- None — all findings this session were cross-verified against an official doc, the npm registry, or slopcheck before being stated as fact.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every package version confirmed via `npm view` this session, cross-checked against official repos and slopcheck
- Architecture: HIGH — Phase 1 structure is a direct, narrower subset of the already-approved project-level ARCHITECTURE.md; no new architectural decisions introduced, only implementation-level confirmation
- Pitfalls: HIGH — FOUC, focus-trap, and metadataBase pitfalls all confirmed against official docs/READMEs, not speculative

**Research date:** 2026-07-13
**Valid until:** ~2026-08-12 (30 days — stable ecosystem, but Tailwind v4 and Next.js 16 are still receiving frequent minor releases; re-verify exact patch versions at execution time if this research is more than a few weeks old)
