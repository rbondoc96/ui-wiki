import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react"

import type { Doc, NavSection } from "#/lib/docs.ts"
import { librariesWithDocs, navTreeFor, sectionDocs } from "#/lib/docs.ts"

export const Route = createFileRoute("/")({ component: Home })

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

function latestUpdate(section: NavSection): string | undefined {
  const dates = sectionDocs(section)
    .map((doc) => doc.updated)
    .filter((d): d is string => Boolean(d))
  if (dates.length === 0) {
    return undefined
  }
  const newest = dates.reduce((a, b) => (a > b ? a : b))
  return dateFormatter.format(new Date(newest))
}

function DocRow({ doc }: { doc: Doc }) {
  return (
    <Link
      to="/docs/$"
      params={{ _splat: doc.slug }}
      className="group flex items-center justify-between gap-2 rounded-md py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <span>{doc.title}</span>
      <ArrowRightIcon className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  )
}

function Home() {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6">
      <section className="mx-auto max-w-3xl py-20 text-center sm:py-28">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <SparkleIcon className="size-3.5 text-primary" weight="fill" />A
          personal UI/UX knowledge base
        </span>
        <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Design patterns, worth remembering.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
          Notes, references, and hard-won lessons on building interfaces — from
          spacing scales to component anatomy. Written by a full-stack dev who
          likes the frontend.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/docs"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse the docs <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl pb-24">
        {librariesWithDocs().map((library) => (
          <section key={library.slug} className="mb-12 last:mb-0">
            <h2 className="mb-4 font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {library.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {navTreeFor(library.slug).map((section) => (
                <div
                  key={section.title}
                  className="rounded-xl border border-border p-6"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-heading text-lg font-semibold">
                      {section.title}
                    </h3>
                    {latestUpdate(section) ? (
                      <span className="text-xs text-muted-foreground">
                        Updated {latestUpdate(section)}
                      </span>
                    ) : null}
                  </div>
                  <ul className="mt-3 flex flex-col gap-1">
                    {section.items.map((doc) => (
                      <li key={doc.slug}>
                        <DocRow doc={doc} />
                      </li>
                    ))}
                  </ul>
                  {section.groups.map((group) => (
                    <div key={group.title} className="mt-4">
                      <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {group.title}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {group.items.map((doc) => (
                          <li key={doc.slug}>
                            <DocRow doc={doc} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
