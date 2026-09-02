import type { ReactNode } from "react"

// Pairs a formula with a literal plain-English reading of it, side by side, so
// the eye maps symbol to sentence in one glance.
//
// The math must arrive as children (a `$$…$$` block in MDX), never as a prop:
// `remark-math` only rewrites markdown, so a prop would ship as raw LaTeX.
// `reads` is deliberately a plain string rather than a node, which holds it to
// one unadorned sentence.
//
// The cells wrap to stacked when the formula's own min-content width can't
// share the row, so a wide multi-line `align*` is never crushed into a column.
// The 1px divider is the container's `bg-border` showing through `gap-px`,
// which means it lands horizontally or vertically to match however the cells
// happen to flow — no breakpoint has to guess.
export function Notation({
  children,
  reads,
}: {
  children: ReactNode
  reads: string
}) {
  return (
    <div className="my-6 flex flex-wrap gap-px overflow-hidden rounded-lg border border-border bg-border">
      <div className="min-w-min flex-auto bg-background px-4 py-3">
        <p className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
          Formally
        </p>
        {/* KaTeX centres display math and adds its own vertical margin; both
            fight the cell, so they're reset here rather than globally. */}
        <div className="mt-2 [&_.katex-display]:my-0 [&_.katex-display]:text-left">
          {children}
        </div>
      </div>
      <div className="min-w-[15rem] flex-1 bg-muted/40 px-4 py-3">
        <p className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
          In English
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{reads}</p>
      </div>
    </div>
  )
}
