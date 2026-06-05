# Phase 2 — Suggested Additions

The next horizon, after Phase 1 shipped the **Forms** and **Data** sections, the
loading/empty/optimistic patterns, the `<DoDont>` / `<PlatformTabs>` components,
and the complete **App & Screens** macro library (see
[`app-screens-additions.md`](./app-screens-additions.md), now fully checked off).

This doc is deliberately **non-overlapping** with the two existing roadmaps:

- It does **not** repeat the open Building Blocks items still tracked in
  [`suggested-additions.md`](./suggested-additions.md) (the playground, overlays,
  motion, toasts, responsive/container queries, touch targets, theming-tokens,
  i18n/RTL, component-API tables, site polish). Finish those from that doc.
- It does **not** repeat any App & Screens item — that roadmap is complete, so
  everything here is genuinely new macro scope.

Three tracks: **deepen Building Blocks** (the micro gaps Phase 1 skipped),
**App & Screens Phase 2** (whole-flow concerns that live *above* a single
screen), and **new libraries** the wiki doesn't have yet. Same bias throughout —
a frontend-leaning fullstack dev who lives in React and ships React Native, with
the cross-platform (web ↔ RN) lens as the differentiator.

Tags: **[Feature]** (site/tooling), **[Content]** (MDX page or section),
**[Both]**. Rankings are value-per-effort. Prose is written for the top few of
each track; the rest are table stubs to expand when picked up.

---

## A. Building Blocks — Phase 2 (micro)

The component- and foundation-scale gaps not already in `suggested-additions.md`.

| Done | #   | Item                                       | Type    | Why it ranks here                                            |
| ---- | --- | ------------------------------------------ | ------- | ------------------------------------------------------------ |
| ☐    | A1  | Inputs & controls catalog                  | Content | The everyday primitives the Components section still lacks    |
| ☐    | A2  | Menus & command palette                    | Content | Menu vs. select confusion + the ⌘K the site already hints at  |
| ☐    | A3  | Tabs & disclosure (accordion, collapsible) | Content | In-view navigation and progressive disclosure, micro-scale    |
| ☐    | A4  | Tooltips                                   | Content | Distinct from popover; hover/focus/touch + delay are botched  |
| ☐    | A5  | Badges, tags, chips & status pills         | Content | Status-color semantics recur everywhere; small, high-reuse    |
| ☐    | A6  | Formatting: numbers, dates, units          | Content | Tabular figures, currency, relative time — quiet correctness  |
| ☐    | A7  | Screen-reader & ARIA patterns              | Content | Grows the thin a11y section past focus-management alone        |
| ☐    | A8  | Truncation & overflow                      | Content | line-clamp, ellipsis+tooltip, RN `numberOfLines` — easy to get wrong |
| ☐    | A9  | Date, time & range pickers                 | Content | The single hardest control; calendar a11y + native vs. custom |
| ☐    | A10 | File upload & dropzone                     | Content | Drag, progress, validation, RN media picker                   |
| ☐    | A11 | Iconography system                         | Content | Semantic vs. decorative, sizing scale, a11y; documents the Phosphor setup |
| ☐    | A12 | Elevation, shadows & layering              | Content | A shadow scale + z-index tokens; missing Foundations piece    |
| ☐    | A13 | Avatars & presence                         | Content | Fallbacks, stacks, presence dots — small but ubiquitous       |
| ☐    | A14 | Drag & drop / reordering                   | Content | Sortable lists, dnd a11y, RN gesture equivalents              |

### A1. Inputs & controls catalog — [Content]

The Components section has button anatomy and the select/listbox/combobox family;
it's missing the rest of the everyday controls: text field, textarea, checkbox,
radio, switch/toggle, slider, stepper, and segmented control. One page (or a small
section) covering each control's anatomy, its states (default/hover/focus/
disabled/error/read-only), and its RN equivalent. Pairs with the Forms section,
which assumes these exist.

### A2. Menus & command palette — [Content]

When a **menu** (a list of actions) is right versus a **select** (a value
chooser), plus the dropdown vs. context-menu distinction and the **command
palette** (⌘K) the site already gestures at in its callouts. Keyboard model,
roving focus, submenus, and the `@base-ui/react` menu primitives as working
examples.

### A3. Tabs & disclosure — [Content]

In-view navigation and progressive disclosure at the component scale: tabs,
accordion, collapsible, and native `<details>`. When to reveal vs. always-show,
the keyboard/ARIA model for each, and the distinction from route-level navigation
(which lives in App & Screens).

### A4. Tooltips — [Content]

Carved out from overlays (#4 in `suggested-additions.md`) because tooltips have
their own failure modes: hover **and** focus (not hover-only), open/close delay,
collision-aware positioning, never putting essential or interactive content
inside one, and the fact that **touch has no hover** so the pattern must degrade.

> A5–A14 are table stubs above; expand the "Why" into a full section when one is
> picked up. A6 (formatting) and A7 (ARIA patterns) are the highest-value of the
> remainder.

---

## B. App & Screens — Phase 2 (macro / flows)

The first App & Screens roadmap covered rendering, routing, and single-screen
layouts. Phase 2 is the scale *above* one screen: whole flows, app-wide concerns,
and where state lives across the app.

| Done | #   | Item                                  | Type    | Why it ranks here                                            |
| ---- | --- | ------------------------------------- | ------- | ------------------------------------------------------------ |
| ☐    | B1  | Auth & session flows                  | Content | Every app has one; redirect-after-login and expiry are subtle |
| ☐    | B2  | State architecture (where state lives)| Content | The decision map: server vs. URL vs. client store vs. local   |
| ☐    | B3  | Onboarding & activation flows         | Content | Extends first-run dashboards up to multi-step activation       |
| ☐    | B4  | Offline & sync                        | Content | Offline-first, mutation queue, conflict resolution; RN-sharp   |
| ☐    | B5  | Notifications & realtime UI           | Content | In-app notifications, unread badges, websockets, presence      |
| ☐    | B6  | Whole-screen error & recovery         | Content | Route error boundaries, 404/500, crash recovery, retry         |
| ☐    | B7  | Modal routing & intercepting routes   | Content | Modal-as-route, parallel/intercepting routes, deep-linkable     |
| ☐    | B8  | App-scale theming & dark mode         | Content | System pref, persistence, no-flash SSR theme, one RN source     |
| ☐    | B9  | Permissions & role-based UI           | Content | Gating, conditional rendering, honest "no access" states        |
| ☐    | B10 | App-scale accessibility               | Content | Page titles, focus on route change, announce nav, skip links    |
| ☐    | B11 | Performance budgets & Web Vitals      | Content | Bundle budgets, LCP/CLS/INP as UX, RUM; ties to route arch       |

### B1. Auth & session flows — [Content]

The flow every app has and few get clean: login/signup layouts, protected routes
and the redirect-back-after-login dance, session expiry and silent refresh, and
what the UI does the moment a session dies mid-action. Builds directly on
[route architecture](/docs/app-screens/navigation/route-architecture) and
[URL as state](/docs/app-screens/navigation/url-as-state) (the return-to URL).

### B2. State architecture — [Content]

The map that ties the whole macro library together: a piece of state belongs in
the **server** (source of truth), the **URL** (shareable view state — already its
own page), a **client store** (cross-screen session state), or **local** component
state (ephemeral). When each is right and the cost of putting it in the wrong
place. The decision-rubric equivalent for state.

### B3. Onboarding & activation flows — [Content]

The flow scale of [empty & first-run dashboards](/docs/app-screens/layouts/empty-first-run):
product tours, setup checklists, and progressive onboarding that activates a new
user across several screens rather than one. When to guide vs. get out of the way,
and how not to block the product behind a tour.

> B4–B11 are table stubs. B2 (state architecture) and B4 (offline & sync) are the
> highest-leverage of the set, and B4 is where the RN lens is sharpest.

---

## C. New libraries & cross-cutting

Whole areas the wiki doesn't cover yet. Each is a candidate **library** (a
sibling to Building Blocks and App & Screens) or a deep section.

| Done | #   | Item                                  | Type    | Why it ranks here                                            |
| ---- | --- | ------------------------------------- | ------- | ------------------------------------------------------------ |
| ☐    | C1  | AI / LLM interface patterns           | Content | The current frontier; chat, streaming, citations, tool states |
| ☐    | C2  | Data visualization & charts           | Content | Recurs in dashboards; chart-type choice + chart a11y          |
| ☐    | C3  | Accessibility (promote to a library)  | Both    | Currently one page; deserves a full WCAG-by-task library       |
| ☐    | C4  | Motion & micro-interactions (library) | Both    | Beyond the single motion page: gestures, orchestration, RN     |
| ☐    | C5  | UX writing & content design           | Content | Microcopy, voice/tone, the copy half of every pattern          |
| ☐    | C6  | Performance & Core Web Vitals         | Content | Images/fonts, measuring, RN startup; the perf counterpart      |
| ☐    | C7  | Design tokens & system governance     | Both    | The token pipeline this site runs on; naming, versioning, multi-brand |
| ☐    | C8  | UI testing & QA                       | Content | Visual regression, a11y tests, interaction tests               |

### C1. AI / LLM interface patterns — [Content]

The most current and least-documented surface: chat and conversation UIs,
streaming token-by-token responses (a loading state that's also the content),
stop/regenerate, message states, citations and sources, suggestion chips, prompt
inputs, and how to show tool-use / "thinking" without lying about progress.
Nothing in the existing wiki touches this, and it's where new product work is
concentrated.

### C2. Data visualization & charts — [Content]

The visual counterpart to the Data section's tables: picking a chart type from
the question (and when **not** to chart), axes/legends/labels, color for
categorical vs. sequential data, and chart accessibility (the part everyone
skips). With web (the charting lib of choice) ↔ RN tabs, since charts diverge
hard across platforms.

### C3. Accessibility — promote to a library — [Both]

Today a11y is a single page (`focus-management`). It's strong enough material to
become its own library organized **by task**: keyboard operability, screen-reader
semantics, color & contrast, motion, forms a11y, and testing. The `[Feature]`
half is sidebar/library plumbing (the `LIBRARIES` list already supports a third
entry).

> C4–C8 are table stubs. C1 (AI patterns) is the standout for relevance and
> differentiation; C3 (a11y library) is the best use of material already half-written.

---

### Where to start

If you want momentum in Phase 2: **A1 (inputs catalog)** and **A4 (tooltips)** are
small pages that round out the Components section; **B2 (state architecture)** is
the macro page that ties App & Screens together; and **C1 (AI patterns)** is the
highest-ceiling net-new area. The biggest structural move is **C3** — promoting
accessibility into a full third library.
