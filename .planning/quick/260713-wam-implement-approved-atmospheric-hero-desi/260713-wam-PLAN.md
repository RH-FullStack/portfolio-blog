---
phase: quick
plan: 260713-wam
type: execute
wave: 1
depends_on: []
files_modified:
  - public/Background.jpg
  - src/app/(site)/page.tsx
autonomous: true
requirements: [ATMOS-HERO]
must_haves:
  truths:
    - "Homepage hero renders Background.jpg full-bleed behind centered hero content"
    - "A dark gradient overlay dims the photo so light hero text meets WCAG AA contrast"
    - "Hero name/tagline/supporting text render in the light palette, identical in light and dark mode"
    - "The nav, the Featured Projects teaser, and the Latest Writing teaser are visually unchanged"
    - "public/Background.jpg is ≤500 KB on disk and committed to git"
  artifacts:
    - path: "public/Background.jpg"
      provides: "Downscaled hero background image (≤2000px long edge, ≤500 KB)"
    - path: "src/app/(site)/page.tsx"
      provides: "Full-bleed atmospheric hero section with overlay and light text"
      contains: "priority"
    - path: "images/Background-original.jpg"
      provides: "Preserved full-resolution original, outside public/ (not committed)"
  key_links:
    - from: "src/app/(site)/page.tsx"
      to: "public/Background.jpg"
      via: "next/image fill priority object-cover alt=\"\""
      pattern: "Background\\.jpg"
    - from: "hero content"
      to: "gradient overlay"
      via: "absolute overlay layered between fill Image and Container"
      pattern: "rgba\\(22,21,15"
---

<objective>
Implement the approved "atmospheric hero — dark ink dim" design on the homepage: turn the hero into a full-bleed photographic section using `public/Background.jpg`, dimmed by a dark gradient overlay, with the hero text in the light palette. Everything else on the site keeps the Phase 1 "ma" minimalist treatment.

Purpose: Give the homepage a single striking, atmospheric first impression (approved by Rasmus) without disturbing the rest of the site or its zero-cost Vercel footprint.
Output: A downscaled, committed `Background.jpg`, a preserved original outside `public/`, and a rewritten hero section in `src/app/(site)/page.tsx`.

Source of truth: @docs/superpowers/specs/2026-07-13-atmospheric-hero-design.md (APPROVED — all requirements and acceptance criteria are locked).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@docs/superpowers/specs/2026-07-13-atmospheric-hero-design.md
@./CLAUDE.md

<interfaces>
<!-- Existing Container the hero content must stay inside (unchanged). -->
From src/components/ui/Container.tsx:
```tsx
export function Container({ children, className = '' }: { children: ReactNode; className?: string; })
// renders: <div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 {className}">
```

<!-- Design tokens available (src/app/globals.css @theme). Use these; do NOT add new tokens. -->
--color-ink-dark:        #F5F2EA   (Tailwind: text-ink-dark)   → hero name (h1)
--color-vermillion-dark: #E2632E   (Tailwind: text-vermillion-dark) → hero tagline
--color-paper-dark:      #16150F   (= rgb 22,21,15)            → overlay base color
Supporting hero line uses #d8d4c8 (no matching token → arbitrary value text-[#d8d4c8])

<!-- Current hero (to be replaced) — page.tsx lines 28-47. The two teaser
     Containers below it (Featured Projects, Latest Writing) MUST be left byte-for-byte unchanged. -->
</interfaces>

Current image facts:
- public/Background.jpg is 5712×4284, ~2.0 MB, UNTRACKED. Must be downscaled and git-added by this plan.
- images/ exists but is empty. Preserve the original at images/Background-original.jpg (outside public/, NOT committed).

DO NOT touch: public/hero.jpg (modified), public/heroold.jpg, src/content/projects.ts, src/lib/site-config.ts, .planning/config.json, or any images/ user file. Stage ONLY public/Background.jpg and src/app/(site)/page.tsx.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Downscale Background.jpg and preserve the original</name>
  <files>images/Background-original.jpg, public/Background.jpg</files>
  <action>
Preserve the full-resolution original outside `public/`, then downscale the in-place copy with macOS `sips`:

```bash
# 1. Preserve original (outside public/, will NOT be committed)
cp public/Background.jpg images/Background-original.jpg

# 2. Resample longest edge to 2000px, then set JPEG quality ~70
sips -Z 2000 public/Background.jpg
sips -s format jpeg -s formatOptions 70 public/Background.jpg

# 3. Verify size on disk
ls -l public/Background.jpg
```

Confirm the resulting `public/Background.jpg` is ≤500 KB. If it is still over 500 KB, lower quality (e.g. `-s formatOptions 60`) and/or reduce the long edge (e.g. `sips -Z 1800`) until it is ≤500 KB while keeping the long edge ≥1800px. Do NOT commit yet — Task 2 stages both files in one commit.
  </action>
  <verify>
    <automated>test "$(stat -f%z public/Background.jpg)" -le 512000 && sips -g pixelWidth -g pixelHeight public/Background.jpg && test -f images/Background-original.jpg && echo OK</automated>
  </verify>
  <done>public/Background.jpg is ≤500 KB (512000 bytes) with long edge ≤2000px; images/Background-original.jpg exists as the untouched original.</done>
</task>

<task type="auto">
  <name>Task 2: Rewrite the hero section as a full-bleed atmospheric hero and commit</name>
  <files>src/app/(site)/page.tsx</files>
  <action>
Replace ONLY the first hero `<Container>` block (current lines 28-47) with a full-bleed `<section>`. Leave the two teaser `<Container>` blocks below it (Featured Projects, Latest Writing) exactly as-is. Keep all existing imports and the file's leading doc comment.

Requirements from the approved spec (source of truth):

1. Full-bleed section spanning the full viewport width, beginning below the nav. The nav lives in the layout and stays untouched — keep `min-h-[calc(100vh-4rem)]` so the photo starts below the 4rem nav.
2. Background photo via `next/image`: `src="/Background.jpg"`, `fill`, `priority`, `alt=""` (decorative), `className` including `object-cover`. `sizes="100vw"` so Next serves an appropriately sized variant.
3. Dark gradient overlay between photo and content: `linear-gradient(180deg, rgba(22,21,15,0.55), rgba(22,21,15,0.78))` (top → bottom), absolutely positioned to cover the section.
4. Hero content stays inside the existing centered `Container` (keep the current flex layout classes: `flex flex-col items-center justify-center gap-8 py-16 text-center sm:flex-row sm:gap-12 sm:text-left`), layered above the overlay (`relative` / higher stacking).
5. Light palette, theme-invariant (NO `dark:` variants inside the hero):
   - h1 name: `text-ink-dark`
   - tagline: `text-vermillion-dark` (drop the existing `text-vermillion dark:text-vermillion-dark`)
   - supporting `role` line: `text-[#d8d4c8]`
   - portrait `/hero.jpg`: keep width/height/rounded/object-cover and sizes; switch its border to a light ring `ring-2 ring-[rgba(245,242,234,0.9)]`
   - CTA `Button` unchanged (existing vermillion primary)
6. Use existing tokens/classes only — introduce NO new design tokens and do NOT edit globals.css.

Reference structure (adapt, keep the existing portrait/text/Button content):

```tsx
<section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
  <Image
    src="/Background.jpg"
    alt=""
    fill
    priority
    sizes="100vw"
    className="object-cover"
  />
  <div
    aria-hidden
    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,21,15,0.55),rgba(22,21,15,0.78))]"
  />
  <Container className="relative flex flex-col items-center justify-center gap-8 py-16 text-center sm:flex-row sm:gap-12 sm:text-left">
    <Image
      src="/hero.jpg"
      alt={`Portrait of ${siteConfig.name}`}
      width={200}
      height={200}
      priority
      className="h-48 w-48 flex-none rounded-full object-cover ring-2 ring-[rgba(245,242,234,0.9)] sm:h-56 sm:w-56"
    />
    <div className="flex flex-col items-center gap-4 sm:items-start">
      <h1 className="text-display font-semibold text-ink-dark">{siteConfig.name}</h1>
      <p className="text-heading font-semibold text-vermillion-dark">{siteConfig.tagline}</p>
      <p className="max-w-md text-body text-[#d8d4c8]">{siteConfig.role}</p>
      <Button href="/projects" variant="primary" className="mt-2">
        View My Projects
      </Button>
    </div>
  </Container>
</section>
```

Then verify the build and commit ONLY the two intended files:

```bash
npx tsc --noEmit
npx next build
git add public/Background.jpg "src/app/(site)/page.tsx"
git commit -m "feat(hero): implement approved atmospheric hero (full-bleed Background.jpg, dark ink dim overlay)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
  </action>
  <verify>
    <automated>grep -q 'alt=""' "src/app/(site)/page.tsx" && grep -q 'Background.jpg' "src/app/(site)/page.tsx" && grep -q 'rgba(22,21,15' "src/app/(site)/page.tsx" && npx tsc --noEmit && npx next build</automated>
  </verify>
  <done>Hero section renders Background.jpg full-bleed with the specified overlay and light-palette text; grep finds `priority`, `alt=""`, and the overlay color; `npx tsc --noEmit` and `next build` pass; only public/Background.jpg and src/app/(site)/page.tsx are staged/committed; the two teaser Containers are unchanged.</done>
</task>

</tasks>

<verification>
- `grep -n 'priority\|alt=""\|Background.jpg\|rgba(22,21,15' 'src/app/(site)/page.tsx'` finds the background image with priority, decorative alt, and the dark overlay gradient.
- `stat -f%z public/Background.jpg` ≤ 512000.
- `git diff --cached --name-only` shows exactly `public/Background.jpg` and `src/app/(site)/page.tsx` — nothing else.
- Toggling theme produces no visual change inside the hero (no `dark:` classes in the hero section).
- `npx tsc --noEmit` and `npx next build` both pass.
</verification>

<success_criteria>
All five acceptance criteria from the approved spec are met:
1. Hero renders Background.jpg full-bleed with the specified overlay; grep finds `priority` and `alt=""`.
2. Hero name/tagline are light text on a ≥0.55-opacity dark overlay (WCAG AA).
3. public/Background.jpg ≤500 KB on disk.
4. Theme toggle produces no change inside the hero.
5. `npx tsc --noEmit` and `next build` pass.
</success_criteria>

<output>
After completion, create `.planning/quick/260713-wam-implement-approved-atmospheric-hero-desi/260713-wam-SUMMARY.md`.
</output>
