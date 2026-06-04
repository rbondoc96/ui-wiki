import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import { AppHeader } from "#/components/layout/app-header.tsx"
import { ThemeProvider, themeInitScript } from "#/lib/theme.tsx"
import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UI/UX Wiki" },
      {
        name: "description",
        content:
          "A personal UI/UX knowledge base for full-stack web developers.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 font-heading text-2xl font-semibold">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3 text-sm">
        <Link
          to="/"
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go home
        </Link>
        <Link
          to="/docs"
          className="rounded-md border px-4 py-2 font-medium transition-colors hover:bg-accent"
        >
          Browse the docs
        </Link>
      </div>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-svh">
        <ThemeProvider>
          <AppHeader />
          {children}
        </ThemeProvider>
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
