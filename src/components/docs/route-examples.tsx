import { cn } from "#/lib/utils.ts"

// The route-tree diagram for the route-architecture page: nested routes with
// layout and lazy badges, so the two structural ideas — layouts wrap children,
// lazy routes are separate chunks loaded on navigation — are visible at a glance.

type Badge = "layout" | "lazy"

interface RouteNode {
  badge?: Badge
  children?: Array<RouteNode>
  label: string
}

const ROUTES: RouteNode = {
  badge: "layout",
  label: "/",
  children: [
    { label: "index" },
    { badge: "lazy", label: "login" },
    {
      badge: "layout",
      label: "app",
      children: [
        { label: "app/dashboard" },
        {
          badge: "lazy",
          label: "app/projects",
          children: [{ badge: "lazy", label: "app/projects/:id" }],
        },
        { badge: "lazy", label: "app/settings" },
      ],
    },
  ],
}

const badgeClass: Record<Badge, string> = {
  layout: "bg-muted text-muted-foreground",
  lazy: "bg-chart-3/20 text-foreground",
}

function Pill({ badge }: { badge: Badge }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[0.6rem] font-medium",
        badgeClass[badge]
      )}
    >
      {badge}
    </span>
  )
}

function Node({ depth = 0, node }: { depth?: number; node: RouteNode }) {
  return (
    <li>
      <span
        className="flex items-center gap-2 py-0.5"
        style={{ paddingLeft: `${depth * 0.9}rem` }}
      >
        <span className="font-mono text-[0.72rem] text-foreground">
          {depth > 0 ? (
            <span className="text-muted-foreground/40">— </span>
          ) : null}
          {node.label}
        </span>
        {node.badge ? <Pill badge={node.badge} /> : null}
      </span>
      {node.children ? (
        <ul>
          {node.children.map((c) => (
            <Node depth={depth + 1} key={c.label} node={c} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export function RouteTree() {
  return (
    <figure className="not-prose my-8">
      <div className="rounded-xl border border-border bg-card p-4">
        <ul>
          <Node node={ROUTES} />
        </ul>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-[0.65rem] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Pill badge="layout" /> wraps its children in shared chrome
          </span>
          <span className="flex items-center gap-1.5">
            <Pill badge="lazy" /> code-split, loads on navigation
          </span>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Nested routes mirror nested UI. Layout routes wrap their children; lazy
        routes ship as separate chunks fetched when you navigate to them.
      </figcaption>
    </figure>
  )
}
