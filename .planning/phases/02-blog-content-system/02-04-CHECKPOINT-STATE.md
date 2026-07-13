---
phase: 02-blog-content-system
plan: 04
status: awaiting-human-verify-checkpoint
checkpoint_task: "Task 2: Rasmus reviews the drafts and approves flipping them to non-draft (D-14)"
---

# Phase 2 Plan 04: Checkpoint State (Task 1 complete, Task 2 awaiting human review)

This is a partial-state notes file, not the final plan SUMMARY. It exists so no
work is lost if this worktree is torn down before the checkpoint is resolved.
The final `02-04-SUMMARY.md` should be written by the continuation agent after
Rasmus responds to the checkpoint, once draft flags are set per his instructions.

## Completed: Task 1 — Draft 3 launch posts

Commit: `91b7d04` — `feat(02-04): draft 3 launch posts as schema-valid MDX (draft:true)`

Files created (all currently `draft: true`):

| File | Pillar(s) | Tags | Date | Notes |
|------|-----------|------|------|-------|
| `content/posts/starting-to-invest-at-thirty.mdx` | investing | `["investing", "japan"]` | 2026-06-15 | Grounded in: started investing at 30, targeting 1M DKK portfolio, connects to Japan goal |
| `content/posts/what-aikido-taught-me-about-shipping.mdx` | aikido + software | `["aikido", "japan", "software"]` | 2026-06-29 | Grounded in: training under sensei Shoji Nishio, first Japan trip = international Aikido seminar with 8 training partners |
| `content/posts/why-i-write-code-toward-japan.mdx` | software + entrepreneurship | `["software", "entrepreneurship", "japan"]` | 2026-07-10 | Contains a fenced ```ts code block (BLOG-03 syntax highlighting exercised) |

Verification performed and passed:
- `npx velite --clean` — all three posts validate against the D-09 Zod schema, no errors
- All three slugs present in `.velite` output: `starting-to-invest-at-thirty`, `what-aikido-taught-me-about-shipping`, `why-i-write-code-toward-japan`
- Tag "japan" appears in all 3 posts (>=2 required by plan) — genuine related-posts/tag-archive matches guaranteed
- Tag "software" appears in 2 posts (posts 2 and 3)
- `why-i-write-code-toward-japan.mdx` contains a fenced code block (confirmed via grep)
- Each post has 2-3 `##` headings and 480-560 words of real, non-placeholder prose
- No `slug` or `coverImage` frontmatter keys present on any post
- All three currently `draft: true`

## Awaiting: Task 2 — Human-verify checkpoint (D-14)

Type: `checkpoint:human-verify`, gate: `blocking`

**What's built:** Three launch posts drafted (all `draft: true`):
- `starting-to-invest-at-thirty` (investing)
- `what-aikido-taught-me-about-shipping` (aikido/software)
- `why-i-write-code-toward-japan` (software/entrepreneurship, includes a code block)

Prose is grounded in the real biography from PROJECT.md (investing at 30 toward
a 1M DKK portfolio; training under the late sensei Shoji Nishio; first Japan
trip as an international Aikido seminar with 8 training partners).

**How to verify:**
1. Read the three files in `content/posts/*.mdx` — check the prose reads as
   Rasmus's own voice and the biographical details are accurate, not
   misremembered.
2. Optionally run `npm run dev` and browse the drafts (blog routes arrive in
   Wave 3; preview raw or via a dev build in the meantime).
3. Edit any prose/titles/tags/dates directly in the files if desired.
4. Tell the executor which posts to publish.

**Resume signal:** Reply "publish all" to approve all three, or list which
posts to publish (others stay `draft: true`), or describe edits to make first.

## What the continuation agent must do once Rasmus responds

1. Apply any requested prose/title/tag/date edits to the `.mdx` files.
2. Flip `draft: true` -> `draft: false` on ONLY the approved posts (any held
   back stay `draft: true`, excluded from all public views per D-11).
3. Re-run `npx velite --clean` to confirm the schema still validates after any
   edits and the flip.
4. Commit the Task 2 changes (`fix` or `feat` type depending on whether edits
   were substantive) referencing this plan.
5. Write the final `.planning/phases/02-blog-content-system/02-04-SUMMARY.md`
   per the template, recording the final published slugs and their tag sets,
   and which (if any) posts remain draft — this is required by the plan's
   `<output>` spec for Wave 3's route/homepage plans to verify against.
6. Run the plan's overall `<verification>` block again post-flip.
