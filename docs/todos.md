# Open Todos

Near-term, **non-content** tasks. The content backlog lives in
[`suggested-additions.md`](./suggested-additions.md) (Building Blocks),
[`app-screens-additions.md`](./app-screens-additions.md) (App & Screens, done),
and [`phase-2-additions.md`](./phase-2-additions.md) (next horizon). This file is
for housekeeping that keeps the existing wiki correct and easy to extend.

---

## 1. Cross-link audit — ☐

Verify every internal link added across the App & Screens build resolves to a
real page. The macro library added ~30 cross-links (and a few into Building
Blocks), plus the `app-screens` landing vs. `app-screens/rendering` overview
distinction is easy to get wrong.

**Steps:**

- [ ] Collect every internal target: `href="/docs/…"` in `src/content/**/*.mdx`
      and `<Link to="/docs/$" params={{ _splat: "…" }}>` in
      `src/components/docs/*.tsx` (scale-map and route/nav visuals use `Link`).
- [ ] Build the set of real slugs from `src/content/**/*.mdx` using the
      `pathToSlug` rule in `src/lib/docs.ts` (strip `content/`, strip `.mdx`,
      strip a trailing `/index`).
- [ ] Diff the two sets; list any link whose slug isn't a real page.
- [ ] Pay special attention to:
  - `/docs/app-screens` (the Overview landing) vs.
    `/docs/app-screens/rendering` (the Rendering overview) — distinct pages.
  - Links into Building Blocks: `/docs/patterns/loading-states`,
    `/docs/patterns/empty-states`, `/docs/data/tables-vs-lists`,
    `/docs/data/data-tables`, `/docs/foundations`.
- [ ] Fix or remove any dangling links.
- [ ] Spot-check **reciprocity** where it's expected (triptych ↔ master-detail,
      rubric ↔ isr-ppr, streaming ↔ data-fetching ↔ hydration).

**Notes:** a tiny Node script over the two globs does the extraction; the
`pathToSlug` logic is already in `src/lib/docs.ts`, so reuse its rule rather than
re-deriving it. This is a read-only audit until the fix step.

---

## 2. Contributing-visuals note — ☐

Document the shared visual toolkit so future pages reuse the primitives instead of
re-implementing card/border/device chrome. Several components were extracted
during the App & Screens build and aren't discoverable without reading the source.

**Steps:**

- [ ] Write a short guide (`docs/contributing-visuals.md`, or a section in
      `README.md`) cataloguing the primitives:
  - From `src/components/docs/shell.tsx`: `ShellFrame` (live mockup canvas),
    `DiagramFrame` (captioned schematic), `Region` + `Bar` (diagram parts),
    `PhoneFrame` (single-pane device frame).
  - From `src/components/docs/timeline.tsx`: `Timeline` (lanes of proportional
    segments + milestone markers, for delivery/timing diagrams).
- [ ] For each: one-line purpose, key props, and a minimal usage snippet.
- [ ] Write down the conventions the existing visuals follow, so new ones match:
  - `not-prose` wrapper on every visual; `data-ui` on live mockups.
  - Theme tokens only — no raw hex (the one allowed exception so far is the
    `amber` "at risk" status, matching existing `emerald`/`destructive` usage).
  - Restrained palette: tinted neutrals + `primary`/`chart-3` accents.
  - `figure` + `figcaption` for static diagrams; a toolbar segmented control for
    interactive toggles (see `MasterDetail`, `DashboardDensity`, `ResponsiveShell`).
  - Inline `style` only for genuinely dynamic values (tree depth in `RouteTree`,
    segment widths/marker offsets in `Timeline`).
- [ ] Add a "when to extract a new primitive vs. reuse" note. Candidate not yet
      extracted: the faux-browser chrome in `url-state-examples.tsx` (an address
      bar + traffic lights) could become a `FauxBrowser` primitive if a second
      page needs it.
- [ ] Link the note from `README.md` (and/or the root `CLAUDE.md`) so it's the
      first thing a future contributor finds before building a visual.

**Notes:** keep it short and example-led; the goal is "copy this, follow these
rules," not exhaustive API docs. The component source comments already explain
each primitive's intent and can seed the prose.
