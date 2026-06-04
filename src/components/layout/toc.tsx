import { useEffect, useState } from "react"

import type { TocEntry } from "#/lib/mdx/remark-toc-slugs.ts"
import { cn } from "#/lib/utils.ts"

export function TableOfContents({ toc }: { toc: Array<TocEntry> }) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (toc.length === 0) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 1 }
    )

    for (const entry of toc) {
      const el = document.getElementById(entry.id)
      if (el) {
        observer.observe(el)
      }
    }
    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) {
    return <div className="hidden w-56 shrink-0 xl:block" />
  }

  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pl-4 xl:block">
      <p className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
        On this page
      </p>
      <ul className="flex flex-col gap-1 text-sm">
        {toc.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={cn(
                "block py-0.5 transition-colors",
                entry.depth === 3 && "pl-3",
                activeId === entry.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
