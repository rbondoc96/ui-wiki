import { useEffect, useId, useRef, useState } from "react"
import type { Mermaid as MermaidApi } from "mermaid"

import { useTheme } from "#/lib/theme.tsx"
import { cn } from "#/lib/utils.ts"

// Mermaid is browser-only (needs the DOM) and heavy, so it's imported lazily on
// the client. This module-level promise dedupes the import across every diagram
// on a page.
let mermaidPromise: Promise<MermaidApi> | null = null
function loadMermaid() {
  mermaidPromise ??= import("mermaid").then((m) => m.default)
  return mermaidPromise
}

// `mermaid.render` isn't reentrant: it derives temporary DOM element ids from
// the id passed in, so two concurrent renders sharing an id corrupt each other's
// scratch nodes and yield an empty result. React StrictMode double-invokes
// effects in dev, so every diagram would render twice concurrently. A global
// counter hands each call a unique id, keeping the two runs independent.
let renderCounter = 0

// Mermaid themes with `khroma`, which can't parse the `oklch(...)` values our
// design tokens use. Browser normalization is no help: modern Chrome keeps both
// `getComputedStyle().color` and canvas `fillStyle` in the oklch color space
// rather than resolving to rgb. So convert oklch → sRGB hex ourselves — version-
// proof math, no reliance on how the browser serializes colors.

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}

// sRGB gamma (linear → companded), per the sRGB spec.
function gamma(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

function toHex2(n: number): string {
  return Math.round(clamp01(n) * 255)
    .toString(16)
    .padStart(2, "0")
}

// Convert an `oklch(L C H[/ A])` string to `#rrggbb` (or `rgba(...)` when the
// token carries alpha). L is 0–1 or a percentage; H is in degrees. Non-oklch
// input (already hex/rgb) is returned untouched.
function oklchToRgb(value: string): string {
  const match = value.match(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i
  )
  if (!match) return value
  const [, lRaw, cRaw, hRaw, aRaw] = match

  const L = lRaw.endsWith("%") ? parseFloat(lRaw) / 100 : parseFloat(lRaw)
  const C = parseFloat(cRaw)
  const hRad = (parseFloat(hRaw) * Math.PI) / 180

  // oklch → oklab → LMS (cubed) → linear sRGB (matrices from the Oklab spec).
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3

  const r = gamma(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_)
  const g = gamma(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_)
  const bl = gamma(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_)

  if (aRaw) {
    const alpha = aRaw.endsWith("%") ? parseFloat(aRaw) / 100 : parseFloat(aRaw)
    const to255 = (n: number) => Math.round(clamp01(n) * 255)
    return `rgba(${to255(r)}, ${to255(g)}, ${to255(bl)}, ${alpha})`
  }
  return `#${toHex2(r)}${toHex2(g)}${toHex2(bl)}`
}

function resolveTokens(names: Array<string>): Record<string, string> {
  const root = getComputedStyle(document.documentElement)
  const resolved: Record<string, string> = {}
  for (const name of names) {
    resolved[name] = oklchToRgb(root.getPropertyValue(name).trim())
  }
  return resolved
}

// Map our CSS custom properties onto Mermaid's `base` theme variables. The
// palette is deliberately neutral — nodes are quiet surfaces, edges and text use
// the muted/foreground pair — so diagrams read like part of the prose rather than
// a loud infographic. Mermaid derives dozens of sub-variables from these
// primaries, so a small, consistent core keeps every diagram kind on-brand.
function buildThemeVariables(): Record<string, string> {
  const t = resolveTokens([
    "--card",
    "--secondary",
    "--muted",
    "--muted-foreground",
    "--foreground",
    "--border",
  ])
  const surface = t["--secondary"]
  const line = t["--muted-foreground"]
  const text = t["--foreground"]
  const border = t["--muted-foreground"]

  return {
    fontFamily: "var(--font-sans)",
    fontSize: "14px",

    background: t["--card"],
    // Nodes: quiet surface with a crisp outline that reads in both themes.
    primaryColor: surface,
    mainBkg: surface,
    primaryBorderColor: border,
    primaryTextColor: text,
    secondaryColor: t["--muted"],
    secondaryBorderColor: border,
    tertiaryColor: t["--card"],
    tertiaryBorderColor: t["--border"],

    // Edges and their labels.
    lineColor: line,
    textColor: text,
    edgeLabelBackground: t["--card"],

    // Notes (sequence/flow) stay neutral rather than a highlighted callout.
    noteBkgColor: t["--muted"],
    noteBorderColor: t["--border"],
    noteTextColor: text,

    // Sequence-diagram specifics.
    actorBkg: surface,
    actorBorder: border,
    actorTextColor: text,
    actorLineColor: t["--border"],
    signalColor: line,
    signalTextColor: text,
    labelBoxBkgColor: surface,
    labelBoxBorderColor: border,
    labelTextColor: text,
    loopTextColor: text,

    // State-diagram specifics.
    labelBackgroundColor: t["--card"],
  }
}

// Layout + fine styling that theme variables can't express: rounded corners,
// calmer edge-label chips, curved edges, and room to breathe. Applied to the
// rendered SVG, so `var(--…)` tokens (including oklch) resolve natively here.
const THEME_CSS = `
  .node rect, .node polygon, .cluster rect { rx: 8px; ry: 8px; }
  .edgeLabel, .edgeLabel p { font-size: 12px; line-height: 1.2; }
  .edgeLabel .label rect, .edgeLabels .label rect { rx: 4px; ry: 4px; opacity: 0.92; }
  .note { rx: 8px; ry: 8px; }
  .messageText, .noteText, .loopText { font-size: 13px; }

  /* Subtle brand-green accent on state-machine start/end markers. */
  .node circle.state-start, .node .fork-join { fill: var(--chart-3); stroke: var(--chart-3); }
  .node circle.state-end { fill: var(--card); stroke: var(--chart-3); stroke-width: 1.5px; }
  .end-state-inner { fill: var(--chart-3); }
`

/**
 * Renders a Mermaid diagram from source text, themed to match the wiki and
 * re-rendered on light/dark toggle. Diagram kinds (sequence, state, flowchart,
 * class/ER, etc.) are all just Mermaid syntax — one component covers them all.
 *
 * A Mermaid SVG is opaque to assistive tech on its own, so the rendered `<svg>`
 * gets `role="img"` plus an accessible name — from `title`, else the visible
 * `caption` — and an optional `description` for the longer story a sighted
 * reader gets from the shapes.
 */
export function Mermaid({
  caption,
  chart,
  description,
  title,
}: {
  caption?: string
  chart: string
  description?: string
  title?: string
}) {
  const { theme } = useTheme()
  const uid = useId()
  const captionId = `${uid}-caption`
  const descId = `${uid}-desc`
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const renderId = `mermaid-${renderCounter++}`
    void loadMermaid().then(async (mermaid) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: buildThemeVariables(),
        themeCSS: THEME_CSS,
        flowchart: {
          curve: "basis",
          nodeSpacing: 45,
          rankSpacing: 55,
          padding: 12,
        },
        sequence: {
          actorMargin: 60,
          boxMargin: 12,
          messageMargin: 40,
        },
      })
      try {
        const { svg } = await mermaid.render(renderId, chart.trim())
        if (cancelled || !containerRef.current) return
        containerRef.current.innerHTML = svg
        const svgEl = containerRef.current.querySelector("svg")
        if (svgEl) {
          svgEl.setAttribute("role", "img")
          if (title) svgEl.setAttribute("aria-label", title)
          else if (caption) svgEl.setAttribute("aria-labelledby", captionId)
          else svgEl.setAttribute("aria-label", "Diagram")
          if (description) svgEl.setAttribute("aria-describedby", descId)
        }
        setError(null)
        setReady(true)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
      }
    })
    return () => {
      cancelled = true
    }
    // Re-render when the diagram source or the active theme changes.
  }, [caption, captionId, chart, descId, description, theme, title])

  return (
    <figure className="not-prose my-6">
      {error ? (
        <pre className="overflow-x-auto rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
          Mermaid error: {error}
        </pre>
      ) : (
        <div className="relative">
          <div
            ref={containerRef}
            className={cn(
              "flex min-h-28 justify-center overflow-x-auto rounded-lg border border-border bg-card p-6",
              "[&_svg]:h-auto [&_svg]:max-w-full"
            )}
          />
          {/* Placeholder until the lazy Mermaid chunk loads and the SVG lands,
              so there's no empty-frame flash on first paint. */}
          {ready ? null : (
            <div
              aria-hidden="true"
              className="absolute inset-0 animate-pulse rounded-lg bg-muted"
            />
          )}
        </div>
      )}
      {description ? (
        <p className="sr-only" id={descId}>
          {description}
        </p>
      ) : null}
      {caption ? (
        <figcaption
          className="mt-2 text-center text-sm text-muted-foreground"
          id={captionId}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
