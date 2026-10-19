import { useState } from "react"

import { Bar } from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// The five-width schematic for the viewport-classes page. Each class draws the
// same app as labeled regions inside a frame scaled to its relative width, so
// what changes from phone to ultrawide is visible at a glance: the nav chrome,
// the number of panes, and on the widest screens a capped reading width
// instead of a stretched one. The live, clickable version of the narrower
// three lives on the responsive app-shell page.

const NAV_LABEL = {
  bar: "Tab bar",
  rail: "Rail",
  sidebar: "Sidebar",
} as const

type Pane = "content" | "inspector" | "list"

const CLASSES = [
  {
    frameWidth: "w-[30%]",
    id: "compact",
    label: "Phone",
    nav: "bar",
    notes: [
      "One pane; the list pushes to the detail.",
      "Tab bar at the bottom, in thumb reach.",
      "Leave room for the safe-area insets.",
    ],
    panes: ["content"],
    range: "under 600",
  },
  {
    frameWidth: "w-[46%]",
    id: "medium",
    label: "Tablet",
    nav: "rail",
    notes: [
      "A rail replaces the tab bar.",
      "Still one pane in portrait.",
      "Touch input at a near-desktop width.",
    ],
    panes: ["content"],
    range: "600 to 839",
  },
  {
    frameWidth: "w-[62%]",
    id: "expanded",
    label: "Desktop",
    nav: "rail",
    notes: [
      "List and content side by side.",
      "Rail, or a sidebar that collapses to one.",
    ],
    panes: ["list", "content"],
    range: "840 to 1199",
  },
  {
    frameWidth: "w-[80%]",
    id: "large",
    label: "Wide",
    nav: "sidebar",
    notes: [
      "Sidebar with full labels.",
      "List and content both at a comfortable width.",
    ],
    panes: ["list", "content"],
    range: "1200 to 1599",
  },
  {
    frameWidth: "w-full",
    id: "extra-large",
    label: "Ultrawide",
    nav: "sidebar",
    notes: [
      "Spend the width on a third pane: inspector or preview.",
      "Cap the reading width near 80 characters.",
      "Keep content next to the nav, not centered far from it.",
    ],
    panes: ["list", "content", "inspector"],
    range: "1600 and up",
  },
] as const satisfies ReadonlyArray<{
  frameWidth: string
  id: string
  label: string
  nav: keyof typeof NAV_LABEL
  notes: ReadonlyArray<string>
  panes: ReadonlyArray<Pane>
  range: string
}>

type ViewportClass = (typeof CLASSES)[number]

function RegionLabel({ children }: { children: string }) {
  return (
    <span className="text-[0.6rem] font-semibold tracking-wider text-muted-foreground uppercase">
      {children}
    </span>
  )
}

function ContentPane({ capped }: { capped: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2">
      <RegionLabel>Content</RegionLabel>
      <div
        className={cn(
          "flex flex-col gap-1.5",
          capped && "relative w-3/5 border-r border-dashed border-chart-3 pr-2"
        )}
      >
        <Bar w="w-1/2" />
        <Bar />
        <Bar w="w-5/6" />
        <Bar />
        {capped ? (
          <span className="absolute -top-4 right-0 translate-x-1/2 rounded bg-chart-3/20 px-1 font-mono text-[0.55rem] text-foreground">
            ≈80ch
          </span>
        ) : null}
      </div>
    </div>
  )
}

function SidePane({ label, width }: { label: string; width: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-1.5 border-border p-2",
        label === "List" ? "border-r" : "border-l",
        width
      )}
    >
      <RegionLabel>{label}</RegionLabel>
      <Bar />
      <Bar w="w-2/3" />
      <Bar w="w-5/6" />
    </div>
  )
}

function Screen({ viewportClass }: { viewportClass: ViewportClass }) {
  const panes: ReadonlyArray<Pane> = viewportClass.panes
  const isUltrawide = viewportClass.id === "extra-large"

  const paneRow = (
    <div className="flex min-h-0 min-w-0 flex-1">
      {panes.includes("list") ? <SidePane label="List" width="w-1/4" /> : null}
      <ContentPane capped={isUltrawide} />
      {panes.includes("inspector") ? (
        <SidePane label="Inspector" width="w-1/5" />
      ) : null}
    </div>
  )

  return (
    <div
      className={cn(
        "flex min-w-[7rem] overflow-hidden rounded-lg border border-border bg-card transition-[width] duration-300",
        viewportClass.nav === "bar" ? "flex-col" : "flex-row",
        viewportClass.frameWidth
      )}
    >
      {viewportClass.nav === "bar" ? (
        <>
          {paneRow}
          <div className="flex justify-center border-t border-border bg-muted/30 py-1.5">
            <RegionLabel>{NAV_LABEL.bar}</RegionLabel>
          </div>
        </>
      ) : (
        <>
          <div
            className={cn(
              "flex shrink-0 justify-center border-r border-border bg-muted/30 py-2",
              viewportClass.nav === "rail" ? "w-7" : "w-24"
            )}
          >
            <span
              className={cn(
                viewportClass.nav === "rail" && "[writing-mode:vertical-rl]"
              )}
            >
              <RegionLabel>{NAV_LABEL[viewportClass.nav]}</RegionLabel>
            </span>
          </div>
          {paneRow}
        </>
      )}
    </div>
  )
}

export function ViewportClassDemo() {
  const [selectedId, setSelectedId] = useState<ViewportClass["id"]>("compact")
  const selected = CLASSES.find((c) => c.id === selectedId) ?? CLASSES[0]

  return (
    <figure className="not-prose my-8 leading-normal">
      <div className="overflow-hidden rounded-xl border border-border bg-card text-xs">
        <div
          aria-label="Viewport class"
          className="flex flex-wrap gap-1 border-b border-border bg-muted/20 px-2 py-1.5"
          role="group"
        >
          {CLASSES.map((c) => (
            <button
              aria-pressed={c.id === selectedId}
              className={cn(
                "flex flex-col items-start rounded-md px-2 py-1 text-left transition-colors",
                c.id === selectedId
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              type="button"
            >
              <span className="font-medium">{c.label}</span>
              <span className="font-mono text-[0.6rem]">{c.range}</span>
            </button>
          ))}
        </div>
        <div className="flex h-48 bg-muted/20 p-4">
          <Screen viewportClass={selected} />
        </div>
        <div className="border-t border-border px-3 py-2">
          <p className="font-medium text-foreground">
            {selected.label}{" "}
            <span className="font-mono font-normal text-muted-foreground">
              {selected.id}
            </span>
          </p>
          <div className="mt-1 flex flex-col gap-0.5 text-muted-foreground">
            {selected.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        The same app at each window size class, with frames scaled to relative
        width. Widths are CSS pixels.
      </figcaption>
    </figure>
  )
}
