# Pitfalls Research

**Domain:** Solo-developer personal portfolio + blog (Next.js App Router + Tailwind + MDX, $0/month on Vercel Hobby, custom domain added post-launch)
**Researched:** 2026-07-10
**Confidence:** MEDIUM-HIGH (technical pitfalls verified against Next.js/Vercel official docs; "never ships" and content-discipline pitfalls are well-documented community patterns, marked accordingly)

## Critical Pitfalls

### Pitfall 1: The project never ships because "done" keeps moving

**What goes wrong:**
Solo devs building their own portfolio treat it as a never-finished side project. A brand name feels unfinished ("RasmusOS" is a placeholder), the design "isn't quite right," one more page or animation gets added before launch. Without an external client or deadline, there's no one to say "ship it" — every polish idea gets equal priority to core requirements, and the list of "just one more thing" never terminates. This is the single most common reason personal portfolio sites never go live.

**Why it happens:**
On a project you own end-to-end, you are simultaneously the client, the designer, and the developer. There's no external forcing function, and perfectionism disguises itself as thoroughness — refactoring the design system or reconsidering the color palette *feels* like productive work but is actually endless scope expansion with no ship date attached. This project has extra fuel for this trap: the brand name is explicitly undecided, the design direction is described as "not a generic template" (an open-ended bar), and there is no external stakeholder pushing to launch.

**How to avoid:**
- Freeze scope for v1 to exactly what's in PROJECT.md's "Active" requirements list — the "Out of Scope" list already exists precisely to prevent this; treat it as a hard boundary, not a suggestion.
- Define launch as "content-complete home/about/projects/blog/contact pages, deployed on vercel.app subdomain" — not "design perfected."
- Timebox the placeholder brand name: ship with "RasmusOS" (or any working name) live. A name swap later is a text/logo change, not a redesign, if the identity isn't baked into routes or visual identity in a hard-to-change way.
- Set a hard launch date and treat every new idea that surfaces after scope-freeze as a backlog item for v1.1, not a launch blocker.

**Warning signs:**
- Redesigning a page that already meets requirements ("just a bit more polish") instead of moving to the next unbuilt page.
- Adding features from the "Out of Scope" list (CMS, contact form, timeline, analytics) before the Active list is done.
- Spending more than one session deciding on the final brand name/logo before any page is built.
- No calendar date attached to "launch."

**Phase to address:**
Roadmap/scope-definition phase (Phase 1) — lock the requirements list as the launch bar before any building phase begins, and every subsequent phase should reference it rather than re-litigate scope.

---

### Pitfall 2: MDX hydration mismatches and silent build breaks

**What goes wrong:**
The blog builds locally, then throws a hydration mismatch error in production, or the build fails with a cryptic MDX/rehype error. Common root causes in Next.js App Router + MDX: an extra blank line between two paragraphs in an `.mdx` file causing React to see nested/adjacent `<p>` tags; components that render browser-only values (dates formatted with locale, `Math.random()`, `window`) differently on server vs. client; and stale `.next` build cache producing errors that don't match the actual current code.

**Why it happens:**
MDX compiles Markdown to JSX, and Markdown's loose formatting rules (blank lines, indentation) don't map 1:1 to valid nested HTML/JSX. In the App Router, components are Server Components by default, so any component needing browser APIs must be explicitly marked `"use client"` — forgetting this, or using `Date`/`Intl` formatting without pinning a fixed locale/timezone, produces content that differs between server-render and client-hydrate.

**How to avoid:**
- Pick one actively-maintained MDX pipeline and stick with it — **avoid Contentlayer** (archived/unmaintained as of 2024); use `next-mdx-remote` (simple, flexible) or `Velite` (type-safe, contentlayer-like DX, actively maintained) instead.
- Format dates using a fixed locale/timezone (e.g., `Intl.DateTimeFormat('en-US', { timeZone: 'UTC' })`) rather than relying on the runtime's local timezone, and never use `Date.now()`/`Math.random()` directly in rendered output.
- If a component must use browser-only APIs, mark it `"use client"` and gate the browser-only part behind `useEffect` so the initial render matches server output.
- When you hit an unexplained hydration or type error during development, `rm -rf .next` before assuming it's a real code bug — stale dev chunks are a known false-positive source.

**Warning signs:**
- "Text content does not match server-rendered HTML" errors in the browser console after adding new blog content.
- Build succeeds locally but fails on Vercel (often a caching or environment difference).
- A blog post renders fine until you add a paragraph break or reuse an old post as a template.

**Phase to address:**
Blog/content-system build phase — pin the MDX toolchain choice and establish content formatting conventions (frontmatter template, date handling) before writing the first several real posts, so the pattern is right from post #1.

---

### Pitfall 3: Missing `metadataBase` silently breaks Open Graph images and canonical URLs

**What goes wrong:**
Social share previews (Twitter/X, LinkedIn, Slack) show no image or a broken image when a post is shared, and canonical URLs resolve to relative paths that mean nothing to search engines. This fails **silently** — there's no build error, no console warning a casual dev would notice, and it often isn't caught until someone shares a link and the preview looks broken.

**Why it happens:**
Next.js's Metadata API resolves relative URLs (`/og-image.png`, `og-image.png` from a route's `opengraph-image` file) against a `metadataBase` you must set in the root layout. Without it, these stay relative, and social platforms fetching the raw HTML can't resolve them into an absolute URL.

**How to avoid:**
- Set `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)` in the root layout from day one, backed by an env var — this is exactly the setting that will need to flip from the vercel.app URL to the custom domain next month, so building it as an env var (not hardcoded) now avoids a code change later.
- Verify OG/Twitter image resolution using Vercel's og-image debugging or a manual `curl` of the deployed HTML `<head>`, not just "it renders in the browser."
- Add a canonical URL to every page's metadata explicitly (don't rely on defaults) — this also matters for the future domain migration (Pitfall 6).

**Warning signs:**
- Social preview cards (test via a link-preview debugger) show missing/broken images for blog posts.
- View-source on a deployed page shows `<meta property="og:image" content="/og-image.png">` (relative, not `https://...`).

**Phase to address:**
SEO foundation phase — should be built alongside initial page/routing structure, since `metadataBase` lives in the root layout and every subsequent page inherits from it.

---

### Pitfall 4: Custom domain cutover causes downtime or broken links if done carelessly

**What goes wrong:**
A month after launch, adding the custom domain to the existing Vercel project seems trivial but has several failure modes: DNS propagation can take hours (up to 48h for full nameserver changes, less for record-only changes), leaving some visitors unable to resolve the new domain; adding only the apex domain (or only `www`) without its counterpart leaves the other variant 404ing; and any content already shared/indexed under the vercel.app URL keeps working only if it isn't deleted or redirected incorrectly.

**Why it happens:**
DNS is eventually-consistent, not instant — different resolvers around the world cache records for different TTLs. Vercel does not automatically add the `www` or apex counterpart when you add one; that's a manual second step. Because this project deliberately deferred the domain by a month (per PROJECT.md), this cutover happens on a live, already-linked site (job applications, social profiles, blog post URLs may already point at the vercel.app domain), raising the stakes above a fresh launch.

**How to avoid:**
- Add both the apex domain and `www` subdomain in Vercel's project settings, and let Vercel configure the redirect between them (recommendation: `www` as primary with apex → `www` redirect, since CNAME-based `www` gets Vercel's full CDN/anycast benefits; apex requires an A record).
- Do the DNS record changes at a low-traffic time and verify with `dig`/`whatsmydns.net` before announcing the new domain anywhere.
- **Do not remove the vercel.app domain** — keep it attached to the same Vercel project so old links (already shared on LinkedIn, GitHub profile, resume) don't 404; instead set up a redirect (see Pitfall 6) so both resolve, with the custom domain as canonical.
- Test the live custom domain fully (all pages, blog posts, images, OG tags) before updating any external links (LinkedIn, GitHub bio, resume) to point at it.

**Warning signs:**
- Only one of `example.com` / `www.example.com` added in Vercel, causing the other to error.
- Announcing the new domain immediately after adding DNS records, before propagation is verified.
- External profiles (LinkedIn, GitHub) still pointing at the vercel.app URL weeks after the custom domain is live (broken-link risk if the old URL is later deprecated).

**Phase to address:**
Post-launch domain-migration phase (the deferred "add custom domain" work called out in PROJECT.md's Key Decisions) — should be its own small phase with an explicit DNS + redirect + verification checklist, not a quick add-on to another phase.

---

### Pitfall 5: Migrating from vercel.app subdomain to custom domain loses SEO signal if redirects/canonicals are wrong

**What goes wrong:**
Search engines treat the custom domain as a brand-new, unrelated site unless the migration is done correctly, which can mean losing whatever early indexing/authority the vercel.app URL accumulated in its first month. Specific failure modes: using a 302 (temporary) redirect instead of 301 (permanent), which tells Google not to transfer ranking signal; leaving canonical tags pointing at the old vercel.app URLs after cutover; forgetting to update the sitemap and internal links to the new domain; and not submitting a Change of Address in Google Search Console.

**Why it happens:**
Google's site-move guidance requires explicit signals — permanent redirects plus matching canonical tags plus a Change of Address request — because otherwise it has no reliable way to know the domain change is deliberate and permanent rather than duplicate/hijacked content. A one-person project without an SEO checklist naturally misses one or more of these steps.

**How to avoid:**
- Use **301 (permanent) redirects** from vercel.app URLs to the new custom domain, not 302.
- Update `metadataBase`/canonical URLs to the new domain as part of the same deploy that adds the redirect (this is why building `metadataBase` from an env var in Pitfall 3 pays off — one env var change, not a code hunt).
- Register the new custom domain as a property in Google Search Console (in addition to the existing vercel.app property, verified via URL-prefix method since vercel.app is a shared domain not eligible for Domain-property verification), submit the updated sitemap, then use the **Change of Address tool** on the *old* property pointing to the new one.
- Keep the redirects live for at least 180 days after migration — don't tear down the vercel.app project/domain shortly after switching.
- Because this project launches on vercel.app first by design (per PROJECT.md), budget for this migration checklist explicitly as work, not as "just change the domain."

**Warning signs:**
- Search traffic or impressions (Search Console) drop sharply in the weeks after the domain switch with no redirect/canonical audit done.
- `curl -I` on an old vercel.app blog URL doesn't return a 301 to the matching new-domain URL.
- Canonical tag on the new-domain page still reads the old vercel.app hostname (stale env var/cache).

**Phase to address:**
Same post-launch domain-migration phase as Pitfall 4 — the DNS work and the SEO-continuity work should be planned and executed together, since they're two views of the same event.

---

### Pitfall 6: Vercel Hobby plan limits and terms surprise you after you've already built on it

**What goes wrong:**
Two categories of surprise: (1) usage limits — Hobby includes 100GB bandwidth/month, 100 build minutes/month, a 45-minute max build time, and function invocation caps; if bandwidth or invocations are exceeded, Vercel **pauses the deployment** (site stops serving traffic) until the next monthly cycle rather than silently overage-billing you, since Hobby has no pay-as-you-go; (2) the Hobby plan's Terms of Service restrict it to **non-commercial, personal use** — a portfolio that links to paid products/SaaS is generally fine, but if the site itself sells something, runs ads, or is used for a registered business, it technically violates Hobby ToS and risks suspension.

**Why it happens:**
Hobby is priced free specifically because it's meant for personal/hobby projects with light traffic; Vercel has no obligation to let a free-tier site consume unlimited resources or serve commercial traffic. Most devs don't read the fine print until traffic spikes (e.g., a blog post goes viral on Hacker News) or a "showcase my SaaS" project page nudges the site toward commercial use.

**How to avoid:**
- For a personal portfolio/blog with modest traffic, 100GB/month bandwidth is generous — but keep an eye on it if a post drives a traffic spike (e.g., front-page HN); Next.js Image optimization requests also count against bandwidth.
- Keep the site itself non-commercial (no checkout, no ads) — showcasing/linking to a SaaS product you built is fine; running the SaaS's paid infrastructure *on* this Hobby project would not be.
- Avoid unnecessary rebuilds burning the 100 build-minute/month budget — batch content edits rather than pushing many small commits in a row if build minutes ever become a concern (unlikely at MVP content volume, but worth knowing as posts scale).
- If the site ever needs commercial use, forms/backend with meaningful compute, or bandwidth beyond Hobby limits, budget for the ~$20/month Pro tier rather than assuming free forever.

**Warning signs:**
- Vercel dashboard usage graphs trending toward the bandwidth or invocation caps.
- A blog post picks up unexpected external traffic (social share, HN, Reddit).
- Any future feature (e.g., a "buy me a coffee" link, paid newsletter, product checkout) that shifts the site from portfolio to commercial.

**Phase to address:**
Deployment/launch phase — no action needed beyond awareness at MVP scale; flag as a recheck trigger if/when traffic or scope grows (e.g., before adding analytics or any paid feature later).

---

### Pitfall 7: Writing the blog becomes a chore because the publishing pipeline has friction

**What goes wrong:**
The stated Core Value of this project is explicit: "if writing a new post is ever a chore, the whole point is lost." The most common way personal dev blogs die isn't a technical failure — it's that after the first 2-3 posts, the founder stops writing because each new post requires too much ceremony: copying an old `.mdx` file and manually fixing frontmatter (dates, slugs, tags) by hand, uncertainty about image handling/optimization, no clear place to put a half-finished draft, or perfectionism about post quality creeping in the same way it does for the whole site (Pitfall 1, but for content).

**Why it happens:**
Frontmatter-driven MDX is genuinely low-friction *if* the scaffolding is good, but most personal setups don't invest in a "new post" script/template, so every post starts with manual copy-paste, which is exactly the workflow known to produce stale "last updated" dates and inconsistent metadata (a documented failure mode even on well-known dev blogs). Additionally, broad content pillars (dev/architecture, entrepreneurship, investing, Aikido/Japan) without a lightweight structure can create decision paralysis about where a given post "belongs."

**How to avoid:**
- Build a `new post` script or a copy-paste-proof frontmatter template (with today's date auto-filled) as part of the blog system itself, not as an afterthought — this is a small piece of tooling that pays for itself immediately.
- Keep frontmatter minimal (title, date, tags/category, summary) — every optional field is friction; don't require an OG image per post if a good default/generated one exists.
- Use simple flat tags/categories (matching the four content pillars already defined in PROJECT.md) rather than a rigid taxonomy that requires a decision tree before writing.
- Support drafts (e.g., a `draft: true` frontmatter flag excluded from the build) so unfinished posts can live in the repo without pressure to "finish or delete."
- Resist the urge to make every post's design bespoke — a single, solid post template (typography, code blocks, images) removes a recurring design decision from each new post.

**Warning signs:**
- More time spent tweaking the blog's post template/layout than writing actual posts.
- A draft sitting unpublished because of formatting/metadata uncertainty rather than content uncertainty.
- No posts published for a long stretch shortly after launch (the excitement-drop pattern common to personal blogs).

**Phase to address:**
Blog/content-system build phase — treat "friction-free authoring" as an explicit acceptance criterion for that phase, not just "MDX renders correctly."

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Hardcoding the site URL instead of an env-var-driven `metadataBase` | Slightly faster initial setup | Every metadata/canonical/OG reference must be found and changed by hand during the domain migration next month | Never — costs nothing extra to do right from the start |
| Copy-pasting an old MDX post as the template for a new one | Fast to start writing | Stale/incorrect frontmatter dates and inconsistent metadata (documented failure mode); compounds the "chore" problem (Pitfall 7) | Never for more than the first post — build a template/script immediately after |
| Using `next/image` with unconstrained remote image sources instead of statically imported/colocated post images | Marginally simpler MDX authoring | Next.js can't infer width/height for remote images at build time, risking layout shift and needing a custom rehype plugin workaround | Acceptable only if all blog images are colocated/static-imported instead — avoid remote images from day one |
| Choosing Contentlayer for MDX content typing | Nice DX, type-safe frontmatter | Project is archived/unmaintained; upgrading Next.js or dependencies later can break it with no upstream fix | Never for a new project in 2026 — use Velite or next-mdx-remote instead |
| Skipping a sitemap/robots.txt at initial launch ("add it before the real domain") | One less thing to build for MVP | Vercel.app URL indexes without a sitemap Google can crawl efficiently, and skipping it "for now" is easy to forget entirely | Acceptable only if explicitly tracked as a pre-launch checklist item, not silently deferred |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|------------------|--------------------|
| Vercel custom domain | Adding only the apex or only `www`, leaving the other 404ing | Add both; configure Vercel's automatic redirect (recommend `www` as primary via CNAME, apex redirects to it) |
| Vercel + DNS registrar | Changing nameservers/records and announcing the new domain immediately | Verify propagation with `dig`/whatsmydns before updating any external links; allow up to 48h for full nameserver changes |
| Google Search Console | Verifying only the custom domain and forgetting the vercel.app property already exists | Verify both properties (URL-prefix for vercel.app, since it's a shared eTLD+1 not eligible for Domain-property verification); use Change of Address from old → new |
| next/image + MDX | Using remote image URLs in MDX without explicit width/height, causing layout shift or build-time failures (Next.js can't fetch remote dimensions at build) | Colocate images with posts and use static imports so Next.js infers width/height automatically, or use a rehype plugin that injects them |
| mailto: contact link | Assuming mailto always "just works" — some OS/browser combos have no default mail client configured, silently failing | Pair mailto with a visible plain-text email address and/or a copy-to-clipboard fallback so the contact path never has a single point of failure |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Unoptimized/uncompressed hero or project images | Slow LCP, poor Core Web Vitals, faster bandwidth consumption against the 100GB Hobby cap | Always route images through `next/image`; compress source assets before commit | Noticeable at any traffic level; becomes a bandwidth-budget issue if a post goes viral |
| Client-side rendering pages that could be static | Slower TTFB, unnecessary JS shipped for content that never changes per-request | Default to Server Components / static generation for all portfolio and blog pages; reserve `"use client"` for genuinely interactive bits (e.g., theme toggle) | Matters immediately for a content-first site; compounds as post count grows |
| No caching/ISR strategy for blog index as post count grows | Full rebuild needed for every new post; slower deploys eating into the 100 build-minute/month budget | Use static generation with `generateStaticParams` for posts; rebuild is fine at low volume (dozens of posts) — revisit only if the archive grows into the hundreds | Non-issue at MVP scale (a handful of posts); reconsider only at scale that's unlikely for a personal blog |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing analytics/API keys as client-side env vars unnecessarily | Leaked keys visible in browser bundle | Only use `NEXT_PUBLIC_` prefix for values that are genuinely safe to expose (e.g., site URL); keep any future secrets server-only |
| No `robots.txt`/`noindex` control over draft or preview routes | Draft/unfinished content or preview deployments get indexed by search engines | Add `robots.txt` and explicit `noindex` metadata for any preview/staging URLs (Vercel preview deployments) so they never compete with production in search |
| Mailto link with no spam mitigation | Email address gets scraped and spammed | Minor risk for a personal site; acceptable tradeoff given $0 budget and no contact form, but consider basic obfuscation (e.g., simple JS-rendered email) if spam becomes a problem |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Generic "developer portfolio template" look despite explicit design goals to avoid it | Undermines the stated differentiation (professional, minimalist, Japanese-influenced craft); blends in with thousands of similar sites | Invest early design-phase effort in typography, spacing, and a distinct visual language rather than defaulting to a popular open-source template unmodified |
| Blog with no clear entry point from the homepage | Visitors (esp. recruiters skimming) miss the "journey" content that's core to the site's value | Surface latest post(s) or a clear blog nav link prominently on the homepage, not buried in a menu |
| Four disparate content pillars (dev, entrepreneurship, investing, Aikido/Japan) presented with no filtering | A reader interested in only the technical content wades through unrelated posts, or vice versa | Tag/category filtering on the blog index from day one, even if minimal, so each audience segment can self-select |
| Contact page with only a mailto link and no visible email/handle as text | Users on desktop without a configured mail client hit a dead end | Show the plain email address as visible text alongside the mailto link, plus social links as an alternate path |

## "Looks Done But Isn't" Checklist

- [ ] **OG/social preview images:** Often missing `metadataBase` — verify by pasting a live post URL into a link-preview debugger (e.g., Twitter Card Validator, opengraph.xyz) before calling launch done.
- [ ] **Sitemap & robots.txt:** Often forgotten entirely at MVP — verify `sitemap.xml` and `robots.txt` are reachable and reference the correct (current) domain.
- [ ] **404 handling for both domain variants:** Often only apex or only `www` is configured — verify both `example.com` and `www.example.com` resolve correctly once the custom domain is added.
- [ ] **Responsive check on real devices, not just DevTools:** Often "responsive" only means "no horizontal scrollbar in Chrome" — verify on an actual phone and a narrow desktop window, including code blocks in blog posts (a common horizontal-overflow culprit).
- [ ] **Draft/preview content excluded from production search indexing:** Often overlooked — verify no `draft: true` post or Vercel preview deployment is indexable.
- [ ] **New-post workflow is actually low-friction:** Often assumed fine because MDX "just works" for the first post — verify by writing a second and third post using only the intended workflow (template/script), not manual copy-paste.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|----------------|-------------------|
| Missing `metadataBase`/broken OG images discovered post-launch | LOW | Add env var, redeploy; social platforms will re-scrape on next share (may need to force-refresh via each platform's debugger tool) |
| Contentlayer chosen and later breaks on a Next.js upgrade | MEDIUM | Migrate content layer to Velite or next-mdx-remote; frontmatter schema is portable, mainly a wiring change in data-fetching code |
| Custom domain added with broken apex/www redirect | LOW | Add the missing domain variant in Vercel settings; propagation delay is the only real cost, no data loss |
| SEO signal lost from a bad domain migration (302 instead of 301, no Change of Address) | MEDIUM-HIGH | Fix redirects to 301, update canonicals, file Change of Address in Search Console, and wait — recovery is possible but slow (weeks), not instant |
| Blog stalls after 2-3 posts due to authoring friction | LOW (technical) / HIGH (motivational) | Technical fix (add a post-template script) is cheap; the harder part is rebuilding writing momentum — smaller/shorter posts to restart the habit help more than a big relaunch |
| Site never launches due to scope/perfectionism creep | N/A (prevention only) | No "recovery" — the fix is external accountability: pick a ship date, cut scope to the PROJECT.md Active list, and ship |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|--------------------|----------------|
| Project never ships (scope/perfectionism) | Scope-definition / Phase 1 | Requirements list frozen and referenced at every later phase; explicit launch date set |
| MDX hydration/build errors | Blog/content-system phase | A handful of real posts (with images, code blocks, paragraph breaks) build and deploy cleanly with no console hydration warnings |
| Missing `metadataBase` / broken OG | SEO foundation phase | Live post URL passes a social-preview debugger check |
| Custom domain DNS cutover | Post-launch domain-migration phase | `dig`/whatsmydns confirms propagation; both apex and www resolve; old vercel.app links still work |
| SEO loss on domain migration | Post-launch domain-migration phase | 301s verified via `curl -I`; canonical tags point to new domain; Change of Address filed in Search Console |
| Vercel Hobby limits/ToS surprise | Deployment/launch phase | Usage dashboard checked at launch and re-checked if traffic/scope changes |
| Blog authoring friction | Blog/content-system phase | Third post written using only the intended low-friction workflow, not ad hoc copy-paste |

## Sources

- [Why Solo Developers Ship Late: When Perfectionism Costs You $18K in Lost Work](https://markcrosling.medium.com/why-solo-developers-ship-late-when-perfect-code-costs-you-clients-94cf4c209f93)
- [This Is Why MOST Solo Dev Projects Fail](https://preview.app.daily.dev/posts/this-is-why-most-solo-dev-projects-fail-dpb5hfvxa)
- [Project Red Flags for the Solo Dev](https://deliciousbrains.com/project-red-flags-for-the-solo-dev/)
- [Text content does not match server-rendered HTML — Next.js docs](https://nextjs.org/docs/messages/react-hydration-error)
- [Next.js Hydration Errors in 2026: Real Causes, Fixes, and Prevention Checklist](https://medium.com/@blogs-world/next-js-hydration-errors-in-2026-the-real-causes-fixes-and-prevention-checklist-4a8304d53702)
- [Getting Started: Metadata and OG images — Next.js docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js SEO Meta Tags: Stop Losing Clicks From Broken Metadata](https://ccbd.dev/blog/nextjs-seo-meta-tags-mistake-that-cost-3-weeks-of-traffic)
- [Using the Next.js Image Component with MDX](https://kylepfromer.com/blog/nextjs-image-component-blog)
- [Automatic width and height of local MDX images with Next.js](https://mmazzarolo.com/blog/2023-07-29-nextjs-mdx-image-size/)
- [Vercel Hobby Plan — official docs](https://vercel.com/docs/plans/hobby)
- [Vercel Limits — official docs](https://vercel.com/docs/limits)
- [What happens when I reach my hobby plan limits? — Vercel Community discussion](https://github.com/vercel/community/discussions/6068)
- [Adding & Configuring a Custom Domain — Vercel docs](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Deploying & Redirecting Domains — Vercel docs](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting)
- [Troubleshooting domains — Vercel docs](https://vercel.com/docs/domains/troubleshooting)
- [Site Moves and Migrations — Google Search Central](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Change of Address tool — Search Console Help](https://support.google.com/webmasters/answer/9370220?hl=en)
- [How to Redirect a Domain Without Losing SEO — Elementor](https://elementor.com/blog/how-to-redirect-a-domain-without-losing-seo/)
- [Vercel subdomain reassignment causing Google Search Console canonical URL conflict — Vercel Community](https://community.vercel.com/t/vercel-subdomain-reassignment-causing-google-search-console-canonical-url-conflict/36418)
- [ContentLayer has been Abandoned - What are the Alternatives?](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives)
- [How I Built my Blog using MDX, Next.js, and React — Josh W. Comeau](https://www.joshwcomeau.com/blog/how-i-built-my-blog/)
- [16 blogging mistakes to avoid, according to HubSpot bloggers](https://blog.hubspot.com/marketing/beginner-blogger-mistakes)

---
*Pitfalls research for: Solo-developer personal portfolio + blog (Next.js/Tailwind/MDX, Vercel Hobby, deferred custom domain)*
*Researched: 2026-07-10*
