---
phase: quick
plan: 260721-hpn
type: execute
wave: 1
depends_on: []
files_modified:
  - src/content/projects.ts
  - src/app/(site)/page.tsx
  - src/app/(site)/projects/page.tsx
autonomous: true
requirements: [REMOVE-PLACEHOLDER-PROJECTS]
must_haves:
  truths:
    - "Only the real `rasmusos` entry remains in `src/content/projects.ts`; the `portfolio-tracker`, `dojo-scheduler`, and `devnotes-cli` placeholder entries are gone."
    - "The homepage 'Featured Projects' grid renders the single remaining card at an intentional, constrained width — not stretched or floating alone in a mostly-empty 3-column row."
    - "The `/projects` index grid renders the single card intentionally rather than occupying only half of an otherwise-empty 2-column row."
    - "`npm run build` succeeds and `npm run lint` / `npm test` pass with the reduced data set."
    - "No route, sitemap entry, test, or other content file references the removed slugs — nothing 404s or breaks the build."
  artifacts:
    - path: "src/content/projects.ts"
      provides: "Single-source typed project data, now containing only the real 'rasmusos' project"
      contains: "slug: 'rasmusos'"
    - path: "src/app/(site)/page.tsx"
      provides: "Homepage Featured Projects teaser with a count-aware grid that reads intentionally with 1 card"
    - path: "src/app/(site)/projects/page.tsx"
      provides: "Projects index with a count-aware grid that reads intentionally with 1 card"
  key_links:
    - from: "src/app/(site)/page.tsx"
      to: "src/content/projects.ts"
      via: "FEATURED_PROJECTS.length drives the grid column classes"
      pattern: "FEATURED_PROJECTS"
    - from: "src/app/(site)/projects/page.tsx"
      to: "src/content/projects.ts"
      via: "projects.length drives the grid column classes"
      pattern: "projects\\.length"
---

<objective>
Remove the three unfinished placeholder projects — `portfolio-tracker`, `dojo-scheduler`, and `devnotes-cli` — from `src/content/projects.ts`, leaving only the real, live `rasmusos` entry (which describes this site itself). These three were AI-generated seed entries with fake `https://example.com/...` demo links for products that were never built; shipping them under Rasmus's name misrepresents his portfolio. Then apply a light-touch layout polish so the two surfaces that render the projects array (the homepage "Featured Projects" teaser and the `/projects` index) still look intentional with a single card instead of leaving one card floating in a mostly-empty multi-column row.

Purpose: Present an honest portfolio — one real project, cleanly displayed — rather than fake demos. The projects data layer, Card component, and both pages stay fully intact so Rasmus can add real projects back later with zero boilerplate.
Output: `src/content/projects.ts` reduced to the single `rasmusos` entry; count-aware grid classes on both render surfaces; a green build/lint/test proving no dangling references to the removed slugs remain anywhere in the codebase.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@.planning/STATE.md

@src/content/projects.ts
@src/app/(site)/page.tsx
@src/app/(site)/projects/page.tsx
@src/components/ui/Card.tsx

<facts>
Reference audit already performed during planning (recorded here so the executor does not re-derive it — Task 1 re-confirms via grep):

- The three removed slugs (`portfolio-tracker`, `dojo-scheduler`, `devnotes-cli`) appear in EXACTLY ONE file: `src/content/projects.ts`. A full-tree grep across ts/tsx/mdx/md/json (excluding node_modules and .planning) returned matches only inside that data file.
- There is NO dynamic project routing. `src/app/(site)/projects/` contains only `page.tsx` — no `projects/[slug]/` detail route exists, so there are no per-project pages to break.
- `src/app/sitemap.ts` uses a HARDCODED static `/projects` route and does NOT loop over the `projects` array. Removing project entries cannot affect the sitemap.
- No test references the projects data. The only test file, `src/lib/related-posts.test.ts`, is about blog posts and uses inline fixtures — deleting project entries cannot affect it.
- The two render surfaces both read the shared typed `projects` array from `src/content/projects.ts`:
  - `src/app/(site)/page.tsx` line 11: `const FEATURED_PROJECTS = projects.slice(0, 3)`. With one project, `slice(0, 3)` yields a 1-element array. Line 71 grid: `mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3`. With 1 item at sm+/lg+, the single card occupies only the first 1/3 column, leaving ~2/3 of the row empty — the awkward case to fix.
  - `src/app/(site)/projects/page.tsx` line 25 grid: `mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2`. With 1 item at sm+, the card fills only half the row, leaving the right half empty.
- The `Card` component (`src/components/ui/Card.tsx`) renders one project and is count-agnostic. Do NOT modify it. This is a data + grid-container change only, not a Card redesign.
- Package manager is npm (`package-lock.json`). Scripts: `build` = `next build`, `lint` = `eslint`, `test` = `vitest run`. Type-checking runs as part of `next build`.

Conclusion: pure data reduction + a count-aware grid class on two containers. No new projects, no restored ones, no changes to Card, sitemap, routes, or unrelated pages. If Task 1's grep unexpectedly finds a removed slug outside `src/content/projects.ts`, STOP and surface it in the SUMMARY rather than silently editing other files.
</facts>

Do NOT invent new projects, do NOT restore the removed ones, and do NOT touch the Card component, sitemap, or any unrelated content/pages.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove the three placeholder project entries, keeping only rasmusos</name>
  <files>src/content/projects.ts</files>
  <action>In `src/content/projects.ts`, delete the three object literals whose `slug` is `'portfolio-tracker'`, `'dojo-scheduler'`, and `'devnotes-cli'` (the entries with fake `https://example.com/...` demo links) from the exported `projects` array. Leave ONLY the first entry, `slug: 'rasmusos'`, fully intact — including its comment about the optional screenshot field. Do NOT change the `Project` type, the file's header comment, or the `rasmusos` entry's content. The array must remain a valid `Project[]` with exactly one element. Then re-run the reference audit to prove nothing else in the codebase points at the removed slugs: grep the whole tree (excluding node_modules, .next, .git, .velite, .planning) for each of the three bare slug strings and expect zero matches for the removed slugs. If any removed slug is found in a source/test/config/other-content file, STOP and report it in the SUMMARY rather than editing that file to "fix" it — that exceeds this task's scope and needs a human decision.</action>
  <verify>
    <automated>! grep -rIn -e "portfolio-tracker" -e "dojo-scheduler" -e "devnotes-cli" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=.velite --exclude-dir=.planning && grep -c "slug: '" src/content/projects.ts | grep -qx 1 && grep -q "slug: 'rasmusos'" src/content/projects.ts && echo AUDIT_CLEAN</automated>
  </verify>
  <done>`src/content/projects.ts` contains exactly one project entry (`rasmusos`), and a full-tree grep for the three removed slugs returns no matches (prints AUDIT_CLEAN).</done>
</task>

<task type="auto">
  <name>Task 2: Make both project grids render a single card intentionally</name>
  <files>src/app/(site)/page.tsx, src/app/(site)/projects/page.tsx</files>
  <action>Make each grid container adapt its column layout to the number of projects so one card does not float alone in a mostly-empty multi-column row, while preserving the existing responsive multi-column layout for when more projects are added back later.

In `src/app/(site)/page.tsx`, replace the static className on the Featured Projects grid div (currently `mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3`) with a count-aware value driven by `FEATURED_PROJECTS.length`. When the length is 1, use a single-column, width-constrained layout so the lone card reads as an intentional card rather than a stretched or floating one — the string `mt-12 grid grid-cols-1 gap-8 max-w-md`. Otherwise, keep the existing responsive string `mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3`.

In `src/app/(site)/projects/page.tsx`, apply the same pattern to the projects grid div (currently `mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2`), driven by `projects.length`: when 1, use `mt-12 grid grid-cols-1 gap-8 max-w-md`; otherwise the existing `mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2`.

CRITICAL for Tailwind v4 JIT: write each branch as a COMPLETE literal class string inside a ternary (do NOT build class names by concatenating fragments like `` `grid-cols-${n}` ``), otherwise Tailwind's content scanner will not emit the classes. A small `const` holding the ternary result, or an inline ternary in the `className`, both work. Leave the section headings, the "View all projects" / "View My Projects" buttons, the Latest Writing section, and every other part of both files untouched.</action>
  <verify>
    <automated>grep -q "max-w-md" src/app/\(site\)/page.tsx && grep -q "max-w-md" src/app/\(site\)/projects/page.tsx && grep -q "FEATURED_PROJECTS.length" src/app/\(site\)/page.tsx && grep -q "projects.length" src/app/\(site\)/projects/page.tsx && echo GRIDS_UPDATED</automated>
  </verify>
  <done>Both grid containers choose a constrained single-column layout when exactly one project exists and fall back to the original responsive multi-column grid otherwise; each branch is a full literal Tailwind class string.</done>
</task>

<task type="auto">
  <name>Task 3: Verify the app builds, lints, and tests cleanly</name>
  <files>(no files created — verification only)</files>
  <action>Prove the data reduction and grid changes are sound end to end. Run `npm run build` (this also type-checks via `next build`) — it MUST succeed with the one-project data set, confirming no dangling reference to a removed slug anywhere in the compiled app. Then run `npm run lint` — MUST pass clean (watch for unused-variable or unused-import lint errors introduced by the grid-class edits). Then run `npm test` (vitest) — MUST pass; the related-posts tests are unaffected but confirm nothing regressed. Do not edit source to force any of these green beyond fixing an issue your own Task 1/Task 2 edits introduced; if the build fails for an unexpected reason (e.g. a hidden reference to a removed slug the planning grep missed), capture the exact error in the SUMMARY and stop.</action>
  <verify>
    <automated>npm run build && npm run lint && npm test</automated>
  </verify>
  <done>`npm run build`, `npm run lint`, and `npm test` all exit 0 with only the `rasmusos` project present and the count-aware grids in place.</done>
</task>

</tasks>

<verification>
- `src/content/projects.ts` exports a `projects` array with exactly one entry (`rasmusos`); the three placeholder entries and their fake example.com demo links are gone.
- Full-tree grep for `portfolio-tracker`, `dojo-scheduler`, `devnotes-cli` returns nothing outside `.planning/`.
- Homepage Featured Projects grid and `/projects` grid both render the single card in a constrained single-column layout (no card stretched across, and no large empty gap in a multi-column row), and fall back to the original responsive grid if more projects are added.
- `npm run build`, `npm run lint`, and `npm test` all pass.
- Card component, sitemap, routes, and all unrelated pages/content are unmodified.
</verification>

<success_criteria>
The three unfinished placeholder projects are removed leaving only the real `rasmusos` entry, both render surfaces display that single project intentionally rather than looking broken, the codebase has no dangling references to the removed slugs, and the site builds/lints/tests green.
</success_criteria>

<output>
Create `.planning/quick/260721-hpn-remove-unfinished-placeholder-projects-k/260721-hpn-SUMMARY.md` when done.
</output>
