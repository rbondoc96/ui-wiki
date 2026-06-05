import { cn } from "#/lib/utils.ts"

// A reusable delivery-timeline diagram for the Rendering & Delivery pages.
// Rendering and data fetching are about *time* — when the user waits, sees, and
// can act — so they want a time axis, not a table. Lanes are rows of
// proportional segments (widths within a lane should sum to 100 so lanes share
// one axis); markers are vertical lines crossing every lane at a moment, e.g.
// "visible" or "interactive". Tone says whether the user is waiting or progress
// is being made; the milestone markers carry the real point.

type Tone = "busy" | "live" | "wait"

interface Segment {
  label?: string
  tone?: Tone
  width: number
}

interface Lane {
  label: string
  segments: Array<Segment>
}

interface Marker {
  at: number
  label: string
}

const toneClass: Record<Tone, string> = {
  busy: "bg-chart-3/25 text-foreground",
  live: "bg-chart-3/55 text-foreground",
  wait: "bg-muted/50 text-muted-foreground",
}

const GUTTER = "w-20 shrink-0"

export function Timeline({
  caption,
  lanes,
  markers = [],
}: {
  caption?: string
  lanes: Array<Lane>
  markers?: Array<Marker>
}) {
  return (
    <figure className="not-prose my-8">
      <div className="rounded-xl border border-border bg-card p-4 text-xs">
        {markers.length > 0 ? (
          <div className="flex">
            <span className={GUTTER} />
            <div className="relative h-4 flex-1">
              {markers.map((m) => (
                <span
                  className="absolute -translate-x-1/2 text-[0.6rem] font-medium whitespace-nowrap text-foreground"
                  key={m.label}
                  style={{ left: `${m.at}%` }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="relative flex flex-col gap-1.5">
          {markers.length > 0 ? (
            <div className="pointer-events-none absolute inset-0 flex">
              <span className={GUTTER} />
              <div className="relative flex-1">
                {markers.map((m) => (
                  <span
                    className="absolute inset-y-0 w-px bg-foreground/30"
                    key={m.label}
                    style={{ left: `${m.at}%` }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {lanes.map((lane) => (
            <div className="flex items-center gap-2" key={lane.label}>
              <span
                className={cn(
                  GUTTER,
                  "truncate text-right text-[0.7rem] text-muted-foreground"
                )}
              >
                {lane.label}
              </span>
              <div className="flex h-6 flex-1 overflow-hidden rounded-md">
                {lane.segments.map((s, i) => (
                  <span
                    className={cn(
                      "flex items-center justify-center border-r border-card px-1 text-[0.6rem] last:border-r-0",
                      toneClass[s.tone ?? "busy"]
                    )}
                    key={`${lane.label}-${i}`}
                    style={{ flex: `${s.width} 1 0%` }}
                  >
                    <span className="truncate">{s.label}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex">
          <span className={GUTTER} />
          <span className="flex-1 text-[0.6rem] tracking-wide text-muted-foreground">
            time →
          </span>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
