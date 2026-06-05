import { Dialog } from "@base-ui/react/dialog"
import { useNavigate } from "@tanstack/react-router"
import {
  FileTextIcon,
  HashIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react"
import { useEffect, useMemo, useRef, useState } from "react"

import { allDocs, libraryLabel } from "#/lib/docs.ts"
import { cn } from "#/lib/utils.ts"

interface SearchItem {
  keywords: string
  label: string
  library: string
  section: string
  to: string
  type: "doc" | "heading"
}

function buildIndex(): Array<SearchItem> {
  const items: Array<SearchItem> = []
  for (const doc of allDocs()) {
    const to = `/docs/${doc.slug}`
    const library = libraryLabel(doc.library)
    items.push({
      keywords:
        `${doc.title} ${doc.section} ${library} ${doc.description ?? ""}`.toLowerCase(),
      label: doc.title,
      library,
      section: doc.section,
      to,
      type: "doc",
    })
    for (const entry of doc.toc) {
      items.push({
        keywords: `${doc.title} ${entry.title} ${library}`.toLowerCase(),
        label: entry.title,
        library,
        section: doc.title,
        to: `${to}#${entry.id}`,
        type: "heading",
      })
    }
  }
  return items
}

export function SearchDialog({
  open,
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const navigate = useNavigate()
  const index = useMemo(buildIndex, [])
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return index.filter((item) => item.type === "doc")
    }
    return index.filter((item) => item.keywords.includes(q)).slice(0, 20)
  }, [index, query])

  useEffect(() => {
    setActive(0)
  }, [query])

  // Reset query each time the palette opens.
  useEffect(() => {
    if (open) {
      setQuery("")
    }
  }, [open])

  function select(item: SearchItem | undefined) {
    if (!item) {
      return
    }
    onOpenChange(false)
    navigate({ to: item.to })
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (event.key === "Enter") {
      event.preventDefault()
      select(results[active])
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed top-[15vh] left-1/2 z-50 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl outline-none",
            "transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0"
          )}
        >
          <Dialog.Title className="sr-only">Search docs</Dialog.Title>
          <div className="flex items-center gap-2 border-b px-4">
            <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search docs and headings…"
              value={query}
            />
          </div>
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No results for “{query}”.
              </p>
            ) : (
              results.map((item, i) => (
                <button
                  key={`${item.to}-${i}`}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    i === active
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent/50"
                  )}
                  onClick={() => select(item)}
                  onMouseEnter={() => setActive(i)}
                  type="button"
                >
                  {item.type === "doc" ? (
                    <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <HashIcon className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5">
                      {item.library}
                    </span>
                    {item.section}
                  </span>
                </button>
              ))
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
