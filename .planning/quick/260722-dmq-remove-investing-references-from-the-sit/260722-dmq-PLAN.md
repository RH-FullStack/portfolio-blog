---
phase: quick
plan: 260722-dmq
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/site-config.ts
  - src/app/layout.tsx
  - src/app/(site)/page.tsx
  - src/app/(site)/contact/page.tsx
  - src/app/(site)/blog/tags/[tag]/page.tsx
  - src/app/(site)/blog/page.tsx
  - src/app/(site)/about/page.tsx
autonomous: true
requirements: [REMOVE-INVESTING-REFERENCES]
must_haves:
  truths:
    - "No form of the word invest (invest / investor / investing / investment) appears anywhere under src/ — a case-insensitive grep returns zero matches."
    - "The site tagline reads 'Developer, aikidoka, discgolf pro.' — the 'investor' item is gone."
    - "Every SEO/metadata description (root layout ×3, home, blog index, blog tag archive, contact, about) describes Rasmus via software + aikido only, with no investing clause and no leftover comma/'and long-term' fragment."
    - "The About page tells a coherent TWO-thread story (developer + aikido): it has exactly 4 <p> tags in the Prose block, the investor-thread paragraph is fully deleted, and the surrounding aikido + closing prose reads naturally as two threads (no dangling 'all three' / 'portfolio' references, no gap where the third thread was)."
    - "The visible blog-index body copy reads 'Writing on software and aikido — the compounding threads toward Japan.'"
    - "The site still builds and lints clean after the edits — deleting the About investor paragraph left valid JSX."
  artifacts:
    - path: "src/lib/site-config.ts"
      provides: "Site tagline without the investor item"
      contains: "Developer, aikidoka, discgolf pro."
    - path: "src/app/layout.tsx"
      provides: "Root + OpenGraph + Twitter descriptions, all three investing-free"
    - path: "src/app/(site)/page.tsx"
      provides: "Home metadata.description without the investor clause"
    - path: "src/app/(site)/contact/page.tsx"
      provides: "Contact metadata.description without the investing clause"
    - path: "src/app/(site)/blog/tags/[tag]/page.tsx"
      provides: "Tag-archive generateMetadata description without long-term investing"
    - path: "src/app/(site)/blog/page.tsx"
      provides: "Blog-index metadata.description and visible body copy, both investing-free"
    - path: "src/app/(site)/about/page.tsx"
      provides: "Two-thread About narrative (developer + aikido), exactly 4 <p> tags"
      contains: "the developer and aikidoka threads told"
  key_links:
    - from: "src/app/(site)/about/page.tsx"
      to: "the word invest"
      via: "must NOT be linked — full case-insensitive grep of src/ returns zero matches after edits"
      pattern: "invest"
---

<objective>
Remove every mention of investing from the live site's user-facing copy and SEO metadata. Rasmus no longer wants the investor identity presented publicly. The change touches seven files: six are single-string swaps in taglines / metadata descriptions, and the seventh — the About page — needs light narrative surgery because it currently tells the story as three braided threads (developer, aikido, investor) and dropping the third thread means the surrounding prose has to read naturally as two threads, not three with a hole in the middle.

All wording below is final and approved — apply it verbatim. Do not paraphrase, do not invent alternate phrasing, and do not touch layout, components, styling, blog-post content, `.planning/` docs, or `CLAUDE.md`.

Purpose: The public site presents Rasmus as a software developer and aikidoka only — consistent messaging with no investing angle.
Output: Seven edited source files; a full case-insensitive grep of `src/` for "invest" returning zero matches; a green build + lint proving the About-page paragraph deletion left valid JSX.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@.planning/STATE.md

@src/lib/site-config.ts
@src/app/layout.tsx
@src/app/(site)/page.tsx
@src/app/(site)/contact/page.tsx
@src/app/(site)/blog/tags/[tag]/page.tsx
@src/app/(site)/blog/page.tsx
@src/app/(site)/about/page.tsx

<facts>
Reference audit already performed during planning (recorded so the executor does not re-derive it — the final task re-confirms via grep):

- A case-insensitive grep for "invest" across `src/` returns exactly 13 lines, all inside the seven files listed above. No blog post (`src/content/**/*.mdx`), component, or other source file contains the word. After these edits `src/` must grep clean.
- `.planning/` docs and `CLAUDE.md` also contain "invest" — those are OUT OF SCOPE and must NOT be edited (they are an unmodified historical record / project instructions).
- No blog post currently uses an "investing" tag, so the tag-archive copy change (file 5) affects no rendered tag page content — it only edits the `generateMetadata` template string.
- The `layout.tsx` description string is duplicated verbatim in THREE places (root `description`, `openGraph.description`, `twitter.description`, at lines 14 / 24 / 33 as of planning). All three must be replaced.
- The About page (`src/app/(site)/about/page.tsx`) currently has FIVE `<p>` blocks inside `<Prose>`: intro, developer thread, aikido thread, investor thread, closing. After edits it must have exactly FOUR (the investor-thread `<p>` is deleted entirely).
- Quote styles differ per file (single vs double vs backtick template literal) and the copy uses em dashes (—) and JSX HTML entities (`&apos;`, `&quot;`). Preserve these exactly — raw apostrophes in JSX text would trip the `react/no-unescaped-entities` lint rule.
- Package manager is npm. `npm run build` (which also type-checks via `next build`) and `npm run lint` are the relevant checks.

If the final grep unexpectedly finds "invest" somewhere in `src/` outside these seven files, STOP and report it in the SUMMARY rather than silently editing another file.
</facts>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Mechanical copy swaps across six files (tagline + metadata descriptions)</name>
  <files>src/lib/site-config.ts, src/app/layout.tsx, src/app/(site)/page.tsx, src/app/(site)/contact/page.tsx, src/app/(site)/blog/tags/[tag]/page.tsx, src/app/(site)/blog/page.tsx</files>
  <action>Apply the following seven exact find-and-replace swaps. Each is an approved final wording — do not paraphrase, and change nothing else on any line. Preserve the exact quote style (single vs double vs backtick), the em dashes (—), and the `${tag}` interpolation.

1. `src/lib/site-config.ts` — the `tagline` field. Replace the value `'Developer, aikidoka, investor, discgolf pro.'` with `'Developer, aikidoka, discgolf pro.'` (drop `investor, `).

2. `src/app/layout.tsx` — the description string appears verbatim in THREE places: the root `description`, `openGraph.description`, and `twitter.description`. In EACH of the three, replace `'Rasmus Hansen — software developer, aikidoka, and long-term investor. Projects and writing on building toward a life split between Denmark and Japan.'` with `'Rasmus Hansen — software developer and aikidoka. Projects and writing on building toward a life split between Denmark and Japan.'` All three occurrences must be updated (none left behind).

3. `src/app/(site)/page.tsx` — `metadata.description`. Replace `"Software developer, aikidoka, and long-term investor building toward a life split between Denmark and Japan — explore Rasmus Hansen's projects and writing."` with `"Software developer and aikidoka building toward a life split between Denmark and Japan — explore Rasmus Hansen's projects and writing."`

4. `src/app/(site)/contact/page.tsx` — `metadata.description`. Replace `'Get in touch with Rasmus Hansen — email and social links for work, collaboration, or a conversation about code, aikido, or investing.'` with `'Get in touch with Rasmus Hansen — email and social links for work, collaboration, or a conversation about code or aikido.'`

5. `src/app/(site)/blog/tags/[tag]/page.tsx` — the template literal inside `generateMetadata`. Replace the description text `Posts tagged "${tag}" — writing on software, aikido, and long-term investing.` with `Posts tagged "${tag}" — writing on software and aikido.` Keep the surrounding backticks and the `${tag}` interpolation intact.

6. `src/app/(site)/blog/page.tsx` — TWO edits in this file. (a) `metadata.description`: replace `'Writing by Rasmus Hansen on software development, aikido, long-term investing, and the craft of building things that last.'` with `'Writing by Rasmus Hansen on software development, aikido, and the craft of building things that last.'` (b) The visible `<p>` body copy under the `<h1>`: replace `Writing on software, aikido, and long-term investing — the compounding threads toward Japan.` with `Writing on software and aikido — the compounding threads toward Japan.`

Do not modify the About page in this task — that is Task 2.</action>
  <verify>
    <automated>! grep -riIn "invest" src/lib/site-config.ts src/app/layout.tsx 'src/app/(site)/page.tsx' 'src/app/(site)/contact/page.tsx' 'src/app/(site)/blog/tags/[tag]/page.tsx' 'src/app/(site)/blog/page.tsx' && echo TASK1_CLEAN</automated>
  </verify>
  <done>None of the six files contain any form of "invest" (prints TASK1_CLEAN); the tagline reads "Developer, aikidoka, discgolf pro." and all metadata descriptions read as the approved software+aikido wording, with quote styles and the `${tag}` interpolation preserved.</done>
</task>

<task type="auto">
  <name>Task 2: About-page narrative surgery — drop the investor thread, rewrite around it</name>
  <files>src/app/(site)/about/page.tsx</files>
  <action>Five edits in `src/app/(site)/about/page.tsx`. This is narrative surgery, not blind deletion — the prose must read naturally as a TWO-thread story (developer + aikido) afterward. Preserve every JSX HTML entity (`&apos;`, `&quot;`) and em dash exactly; keep every sentence not called out below character-for-character unchanged.

a. `metadata.description`. Replace `'The story behind Rasmus Hansen — how software development, aikido, and long-term investing braid into one path toward a life split between Denmark and Japan.'` with `'The story behind Rasmus Hansen — how software development and aikido braid into one path toward a life split between Denmark and Japan.'`

b. The file-header JSDoc comment above `export default function About()`. It currently reads (across three comment lines): "About page (Server Component) — the developer, aikidoka, and long-term investor threads told as ONE coherent story (CORE-02), not three siloed sections, woven around the Japan/freedom throughline from PROJECT.md." Rewrite that sentence to: "About page (Server Component) — the developer and aikidoka threads told as ONE coherent story (CORE-02), not two siloed sections, woven around the Japan/freedom throughline from PROJECT.md." (i.e. "the developer, aikidoka, and long-term investor threads" → "the developer and aikidoka threads"; "not three siloed sections" → "not two siloed sections"). Leave the "Static typed prose — no content pipeline needed for Phase 1." comment line untouched.

c. The aikido-thread paragraph — remove ONLY the investment-thesis clause. Replace the exact text `the same discipline that ships software and holds an investment thesis for a decade.` with `the same discipline it takes to actually finish something in code, not just start it.` Keep the rest of that paragraph — the Mark Jewkes sentence and the "This November … first trip to Japan …" seminar sentence — exactly as-is, character for character.

d. DELETE the entire investor-thread `<p>` block — the whole paragraph (opening `<p>` through closing `</p>`) that begins "The investor thread is the part most people don&apos;t see. I started investing at 30, …" and ends "… into a number I can actually track." Remove it entirely: no replacement paragraph, no placeholder, no empty tags left behind.

e. Rewrite the closing paragraph (the last `<p>` block, which currently starts "None of these are side projects to each other." and references "all three" / "the portfolio"). Replace that paragraph's body text with: "These aren&apos;t side projects to each other. The code funds the trips, and the mat teaches the patience the code needs to actually ship. This site is where I write that story down as it happens — the wins, the failed experiments, and the slow, compounding progress toward Japan." Keep the surrounding `<p>` / `</p>` tags; only the inner text changes. The result must contain no "invest", no "portfolio", and no "all three".

After all five edits the `<Prose>` block must contain exactly FOUR `<p>` tags (intro, developer thread, aikido thread, closing) — down from five — and the file must contain no form of the word "invest".</action>
  <verify>
    <automated>! grep -riIn "invest" 'src/app/(site)/about/page.tsx' && [ "$(grep -c '<p>' 'src/app/(site)/about/page.tsx')" = "4" ] && ! grep -in 'portfolio\|all three' 'src/app/(site)/about/page.tsx' && echo ABOUT_CLEAN</automated>
  </verify>
  <done>`src/app/(site)/about/page.tsx` has no form of "invest", no "portfolio", no "all three"; the Prose block has exactly 4 `<p>` tags; the developer + aikido narrative and closing paragraph read naturally as a two-thread story (prints ABOUT_CLEAN).</done>
</task>

<task type="auto">
  <name>Task 3: Verify the whole site is investing-free and still builds/lints</name>
  <files>(no files created — verification only)</files>
  <action>Prove the change is complete and sound end to end. First run a case-insensitive, recursive grep for "invest" across the entire `src/` tree — it MUST return zero matches. If it finds anything, STOP and report the file/line in the SUMMARY (a match outside the seven planned files is out of scope and needs a human decision; a match inside them means an edit was missed). Then run `npm run build` (this also type-checks via `next build`) — it MUST succeed, confirming the deleted About paragraph and all string edits left valid TSX/JSX. Then run `npm run lint` — it MUST pass clean (watch especially for `react/no-unescaped-entities` on the rewritten About text). Do not edit source to force these green beyond fixing an issue your own Task 1/Task 2 edits introduced.</action>
  <verify>
    <automated>! grep -riIn "invest" src/ && npm run build && npm run lint && echo VERIFIED</automated>
  </verify>
  <done>A recursive case-insensitive grep for "invest" across `src/` returns nothing, and `npm run build` + `npm run lint` both exit 0 (prints VERIFIED).</done>
</task>

</tasks>

<verification>
- Case-insensitive `grep -riIn "invest" src/` returns zero matches — no invest/investor/investing/investment anywhere under `src/`.
- Tagline in `src/lib/site-config.ts` reads "Developer, aikidoka, discgolf pro."
- All three `layout.tsx` descriptions, plus home, contact, blog-index, and blog-tag metadata descriptions use the approved software+aikido wording with no leftover comma/"and long-term" fragment.
- Blog-index visible body copy reads "Writing on software and aikido — the compounding threads toward Japan."
- `src/app/(site)/about/page.tsx` has exactly 4 `<p>` tags, no "invest"/"portfolio"/"all three", and reads as a coherent two-thread (developer + aikido) story.
- `.planning/` docs, `CLAUDE.md`, blog-post content, layout/components/styling, and all other files are untouched.
- `npm run build` and `npm run lint` pass.
</verification>

<success_criteria>
Every investing reference is removed from the site's user-facing copy and SEO metadata across all seven files, the About page reads naturally as a two-thread developer+aikido story with exactly four paragraphs, a full `src/` grep for "invest" is clean, and the site builds and lints green — with no changes to planning docs, project instructions, blog content, layout, components, or styling.
</success_criteria>

<output>
Create `.planning/quick/260722-dmq-remove-investing-references-from-the-sit/260722-dmq-SUMMARY.md` when done.
</output>
