# Suggested Additions

Ranked ideas for growing this wiki, biased toward what pays off for a
frontend-leaning fullstack dev who lives in React and ships React Native.

Each item is tagged **[Feature]** (changes the site/tooling), **[Content]** (a
new MDX page or section), or **[Both]**. Ranking is by value-per-effort and how
often you'll actually reach for it.

| #   | Item                                          | Type        | Why it ranks here                                          |
| --- | --------------------------------------------- | ----------- | ---------------------------------------------------------- |
| 1   | Live, editable code playground                | Feature     | Force multiplier — every component page gets better        |
| 2   | Forms & validation patterns                   | Content     | Most-referenced, most-gotten-wrong UX surface              |
| 3   | Web ↔ React Native tabs                       | Both        | Unique to your stack; nobody else's wiki has it            |
| 4   | Overlays: dialog / sheet / popover            | Content     | Focus traps, scroll lock, mobile sheets — easy to botch    |
| 5   | Loading, skeleton & optimistic states         | Content     | The states most devs skip and most users feel              |
| 6   | Do / Don't comparison component               | Feature     | UI wikis live on side-by-side contrast                     |
| 7   | Motion & animation guidelines                 | Content     | Durations, easing, reduced-motion, spring on RN            |
| 8   | Component API table + a11y checklist + status | Feature     | Makes Components section feel like real docs               |
| 9   | Toasts & notification/feedback patterns       | Content     | Where to surface success/error without stealing focus      |
| 10  | Responsive layout & container queries         | Content     | The modern answer to "how do I make this adapt"            |
| 11  | Touch targets & mobile ergonomics             | Content     | Thumb zones, hit slop, 44pt rule — RN-relevant             |
| 12  | Data tables & long lists                      | Content     | Sorting, pagination, density, virtualization, responsive   |
| 13  | Theming & design tokens deep dive             | Content     | Ties your Foundations together into a system               |
| 14  | i18n & RTL                                     | Content     | Cheap to plan for, brutal to retrofit                      |
| 15  | Site polish (tags, related, changelog, RSS)   | Feature     | Quick wins that improve discovery                          |

---

## 1. Live, editable code playground — [Feature]

Right now examples are either static highlighted code or a single prebuilt
React component (`selection-pattern-examples.tsx`). The highest-leverage change
is letting readers **edit and run** React inline (Sandpack, or a lightweight
`react-live`-style evaluator wired to your existing Shiki theming).

**Why #1:** It's the one change that compounds — every current and future
component page becomes a lab instead of a reference. It's also the thing a
React-loving author will get the most personal use out of when prototyping.

## 2. Forms & validation patterns — [Content]

When to validate (on blur vs submit vs change), inline vs summary errors, error
copy, required vs optional marking, disabled-submit anti-pattern, async/server
errors, multi-step forms, autosave.

**Why:** It's the surface you touch on nearly every project and the one with the
most subtle UX failure modes. Pairs naturally with a React Hook Form / TanStack
Form example.

## 3. Web ↔ React Native tabs — [Both]

A `<PlatformTabs>` MDX component that shows the web pattern and the RN
equivalent side by side (e.g. `<select>` vs `Picker`/bottom sheet, `:focus` vs
`accessibilityRole`, CSS transitions vs `Reanimated`).

**Why:** This is the genuinely differentiated angle for *your* wiki. Most
design-system docs are web-only; a cross-platform lens is rare and exactly where
your mobile/RN experience adds value others can't copy.

## 4. Overlays: dialog / sheet / popover — [Content]

Modal vs non-modal, focus trapping, scroll lock, return-focus, `Esc`/backdrop
dismissal, when to use a bottom sheet on mobile, nested overlays, route-driven
modals.

**Why:** Extends your Accessibility/Components work into the pattern devs most
reliably ship broken. High reference value and your `@base-ui/react` primitives
already give you working examples to document.

## 5. Loading, skeleton & optimistic states — [Content]

Spinner vs skeleton vs progress, perceived performance, optimistic updates and
rollback, empty-vs-loading-vs-error distinction (extends your existing
empty-states page), skeleton matching real layout.

**Why:** These are the states that get cut under deadline and the ones users
feel most. Especially relevant alongside TanStack Query.

## 6. Do / Don't comparison component — [Feature]

A `<DoDont>` MDX block rendering a green "do" and red "don't" example
side-by-side (text or live).

**Why:** Contrast is how UI/UX guidance lands. Cheap to build, and it sharpens
every existing page (button anatomy, focus, selection patterns).

## 7. Motion & animation guidelines — [Content]

Duration/easing scales, what to animate (and what not to), `prefers-reduced-
motion`, enter/exit transitions, spring vs timing, RN `Reanimated`/`LayoutAnimation`.

**Why:** Rounds out Foundations with the one foundation that's missing, and
motion is where polished products separate from default ones.

## 8. Component API table + a11y checklist + status badge — [Feature]

Per-component: a props/API table component, a small "Accessibility" checklist
block, and a frontmatter `status` (draft/stable/deprecated) rendered as a badge.

**Why:** Turns the Components section from prose into something that reads like
real component docs, and the status badge keeps the wiki honest as it grows.

## 9. Toasts & notification/feedback patterns — [Content]

Toast vs inline vs banner vs dialog, auto-dismiss timing, stacking, action in
toast, accessibility (`aria-live`), error vs success conventions.

**Why:** Decision-heavy area ("where do I put this message?") that benefits from
a written rubric you can point teammates at.

## 10. Responsive layout & container queries — [Content]

Breakpoint philosophy, fluid type/space (`clamp`), container queries vs media
queries, intrinsic layouts, the difference between responsive and adaptive.

**Why:** The modern, post-breakpoint answer to layout — directly useful and not
yet covered by your spacing/typography pages.

## 11. Touch targets & mobile ergonomics — [Content]

44×44 / 48dp minimums, hit slop, thumb zones, gesture conflicts, safe areas,
hover-doesn't-exist-on-touch.

**Why:** Small page, high payoff, and squarely in your RN wheelhouse — most
web-centric wikis ignore it entirely.

## 12. Data tables & long lists — [Content]

Column sizing, sorting, pagination vs infinite scroll, density, sticky headers,
selection, responsive collapse, virtualization, mobile card fallback.

**Why:** Tables are deceptively hard and recurring in dashboards/admin work;
having a reference saves real time.

## 13. Theming & design tokens deep dive — [Content]

Semantic vs primitive tokens, naming, dark mode beyond inversion, the token →
CSS var → Tailwind pipeline you already use, theming RN from the same source.

**Why:** Ties spacing/typography/color into one system and documents the
architecture this very site runs on.

## 14. i18n & RTL — [Content]

Logical properties, RTL mirroring, pluralization, string expansion, locale-aware
formatting, what *not* to mirror (icons, charts).

**Why:** Cheap to design for up front and painful to retrofit — a short page now
saves a large refactor later.

## 15. Site polish — [Feature]

Quick wins: frontmatter **tags** + a filter/landing by tag, **related pages**
("see also"), a **changelog/recently-updated** view (you already track git
dates), **RSS feed**, and **"edit on GitHub"** links.

**Why:** Low effort, improves discovery as the content count grows, and the
git-date plumbing is already in place.

---

### Quick wins to start with

If you want momentum: **#6 Do/Don't** and **#3 PlatformTabs** are small,
self-contained MDX components that immediately upgrade existing pages, and
**#2 Forms** and **#5 Loading states** are the two content pages you'll
reference most. **#1 the playground** is the big bet — highest ceiling, most
effort.
