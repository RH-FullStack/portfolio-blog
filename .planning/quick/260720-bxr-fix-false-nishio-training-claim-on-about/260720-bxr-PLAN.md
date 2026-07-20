---
phase: quick-260720-bxr
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: ["src/app/(site)/about/page.tsx"]
autonomous: true
requirements: ["QUICK-260720-bxr"]

must_haves:
  truths:
    - "About page names Mark Jewkes as Rasmus's current sensei in present tense"
    - "The false 'trained under the late sensei Shoji Nishio' claim no longer appears"
    - "The 'discipline of the mat' framing that follows is preserved unchanged"
    - "No lineage reference to Shoji Nishio or Morihei Ueshiba is added"
  artifacts:
    - path: "src/app/(site)/about/page.tsx"
      provides: "Accurate aikido sensei statement in the aikido-thread paragraph"
      contains: "Mark Jewkes"
  key_links: []
---

<objective>
Correct a factually false statement on the About page. Line 38 currently claims Rasmus
"trained under the late sensei Shoji Nishio" — this is false. His actual current sensei is
Mark Jewkes (6th dan Aikido, 4th dan Iaido). Replace only the sensei clause with an accurate,
present-tense statement while leaving the rest of the paragraph and its "discipline of the mat"
framing intact.

Purpose: The About page is a public, personal-brand asset — a false biographical claim about
who someone trains under is a credibility and integrity problem that must be fixed immediately.
Output: Updated `src/app/(site)/about/page.tsx` with the accurate sensei statement.
</objective>

<execution_context>
@$HOME/.claude-account-b/get-shit-done/workflows/execute-plan.md
@$HOME/.claude-account-b/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

# The single file being edited — the false claim is on line 38, inside the third <p> (the
# "aikido thread" paragraph).
@src/app/(site)/about/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Replace the false Nishio sensei claim with an accurate Mark Jewkes statement</name>
  <files>src/app/(site)/about/page.tsx</files>
  <action>
In the third `<p>` (the "aikido thread" paragraph, currently line 38), replace exactly the
clause `I trained under the late sensei Shoji Nishio` with:
`I train under Mark Jewkes (6th dan Aikido, 4th dan Iaido)`.

The resulting sentence must read:
"I train under Mark Jewkes (6th dan Aikido, 4th dan Iaido), and the discipline of the mat —
showing up, falling, getting back up, refining the same technique for years — turned out to be
the same discipline that ships software and holds an investment thesis for a decade."

Requirements:
- Present tense ("I train under", not "trained" / not "late") — he currently trains under him.
- Names Mark Jewkes and includes his rank (6th dan Aikido, 4th dan Iaido). The parenthetical
  form matches the page's existing voice, which already uses parentheticals
  (e.g. "(pricing, positioning, actually finishing)").
- Change ONLY that clause. Do not alter the "discipline of the mat" clause, the "My first trip
  to Japan..." sentence, or any other paragraph.
- Do NOT add any reference to Shoji Nishio or Morihei Ueshiba as lineage/style — keep it simple,
  no lineage mention (explicit user constraint).
- Preserve the surrounding em-dash punctuation and first-person reflective tone exactly.
  </action>
  <verify>
    <automated>cd /Users/rasmushansen/Projects/PortFolioBlog && grep -q "I train under Mark Jewkes (6th dan Aikido, 4th dan Iaido)" "src/app/(site)/about/page.tsx" && ! grep -Eiq "Nishio|Ueshiba|trained under|late sensei" "src/app/(site)/about/page.tsx" && echo PASS</automated>
  </verify>
  <done>
The About page states "I train under Mark Jewkes (6th dan Aikido, 4th dan Iaido)" in present
tense; the strings "Nishio", "Ueshiba", "trained under", and "late sensei" no longer appear
anywhere in the file; the rest of the paragraph (the "discipline of the mat" framing and the
Japan-seminar sentence) is byte-for-byte unchanged.
  </done>
</task>

</tasks>

<verification>
- `grep -q "I train under Mark Jewkes (6th dan Aikido, 4th dan Iaido)" "src/app/(site)/about/page.tsx"` succeeds.
- `grep -Eiq "Nishio|Ueshiba|trained under|late sensei" "src/app/(site)/about/page.tsx"` returns no match.
- `git diff` shows exactly one changed line (the sensei clause) and nothing else in the file.
</verification>

<success_criteria>
The About page accurately names Mark Jewkes as Rasmus's current sensei in present tense with his
rank, the false Shoji Nishio claim is gone, no lineage reference was added, and no other prose on
the page was modified.
</success_criteria>

<output>
Create `.planning/quick/260720-bxr-fix-false-nishio-training-claim-on-about/260720-bxr-SUMMARY.md` when done.
</output>
