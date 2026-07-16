# Deferred Items — 260716-ebk

## Pre-existing worktree environment issue: `npm run build` fails on `/opengraph-image` (out of scope) — RESOLVED by orchestrator post-merge verification

**Found during:** Task 2 (build and verify), in the executor's isolated worktree.

**Symptom:**
```
Error occurred prerendering page "/opengraph-image".
Error: ENOENT: no such file or directory, open
'.../.claude/worktrees/agent-a917b860d2034ea84/node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf'
```

**Root cause:** This git worktree's local `node_modules/` was never populated (0 packages installed
locally; `next`, `velite`, etc. resolve only via Node's upward module resolution to the parent
repo's `node_modules`, which has 471 packages). Next.js also warned about workspace-root ambiguity
due to duplicate lockfiles (worktree `package-lock.json` + main repo `package-lock.json`), which
caused the `/opengraph-image` route's font-file path to resolve into the (empty) worktree
`node_modules` instead of the parent repo's fully-populated one.

**Confirmed out of scope / pre-existing (at the time):**
- Reproduced identically with the new blog post file present AND absent (temporarily moved the
  file aside, reran `npm run build`, same ENOENT error) — not caused by this task's content change.
- `.planning/phases/03-seo-foundation-launch/DEPLOY-CHECKLIST.md` (check #5) confirms a full
  `next build && next start` production run passed with Lighthouse 90+ across all categories,
  evidenced in `03-06-SUMMARY.md` — meaning the codebase itself builds cleanly in an environment
  with node_modules properly installed. This is a worktree-provisioning gap, not a code defect.

**Not fixed inside the worktree because:**
- Out of scope per SCOPE BOUNDARY (pre-existing, unrelated to `content/posts/why-i-chose-aikido.mdx`).
- The plan explicitly restricted this quick task to a single content file — no `next.config.mjs`,
  route, or dependency changes were in scope for the executor.

**Resolution:** After the orchestrator merged the executor's commit (`bb5e48f`) into `main`, it ran
`npm run build` directly in the main repo checkout (fully-installed `node_modules`, no workspace-root
ambiguity). The build passed cleanly end to end, generating `/blog/why-i-chose-aikido`,
`/blog/tags/aikido`, and `/blog/tags/japan` as static routes. This confirms the gap was specific to
the isolated worktree's dependency provisioning, not a defect in the content or codebase — no further
action needed.
