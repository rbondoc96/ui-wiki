# App & Screens — Suggested Additions

Roadmap for the **App & Screens** library — the *macro* half of the wiki:
everything above the component scale, about how a whole app or screen is built,
delivered, navigated, and laid out. (The existing micro half — foundations,
component anatomy, data display, patterns, a11y — is the **Building Blocks**
library.)

Organized by **scale**, mixing engineering and design concerns under three
sections: **Rendering & Delivery**, **Routing & Navigation**, and **Layouts &
Archetypes**. Same bias as the Building Blocks roadmap — what pays off for a
frontend-leaning fullstack dev who lives in React and ships React Native — and
the cross-platform (web ↔ RN) lens is the differentiator, sharpest in Routing &
Navigation where the two stacks genuinely diverge.

Each item is tagged **[Feature]** (changes the site/tooling), **[Content]** (a
new MDX page) or **[Both]**. Ranking is by value-per-effort and how often you'll
actually reach for it. **Phase 1** (library machinery + a seed **Rendering
overview** page) is assumed already done; everything below is the backlog after
that, so all unchecked.

| Done | #   | Section              | Item                                       | Type    | Why it ranks here                                          |
| ---- | --- | -------------------- | ------------------------------------------ | ------- | ---------------------------------------------------------- |
| ☐    | 1   | Rendering & Delivery | Rendering strategy decision rubric         | Content | The page you'll point teammates at on every new project    |
| ✅   | 2   | Routing & Navigation | Nav pattern picker: tab vs sidebar vs top  | Content | The recurring "where does navigation live" decision        |
| ✅   | 3   | Routing & Navigation | URL as state, search params & deep linking | Content | Most-skipped, most-gotten-wrong; shared web/RN concern      |
| ✅   | 4   | Layouts & Archetypes | App shell & layout composition             | Content | The frame every other screen hangs inside                   |
| ✅   | 5   | Routing & Navigation | Web vs RN navigation models                | Content | Where the two stacks diverge hardest — pure cross-platform   |
| ✅   | 6   | Rendering & Delivery | Streaming SSR & Suspense                   | Content | The modern default; ties straight into loading states       |
| ✅   | 7   | Layouts & Archetypes | Dashboard layout & information density     | Content | High-recurrence admin work; pairs with Data tables          |
| ☐    | 8   | Rendering & Delivery | Hydration, islands & partial hydration     | Content | Explains the TTI/"why isn't it clickable" mystery           |
| ☐    | 9   | Routing & Navigation | Route architecture & code-splitting        | Content | Sets up everything else in this section                     |
| ✅   | 10  | All                  | Scale-map landing for the library          | Feature | Orients readers; cheap; makes the macro/micro split legible |
| ✅   | 11  | Rendering & Delivery | Data fetching & caching at the route level | Content | Loaders/RSC/Query — the actual day-job decision             |
| ✅   | 12  | Layouts & Archetypes | Landing / marketing page anatomy           | Content | Different rules from app UI; you build these too            |
| ✅   | 13  | Routing & Navigation | Breadcrumbs & wayfinding                    | Content | Small page, clears up a recurring "do I need these"         |
| ✅   | 14  | Layouts & Archetypes | Responsive app-shell behavior              | Content | Where shell meets RN/responsive — the adaptive shell        |
| ✅   | 15  | Layouts & Archetypes | Master-detail / multi-pane layouts         | Content | The list+detail archetype, and how it folds on mobile       |
| ☐    | 16  | Rendering & Delivery | ISR & partial pre-rendering (PPR)          | Content | The "mostly static, partly dynamic" middle ground           |
| ☐    | 17  | Layouts & Archetypes | Empty & first-run dashboards               | Content | Extends Empty States up to the whole-screen scale           |
| ✅   | 18  | All                  | Diagram component for delivery timelines   | Feature | Rendering/hydration are visual; a reusable diagram block helps |

---

# Rendering & Delivery

How and when the screen reaches the user, and the UX consequences of each choice
— perceived performance, time-to-interactive, layout shift, and the gap between
*visible* and *interactive*. Ties back to
[Loading & Optimistic States](/docs/patterns/loading-states) throughout.

## 1. Rendering strategy decision rubric — [Content]

CSR / SSR / SSG / ISR / PPR side by side, framed by what the user *feels*: when
is content visible, when is it interactive, who pays the latency, and how each
strategy fails. A `<DoDont>` for "static the marketing page, stream the app
shell" vs. "SSR everything and ship a 4s TTI." A decision table keyed on
content freshness, personalization, SEO, and scale.

**Why #1:** It's the macro analog of the loading-states wait-type rubric — the
one page you'll reopen at the start of every project and link teammates to. Sets
the vocabulary the rest of the section reuses.

## 6. Streaming SSR & Suspense — [Content] ✅ Done

> Shipped as `app-screens/rendering/streaming-ssr.mdx` with blocking-vs-streaming
> `Timeline` diagrams, a `<DoDont>` on boundary placement, and a warning that one
> boundary around everything is just blocking with extra steps.

Stream HTML as it's ready, flush the shell first, let slow data arrive in its
own Suspense boundary. Where boundaries go, what to show inside them (this is
the same skeleton/spinner decision from loading states, now at the document
level), and how streaming changes perceived performance vs. blocking SSR.

**Why:** The modern default in React (RSC / `renderToPipeableStream`,
TanStack Start streaming), and it connects directly to the existing loading
page — Suspense fallbacks *are* loading states, just hoisted to the route.

## 8. Hydration, islands & partial hydration — [Content]

Why a server-rendered page can look done but not respond (the uncanny valley
between paint and TTI), hydration cost, islands / selective hydration, and
"ship less JS." A `<Callout variant="warning">` on the dead-but-painted
window and how it confuses users into rage-clicking.

**Why:** Demystifies the single most common "it looks loaded, why can't I click"
bug, and gives the engineering reason behind a UX symptom — exactly this wiki's
angle.

## 11. Data fetching & caching at the route level — [Content] ✅ Done

> Shipped as `app-screens/rendering/data-fetching.mdx` with a loader/RSC/client
> table and waterfall-vs-parallel `Timeline` diagrams, plus prefetch-on-intent
> and a cache/invalidation callout.

Where data loads relative to the route: route loaders (TanStack Router / React
Router), RSC fetches, or client-side TanStack Query. Waterfalls vs. parallel
loading, prefetch on intent/hover, cache invalidation, and the
visible-vs-interactive consequence of each.

**Why:** The actual day-job decision once rendering strategy is chosen, and it
extends the Query material already used in loading states up to the route scale.

## 16. ISR & partial pre-rendering (PPR) — [Content]

The middle ground: mostly static, partly dynamic. Incremental regeneration,
stale-while-revalidate semantics, and PPR's static-shell-plus-streamed-holes
model. When this beats full SSR or full SSG, and the staleness UX trade.

**Why:** Rounds out the rendering spectrum so the rubric (#1) isn't a binary.
Lower-frequency reach, hence ranked below the core strategies.

---

# Routing & Navigation

Routing (the engineering) and navigation (the UI of routing) live together on
purpose. **This is where web and RN diverge hardest** — React Router /
TanStack Router vs. React Navigation / Expo Router — so lean on
`<PlatformTabs>` here more than anywhere else.

## 2. Nav pattern picker: tab vs sidebar vs top nav — [Content] ✅ Done

> Shipped as `app-screens/navigation/nav-pattern-picker.mdx` with a live
> `NavPatternGallery` (three clickable chrome mockups) and a decision table.

When each navigation chrome wins: bottom tab bar (few top-level destinations,
mobile-first), sidebar (deep/hierarchical, desktop dashboards), top nav
(marketing, shallow apps), and combinations. Destination count, hierarchy depth,
and platform expectations as the deciding axes. A `<DoDont>` on "5 tabs, flat"
vs. "11 tabs hiding a tree."

**Why #2:** The recurring "where does navigation live" decision, and one of the
clearest places to put web and RN side by side — the same app answers it
differently per platform.

## 3. URL as state, search params & deep linking — [Content] ✅ Done

> Shipped as `app-screens/navigation/url-as-state.mdx` with a live `UrlStateDemo`
> (a faux browser whose address bar tracks URL-backed controls and survives a
> reload, while the local toggle resets). Covers path vs. search params and the
> debounce/replace-vs-push gotcha.

Treat the URL as serializable app state: filters, tabs, pagination, selected
item all in search params so views are shareable, back-button-correct, and
refresh-safe. Typed search params (TanStack Router / Zod), what belongs in the
URL vs. local state, and deep linking — including RN universal/app links via
Expo Router. A `<DoDont>` on "filter state in the URL" vs. "filter state trapped
in `useState`."

**Why:** Most-skipped, most-gotten-wrong routing concern, and a genuinely shared
web/RN idea (deep linking is the mobile face of the same problem). High
reference value, broadly applicable.

## 5. Web vs RN navigation models — [Content] ✅ Done

> Shipped as `app-screens/navigation/web-vs-rn-navigation.mdx` with a
> `NavModelMap` visual (the same app as a web route tree beside a native
> navigator tree), a concept-mapping table, and a section on what doesn't map
> (back behavior, tab persistence, modals, the missing URL).

The conceptual mismatch laid bare: the web's single history stack and URL-as-
truth vs. native's nested **stack / tab / drawer** navigators, the back-stack as
a real data structure, screen lifecycle, gestures, and headers. Expo Router's
file-based routing as the bridge that makes RN feel web-shaped — and where the
abstraction leaks. Mostly `<PlatformTabs>`.

**Why:** The single most cross-platform-valuable page in the whole library and
the thing most web-only wikis can't write. Ranked just below the broadly-useful
picker and URL pages because it's deeper/narrower.

## 9. Route architecture & code-splitting — [Content]

Structuring routes: nested layouts, route groups, the layout-route pattern (a
parent route renders shared chrome + an `<Outlet>`), and splitting bundles along
route boundaries so navigation lazy-loads. How route nesting and layout nesting
relate, and where this meets the app shell (#4).

**Why:** Foundational plumbing the rest of the section assumes, but lower in the
ranking because it's reference-on-demand rather than a decision you sweat often.

## 13. Breadcrumbs & wayfinding — [Content] ✅ Done

> Shipped as `app-screens/navigation/breadcrumbs.mdx` with a `BreadcrumbsDemo`
> (collapsed-middle trail, current crumb as plain text) and the key distinction:
> breadcrumbs show position, not history.

When breadcrumbs earn their space (deep hierarchies, not flat apps), reflecting
route hierarchy vs. navigation history, truncation on small screens, and the
mobile question of whether they belong at all. Pairs with the back-stack
discussion in #5.

**Why:** Small, self-contained page that settles a recurring "do I even need
these" question. Cheap to write, modest reach.

---

# Layouts & Archetypes

The big-picture screen layouts you assemble components into: the app shell, and
the recurring whole-screen archetypes — dashboards, landing pages, master-detail.

## 4. App shell & layout composition — [Content] ✅ Done

> Shipped concretely as `app-screens/layouts/nav-rail-triptych.mdx` (the
> rail + list + content + metadata shell) with a static anatomy diagram and a
> live, drivable mockup. The reusable frame primitives (`ShellFrame`,
> `DiagramFrame`, `Region`, `Bar`) now live in `components/docs/shell.tsx` for
> the rest of the archetype pages.

The persistent frame — header, nav, content region, optional footer — and how
the routed view slots into it via layout routes and `<Outlet>`. Composition over
duplication (one shell, many screens), where the scroll container lives, and
sticky/safe-area concerns. Sets up the responsive variant in #14.

**Why #4 / first in section:** The frame every other archetype hangs inside —
defining it early makes the dashboard, master-detail, and responsive pages
concrete instead of abstract. Highest-reach layout page.

## 7. Dashboard layout & information density — [Content] ✅ Done

> Shipped as `app-screens/layouts/dashboard-layout.mdx` with a live
> `DashboardDensity` (a comfortable/compact toggle on the same dashboard) and a
> `<DoDont>` plus warning callout aimed squarely at the metric-card-grid cliché.

Grid systems for dashboards, card vs. region composition, visual hierarchy when
everything competes for attention, density as a deliberate trade (echoing the
Data-tables density discussion, now at screen scale), and progressive disclosure
to fight overload. A `<DoDont>` on "lead with the one number that matters" vs.
"twelve equal-weight widgets."

**Why:** High-recurrence admin/internal-tool work, and it pairs naturally with
the existing Data section — a dashboard is mostly tables and charts in a grid.

## 12. Landing / marketing page anatomy — [Content] ✅ Done

> Shipped as `app-screens/layouts/landing-marketing.mdx` with a `LandingAnatomy`
> page-silhouette visual. Framed explicitly as the brand-register counterpart to
> the dashboard, with a warning callout on the slop landing (gradient hero +
> identical feature cards).

The archetype with different rules from app UI: hero, value prop, social proof,
feature sections, CTA rhythm, the fold as a soft guideline not a law, and
conversion-oriented hierarchy. Why this is usually the SSG/static case from #1
and where a marketing page's performance budget differs from an app's.

**Why:** You ship these alongside apps, the rules genuinely differ from product
UI, and it closes the loop with the rendering rubric (static delivery lives
here).

## 14. Responsive app-shell behavior — [Content] ✅ Done

> Shipped as `app-screens/layouts/responsive-app-shell.mdx` with a live
> `ResponsiveShell` (a desktop/tablet/phone viewport toggle that sheds regions
> from the outside in and collapses to a bottom-tab single pane, reusing
> `PhoneFrame`).

How the shell adapts across breakpoints and platforms: sidebar that collapses to
a drawer to a bottom tab bar, content reflow, the responsive-vs-adaptive
distinction applied to whole layouts, and safe areas / notches on RN. Heavy
`<PlatformTabs>` and a `<DoDont>` on "one shell that adapts" vs. "two divergent
codebases."

**Why:** Where the app shell (#4) meets responsive/RN reality — the page that
makes the shell actually ship cross-platform. Builds on #4, so ranked after it.

## 15. Master-detail / multi-pane layouts — [Content] ✅ Done

> Shipped as `app-screens/layouts/master-detail.mdx` with a live mockup whose
> layout toggle folds the same data from two-pane to a single-pane phone
> drill-down. Cross-linked with #4 (the triptych is master-detail plus two
> rails).

The list+detail archetype (inbox, settings, file browser): side-by-side on wide
screens, and how it folds to list-pushes-to-detail navigation on mobile. URL
ties back to #3 (the selected item is a route/param), and the fold behavior ties
to #14.

**Why:** A pervasive archetype with a real cross-platform twist (the same layout
is two panes on web, a navigation stack on phone), connecting routing and layout.

## 17. Empty & first-run dashboards — [Content]

The whole-screen empty state: a dashboard before any data, first-run onboarding,
zero-config setup. Extends the component-scale
[Empty States](/docs/patterns/empty-states) page up to the app scale — empty
*screens*, not empty widgets — with guidance on guiding the first meaningful
action rather than showing a blank grid.

**Why:** Natural macro-scale sequel to the existing Empty States page; ranked
lower only because it's narrower than the core layout archetypes.

---

# Library-wide tooling

## 10. Scale-map landing for the library — [Feature] ✅ Done

> Shipped as `app-screens/index.mdx` (slug `/docs/app-screens`, an "Overview"
> section that sorts first) with a `ScaleMap` visual laying the sections out as a
> top-down scale ladder and handing off to Building Blocks. It's now the
> library's first page, so the header switcher lands here.

A short index page (or visual) placing every section on the
macro→micro spectrum: App & Screens at the top (delivery → routing → layout),
handing down to Building Blocks (patterns → components → foundations). Makes the
two-library split legible the moment someone lands.

**Why:** Cheap orientation that earns its keep the instant the wiki has two
libraries — readers need to know which half they're in. Pure plumbing, high
clarity-per-effort.

## 18. Diagram component for delivery timelines — [Feature] ✅ Done

> Shipped as `components/docs/timeline.tsx` — a reusable `<Timeline>` of
> proportional segment lanes with milestone markers (visible/interactive/render).
> In use on the streaming and data-fetching pages.

A small reusable MDX block for sequence/timeline diagrams — request → server
render → stream → hydrate → interactive — so rendering and hydration pages can
*show* the visible-vs-interactive gap instead of only describing it.

**Why:** Rendering & Delivery is inherently temporal and visual; a shared
diagram component lifts #1, #6, and #8 at once. Ranked last because it's a
nice-to-have multiplier, not a blocker — prose + the existing code blocks ship
the pages without it.

---

### Quick wins to start with

If you want momentum: **#1 Rendering rubric** is the keystone — write it first so
everything else has a vocabulary, and it slots straight onto the seed overview
page from Phase 1. **#4 App shell** anchors the Layouts section the same way.
For the cross-platform payoff that no one else's wiki has, **#3 URL-as-state**
and **#5 Web vs RN navigation** are the two highest-leverage `<PlatformTabs>`
pages. **#10 the scale-map** is a tiny feature that makes the whole macro/micro
split land. Save **#18 the diagram component** for once the Rendering pages exist
and you can see exactly what they need to draw.
