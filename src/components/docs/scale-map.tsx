import { Link } from "@tanstack/react-router"

import { cn } from "#/lib/utils.ts"

// The orientation visual for the App & Screens landing: the library's sections
// laid out as a top-down scale ladder, from the whole app down to a single
// screen, then handing off to the Building Blocks (micro) half below.

interface Rung {
  desc: string
  micro?: boolean
  scale: string
  slug: string
  title: string
}

const RUNGS: Array<Rung> = [
  {
    desc: "How a screen is built and delivered, and the UX bill each strategy pays.",
    scale: "whole app",
    slug: "app-screens/rendering",
    title: "Rendering & Delivery",
  },
  {
    desc: "Where navigation lives, and where view state lives so links and reloads restore it.",
    scale: "between screens",
    slug: "app-screens/navigation/nav-pattern-picker",
    title: "Routing & Navigation",
  },
  {
    desc: "How one screen is composed: the app shell and the recurring whole-screen archetypes.",
    scale: "one screen",
    slug: "app-screens/layouts/master-detail",
    title: "Layouts & Archetypes",
  },
  {
    desc: "The micro half: foundations, component anatomy, data display, patterns, and a11y.",
    micro: true,
    scale: "components ↓",
    slug: "foundations",
    title: "Building Blocks →",
  },
]

export function ScaleMap() {
  return (
    <ol className="not-prose my-8 flex flex-col rounded-xl border border-border bg-card p-5">
      {RUNGS.map((r, i) => {
        const last = i === RUNGS.length - 1
        return (
          <li
            className={cn(
              "flex gap-4",
              r.micro && "mt-1 border-t border-border pt-4"
            )}
            key={r.slug}
          >
            <span className="w-28 shrink-0 pt-0.5 text-right text-xs text-muted-foreground">
              {r.scale}
            </span>
            <div className="flex w-3 shrink-0 flex-col items-center">
              <span
                className={cn(
                  "mt-1 size-2.5 shrink-0 rounded-full border-2 bg-card",
                  r.micro ? "border-muted-foreground/40" : "border-primary"
                )}
              />
              {!last && !r.micro ? (
                <span className="w-px flex-1 bg-border" />
              ) : null}
            </div>
            <div className={cn("min-w-0 flex-1", !last && "pb-5")}>
              <Link
                className="font-medium text-foreground hover:underline"
                params={{ _splat: r.slug }}
                to="/docs/$"
              >
                {r.title}
              </Link>
              <p className="mt-0.5 text-sm text-muted-foreground">{r.desc}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
