import type { ReactNode } from "react"

import { cn } from "#/lib/utils.ts"

// The partial-prerendering illustration for the PPR page: one page silhouette
// shown at three moments. The cached shell is usable before either dynamic
// region exists, and the slow region does not hold up the fast one, which is
// the claim the surrounding prose makes in words.

type RegionState = "filled" | "pending"

const STEPS = [
  {
    cart: "pending",
    label: "0 ms",
    note: "Shell from the edge cache",
    recommendations: "pending",
  },
  {
    cart: "filled",
    label: "+180 ms",
    note: "Cart resolves",
    recommendations: "pending",
  },
  {
    cart: "filled",
    label: "+640 ms",
    note: "Recommendations resolve",
    recommendations: "filled",
  },
] as const satisfies ReadonlyArray<{
  cart: RegionState
  label: string
  note: string
  recommendations: RegionState
}>

// A hatch reads as "nothing here yet" far better than a flat tint. It lives in
// a style object because Tailwind's arbitrary values can't carry the commas,
// and color-mix keeps it correct in both themes.
const pendingHatch = {
  backgroundImage:
    "repeating-linear-gradient(135deg, transparent 0 6px, color-mix(in oklch, var(--foreground) 7%, transparent) 6px 12px)",
}

function Bar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "block h-1.5 rounded-full bg-muted-foreground/25",
        className
      )}
    />
  )
}

function Region({
  children,
  className,
  state,
}: {
  children?: ReactNode
  className?: string
  state: RegionState | "static"
}) {
  const pending = state === "pending"
  return (
    <div
      className={cn(
        "rounded-md border p-2",
        state === "static" && "border-border bg-foreground/5",
        state === "filled" && "border-dashed border-chart-3 bg-chart-3/10",
        pending && "border-dashed border-border",
        className
      )}
      style={pending ? pendingHatch : undefined}
    >
      {children}
    </div>
  )
}

function PageMock({
  cart,
  recommendations,
}: {
  cart: RegionState
  recommendations: RegionState
}) {
  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-2 p-2.5">
        <Region state="static">
          <div className="flex items-center gap-2">
            <Bar className="w-16" />
            <span className="flex-1" />
            <Bar className="w-7" />
          </div>
        </Region>

        <Region className="w-24 self-end py-1.5" state={cart}>
          {cart === "filled" ? <Bar className="w-3/5 bg-chart-1" /> : null}
        </Region>

        <Region state="static">
          <div className="flex gap-2">
            <span className="h-11 w-16 flex-none rounded bg-muted-foreground/20" />
            <div className="flex flex-1 flex-col justify-center gap-1.5">
              <Bar className="w-4/5" />
              <Bar className="w-1/2" />
            </div>
          </div>
        </Region>

        <Region className="min-h-10" state={recommendations}>
          {recommendations === "filled" ? (
            <div className="flex h-full items-center gap-1.5">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  className="h-5 flex-1 rounded bg-muted-foreground/20"
                  key={index}
                />
              ))}
            </div>
          ) : null}
        </Region>
      </div>
    </div>
  )
}

export function PprTimeline() {
  return (
    <figure className="not-prose my-8">
      <p className="sr-only">
        The same page shown at three moments. At 0ms the cached static shell has
        painted, with the cart and recommendations regions still empty. At 180ms
        the cart region has filled. At 640ms the recommendations region has
        filled. The static shell was usable throughout, and the slower region
        did not delay the faster one.
      </p>
      <div aria-hidden="true" className="flex flex-col gap-3.5">
        {STEPS.map((step) => (
          <div className="flex items-start gap-3" key={step.label}>
            <div className="w-20 flex-none pt-0.5">
              <p className="text-xs font-semibold text-chart-1 tabular-nums">
                {step.label}
              </p>
              <p className="text-[0.65rem] leading-snug text-muted-foreground">
                {step.note}
              </p>
            </div>
            <PageMock cart={step.cart} recommendations={step.recommendations} />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="mt-3 flex flex-wrap gap-4 text-[0.65rem] text-muted-foreground"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm border border-border bg-foreground/5" />
          Static shell, prerendered at build
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm border border-dashed border-chart-3 bg-chart-3/10" />
          Dynamic, resolved per request
        </span>
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        The shell is usable before either dynamic region exists, and the slow
        one does not hold up the fast one.
      </figcaption>
    </figure>
  )
}
