import {
  CaretRightIcon,
  FolderIcon,
  HouseIcon,
  ListIcon,
  MagnifyingGlassIcon,
  TrayIcon,
  XIcon,
} from "@phosphor-icons/react"
import { useState } from "react"
import type { Icon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

import { Bar, PhoneFrame } from "#/components/docs/shell.tsx"
import { cn } from "#/lib/utils.ts"

// Four live phones for the "bottom bar or hamburger menu" section, each shown
// in the situation it fits: an app with four destinations, a content site with
// nine sections, and the two ways to combine them. Tap the tabs, the ☰, and the
// menu items; every phone keeps its own state.
//
// Text uses spans and nav uses divs because `.doc-prose p/ul/li` rules are
// unlayered and would override the utility classes here.

type Tab = { Icon: Icon; label: string }

function PhoneStage({
  caption,
  children,
  label,
}: {
  caption: string
  children: ReactNode
  label: string
}) {
  return (
    <figure className="flex flex-col">
      <div className="flex h-[22rem] justify-center rounded-xl border border-border bg-muted/20 p-3 text-xs">
        <PhoneFrame>{children}</PhoneFrame>
      </div>
      <figcaption className="mt-2">
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>
        <span className="block text-xs text-muted-foreground">{caption}</span>
      </figcaption>
    </figure>
  )
}

function Page({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5 p-3">
      <span className="font-semibold text-foreground">{title}</span>
      <Bar w="w-5/6" />
      <Bar />
      <Bar w="w-2/3" />
      <Bar w="w-3/4" />
    </div>
  )
}

function MenuButton({
  label,
  onClick,
  open,
}: {
  label: string
  onClick: () => void
  open: boolean
}) {
  return (
    <button
      aria-expanded={open}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
      onClick={onClick}
      type="button"
    >
      {open ? <XIcon className="size-4" /> : <ListIcon className="size-4" />}
    </button>
  )
}

function MenuList({
  active,
  items,
  onPick,
}: {
  active: string
  items: ReadonlyArray<string>
  onPick: (item: string) => void
}) {
  return (
    <div className="flex flex-col p-1.5">
      {items.map((item) => (
        <button
          aria-current={item === active ? "page" : undefined}
          className={cn(
            "flex items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors",
            item === active
              ? "bg-accent font-medium text-foreground"
              : "text-foreground hover:bg-accent/50"
          )}
          key={item}
          onClick={() => onPick(item)}
          type="button"
        >
          {item}
          <CaretRightIcon className="size-3 text-muted-foreground" />
        </button>
      ))}
    </div>
  )
}

function TabBar({
  activeIndex,
  onPick,
  tabs,
}: {
  activeIndex: number
  onPick: (index: number) => void
  tabs: ReadonlyArray<Tab>
}) {
  return (
    <nav className="flex border-t border-border">
      {tabs.map((tab, i) => {
        const on = i === activeIndex
        return (
          <button
            aria-current={on ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-colors",
              on
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={tab.label}
            onClick={() => onPick(i)}
            type="button"
          >
            <tab.Icon className="size-4" weight={on ? "fill" : "regular"} />
            <span className="text-[0.6rem]">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

const APP_TABS = [
  { Icon: HouseIcon, label: "Home" },
  { Icon: FolderIcon, label: "Projects" },
  { Icon: TrayIcon, label: "Inbox" },
  { Icon: MagnifyingGlassIcon, label: "Search" },
] as const satisfies ReadonlyArray<Tab>

function BottomBarPhone() {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-border px-3 py-2 font-semibold text-foreground">
        Atlas
      </header>
      <Page title={APP_TABS[activeIndex].label} />
      <TabBar
        activeIndex={activeIndex}
        onPick={setActiveIndex}
        tabs={APP_TABS}
      />
    </div>
  )
}

const SITE_SECTIONS = [
  "News",
  "Guides",
  "Reviews",
  "Podcasts",
  "Events",
  "Newsletter",
  "About",
  "Contact",
  "Careers",
] as const

function MenuPhone() {
  const [active, setActive] = useState<string>(SITE_SECTIONS[0])
  const [open, setOpen] = useState(false)
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-semibold text-foreground">Field Notes</span>
        <MenuButton
          label="Site menu"
          onClick={() => setOpen((o) => !o)}
          open={open}
        />
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Page title={active} />
        {open ? (
          <div className="absolute inset-0 overflow-y-auto bg-card">
            <MenuList
              active={active}
              items={SITE_SECTIONS}
              onPick={(item) => {
                setActive(item)
                setOpen(false)
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

// The fifth tab opens the long tail. It holds secondary destinations only; the
// daily ones stay as real tabs.
const MENU_TAB_TABS = [
  { Icon: HouseIcon, label: "Home" },
  { Icon: FolderIcon, label: "Projects" },
  { Icon: TrayIcon, label: "Inbox" },
  { Icon: ListIcon, label: "Menu" },
] as const satisfies ReadonlyArray<Tab>

const MENU_TAB_INDEX = MENU_TAB_TABS.length - 1

const APP_SECONDARY = [
  "Settings",
  "Billing",
  "Team",
  "Integrations",
  "Help",
  "What's new",
] as const

function TabsPlusMenuPhone() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [secondary, setSecondary] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  // Menu stays lit while one of its pages is showing, so the tab bar still
  // says where you are.
  const litIndex = open || secondary ? MENU_TAB_INDEX : activeIndex
  const title = secondary ?? MENU_TAB_TABS[activeIndex].label

  function pickTab(index: number) {
    if (index === MENU_TAB_INDEX) {
      setOpen((o) => !o)
      return
    }
    setActiveIndex(index)
    setSecondary(null)
    setOpen(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-border px-3 py-2 font-semibold text-foreground">
        Atlas
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Page title={title} />
        {open ? (
          <div className="absolute inset-0 flex flex-col justify-end bg-foreground/20">
            <div className="max-h-full overflow-y-auto rounded-t-xl border-t border-border bg-card shadow-lg">
              <div className="flex justify-center pt-1.5">
                <span className="h-1 w-8 rounded-full bg-muted-foreground/30" />
              </div>
              <MenuList
                active={secondary ?? ""}
                items={APP_SECONDARY}
                onPick={(item) => {
                  setSecondary(item)
                  setOpen(false)
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
      <TabBar activeIndex={litIndex} onPick={pickTab} tabs={MENU_TAB_TABS} />
    </div>
  )
}

const SITE_LINKS_MENU = [
  "Product",
  "Customers",
  "Docs",
  "Blog",
  "Changelog",
  "Careers",
  "Contact",
] as const

function LinksPlusMenuPhone() {
  const [active, setActive] = useState("Product")
  const [open, setOpen] = useState(false)

  function pick(item: string) {
    setActive(item)
    setOpen(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-border px-3 py-1.5">
        <span className="font-semibold text-foreground">Atlas</span>
        <button
          aria-current={active === "Pricing" ? "page" : undefined}
          className={cn(
            "ml-auto rounded-md px-1.5 py-1 transition-colors",
            active === "Pricing"
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => pick("Pricing")}
          type="button"
        >
          Pricing
        </button>
        <button
          className="rounded-md bg-primary px-2 py-1 text-primary-foreground"
          onClick={() => pick("Sign in")}
          type="button"
        >
          Sign in
        </button>
        <MenuButton
          label="Site menu"
          onClick={() => setOpen((o) => !o)}
          open={open}
        />
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Page title={active} />
        {open ? (
          <div className="absolute inset-0 overflow-y-auto bg-card">
            <MenuList active={active} items={SITE_LINKS_MENU} onPick={pick} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function MobileNavGallery() {
  return (
    <div className="not-prose my-8 grid gap-6 leading-normal sm:grid-cols-2">
      <PhoneStage
        caption="An app with four destinations: all visible, one tap each."
        label="Bottom bar"
      >
        <BottomBarPhone />
      </PhoneStage>
      <PhoneStage
        caption="A content site with nine sections, where most visits start from search."
        label="☰ menu"
      >
        <MenuPhone />
      </PhoneStage>
      <PhoneStage
        caption="Three daily destinations stay visible; settings, billing, and help sit behind Menu."
        label="Both: tabs plus a Menu tab"
      >
        <TabsPlusMenuPhone />
      </PhoneStage>
      <PhoneStage
        caption="Pricing and Sign in stay visible; the rest of the site is in the menu."
        label="Both: links next to the ☰"
      >
        <LinksPlusMenuPhone />
      </PhoneStage>
    </div>
  )
}
