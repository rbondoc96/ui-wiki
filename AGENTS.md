# Project Agent Context

Guidance for AI agents working in this repo. Start with `README.md` for the stack and basic content authoring — this file only covers the non-obvious things you'd otherwise have to discover by reading source.

## Commands (pnpm)

- `pnpm dev` — dev server on port **5000** (falls back to 5001+ if taken). SSR + HMR.
- `pnpm build` — **run this to catch SSR bugs the typechecker can't** (e.g. a browser-only import evaluated during server render). Type-check + lint pass ≠ it renders.
- `pnpm format` (prettier write), `pnpm lint` (eslint), `pnpm typecheck` (`tsc --noEmit`). Run format first, then the checks.
- `pnpm test` — vitest is wired up (jsdom available) but there are currently no test files.

Don't run `dev`/`build` unless you actually need to verify something; the checks are cheap, the servers aren't.

## How content and components wire together

- **Content is auto-discovered.** `src/lib/docs.ts` globs `src/content/**/*.mdx` eagerly. There is **no manual registration** for a new page — drop the `.mdx` in and the sidebar, routes, search, and prev/next update. `index.mdx` maps to the folder root.
- **Frontmatter has more fields than the README lists.** Beyond `title`/`section`/`order`/`description`: `group` (adds a third collapsible nav tier, e.g. `Foundations` under the `React` section), `library` (top-level nav bucket, e.g. `frameworks`/`app-screens`), `appliesTo`, and `reviewed` (freshness stamp). See the `Doc` type and `buildNavTree` in `src/lib/docs.ts`.
- **Custom MDX components MUST be registered.** Add them to the `mdxComponents` map in `src/components/mdx-components.tsx` (and import at the top). Unregistered components silently render as nothing. Keep the map ABC-sorted — it matches the house style and the user's stated preference.
- **Code fences** run through Shiki at build (`vite.config.ts`), dual light/dark theme, wrapped by the `CodeBlock` component (copy button + language label). A Shiki transformer surfaces the fence language as `data-language` on `<pre>`.
- **Math (`$…$` / `$$…$$`) renders at build** via `remark-math` + `rehype-katex`, so it ships as plain HTML + MathML with no client JS — no SSR hazard. `rehype-katex` only *warns* on a malformed formula and emits red error text, so `rehypeKatexStrict` (`src/lib/mdx/rehype-katex-strict.ts`) runs after it and throws, naming the file, line, and offending command. Keep it registered after `rehypeKatex`. KaTeX's CSS is imported in `src/styles.css`; it inherits `currentColor`, so both themes work without token wiring.

## Theming (this trips people up)

- Theme is `"dark" | "light"` via `useTheme()` from `src/lib/theme.tsx`; dark mode is the `.dark` class on `<html>`. `themeInitScript` sets it pre-paint to avoid a flash — don't fight it.
- **Design tokens are OKLCH CSS custom properties** in `src/styles.css` (`--foreground`, `--muted`, `--muted-foreground`, `--border`, `--card`, `--primary`, `--chart-1..5` = the green brand ramp, etc.). Style with these tokens / Tailwind classes so light and dark both work for free.
- **The OKLCH format bites any JS library that parses colors.** Modern Chrome keeps `getComputedStyle().color` **and** canvas `fillStyle` in the oklch color space — they do *not* resolve to rgb. If a lib needs a color it can parse (hex/rgb), convert oklch → sRGB yourself in JS. Do not trust the browser to normalize it. (CSS itself is fine — `var(--token)` in a stylesheet resolves oklch natively; the problem is only JS color parsers.) See `oklchToRgb` in `src/components/docs/mermaid.tsx` for a working converter.

## SSR + React 19 gotchas

- **TanStack Start renders on the server.** Browser-only libraries (anything touching `window`/`document`/DOM measurement) must be lazily imported and run inside `useEffect`, never at module top-level or during render. Guard with a mounted/cancelled flag.
- **StrictMode double-invokes effects in dev.** Two concurrent runs of the same effect are normal here (the wiki even documents this in `frameworks/react/gotchas.mdx`). Any effect that mutates shared/global state or a library's internal DOM must be safe under concurrent double-invocation — e.g. give each run a unique id rather than a stable one.

## The Mermaid diagram component — lessons already paid for

`src/components/docs/mermaid.tsx` renders `<Mermaid chart={\`…\`} />` diagrams. Reference `src/content/reference/diagrams.mdx` for authoring. Hard-won specifics so you don't rediscover them:

- Mermaid themes via **khroma**, which can't parse `oklch()` → colors are converted to hex before being passed as `themeVariables` (the oklch issue above).
- **`mermaid.render(id, …)` is not reentrant** — it derives temp DOM element ids from `id`, so two concurrent renders sharing an id corrupt each other and yield an empty (not errored) result. Each render gets a globally-unique id to survive StrictMode.
- Fine styling that theme variables can't express (rounded corners, edge-label chips, the green start/end accent) lives in a `themeCSS` string that uses `var(--token)` directly — safe there because the browser resolves it.
- Diagrams take optional `title` + `description` props for accessibility (the SVG is opaque to screen readers otherwise). Prefer providing both on real content.

## Cross-cutting systems

- **Source trails.** `<SourceTrail refs={[…]} />` attaches citations to a block. Refs are validated against `SOURCES` in `src/lib/sources.ts` — an unknown id **throws at render/build**, on purpose. Add the source to `sources.ts` first.
- **Glossary.** `<Term id="…">` links inline jargon to definitions in `src/lib/glossary.ts`.
- **Package notes.** Pages in the `Packages` library (`src/content/packages/<pkg>/`) document an installed npm dependency. They have a stricter contract than the rest of the wiki — fixed page shape, mandatory `appliesTo` + `reviewed`. **Read `docs/package-notes-template.md` before writing one.**

## Conventions

- Commits: **Conventional Commits** (`feat:`, `refactor:`, `docs:`), no attribution / co-author trailers. Don't commit unless asked.
- Follow the code-style preferences in the user's global instructions (ABC-sorted props/keys, `??` over `||`, strict equality, POJO enums not TS `enum`, no `as any`).
- MDX prose in `src/content/` is hard-wrapped; match the surrounding file when editing content.
