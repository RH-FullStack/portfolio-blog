# Phase 3: SEO Foundation & Launch - Context

**Gathered:** 2026-07-14
**Status:** Ready for planning

<domain>
## Phase Boundary

The site becomes discoverable and shareable: accurate meta tags (title, description) and a real favicon on every page/post, a working sitemap.xml and robots.txt, a static Open Graph image for link previews, good Core Web Vitals / Lighthouse scores with optimized images, and public deployment on Vercel's free Hobby tier at a vercel.app subdomain. All SEO artifacts are built and verified against the real Phase 1/2 content (4 core pages + 3 live blog posts), not placeholders.

Explicitly NOT this phase (already deferred to v1.x/v2 in REQUIREMENTS.md): RSS feed (BLOGX-01), dynamic per-post OG images (SEOX-01), JSON-LD structured data (SEOX-02), custom domain (DOMAIN-01).

Requirements covered: SEO-01, SEO-02, SEO-03, SEO-04, DEPL-01.

</domain>

<decisions>
## Implementation Decisions

### Titles & Meta Strategy
- **D-01:** Title template suffix is the real name, not the brand: inner pages/posts render as `{Page/Post Title} — Rasmus Hansen`. Rationale: the name is stable and SEO-relevant; "RasmusOS" is an explicit placeholder (PROJECT.md) and must not be baked into every indexed title.
- **D-02:** Homepage title is name + role: `Rasmus Hansen — Software Developer` (classic personal-site pattern, matches what employers/clients search for).
- **D-03:** Meta descriptions: blog posts reuse their existing frontmatter `excerpt` verbatim (zero new per-post authoring burden — protects the core value); each static page (home, about, projects, contact, blog index) gets one hand-written description authored during this phase.

### OG Image & Favicon
- **D-04:** The site-wide static OG image (1200×630) is produced at build time with `next/og` (`ImageResponse`) — code-defined using the design tokens (paper background, ink text, vermillion accent, enso monogram). Static per SEO-03; "build-time code-defined" is the production method, chosen so a future brand rename is a one-line text change. Note the Satori constraint: inline flexbox styles only, no Tailwind classes (CLAUDE.md "What NOT to Use").
- **D-05:** OG image content: "Rasmus Hansen" + "Software Developer" + the enso monogram. Consistent with D-01/D-02, rename-proof.
- **D-06:** Favicon reuses the header's enso monogram (open circular brushstroke + vermillion vertical stroke, from `src/components/layout/Header.tsx`) — SVG favicon with ICO/PNG fallbacks, replacing the default `src/app/favicon.ico`. The mark is already rename-proof by design (Phase 1 D-09).

### Launch & Indexing
- **D-07 (HARD GATE):** Nothing is pushed to any git remote and nothing is deployed until Rasmus explicitly says so. He will connect his PERSONAL GitHub account himself. All deployment work in plans must be structured as a user-triggered checkpoint — build everything deploy-ready, then STOP and wait for his explicit go signal. Do not create remotes, do not push, do not run `vercel` commands before that signal.
- **D-08:** Deploy flow (once gated go-ahead is given): GitHub → Vercel Git integration, so `git push` auto-deploys — this is what makes the Phase 2 "publish a post by pushing" workflow true in production.
- **D-09:** Vercel project name / vercel.app subdomain: decide at deploy time — deliberately left open; Rasmus picks it when he connects GitHub/Vercel himself. Plans must not hardcode a subdomain; use `NEXT_PUBLIC_SITE_URL` env var (already the pattern in `site-config.ts` and root layout `metadataBase`).
- **D-10:** Search indexing is allowed from launch day on the vercel.app subdomain — robots.txt permits crawling, sitemap is submitted-ready. The future custom-domain migration is already planned as DOMAIN-01 (301s + Search Console Change of Address), so no noindex holding pattern.
- **D-11:** The `REPLACE_ME` placeholders (GitHub/LinkedIn/email in `src/lib/site-config.ts`, project `code` links in `src/content/projects.ts`) are Rasmus's to edit himself before deploy. The plan's job is only a pre-deploy verification check that no `REPLACE_ME` string remains in shipped code — a launch blocker if found, not something Claude fills in.

### Performance
- **D-12:** Hero background (`public/Background.jpg`, 412 KB, the LCP element): optimize while keeping the approved look — convert/compress to modern formats (AVIF/WebP, target ~100–150 KB) and serve with priority loading. Visually indistinguishable is the bar; no artistic changes to the approved artwork.
- **D-13:** Verification bar: Lighthouse 90+ in all four categories (Performance, Accessibility, Best Practices, SEO) on both mobile and desktop, measured against the production build.
- **D-14:** Backup image assets (`BackgroundOld.jpg`, `heroold.jpg`) move out of `public/` into a repo folder that doesn't deploy (e.g. `assets/originals/`) — kept in git, no longer publicly served.

### Claude's Discretion
- Exact metadata implementation shape (static `metadata` exports vs `generateMetadata`, title template via `title.template`, per-route wiring) — planner/executor decide following Next.js App Router conventions.
- Tag-archive and 404 page metadata details, canonical URL handling — follow standard practice; user declined to micro-specify.
- Sitemap/robots implementation — built-in `app/sitemap.ts` / `app/robots.ts` file conventions per CLAUDE.md (locked stack guidance, not a discussion point). Draft posts must be excluded from the sitemap (Phase 2 D-11).
- Favicon fallback set specifics (sizes, apple-touch-icon, dark-mode variant) — Claude judges what's needed for quality.
- Exact image-optimization tooling/format choices for D-12, and Lighthouse measurement method (local `next build` + Lighthouse CI vs manual) — planner decides.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope & requirements
- `.planning/PROJECT.md` — core value, $0/month constraint, brand-name-is-placeholder note (drives D-01/D-05/D-09), out-of-scope list
- `.planning/REQUIREMENTS.md` — SEO-01..04, DEPL-01 (this phase); v2 section listing what NOT to build here (RSS, dynamic OG, JSON-LD, custom domain)
- `.planning/ROADMAP.md` §"Phase 3: SEO Foundation & Launch" — goal, success criteria, depends-on Phase 2
- `CLAUDE.md` (root) — locked stack guidance directly relevant to this phase: `next/og` (not `@vercel/og`), built-in `app/sitemap.ts` (not next-sitemap), Satori inline-styles-only gotcha, no `output: 'export'`, Vercel Hobby-tier limits table

### Research (produced during project init)
- `.planning/research/PITFALLS.md` — Pitfall 3 (`metadataBase` — already set in Phase 1, verify it resolves correctly on Vercel), plus any SEO/launch pitfalls
- `.planning/research/STACK.md` — `next/og`/`ImageResponse` guidance, sitemap/robots file conventions, Vercel free-tier notes

### Prior phase context
- `.planning/phases/01-core-site-design-system/01-CONTEXT.md` — D-01 (ink/paper + vermillion palette), D-02 (Geist fonts), D-09 (enso monogram constraint: abstract, rename-proof) — all feed the OG image and favicon
- `.planning/phases/02-blog-content-system/02-CONTEXT.md` — D-09 (frontmatter schema incl. `excerpt` — source for post meta descriptions per D-03), D-11 (draft posts excluded from all public views INCLUDING sitemap)

### Not yet created
- No SPEC.md exists for this phase — requirement text lives in REQUIREMENTS.md, not duplicated here.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/layout.tsx` — root `metadata` export already sets `metadataBase` from `NEXT_PUBLIC_SITE_URL` (Phase 1, Pitfall 3). This phase extends it: title template, richer description, OG defaults. It is currently the ONLY metadata in the app — no page or post exports metadata yet.
- `src/lib/site-config.ts` — single source of truth for name/tagline/role/siteUrl/nav/social. New SEO strings (title suffix "Rasmus Hansen", homepage title, descriptions) should live here or alongside, not be scattered. Contains the `REPLACE_ME` social values (D-11).
- `src/components/layout/Header.tsx` — the `Monogram()` SVG (enso circle `d="M16 5a11 11 0 1 1-7.8 3.2"` + vermillion stroke) is the source geometry for the favicon (D-06) and OG image mark (D-05).
- Velite posts collection (`content/posts/*.mdx`, 3 real posts) — each has `title`, `date`, `tags`, `excerpt`, `draft`; excerpt feeds post meta descriptions (D-03); `draft` flag feeds sitemap exclusion.
- `src/app/favicon.ico` — exists but is the scaffold default; replaced per D-06.

### Established Patterns
- Design tokens in `src/app/globals.css` (`--color-paper/ink/vermillion` + dark variants, Geist via `next/font`) — the OG image must visually match these but CANNOT use Tailwind classes (Satori renders inline flexbox styles only).
- All pages are Server Components under `src/app/(site)/` — adding `metadata`/`generateMetadata` exports is straightforward; blog `[slug]` and `tags/[tag]` routes need `generateMetadata` from Velite data.
- `NEXT_PUBLIC_SITE_URL` env-var pattern already established — the Vercel project must set it (part of the deploy checklist), since the subdomain is decided at deploy time (D-09).

### Integration Points
- `src/app/sitemap.ts` and `src/app/robots.ts` — new files, built-in Next.js conventions; sitemap enumerates static routes + non-draft posts + tag pages from Velite data.
- `src/app/opengraph-image.tsx` (or equivalent) — new `next/og` route for D-04.
- No git remote, no `.vercel/` config exists — deployment is genuinely new surface, and HARD-GATED per D-07.
- Images: `public/Background.jpg` (412 KB, hero LCP — D-12), `public/hero.jpg` (256 KB portrait, used via `next/image` on homepage), backups to relocate (D-14).

</code_context>

<specifics>
## Specific Ideas

- The OG image and favicon should feel like the site: paper background, ink text, the enso monogram with its vermillion stroke — not a generic dark-card-with-name template.
- "Rasmus Hansen — Software Developer" is the canonical public identity string for titles and the OG image; the RasmusOS brand stays out of anything expensive to re-index or re-share.
- The Phase 2 core value framing carries into deployment: `git push` = publish. The GitHub→Vercel integration is what makes that real, but only after Rasmus's explicit go signal (D-07).

</specifics>

<deferred>
## Deferred Ideas

- RSS/Atom feed, dynamic per-post OG images, JSON-LD structured data, custom domain migration — all already tracked as v1.x/v2 requirements (BLOGX-01, SEOX-01, SEOX-02, DOMAIN-01); reconfirmed out of scope for this phase.

None new — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-seo-foundation-launch*
*Context gathered: 2026-07-14*
