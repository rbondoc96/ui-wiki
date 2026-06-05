import {
  CaretLeftIcon,
  CaretRightIcon,
  CircleIcon,
  GearSixIcon,
  GitPullRequestIcon,
  KanbanIcon,
  LinkSimpleIcon,
  NoteIcon,
} from "@phosphor-icons/react"
import { useState } from "react"
import type { Icon } from "@phosphor-icons/react"

import {
  Bar,
  DiagramFrame,
  Region,
  ShellFrame,
} from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// Visual examples for the Layouts & Archetypes section. `NavRailTriptychAnatomy`
// is a static, labelled schematic that names the four regions; `NavRailTriptych`
// is the live mockup — a real app shell you can drive (switch contexts in the
// rail, select a row to swap the content + metadata panels, collapse the rail
// and the metadata column to watch the triptych fold to two panes).

// --- Anatomy diagram -------------------------------------------------------

export function NavRailTriptychAnatomy() {
  return (
    <DiagramFrame
      caption="Four regions, one job each: navigate, scan, read, relate."
      className="h-56"
    >
      <Region caption="contexts" grow="w-16 shrink-0" name="Rail">
        <span className="size-5 rounded-md bg-foreground/80" />
        <span className="size-5 rounded-md bg-muted-foreground/20" />
        <span className="size-5 rounded-md bg-muted-foreground/20" />
      </Region>
      <Region caption="scan + filter" grow="w-40 shrink-0" name="List">
        <Bar w="w-2/3" />
        <div className="mt-1 flex flex-col gap-1.5">
          <span className="h-5 rounded bg-accent" />
          <span className="h-5 rounded bg-muted-foreground/10" />
          <span className="h-5 rounded bg-muted-foreground/10" />
        </div>
      </Region>
      <Region caption="read + act" grow="flex-1" name="Content">
        <Bar w="w-1/2" />
        <Bar />
        <Bar />
        <Bar w="w-5/6" />
        <Bar w="w-2/3" />
      </Region>
      <Region caption="facts + cross-refs" grow="w-36 shrink-0" name="Metadata">
        <Bar w="w-1/2" />
        <Bar w="w-3/4" />
        <Bar w="w-2/3" />
      </Region>
    </DiagramFrame>
  )
}

// --- Interactive mockup ----------------------------------------------------

type Status = "approved" | "open" | "review"

interface Item {
  body: string
  id: string
  linked: Array<{ kind: string; label: string }>
  meta: Array<{ k: string; v: string }>
  status: Status
  subtitle: string
  title: string
}

interface Context {
  Icon: Icon
  filters: Array<string>
  items: Array<Item>
  key: string
  label: string
}

const CONTEXTS: Array<Context> = [
  {
    Icon: GitPullRequestIcon,
    filters: ["open", "mine"],
    key: "prs",
    label: "Pull Requests",
    items: [
      {
        body: "Adds a dark-mode toggle backed by CSS custom properties, behind a feature flag. Three checks passing, one file changed.",
        id: "128",
        linked: [
          { kind: "Jira", label: "APP-190" },
          { kind: "Note", label: "theming" },
        ],
        meta: [
          { k: "Author", v: "av" },
          { k: "Updated", v: "2h" },
          { k: "Reviewers", v: "you, jo" },
        ],
        status: "review",
        subtitle: "#128 · web-app",
        title: "feat: add dark mode",
      },
      {
        body: "Debounces the search input so results update after typing stops, not on every keystroke. Approved, awaiting merge.",
        id: "131",
        linked: [{ kind: "Jira", label: "APP-190" }],
        meta: [
          { k: "Author", v: "jo" },
          { k: "Updated", v: "5h" },
          { k: "Reviewers", v: "av" },
        ],
        status: "approved",
        subtitle: "#131 · web-app",
        title: "fix: debounce search",
      },
      {
        body: "Routine dependency bumps. No review requested, mergeable once CI is green.",
        id: "126",
        linked: [],
        meta: [
          { k: "Author", v: "bot" },
          { k: "Updated", v: "1d" },
          { k: "Reviewers", v: "—" },
        ],
        status: "open",
        subtitle: "#126 · web-app",
        title: "chore: bump deps",
      },
    ],
  },
  {
    Icon: KanbanIcon,
    filters: ["sprint", "assigned"],
    key: "jira",
    label: "Jira",
    items: [
      {
        body: "Dark mode across every surface, including charts and embeds. Linked to the PR and the design note.",
        id: "APP-190",
        linked: [
          { kind: "PR", label: "#128" },
          { kind: "Note", label: "theming" },
        ],
        meta: [
          { k: "Status", v: "In Review" },
          { k: "Assignee", v: "av" },
          { k: "Points", v: "3" },
        ],
        status: "review",
        subtitle: "Story · web",
        title: "Theming edge cases",
      },
      {
        body: "Surface check status inline on each list row so it can be triaged without opening each one.",
        id: "APP-204",
        linked: [],
        meta: [
          { k: "Status", v: "Open" },
          { k: "Assignee", v: "—" },
          { k: "Points", v: "5" },
        ],
        status: "open",
        subtitle: "Task · web",
        title: "Inline status on rows",
      },
    ],
  },
  {
    Icon: NoteIcon,
    filters: ["recent", "mine"],
    key: "notes",
    label: "Notes",
    items: [
      {
        body: "Theme with CSS custom properties and switch at the root. Never hard-code colors in components. Pairs with APP-190.",
        id: "theming",
        linked: [
          { kind: "Jira", label: "APP-190" },
          { kind: "PR", label: "#131" },
        ],
        meta: [
          { k: "Updated", v: "3h" },
          { k: "Tags", v: "theming, css" },
        ],
        status: "open",
        subtitle: "MDX note",
        title: "theming",
      },
    ],
  },
]

const statusDot: Record<Status, string> = {
  approved: "text-chart-3",
  open: "text-muted-foreground/50",
  review: "text-primary",
}

const statusLabel: Record<Status, string> = {
  approved: "approved",
  open: "open",
  review: "needs your review",
}

export function NavRailTriptych() {
  const [contextKey, setContextKey] = useState(CONTEXTS[0].key)
  const [selectedId, setSelectedId] = useState(CONTEXTS[0].items[0].id)
  const [railOpen, setRailOpen] = useState(false)
  const [metaOpen, setMetaOpen] = useState(true)

  const context = CONTEXTS.find((c) => c.key === contextKey) ?? CONTEXTS[0]
  const item =
    context.items.find((i) => i.id === selectedId) ?? context.items[0]

  function pickContext(key: string) {
    const next = CONTEXTS.find((c) => c.key === key) ?? CONTEXTS[0]
    setContextKey(next.key)
    setSelectedId(next.items[0].id)
  }

  return (
    <ShellFrame className="h-[22rem]">
      {/* Rail */}
      <nav
        className={cn(
          "flex shrink-0 flex-col border-r border-border bg-muted/20 p-2 transition-[width] duration-200 ease-out",
          railOpen ? "w-40" : "w-12"
        )}
      >
        <button
          aria-label={railOpen ? "Collapse rail" : "Expand rail"}
          className="mb-2 flex size-8 items-center justify-center self-start rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => setRailOpen((v) => !v)}
          type="button"
        >
          {railOpen ? (
            <CaretLeftIcon className="size-4" />
          ) : (
            <CaretRightIcon className="size-4" />
          )}
        </button>
        <div className="flex flex-col gap-0.5">
          {CONTEXTS.map((c) => {
            const isActive = c.key === context.key
            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-md px-2 text-left transition-colors",
                  isActive
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
                key={c.key}
                onClick={() => pickContext(c.key)}
                type="button"
              >
                <c.Icon
                  className="size-4 shrink-0"
                  weight={isActive ? "fill" : "regular"}
                />
                {railOpen ? <span className="truncate">{c.label}</span> : null}
              </button>
            )
          })}
        </div>
        <div className="mt-auto flex flex-col gap-0.5 border-t border-border pt-2">
          <span
            aria-hidden
            className="flex h-8 items-center gap-2 rounded-md px-2 text-muted-foreground/70"
          >
            <GearSixIcon className="size-4 shrink-0" />
            {railOpen ? <span>Settings</span> : null}
          </span>
        </div>
      </nav>

      {/* List + filters */}
      <div className="flex w-52 shrink-0 flex-col border-r border-border">
        <header className="flex flex-col gap-2 border-b border-border px-3 py-2.5">
          <span className="font-semibold text-foreground">{context.label}</span>
          <div className="flex gap-1.5">
            {context.filters.map((f, idx) => (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.7rem]",
                  idx === 0
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground"
                )}
                key={f}
              >
                {f}
              </span>
            ))}
          </div>
        </header>
        <ul className="flex-1 overflow-y-auto p-1.5">
          {context.items.map((i) => {
            const isSelected = i.id === item.id
            return (
              <li key={i.id}>
                <button
                  className={cn(
                    "flex w-full flex-col gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors",
                    isSelected ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => setSelectedId(i.id)}
                  type="button"
                >
                  <span className="flex items-center gap-1.5">
                    <CircleIcon
                      className={cn("size-2 shrink-0", statusDot[i.status])}
                      weight="fill"
                    />
                    <span className="truncate font-medium text-foreground">
                      {i.title}
                    </span>
                  </span>
                  <span className="truncate pl-3.5 text-muted-foreground">
                    {statusLabel[i.status]}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Content */}
      <article className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="flex items-start justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="min-w-0">
            <h4 className="truncate font-semibold text-foreground">
              {item.title}
            </h4>
            <p className="truncate text-muted-foreground">{item.subtitle}</p>
          </div>
          {!metaOpen ? (
            <button
              aria-label="Show metadata"
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setMetaOpen(true)}
              type="button"
            >
              <CaretLeftIcon className="size-4" />
            </button>
          ) : null}
        </header>
        <div className="flex flex-col gap-3 px-4 py-3">
          <p className="leading-relaxed text-foreground">{item.body}</p>
          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <p className="mb-1.5 text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
              Linked
            </p>
            {item.linked.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {item.linked.map((l) => (
                  <li
                    className="flex items-center gap-1.5 text-foreground"
                    key={`${l.kind}-${l.label}`}
                  >
                    <LinkSimpleIcon className="size-3.5 text-muted-foreground" />
                    <span className="font-medium">{l.label}</span>
                    <span className="text-muted-foreground">({l.kind})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nothing linked yet.</p>
            )}
          </div>
        </div>
      </article>

      {/* Metadata */}
      {metaOpen ? (
        <aside className="flex w-44 shrink-0 flex-col border-l border-border">
          <header className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <span className="font-semibold text-foreground">Metadata</span>
            <button
              aria-label="Hide metadata"
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setMetaOpen(false)}
              type="button"
            >
              <CaretRightIcon className="size-4" />
            </button>
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
      ) : null}
    </ShellFrame>
  )
}
