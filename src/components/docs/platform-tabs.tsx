import { DeviceMobileIcon, GlobeIcon } from "@phosphor-icons/react"
import { Children, isValidElement, useId, useRef, useState } from "react"
import type { Icon } from "@phosphor-icons/react"
import type { KeyboardEvent, ReactElement, ReactNode } from "react"

import { cn } from "#/lib/utils.ts"

interface PlatformProps {
  children: ReactNode
  label: string
}

// A single tab. Only meaningful as a child of `<PlatformTabs>`, which reads its
// `label` to build the tab strip and renders `children` in the panel.
export function Platform({ children }: PlatformProps) {
  return <>{children}</>
}

function isPlatform(node: ReactNode): node is ReactElement<PlatformProps> {
  return isValidElement(node) && node.type === Platform
}

// Built-in icon per platform label so the common Web/native cases get an icon
// for free. Unknown labels simply render without one.
const platformIcons: Record<string, Icon> = {
  android: DeviceMobileIcon,
  ios: DeviceMobileIcon,
  mobile: DeviceMobileIcon,
  native: DeviceMobileIcon,
  "react native": DeviceMobileIcon,
  "react-native": DeviceMobileIcon,
  web: GlobeIcon,
}

function iconFor(label: string): Icon | undefined {
  return platformIcons[label.trim().toLowerCase()]
}

// Tabbed comparison of the same pattern across platforms, e.g. Web vs React
// Native. Usage:
//
//   <PlatformTabs>
//     <Platform label="Web">…</Platform>
//     <Platform label="React Native">…</Platform>
//   </PlatformTabs>
export function PlatformTabs({ children }: { children: ReactNode }) {
  const panels = Children.toArray(children).filter(isPlatform)
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

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

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div
        aria-label="Platform"
        className="flex gap-1 border-b border-border bg-muted/20 px-2"
        onKeyDown={onKeyDown}
        role="tablist"
      >
        {panels.map((panel, index) => {
          const isActive = index === active
          const TabIcon = iconFor(panel.props.label)
          return (
            <button
              aria-controls={`${baseId}-panel-${index}`}
              aria-selected={isActive}
              className={cn(
                "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
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
              {TabIcon ? (
                <TabIcon
                  className={cn(
                    "size-4 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  weight={isActive ? "fill" : "regular"}
                />
              ) : null}
              {panel.props.label}
            </button>
          )
        })}
      </div>
      {panels.map((panel, index) => (
        <div
          aria-labelledby={`${baseId}-tab-${index}`}
          className="px-4 py-4 text-sm [&>:first-child]:mt-0 [&>:last-child]:mb-0"
          hidden={index !== active}
          id={`${baseId}-panel-${index}`}
          key={panel.props.label}
          role="tabpanel"
        >
          {panel}
        </div>
      ))}
    </div>
  )
}
