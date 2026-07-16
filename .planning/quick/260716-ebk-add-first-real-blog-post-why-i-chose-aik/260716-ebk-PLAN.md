---
phase: quick-260716-ebk
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [content/posts/why-i-chose-aikido.mdx]
autonomous: true
requirements: [BLOG-01, BLOG-02]
must_haves:
  truths:
    - "content/posts/why-i-chose-aikido.mdx exists with the approved frontmatter and body VERBATIM"
    - "npm run build succeeds — Velite validates the post against the posts schema with no errors"
    - "The post renders at /blog/why-i-chose-aikido (generateStaticParams resolves the new slug)"
    - "The /blog index shows the post instead of the 'No posts yet' empty state"
    - "The homepage 'Latest Writing' teaser shows the post"
  artifacts:
    - path: "content/posts/why-i-chose-aikido.mdx"
      provides: "The first real published blog post"
      contains: "Why I Chose Aikido"
  key_links:
    - from: "velite.config.ts (posts collection)"
      to: "content/posts/why-i-chose-aikido.mdx"
      via: "posts/*.mdx glob pattern → .velite/posts.json"
      pattern: "why-i-chose-aikido"
    - from: "src/lib/posts.ts getAllPosts()"
      to: "#site/content posts array"
      via: "consumed by /blog index and homepage Latest Writing teaser"
      pattern: "getAllPosts"
---

<objective>
Create Rasmus's first real blog post at `content/posts/why-i-chose-aikido.mdx` using the exact, already-approved frontmatter and body content. This is a single content-file addition — no config, route, template, or other content changes.

Purpose: The `content/posts/` directory currently holds only `.gitkeep`, so `/blog` renders "No posts yet" and the homepage teaser is empty. This post is the first published content that flips the site from empty-state to live.
Output: One new `.mdx` file that Velite validates and generates at build time.
</objective>

<execution_context>
@$HOME/.claude-account-b-account-b/get-shit-done/workflows/execute-plan.md
@$HOME/.claude-account-b-account-b/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

# Content pipeline (DO NOT MODIFY — read only, to match the schema exactly)
@velite.config.ts
@src/lib/posts.ts
</context>

<schema_reference>
The `posts` collection schema in `velite.config.ts` (authoritative — match it exactly):

- `title` — string, max 99 chars. (The approved title is 57 chars — passes.)
- `date` — `s.isodate()`, i.e. an ISO date string like `"2026-07-16"`. Passes.
- `tags` — array of strings.
- `excerpt` — string (MANUAL field, D-10 — must be present).
- `draft` — boolean, defaults to false; the approved frontmatter sets it explicitly to `false`.
- `metadata` / `code` — computed by Velite from the file itself; NOT written in frontmatter.
- `slug` — derived from the filename (`why-i-chose-aikido`), NOT a frontmatter field. Do NOT add a `slug` key.

The MDX body follows the closing `---` of the frontmatter.
</schema_reference>

<tasks>

<task type="auto">
  <name>Task 1: Create the approved blog post file verbatim</name>
  <files>content/posts/why-i-chose-aikido.mdx</files>
  <content_verbatim>
Write the file with EXACTLY these bytes — frontmatter and body copied character-for-character. Do NOT rewrite, embellish, reword, re-tag, or "improve" the prose. The em-dash characters (—) and the apostrophes (I'm, it's, that's) must be preserved as-is.

```
---
title: "Why I Chose Aikido — And Why I'm Finally Writing About It"
date: "2026-07-16"
tags: ["aikido", "japan"]
excerpt: "How a chance glance across a dojo in 2015 led me to Aikido — and why I'm finally starting to write about what happens on the mat."
draft: false
---

## Why Aikido

I've been a fan of Japan for as long as I can remember — not just because of anime, but because of the culture itself. So it felt natural that my first martial arts class was Jiu-Jitsu.

During training, I'd often glance across the dojo to the other side of the room, where an Aikido class was underway. It looked different from what I was doing — softer, smoother, almost peaceful — and it caught my attention. Looking closer one day, I recognized the sensei: my old German teacher from school. Standing beside him, one of his students, was another teacher I recognized from school as well. It was a strange, funny coincidence — I already knew these two were into Japan, and I already thought they were great people. Finding out they practiced Aikido made me want to try it myself.

The week after, I joined a class. I don't remember for certain whether I brought my best friend Jonas along on that first session or the one after, but I do remember training alongside him from early on. I was hooked almost immediately. That was back in 2015.

What Aikido gave me wasn't really physical — it was a shift in how I think about approaching life. Alongside Aikido, I also train in Toho Iai, and together the two have changed how I carry myself, both on the mat and off it. I didn't really understand any of this when I started. It's only years later, looking back, that I can actually see how much it's shaped me.

## Where I Am Now

I'm currently 2nd Kyu, working toward 1st Kyu, with 1st Dan as my goal in around two years. Part of what makes that goal exciting is that it may be possible to test for 1st Dan in my hometown — which would make the milestone feel even more meaningful.

## What's Next

This is one of the first posts on this site, and I expect it to be the start of something longer. I'll be writing more about Aikido, alongside programming, AI, and my disc golf journey. If you have questions or just want to talk shop, feel free to reach out — you'll find my contact details on the About/Contact page.
```
  </content_verbatim>
  <action>Create `content/posts/why-i-chose-aikido.mdx` using the Write tool with the content in `<content_verbatim>` above, byte-for-byte. Place the frontmatter between the two `---` fences, then a blank line, then the MDX body. Do NOT add a `slug` field (it is filename-derived per velite.config.ts). Do NOT add `metadata` or `code` (Velite computes those). Do NOT touch `velite.config.ts`, any route, any template, or `.gitkeep`. This is the only file the plan changes.</action>
  <verify>
    <automated>test -f content/posts/why-i-chose-aikido.mdx && grep -q 'Why I Chose Aikido' content/posts/why-i-chose-aikido.mdx && grep -q 'draft: false' content/posts/why-i-chose-aikido.mdx && grep -q 'tags: \["aikido", "japan"\]' content/posts/why-i-chose-aikido.mdx && echo OK</automated>
  </verify>
  <done>The file exists at `content/posts/why-i-chose-aikido.mdx` with the approved frontmatter (title, date 2026-07-16, tags [aikido, japan], excerpt, draft: false) and the three-section body (## Why Aikido, ## Where I Am Now, ## What's Next), verbatim and unaltered.</done>
</task>

<task type="auto">
  <name>Task 2: Build and verify the post is generated and surfaced end-to-end</name>
  <files>content/posts/why-i-chose-aikido.mdx</files>
  <action>Run `npm run build`. Velite runs first (wired via next.config.mjs top-level await) and validates the post against the posts schema, then Next.js statically generates the blog route. Confirm the build exits 0 with no Velite schema errors. Then confirm the post reached the generated content layer and the routes that consume it: the slug appears in `.velite/posts.json`, the static blog route resolved the new slug (via generateStaticParams over getAllPosts), and the `/blog` index no longer falls into its `posts.length === 0` "No posts yet" branch. If the build fails on a schema error, re-check the frontmatter matches the `<schema_reference>` exactly — do NOT edit velite.config.ts or any route to make it pass; the fix is always in the content file.</action>
  <verify>
    <automated>npm run build 2>&1 | tee /tmp/ebk-build.log | tail -5; grep -q 'why-i-chose-aikido' .velite/posts.json && echo VELITE_OK; grep -Eq '/blog/\[slug\]|why-i-chose-aikido' /tmp/ebk-build.log && echo ROUTE_OK</automated>
  </verify>
  <done>`npm run build` succeeds; `.velite/posts.json` contains the `why-i-chose-aikido` slug; the build output shows the blog `[slug]` route was statically generated. The `/blog` index and homepage "Latest Writing" teaser now render this post (they read the same draft-filtered `getAllPosts()` the build just populated).</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

No new trust boundaries. This is a single static, build-time content file authored by the site owner. No user input, no runtime data flow, no network surface, no new dependency.

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-ebk-01 | Tampering | content/posts/*.mdx build validation | mitigate | Velite Zod schema validates frontmatter at build time; a malformed post fails `npm run build` before deploy (Task 2 gate). |
| T-ebk-SC | Tampering | package installs | accept | No packages installed or modified — content-only change; supply-chain surface unchanged. |
</threat_model>

<verification>
- `npm run build` completes with exit code 0 and no Velite schema errors.
- `.velite/posts.json` contains an entry with slug `why-i-chose-aikido`.
- Blog `[slug]` route statically generated (generateStaticParams resolved the new slug; `dynamicParams = false`).
- `/blog` index renders the post row instead of "No posts yet".
- Homepage "Latest Writing" teaser renders the post (top of `getAllPosts().slice(0,3)`, since it is the most recent by date).
</verification>

<success_criteria>
- One new file, `content/posts/why-i-chose-aikido.mdx`, containing the approved content verbatim.
- No other file changed (velite.config.ts, routes, templates, and existing content untouched).
- Build succeeds and the post is live at `/blog/why-i-chose-aikido`, on the `/blog` index, and in the homepage teaser.
</success_criteria>

<output>
Create `.planning/quick/260716-ebk-add-first-real-blog-post-why-i-chose-aik/260716-ebk-SUMMARY.md` when done.
</output>
