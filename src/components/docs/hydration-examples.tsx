import { cn } from "#/lib/utils.ts"

// The islands diagram for the hydration page: a page silhouette where most
// regions are static HTML that ship no JS, and a couple are interactive islands
// that hydrate. Makes "partial hydration" concrete — only the highlighted parts
// cost client JS.

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

function Island({ children }: { children: string }) {
  return (
    <div className="rounded-md border border-chart-3/40 bg-chart-3/10 p-2">
      <p className="mb-1.5 text-[0.6rem] font-medium tracking-wide text-chart-3 uppercase">
        Interactive island
      </p>
      <p className="text-xs text-foreground">{children}</p>
    </div>
  )
}

export function IslandsDiagram() {
  return (
    <figure className="not-prose my-8">
      <div className="mx-auto flex max-w-md flex-col gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <Bar className="w-24" />
          <Bar className="w-10" />
        </div>
        <Island>Search box — typing filters results</Island>
        <div className="flex flex-col gap-1.5">
          <Bar className="w-1/3" />
          <Bar />
          <Bar />
          <Bar className="w-5/6" />
        </div>
        <Island>Vote widget — click to upvote</Island>
        <div className="flex flex-col gap-1.5">
          <Bar />
          <Bar className="w-2/3" />
        </div>
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Most of the page is static HTML that ships no JS; only the highlighted
        islands hydrate and become interactive.
      </figcaption>
    </figure>
  )
}
