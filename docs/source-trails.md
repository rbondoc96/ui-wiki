# Source Trails

A proposal for public-facing provenance around meaningful content blocks in the wiki.

## Purpose

Source trails show readers what informed a note, claim, code sample, visual, or pattern. The goal is not academic citation coverage. The goal is visible provenance: enough context for a reader to judge where an idea came from, how directly it is supported, and where to continue reading.

A source trail should answer one question:

> Why is this source attached to this block?

## Reader experience

A meaningful block can expose a small trigger near the content:

- `Refs · 3` chip
- superscript count
- subtle margin icon
- top-right chip on code blocks, diagrams, and visuals

Clicking the trigger opens a compact popover.

```txt
Source trail

Supports
Designing Data-Intensive Applications
Martin Kleppmann, ch. 3
Used for the log-structured storage explanation.

Inspired by
Local-first software
Ink & Switch
Influenced the framing, not a direct source for the claim.

View full source trail
```

Use a popover for small trails. Use a drawer or full details page when a block has many sources, long notes, quotes, or cross-links.

## Core concept

Attach source trails at the block level, not only the page level.

Good targets:

- important claims
- summaries of someone else's idea
- adapted code
- diagrams or visuals inspired by another source
- decision rules or heuristics
- places where source quality materially affects trust

Avoid attaching trails to every sentence. Too many triggers become noise.

## Source roles

Every source entry needs a role. This prevents vague citation lists.

| Role | Meaning |
| --- | --- |
| Supports | The source directly backs the claim or explanation. |
| Defines | The source provides the definition, term, taxonomy, or original framing. |
| Adapted from | The block borrows structure, code, wording shape, or visual form with changes. |
| Inspired by | The source influenced the idea, but does not directly support the claim. |
| Contrasts with | The source gives an alternate or opposing view. |
| Further reading | Useful background, but not required support. |

## Required trail row fields

Each visible row should include:

- source title
- source type: article, book, post, video, code, talk, paper, docs, etc.
- role
- relevance note: why this source is attached here
- locator when possible: chapter, section, heading, timestamp, commit, page, etc.
- access context: public, paywalled, book, private unavailable
- accessed or reviewed date for web sources

Optional:

- author
- archive URL
- short quote or paraphrase
- source note link inside the wiki
- "appears elsewhere" backlinks

## Authoring shape

Because the site uses MDX, the clean version is a wrapper component around meaningful content.

```mdx
<SourceTrail
  refs={[
    {
      id: "ddia-storage-engines",
      locator: "Chapter 3",
      note: "Used for the log-structured storage explanation.",
      role: "supports",
    },
    {
      id: "ink-switch-local-first",
      locator: "Motivation section",
      note: "Influenced the local-first framing, not a direct source for the claim.",
      role: "inspired-by",
    },
  ]}
>
  This section explains why conflict resolution belongs close to the data model.
</SourceTrail>
```

For simple inline use, a lighter syntax could exist later:

```mdx
This design keeps provenance close to the claim. <Ref id="ink-switch-local-first" />
```

But the block wrapper should be the primary model.

## Source registry

Source metadata should live separately from the content block so repeat references stay consistent.

Example source shape:

```ts
type Source = {
  access: "public" | "paywalled" | "book" | "private-unavailable";
  archiveUrl?: string;
  author?: string;
  id: string;
  publishedAt?: string;
  title: string;
  type: "article" | "book" | "code" | "docs" | "paper" | "post" | "talk" | "video";
  url?: string;
};
```

Block-level refs add the contextual meaning:

```ts
type SourceTrailRef = {
  id: string;
  locator?: string;
  note: string;
  role: "adapted-from" | "contrasts-with" | "defines" | "further-reading" | "inspired-by" | "supports";
};
```

## UI rules

- Keep the trigger quiet. It should support reading, not interrupt it.
- Show the role before the source title.
- Make the relevance note mandatory.
- Prefer locator over long quotes.
- Keep quotes short and only when they add value.
- Mark inaccessible sources honestly.
- Let readers open the original source, the internal source note, or the full trail.
- Do not imply that a source supports more than it actually does.

## Weaknesses and mitigations

### Trust theater

A list of sources can make weak content look stronger than it is.

Mitigation: require a role and relevance note for every source row.

### Ambiguous provenance

A source might support a claim, inspire framing, or simply offer background.

Mitigation: use explicit roles and avoid generic "reference" labels inside the popover.

### Citation clutter

Too many triggers can distract from the actual content.

Mitigation: attach trails only to meaningful blocks.

### Granularity mismatch

A block-level trail can imply that sources support the whole block.

Mitigation: write precise relevance notes and split large blocks when needed.

### Maintenance burden

Links rot, articles change, and old interpretations age.

Mitigation: store accessed dates, archive URLs, source notes, and last-reviewed metadata.

### Copyright risk

Long public excerpts from books or articles can be risky.

Mitigation: prefer short quotes, paraphrases, and locators.

### Paywalls and unavailable sources

A reader may not be able to open the source.

Mitigation: show access status and enough bibliographic context to identify the source.

## Feasibility

The UI is straightforward: a trigger, popover, list rows, and optional drawer. The hard parts are authoring discipline and data modeling.

Recommended build path:

1. Create a source registry.
2. Build `<SourceTrail>` for block-level MDX usage.
3. Render a compact popover with role, title, locator, and relevance note.
4. Add validation so every ref has a known source ID and note.
5. Add a full source detail view with backlinks after the pattern proves useful.

## Open questions

- Should source records live in frontmatter, a central data file, or one file per source?
- Should trails be searchable?
- Should the wiki expose source backlinks like "used by these pages"?
- Should private or unavailable sources be shown publicly, hidden, or summarized?
- Should a trail support confidence or review status, or is role plus note enough for now?
