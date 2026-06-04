# UI Wiki

A personal UI/UX knowledge base, built like a software docs site. TanStack
Start + MDX content with Shiki-highlighted code, a sidebar, top nav, in-page
table of contents, ⌘K search, prev/next paging, and a dark-mode toggle.

## Stack

- **TanStack Start** (file-based router, SSR) on **Vite 8** / **React 19**
- **MDX** compiled via `@mdx-js/rollup`, with `remark-gfm` for tables
- **Shiki** syntax highlighting at build time (`@shikijs/rehype`, dual theme)
- **Tailwind v4** + shadcn (`base-mira`) + `@base-ui/react` primitives

## Authoring content

Drop a `.mdx` file anywhere under `src/content/`. The sidebar, routes, search
index, and prev/next paging are all generated from it automatically — no
manual registration.

Each file needs frontmatter:

```mdx
---
title: Spacing Scale
section: Foundations
order: 1
description: One-line summary shown under the page title.
---
```

| Field         | Purpose                                                   |
| ------------- | --------------------------------------------------------- |
| `title`       | Page title + sidebar/search label                         |
| `section`     | Sidebar group it belongs to                               |
| `order`       | Sort order within the section (also orders sections)      |
| `description` | Optional subtitle + search keyword                        |

The file path becomes the URL: `src/content/foundations/spacing.mdx` →
`/docs/foundations/spacing` (an `index.mdx` maps to the folder root). `##` and
`###` headings get auto-anchored and populate the "On this page" TOC.

A `<Callout variant="info|tip|warning" title="…">` component is available in
any MDX file.

## Commands

- `pnpm dev` — dev server (port 3000)
- `pnpm build` / `pnpm preview` — production build / preview
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — ESLint
- `pnpm format` / `pnpm check` — Prettier write / check
- `pnpm dlx shadcn@latest add <component>` — add a shadcn component
