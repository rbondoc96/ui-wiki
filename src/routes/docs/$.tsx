import { MDXProvider } from "@mdx-js/react"
import { createFileRoute, notFound } from "@tanstack/react-router"

import { PrevNext } from "#/components/layout/prev-next.tsx"
import { TableOfContents } from "#/components/layout/toc.tsx"
import { mdxComponents } from "#/components/mdx-components.tsx"
import { getDoc, prevNext } from "#/lib/docs.ts"

export const Route = createFileRoute("/docs/$")({
  loader: ({ params }) => {
    const slug = params._splat ?? ""
    if (!getDoc(slug)) {
      throw notFound()
    }
    return { slug }
  },
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
        </div>

        <div className="doc-prose">
          <MDXProvider components={mdxComponents}>
            <Component />
          </MDXProvider>
        </div>

        <PrevNext next={next} prev={prev} />
      </article>

      <TableOfContents toc={doc.toc} />
    </main>
  )
}
