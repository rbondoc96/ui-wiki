import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react"

import type { Doc } from "#/lib/docs.ts"

export function PrevNext({ next, prev }: { next?: Doc; prev?: Doc }) {
  if (!prev && !next) {
    return null
  }

  return (
    <nav className="mt-12 grid grid-cols-2 gap-4 border-t pt-6">
      {prev ? (
        <Link
          to="/docs/$"
          params={{ _splat: prev.slug }}
          className="group flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-foreground/30 hover:bg-accent/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeftIcon className="size-3" /> Previous
          </span>
          <span className="text-sm font-medium text-foreground">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to="/docs/$"
          params={{ _splat: next.slug }}
          className="group flex flex-col items-end gap-1 rounded-lg border p-4 text-right transition-colors hover:border-foreground/30 hover:bg-accent/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next <ArrowRightIcon className="size-3" />
          </span>
          <span className="text-sm font-medium text-foreground">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
