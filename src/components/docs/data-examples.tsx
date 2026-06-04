import { Fragment, useState } from "react"

import { cn } from "#/lib/utils.ts"

// Visual examples for the Data section. The `*Demo` components with a `good`
// prop are designed to sit inside a `<Do>` / `<Dont>` `preview` slot; the
// interactive ones (e.g. `DensityDemo`) stand alone in the page.

const priceRows = [
  { item: "Coffee", price: "$9.00" },
  { item: "Subscription", price: "$1,240.00" },
  { item: "Sticker", price: "$3.50" },
]

// Right-aligned + tabular figures (good) vs left-aligned text (don't). The
// point lands visually: in the good case the prices share a right edge so the
// largest value is obvious without reading a digit.
export function NumbersDemo({ good = false }: { good?: boolean }) {
  return (
    <table className="w-full border-collapse text-xs text-foreground" data-ui>
      <thead>
        <tr className="border-b border-border text-[0.65rem] tracking-wide text-muted-foreground uppercase">
          <th className="py-1.5 pr-2 text-left font-medium">Item</th>
          <th
            className={cn(
              "py-1.5 pl-2 font-medium",
              good ? "text-right" : "text-left"
            )}
          >
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        {priceRows.map((row) => (
          <tr
            key={row.item}
            className="border-b border-border/50 last:border-0"
          >
            <td className="py-1.5 pr-2">{row.item}</td>
            <td
              className={cn(
                "py-1.5 pl-2",
                good ? "text-right tabular-nums" : "text-left"
              )}
            >
              {row.price}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const responsiveColumns = ["Name", "Status", "Owner", "Total", "Date"] as const

const responsiveRecords = [
  {
    date: "Jun 2",
    name: "Acme Co.",
    owner: "Riley",
    status: "Active",
    total: "$1,240.00",
  },
  {
    date: "May 28",
    name: "Globex",
    owner: "Sam",
    status: "Trial",
    total: "$90.00",
  },
]

// Both rendered in a phone-width frame. The don't keeps all five columns and
// shrinks them into unreadability; the do restacks each row as a labelled card.
export function ResponsiveDemo({ good = false }: { good?: boolean }) {
  if (!good) {
    return (
      <div className="mx-auto w-[220px]">
        <table
          className="w-full border-collapse text-[0.55rem] leading-tight text-foreground"
          data-ui
        >
          <thead>
            <tr className="text-muted-foreground">
              {responsiveColumns.map((heading) => (
                <th key={heading} className="px-0.5 py-1 text-left font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responsiveRecords.map((record) => (
              <tr key={record.name} className="border-t border-border/50">
                <td className="px-0.5 py-1">{record.name}</td>
                <td className="px-0.5 py-1">{record.status}</td>
                <td className="px-0.5 py-1">{record.owner}</td>
                <td className="px-0.5 py-1">{record.total}</td>
                <td className="px-0.5 py-1">{record.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-[220px] flex-col gap-2">
      {responsiveRecords.map((record) => (
        <div
          key={record.name}
          className="rounded-md border border-border bg-card p-2"
        >
          <div className="mb-1 text-xs font-medium text-foreground">
            {record.name}
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[0.7rem]">
            {[
              ["Status", record.status],
              ["Owner", record.owner],
              ["Total", record.total],
              ["Date", record.date],
            ].map(([label, value]) => (
              <Fragment key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right text-foreground tabular-nums">
                  {value}
                </dd>
              </Fragment>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}

const densityRows = [
  { name: "Acme Co.", status: "Active", total: "$1,240.00" },
  { name: "Globex", status: "Trial", total: "$90.00" },
  { name: "Aster Labs", status: "Active", total: "$512.00" },
]

const densityModes = [
  { compact: false, label: "Comfortable" },
  { compact: true, label: "Compact" },
] as const

// Interactive: flip row height between comfortable and compact. Neither is
// "wrong" — it's a trade, which is why this is a toggle, not a do/don't.
export function DensityDemo() {
  const [compact, setCompact] = useState(false)
  const cellPad = compact ? "py-1" : "py-3"

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card text-sm shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/35 px-4 py-3">
        <div>
          <div className="font-medium text-foreground">Row density</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Same data, different vertical rhythm. Choose for your audience.
          </div>
        </div>
        <div className="flex shrink-0 rounded-md border border-border p-0.5">
          {densityModes.map((mode) => (
            <button
              aria-pressed={compact === mode.compact}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                compact === mode.compact
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={mode.label}
              onClick={() => setCompact(mode.compact)}
              type="button"
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      <table className="w-full border-collapse text-foreground" data-ui>
        <thead>
          <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {densityRows.map((row) => (
            <tr
              key={row.name}
              className="border-b border-border/50 last:border-0"
            >
              <td className={cn("px-4", cellPad)}>{row.name}</td>
              <td className={cn("px-4", cellPad)}>{row.status}</td>
              <td className={cn("px-4 text-right tabular-nums", cellPad)}>
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
