import { CaretLeftIcon } from "@phosphor-icons/react"
import { useState } from "react"

import {
  Bar,
  DiagramFrame,
  Region,
  ShellFrame,
} from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// Visuals for the master-detail archetype. `MasterDetailAnatomy` names the two
// panes; `MasterDetail` is the live mockup with a layout toggle so the same
// data can be shown two-pane (desktop) or stacked into a single-pane phone
// drill-down, which is the whole point of the pattern: one shape, two foldings.

interface Message {
  body: string
  from: string
  id: string
  preview: string
  subject: string
  time: string
}

const MESSAGES: Array<Message> = [
  {
    body: "Welcome aboard. Your workspace is ready — invite teammates from Settings, then create your first project. Reply here if anything looks off.",
    from: "Avery Lin",
    id: "1",
    preview: "Here's how to get started in a couple of minutes.",
    subject: "Welcome to the workspace",
    time: "9:02",
  },
  {
    body: "Two items left on the checklist: connect the calendar and set notification defaults. Once those are done we're clear to launch.",
    from: "Jordan Kim",
    id: "2",
    preview: "Two items left before we can launch.",
    subject: "Re: onboarding checklist",
    time: "Tue",
  },
  {
    body: "This week: 3 projects active, 12 tasks closed, 2 new members. Activity is up 18% from last week.",
    from: "Notifications",
    id: "3",
    preview: "3 projects active, 12 tasks closed.",
    subject: "Your weekly summary",
    time: "Mon",
  },
]

export function MasterDetailAnatomy() {
  return (
    <DiagramFrame
      caption="Pick on the left, read on the right. On a phone the two panes become two screens."
      className="h-44"
    >
      <Region caption="scan + select" grow="w-48 shrink-0" name="List · master">
        <Bar w="w-2/3" />
        <div className="mt-1 flex flex-col gap-1.5">
          <span className="h-6 rounded bg-accent" />
          <span className="h-6 rounded bg-muted-foreground/10" />
          <span className="h-6 rounded bg-muted-foreground/10" />
        </div>
      </Region>
      <Region caption="the selected record" grow="flex-1" name="Detail">
        <Bar w="w-1/2" />
        <Bar />
        <Bar />
        <Bar w="w-5/6" />
      </Region>
    </DiagramFrame>
  )
}

type Mode = "split" | "stacked"

function MessageRow({
  message,
  onSelect,
  selected,
}: {
  message: Message
  onSelect: () => void
  selected: boolean
}) {
  return (
    <button
      className={cn(
        "flex w-full flex-col gap-0.5 border-b border-border/60 px-3 py-2 text-left transition-colors last:border-b-0",
        selected ? "bg-accent" : "hover:bg-accent/50"
      )}
      onClick={onSelect}
      type="button"
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate font-medium text-foreground">
          {message.from}
        </span>
        <span className="shrink-0 text-[0.7rem] text-muted-foreground">
          {message.time}
        </span>
      </span>
      <span className="truncate text-foreground">{message.subject}</span>
      <span className="truncate text-muted-foreground">{message.preview}</span>
    </button>
  )
}

function MessageDetail({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <h4 className="font-semibold text-foreground">{message.subject}</h4>
      <p className="text-muted-foreground">From {message.from}</p>
      <p className="mt-1 leading-relaxed text-foreground">{message.body}</p>
    </div>
  )
}

export function MasterDetail() {
  const [mode, setMode] = useState<Mode>("split")
  const [selectedId, setSelectedId] = useState(MESSAGES[0].id)
  const [showDetail, setShowDetail] = useState(false)

  const message = MESSAGES.find((m) => m.id === selectedId) ?? MESSAGES[0]

  function switchMode(next: Mode) {
    setMode(next)
    setShowDetail(false)
  }

  return (
    <ShellFrame className="h-80 flex-col">
      <div className="flex items-center gap-1 border-b border-border bg-muted/20 px-2 py-1.5">
        <span className="mr-1 pl-1 text-muted-foreground">Layout</span>
        {(["split", "stacked"] as const).map((m) => (
          <button
            aria-pressed={mode === m}
            className={cn(
              "rounded-md px-2 py-1 transition-colors",
              mode === m
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={m}
            onClick={() => switchMode(m)}
            type="button"
          >
            {m === "split" ? "Two-pane" : "Stacked (phone)"}
          </button>
        ))}
      </div>

      {mode === "split" ? (
        <div className="flex min-h-0 flex-1">
          <div className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-border">
            <header className="border-b border-border px-3 py-2 font-semibold text-foreground">
              Inbox
            </header>
            {MESSAGES.map((m) => (
              <MessageRow
                key={m.id}
                message={m}
                onSelect={() => setSelectedId(m.id)}
                selected={m.id === message.id}
              />
            ))}
          </div>
          <article className="min-w-0 flex-1 overflow-y-auto">
            <MessageDetail message={message} />
          </article>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 justify-center bg-muted/20 p-4">
          <div className="flex w-60 flex-col overflow-hidden rounded-lg border border-border bg-card">
            {showDetail ? (
              <>
                <header className="flex items-center gap-1 border-b border-border px-2 py-2">
                  <button
                    className="flex items-center gap-1 rounded-md px-1.5 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={() => setShowDetail(false)}
                    type="button"
                  >
                    <CaretLeftIcon className="size-4" />
                    Inbox
                  </button>
                </header>
                <div className="overflow-y-auto">
                  <MessageDetail message={message} />
                </div>
              </>
            ) : (
              <>
                <header className="border-b border-border px-3 py-2 font-semibold text-foreground">
                  Inbox
                </header>
                <div className="overflow-y-auto">
                  {MESSAGES.map((m) => (
                    <MessageRow
                      key={m.id}
                      message={m}
                      onSelect={() => {
                        setSelectedId(m.id)
                        setShowDetail(true)
                      }}
                      selected={false}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ShellFrame>
  )
}
