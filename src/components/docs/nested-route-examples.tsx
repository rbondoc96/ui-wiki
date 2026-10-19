import { useState } from "react"
import type { ReactNode } from "react"

import { Bar, PhoneFrame } from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// The route-tree demo for the nested-route-nav page. Picking a URL lights the
// matched branch of the route tree and the active item at every nav level of a
// small app, so two lessons show without explanation: each layout route renders
// one piece of chrome, and every level highlights by prefix at the same time.
// The phone view renders the same URLs with each level moved to its phone home:
// bottom tabs, a header that names the page, and the sidebar in a drawer.

const REGION_LABEL = {
  content: "page",
  none: "no chrome",
  sidebar: "sidebar",
  tabs: "tabs",
  topbar: "top bar",
} as const

type Region = keyof typeof REGION_LABEL

// `owns` is the screen region the file renders; null for a plain folder.
const TREE = [
  { depth: 0, file: "_app.tsx", id: "app", owns: "topbar" },
  { depth: 1, file: "index.tsx", id: "index", owns: "content" },
  { depth: 1, file: "projects/", id: "projects", owns: null },
  { depth: 2, file: "index.tsx", id: "projectsIndex", owns: "content" },
  { depth: 2, file: "$projectId.tsx", id: "project", owns: "sidebar" },
  { depth: 3, file: "issues.tsx", id: "issues", owns: "content" },
  { depth: 3, file: "board.tsx", id: "board", owns: "content" },
  { depth: 3, file: "settings.tsx", id: "settings", owns: "tabs" },
  { depth: 4, file: "general.tsx", id: "general", owns: "content" },
  { depth: 4, file: "members.tsx", id: "members", owns: "content" },
  { depth: 0, file: "_focus.tsx", id: "focus", owns: "none" },
  { depth: 1, file: "onboarding.tsx", id: "onboarding", owns: "content" },
] as const satisfies ReadonlyArray<{
  depth: number
  file: string
  id: string
  owns: Region | null
}>

type NodeId = (typeof TREE)[number]["id"]

const ROUTES = {
  board: {
    chain: ["app", "projects", "project", "board"],
    url: "/projects/42/board",
  },
  general: {
    chain: ["app", "projects", "project", "settings", "general"],
    url: "/projects/42/settings/general",
  },
  home: { chain: ["app", "index"], url: "/" },
  issues: {
    chain: ["app", "projects", "project", "issues"],
    url: "/projects/42/issues",
  },
  members: {
    chain: ["app", "projects", "project", "settings", "members"],
    url: "/projects/42/settings/members",
  },
  onboarding: { chain: ["focus", "onboarding"], url: "/onboarding" },
  projects: { chain: ["app", "projects", "projectsIndex"], url: "/projects" },
} as const satisfies Record<
  string,
  { chain: ReadonlyArray<NodeId>; url: string }
>

type RouteKey = keyof typeof ROUTES

// Chip order reads shallow to deep, with the shell-escaping route last.
const ROUTE_ORDER: ReadonlyArray<RouteKey> = [
  "home",
  "projects",
  "issues",
  "board",
  "general",
  "members",
  "onboarding",
]

function chainOf(route: RouteKey): ReadonlyArray<NodeId> {
  return ROUTES[route].chain
}

function RegionPill({ region }: { region: Region }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 font-sans text-[0.6rem] font-medium",
        region === "content"
          ? "bg-muted text-muted-foreground"
          : "bg-chart-3/20 text-foreground"
      )}
    >
      {REGION_LABEL[region]}
    </span>
  )
}

// Plain divs with list roles: `.doc-prose ul/li` rules are unlayered and would
// override utility classes with an indent and item gaps.
function RouteTreePanel({ route }: { route: RouteKey }) {
  const chain = chainOf(route)
  const matchedFiles = chain
    .map((id) => TREE.find((n) => n.id === id)?.file)
    .join(" → ")

  return (
    <div className="rounded-xl border border-border bg-card">
      <div
        aria-label="Route files"
        className="p-3 font-mono text-[0.72rem]"
        role="list"
      >
        {TREE.map((node) => {
          const matched = chain.includes(node.id)
          return (
            <div
              className={cn(
                "flex items-center gap-1.5 py-0.5 transition-opacity",
                !matched && "opacity-40"
              )}
              key={node.id}
              role="listitem"
              style={{ paddingLeft: `${node.depth * 0.9}rem` }}
            >
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  matched ? "bg-chart-3" : "bg-transparent"
                )}
              />
              <span
                className={cn("text-foreground", matched && "font-semibold")}
              >
                {node.file}
              </span>
              {node.owns ? <RegionPill region={node.owns} /> : null}
            </div>
          )
        })}
      </div>
      <p className="border-t border-border px-3 py-2 text-[0.7rem] text-muted-foreground">
        Matched: <span className="font-mono">{matchedFiles}</span>
      </p>
    </div>
  )
}

// Nav items are inert spans: the URL chips are the only way to navigate, so
// the highlight is always derived from the URL, never clicked into place.
function NavItem({
  active,
  children,
  className,
}: {
  active: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <span
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-2 py-0.5",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 rounded-md border border-border px-2 py-1.5">
      <span className="text-foreground">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

function PageContent({ route }: { route: RouteKey }) {
  switch (route) {
    case "home":
      return (
        <>
          <p className="font-medium text-foreground">Good morning, Sam</p>
          <Bar w="w-2/3" />
          <Bar w="w-1/2" />
        </>
      )
    case "projects":
      return (
        <>
          <p className="font-medium text-foreground">Projects</p>
          <Row label="Atlas Web" value="42 open issues" />
          <Row label="Billing API" value="7 open issues" />
          <Row label="Mobile app" value="19 open issues" />
        </>
      )
    case "issues":
      return (
        <>
          <p className="font-medium text-foreground">Issues</p>
          <Row label="ATL-112 Fix login redirect loop" value="Urgent" />
          <Row label="ATL-108 Settings tabs lose focus on save" value="High" />
          <Row label="ATL-97 Add CSV export to reports" value="Low" />
        </>
      )
    case "board":
      return (
        <>
          <p className="font-medium text-foreground">Board</p>
          <div className="grid grid-cols-3 gap-2">
            {["Todo", "In progress", "Done"].map((column) => (
              <div
                className="flex flex-col gap-1.5 rounded-md border border-border p-2"
                key={column}
              >
                <span className="text-[0.65rem] font-medium">{column}</span>
                <Bar />
                <Bar w="w-2/3" />
              </div>
            ))}
          </div>
        </>
      )
    case "general":
      return (
        <>
          <p className="font-medium text-foreground">General</p>
          <Row label="Project name" value="Atlas Web" />
          <Row label="Slug" value="atlas-web" />
        </>
      )
    case "members":
      return (
        <>
          <p className="font-medium text-foreground">Members</p>
          <Row label="Sam Rivera" value="Owner" />
          <Row label="Priya Natarajan" value="Editor" />
          <Row label="Jonas Weber" value="Viewer" />
        </>
      )
    case "onboarding":
      return null
  }
}

function SettingsTabs({ route }: { route: RouteKey }) {
  return (
    <nav
      aria-label="Settings"
      className="flex gap-1 overflow-x-auto border-b border-border px-3 pt-2"
    >
      {(["general", "members"] as const).map((tab) => (
        <span
          aria-current={route === tab ? "page" : undefined}
          className={cn(
            "-mb-px shrink-0 border-b-2 px-2 pb-1.5 capitalize",
            route === tab
              ? "border-foreground font-medium text-foreground"
              : "border-transparent text-muted-foreground"
          )}
          key={tab}
        >
          {tab}
        </span>
      ))}
    </nav>
  )
}

function OnboardingScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
      <span className="text-muted-foreground">Step 1 of 3</span>
      <p className="text-sm font-medium text-foreground">
        Name your first project
      </p>
      <span className="w-full max-w-56 rounded-md border border-border px-2 py-1 text-left text-muted-foreground">
        Atlas Web
      </span>
      <span className="rounded-md bg-primary px-3 py-1 text-primary-foreground">
        Continue
      </span>
      <span className="text-muted-foreground underline underline-offset-2">
        Skip for now
      </span>
    </div>
  )
}

function MiniApp({ route }: { route: RouteKey }) {
  const chain = chainOf(route)
  if (chain.includes("focus")) {
    return (
      <div className="flex h-80 min-w-[22rem] rounded-xl border border-border bg-card text-xs">
        <OnboardingScreen />
      </div>
    )
  }

  return (
    <div className="flex h-80 min-w-[22rem] flex-col overflow-hidden rounded-xl border border-border bg-card text-xs">
      <div className="flex items-center gap-3 border-b border-border px-3 py-2">
        <span className="font-semibold text-foreground">Atlas</span>
        <nav aria-label="Main" className="flex gap-1">
          <NavItem active={route === "home"}>Home</NavItem>
          <NavItem active={chain.includes("projects")}>Projects</NavItem>
        </nav>
        <span className="ml-auto rounded-md border border-border px-2 py-0.5 text-muted-foreground">
          Search
        </span>
        <span className="size-5 rounded-full bg-muted" />
      </div>
      <div className="flex min-h-0 flex-1">
        {chain.includes("project") ? (
          <nav
            aria-label="Project"
            className="flex w-28 shrink-0 flex-col gap-0.5 border-r border-border p-2"
          >
            <span className="px-2 text-[0.65rem] text-muted-foreground">
              ← All projects
            </span>
            <span className="mb-1 border-b border-border px-2 pt-1 pb-2 font-medium text-foreground">
              Atlas Web
              <span className="block text-[0.6rem] font-normal text-muted-foreground">
                Project
              </span>
            </span>
            <NavItem active={route === "issues"}>Issues</NavItem>
            <NavItem active={route === "board"}>Board</NavItem>
            <NavItem active={chain.includes("settings")}>Settings</NavItem>
          </nav>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          {chain.includes("settings") ? <SettingsTabs route={route} /> : null}
          <div className="flex flex-col gap-1.5 p-3">
            <PageContent route={route} />
          </div>
        </div>
      </div>
    </div>
  )
}

// On a phone the header names the current page, since the sidebar that
// normally shows it is tucked into a drawer.
const PHONE_TITLE = {
  board: "Board",
  general: "Settings",
  home: "Atlas",
  issues: "Issues",
  members: "Settings",
  onboarding: "",
  projects: "Projects",
} as const satisfies Record<RouteKey, string>

function ProjectDrawer({ route }: { route: RouteKey }) {
  const chain = chainOf(route)
  return (
    <div className="absolute inset-0 flex">
      <nav
        aria-label="Project"
        className="flex w-40 flex-col gap-0.5 border-r border-border bg-card p-2 shadow-lg"
      >
        <span className="px-2 text-[0.65rem] text-muted-foreground">
          ← All projects
        </span>
        <span className="mb-1 border-b border-border px-2 pt-1 pb-2 font-medium text-foreground">
          Atlas Web
          <span className="block text-[0.6rem] font-normal text-muted-foreground">
            Project
          </span>
        </span>
        <NavItem active={route === "issues"}>Issues</NavItem>
        <NavItem active={route === "board"}>Board</NavItem>
        <NavItem active={chain.includes("settings")}>Settings</NavItem>
      </nav>
      <div className="flex-1 bg-foreground/20" />
    </div>
  )
}

function PhoneApp({
  drawerOpen,
  onToggleDrawer,
  route,
}: {
  drawerOpen: boolean
  onToggleDrawer: () => void
  route: RouteKey
}) {
  const chain = chainOf(route)

  if (chain.includes("focus")) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex justify-end px-3 py-2">
          <span aria-label="Close" className="text-muted-foreground">
            ✕
          </span>
        </div>
        <OnboardingScreen />
      </div>
    )
  }

  const inProject = chain.includes("project")

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        {inProject ? (
          <span aria-label="Up to Projects" className="text-muted-foreground">
            ‹
          </span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-foreground">
            {PHONE_TITLE[route]}
          </span>
          {inProject ? (
            <span className="block text-[0.6rem] text-muted-foreground">
              Atlas Web
            </span>
          ) : null}
        </span>
        {inProject ? (
          <button
            aria-expanded={drawerOpen}
            aria-label="Project pages"
            className={cn(
              "rounded-md px-1.5 py-0.5 transition-colors",
              drawerOpen
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={onToggleDrawer}
            type="button"
          >
            ☰
          </button>
        ) : null}
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col">
        {chain.includes("settings") ? <SettingsTabs route={route} /> : null}
        <div className="flex flex-col gap-1.5 overflow-hidden p-3">
          <PageContent route={route} />
        </div>
        {inProject && drawerOpen ? <ProjectDrawer route={route} /> : null}
      </div>
      <nav aria-label="Main" className="flex border-t border-border">
        {(
          [
            ["Home", route === "home"],
            ["Projects", chain.includes("projects")],
            ["Search", false],
            ["You", false],
          ] as const
        ).map(([label, active]) => (
          <span
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex-1 py-2 text-center text-[0.65rem]",
              active ? "font-semibold text-foreground" : "text-muted-foreground"
            )}
            key={label}
          >
            {label}
          </span>
        ))}
      </nav>
    </div>
  )
}

const VIEWPORTS = ["desktop", "phone"] as const

type Viewport = (typeof VIEWPORTS)[number]

export function NestedRouteDemo() {
  const [route, setRoute] = useState<RouteKey>("members")
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [drawerOpen, setDrawerOpen] = useState(false)

  function pickRoute(next: RouteKey) {
    setRoute(next)
    setDrawerOpen(false)
  }

  function pickViewport(next: Viewport) {
    setViewport(next)
    setDrawerOpen(false)
  }

  return (
    <figure className="not-prose my-8 leading-normal">
      <div
        aria-label="View as"
        className="mb-2 flex w-fit gap-0.5 rounded-md bg-muted/40 p-0.5 text-xs"
        role="group"
      >
        {VIEWPORTS.map((v) => (
          <button
            aria-pressed={v === viewport}
            className={cn(
              "rounded px-2.5 py-0.5 capitalize transition-colors",
              v === viewport
                ? "bg-background font-medium text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={v}
            onClick={() => pickViewport(v)}
            type="button"
          >
            {v}
          </button>
        ))}
      </div>
      <div
        aria-label="Choose a URL"
        className="mb-3 flex flex-wrap gap-1.5"
        role="group"
      >
        {ROUTE_ORDER.map((key) => (
          <button
            aria-pressed={key === route}
            className={cn(
              "rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] transition-colors",
              key === route
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            key={key}
            onClick={() => pickRoute(key)}
            type="button"
          >
            {ROUTES[key].url}
          </button>
        ))}
      </div>
      <div className="grid items-start gap-4 md:grid-cols-[13rem_minmax(0,1fr)]">
        <RouteTreePanel route={route} />
        {viewport === "desktop" ? (
          <div className="overflow-x-auto">
            <MiniApp route={route} />
          </div>
        ) : (
          <div className="flex h-[26rem] justify-center rounded-xl border border-border bg-muted/20 p-3 text-xs">
            <PhoneFrame>
              <PhoneApp
                drawerOpen={drawerOpen}
                onToggleDrawer={() => setDrawerOpen((open) => !open)}
                route={route}
              />
            </PhoneFrame>
          </div>
        )}
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Pick a URL. Each matched layout route renders one piece of chrome, and
        every level highlights its own segment at once. On a phone, open ☰ to
        find the sidebar.
      </figcaption>
    </figure>
  )
}
