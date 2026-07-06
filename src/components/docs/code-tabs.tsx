import { CheckIcon, CopyIcon } from "@phosphor-icons/react"
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useRef,
  useState,
} from "react"
import type { KeyboardEvent, ReactElement, ReactNode } from "react"

import { cn } from "#/lib/utils.ts"

// Set while rendering inside a `<CodeTabs>` panel so the `pre` MDX override
// (`CodeBlock`) knows to skip its own frame + copy button and render a bare
// `<pre>`. The tab strip is the frame, and the shared copy button lives in the
// header, so a nested frame would be redundant.
const InsideCodeTabs = createContext(false)

export function useInsideCodeTabs() {
  return useContext(InsideCodeTabs)
}

interface CodeTabProps {
  children: ReactNode
  label: string
}

// A single tab. Only meaningful as a child of `<CodeTabs>`, which reads its
// `label` to build the tab strip and renders `children` in the panel.
export function CodeTab({ children }: CodeTabProps) {
  return <>{children}</>
}

function isCodeTab(node: ReactNode): node is ReactElement<CodeTabProps> {
  return isValidElement(node) && node.type === CodeTab
}

// Tabbed variants of the same code example, e.g. React Query vs SWR. Usage:
//
//   <CodeTabs>
//     <CodeTab label="React Query">```tsx … ```</CodeTab>
//     <CodeTab label="SWR">```tsx … ```</CodeTab>
//   </CodeTabs>
//
// The tab strip replaces the language label in the header; the copy button
// copies the active tab's code only.
export function CodeTabs({ children }: { children: ReactNode }) {
  const panels = Children.toArray(children).filter(isCodeTab)
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const baseId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const panelRefs = useRef<Array<HTMLDivElement | null>>([])

  if (panels.length === 0) {
    return null
  }

  function focusTab(index: number) {
    const next = (index + panels.length) % panels.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Partial<Record<string, number>> = {
      ArrowLeft: active - 1,
      ArrowRight: active + 1,
      End: panels.length - 1,
      Home: 0,
    }
    const next = moves[event.key]
    if (next !== undefined) {
      event.preventDefault()
      focusTab(next)
    }
  }

  function copy() {
    const text = panelRefs.current[active]?.textContent ?? ""
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="group my-6 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between border-b bg-muted/40 pr-1.5 pl-2 text-muted-foreground">
        <div
          aria-label="Code variant"
          className="flex gap-1"
          onKeyDown={onKeyDown}
          role="tablist"
        >
          {panels.map((panel, index) => {
            const isActive = index === active
            return (
              <button
                aria-controls={`${baseId}-panel-${index}`}
                aria-selected={isActive}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent hover:text-foreground"
                )}
                id={`${baseId}-tab-${index}`}
                key={panel.props.label}
                onClick={() => setActive(index)}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
              >
                {panel.props.label}
              </button>
            )
          })}
        </div>
        <button
          aria-label="Copy code"
          className="flex items-center gap-1 rounded px-1.5 py-1 text-xs transition-colors hover:bg-muted hover:text-foreground"
          onClick={copy}
          type="button"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-emerald-500" /> Copied
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <InsideCodeTabs.Provider value={true}>
        {panels.map((panel, index) => (
          <div
            aria-labelledby={`${baseId}-tab-${index}`}
            hidden={index !== active}
            id={`${baseId}-panel-${index}`}
            key={panel.props.label}
            ref={(node) => {
              panelRefs.current[index] = node
            }}
            role="tabpanel"
          >
            {panel}
          </div>
        ))}
      </InsideCodeTabs.Provider>
    </div>
  )
}
