import { Popover } from "@base-ui/react/popover"
import { ArrowUpRightIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

import { getTerm } from "#/lib/glossary.ts"
import { getSource } from "#/lib/sources.ts"
import { cn } from "#/lib/utils.ts"

// Inline glossary mark. Renders the term text followed by a superscript "?"
// button that opens a popover with the definition and, when the term carries a
// `source`, a link built from the SOURCES registry. `children` overrides the
// visible text for inflections; omit them to print the term's canonical name.
export function Term({ children, id }: { children?: ReactNode; id: string }) {
  const term = getTerm(id)
  // Validate like SourceTrail: unknown ids fail loudly at render/build rather
  // than silently rendering a dead affordance.
  if (!term) {
    throw new Error(
      `Term: unknown term id "${id}". Add it to TERMS in src/lib/glossary.ts.`
    )
  }

  const source = term.source ? getSource(term.source) : undefined

  return (
    <Popover.Root>
      <span className="whitespace-nowrap">
        {children ?? term.term}
        <Popover.Trigger
          aria-label={`Definition of ${term.term}`}
          className={cn(
            "not-prose ml-0.5 align-super text-[0.65em] font-semibold text-muted-foreground transition-colors",
            "hover:text-foreground data-[popup-open]:text-foreground",
            "cursor-help rounded-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          )}
        >
          ?
        </Popover.Trigger>
      </span>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} align="start" className="z-50">
          <Popover.Popup
            className={cn(
              "not-prose max-w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg",
              "origin-[var(--transform-origin)] transition-[opacity,transform]",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
            )}
          >
            <Popover.Title className="text-sm font-semibold text-foreground">
              {term.term}
            </Popover.Title>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {term.definition}
            </p>
            {source?.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
              >
                Source: {source.title}
                <ArrowUpRightIcon className="size-3" />
              </a>
            ) : null}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
