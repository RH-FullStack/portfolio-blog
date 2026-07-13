# Phase 1: Core Site & Design System - Pattern Map

**Mapped:** 2026-07-13
**Files analyzed:** 20
**Analogs found:** 0 / 20 (greenfield repository — no application code exists yet)

## Greenfield Notice

This repository contains only `.claude/`, `.planning/`, `.git/`, and `CLAUDE.md` — no `src/`, no `app/`, no prior components. There are **no existing codebase analogs** for any file in this phase. This document therefore maps each file to the **canonical pattern** already established in `.planning/phases/01-core-site-design-system/01-RESEARCH.md` (verified against official docs: Next.js, Tailwind v4, next-themes, Radix) rather than to a prior project file. Do not fabricate analog file paths — treat the RESEARCH.md code excerpts below as the source of truth for "what to copy."

Because this is the Walking Skeleton phase, the *first* file written in each role (e.g., the first UI primitive, the first static page) becomes the de facto analog for every subsequent file of that role within this same phase. Where noted below, later files in a role should copy the earlier sibling file once it exists, not re-derive the pattern from RESEARCH.md each time.

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|-----------------|---------------|
| `src/app/layout.tsx` | config/provider | request-response (SSR) | none (greenfield) | canonical-only (RESEARCH.md Pattern 1) |
| `src/app/globals.css` | config | build-time transform | none (greenfield) | canonical-only (RESEARCH.md Pattern 1 + Tailwind v4 docs) |
| `src/app/not-found.tsx` | route/component | request-response | none (greenfield) | canonical-only (RESEARCH.md Code Examples, Next.js official docs) |
| `src/app/(site)/layout.tsx` | component (layout shell) | request-response | none (greenfield) | canonical-only; becomes analog for nothing else (unique) |
| `src/app/(site)/page.tsx` | route (Server Component) | request-response | none (greenfield) | canonical-only; becomes analog for `about/page.tsx`, `contact/page.tsx`, `projects/page.tsx` |
| `src/app/(site)/about/page.tsx` | route (Server Component) | request-response | `src/app/(site)/page.tsx` (once written, same phase) | sibling-match |
| `src/app/(site)/contact/page.tsx` | route (Server Component) | request-response | `src/app/(site)/page.tsx` (once written, same phase) | sibling-match |
| `src/app/(site)/projects/page.tsx` | route (Server Component) | request-response, CRUD-read (static array) | `src/app/(site)/page.tsx` (once written, same phase) | sibling-match |
| `src/content/projects.ts` | model (typed static data) | CRUD-read (static) | none (greenfield) | canonical-only (RESEARCH.md Pattern 3) |
| `src/lib/site-config.ts` | config/model | CRUD-read (static) | none (greenfield) | canonical-only (RESEARCH.md Pattern 3) |
| `src/components/ui/Button.tsx` | component (UI primitive) | request-response (event handler) | none (greenfield) | canonical-only; becomes analog for `Card`, `Tag`, `Container`, `Prose` |
| `src/components/ui/Card.tsx` | component (UI primitive) | request-response | `src/components/ui/Button.tsx` (once written) | sibling-match |
| `src/components/ui/Tag.tsx` | component (UI primitive) | request-response | `src/components/ui/Button.tsx` (once written) | sibling-match |
| `src/components/ui/Container.tsx` | component (layout primitive) | request-response | `src/components/ui/Button.tsx` (once written) | sibling-match |
| `src/components/ui/Prose.tsx` | component (layout primitive) | request-response | `src/components/ui/Button.tsx` (once written) | sibling-match |
| `src/components/layout/Header.tsx` | component (layout) | request-response | none (greenfield) | canonical-only |
| `src/components/layout/Footer.tsx` | component (layout) | request-response | none (greenfield) | canonical-only |
| `src/components/layout/Nav.tsx` | component (layout) | request-response | none (greenfield) | canonical-only |
| `src/components/layout/MobileNav.tsx` | component (interactive, client) | event-driven | none (greenfield) | canonical-only (RESEARCH.md Pattern 2, Radix official docs) |
| `src/components/theme/ThemeProvider.tsx` | provider (client) | event-driven | none (greenfield) | canonical-only (RESEARCH.md Pattern 1, next-themes README) |
| `src/components/theme/ThemeToggle.tsx` | component (interactive, client) | event-driven | none (greenfield) | canonical-only (RESEARCH.md Code Examples, next-themes README) |

## Pattern Assignments

### `src/app/layout.tsx` (config/provider, request-response)

**Analog:** None in codebase. Canonical source: RESEARCH.md Pattern 1, cross-verified against `github.com/pacocoursey/next-themes` README and Next.js official Metadata API docs.

**Full pattern to copy** (from RESEARCH.md lines 170-197):
```tsx
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

**Non-negotiable details (Pitfall 1, Pitfall 4):**
- `suppressHydrationWarning` MUST be on `<html>` — omitting it causes a false-positive hydration warning because next-themes' blocking script mutates the DOM before React hydrates.
- Do NOT pass `disableTransitionOnChange` to `ThemeProvider` — this would kill D-13's required cross-fade.
- `metadataBase` MUST be set now even though full SEO work is Phase 3 (Pitfall 4) — backed by `NEXT_PUBLIC_SITE_URL` env var, default `http://localhost:3000`.

---

### `src/app/globals.css` (config, build-time transform)

**Analog:** None in codebase. Canonical source: RESEARCH.md Pattern 1, `tailwindcss.com/docs/dark-mode` and `tailwindcss.com/docs/theme`.

**Pattern to copy** (from RESEARCH.md lines 199-229):
```css
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

**Critical rule (Pitfall 3):** Both `prefers-reduced-motion` blocks are required together — the scoped transition (not `transition: all`, to avoid jank) plus the reduce-motion override. This satisfies DSGN-03's accessibility baseline for D-13's cross-fade requirement. No `tailwind.config.js` file should be created — v4 is CSS-first only.

---

### `src/app/not-found.tsx` (route/component, request-response)

**Analog:** None in codebase. Canonical source: RESEARCH.md Code Examples, `nextjs.org/docs/app/api-reference/file-conventions/not-found` (official).

**Full pattern to copy** (from RESEARCH.md lines 390-407):
```tsx
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

**Placement rule:** Must live at `src/app/not-found.tsx` (project root, outside the `(site)` route group) — root-level `not-found.tsx` auto-handles all unmatched routes app-wide since Next.js 13.3.0. Do not use the experimental `global-not-found.js` convention (not applicable — single root layout, no dynamic top-level segments).

---

### `src/content/projects.ts` and `src/lib/site-config.ts` (model, CRUD-read static)

**Analog:** None in codebase. Canonical source: RESEARCH.md Pattern 3.

**`content/projects.ts` pattern** (from RESEARCH.md lines 286-307):
```typescript
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

**`lib/site-config.ts` pattern** (from RESEARCH.md lines 310-327):
```typescript
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

**Rule:** No parsing library (`gray-matter`), no MDX, no Velite — plain typed TS objects imported directly into Server Components. This is the *only* correct data layer for Phase 1 (RESEARCH.md Anti-Patterns: "Introducing Velite/MDX in Phase 1" is explicitly forbidden this phase).

---

### `src/components/layout/MobileNav.tsx` (component, event-driven)

**Analog:** None in codebase. Canonical source: RESEARCH.md Pattern 2, `radix-ui.com/primitives/docs/components/dialog`.

**Full pattern to copy** (from RESEARCH.md lines 240-274):
```tsx
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

**Non-negotiable details (Pitfall 2, DSGN-03):**
- `Dialog.Title` is required (use `sr-only` if no visible heading is wanted) — Radix requires it for screen-reader announcement.
- Set explicit `z-index` utility classes on both sticky header and Dialog overlay/content (e.g., header `z-40`, overlay/content `z-50`) to avoid stacking conflicts — do not rely on default portal order.
- Do not hand-roll focus trap / Escape-to-close / focus-return — Radix provides all three; this is the one interactive element in Phase 1 that must NOT be hand-rolled (RESEARCH.md Don't Hand-Roll table).

---

### `src/components/theme/ThemeToggle.tsx` (component, event-driven)

**Analog:** None in codebase. Canonical source: RESEARCH.md Code Examples, `pacocoursey/next-themes` README.

**Full pattern to copy** (from RESEARCH.md lines 416-439):
```tsx
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

**Non-negotiable detail:** The `mounted` guard is required — `resolvedTheme` is `undefined` on the server, so rendering an icon before mount would itself cause a hydration mismatch on the icon (distinct from the `<html>` class mismatch that `suppressHydrationWarning` covers).

---

### `src/app/(site)/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `projects/page.tsx` (route, Server Components)

**Analog:** None in codebase for the first one written (likely `page.tsx` / Home). Once Home is built, it becomes the sibling analog for the other three pages in this same phase — copy its Server Component shape (default export, no `"use client"`, imports from `lib/site-config.ts` and/or `content/projects.ts`, wrapped in `components/ui/Container`).

**Canonical shape (no direct RESEARCH.md excerpt — synthesize from Architecture Patterns section + Anti-Patterns):**
- Server Component by default — do NOT add `"use client"` (Anti-Pattern: "Fetching/rendering content in Client Components").
- Import site data directly: `import { siteConfig } from '@/lib/site-config'` and/or `import { projects } from '@/content/projects'`.
- No `fs` reads, no async data fetching — static TS imports are resolved at build time.
- Every external link (social, project demo/code) rendered with `target="_blank"` MUST include `rel="noopener noreferrer"` (Security Domain — reverse tabnabbing mitigation). This should be baked into the shared `Button`/`Link` UI primitive so it's automatic, not per-instance.

---

### `src/components/ui/*` (Button, Card, Tag, Container, Prose)

**Analog:** None in codebase for `Button.tsx` (first UI primitive written). Once written, it becomes the sibling analog for `Card`, `Tag`, `Container`, `Prose` — same file shape (typed props, Tailwind utility classes only, no CSS-in-JS, no external UI kit).

**Rule from RESEARCH.md Don't Hand-Roll / Key Insight:** These five primitives are exactly the class of "simple enough to hand-roll" — do not reach for Radix or any UI kit here. Only `MobileNav` (Radix Dialog) and `ThemeToggle`/`ThemeProvider` (next-themes) are exceptions to hand-rolling in this phase.

## Shared Patterns

### FOUC-safe theme setup
**Source:** RESEARCH.md Pattern 1 (`app/layout.tsx` + `globals.css` excerpts above)
**Apply to:** `src/app/layout.tsx`, `src/app/globals.css`, `src/components/theme/ThemeProvider.tsx`, `src/components/theme/ThemeToggle.tsx`

### External link safety (`rel="noopener noreferrer"`)
**Source:** RESEARCH.md Security Domain, Known Threat Patterns table
**Apply to:** `src/components/ui/Button.tsx` (or wherever the shared `Link`/`Button` primitive lives), `src/content/projects.ts`-derived link rendering in `projects/page.tsx`, `src/lib/site-config.ts`-derived social links in `contact/page.tsx` and `Footer.tsx`
**Rule:** Bake `rel="noopener noreferrer"` into the shared primitive when `target="_blank"` is used — do not repeat per-instance.

### Reduced-motion accessibility
**Source:** RESEARCH.md Pattern 1 CSS block, Pitfall 3
**Apply to:** `src/app/globals.css` (global), any component with hover/transition micro-interactions (D-03) — Header, ThemeToggle, Card, Button

### Typed static data as single source of truth
**Source:** RESEARCH.md Pattern 3, Anti-Patterns ("Hardcoding site URL/social links in multiple files")
**Apply to:** `src/lib/site-config.ts` is the only place `siteUrl`, nav items, and social links are defined; `src/content/projects.ts` is the only place project data is defined. All components (`Header`, `Footer`, `Nav`, `MobileNav`, page files) import from these, never inline-duplicate.

### Server Component default, `"use client"` only for interactive leaves
**Source:** RESEARCH.md Anti-Patterns
**Apply to:** All `app/(site)/**/page.tsx` files stay Server Components. Only `ThemeToggle.tsx`, `ThemeProvider.tsx`, and `MobileNav.tsx` get `"use client"`.

## No Analog Found

Every file in this phase has no existing codebase analog (fully greenfield repository). All fall back to the canonical RESEARCH.md patterns documented above, which are themselves sourced from official Next.js, Tailwind v4, next-themes, and Radix documentation (see RESEARCH.md Sources section for citations). No file in this list should be treated as unguided — each has an explicit canonical excerpt above.

## Metadata

**Analog search scope:** Entire repository (`ls -la` at project root) — confirmed only `.claude/`, `.planning/`, `.git/`, `CLAUDE.md` exist; no `src/`, `app/`, `components/`, or `package.json` present yet.
**Files scanned:** 0 application source files (none exist)
**Pattern extraction date:** 2026-07-13
