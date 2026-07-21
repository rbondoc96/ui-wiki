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
  "temporal-dead-zone": {
    aliases: ["TDZ", "dead zone"],
    definition:
      "The span between when a let/const binding enters scope and the line that initializes it. The name exists but reading it throws, which is why a const referenced before its definition fails where a hoisted function wouldn't.",
    id: "temporal-dead-zone",
    source: "mdn-hoisting",
    term: "temporal dead zone",
  },
} as const satisfies Record<string, Term>

export function getTerm(id: string): Term | undefined {
  return TERMS[id as keyof typeof TERMS]
}
