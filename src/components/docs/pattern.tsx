import type { ReactNode } from "react"

import { cn } from "#/lib/utils.ts"

// A version-stamped guidance block. Gotchas and patterns go stale by tool
// version, so `<Pattern>` frames a snippet with the version it targets and the
// date the guidance was last checked against that version. Citations are a
// separate concern — wrap or nest a `<SourceTrail>` when a pattern needs one.
export function Pattern({
  checked,
  children,
  version,
}: {
  checked: string
  children: ReactNode
  version: string
}) {
  return (
    <aside className="my-6 overflow-hidden rounded-lg border border-border">
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-1.5",
          "text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase"
        )}
      >
        <span className="font-semibold text-foreground">{version}</span>
        <span>· checked {checked}</span>
      </div>
      <div className="px-4 py-3 text-sm leading-relaxed [&>p]:my-0 [&>p+p]:mt-3">
        {children}
      </div>
    </aside>
  )
}
