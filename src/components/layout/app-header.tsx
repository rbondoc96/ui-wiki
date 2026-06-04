import { Dialog } from "@base-ui/react/dialog"
import { Link } from "@tanstack/react-router"
import {
  BookOpenIcon,
  ListIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react"
import { useEffect, useState } from "react"

import { SearchDialog } from "#/components/search-dialog.tsx"
import { SidebarNav } from "#/components/layout/sidebar.tsx"
import { ThemeToggle } from "#/components/theme-toggle.tsx"
import { Button } from "#/components/ui/button.tsx"

export function AppHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Global ⌘K / Ctrl-K to open search.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-1 lg:hidden">
          <Dialog.Root open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <Dialog.Trigger
              render={
                <Button
                  aria-label="Open navigation"
                  size="icon"
                  variant="ghost"
                />
              }
            >
              <ListIcon />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
              <Dialog.Popup className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r bg-background p-6 shadow-xl transition-transform data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full">
                <Dialog.Title className="mb-6 font-heading text-lg font-semibold">
                  UI/UX Wiki
                </Dialog.Title>
                <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <Link to="/" className="flex items-center gap-2">
          <BookOpenIcon className="size-5 text-primary" weight="duotone" />
          <span className="font-heading text-base font-semibold tracking-tight">
            UI/UX Wiki
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
          <Link
            to="/"
            className="transition-colors hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Home
          </Link>
          <Link
            to="/docs"
            className="transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Docs
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-8 items-center gap-2 rounded-md border px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <MagnifyingGlassIcon className="size-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
