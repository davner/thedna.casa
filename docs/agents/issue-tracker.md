# Issue tracker: none, local markdown only

This repo has no external tracker. Specs and tickets are local markdown files that agents write, work from, and close. Nothing is filed anywhere and there is no paste-ready handover.

## Locations

- Scratch folder: `.scratch/` (specs, tickets, and the TODO list; gitignored)
- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Tickets are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- The TODO list is `.scratch/TODO.md`

## When a skill says "publish to the issue tracker"

Write the spec or ticket files under `.scratch/<feature-slug>/`, creating the directory if needed. A ticket's blocking edges are a `Blocked by:` line naming ticket numbers and titles; a triage label is a `Status:` line near the top of the file. That is the whole publish step.

## When a skill says "add to the TODO list"

Work that surfaces mid-session but belongs to no current spec goes at the bottom of `.scratch/TODO.md`, created with a `# TODO` heading if missing. Append only: never rewrite, reorder, or delete another entry. Each entry carries what a fresh session needs to pick it up:

```markdown
- [ ] **<short title>** - added YYYY-MM-DD
  - From: <the session or spec it came out of>
  - Why: <the problem, in a sentence or two>
  - Known: <decisions already made; files, ADRs, or tickets involved>
  - Next: <the first step, and the skill to start with>
```

When a session starts work on an item, name it to the user. When its work is done, tick it and date it: `- [x] **<title>** - added YYYY-MM-DD, done YYYY-MM-DD`. When the user drops it, tick it with `dropped YYYY-MM-DD: <reason>`.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. Given only a ticket number or title, find it under `.scratch/*/issues/`. Given neither, ask for the path.

## When a skill says "close" or "resolve" a ticket

Set `Status: done` in the file and tick any TODO item that named this work.
