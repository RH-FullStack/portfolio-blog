# Feature Research

**Domain:** Personal developer portfolio + blog (git-based MDX, $0/month budget, solo long-term personal brand)
**Researched:** 2026-07-10
**Confidence:** MEDIUM-HIGH (table stakes and SEO mechanics are HIGH confidence, verified across multiple sources and Next.js official docs; multi-pillar content strategy and "memorable differentiators" judgments are MEDIUM — synthesized from practitioner sources, not a single authoritative spec)

## Feature Landscape

### Table Stakes (Users Expect These)

Split into two audiences this site serves: recruiters/clients scanning the portfolio, and organic readers landing on blog posts. Missing these makes the site feel unfinished or unfindable.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero/intro with clear value proposition | Recruiters/clients spend ~15 seconds on first scan; they need to know who you are and what you do immediately, no scrolling required | LOW | Name, role, one-line positioning ("software developer building products, writing about the journey"), not a wall of text |
| About page with real background | Expected next click after the hero; where the "developer, entrepreneur, aikidoka, investor" narrative gets told | LOW | This is the connective tissue between the three content pillars — write it so the pillars feel like one person, not three unrelated blogs |
| Curated project showcase (3-5 projects, not everything) | Recruiters/hiring managers explicitly prefer depth over breadth — 3 polished projects beat 10 shallow ones | LOW-MEDIUM | Each card: description, tech stack tags, live link, code link. MDX frontmatter per project is enough; no backend needed |
| Tech stack / skills list | Recruiters and technical readers scan for stack fit before reading further | LOW | Simple list or tag cloud; don't over-categorize by "proficiency level" — it reads as filler on a solo site |
| Contact method | Non-negotiable; a portfolio with no way to reach the owner is broken | LOW | mailto + social links satisfies this at $0 budget; matches PROJECT.md decision, no contact form needed |
| Responsive, mobile-first layout | Baseline expectation across all modern sites; a broken mobile portfolio actively damages credibility with technical reviewers | LOW-MEDIUM | Tailwind CSS makes this close to free if built responsive from the start rather than retrofitted |
| Fast performance / good Core Web Vitals | Directly affects both recruiter trust ("this person ships quality") and organic SEO ranking | MEDIUM | Next.js SSG/ISR + next/image gets most of this for free; verify with Lighthouse/PageSpeed before calling it done |
| Blog post list with title, date, excerpt, reading time, tags | Readers scan a blog index the same way recruiters scan a portfolio — they need enough signal to decide whether to click | LOW-MEDIUM | `reading-time` npm package computes this from word count at build time, zero runtime cost |
| Individual post page with clear metadata (title, publish date, tags) | Establishes credibility and lets readers judge recency/relevance at a glance | LOW | Also needed for SEO structured data (see below) |
| Syntax highlighting for code blocks | A developer blog without properly highlighted code reads as unfinished to a technical audience | LOW-MEDIUM | Shiki via rehype-pretty-code is the current standard — build-time highlighting, VS Code-quality themes, supports light/dark |
| Tags/categories with a browsable archive | Readers exploring one pillar (e.g. investing) expect to filter to just that content | LOW-MEDIUM | Keep the tag vocabulary small and aligned to the 3-4 content pillars — don't let this sprawl (see Anti-Features) |
| Related posts | Standard content pattern that keeps readers on-site longer; computed from shared tags/category, no manual curation needed | LOW-MEDIUM | Depends on tags/categories existing first |
| 404 page and basic accessibility (semantic HTML, keyboard nav, alt text) | Broken defaults here are highly visible to the technical audience this site is trying to impress | LOW | Cheap to get right up front, expensive-looking to fix later |
| Favicon, page titles, meta descriptions per page | Baseline professionalism; missing these is an instant "unfinished project" signal to any developer visitor | LOW | Trivial in Next.js App Router metadata API |
| Social/profile links (GitHub, LinkedIn, X, etc.) | Expected companion to a mailto contact — recruiters and readers both want to verify you elsewhere | LOW | Static links, no OAuth/API needed |

### Differentiators (Competitive Advantage)

These are where this site can stand apart from both generic portfolio templates and generic dev blogs — chosen to reinforce the specific brand (craft, Japanese aesthetic, multi-pillar "documenting the journey" story) without requiring a backend.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Distinctive minimalist design with real Japanese-aesthetic craft (typography, whitespace/"ma", restrained motion) | This is explicitly the stated differentiator in PROJECT.md — the #1 way to avoid "looks like every other dev portfolio template." Design quality is itself a portfolio piece for a developer | MEDIUM-HIGH | Front-load this: typography scale, spacing system, and a couple of signature interaction details (page transitions, hover states) done well beat many shallow features |
| Cross-pillar narrative connecting software/SaaS, investing, and Aikido/Japan | Multi-topic personal blogs work when the topics are bridged under one clear identity/story rather than siloed as separate unrelated blogs — the About page and homepage copy are what make 3 pillars read as one coherent person instead of a confused site | LOW (mostly copywriting/IA, not code) | This is a content-strategy differentiator, not an engineering one — but it determines nav structure and homepage narrative |
| "Now" page (what Rasmus is focused on currently) | Classic personal-site pattern (nownownow.com convention) that signals an actively maintained, living site rather than a static CV — cheap, high personality payoff | LOW | One MDX/static page, manually updated every so often |
| "Uses"/tools page (dev setup, editor, hardware) | Popular with developer audiences; low effort, gives technical readers/recruiters another data point on how you work | LOW | Static page, no backend |
| Colophon / "how this site is built" page | Developer audiences (your target readers and technical recruiters) love seeing the stack that built the thing they're looking at — reinforces craft and technical credibility for free | LOW | One page listing Next.js/Tailwind/MDX/Vercel choices and why |
| Post series/collections for multi-part deep dives | Lets each pillar build a coherent body of work over time (e.g. an "Investing Journey" series, an "Aikido & Japan" series) rather than a flat undifferentiated post list — increases perceived depth and encourages binge-reading within a pillar | LOW-MEDIUM | Needs a `series` field in frontmatter; renders as an ordered sub-list on relevant posts |
| Public goal/progress marker for the investing journey (e.g. progress toward the 1M DKK target) | Concrete "documenting the journey" artifact that's rare, memorable, and directly ties to the stated personal brand angle — differentiates from generic finance content because it's this specific person's real numbers/milestones | LOW-MEDIUM | Can be a hand-edited static data file (JSON/MDX) rendered as a simple progress indicator — no backend or live brokerage integration needed |
| Dynamic per-post OG images | Every shared link (LinkedIn, X, Slack) gets a branded, on-theme preview image instead of a generic favicon/blank card — meaningfully improves click-through when posts are shared, and reinforces brand consistency | LOW-MEDIUM | Next.js `opengraph-image.tsx` + Satori generates these at build time for static export, no runtime server needed |
| Table of contents on long-form posts | Technical/investing deep-dives tend to run long; a sticky ToC improves scannability and dwell time, which correlates with SEO signals | LOW | rehype-slug + rehype-autolink-headings to generate anchor IDs, then render a ToC from the post's heading tree |
| Dark/light mode with system-preference default | Strong baseline expectation in developer circles specifically (vs. general consumer sites); signals attention to detail | LOW-MEDIUM | Needs to be part of the design system from the start, not retrofitted — retrofitting dark mode after shipping a light-only design system is a common source of rework |
| Static full-text search (e.g. Pagefind) | Zero-backend, build-time-indexed search that works with a fully static MDX site — useful once the archive is large enough that tag browsing alone isn't enough | MEDIUM | Explicitly a v2+ feature (see MVP Definition) — not worth the complexity until there's a real archive to search |
| RSS/Atom feed | The research is consistent that RSS is having a real resurgence among developer audiences in 2026 as an algorithm-free way to keep readers coming back — directly serves the stated goal of "readers come back for the blog" without relying on any platform or newsletter | LOW | Standard Next.js route handler generating XML from post frontmatter; needs the same metadata already required for SEO |
| Site changelog page | Shows the site itself is treated with engineering rigor (a version-controlled log of what changed and when) — subtle but effective credibility signal to a technical audience | LOW | Simple MDX page, manually appended per meaningful update |

### Anti-Features (Commonly Requested, Often Problematic)

Features that look good on paper for a solo personal-brand site but are common regrets — either because they add ongoing maintenance burden disproportionate to current traffic/audience, or because they're premature relative to having content and readers first.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Headless CMS / non-git content editing | Feels more "professional," easier for non-technical editing | Adds an external service dependency, ongoing cost risk, and a second system to keep in sync — for a solo developer comfortable in git/MDX, it solves a problem that doesn't exist yet | Git-based MDX (already the PROJECT.md decision) — commit content the same way you commit code |
| Contact form with backend | Feels more polished than "just email me" | Requires a server/serverless function, spam handling, and ongoing maintenance for a marginal UX gain over mailto | `mailto:` link + social profile links (already the PROJECT.md decision) |
| Newsletter signup + sending infrastructure | Seems like an obvious growth lever, easy to set up with free tiers (Buttondown, etc.) | With no existing audience, a newsletter becomes an empty list and an extra recurring obligation (cadence pressure) on top of the blog itself — splits effort before there's evidence anyone wants it | Ship the RSS feed and let organic readers subscribe there for free; revisit a newsletter only once readers are explicitly asking for one or there's a real list to email |
| Analytics dashboard / goals tracking UI | Feels necessary to "know if it's working" | Premature before there's meaningful traffic to analyze; building a dashboard is itself a distraction from writing, and vanity metrics (pageviews with no context) don't change what to write next | If curiosity demands *something*, use a lightweight privacy-friendly tool's own hosted dashboard (e.g. Vercel Analytics free tier) rather than building a custom analytics UI |
| Comments system (Disqus, self-hosted, etc.) | Feels like it drives "engagement" | Spam/moderation burden for a solo maintainer, breaks the minimalist aesthetic, and rarely produces real discussion at low traffic — most comment sections on small blogs are dead or spam-only | Link out to the post's discussion on X/LinkedIn/Hacker News if one happens; consider Webmentions later if genuinely valuable |
| Multi-author / editorial workflow tooling | Templates often ship this by default | Pure overhead for a single-author site — draft/review/approval flows solve a collaboration problem this project doesn't have | A simple `draft: true` frontmatter flag is enough to keep unfinished posts out of production |
| i18n / Danish translation at launch | Feels natural since the author is Danish | Doubles content-maintenance cost per post before there's evidence non-English readers are the audience; routing/i18n infrastructure is real complexity for zero validated demand | English-only per PROJECT.md; add Danish per-post later only if requested, without a structural rewrite |
| Interactive timeline of the journey | Visually impressive, fits the "documenting the journey" narrative | High design/build effort relative to value before there's enough journey content (posts, milestones) to populate it meaningfully — becomes an empty showpiece | Ship the blog and series/tags first; a timeline can later be auto-derived from post metadata once there's enough history to visualize |
| Overbuilt tagging taxonomy (many nested tags/categories) | Feels thorough, "future-proof" | Produces empty or near-empty tag pages early on, which look worse than no tags at all, and creates a maintenance tax on every new post (which tags? how many?) | Keep tags flat and small — roughly one tag set per content pillar (software, SaaS/products, investing, Aikido/Japan) plus a handful of cross-cutting topical tags, added only as genuinely needed |
| Client-side full-text search before there's an archive | Feels like a "complete" feature | Indexing/search UI complexity isn't justified when tag browsing already covers a small number of posts; adds a build step and JS payload for no real user benefit yet | Defer to v2+ (Pagefind or similar) once the archive is large enough (rough heuristic: 20-30+ posts) that tag pages alone aren't enough to navigate it |
| Polishing the design system indefinitely before publishing content | Perfectionism is a well-documented failure mode for solo personal sites — it's tempting because design work always feels "not quite done" | The core value stated in PROJECT.md is explicit: if writing a new post is ever a chore, the point is lost. An endless design refactor loop delays the actual goal (a live site with a growing archive) | Ship a deliberately restrained v1 design (see Table Stakes + a few Differentiators), launch, and let real content and real feedback drive further design iteration |
| Per-project case study CMS/backend editor | Feels like the "proper" way to manage rich project writeups | No content backend is needed for what is, at most, a few long-form MDX pages — building an editing system for a handful of pages is solving a scale problem that doesn't exist | One MDX file per case study, same pattern as blog posts (already deferred to v1.1 per PROJECT.md, which is the right call) |

## Feature Dependencies

```
Tags/Categories taxonomy
    └──requires──> Post frontmatter schema (title, date, tags, description)
                       └──enables──> Related posts
                       └──enables──> Tag archive pages
                       └──enables──> RSS/Atom feed
                       └──enables──> SEO meta tags + JSON-LD structured data
                       └──enables──> Dynamic OG image generation (needs title/description)

Series/collections
    └──requires──> Post frontmatter `series` field
    └──enhances──> Related posts (series siblings are the strongest "related" signal)

Table of Contents
    └──requires──> Heading IDs (rehype-slug / rehype-autolink-headings)

Dark mode
    └──should precede──> Any heavy custom illustration/motion work
                          (retrofitting dark mode into a light-only design system is common rework)

Static full-text search (Pagefind)
    └──requires──> A meaningful archive of posts (heuristic: 20-30+)
    └──requires──> Fully static build output (compatible with SSG, already the plan)

Investing goal/progress marker
    └──requires──> A simple static data file/schema (no backend)
    └──enhances──> "Documenting the journey" narrative on About/homepage

Newsletter (deferred) ──conflicts with── Ship-early philosophy
    (adds recurring cadence obligation before there's audience signal to justify it)

Custom CMS/backend for content ──conflicts with── $0/month budget, git-only workflow (PROJECT.md constraint)
```

### Dependency Notes

- **Related posts, tag archives, RSS, and SEO metadata all depend on the same post frontmatter schema.** Design that schema (title, date, description, tags, series, draft) once, early, and every downstream feature becomes close to free — this is the single highest-leverage piece of plumbing for this project.
- **Series enhances related posts** by giving a stronger relevance signal than tags alone (a reader mid-way through the "Investing Journey" series should see the next entry before a loosely tagged unrelated post).
- **Dark mode should be decided before investing heavily in bespoke visual design** (the Japanese-aesthetic differentiator) — building the design system dark-mode-aware from day one avoids a costly retrofit later.
- **Static search conflicts with "ship early"** if attempted at launch — it's explicitly sequenced to v2+, gated on archive size, not a fixed date.
- **Newsletter and CMS both conflict with current constraints** (no audience yet; $0 budget/git-only workflow respectively) — both are anti-features for now, not permanently ruled out.

## MVP Definition

### Launch With (v1)

Matches PROJECT.md's Active requirements — the minimum to be a credible, complete personal site.

- [ ] Homepage with clear intro/value prop and brand narrative — first impression for recruiters and readers alike
- [ ] About page covering developer/aikidoka/investor background — the connective tissue for the multi-pillar story
- [ ] Projects page (3-5 curated project cards: description, stack, links) — what recruiters/clients scan for
- [ ] Blog with git-based MDX posts: list view (title, date, excerpt, reading time, tags), individual post pages, syntax highlighting, tag archive, related posts — table stakes for a credible blog
- [ ] Contact page (mailto + social links) — zero-backend, matches budget
- [ ] Responsive design — non-negotiable baseline
- [ ] SEO foundation: meta tags per page/post, sitemap.xml, OG images (can start static, upgrade to dynamic in v1.x), robots.txt — needed for any organic discoverability at all
- [ ] Fast performance (SSG/ISR, next/image, Core Web Vitals-clean) — affects both credibility and SEO ranking
- [ ] Live deployment on Vercel free tier — ship it

### Add After Validation (v1.x)

Add once the core is live and the first several posts are published — triggered by "the basics work, now make the blog experience and discoverability genuinely good."

- [ ] RSS/Atom feed — trigger: first handful of posts published; low effort, directly serves "readers come back" goal
- [ ] Dynamic per-post OG images — trigger: posts start getting shared externally
- [ ] JSON-LD structured data (Person, BlogPosting/Article schema) — trigger: want stronger SEO signal once there's content worth ranking
- [ ] Table of contents on long-form posts — trigger: first post that's genuinely long (technical deep-dive or investing writeup)
- [ ] Dark/light mode — trigger: before/alongside first major visual design pass, not after
- [ ] Now page, Uses page, Colophon — trigger: any time; cheap, high personality payoff, no dependencies
- [ ] Series/collections grouping for multi-part pillar content — trigger: second post in any pillar that's clearly part of a sequence

### Future Consideration (v2+)

Defer until there's real traffic, a real archive, or explicit reader/audience signal — building these early is exactly the anti-feature trap this research flags.

- [ ] Static full-text search (Pagefind) — defer until archive is large enough that tags alone don't suffice
- [ ] Public investing goal/progress marker — defer until comfortable publishing real numbers publicly; content-strategy decision as much as engineering one
- [ ] Aikido training log/timeline — defer until there's enough Aikido content to warrant a dedicated structured view
- [ ] Per-project case study deep-dive pages — already deferred to v1.1 per PROJECT.md
- [ ] Newsletter — defer until readers are explicitly asking for one
- [ ] Command palette (Cmd+K) navigation — polish feature, no functional gap it fills yet
- [ ] Webmentions or other comment-alternative — defer until there's real cross-site conversation to surface
- [ ] Custom domain — already deferred one month per PROJECT.md, not a code dependency

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Post frontmatter schema (title, date, description, tags) | HIGH | LOW | P1 |
| Blog list + post pages + syntax highlighting | HIGH | MEDIUM | P1 |
| Projects showcase (3-5 curated) | HIGH | LOW | P1 |
| SEO meta tags + sitemap | HIGH | LOW | P1 |
| Responsive, fast, accessible baseline | HIGH | MEDIUM | P1 |
| Contact via mailto + socials | MEDIUM | LOW | P1 |
| Distinctive design/craft (Japanese aesthetic) | HIGH | MEDIUM-HIGH | P1 |
| RSS feed | HIGH | LOW | P2 |
| Related posts / tag archive | MEDIUM-HIGH | LOW-MEDIUM | P2 |
| Dynamic OG images | MEDIUM | LOW-MEDIUM | P2 |
| Dark mode | MEDIUM | LOW-MEDIUM | P2 |
| Now/Uses/Colophon pages | MEDIUM | LOW | P2 |
| Table of contents | MEDIUM | LOW | P2 |
| Series/collections | MEDIUM | LOW-MEDIUM | P2 |
| Static search | LOW (at launch) | MEDIUM | P3 |
| Investing goal tracker page | MEDIUM | LOW-MEDIUM | P3 |
| Aikido timeline | LOW (at launch) | MEDIUM | P3 |
| Newsletter | LOW (no audience yet) | MEDIUM | P3 |
| Headless CMS | LOW (contradicts constraints) | HIGH | Do not build |
| Contact form backend | LOW (mailto suffices) | MEDIUM | Do not build |
| Comments system | LOW-MEDIUM | MEDIUM-HIGH | Do not build |
| Analytics dashboard UI | LOW | MEDIUM | Do not build |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add within first few months once posting cadence is established
- P3: Nice to have, future consideration gated on real signal (traffic, audience, archive size)

## Competitor Feature Analysis

Comparing three archetypes found in the research: the generic developer-portfolio template, the established solo-developer blog (e.g. Josh Comeau/Lee Robinson/Swyx-style personal sites), and this project's intended approach.

| Feature | Generic Portfolio Template | Established Solo Dev Blog (Comeau/Robinson/Swyx-style) | Our Approach |
|---------|----------------------------|----------------------------------------------------------|--------------|
| Design identity | Reused theme/template, swapped colors and name | Heavily bespoke, hand-crafted typography and interaction details, unmistakably personal | Bespoke minimalist design with Japanese-aesthetic influence — explicit differentiator per PROJECT.md, not a template |
| Content scope | CV-equivalent: skills, experience, projects, nothing else | Deep technical writing as the core, portfolio secondary | Portfolio + blog both first-class, blog spans three pillars (dev/SaaS, investing, Aikido/Japan) unified by one personal narrative |
| Content backend | Often a CMS or page builder | Almost universally git-based MDX/Markdown, matching the author's own workflow | Git-based MDX, no CMS — matches PROJECT.md constraint and this project's audience's expectations |
| SEO/discoverability | Inconsistent — often missing sitemap/OG/structured data | Strong by default — these developers write extensively about their own SEO/RSS/OG setup, treat it as part of the craft | Full SEO foundation from v1 (meta, sitemap, OG), RSS/structured data added early in v1.x |
| "Personality" pages (Now/Uses/Colophon) | Rare or absent | Common, expected within this community | Adopted as low-cost, high-payoff differentiators |
| Comments/newsletter | Sometimes bolted on regardless of audience size | Newsletter often present, but only after significant audience already exists | Explicitly deferred (anti-feature) until audience signal exists — matches PROJECT.md's stated reasoning |
| Case studies | Rare, if present usually thin | Often has deep technical writeups per project | Deferred to v1.1 per PROJECT.md — right sequencing, not a gap |

## Sources

- [Developer Portfolio Guide 2026 — Hakia](https://hakia.com/skills/building-portfolio/) — MEDIUM confidence (single-source SEO content, but consistent with other results)
- [Josh W. Comeau — How I Built My Blog v2](https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/) — HIGH confidence (primary source, practitioner-authored)
- [Josh W. Comeau — Building an Effective Dev Portfolio (PDF)](https://storage.googleapis.com/joshwcomeau/building-an-effective-dev-portfolio.pdf) — referenced via search summary, not directly fetchable (size limit); treat as MEDIUM confidence pending direct read
- [Next.js official docs — Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — HIGH confidence (official framework documentation)
- [Rehype Pretty Code documentation](https://rehype-pretty.pages.dev/) — HIGH confidence (official library docs)
- [shinyaz.com — Auto-Generating Dynamic OG Images for a Next.js Blog](https://shinyaz.com/en/blog/2026/02/28/dynamic-og-images) — MEDIUM confidence (recent practitioner post, dated 2026)
- [Felix Runquist — Generating a sitemap and RSS feed with Next.js](https://felixrunquist.com/posts/generating-sitemap-rss-feed-with-next-js) — MEDIUM confidence
- [Jon Bellah — Adding an RSS Feed to a Next.js Blog](https://jonbellah.com/articles/rss-feed-nextjs) — MEDIUM confidence
- [Stuudios — How to Grow A Multi-Niche Blog](https://stuudios.com/blog/multi-niche-blog) — MEDIUM confidence (practitioner experience, aligns with general content-strategy consensus)
- [Forbes Councils — Why Documenting Your Journey Is Key to Personal Brand](https://www.forbes.com/councils/forbesbusinesscouncil/2022/01/25/why-documenting-your-journey-is-a-key-aspect-of-building-your-personal-brand/) — MEDIUM confidence
- [dev.to — You don't need a personal website (and why I no longer have one)](https://dev.to/kdipippo/you-dont-need-a-personal-website-and-why-i-no-longer-have-one-3ap9) — LOW-MEDIUM confidence (single-perspective anecdote, used only to corroborate the perfectionism/over-engineering anti-pattern already seen elsewhere)
- Indie Hackers newsletter discussion threads (aggregate, multiple threads) — LOW-MEDIUM confidence (community opinion, not authoritative, but consistent directional signal: newsletters work best with existing audience or explicit monetization intent, neither of which applies here yet)
- Project context: `.planning/PROJECT.md` — HIGH confidence (primary source for this project's constraints and decisions)

---
*Feature research for: Personal developer portfolio + blog (git-based MDX, solo long-term personal brand)*
*Researched: 2026-07-10*
