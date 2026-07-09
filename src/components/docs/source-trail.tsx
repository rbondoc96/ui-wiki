import { Popover } from "@base-ui/react/popover"
import { ArrowUpRightIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

import { getSource } from "#/lib/sources.ts"
import type { Source, SourceTrailRef } from "#/lib/sources.ts"
import { cn } from "#/lib/utils.ts"

// Human-readable labels for each ref role. Shown before the source title so the
// reader knows why a source is attached before reading the title.
const roleLabels = {
  "adapted-from": "Adapted from",
  "contrasts-with": "Contrasts with",
  defines: "Defines",
  "further-reading": "Further reading",
  "inspired-by": "Inspired by",
  supports: "Supports",
} as const satisfies Record<SourceTrailRef["role"], string>

// Short labels for source access status. `public` is intentionally omitted —
// only inaccessible sources are marked, honestly and without clutter.
const accessLabels = {
  book: "Book",
  paywalled: "Paywalled",
  "private-unavailable": "Private — unavailable",
} as const satisfies Record<Exclude<Source["access"], "public">, string>

function TrailRow({ trailRef }: { trailRef: SourceTrailRef }) {
  const source = getSource(trailRef.id)
  // Validation (spec step 4): every ref must resolve to a known source so bad
  // ids fail loudly at render/build rather than silently rendering nothing.
  if (!source) {
    throw new Error(
      `SourceTrail: unknown source id "${trailRef.id}". Add it to SOURCES in src/lib/sources.ts.`
    )
  }

  const accessLabel =
    source.access === "public" ? null : accessLabels[source.access]

  return (
    <li className="border-t border-border/60 py-3 first:border-t-0 first:pt-0 last:pb-0">
      <p className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
        {roleLabels[trailRef.role]}
      </p>
      <p className="mt-0.5 text-sm font-medium text-foreground">
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:underline"
          >
            {source.title}
            <ArrowUpRightIcon className="size-3 text-muted-foreground" />
          </a>
        ) : (
          source.title
        )}
      </p>
      <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
        {source.author ? <span>{source.author}</span> : null}
        <span className="rounded bg-muted px-1 py-px font-mono text-[0.625rem] tracking-wide uppercase">
          {source.type}
        </span>
        {trailRef.locator ? <span>· {trailRef.locator}</span> : null}
        {accessLabel ? (
          <span className="text-amber-600 dark:text-amber-500">
            · {accessLabel}
          </span>
        ) : null}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {trailRef.note}
      </p>
    </li>
  )
}

// Attaches role-tagged source citations to a meaningful block of content.
// Renders `children` (the block), then a quiet "Refs · N" chip that opens a
// compact popover listing each ref's role, source, locator, and relevance note.
export function SourceTrail({
  children,
  refs,
}: {
  children: ReactNode
  refs: Array<SourceTrailRef>
}) {
  return (
    <div className="source-trail">
      {children}
      <Popover.Root>
        <Popover.Trigger
          className={cn(
            "not-prose mt-1 inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5",
            "text-[0.7rem] font-medium text-muted-foreground transition-colors",
            "hover:bg-accent hover:text-foreground",
            "data-[popup-open]:bg-accent data-[popup-open]:text-foreground"
          )}
        >
          Refs · {refs.length}
        </Popover.Trigger>
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
              <Popover.Title className="text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
                Source trail
              </Popover.Title>
              <ul className="mt-2">
                {refs.map((trailRef) => (
                  <TrailRow key={trailRef.id} trailRef={trailRef} />
                ))}
              </ul>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
