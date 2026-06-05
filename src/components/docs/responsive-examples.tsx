import {
  CaretLeftIcon,
  FolderIcon,
  GearSixIcon,
  HouseIcon,
} from "@phosphor-icons/react"
import { useState } from "react"
import type { Icon } from "@phosphor-icons/react"

import { PhoneFrame, ShellFrame } from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// The viewport morph for the responsive app-shell page. One shell, three
// widths: desktop runs all four regions; tablet drops the metadata rail; phone
// collapses to a single pane with a bottom tab bar and list-pushes-to-detail.
// The point is that the shell sheds regions from the outside in, not that it's
// three different layouts.

type Viewport = "desktop" | "phone" | "tablet"

interface Item {
  body: string
  id: string
  meta: Array<{ k: string; v: string }>
  sub: string
  title: string
}

const ITEMS: Array<Item> = [
  {
    body: "Refresh the marketing site and the design system behind it. On track for the next release.",
    id: "1",
    meta: [
      { k: "Owner", v: "Avery" },
      { k: "Status", v: "On track" },
      { k: "Updated", v: "2h" },
    ],
    sub: "Project · web",
    title: "Website redesign",
  },
  {
    body: "Cut the first-run flow from nine steps to four. One blocker on the calendar permission.",
    id: "2",
    meta: [
      { k: "Owner", v: "Jordan" },
      { k: "Status", v: "At risk" },
      { k: "Updated", v: "5h" },
    ],
    sub: "Project · app",
    title: "Mobile onboarding",
  },
  {
    body: "Move invoicing to the new provider. Dual-running in staging this week.",
    id: "3",
    meta: [
      { k: "Owner", v: "Sam" },
      { k: "Status", v: "On track" },
      { k: "Updated", v: "1d" },
    ],
    sub: "Project · platform",
    title: "Billing migration",
  },
]

const NAV: Array<{ Icon: Icon; label: string }> = [
  { Icon: HouseIcon, label: "Home" },
  { Icon: FolderIcon, label: "Projects" },
  { Icon: GearSixIcon, label: "Settings" },
]

function Rail() {
  return (
    <nav className="flex w-10 shrink-0 flex-col items-center gap-1 border-r border-border bg-muted/20 py-2">
      {NAV.map((n, i) => (
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-md",
            i === 1 ? "bg-accent text-foreground" : "text-muted-foreground"
          )}
          key={n.label}
        >
          <n.Icon className="size-4" weight={i === 1 ? "fill" : "regular"} />
        </span>
      ))}
    </nav>
  )
}

function List({
  className,
  onSelect,
  selectedId,
}: {
  className?: string
  onSelect: (id: string) => void
  selectedId: string | null
}) {
  return (
    <div className={cn("flex flex-col overflow-y-auto", className)}>
      <header className="border-b border-border px-3 py-2 font-semibold text-foreground">
        Projects
      </header>
      <ul className="p-1.5">
        {ITEMS.map((it) => (
          <li key={it.id}>
            <button
              className={cn(
                "flex w-full flex-col gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors",
                it.id === selectedId ? "bg-accent" : "hover:bg-accent/50"
              )}
              onClick={() => onSelect(it.id)}
              type="button"
            >
              <span className="truncate font-medium text-foreground">
                {it.title}
              </span>
              <span className="truncate text-muted-foreground">{it.sub}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Content({
  className,
  item,
  onBack,
}: {
  className?: string
  item: Item
  onBack?: () => void
}) {
  return (
    <article className={cn("flex min-w-0 flex-col overflow-y-auto", className)}>
      <header className="flex items-center gap-1 border-b border-border px-3 py-2">
        {onBack ? (
          <button
            className="flex items-center gap-1 rounded-md px-1.5 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            onClick={onBack}
            type="button"
          >
            <CaretLeftIcon className="size-4" />
            Projects
          </button>
        ) : (
          <span className="truncate font-semibold text-foreground">
            {item.title}
          </span>
        )}
      </header>
      <div className="flex flex-col gap-2 px-4 py-3">
        {onBack ? (
          <h4 className="font-semibold text-foreground">{item.title}</h4>
        ) : null}
        <p className="text-muted-foreground">{item.sub}</p>
        <p className="leading-relaxed text-foreground">{item.body}</p>
      </div>
    </article>
  )
}

function Meta({ className, item }: { className?: string; item: Item }) {
  return (
    <aside className={cn("flex flex-col", className)}>
      <header className="border-b border-border px-3 py-2 font-semibold text-foreground">
        Details
      </header>
      <dl className="flex flex-col gap-2 px-3 py-3">
        {item.meta.map((m) => (
          <div className="flex justify-between gap-2" key={m.k}>
            <dt className="text-muted-foreground">{m.k}</dt>
            <dd className="truncate text-right font-medium text-foreground">
              {m.v}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

function BottomTabs() {
  return (
    <nav className="flex border-t border-border">
      {NAV.map((n, i) => (
        <span
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-1.5",
            i === 1 ? "text-primary" : "text-muted-foreground"
          )}
          key={n.label}
        >
          <n.Icon className="size-4" weight={i === 1 ? "fill" : "regular"} />
          <span className="text-[0.6rem]">{n.label}</span>
        </span>
      ))}
    </nav>
  )
}

export function ResponsiveShell() {
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [selectedId, setSelectedId] = useState("1")
  const [phoneScreen, setPhoneScreen] = useState<"content" | "list">("list")

  const item = ITEMS.find((i) => i.id === selectedId) ?? ITEMS[0]

  function switchViewport(v: Viewport) {
    setViewport(v)
    setPhoneScreen("list")
  }

  return (
    <ShellFrame className="flex-col">
      <div className="flex items-center gap-1 border-b border-border bg-muted/20 px-2 py-1.5">
        <span className="mr-1 pl-1 text-muted-foreground">Viewport</span>
        {(["desktop", "tablet", "phone"] as const).map((v) => (
          <button
            className={cn(
              "rounded-md px-2 py-1 capitalize transition-colors",
              v === viewport
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={v}
            onClick={() => switchViewport(v)}
            type="button"
          >
            {v}
          </button>
        ))}
      </div>

      {viewport === "desktop" ? (
        <div className="flex h-72 w-full">
          <Rail />
          <List
            className="w-44 border-r border-border"
            onSelect={setSelectedId}
            selectedId={selectedId}
          />
          <Content className="flex-1" item={item} />
          <Meta className="w-36 border-l border-border" item={item} />
        </div>
      ) : null}

      {viewport === "tablet" ? (
        <div className="flex h-72 justify-center bg-muted/20 p-4">
          <div className="flex w-[26rem] overflow-hidden rounded-lg border border-border bg-card">
            <Rail />
            <List
              className="w-40 border-r border-border"
              onSelect={setSelectedId}
              selectedId={selectedId}
            />
            <Content className="flex-1" item={item} />
          </div>
        </div>
      ) : null}

      {viewport === "phone" ? (
        <div className="flex h-80 justify-center bg-muted/20 p-4">
          <PhoneFrame>
            {phoneScreen === "list" ? (
              <List
                className="flex-1"
                onSelect={(id) => {
                  setSelectedId(id)
                  setPhoneScreen("content")
                }}
                selectedId={null}
              />
            ) : (
              <Content
                className="flex-1"
                item={item}
                onBack={() => setPhoneScreen("list")}
              />
            )}
            <BottomTabs />
          </PhoneFrame>
        </div>
      ) : null}
    </ShellFrame>
  )
}
