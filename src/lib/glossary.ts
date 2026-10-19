// Central typed glossary. Term definitions live here, deduped by id, so a term
// explained once reads the same everywhere it's cited. Inline `<Term>` marks
// point at these entries by id; an optional `source` reuses the SOURCES
// registry (src/lib/sources.ts) so a term and a cited page share one link.

export type Term = {
  // Optional surface forms for a future glossary index / search. Not rendered.
  aliases?: Array<string>
  definition: string
  id: string
  // Optional id into SOURCES — resolved for the "learn more" link.
  source?: string
  // Canonical display name, used when a `<Term>` mark has no children.
  term: string
}

export const TERMS = {
  "card-sorting": {
    aliases: ["card sort"],
    definition:
      "A research method where people group labeled cards, one per page or feature, into piles that make sense to them, then name the piles. The groups show how users expect the product to be organized, which is the raw material for top-level navigation.",
    id: "card-sorting",
    source: "nng-card-sorting",
    term: "card sorting",
  },
  hoisting: {
    aliases: ["hoisted"],
    definition:
      "JavaScript making a declaration's name available throughout its scope before execution reaches the line it's written on. Function declarations are fully hoisted — name and body — so they can be called from above; let/const bindings are hoisted in name only and can't be read until initialized.",
    id: "hoisting",
    source: "mdn-hoisting",
    term: "hoisting",
  },
  "information-architecture": {
    aliases: ["IA"],
    definition:
      "How a product's content and features are grouped, labeled, and connected. Navigation is the visible surface of it: the chrome can only show the structure the information architecture defines.",
    id: "information-architecture",
    term: "information architecture",
  },
  "pogo-sticking": {
    aliases: ["pogo-stick"],
    definition:
      "Jumping into a page and straight back out, repeatedly, while hunting for the right one. In navigation data it shows up as a visit followed by a back navigation within seconds, a sign that labels or placement don't tell people what's behind them.",
    id: "pogo-sticking",
    term: "pogo-sticking",
  },
  "referential-stability": {
    aliases: ["stable reference", "stable identity"],
    definition:
      "A value keeping the same identity (===) across renders instead of being recreated each time. Consumers that compare by reference — memo-wrapped children, dependency arrays, context values — only skip work when the values they read are referentially stable.",
    id: "referential-stability",
    source: "react-use-memo",
    term: "referential stability",
  },
  "render-cascade": {
    aliases: ["render loop"],
    definition:
      "A chain reaction where a render triggers an effect that sets state, forcing another render that triggers another effect, and so on. Each hop costs a wasted render and a frame of stale UI, and the chain is hard to trace back to what started it.",
    id: "render-cascade",
    source: "react-you-might-not-need-an-effect",
    term: "render cascade",
  },
  "strict-mode": {
    aliases: ["StrictMode"],
    definition:
      "A development-only React wrapper that surfaces fragile patterns — most visibly by mounting, unmounting, and remounting each component so every effect runs setup → cleanup → setup once extra. It changes nothing in production; it just makes effects that can't survive a remount fail early.",
    id: "strict-mode",
    source: "react-strict-mode",
    term: "StrictMode",
  },
  "suspense-boundary": {
    aliases: ["Suspense boundary"],
    definition:
      "A <Suspense> element that catches any descendant which suspends and shows its fallback until they're ready. Everything under one boundary reveals together; a nested boundary carves out a region allowed to arrive later. It's where 'what to show while waiting' is decided, replacing per-component loading flags.",
    id: "suspense-boundary",
    source: "react-suspense",
    term: "Suspense boundary",
  },
  "temporal-dead-zone": {
    aliases: ["TDZ", "dead zone"],
    definition:
      "The span between when a let/const binding enters scope and the line that initializes it. The name exists but reading it throws, which is why a const referenced before its definition fails where a hoisted function wouldn't.",
    id: "temporal-dead-zone",
    source: "mdn-hoisting",
    term: "temporal dead zone",
  },
  "window-size-class": {
    aliases: ["size class", "window size classes"],
    definition:
      "A named width range used to pick a layout: compact (under 600), medium (600 to 839), expanded (840 to 1199), large (1200 to 1599), and extra-large (1600 and up). Defined by Android in dp; the numbers carry over to CSS pixels.",
    id: "window-size-class",
    source: "android-window-size-classes",
    term: "window size class",
  },
} as const satisfies Record<string, Term>

export function getTerm(id: string): Term | undefined {
  return TERMS[id as keyof typeof TERMS]
}
