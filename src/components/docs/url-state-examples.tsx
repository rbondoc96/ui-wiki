import { ArrowClockwiseIcon } from "@phosphor-icons/react"
import { useState } from "react"

import { ShellFrame } from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// An interactive faux browser for the URL-as-state page. Changing the URL-backed
// controls (tab, status, search) rewrites the address bar live; the one local
// toggle does not. Reload resets the local toggle but leaves the URL-backed
// state intact, which is the whole lesson: shareable/refresh-safe state belongs
// in the URL, ephemeral view state does not.

const TABS = ["overview", "activity"] as const
const STATUSES = ["all", "open", "done"] as const

function Segmented<T extends string>({
  onChange,
  options,
  value,
}: {
  onChange: (v: T) => void
  options: ReadonlyArray<T>
  value: T
}) {
  return (
    <div className="flex gap-0.5 rounded-md bg-muted/40 p-0.5">
      {options.map((o) => (
        <button
          className={cn(
            "rounded px-2 py-0.5 capitalize transition-colors",
            o === value
              ? "bg-background font-medium text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          key={o}
          onClick={() => onChange(o)}
          type="button"
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function Field({
  children,
  hint,
  label,
}: {
  children: React.ReactNode
  hint: string
  label: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-[0.7rem] text-muted-foreground">{hint}</p>
      </div>
      {children}
    </div>
  )
}

export function UrlStateDemo() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("overview")
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all")
  const [query, setQuery] = useState("")
  const [previewOpen, setPreviewOpen] = useState(true)
  const [flash, setFlash] = useState(false)

  const params = new URLSearchParams()
  if (tab !== "overview") params.set("tab", tab)
  if (status !== "all") params.set("status", status)
  if (query) params.set("q", query)
  const qs = params.toString()
  const path = `/projects${qs ? `?${qs}` : ""}`

  function reload() {
    setPreviewOpen(false)
    setFlash(true)
    setTimeout(() => setFlash(false), 1600)
  }

  return (
    <ShellFrame className="flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-3 py-2">
        <span className="flex gap-1">
          <span className="size-2 rounded-full bg-muted-foreground/30" />
          <span className="size-2 rounded-full bg-muted-foreground/30" />
          <span className="size-2 rounded-full bg-muted-foreground/30" />
        </span>
        <button
          aria-label="Reload"
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={reload}
          type="button"
        >
          <ArrowClockwiseIcon className="size-3.5" />
        </button>
        <div className="flex-1 truncate rounded-md border border-border bg-background px-2 py-1 font-mono text-[0.7rem]">
          <span className="text-muted-foreground">app.example.com</span>
          <span className="text-foreground">{path}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <Field hint="?tab — which view is showing" label="Tab">
          <Segmented options={TABS} value={tab} onChange={setTab} />
        </Field>
        <Field hint="?status — the active filter" label="Status">
          <Segmented options={STATUSES} value={status} onChange={setStatus} />
        </Field>
        <Field hint="?q — the search query" label="Search">
          <input
            className="w-32 rounded-md border border-border bg-background px-2 py-1 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="type…"
            value={query}
          />
        </Field>
        <div className="border-t border-border pt-3">
          <Field
            hint="local view state — never written to the URL"
            label="Preview pane"
          >
            <button
              aria-pressed={previewOpen}
              className={cn(
                "rounded-md px-2 py-1 transition-colors",
                previewOpen
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setPreviewOpen((v) => !v)}
              type="button"
            >
              {previewOpen ? "Open" : "Closed"}
            </button>
          </Field>
        </div>
        <p
          className={cn(
            "rounded-md bg-muted/40 px-2 py-1.5 text-[0.7rem] text-muted-foreground transition-opacity",
            flash ? "opacity-100" : "opacity-0"
          )}
        >
          Reloaded. Tab, status, and search came back from the URL; the preview
          pane (local state) reset to closed.
        </p>
      </div>
    </ShellFrame>
  )
}
