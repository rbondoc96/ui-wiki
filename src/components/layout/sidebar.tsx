import { Collapsible } from "@base-ui/react/collapsible"
import { Link, useLocation } from "@tanstack/react-router"
import { CaretDownIcon } from "@phosphor-icons/react"

import type { Doc } from "#/lib/docs.ts"
import { libraryForSlug, navTreeFor } from "#/lib/docs.ts"
import { cn } from "#/lib/utils.ts"

// Active library is derived from the current `/docs/<slug>` route so the
// sidebar shows only that library's sections.
function useActiveLibrary(): string {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\/docs\/?/, "")
  return libraryForSlug(slug)
}

function DocLink({ doc, onNavigate }: { doc: Doc; onNavigate?: () => void }) {
  return (
    <Link
      to="/docs/$"
      params={{ _splat: doc.slug }}
      onClick={onNavigate}
      className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      activeOptions={{ exact: true }}
      activeProps={{ className: "bg-accent text-foreground font-medium" }}
    >
      {doc.title}
    </Link>
  )
}

const panelClassName =
  "h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const navTree = navTreeFor(useActiveLibrary())
  return (
    <nav className="flex flex-col gap-4">
      {navTree.map((section) => (
        <Collapsible.Root key={section.title} defaultOpen>
          <Collapsible.Trigger className="group flex w-full items-center justify-between rounded-md px-2 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground">
            {section.title}
            <CaretDownIcon className="size-3 transition-transform group-data-[panel-open]:rotate-180" />
          </Collapsible.Trigger>
          <Collapsible.Panel className={panelClassName}>
            {section.items.length > 0 ? (
              <ul className="mt-1 flex flex-col gap-0.5">
                {section.items.map((doc) => (
                  <li key={doc.slug}>
                    <DocLink doc={doc} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            ) : null}
            {section.groups.map((group) => (
              <Collapsible.Root key={group.title} defaultOpen className="mt-1">
                <Collapsible.Trigger className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:text-foreground">
                  {group.title}
                  <CaretDownIcon className="size-3 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
                </Collapsible.Trigger>
                <Collapsible.Panel className={panelClassName}>
                  <ul className="mt-0.5 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
                    {group.items.map((doc) => (
                      <li key={doc.slug}>
                        <DocLink doc={doc} onNavigate={onNavigate} />
                      </li>
                    ))}
                  </ul>
                </Collapsible.Panel>
              </Collapsible.Root>
            ))}
          </Collapsible.Panel>
        </Collapsible.Root>
      ))}
    </nav>
  )
}

export function DesktopSidebar() {
  return (
    <aside
      className={cn(
        "sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border py-8 pr-4 lg:block"
      )}
    >
      <SidebarNav />
    </aside>
  )
}
