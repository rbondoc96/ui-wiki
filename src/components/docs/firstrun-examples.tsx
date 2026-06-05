import { FolderPlusIcon, PlusIcon } from "@phosphor-icons/react"
import { useState } from "react"

import { ShellFrame } from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// The first-run vs. populated toggle for the empty-dashboard page. The empty
// state isn't a smaller version of the full one — it's an activation surface,
// so the toggle shows the same dashboard frame holding a guiding first-run state
// or real data, never a blank canvas.

type State = "first-run" | "populated"

const STATS = [
  { label: "Active", value: "6" },
  { label: "Open tasks", value: "18" },
  { label: "Done", value: "12" },
]

const ROWS = [
  { name: "Website redesign", owner: "Avery", updated: "2h" },
  { name: "Mobile onboarding", owner: "Jordan", updated: "5h" },
  { name: "Billing migration", owner: "Sam", updated: "1d" },
]

function FirstRun() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-chart-3/15 text-chart-3">
        <FolderPlusIcon className="size-5" />
      </span>
      <div>
        <p className="font-semibold text-foreground">No projects yet</p>
        <p className="mx-auto max-w-[15rem] text-muted-foreground">
          Create your first project to see activity, tasks, and trends here.
        </p>
      </div>
      <button
        className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground"
        type="button"
      >
        <PlusIcon className="size-3.5" weight="bold" />
        New project
      </button>
      <p className="text-[0.7rem] text-muted-foreground">
        or import from an existing repo
      </p>
    </div>
  )
}

function Populated() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="grid grid-cols-3 gap-2">
        {STATS.map((s) => (
          <div
            className="rounded-lg border border-border px-3 py-2"
            key={s.label}
          >
            <p className="truncate text-[0.7rem] text-muted-foreground">
              {s.label}
            </p>
            <p className="text-lg font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-[0.65rem] tracking-wide text-muted-foreground uppercase">
            <th className="py-1.5 font-medium">Project</th>
            <th className="py-1.5 font-medium">Owner</th>
            <th className="py-1.5 text-right font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr
              className="border-b border-border/50 last:border-0"
              key={r.name}
            >
              <td className="py-2 pr-2 text-foreground">{r.name}</td>
              <td className="py-2 text-muted-foreground">{r.owner}</td>
              <td className="py-2 text-right text-muted-foreground tabular-nums">
                {r.updated}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FirstRunDashboard() {
  const [state, setState] = useState<State>("first-run")
  return (
    <ShellFrame className="flex-col">
      <div className="flex items-center gap-1 border-b border-border bg-muted/20 px-2 py-1.5 text-xs">
        <span className="mr-1 pl-1 text-muted-foreground">State</span>
        {(["first-run", "populated"] as const).map((s) => (
          <button
            className={cn(
              "rounded-md px-2 py-1 transition-colors",
              s === state
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={s}
            onClick={() => setState(s)}
            type="button"
          >
            {s === "first-run" ? "First run" : "Populated"}
          </button>
        ))}
      </div>
      <div className="flex min-h-[15rem] flex-col text-xs">
        {state === "first-run" ? <FirstRun /> : <Populated />}
      </div>
    </ShellFrame>
  )
}
