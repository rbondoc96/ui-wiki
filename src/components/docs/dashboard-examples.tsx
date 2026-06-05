import { useState } from "react"

import { ShellFrame } from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// The density toggle for the dashboard page. The same dashboard rendered at two
// densities so the trade-off is felt, not just described: comfortable is calmer
// and slower to scan; compact fits more on screen for a frequent, expert user.
// Deliberately a few honest stats plus a table, not a wall of identical cards.

type Density = "comfortable" | "compact"

const STATS = [
  { delta: "+12%", label: "Active projects", up: true, value: "18" },
  { delta: "−3%", label: "Open tasks", up: false, value: "47" },
  { delta: "+8%", label: "Closed this week", up: true, value: "31" },
]

const ROWS = [
  {
    name: "Website redesign",
    owner: "Avery",
    status: "On track",
    updated: "2h",
  },
  {
    name: "Mobile onboarding",
    owner: "Jordan",
    status: "At risk",
    updated: "5h",
  },
  {
    name: "Billing migration",
    owner: "Sam",
    status: "On track",
    updated: "1d",
  },
  { name: "Search revamp", owner: "Priya", status: "Blocked", updated: "1d" },
  { name: "Analytics v2", owner: "Lee", status: "On track", updated: "3d" },
]

const statusTone: Record<string, string> = {
  "At risk": "text-amber-600 dark:text-amber-500",
  Blocked: "text-destructive",
  "On track": "text-chart-3",
}

export function DashboardDensity() {
  const [density, setDensity] = useState<Density>("comfortable")
  const compact = density === "compact"

  return (
    <ShellFrame className="flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-semibold text-foreground">Overview</span>
        <div className="flex gap-0.5 rounded-md bg-muted/40 p-0.5">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              className={cn(
                "rounded px-2 py-0.5 capitalize transition-colors",
                d === density
                  ? "bg-background font-medium text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={d}
              onClick={() => setDensity(d)}
              type="button"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("grid grid-cols-3 gap-2", compact ? "p-2" : "p-4")}>
        {STATS.map((s) => (
          <div
            className={cn(
              "rounded-lg border border-border",
              compact ? "px-2.5 py-1.5" : "px-3 py-3"
            )}
            key={s.label}
          >
            <p className="truncate text-[0.7rem] text-muted-foreground">
              {s.label}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  "font-semibold text-foreground",
                  compact ? "text-base" : "text-xl"
                )}
              >
                {s.value}
              </span>
              <span
                className={cn(
                  "text-[0.7rem]",
                  s.up ? "text-chart-3" : "text-destructive"
                )}
              >
                {s.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={cn(compact ? "px-2 pb-2" : "px-4 pb-4")}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-[0.65rem] tracking-wide text-muted-foreground uppercase">
              <th className={cn("font-medium", compact ? "py-1" : "py-1.5")}>
                Project
              </th>
              <th className={cn("font-medium", compact ? "py-1" : "py-1.5")}>
                Status
              </th>
              <th className={cn("font-medium", compact ? "py-1" : "py-1.5")}>
                Owner
              </th>
              <th
                className={cn(
                  "text-right font-medium",
                  compact ? "py-1" : "py-1.5"
                )}
              >
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr
                className="border-b border-border/50 last:border-0"
                key={r.name}
              >
                <td
                  className={cn(
                    "pr-2 text-foreground",
                    compact ? "py-1" : "py-2"
                  )}
                >
                  {r.name}
                </td>
                <td
                  className={cn(
                    compact ? "py-1" : "py-2",
                    statusTone[r.status]
                  )}
                >
                  {r.status}
                </td>
                <td
                  className={cn(
                    "text-muted-foreground",
                    compact ? "py-1" : "py-2"
                  )}
                >
                  {r.owner}
                </td>
                <td
                  className={cn(
                    "text-right text-muted-foreground tabular-nums",
                    compact ? "py-1" : "py-2"
                  )}
                >
                  {r.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ShellFrame>
  )
}
