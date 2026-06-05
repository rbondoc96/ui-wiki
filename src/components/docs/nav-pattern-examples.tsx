import {
  BellIcon,
  ChartBarIcon,
  FolderIcon,
  GearSixIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
  UserIcon,
} from "@phosphor-icons/react"
import { useState } from "react"
import type { Icon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

import { Bar } from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// A side-by-side gallery of the three navigation chromes, each a small live
// mockup whose items you can click to move the active state. The point is
// comparative: the same app, three places its navigation could live, with a
// one-line note on when each wins.

function Frame({
  caption,
  children,
  label,
}: {
  caption: string
  children: ReactNode
  label: string
}) {
  return (
    <figure className="flex flex-col">
      <div className="flex h-44 overflow-hidden rounded-xl border border-border bg-card text-xs">
        {children}
      </div>
      <figcaption className="mt-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </figcaption>
    </figure>
  )
}

function Filler() {
  return (
    <div className="flex flex-1 flex-col gap-1.5 p-3">
      <Bar w="w-1/2" />
      <Bar />
      <Bar w="w-5/6" />
      <Bar w="w-2/3" />
    </div>
  )
}

const tabItems: Array<{ Icon: Icon; label: string }> = [
  { Icon: HouseIcon, label: "Home" },
  { Icon: MagnifyingGlassIcon, label: "Search" },
  { Icon: BellIcon, label: "Activity" },
  { Icon: UserIcon, label: "You" },
]

function BottomTabs() {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-1 flex-col">
      <Filler />
      <nav className="flex border-t border-border">
        {tabItems.map((t, i) => {
          const on = i === active
          return (
            <button
              aria-label={t.label}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-colors",
                on
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={t.label}
              onClick={() => setActive(i)}
              type="button"
            >
              <t.Icon className="size-4" weight={on ? "fill" : "regular"} />
              <span className="text-[0.6rem]">{t.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

const sideItems: Array<{ Icon: Icon; label: string }> = [
  { Icon: SquaresFourIcon, label: "Dashboard" },
  { Icon: FolderIcon, label: "Projects" },
  { Icon: ChartBarIcon, label: "Reports" },
  { Icon: GearSixIcon, label: "Settings" },
]

function Sidebar() {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-1">
      <nav className="flex w-28 shrink-0 flex-col gap-0.5 border-r border-border bg-muted/20 p-1.5">
        {sideItems.map((s, i) => {
          const on = i === active
          return (
            <button
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors",
                on
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={s.label}
              onClick={() => setActive(i)}
              type="button"
            >
              <s.Icon
                className="size-3.5 shrink-0"
                weight={on ? "fill" : "regular"}
              />
              <span className="truncate">{s.label}</span>
            </button>
          )
        })}
      </nav>
      <Filler />
    </div>
  )
}

const topItems = ["Product", "Pricing", "Docs", "Blog"]

function TopNav() {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex items-center gap-1 border-b border-border px-2 py-2">
        <span className="mr-1 size-3.5 rounded bg-foreground/80" />
        {topItems.map((t, i) => {
          const on = i === active
          return (
            <button
              className={cn(
                "rounded-md px-1.5 py-1 transition-colors",
                on
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={t}
              onClick={() => setActive(i)}
              type="button"
            >
              {t}
            </button>
          )
        })}
      </nav>
      <Filler />
    </div>
  )
}

export function NavPatternGallery() {
  return (
    <div className="not-prose my-8 grid gap-4 sm:grid-cols-3">
      <Frame caption="Few flat destinations, mobile-first." label="Bottom tabs">
        <BottomTabs />
      </Frame>
      <Frame
        caption="Deep or hierarchical, desktop dashboards."
        label="Sidebar"
      >
        <Sidebar />
      </Frame>
      <Frame caption="Shallow marketing or content sites." label="Top nav">
        <TopNav />
      </Frame>
    </div>
  )
}
