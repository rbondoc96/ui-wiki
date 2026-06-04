import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

import { cn } from "#/lib/utils.ts"

// Side-by-side "do this / not that" guidance. Use `<Do>` and `<Dont>` as the
// two children; on narrow screens they stack. Each card takes an optional
// `title` that states the point in a few words, and an optional `preview` —
// a live example rendered in a framed canvas above the text, so guidance can
// be shown, not just described.
export function DoDont({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-8 grid gap-3 md:grid-cols-2">{children}</div>
  )
}

const variants = {
  do: {
    Icon: CheckCircleIcon,
    accent: "border-emerald-500/40 bg-emerald-500/5",
    iconClass: "text-emerald-500",
    defaultLabel: "Do",
  },
  dont: {
    Icon: XCircleIcon,
    accent: "border-destructive/40 bg-destructive/5",
    iconClass: "text-destructive",
    defaultLabel: "Don't",
  },
} as const

function Card({
  children,
  preview,
  title,
  variant,
}: {
  children: ReactNode
  preview?: ReactNode
  title?: string
  variant: keyof typeof variants
}) {
  const { Icon, accent, iconClass, defaultLabel } = variants[variant]
  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border p-4 text-sm leading-relaxed",
        accent
      )}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <Icon className={cn("size-4", iconClass)} weight="fill" />
        <span className="text-xs font-semibold tracking-wide text-foreground uppercase">
          {defaultLabel}
        </span>
      </div>
      {preview ? (
        <div className="mb-3 overflow-hidden rounded-lg border border-border/60 bg-background p-3">
          {preview}
        </div>
      ) : null}
      {title ? (
        <p className="mb-1 font-medium text-foreground">{title}</p>
      ) : null}
      <div className="text-muted-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </section>
  )
}

export function Do({
  children,
  preview,
  title,
}: {
  children: ReactNode
  preview?: ReactNode
  title?: string
}) {
  return (
    <Card preview={preview} title={title} variant="do">
      {children}
    </Card>
  )
}

export function Dont({
  children,
  preview,
  title,
}: {
  children: ReactNode
  preview?: ReactNode
  title?: string
}) {
  return (
    <Card preview={preview} title={title} variant="dont">
      {children}
    </Card>
  )
}
