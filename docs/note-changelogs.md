# Note Changelogs

Recommendation for adding human-readable changelogs to individual wiki notes.

## Summary

Add changelogs as editorial content, not git metadata.

The wiki already has git-derived `Last updated` dates. Keep that if useful, but
use separate changelog entries for meaningful note history: what changed, why it
changed, and how the guidance evolved.

## Goals

- Explain substantive changes in human language.
- Preserve the reasoning behind changes, not just the diff.
- Let each note have its own history.
- Support a future public contribution workflow.
- Avoid logging trivial edits, formatting changes, dependency work, or site infra
  changes.

## Non-goals

- A full commit log.
- A replacement for git history.
- Attribution or contributor profiles for the first version.
- Mandatory changelog entries for every typo or cleanup.
- A changelog for site infrastructure changes.

## Recommendation

Store note changelog entries as separate MDX files, grouped by note slug.

Example layout:

```txt
src/content/forms/basic-forms.mdx
src/changes/forms/basic-forms/2026-06-05-validation-guidance.mdx
```

Example entry:

```mdx
---
date: 2026-06-05
kind: clarified
note: forms/basic-forms
title: Clarified validation timing guidance
---

The previous version made immediate validation sound like the default.

This update separates inline validation, delayed validation, and submit-time
validation so the note better fits long enterprise forms.
```

This keeps changelog prose close to the note conceptually, without mixing it into
the note body or tying it to commit history.

## Entry types

Use a small controlled vocabulary:

- `added`: new guidance, examples, or sections.
- `clarified`: same guidance, clearer framing.
- `corrected`: factual fix or misleading guidance repaired.
- `deprecated`: guidance is still visible, but no longer recommended.
- `expanded`: broader coverage of the same topic.
- `reframed`: opinion, priority, or mental model changed.
- `removed`: guidance intentionally deleted.

Avoid `updated` as a kind because it is too vague.

## When to add an entry

Add one when a reader would reasonably care that the note's advice changed.

Good changelog reasons:

- A recommendation changed.
- A warning was added or removed.
- A new example changes how the pattern should be applied.
- A section was reframed because the old framing was misleading.
- A note now covers a meaningful edge case.
- A public contributor proposes a substantive correction.

Skip changelog entries for:

- Typos.
- Formatting.
- Link fixes.
- Internal component refactors.
- Import cleanup.
- Pure visual polish that does not alter guidance.

## UI ideas

Start small:

1. Show a compact `Latest meaningful change` block near the bottom of each note.
2. Link to a per-note history view, for example `/docs/forms/basic-forms/history`.
3. Add a global `/changelog` later, grouped by date with filters for section,
   note, and kind.

Per-note display could show:

- date
- kind
- title
- short body excerpt
- link to full entry

The global changelog should be secondary. The primary use case is understanding
how a specific note evolved.

## Public repo future

If the wiki becomes public, PRs can ask contributors whether a changelog entry is
needed.

Possible PR template prompt:

```md
## Changelog

Does this materially change a note's guidance?

- [ ] No changelog entry needed
- [ ] Added changelog entry

If yes, explain what changed and why in `src/changes/...`.
```

Attribution can be added later as optional frontmatter, for contributors who opt
in:

```yaml
contributors:
  - display: true
    name: Jane Doe
    url: https://github.com/jane
```

Keep attribution out of scope for the first version. Design the schema so it can
be added without migrating every entry.

## Implementation sketch

1. Add `src/changes/**/*.mdx` entries.
2. Create a loader similar to the docs loader:
   - import all changelog MDX files eagerly
   - parse frontmatter
   - group entries by `note`
   - sort newest first by `date`
3. Add helper functions:
   - `changesForDoc(slug)`
   - `latestChangeForDoc(slug)`
   - `allChanges()`
4. Render latest change on the note page.
5. Add a per-note history route only after there are enough entries to justify it.
6. Add a global changelog route later.

The first version can avoid rendering the MDX body directly and instead show only
frontmatter plus plain excerpt text. Full MDX rendering can come later.

## Alternatives considered

### Inline frontmatter array

Example:

```yaml
changes:
  - date: 2026-06-05
    kind: clarified
    title: Clarified validation timing guidance
```

Pros: simple and colocated.

Cons: poor for longer prose, awkward diffs, and hard to review once entries grow.

### One global changelog file

Pros: easy to build and easy to browse chronologically.

Cons: weak per-note ownership, merge conflicts over time, and harder to keep
near the related content.

### Git-derived changelog

Pros: automatic.

Cons: explains what changed mechanically, not why it changed editorially. Better
reserved for `Last updated` metadata.

## Risks

- Changelog discipline can become busywork.
- Entries can become too verbose if there is no template.
- Contributors may over-log small edits.
- If entries are required too often, people will skip useful improvements.

Mitigation: make entries optional but expected for meaningful guidance changes.

## Open questions

- Should a note show only the latest change, or the latest three?
- Should entries have required summaries separate from body text?
- Should deleted notes keep changelog history?
- Should changelog entries be searchable with regular notes?
- Should `Last updated` remain git-derived, or should the latest changelog date
  become the visible update signal?
