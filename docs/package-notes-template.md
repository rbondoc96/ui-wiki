# Package Notes Template

The contract for pages under `Tools → Packages`. Research agents documenting a
frontend package must follow this file. It exists so that thirty package folders
written by thirty agent runs still read as one wiki.

## What belongs in Packages

A page here documents a **package you install** — a library, plugin, or tool
consumed from npm. It is field notes on using that package well, not a mirror of
its API reference.

Belongs here: `@xyflow/react`, `@dagrejs/dagre`, a form library, a table library,
an animation library.

Does not belong here:

- **Frameworks** — anything that owns the render loop goes in
  `Tools → Frameworks` (React lives there as a group).
- **Concepts** — "how virtualization works" is a `Building Blocks` page. The
  package page links to it rather than re-explaining it.
- **API reference** — if the answer is "read the types," don't write a page. Only
  write down what the official docs don't tell you, or tell you too late.

## Where files go

One directory per package, under `src/content/tools/packages/`. The directory
name is the URL segment, so use the unscoped, hyphenated package name:

```txt
src/content/tools/packages/xyflow-react/index.mdx    → /docs/tools/packages/xyflow-react
src/content/tools/packages/xyflow-react/recipes.mdx  → /docs/tools/packages/xyflow-react/recipes
src/content/tools/packages/xyflow-react/gotchas.mdx  → /docs/tools/packages/xyflow-react/gotchas
src/content/tools/packages/dagre/index.mdx           → /docs/tools/packages/dagre
```

Nothing needs registering. `src/lib/docs.ts` globs `src/content/**/*.mdx`, so the
sidebar, routes, search, and prev/next pick the file up as soon as it exists.

## Frontmatter contract

```mdx
---
title: Gotchas
section: Packages
group: "@xyflow/react"
library: tools
order: 20
appliesTo: "@xyflow/react 12.3"
reviewed: 2026-08
description: One sentence stating the page's claim, not its topic. Shown as the page subtitle and indexed by search.
---
```

| Field         | Required | Value                                                                |
| ------------- | -------- | -------------------------------------------------------------------- |
| `title`       | yes      | `Overview`, `Recipes`, or `Gotchas` — the sidebar scopes it by group  |
| `section`     | yes      | Always the literal `Packages`                                        |
| `group`       | yes      | The **exact** package name, double-quoted                            |
| `library`     | yes      | Always the literal `tools`                                           |
| `order`       | yes      | `0` overview, `10` recipes, `20` gotchas                             |
| `appliesTo`   | yes      | Package name + the major.minor the guidance was verified against      |
| `reviewed`    | yes      | `YYYY-MM` the page was last checked against that version              |
| `description` | yes      | One sentence, no trailing period issues, states the claim             |

Three rules that break the build or the nav if ignored:

1. **Quote the `group` value.** YAML reserves a leading `@`, so
   `group: @xyflow/react` is invalid. `group: "@xyflow/react"` is required.
2. **`appliesTo` and `reviewed` are mandatory here**, unlike elsewhere in the
   wiki. Package guidance rots against releases; a page without a pinned version
   is unusable a year later and there is no way to tell whether it was ever true.
3. **Add sources to `src/lib/sources.ts` before writing MDX.** `<SourceTrail>`
   validates every ref id against `SOURCES` and **throws at render and build** on
   an unknown id. Add the entry first, then cite it.

## The three pages

Every package gets these three, in this order. A package thin enough to need
only one page gets `index.mdx` alone — don't create empty files.

### `index.mdx` — Overview (`order: 0`)

The page that decides whether a reader installs this at all.

- **What it is** — the job it does in one paragraph, and the job it refuses to
  do. Name any rename or scope change a reader would otherwise trip on.
- **When to reach for it** — concrete situations, not a feature list.
- **When not to** — the honest exclusions, and what to use instead. This section
  is the main reason the page beats the README.
- **The mental model** — the two or three invariants that make the API
  predictable once you hold them.
- **Setup** — install line, peer requirements, and the class of mistake that
  makes a correct-looking first render come out blank.

### `recipes.mdx` — Recipes (`order: 10`)

Task-oriented how-tos. Each recipe is an `##` heading phrased as the task, and
opens with a one-line **trigger** — the situation that should send a reader here.
Show the smallest complete snippet that runs. Prefer one real, load-bearing
recipe over five toy ones.

### `gotchas.mdx` — Gotchas (`order: 20`)

Failure modes, ordered by **how often each ships to production**, not by
severity or by where they appear in the docs. Each gotcha states the symptom
first (what the developer actually sees), then the cause, then the fix. A gotcha
with no observable symptom is a trivia entry — cut it.

## Components to use

Registered in `src/components/mdx-components.tsx`. Unregistered components render
as nothing, silently — do not invent one.

- `<Pattern version="…" checked="…">` — wrap every version-sensitive snippet.
  This is the per-block equivalent of the page's `appliesTo`/`reviewed` and is
  what makes a stale snippet identifiable later.
- `<SourceTrail refs={[{ id, note, role }]}>` — attach citations to a block. Add
  the source to `src/lib/sources.ts` first.
- `<Callout variant="info|tip|warning" title="…">` — a single aside worth
  interrupting the reader for. More than two per page and none of them land.
- `<DoDont>` / `<Do>` / `<Dont>` — paired correct/incorrect snippets.
- `<Term id="…">` — link jargon to `src/lib/glossary.ts`. Add the entry if it
  isn't there.
- `<CodeTabs>` / `<CodeTab>` — the same task in more than one variant.
- `<Mermaid>` with a template-literal `chart` prop — diagrams. Authoring
  notes in `src/content/reference/diagrams.mdx`. Always pass `title` and
  `description`; the SVG is opaque to screen readers without them.

## House style

- Hard-wrap prose to match surrounding content files.
- Never mirror an API table that the package's own docs maintain better. Link out.
- State versions, dates, and concrete failure symptoms. Do not soften them into
  general summaries.
- Cross-link related packages rather than repeating their content. Integration
  recipes live with the **consumer** package: "lay out an xyflow graph with
  dagre" belongs under `@xyflow/react`, because that's where a reader would look.
- No em-dashes in prose beyond the ones already idiomatic in this repo's content.

## Before you finish

```sh
pnpm format
pnpm typecheck
pnpm lint
pnpm build   # catches SSR failures and SourceTrail's unknown-id throw
```

`pnpm build` is not optional for a new page. A typecheck pass does not prove the
page renders.
