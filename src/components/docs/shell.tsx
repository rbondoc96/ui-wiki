import { cn } from "#/lib/utils.ts"
import type { ReactNode } from "react"

// Shared visual primitives for the Layouts & Archetypes pages. Each archetype
// gets two kinds of figure: a static `DiagramFrame` schematic that names the
// regions, and a live mockup inside a `ShellFrame`. Keeping the framed canvas
// and the diagram parts here means every archetype renders in the same
// theme-aware shell instead of redefining the border-and-card chrome.

// The framed canvas a live, interactive mockup sits inside. `data-ui` opts into
// the docs preview styling; pass a height (and any layout) via `className`.
export function ShellFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "not-prose my-8 flex overflow-hidden rounded-xl border border-border bg-card text-xs",
        className
      )}
      data-ui
    >
      {children}
    </div>
  )
}

// A static, captioned schematic. Holds a row of `<Region>`s that name the parts
// of a layout without drawing real UI.
export function DiagramFrame({
  caption,
  children,
  className,
}: {
  caption: string
  children: ReactNode
  className?: string
}) {
  return (
    <figure className="not-prose my-8">
      <div
        className={cn(
          "flex overflow-hidden rounded-xl border border-border bg-card",
          className
        )}
      >
        {children}
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}

// One labelled region of a `DiagramFrame`. `grow` controls relative width so the
// proportions can echo a real shell (thin rail, wide content).
export function Region({
  caption,
  children,
  grow,
  name,
}: {
  caption: string
  children?: ReactNode
  grow: string
  name: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-r border-border px-3 py-3 last:border-r-0",
        grow
      )}
    >
      <span className="text-[0.65rem] font-semibold tracking-wider text-foreground uppercase">
        {name}
      </span>
      <div className="flex flex-1 flex-col gap-1.5">{children}</div>
      <span className="text-[0.7rem] leading-tight text-muted-foreground">
        {caption}
      </span>
    </div>
  )
}

// A faint placeholder bar, used to suggest content inside a `Region` without
// drawing real UI.
export function Bar({ w = "w-full" }: { w?: string }) {
  return <span className={cn("h-1.5 rounded-full bg-muted-foreground/20", w)} />
}

// A narrow device frame for showing a layout's single-pane phone form, with a
// home-indicator pill so it reads as a handset. Center it on a surface (e.g.
// inside a `ShellFrame`) for the "shown on a phone" look; it stretches to the
// available height so inner regions can scroll.
export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex w-60 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
      <div className="flex justify-center py-1.5">
        <span className="h-1 w-16 rounded-full bg-muted-foreground/30" />
      </div>
    </div>
  )
}
