import { createFileRoute, redirect } from "@tanstack/react-router"

import { LIBRARIES, firstDocSlug } from "#/lib/docs.ts"

export const Route = createFileRoute("/docs/")({
  beforeLoad: () => {
    const slug = firstDocSlug(LIBRARIES[0].slug)
    if (slug) {
      throw redirect({ to: "/docs/$", params: { _splat: slug } })
    }
  },
  component: () => null,
})
