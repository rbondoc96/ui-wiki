import { MDXProvider } from "@mdx-js/react"
import { createFileRoute, notFound } from "@tanstack/react-router"

import { PrevNext } from "#/components/layout/prev-next.tsx"
import { TableOfContents } from "#/components/layout/toc.tsx"
import { mdxComponents } from "#/components/mdx-components.tsx"
import { getDoc, prevNext } from "#/lib/docs.ts"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
  year: "numeric",
})

// `reviewed` is authored as a month-precision date (e.g. "2026-06") but may also
// be a free-form label. Format parseable dates as "June 2026"; otherwise show
// the raw value so odd inputs never crash the page.
function formatReviewed(reviewed: string): string {
  const parsed = new Date(reviewed)
  return Number.isNaN(parsed.getTime())
    ? reviewed
    : monthYearFormatter.format(parsed)
}

export const Route = createFileRoute("/docs/$")({
  loader: ({ params }) => {
    const slug = params._splat ?? ""
    const doc = getDoc(slug)
    if (!doc) {
      throw notFound()
    }
    return { description: doc.description, slug, title: doc.title }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · UI/UX Wiki` },
          ...(loaderData.description
            ? [{ name: "description", content: loaderData.description }]
            : []),
        ]
      : [],
  }),
  component: DocPage,
})

function DocPage() {
  const { slug } = Route.useLoaderData()
  const doc = getDoc(slug)!
  const { next, prev } = prevNext(slug)
  const { Component } = doc

  return (
    <main className="flex min-w-0 flex-1 justify-center gap-8 px-0 py-8 lg:px-8">
      <article className="min-w-0 flex-1 lg:max-w-3xl">
        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-primary">{doc.section}</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            {doc.title}
          </h1>
          {doc.description ? (
            <p className="mt-2 text-base text-muted-foreground">
              {doc.description}
            </p>
          ) : null}
          {(doc.appliesTo ?? doc.reviewed) ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
              {doc.appliesTo ? (
                <span>
                  Applies to{" "}
                  <span className="font-medium text-foreground">
                    {doc.appliesTo}
                  </span>
                </span>
              ) : null}
              {doc.appliesTo && doc.reviewed ? <span>·</span> : null}
              {doc.reviewed ? (
                <span>reviewed {formatReviewed(doc.reviewed)}</span>
              ) : null}
            </p>
          ) : null}
        </div>

        <div className="doc-prose">
          <MDXProvider components={mdxComponents}>
            <Component />
          </MDXProvider>
        </div>

        {doc.updated ? (
          <p className="mt-10 text-xs text-muted-foreground">
            Last updated on {dateFormatter.format(new Date(doc.updated))}
          </p>
        ) : null}

        <PrevNext next={next} prev={prev} />
      </article>

      <TableOfContents toc={doc.toc} />
    </main>
  )
}
