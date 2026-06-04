import { useMemo, useState } from "react"
import type { ReactNode } from "react"

const customerOptions = ["Acme Co.", "Ace Supply", "Aster Labs", "Globex"]
const densityOptions = ["Compact", "Comfortable", "Spacious"]
const peopleOptions = ["Riley Chen", "Sam Rivera", "Taylor Kim"]

export function SelectionPatternExamples() {
  const [customer, setCustomer] = useState("Acme Co.")
  const [density, setDensity] = useState("Comfortable")
  const [dropdownOpen, setDropdownOpen] = useState(true)
  const [lastAction, setLastAction] = useState("None yet")
  const [person, setPerson] = useState("Riley Chen")
  const [query, setQuery] = useState("ac")

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return customerOptions
    }
    return customerOptions.filter((option) =>
      option.toLowerCase().includes(normalizedQuery)
    )
  }, [query])

  function runAction(action: string) {
    setDropdownOpen(false)
    setLastAction(action)
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card text-sm shadow-sm">
      <div className="border-b border-border bg-muted/35 px-4 py-3">
        <div className="font-medium text-foreground">
          Same surface, different intent
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Try each control. Selection controls preserve values. The dropdown
          runs commands.
        </div>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-2">
        <section className="bg-card p-4">
          <ExampleHeader
            label="value"
            subtitle="Persistent form value"
            title="Select"
          />

          <label
            className="mb-1.5 block text-xs font-medium text-foreground"
            htmlFor="example-density"
          >
            Table density
          </label>
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            id="example-density"
            name="density"
            value={density}
            onChange={(event) => setDensity(event.target.value)}
          >
            {densityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <StateNote>Selected value: {density}</StateNote>
        </section>

        <section className="bg-card p-4">
          <ExampleHeader
            label="action"
            subtitle="Transient commands"
            title="Dropdown menu"
          />

          <button
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-xs hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            type="button"
            onClick={() => setDropdownOpen((isOpen) => !isOpen)}
          >
            More actions ▾
          </button>
          {dropdownOpen ? (
            <div
              className="mt-2 w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
              role="menu"
            >
              {["Duplicate", "Archive", "Delete"].map((action) => (
                <button
                  className={
                    action === "Delete"
                      ? "block w-full rounded px-2 py-1.5 text-left text-sm text-destructive hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      : "block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  }
                  key={action}
                  role="menuitem"
                  type="button"
                  onClick={() => runAction(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          ) : null}
          <StateNote>Last command: {lastAction}</StateNote>
        </section>

        <section className="bg-card p-4">
          <ExampleHeader
            label="option"
            subtitle="Visible options"
            title="Listbox"
          />

          <div
            aria-label="Assignee"
            className="rounded-md border border-input bg-background p-1"
            role="listbox"
          >
            {peopleOptions.map((option) => {
              const isSelected = option === person
              return (
                <button
                  aria-selected={isSelected}
                  className={
                    isSelected
                      ? "flex w-full items-center justify-between rounded bg-primary px-2.5 py-2 text-left text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      : "flex w-full items-center justify-between rounded px-2.5 py-2 text-left text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  }
                  key={option}
                  role="option"
                  type="button"
                  onClick={() => setPerson(option)}
                >
                  <span>{option}</span>
                  {isSelected ? <span aria-hidden="true">✓</span> : null}
                </button>
              )
            })}
          </div>
          <StateNote>Selected option: {person}</StateNote>
        </section>

        <section className="bg-card p-4">
          <ExampleHeader
            label="search"
            subtitle="Type to find a value"
            title="Combobox"
          />

          <label
            className="mb-1.5 block text-xs font-medium text-foreground"
            htmlFor="example-customer"
          >
            Customer
          </label>
          <input
            aria-autocomplete="list"
            aria-controls="example-customer-options"
            aria-expanded="true"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            id="example-customer"
            role="combobox"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div
            className="mt-2 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
            id="example-customer-options"
            role="listbox"
          >
            {filteredCustomers.length ? (
              filteredCustomers.map((option) => {
                const isSelected = option === customer
                return (
                  <button
                    aria-selected={isSelected}
                    className={
                      isSelected
                        ? "flex w-full items-center justify-between rounded bg-muted px-2.5 py-1.5 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        : "flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    }
                    key={option}
                    role="option"
                    type="button"
                    onClick={() => {
                      setCustomer(option)
                      setQuery(option)
                    }}
                  >
                    <span>{option}</span>
                    {isSelected ? <span aria-hidden="true">✓</span> : null}
                  </button>
                )
              })
            ) : (
              <div className="px-2.5 py-2 text-muted-foreground">
                No customers found.
              </div>
            )}
          </div>
          <StateNote>Selected value: {customer}</StateNote>
        </section>
      </div>
    </div>
  )
}

function ExampleHeader({
  label,
  subtitle,
  title,
}: {
  label: string
  subtitle: string
  title: string
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <div className="font-heading text-base font-semibold text-foreground">
          {title}
        </div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function StateNote({ children }: { children: ReactNode }) {
  return <div className="mt-3 text-xs text-muted-foreground">{children}</div>
}
