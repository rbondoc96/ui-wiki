import { Outlet, createFileRoute } from "@tanstack/react-router"

import { DesktopSidebar } from "#/components/layout/sidebar.tsx"

export const Route = createFileRoute("/docs")({ component: DocsLayout })

function DocsLayout() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl px-4 sm:px-6">
      <DesktopSidebar />
      <Outlet />
    </div>
  )
}
