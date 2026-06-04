import { Link } from "@tanstack/react-router"

import { navTree } from "#/lib/docs.ts"
import { cn } from "#/lib/utils.ts"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-6">
      {navTree.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {section.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((doc) => (
              <li key={doc.slug}>
                <Link
                  to="/docs/$"
                  params={{ _splat: doc.slug }}
                  onClick={onNavigate}
                  className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className: "bg-accent text-foreground font-medium",
                  }}
                >
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
