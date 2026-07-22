import {
  ArrowCounterClockwiseIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
} from "@phosphor-icons/react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { cn } from "#/lib/utils.ts"

// A stepped, animated model of the JavaScript event loop. Each scenario is a
// hand-authored list of frames — every frame is the full contents of all four
// runtime areas plus the console and a narration line. State is just the frame
// index, so Step / Play / Reset stay trivial and render is a pure function of
// the current frame. Items carry a stable `id` across frames; that id is what
// powers the FLIP transitions (an item flying from the microtask queue onto the
// call stack is the same DOM node measured before and after the layout change).

type QueueKey = "stack" | "webApis" | "microQ" | "macroQ" | "console"

interface Item {
  id: string
  label: string
}

interface Frame {
  active?: string
  // 1-indexed source line to highlight; 0 = no line (loop bookkeeping).
  line: number
  note: string
  panels: Record<QueueKey, Array<Item>>
}

interface Scenario {
  code: string
  frames: Array<Frame>
  id: string
  title: string
}

// Empty area helper so each frame lists only the panels it touches.
function frame(
  line: number,
  note: string,
  active: string | undefined,
  panels: Partial<Record<QueueKey, Array<Item>>>
): Frame {
  return {
    active,
    line,
    note,
    panels: {
      stack: panels.stack ?? [],
      webApis: panels.webApis ?? [],
      microQ: panels.microQ ?? [],
      macroQ: panels.macroQ ?? [],
      console: panels.console ?? [],
    },
  }
}

// --- Scenario 1: microtasks run before a 0 ms timer -----------------------

const SCENARIO_MICRO_VS_MACRO: Scenario = (() => {
  const script = { id: "s1-script", label: "(main script)" }
  const logA = { id: "s1-logA", label: 'console.log("A")' }
  const logB = { id: "s1-logB", label: 'console.log("B")' }
  const setTimeoutCall = { id: "s1-st", label: "setTimeout(cb, 0)" }
  const timer = { id: "s1-cbD", label: "timer 0 ms" }
  const cbD = { id: "s1-cbD", label: "cb → D" }
  const then = { id: "s1-then", label: ".then(cb)" }
  const cbC = { id: "s1-cbC", label: "cb → C" }
  const outA = { id: "s1-outA", label: "A" }
  const outB = { id: "s1-outB", label: "B" }
  const outC = { id: "s1-outC", label: "C" }
  const outD = { id: "s1-outD", label: "D" }

  return {
    id: "micro-vs-macro",
    title: "Microtasks vs. the timer",
    code: [
      'console.log("A");',
      'setTimeout(() => console.log("D"), 0);',
      'Promise.resolve().then(() => console.log("C"));',
      'console.log("B");',
    ].join("\n"),
    frames: [
      frame(
        0,
        "The top-level script starts executing on the call stack.",
        script.id,
        {
          stack: [script],
        }
      ),
      frame(1, 'console.log("A") is pushed onto the stack.', logA.id, {
        stack: [script, logA],
      }),
      frame(
        1,
        'It prints "A" to the console, then pops off the stack.',
        outA.id,
        {
          stack: [script],
          console: [outA],
        }
      ),
      frame(
        2,
        "setTimeout is a Web API. It registers a 0 ms timer with the browser.",
        setTimeoutCall.id,
        {
          stack: [script, setTimeoutCall],
          console: [outA],
        }
      ),
      frame(
        2,
        "The browser runs the timer in the background; setTimeout returns immediately.",
        timer.id,
        {
          stack: [script],
          webApis: [timer],
          console: [outA],
        }
      ),
      frame(
        3,
        "Promise.resolve().then(...) registers a callback on an already-resolved promise.",
        then.id,
        {
          stack: [script, then],
          webApis: [timer],
          console: [outA],
        }
      ),
      frame(
        3,
        "Because the promise is settled, its callback is queued as a microtask right away.",
        cbC.id,
        {
          stack: [script],
          webApis: [timer],
          microQ: [cbC],
          console: [outA],
        }
      ),
      frame(4, 'console.log("B") is pushed.', logB.id, {
        stack: [script, logB],
        webApis: [timer],
        microQ: [cbC],
        console: [outA],
      }),
      frame(4, 'It prints "B" and pops.', outB.id, {
        stack: [script],
        webApis: [timer],
        microQ: [cbC],
        console: [outA, outB],
      }),
      frame(
        0,
        "The 0 ms timer elapses. Its callback moves to the task queue, waiting for the stack to clear.",
        cbD.id,
        {
          stack: [script],
          macroQ: [cbD],
          microQ: [cbC],
          console: [outA, outB],
        }
      ),
      frame(
        0,
        "The script finishes and the call stack empties. The event loop takes over.",
        undefined,
        {
          macroQ: [cbD],
          microQ: [cbC],
          console: [outA, outB],
        }
      ),
      frame(
        0,
        "Stack empty → drain ALL microtasks first. The promise callback runs.",
        cbC.id,
        {
          stack: [cbC],
          macroQ: [cbD],
          console: [outA, outB],
        }
      ),
      frame(0, 'It prints "C". The microtask queue is now empty.', outC.id, {
        macroQ: [cbD],
        console: [outA, outB, outC],
      }),
      frame(
        0,
        "Only now does the loop take one task from the task queue.",
        cbD.id,
        {
          stack: [cbD],
          console: [outA, outB, outC],
        }
      ),
      frame(
        0,
        'It prints "D". Final order: A, B, C, D — microtasks run before the timer.',
        outD.id,
        {
          console: [outA, outB, outC, outD],
        }
      ),
    ],
  }
})()

// --- Scenario 2: the microtask queue drains completely --------------------

const SCENARIO_FULL_DRAIN: Scenario = (() => {
  const script = { id: "s2-script", label: "(main script)" }
  const setTimeoutCall = { id: "s2-st", label: "setTimeout(cb, 0)" }
  const timer = { id: "s2-cbT", label: "timer 0 ms" }
  const cbT = { id: "s2-cbT", label: "cb → timeout" }
  const then1 = { id: "s2-then1", label: ".then(cb1)" }
  const cb1 = { id: "s2-cbP1", label: "cb1" }
  const then2 = { id: "s2-then2", label: ".then(cb2)" }
  const cb2 = { id: "s2-cbP2", label: "cb2" }
  const outP1 = { id: "s2-outP1", label: "promise 1" }
  const outP2 = { id: "s2-outP2", label: "promise 2" }
  const outT = { id: "s2-outT", label: "timeout" }

  return {
    id: "full-drain",
    title: "Microtasks drain completely",
    code: [
      'setTimeout(() => console.log("timeout"), 0);',
      "",
      "Promise.resolve().then(() => {",
      '  console.log("promise 1");',
      "  Promise.resolve().then(() => {",
      '    console.log("promise 2");',
      "  });",
      "});",
    ].join("\n"),
    frames: [
      frame(0, "The top-level script starts running.", script.id, {
        stack: [script],
      }),
      frame(
        1,
        "setTimeout hands a 0 ms timer to the browser.",
        setTimeoutCall.id,
        {
          stack: [script, setTimeoutCall],
        }
      ),
      frame(
        1,
        "The timer runs in the background; setTimeout returns.",
        timer.id,
        {
          stack: [script],
          webApis: [timer],
        }
      ),
      frame(
        3,
        "The first .then registers a callback on an already-resolved promise.",
        then1.id,
        {
          stack: [script, then1],
          webApis: [timer],
        }
      ),
      frame(3, "cb1 is queued as a microtask.", cb1.id, {
        stack: [script],
        webApis: [timer],
        microQ: [cb1],
      }),
      frame(
        0,
        "The 0 ms timer elapses; its callback waits in the task queue.",
        cbT.id,
        {
          stack: [script],
          macroQ: [cbT],
          microQ: [cb1],
        }
      ),
      frame(0, "The script finishes; the call stack is empty.", undefined, {
        macroQ: [cbT],
        microQ: [cb1],
      }),
      frame(4, "Stack empty → drain microtasks. cb1 runs.", cb1.id, {
        stack: [cb1],
        macroQ: [cbT],
      }),
      frame(
        4,
        'cb1 prints "promise 1", then registers another .then.',
        outP1.id,
        {
          stack: [cb1],
          macroQ: [cbT],
          console: [outP1],
        }
      ),
      frame(
        5,
        "A nested .then runs inside cb1, on another resolved promise.",
        then2.id,
        {
          stack: [cb1, then2],
          macroQ: [cbT],
          console: [outP1],
        }
      ),
      frame(
        5,
        "cb2 joins the microtask queue while we are still draining it.",
        cb2.id,
        {
          stack: [cb1],
          macroQ: [cbT],
          microQ: [cb2],
          console: [outP1],
        }
      ),
      frame(
        0,
        "cb1 returns and pops. The microtask queue is not empty yet.",
        undefined,
        {
          macroQ: [cbT],
          microQ: [cb2],
          console: [outP1],
        }
      ),
      frame(
        6,
        "The newly queued microtask runs before any task: the queue drains completely, including microtasks added during the drain.",
        cb2.id,
        {
          stack: [cb2],
          macroQ: [cbT],
          console: [outP1],
        }
      ),
      frame(6, 'cb2 prints "promise 2".', outP2.id, {
        stack: [cb2],
        macroQ: [cbT],
        console: [outP1, outP2],
      }),
      frame(
        0,
        "Microtasks are finally empty. Now the loop takes one task.",
        undefined,
        {
          macroQ: [cbT],
          console: [outP1, outP2],
        }
      ),
      frame(1, "The timer callback runs.", cbT.id, {
        stack: [cbT],
        console: [outP1, outP2],
      }),
      frame(
        1,
        'It prints "timeout". Order: promise 1, promise 2, timeout.',
        outT.id,
        {
          console: [outP1, outP2, outT],
        }
      ),
    ],
  }
})()

// --- Scenario 3: await schedules the continuation as a microtask ----------

const SCENARIO_ASYNC_AWAIT: Scenario = (() => {
  const script = { id: "s3-script", label: "(top level)" }
  const mainFn = { id: "s3-main", label: "main()" }
  const log1 = { id: "s3-log1", label: 'console.log("1")' }
  const log2 = { id: "s3-log2", label: 'console.log("2")' }
  const log3 = { id: "s3-log3", label: 'console.log("3")' }
  const cont = { id: "s3-cont", label: "main() · resume" }
  const out1 = { id: "s3-out1", label: "1" }
  const out2 = { id: "s3-out2", label: "2" }
  const out3 = { id: "s3-out3", label: "3" }

  return {
    id: "async-await",
    title: "await is a microtask",
    code: [
      "async function main() {",
      '  console.log("1");',
      "  await null;",
      '  console.log("2");',
      "}",
      "main();",
      'console.log("3");',
    ].join("\n"),
    frames: [
      frame(0, "The top-level script begins running.", script.id, {
        stack: [script],
      }),
      frame(6, "main() is called and pushed onto the stack.", mainFn.id, {
        stack: [script, mainFn],
      }),
      frame(2, 'Inside main(), console.log("1") runs.', log1.id, {
        stack: [script, mainFn, log1],
      }),
      frame(2, 'It prints "1".', out1.id, {
        stack: [script, mainFn],
        console: [out1],
      }),
      frame(
        3,
        "Execution reaches `await`. Everything after it becomes a continuation.",
        mainFn.id,
        {
          stack: [script, mainFn],
          console: [out1],
        }
      ),
      frame(
        3,
        "main() suspends and returns a pending promise. The code after `await` is queued as a microtask; control returns to the caller.",
        cont.id,
        {
          stack: [script],
          microQ: [cont],
          console: [out1],
        }
      ),
      frame(7, 'Back in the top-level code, console.log("3") runs.', log3.id, {
        stack: [script, log3],
        microQ: [cont],
        console: [out1],
      }),
      frame(7, 'It prints "3". main() still is not finished.', out3.id, {
        stack: [script],
        microQ: [cont],
        console: [out1, out3],
      }),
      frame(0, "The script finishes; the stack empties.", undefined, {
        microQ: [cont],
        console: [out1, out3],
      }),
      frame(
        4,
        "Drain microtasks: main()'s continuation resumes right after the await.",
        cont.id,
        {
          stack: [cont],
          console: [out1, out3],
        }
      ),
      frame(4, 'console.log("2") runs.', log2.id, {
        stack: [cont, log2],
        console: [out1, out3],
      }),
      frame(
        4,
        'It prints "2". Final order: 1, 3, 2 — await deferred the rest of main() to a microtask.',
        out2.id,
        {
          console: [out1, out3, out2],
        }
      ),
    ],
  }
})()

const SCENARIOS: Array<Scenario> = [
  SCENARIO_MICRO_VS_MACRO,
  SCENARIO_FULL_DRAIN,
  SCENARIO_ASYNC_AWAIT,
]

const PANELS: Array<{
  key: Exclude<QueueKey, "console">
  subtitle: string
  title: string
}> = [
  {
    key: "stack",
    subtitle: "runs now, last in first out",
    title: "Call Stack",
  },
  { key: "webApis", subtitle: "timers, fetch, events", title: "Web APIs" },
  {
    key: "microQ",
    subtitle: "drains fully each turn",
    title: "Microtask Queue",
  },
  { key: "macroQ", subtitle: "one task per turn", title: "Task Queue" },
]

// Motion tuning. Ease-out curve (no bounce). Play cadence sits above the move
// duration so a transfer finishes before the next step begins.
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const MOVE_MS = 460
const ENTER_MS = 300
const EXIT_MS = 260
const PLAY_MS = 1250

const useIsoLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect

interface Leaving {
  id: string
  label: string
  panel: QueueKey
}

function findItem(
  source: Frame,
  id: string
): { item: Item; panel: QueueKey } | null {
  for (const key of Object.keys(source.panels) as Array<QueueKey>) {
    const item = source.panels[key].find((entry) => entry.id === id)
    if (item) return { item, panel: key }
  }
  return null
}

export function EventLoop() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]
  const frames = scenario.frames
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [leaving, setLeaving] = useState<Array<Leaving>>([])
  const [reducedMotion, setReducedMotion] = useState(false)

  const current = frames[index]
  const atEnd = index >= frames.length - 1
  const codeLines = scenario.code.split("\n")

  const rootRef = useRef<HTMLDivElement>(null)
  const prevRects = useRef<Map<string, DOMRect>>(new Map())
  const prevFrame = useRef<Frame | null>(null)
  const prevIndex = useRef(index)
  const mounted = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  // FLIP + enter transitions for the live items, and detection of items that
  // left the diagram this step (rendered as a fading ghost by the effect below).
  useIsoLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const live = root.querySelectorAll<HTMLElement>("[data-item-id]")
    const rects = new Map<string, DOMRect>()
    live.forEach((el) =>
      rects.set(el.dataset.itemId ?? "", el.getBoundingClientRect())
    )

    const isStep = index === prevIndex.current + 1
    const animate = mounted.current && isStep && !reducedMotion

    if (animate) {
      live.forEach((el) => {
        const id = el.dataset.itemId ?? ""
        const next = rects.get(id)
        const prev = prevRects.current.get(id)
        if (!next) return
        if (prev) {
          const dx = prev.left - next.left
          const dy = prev.top - next.top
          if (dx || dy) {
            el.style.transition = "none"
            el.style.transform = `translate(${dx}px, ${dy}px)`
            void el.getBoundingClientRect()
            requestAnimationFrame(() => {
              el.style.transition = `transform ${MOVE_MS}ms ${EASE}`
              el.style.transform = ""
            })
          }
        } else {
          el.style.transition = "none"
          el.style.transform = "translateY(6px) scale(0.94)"
          el.style.opacity = "0"
          void el.getBoundingClientRect()
          requestAnimationFrame(() => {
            el.style.transition = `transform ${ENTER_MS}ms ${EASE}, opacity ${ENTER_MS}ms ${EASE}`
            el.style.transform = ""
            el.style.opacity = ""
          })
        }
      })

      const gone: Array<Leaving> = []
      prevRects.current.forEach((_rect, id) => {
        if (!rects.has(id) && prevFrame.current) {
          const found = findItem(prevFrame.current, id)
          if (found)
            gone.push({ id, label: found.item.label, panel: found.panel })
        }
      })
      if (gone.length) setLeaving(gone)
    }

    prevRects.current = rects
    prevFrame.current = current
    prevIndex.current = index
    mounted.current = true
  }, [current, index, reducedMotion, scenarioId])

  // Fade the ghosts of items that left, then unmount them.
  useIsoLayoutEffect(() => {
    if (!leaving.length) return
    const root = rootRef.current
    if (!root) return
    for (const { id } of leaving) {
      const el = root.querySelector<HTMLElement>(`[data-leaving-id="${id}"]`)
      if (!el) continue
      el.style.transition = "none"
      el.style.opacity = "1"
      void el.getBoundingClientRect()
      requestAnimationFrame(() => {
        el.style.transition = `transform ${EXIT_MS}ms ${EASE}, opacity ${EXIT_MS}ms ${EASE}`
        el.style.transform = "scale(0.9)"
        el.style.opacity = "0"
      })
    }
    const timer = window.setTimeout(() => setLeaving([]), EXIT_MS + 40)
    return () => window.clearTimeout(timer)
  }, [leaving])

  useEffect(() => {
    if (!playing) return
    if (index >= frames.length - 1) {
      setPlaying(false)
      return
    }
    const timer = window.setTimeout(
      () => setIndex((i) => Math.min(i + 1, frames.length - 1)),
      PLAY_MS
    )
    return () => window.clearTimeout(timer)
  }, [playing, index, frames.length])

  function reset() {
    setPlaying(false)
    setLeaving([])
    setIndex(0)
  }

  function step() {
    setPlaying(false)
    setIndex((i) => Math.min(i + 1, frames.length - 1))
  }

  function togglePlay() {
    if (atEnd) {
      setLeaving([])
      setIndex(0)
    }
    setPlaying((p) => !p)
  }

  function pickScenario(id: string) {
    setPlaying(false)
    setLeaving([])
    setIndex(0)
    setScenarioId(id)
  }

  return (
    <figure className="not-prose my-8">
      <div
        ref={rootRef}
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Scenario</span>
            <select
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              onChange={(e) => pickScenario(e.target.value)}
              value={scenarioId}
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="mr-1 font-mono text-xs tracking-tight text-muted-foreground tabular-nums"
            >
              {index + 1} / {frames.length}
            </span>
            <button
              aria-label="Reset to the first step"
              className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              onClick={reset}
              type="button"
            >
              <ArrowCounterClockwiseIcon className="size-4" />
            </button>
            <button
              aria-label={playing ? "Pause" : "Play"}
              className="flex size-8 items-center justify-center rounded-md border border-chart-3/50 bg-chart-3/10 text-chart-3 transition-colors hover:bg-chart-3/20 focus:ring-2 focus:ring-ring focus:outline-none"
              onClick={togglePlay}
              type="button"
            >
              {playing ? (
                <PauseIcon className="size-4" weight="fill" />
              ) : (
                <PlayIcon className="size-4" weight="fill" />
              )}
            </button>
            <button
              aria-label="Next step"
              className="flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:ring-2 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              disabled={atEnd}
              onClick={step}
              type="button"
            >
              Step <ArrowRightIcon className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-3 font-mono text-[0.72rem] leading-relaxed">
            <code>
              {codeLines.map((text, i) => (
                <div
                  className={cn(
                    "-mx-1 w-max min-w-full rounded px-1 transition-colors",
                    current.line === i + 1
                      ? "bg-chart-3/15 text-foreground"
                      : "text-foreground/70"
                  )}
                  key={i}
                >
                  <span className="mr-3 inline-block w-3 text-right text-muted-foreground/50 select-none">
                    {i + 1}
                  </span>
                  {text.length ? text : " "}
                </div>
              ))}
            </code>
          </pre>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PANELS.map((panel) => {
              const items = current.panels[panel.key]
              const ghosts = leaving.filter((l) => l.panel === panel.key)
              const empty = items.length === 0 && ghosts.length === 0
              return (
                <div
                  className="rounded-lg border border-border bg-background/40 p-2.5"
                  key={panel.key}
                >
                  <div className="mb-2">
                    <div className="font-heading text-xs font-semibold text-foreground">
                      {panel.title}
                    </div>
                    <div className="text-[0.62rem] leading-tight text-muted-foreground">
                      {panel.subtitle}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex min-h-28 gap-1.5",
                      panel.key === "stack"
                        ? "flex-col-reverse justify-end"
                        : "flex-col"
                    )}
                  >
                    {empty ? (
                      <span className="mt-2 text-center text-[0.62rem] text-muted-foreground/40 select-none">
                        empty
                      </span>
                    ) : null}
                    {items.map((item) => (
                      <Chip
                        active={current.active === item.id}
                        item={item}
                        key={item.id}
                      />
                    ))}
                    {ghosts.map((ghost) => (
                      <Chip ghost item={ghost} key={`ghost-${ghost.id}`} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="border-t border-border px-4 pt-3 pb-4">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="font-heading text-xs font-semibold text-foreground">
              Console
            </span>
            <span className="text-[0.62rem] text-muted-foreground">
              output, in order
            </span>
          </div>
          <div className="flex min-h-10 flex-col gap-1 rounded-lg border border-border bg-background/40 p-3">
            {current.panels.console.length === 0 ? (
              <span className="text-[0.72rem] text-muted-foreground/40 select-none">
                no output yet
              </span>
            ) : (
              current.panels.console.map((item) => (
                <div
                  className="flex items-center gap-2 font-mono text-[0.72rem]"
                  data-item-id={item.id}
                  key={item.id}
                  style={{ willChange: "transform" }}
                >
                  <span className="text-chart-3">›</span>
                  <span
                    className={cn(
                      current.active === item.id
                        ? "text-chart-3"
                        : "text-foreground/85"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <p
          aria-live="polite"
          className="border-t border-border bg-muted/20 px-4 py-3 text-sm leading-relaxed text-foreground/90"
        >
          {current.note}
        </p>

        <details className="border-t border-border">
          <summary className="cursor-pointer px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground">
            All steps
          </summary>
          <ol className="max-h-56 overflow-y-auto px-4 pb-3 text-xs">
            {frames.map((f, i) => (
              <li
                className={cn(
                  "flex gap-2 py-1",
                  i === index ? "text-foreground" : "text-muted-foreground",
                  i > index && "opacity-50"
                )}
                key={i}
              >
                <span className="w-5 shrink-0 text-right font-mono text-muted-foreground/60 tabular-nums">
                  {i + 1}
                </span>
                <span>{f.note}</span>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </figure>
  )
}

function Chip({
  active,
  ghost,
  item,
}: {
  active?: boolean
  ghost?: boolean
  item: Item
}) {
  return (
    <div
      className={cn(
        "relative z-10 rounded-md border px-2.5 py-1.5 text-center font-mono text-[0.72rem] leading-tight",
        active
          ? "border-chart-3 bg-chart-3/12 text-foreground shadow-sm"
          : "border-border bg-muted/50 text-foreground/80"
      )}
      data-item-id={ghost ? undefined : item.id}
      data-leaving-id={ghost ? item.id : undefined}
      style={{ transformOrigin: "center", willChange: "transform" }}
    >
      {item.label}
    </div>
  )
}
