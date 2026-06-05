import { CaretRightIcon, DotsThreeIcon } from "@phosphor-icons/react"
import { Fragment } from "react"

// A static breadcrumb trail in a page-header context for the wayfinding page.
// Shows the collapsed-middle pattern (Home › … › leaf › current) and a current
// crumb that is plain text, not a link. Illustrative chrome, so the crumbs are
// styled like links without navigating.

const CRUMBS = [
  { collapsed: false, label: "Home" },
  { collapsed: true, label: "Projects" },
  { collapsed: false, label: "Website redesign" },
  { collapsed: false, current: true, label: "Settings" },
]

export function BreadcrumbsDemo() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 border-b border-border px-4 py-2.5 text-xs"
      >
        {CRUMBS.map((c, i) => {
          const sep =
            i > 0 ? (
              <CaretRightIcon className="size-3 shrink-0 text-muted-foreground/50" />
            ) : null
          if (c.collapsed) {
            return (
              <Fragment key={c.label}>
                {sep}
                <span
                  aria-label="Collapsed levels"
                  className="flex size-5 items-center justify-center rounded text-muted-foreground"
                >
                  <DotsThreeIcon className="size-4" />
                </span>
              </Fragment>
            )
          }
          return (
            <Fragment key={c.label}>
              {sep}
              <span
                aria-current={c.current ? "page" : undefined}
                className={
                  c.current
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:underline"
                }
              >
                {c.label}
              </span>
            </Fragment>
          )
        })}
      </nav>
      <div className="px-4 py-6 text-sm text-muted-foreground">
        Settings for <span className="text-foreground">Website redesign</span> —
        the current page. The trail above shows where it sits, with the middle
        collapsed to fit.
      </div>
    </div>
  )
}
