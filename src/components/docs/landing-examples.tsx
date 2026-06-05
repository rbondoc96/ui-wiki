import { cn } from "#/lib/utils.ts"

// Static anatomy of a marketing / landing page: the conventional zones in scroll
// order, drawn as a page silhouette. This is brand-register territory, where the
// rules differ from app UI, so the visual just names the parts and the page's
// prose carries the reasoning and the anti-patterns.

type Mock = "cta" | "features" | "footer" | "hero" | "logos" | "topbar"

interface Zone {
  mock: Mock
  name: string
}

const ZONES: Array<Zone> = [
  { mock: "topbar", name: "Top bar" },
  { mock: "hero", name: "Hero" },
  { mock: "logos", name: "Social proof" },
  { mock: "features", name: "Value props" },
  { mock: "cta", name: "Closing CTA" },
  { mock: "footer", name: "Footer" },
]

function Bar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "block h-1.5 rounded-full bg-muted-foreground/20",
        className
      )}
    />
  )
}

function Mock({ kind }: { kind: Mock }) {
  switch (kind) {
    case "topbar":
      return (
        <div className="flex items-center justify-between">
          <span className="h-2 w-10 rounded bg-foreground/60" />
          <div className="flex items-center gap-1.5">
            <Bar className="w-7" />
            <Bar className="w-7" />
            <span className="h-3 w-10 rounded bg-primary/70" />
          </div>
        </div>
      )
    case "hero":
      return (
        <div className="flex flex-col items-center gap-1.5 py-2">
          <span className="h-3 w-2/3 rounded bg-foreground/70" />
          <Bar className="w-1/2" />
          <span className="mt-1 h-4 w-20 rounded-md bg-primary/70" />
        </div>
      )
    case "logos":
      return (
        <div className="flex justify-center gap-3">
          {["a", "b", "c", "d"].map((k) => (
            <span className="h-3 w-10 rounded bg-muted-foreground/15" key={k} />
          ))}
        </div>
      )
    case "features":
      return (
        <div className="grid grid-cols-3 gap-2">
          {["x", "y", "z"].map((k) => (
            <div className="flex flex-col gap-1" key={k}>
              <span className="size-4 rounded bg-muted-foreground/20" />
              <Bar className="w-full" />
              <Bar className="w-2/3" />
            </div>
          ))}
        </div>
      )
    case "cta":
      return (
        <div className="flex flex-col items-center gap-1.5 py-1">
          <span className="h-2 w-1/2 rounded bg-foreground/55" />
          <span className="h-4 w-20 rounded-md bg-primary/70" />
        </div>
      )
    case "footer":
      return (
        <div className="grid grid-cols-4 gap-2">
          {["p", "q", "r", "s"].map((k) => (
            <div className="flex flex-col gap-1" key={k}>
              <Bar className="w-2/3" />
              <Bar className="h-1 w-full" />
              <Bar className="h-1 w-1/2" />
            </div>
          ))}
        </div>
      )
  }
}

export function LandingAnatomy() {
  return (
    <figure className="not-prose my-8">
      <div className="mx-auto flex max-w-md flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {ZONES.map((z, i) => (
          <div
            className={cn("px-4 py-3", i === 1 && "bg-muted/15")}
            key={z.name}
          >
            <Mock kind={z.mock} />
            <p className="mt-2 text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
              {z.name}
            </p>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Top to bottom in scroll order. The hero earns the first screen;
        everything below re-sells and removes friction.
      </figcaption>
    </figure>
  )
}
