import { createFileRoute, redirect } from "@tanstack/react-router"

import { allDocs } from "#/lib/docs.ts"

export const Route = createFileRoute("/docs/")({
  beforeLoad: () => {
    const docs = allDocs()
    if (docs.length > 0) {
      throw redirect({ to: "/docs/$", params: { _splat: docs[0].slug } })
    }
  },
  component: () => null,
})
